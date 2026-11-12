#!/usr/bin/env python3
"""
C.R.E.A.M. - Community Renewable Energy Awareness and Management Portal
Production & Development Server (Python 3 Standard Library)
Serves RESTful API routes under /api and React SPA static assets.
"""

import os
import sys
import json
import urllib.parse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.database import init_db
from backend.router import handle_api_request

PORT = int(os.environ.get("PORT", 8000))
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

class CreamHTTPRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def _send_json_response(self, status_code: int, data: dict):
        body = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # Native Audio TTS Stream Endpoint
        if path == "/api/tools/tts":
            query = urllib.parse.parse_qs(parsed.query)
            text = query.get("text", [""])[0].strip()
            lang = query.get("lang", ["en"])[0].strip()
            if not text:
                self._send_json_response(422, {"detail": "Text parameter is required"})
                return

            try:
                # Use standard Google Translate TTS for 100% authentic native regional pronunciation
                encoded_text = urllib.parse.quote(text[:250])  # Clean 250 character chunk
                tts_url = f"https://translate.google.com/translate_tts?ie=UTF-8&q={encoded_text}&tl={lang}&client=tw-ob"
                req = urllib.request.Request(tts_url, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"})
                with urllib.request.urlopen(req, timeout=8) as resp:
                    audio_bytes = resp.read()
                    self.send_response(200)
                    self.send_header("Content-Type", "audio/mpeg")
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.send_header("Content-Length", str(len(audio_bytes)))
                    self.end_headers()
                    self.wfile.write(audio_bytes)
                    return
            except Exception as e:
                self._send_json_response(500, {"detail": f"TTS generation error: {str(e)}"})
                return

        if path.startswith("/api/"):
            query = urllib.parse.parse_qs(parsed.query)
            headers = dict(self.headers)
            status, res = handle_api_request("GET", path, query, {}, headers)
            self._send_json_response(status, res)
            return

        # Fallback to SPA routing if file does not exist on disk
        local_path = os.path.join(STATIC_DIR, path.lstrip("/"))
        if not os.path.exists(local_path) or os.path.isdir(local_path):
            self.path = "/index.html"
        super().do_GET()

    def do_POST(self):
        self._handle_body_request("POST")

    def do_PUT(self):
        self._handle_body_request("PUT")

    def do_PATCH(self):
        self._handle_body_request("PATCH")

    def do_DELETE(self):
        self._handle_body_request("DELETE")

    def _handle_body_request(self, method: str):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if not path.startswith("/api/"):
            self.send_error(404, "Endpoint not found")
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = {}
        if content_length > 0:
            try:
                raw_body = self.rfile.read(content_length).decode("utf-8")
                body = json.loads(raw_body) if raw_body else {}
            except Exception:
                self._send_json_response(400, {"detail": "Invalid JSON body"})
                return

        query = urllib.parse.parse_qs(parsed.query)
        headers = dict(self.headers)
        status, res = handle_api_request(method, path, query, body, headers)
        self._send_json_response(status, res)

if __name__ == "__main__":
    init_db()
    print(f"C.R.E.A.M. Backend Server running on http://localhost:{PORT}")
    httpd = ThreadingHTTPServer(("0.0.0.0", PORT), CreamHTTPRequestHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

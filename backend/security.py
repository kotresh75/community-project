"""
Security & Token Helpers for C.R.E.A.M.
Pure Python standard library implementation (hashlib, hmac, base64, secrets, time)
Zero external binary dependencies. Compatible with standard Bearer JWT structure.
"""

import os
import time
import json
import base64
import hmac
import hashlib
import secrets

SECRET_KEY = os.environ.get("CREAM_SECRET_KEY", "cream-vtu-community-renewable-energy-secret-2025")
TOKEN_EXPIRY_SECONDS = 86400 * 7  # 7 days

def hash_password(password: str) -> str:
    """Hashes a password using PBKDF2-HMAC-SHA256 with a random salt."""
    salt = secrets.token_bytes(16)
    kdf = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
    return base64.b64encode(salt + kdf).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored PBKDF2 hash."""
    try:
        raw = base64.b64decode(hashed_password.encode("utf-8"))
        salt = raw[:16]
        expected_kdf = raw[16:]
        actual_kdf = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt, 100000)
        return hmac.compare_digest(expected_kdf, actual_kdf)
    except Exception:
        return False

def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")

def _b64url_decode(data: str) -> bytes:
    pad = 4 - (len(data) % 4)
    if pad < 4:
        data += "=" * pad
    return base64.urlsafe_b64decode(data.encode("utf-8"))

def create_jwt_token(payload: dict) -> str:
    """Creates a signed JWT token."""
    header = {"alg": "HS256", "typ": "JWT"}
    header_bytes = json.dumps(header, separators=(",", ":")).encode("utf-8")
    
    payload_copy = dict(payload)
    if "exp" not in payload_copy:
        payload_copy["exp"] = int(time.time()) + TOKEN_EXPIRY_SECONDS
    if "iat" not in payload_copy:
        payload_copy["iat"] = int(time.time())
        
    payload_bytes = json.dumps(payload_copy, separators=(",", ":")).encode("utf-8")
    
    header_b64 = _b64url_encode(header_bytes)
    payload_b64 = _b64url_encode(payload_bytes)
    
    signature_base = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(SECRET_KEY.encode("utf-8"), signature_base, hashlib.sha256).digest()
    sig_b64 = _b64url_encode(signature)
    
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def verify_jwt_token(token: str) -> dict:
    """Verifies and decodes a signed JWT token. Returns dict or raises ValueError."""
    parts = token.split(".")
    if len(parts) != 3:
        raise ValueError("Invalid JWT format")
        
    header_b64, payload_b64, sig_b64 = parts
    signature_base = f"{header_b64}.{payload_b64}".encode("utf-8")
    expected_sig = hmac.new(SECRET_KEY.encode("utf-8"), signature_base, hashlib.sha256).digest()
    actual_sig = _b64url_decode(sig_b64)
    
    if not hmac.compare_digest(expected_sig, actual_sig):
        raise ValueError("Invalid signature")
        
    payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
    if "exp" in payload and payload["exp"] < time.time():
        raise ValueError("Token expired")
        
    return payload


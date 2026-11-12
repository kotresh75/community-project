"""
REST API Router and Controller for C.R.E.A.M. Portal
Pure Python standard library implementation.
Zero external server dependencies. Serves complete RESTful API contract.
"""

import json
import re
import urllib.parse
from datetime import datetime
from backend.database import get_db, init_db
from backend.security import hash_password, verify_password, create_jwt_token, verify_jwt_token
from backend.ai_advisor import query_ai_advisor

VALID_PRACTICE_KEYS = {
    "solar_rooftop_audit",
    "led_lighting_retrofit",
    "bldc_fan_transition",
    "solar_water_heater",
    "community_biogas_segregation",
    "peak_load_staggering"
}

PRACTICE_METADATA = {
    "solar_rooftop_audit": {"category": "solar", "title": "Rooftop Solar Feasibility Assessment"},
    "led_lighting_retrofit": {"category": "conservation", "title": "100% LED Household Lighting Shift"},
    "bldc_fan_transition": {"category": "conservation", "title": "Energy-Efficient 28W BLDC Fans Transition"},
    "solar_water_heater": {"category": "solar", "title": "Solar Thermal Water Heating Setup"},
    "community_biogas_segregation": {"category": "biogas", "title": "Household Wet-Waste Segregation for Biogas"},
    "peak_load_staggering": {"category": "conservation", "title": "Staggering Heavy Appliance Run to Off-Peak Hours"}
}

GRID_EMISSION_FACTOR = 0.82  # kg CO2 / kWh (Central Electricity Authority CEA baseline)

def get_auth_user(headers):
    """Extracts and verifies Bearer token from headers. Returns user dict or None."""
    auth_header = headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header[7:].strip()
    try:
        payload = verify_jwt_token(token)
        user_id = payload.get("sub")
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, name, email, role, preferred_lang, community_area, created_at FROM users WHERE id = ?", (user_id,))
        user = cur.fetchone()
        conn.close()
        if user:
            return dict(user)
        return None
    except Exception:
        return None

def handle_api_request(method: str, path: str, query: dict, body: dict, headers: dict):
    """Dispatches API requests according to the REST API contract."""
    init_db()

    # --- Health Check ---
    if method == "GET" and path == "/api/health":
        return 200, {"status": "ok", "timestamp": datetime.utcnow().isoformat(), "database": "connected"}

    # --- Auth: Register ---
    if method == "POST" and path == "/api/auth/register":
        name = body.get("name", "").strip()
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        preferred_lang = body.get("preferred_lang", "en").strip()
        community_area = body.get("community_area", "Bangalore North").strip()

        if not name or not email or len(password) < 6:
            return 422, {"detail": "Name, valid email, and minimum 6-character password are required"}

        conn = get_db()
        cur = conn.cursor()
        try:
            pwd_hash = hash_password(password)
            cur.execute("""
                INSERT INTO users (name, email, password_hash, role, preferred_lang, community_area)
                VALUES (?, ?, ?, 'member', ?, ?)
            """, (name, email, pwd_hash, preferred_lang, community_area))
            user_id = cur.lastrowid
            conn.commit()
            
            token = create_jwt_token({"sub": user_id, "role": "member", "email": email})
            return 201, {
                "access_token": token,
                "token_type": "bearer",
                "user": {
                    "id": user_id,
                    "name": name,
                    "email": email,
                    "role": "member",
                    "preferred_lang": preferred_lang,
                    "community_area": community_area
                }
            }
        except Exception as e:
            if "UNIQUE constraint failed" in str(e):
                return 409, {"detail": "An account with this email address already exists"}
            return 500, {"detail": f"Database error: {str(e)}"}
        finally:
            conn.close()

    # --- Auth: Login ---
    if method == "POST" and path == "/api/auth/login":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, name, email, password_hash, role, preferred_lang, community_area FROM users WHERE email = ?", (email,))
        user = cur.fetchone()
        conn.close()

        if not user or not verify_password(password, user["password_hash"]):
            return 401, {"detail": "Invalid email or password"}

        token = create_jwt_token({"sub": user["id"], "role": user["role"], "email": user["email"]})
        return 200, {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "preferred_lang": user["preferred_lang"],
                "community_area": user["community_area"]
            }
        }

    # --- Auth: Me ---
    if method == "GET" and path == "/api/auth/me":
        user = get_auth_user(headers)
        if not user:
            return 401, {"detail": "Authentication required"}
        return 200, user

    # --- Auth: Update Language ---
    if method == "PATCH" and path == "/api/auth/me/language":
        user = get_auth_user(headers)
        if not user:
            return 401, {"detail": "Authentication required"}
        lang = body.get("preferred_lang", "").strip()
        if not lang or len(lang) > 5:
            return 422, {"detail": "Invalid language code"}
            
        conn = get_db()
        cur = conn.cursor()
        cur.execute("UPDATE users SET preferred_lang = ? WHERE id = ?", (lang, user["id"]))
        conn.commit()
        conn.close()
        return 200, {"status": "updated", "preferred_lang": lang}

    # --- Community: Impact Summary (Live SQL COUNT(*) aggregations) ---
    if method == "GET" and path == "/api/community/impact-summary":
        conn = get_db()
        cur = conn.cursor()
        
        cur.execute("SELECT COUNT(*) AS count FROM users WHERE role IN ('member', 'coordinator')")
        total_members = cur.fetchone()["count"]
        
        cur.execute("SELECT COUNT(*) AS count FROM checklist_progress WHERE completed = 1")
        habits_adopted = cur.fetchone()["count"]
        
        cur.execute("SELECT COUNT(*) AS count FROM pledges")
        total_pledges = cur.fetchone()["count"]
        
        cur.execute("SELECT COUNT(*) AS count FROM community_drives WHERE status = 'upcoming'")
        upcoming_drives = cur.fetchone()["count"]
        
        conn.close()
        return 200, {
            "total_members": total_members,
            "habits_adopted": habits_adopted,
            "total_pledges": total_pledges,
            "upcoming_drives": upcoming_drives,
            "formula_basis": "Live SQL COUNT(*) on authentic user records with 0 synthetic rows"
        }

    # --- Tools: Estimate Practice Impact (Stateless Calculator) ---
    if method == "POST" and path == "/api/tools/estimate-practice-impact":
        try:
            old_watts = float(body.get("old_watts", 0))
            new_watts = float(body.get("new_watts", 0))
            quantity = int(body.get("quantity", 1))
            hours_per_day = float(body.get("hours_per_day", 0))
            days_per_month = int(body.get("days_per_month", 30))
            tariff_per_kwh = float(body.get("tariff_per_kwh", 7.0))
        except (ValueError, TypeError):
            return 422, {"detail": "Invalid numerical parameters supplied"}

        if old_watts <= 0 or new_watts < 0 or new_watts >= old_watts:
            return 422, {"detail": "old_watts must be greater than new_watts and greater than 0"}
        if quantity < 1 or hours_per_day <= 0 or hours_per_day > 24 or days_per_month < 1 or days_per_month > 31 or tariff_per_kwh <= 0:
            return 422, {"detail": "Invalid operational bounds for hours, quantity, days, or tariff"}

        watts_saved = old_watts - new_watts
        monthly_kwh_saved = round((watts_saved * quantity * hours_per_day * days_per_month) / 1000.0, 2)
        monthly_cost_saved = round(monthly_kwh_saved * tariff_per_kwh, 2)
        annual_kwh_saved = round(monthly_kwh_saved * 12.0, 2)
        annual_cost_saved = round(monthly_cost_saved * 12.0, 2)
        annual_co2_avoided_kg = round(annual_kwh_saved * GRID_EMISSION_FACTOR, 2)

        return 200, {
            "monthly_kwh_saved": monthly_kwh_saved,
            "monthly_cost_saved": monthly_cost_saved,
            "annual_kwh_saved": annual_kwh_saved,
            "annual_cost_saved": annual_cost_saved,
            "annual_co2_avoided_kg": annual_co2_avoided_kg,
            "grid_emission_factor": GRID_EMISSION_FACTOR
        }

    # --- AI Civic Advisor Query Endpoint ---
    if method == "POST" and path == "/api/tools/ai-advisor":
        query_text = body.get("query", "").strip()
        lang = body.get("lang", "en").strip()
        if not query_text:
            return 422, {"detail": "Query string is required"}
        advisor_res = query_ai_advisor(query_text, lang)
        return 200, advisor_res

    # --- Practices: Checklist ---
    if path.startswith("/api/practices/checklist"):
        user = get_auth_user(headers)
        if not user:
            return 401, {"detail": "Authentication required"}

        if method == "GET" and path == "/api/practices/checklist":
            conn = get_db()
            cur = conn.cursor()
            cur.execute("SELECT practice_key, completed, updated_at FROM checklist_progress WHERE user_id = ?", (user["id"],))
            rows = [dict(r) for r in cur.fetchall()]
            conn.close()
            return 200, {"items": rows}

        if method == "PUT" and path.startswith("/api/practices/checklist/"):
            practice_key = path.split("/api/practices/checklist/")[1].strip()
            if practice_key not in VALID_PRACTICE_KEYS:
                return 422, {"detail": f"Unknown practice_key. Allowed: {sorted(list(VALID_PRACTICE_KEYS))}"}
            completed = bool(body.get("completed", True))

            conn = get_db()
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO checklist_progress (user_id, practice_key, completed, updated_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(user_id, practice_key) DO UPDATE SET
                    completed = excluded.completed,
                    updated_at = CURRENT_TIMESTAMP
            """, (user["id"], practice_key, 1 if completed else 0))
            conn.commit()
            conn.close()
            return 200, {"status": "saved", "practice_key": practice_key, "completed": completed}

    # --- Practices: Pledges ---
    if path == "/api/practices/pledges" or path.startswith("/api/practices/pledges/"):
        user = get_auth_user(headers)
        if not user:
            return 401, {"detail": "Authentication required"}

        if method == "GET" and path == "/api/practices/pledges":
            conn = get_db()
            cur = conn.cursor()
            cur.execute("SELECT id, practice_key, title, category, status, notes, created_at FROM pledges WHERE user_id = ? ORDER BY id DESC", (user["id"],))
            rows = [dict(r) for r in cur.fetchall()]
            conn.close()
            return 200, {"pledges": rows}

        if method == "POST" and path == "/api/practices/pledges":
            practice_key = body.get("practice_key", "custom")
            title = body.get("title", "").strip()
            category = body.get("category", "solar")
            notes = body.get("notes", "")

            if not title:
                return 422, {"detail": "Pledge title is required"}
            if category not in ('solar', 'biogas', 'conservation', 'other'):
                category = 'other'

            conn = get_db()
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO pledges (user_id, practice_key, title, category, status, notes)
                VALUES (?, ?, ?, ?, 'planned', ?)
            """, (user["id"], practice_key, title, category, notes))
            pledge_id = cur.lastrowid
            conn.commit()
            conn.close()
            return 201, {"id": pledge_id, "title": title, "status": "planned"}

    # --- Community: Drives ---
    if path == "/api/community/drives" or path.startswith("/api/community/drives/"):
        user = get_auth_user(headers)

        if method == "GET" and path == "/api/community/drives":
            conn = get_db()
            cur = conn.cursor()
            cur.execute("""
                SELECT d.*, u.name AS coordinator_name,
                    (SELECT COUNT(*) FROM drive_registrations r WHERE r.drive_id = d.id) AS attendee_count
                FROM community_drives d
                JOIN users u ON d.created_by = u.id
                ORDER BY d.drive_date ASC
            """)
            drives = [dict(r) for r in cur.fetchall()]

            # Annotate if current user joined
            if user:
                cur.execute("SELECT drive_id FROM drive_registrations WHERE user_id = ?", (user["id"],))
                joined_set = {r["drive_id"] for r in cur.fetchall()}
                for d in drives:
                    d["joined"] = d["id"] in joined_set
            else:
                for d in drives:
                    d["joined"] = False

            conn.close()
            return 200, {"drives": drives}

        # Coordinator: Create Drive
        if method == "POST" and path == "/api/community/drives":
            if not user:
                return 401, {"detail": "Authentication required"}
            if user["role"] != "coordinator":
                return 403, {"detail": "Forbidden: Only Coordinators can schedule community drives"}

            title = body.get("title", "").strip()
            description = body.get("description", "").strip()
            location = body.get("location", "").strip()
            drive_date = body.get("drive_date", "").strip()
            drive_time = body.get("drive_time", "").strip()

            if not (title and description and location and drive_date and drive_time):
                return 422, {"detail": "All drive fields (title, description, location, date, time) are required"}

            conn = get_db()
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO community_drives (created_by, title, description, location, drive_date, drive_time, status)
                VALUES (?, ?, ?, ?, ?, ?, 'upcoming')
            """, (user["id"], title, description, location, drive_date, drive_time))
            drive_id = cur.lastrowid
            conn.commit()
            conn.close()
            return 201, {"id": drive_id, "title": title, "status": "upcoming"}

        # Member: Join Drive
        join_match = re.match(r"^/api/community/drives/(\d+)/join$", path)
        if join_match:
            if not user:
                return 401, {"detail": "Authentication required"}
            drive_id = int(join_match.group(1))

            conn = get_db()
            cur = conn.cursor()
            cur.execute("SELECT id, status FROM community_drives WHERE id = ?", (drive_id,))
            drive = cur.fetchone()
            if not drive:
                conn.close()
                return 404, {"detail": "Drive not found"}
            if drive["status"] != "upcoming":
                conn.close()
                return 400, {"detail": "Cannot register for a completed or cancelled drive"}

            if method == "POST":
                try:
                    cur.execute("INSERT INTO drive_registrations (drive_id, user_id) VALUES (?, ?)", (drive_id, user["id"]))
                    conn.commit()
                    return 201, {"status": "joined", "drive_id": drive_id}
                except Exception as e:
                    if "UNIQUE" in str(e):
                        return 200, {"status": "already_joined", "drive_id": drive_id}
                    return 500, {"detail": str(e)}
                finally:
                    conn.close()

            if method == "DELETE":
                cur.execute("DELETE FROM drive_registrations WHERE drive_id = ? AND user_id = ?", (drive_id, user["id"]))
                conn.commit()
                conn.close()
                return 200, {"status": "left", "drive_id": drive_id}

    # --- Community: Notices ---
    if path == "/api/community/notices" or path.startswith("/api/community/notices/"):
        user = get_auth_user(headers)

        if method == "GET" and path == "/api/community/notices":
            conn = get_db()
            cur = conn.cursor()
            cur.execute("""
                SELECT n.*, u.name AS author_name
                FROM community_notices n
                JOIN users u ON n.created_by = u.id
                ORDER BY n.created_at DESC
            """)
            notices = [dict(r) for r in cur.fetchall()]
            conn.close()
            return 200, {"notices": notices}

        if method == "POST" and path == "/api/community/notices":
            if not user:
                return 401, {"detail": "Authentication required"}
            if user["role"] != "coordinator":
                return 403, {"detail": "Forbidden: Only Coordinators can publish community notices"}

            title = body.get("title", "").strip()
            content = body.get("content", "").strip()
            category = body.get("category", "announcement")

            if not title or not content:
                return 422, {"detail": "Notice title and content are required"}
            if category not in ('announcement', 'subsidy_alert', 'maintenance', 'drive_update'):
                category = 'announcement'

            conn = get_db()
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO community_notices (created_by, title, content, category)
                VALUES (?, ?, ?, ?)
            """, (user["id"], title, content, category))
            notice_id = cur.lastrowid
            conn.commit()
            conn.close()
            return 201, {"id": notice_id, "title": title}

    return 404, {"detail": f"Route {method} {path} not found"}


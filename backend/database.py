"""
Database Schema & Initialization for C.R.E.A.M. Portal
SQLite3 with PRAGMA foreign_keys = ON and zero dummy data policy.
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "cream.db")

SCHEMA_SQL = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK(role IN ('visitor', 'member', 'coordinator')),
    preferred_lang TEXT NOT NULL DEFAULT 'en',
    community_area TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS checklist_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    practice_key TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, practice_key)
);

CREATE TABLE IF NOT EXISTS pledges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    practice_key TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('solar', 'biogas', 'conservation', 'other')),
    status TEXT NOT NULL DEFAULT 'planned' CHECK(status IN ('planned', 'in_progress', 'adopted')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_drives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    drive_date DATE NOT NULL,
    drive_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK(status IN ('upcoming', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drive_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drive_id INTEGER NOT NULL REFERENCES community_drives(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(drive_id, user_id)
);

CREATE TABLE IF NOT EXISTS community_notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('announcement', 'subsidy_alert', 'maintenance', 'drive_update')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_checklist_user ON checklist_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_pledges_user ON pledges(user_id);
CREATE INDEX IF NOT EXISTS idx_drives_date ON community_drives(drive_date);
CREATE INDEX IF NOT EXISTS idx_drives_status ON community_drives(status);
CREATE INDEX IF NOT EXISTS idx_notices_created ON community_notices(created_at DESC);
"""

def get_db(db_path=None):
    path = db_path or DB_PATH
    os.makedirs(os.path.dirname(path), exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db(db_path=None):
    conn = get_db(db_path)
    with conn:
        conn.executescript(SCHEMA_SQL)
    conn.close()

if __name__ == "__main__":
    init_db()
    print(f"Database initialized successfully at {DB_PATH}")


#!/usr/bin/env python3
"""
Administrative CLI Tool for C.R.E.A.M.
Used to promote active Community Members to Coordinator.
Strict zero-backdoor policy: Requires email of an existing verified registered user.
"""

import sys
from backend.database import get_db, init_db

def promote_coordinator(email: str):
    init_db()
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, name, email, role FROM users WHERE email = ?", (email,))
    user = cur.fetchone()
    
    if not user:
        print(f"Error: User with email '{email}' does not exist.")
        sys.exit(1)
        
    if user["role"] == "coordinator":
        print(f"Notice: User '{user['name']}' ({user['email']}) is already a Coordinator.")
        return
        
    cur.execute("UPDATE users SET role = 'coordinator' WHERE id = ?", (user["id"],))
    conn.commit()
    conn.close()
    print(f"SUCCESS: User '{user['name']}' ({user['email']}) has been promoted to Coordinator.")

def list_users():
    init_db()
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, name, email, role, community_area, created_at FROM users ORDER BY id ASC")
    rows = cur.fetchall()
    conn.close()
    
    if not rows:
        print("No registered users found in database.")
        return
        
    print(f"{'ID':<4} | {'Name':<20} | {'Email':<25} | {'Role':<12} | {'Area':<15}")
    print("-" * 85)
    for r in rows:
        print(f"{r['id']:<4} | {r['name']:<20} | {r['email']:<25} | {r['role']:<12} | {r['community_area']:<15}")

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python cli.py promote-coordinator <user_email>")
        print("  python cli.py list-users")
        sys.exit(1)
        
    cmd = sys.argv[1]
    if cmd == "promote-coordinator":
        if len(sys.argv) < 3:
            print("Error: Missing email argument.")
            print("Usage: python cli.py promote-coordinator <user_email>")
            sys.exit(1)
        promote_coordinator(sys.argv[2])
    elif cmd == "list-users":
        list_users()
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)

if __name__ == "__main__":
    main()


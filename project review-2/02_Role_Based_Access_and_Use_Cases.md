---
title: "Chapter 2: Role-Based Access & Use Case Design"
mainfont: "Times New Roman"
fontfamily: "Times New Roman"
fontsize: 12pt
---

<style>
body, .markdown-body, h1, h2, h3, h4, p, li, td, th {
  font-family: "Times New Roman", Times, serif;
}
pre, code {
  font-family: "Courier New", Courier, monospace;
}
</style>

# Chapter 2: Role-Based Access & Use Case Design

**Project Title:** Community Renewable Energy Awareness and Management Portal  
**Course Code:** VTU 1BCP308 — Community / Societal Project  

---

## 2.1 Use Case Diagram

```mermaid
flowchart LR
    Visitor(["Public Visitor"]) --> A1["Read Guides and Switch Language"]
    Visitor --> A2["View Drives and Use Impact Helper"]

    Member(["Community Member"]) --> B1["Save Checklists and Pledges"]
    Member --> B2["Join Awareness Drives"]

    Coord(["Coordinator"]) --> C1["Create Drives and Post Notices"]
    Coord --> C2["Manage Participation and Roles"]
```

---

## 2.2 Role & Security Rules

| Role | How Assigned | What They Can Do | Restricted From |
| :--- | :--- | :--- | :--- |
| **Public Visitor** | Open access (no login) | Read guides, switch language, view drives, use Impact Helper | Saving pledges, joining drives, creating drives |
| **Community Member** | Public sign-up (`member` role) | All Visitor features + save checklists/pledges & join drives | Creating drives, posting notices, promoting users |
| **Coordinator** | Admin CLI or Coordinator promotion | All Member features + create drives, post notices, promote members | Hardcoded admin logins (disabled by design) |

---

## 2.3 Auth & Coordinator Bootstrap Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Citizen / User
    participant UI as Web Frontend (React)
    participant API as Backend API (FastAPI)
    participant DB as SQLite Database
    actor Admin as System Admin

    Note over User,DB: Step 1: Member Registration & JWT Authentication
    User->>UI: Submit Sign-Up (Name, Email, Password)
    UI->>API: POST /api/auth/register
    API->>API: Hash password (bcrypt)
    API->>DB: INSERT user (default role = 'member')
    DB-->>API: User record stored
    API-->>UI: Return JWT Token (role: 'member')
    UI-->>User: Access Member Dashboard (Checklists & Pledges)

    Note over Admin,DB: Step 2: Secure Coordinator Promotion (Bootstrap)
    Admin->>API: Run CLI: python cli.py promote-coordinator <email>
    API->>DB: UPDATE users SET role = 'coordinator' WHERE email = ...
    DB-->>API: Role updated successfully

    Note over User,UI: Step 3: Coordinator Access & Verification
    User->>UI: Sign in with credentials
    UI->>API: POST /api/auth/login
    API-->>UI: Return JWT Token (role: 'coordinator')
    UI-->>User: Unlock Coordinator Console (Create Drives & Publish Notices)
```

**Key Security Design Principles:**
- **Zero Default Passwords:** The system avoids insecure hardcoded admin accounts (such as `admin/admin`). All public registrations are assigned the `member` role by default.
- **Controlled Promotion:** Trusted community volunteers are promoted to `coordinator` through the administrative CLI or by an active Coordinator.
- **Stateless Bearer JWT:** User roles are cryptographically signed within the JSON Web Token (`Authorization: Bearer <jwt>`), ensuring instantaneous, tamper-proof role verification on every API call.


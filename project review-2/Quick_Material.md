---
title: "Project Review 2 — Quick Reference Material & Command Cheat Sheet"
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

# Project Review 2 — Quick Reference Material

**Project Title:** Community Renewable Energy Awareness and Management Portal  
**VTU Course Code:** `1BCP308` — Community / Societal Project (Scheme 2025, Semester 3)  
**Assigned Topic:** Topic #40 (`PO 6` | `SDGs 7, 11, 15`)  
**Evaluation Review:** Review 2 (System Design, Development Process & Progress)  

---

## 1. Quick Links

### Live Design & Prototype Links
* **Figma Design File (Live UI Wireframe Layer):** [Community Renewable Energy Portal - UI Wireframes](https://www.figma.com/design/tJCoLQywqRkmGhJosvMPWk)
* **FigJam Screen Flow Board:** [Screen Flow and Wireframes Board](https://www.figma.com/board/hRco5CNgIcarJlOkqXzxPy)
* **Local Interactive Wireframes Canvas:** [wireframes/index.html](file:///home/kotresh/Code/Community%20Project/project%20review-2/wireframes/index.html) *(Open in any browser)*
* **Review 1 PPT Presentation:** [Community_Renewable_Energy_Portal_PPT.pptx](file:///home/kotresh/Code/Community%20Project/project%20review-1/Community_Renewable_Energy_Portal_PPT.pptx)

### Review 2 Chapter Documents
* **Master System Design Document:** [System_Design_and_Development_Document.md](file:///home/kotresh/Code/Community%20Project/project%20review-2/System_Design_and_Development_Document.md)
* **Chapter 1:** [01_System_Architecture.md](file:///home/kotresh/Code/Community%20Project/project%20review-2/01_System_Architecture.md) *(3-Tier Architecture & Tech Stack)*
* **Chapter 2:** [02_Role_Based_Access_and_Use_Cases.md](file:///home/kotresh/Code/Community%20Project/project%20review-2/02_Role_Based_Access_and_Use_Cases.md) *(Use Case Diagram, Roles, Auth Flow)*
* **Chapter 3:** [03_Database_Design.md](file:///home/kotresh/Code/Community%20Project/project%20review-2/03_Database_Design.md) *(ER Diagram, 6 Normalized Tables & Aggregations)*
* **Chapter 4:** [04_Data_Flow_and_API_Contracts.md](file:///home/kotresh/Code/Community%20Project/project%20review-2/04_Data_Flow_and_API_Contracts.md) *(Level-1 DFD, REST APIs & Physics Formulas)*
* **Chapter 5:** [05_UI_UX_Design_and_Wireframes.md](file:///home/kotresh/Code/Community%20Project/project%20review-2/05_UI_UX_Design_and_Wireframes.md) *(Figma Wireframes & Screen Navigation Map)*
* **Chapter 6:** [06_Development_Process_and_Progress.md](file:///home/kotresh/Code/Community%20Project/project%20review-2/06_Development_Process_and_Progress.md) *(Engineering Lifecycle & 60% Progress Matrix)*

---

## 2. Essential Terminal Commands

### A. Run Development Servers
```bash
# 1. Start Python Backend Server (Port 8000)
cd "app" && python3 server.py

# 2. Start Frontend React Dev Server (Port 5173 with proxy to 8000)
cd "frontend" && npm run dev

# 3. Test Backend Health Check Endpoint
curl http://localhost:8000/api/health
```

### B. Administrative CLI Commands
```bash
# Promote an active Community Member to Coordinator (No default admin backdoor)
python cli.py promote-coordinator veerkotresh@gmail.com
```

### C. Automated Testing & Verification
```bash
# Run backend pytest suite (Auth, RBAC, Database constraints)
pytest backend/tests/ -v

# Run frontend build check
cd "frontend" && npm run build
```

---

## 3. REST API Endpoints Quick Reference

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/health` | Public | Connectivity & health status verification |
| `POST` | `/api/auth/register` | Public | Register new member account (`member` role) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return signed Bearer JWT |
| `GET` | `/api/auth/me` | Member+ | Fetch current authenticated user profile |
| `GET` | `/api/community/impact-summary` | Public | Live SQL `COUNT(*)` community metrics |
| `GET` | `/api/community/drives` | Public | List upcoming awareness drives & attendee counts |
| `POST` | `/api/community/drives` | Coordinator | Schedule a new community drive |
| `POST` | `/api/community/drives/{id}/join` | Member+ | Join awareness drive (1 registration per user) |
| `GET` | `/api/practices/checklist` | Member+ | Fetch user's saved household readiness habits |
| `PUT` | `/api/practices/checklist/{key}` | Member+ | `UPSERT` practice checklist completion state |
| `POST` | `/api/tools/estimate-practice-impact` | Public | Stateless appliance savings calculation |

---

## 4. Overall Project Progress Summary

$$\text{Project Development Progress} = \mathbf{60.0\%}$$

* **Stage 1 (Architecture & Schema Design):** **100.0%**
* **Stage 2 (Scaffolding & Base Connectivity):** **100.0%**
* **Stage 3 (Public Awareness & i18n Engine):** **75.0%**
* **Stage 4 (Member & Community Management):** **25.0%**
* **Stage 5 (Integration & Quality Assurance):** **0.0%** *(Planned)*
* **Whole Project Completion:** **60.0%**



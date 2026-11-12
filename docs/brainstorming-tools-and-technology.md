# Topic #40: Tools and Technology (Finalized)

> **Status:** Tools and Technology Finalized (Ready for Review)  
> **Previous Sections:** [brainstorming-introduction.md](brainstorming-introduction.md) | [brainstorming-literature-survey.md](brainstorming-literature-survey.md) | [brainstorming-objectives.md](brainstorming-objectives.md)  
> **Finalized Stack:** **FastAPI (Python) + React (Vite) + SQLite**  
> **Data Integrity Rule:** [.agents/rules/no-dummy-data.md](../.agents/rules/no-dummy-data.md)

---

## 1. Architectural Choice Summary

The portal uses a **decoupled client–server architecture**:
- **Frontend:** Mobile-first **React** web application (built with **Vite** and styled with **Tailwind CSS**) accessible smoothly on both mobile browsers and desktops.
- **Backend:** **FastAPI** (Python) serving RESTful JSON endpoints with strict **Pydantic** schema validation and built-in **Swagger UI (`/docs`)**.
- **Database:** **SQLite** via **SQLAlchemy ORM**, storing authentic user records (checklists, pledges, awareness drives, RSVPs, guides) starting from `0` records with zero external database setup required for local demos or the SEE practical exam.

---

## 2. Report-Ready Tools and Technology Specification

| Category | Selected Tool / Technology | Role in the Portal | Justification for `1BCP308` Topic #40 |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **React + Vite** | Builds fast, modular, interactive UI pages for public awareness, checklists, drives, and dashboards | Component reuse, fast local dev/build, and responsive mobile/desktop experience from one codebase |
| **Styling & Responsiveness** | **Tailwind CSS** | Mobile-first responsive layouts, clean typography, and accessible contrast | Rapid, consistent UI styling across phone and laptop viewports |
| **Multilingual Support (i18n)** | **JSON Translation Dictionaries (`i18next` / React Context)** | Powers the **10-Language Toggle** (English + 9 major Indian regional languages) across UI labels and core guides | Directly addresses accessibility gaps found in the Literature Survey without duplicating pages |
| **Icons & Visual Cues** | **Lucide Icons** | Clear visual symbols for solar, biogas, clean cooking, conservation, and actions | Improves comprehension for non-technical and elderly community members |
| **Backend Framework** | **FastAPI (Python)** | Handles REST APIs, role-based access, community drive logic, and secondary practice estimator formulas | High performance, clean Python syntax, automatic **Pydantic** input validation, and live **Swagger `/docs`** for viva demonstration |
| **ASGI Server** | **Uvicorn** | Runs the FastAPI backend server locally and in deployment | Standard lightweight ASGI server for FastAPI |
| **Database & ORM** | **SQLite + SQLAlchemy** | Persists users, preferred language, checklists, pledges, awareness drives, RSVPs, and notices (`0` initial rows) | Portable single-file relational DB; starts at `0` records with zero server configuration during practical exams |
| **Authentication & Security** | **JWT + Password Hashing (`bcrypt` / `passlib`) + CORS** | Secures `Member` (public sign-up) and `Coordinator` (CLI/Admin promoted) roles while keeping awareness public | Prevents spam and unauthorized admin access while preserving zero-friction public access |
| **Testing & Validation** | **`pytest` + FastAPI TestClient + Browser DevTools** | Tests API endpoints, role permissions, real-input formulas, and mobile responsiveness | Verifies authentic calculation accuracy and prevents regressions (supports Objective **O5**) |
| **Version Control & IDE** | **Git, GitHub, VS Code** | Collaborative source tracking for a 3–4 member team and clean code editing | Standard team collaboration and revision history |
| **Survey & Diagramming Tools** | **Google Forms / Spreadsheets & Draw.io (Mermaid)** | Collects real baseline survey & feedback data (**O1**, **O5**) and produces system/ER diagrams | Supports transparent primary data collection and clean report documentation |

---

## 3. How This Stack Enforces Project & Syllabus Constraints

1. **Zero Dummy Data Compliance ([no-dummy-data.md](../.agents/rules/no-dummy-data.md)):**
   - **SQLite** initializes with empty tables (`0` pledges, `0` drives, `0` users) and updates strictly through real user actions.
   - **Pydantic** rejects missing/invalid inputs in the secondary savings estimator so every output is computed strictly from real user inputs and verified formulas.
2. **Non-Commercial & Portable for Practical SEE (`1BCP308`):**
   - Entirely open-source tools with zero paid cloud/vendor lock-in.
   - Runs cleanly offline/locally on a laptop during the Semester End Practical Examination (`SEE`).
3. **Web/Mobile Accessibility:**
   - Mobile-first **React + Tailwind** layout ensures community members can browse guides, switch across 10 languages, and RSVP from standard mobile browsers without needing to install a separate native app.

---

## 4. Checklist of Decisions Locked In

- [x] **Core Architecture:** Decoupled React SPA + Python REST API + Embedded SQLite DB.
- [x] **Backend Framework:** **FastAPI** + Uvicorn + Pydantic.
- [x] **Database:** **SQLite** + SQLAlchemy ORM (starting at `0` records).
- [x] **Frontend & i18n:** **React (Vite)** + Tailwind CSS + JSON 10-language toggle + Lucide Icons.
- [x] **Auth, Testing & Field Tooling:** JWT + password hashing, `pytest` + Swagger/DevTools, Git/GitHub, Google Forms, Draw.io.

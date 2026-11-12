# Topic #40: Design and Analysis of Project (Finalized)

> **Status:** Design and Analysis Finalized (Ready for Review)  
> **Previous Sections:** [brainstorming-introduction.md](brainstorming-introduction.md) | [brainstorming-literature-survey.md](brainstorming-literature-survey.md) | [brainstorming-objectives.md](brainstorming-objectives.md) | [brainstorming-tools-and-technology.md](brainstorming-tools-and-technology.md) | [brainstorming-relevance-of-project.md](brainstorming-relevance-of-project.md)  
> **Data Integrity Rule:** [.agents/rules/no-dummy-data.md](../.agents/rules/no-dummy-data.md)

---

## 1. System Analysis

### 1.1 Existing vs. Proposed System Summary
- **Existing Systems:** National and state portals (PM Surya Ghar, GOBARdhan, BEE, KREDL/DISCOMs) are compliance- and subsidy-heavy in technical English; commercial calculators are vendor-driven and solar-only.
- **Proposed System:** A neutral, non-commercial, **10-language** portal (*English + 9 major Indian regional languages: Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, Punjabi*) combining open public awareness, personal sustainable-practice checklists/pledges, coordinator-led community drives, and a secondary user-input practice impact helper.

### 1.2 Functional Requirements
1. **Public Visitors (No Login Required):**
   - Switch interface and core educational guides seamlessly across **10 languages**.
   - Browse categorized renewable & sustainable energy guides (Solar, Biogas & Waste-to-Energy, Clean Cooking / **SDG 15**, Energy Conservation) and simplified public scheme summaries.
   - View upcoming community awareness drives, local notices, and live community adoption counters (computed from real SQLite records starting at `0`).
   - Use the secondary **Practice & Habit Impact Estimator** with real user inputs.
2. **Community Members (Signed In via JWT):**
   - Track and toggle personal household readiness/adoption checklist items.
   - Create, update (*Planned → In Progress → Adopted*), and delete personal sustainable-practice pledges.
   - RSVP to and cancel attendance for community awareness drives.
3. **Coordinators / Admin (Signed In; Promoted via CLI/Admin Only):**
   - Create, update, and manage community awareness drives and verified local notices.
   - View authentic community participation and adoption summaries aggregated from SQLite.

### 1.3 Non-Functional Requirements
- **Accessibility & Responsiveness:** Mobile-first layout (`375px` mobile to desktop) with clean Unicode script rendering across all 10 Indian languages.
- **Security & Role Integrity:** `bcrypt`/`passlib` password hashing, JWT role verification, and **Member-only public registration** (preventing unauthorized coordinator self-signup).
- **Data Integrity ([no-dummy-data.md](../.agents/rules/no-dummy-data.md)):** Dynamic database tables start strictly at `0` records; all computed metrics and estimator outputs derive strictly from real user inputs and verified formulas.
- **Portability:** Single-file SQLite database and open-source stack capable of running locally offline during SEE practical evaluation.

---

## 2. System Architecture & Data Separation

```text
+-------------------------------------------------------------------+
|               FRONTEND: React (Vite) + Tailwind CSS               |
|  - i18n Multilingual Engine (10 Languages: EN + 9 Regional)       |
|  - Verified Static Reference Modules (Guides, Schemes, Steps)     |
|  - Dynamic Views (Checklist/Pledges, Drives, Secondary Estimator) |
+---------------------------------+---------------------------------+
                                  | HTTPS / JSON REST API (CORS + JWT)
                                  v
+-------------------------------------------------------------------+
|                  BACKEND: FastAPI (Python / Uvicorn)              |
|  - Pydantic Request/Response Validation                           |
|  - Auth & Role Guard (Visitor / Member / Coordinator)             |
|  - Practice Impact Formula Engine (Transparent Real Inputs Only)  |
|  - SQLAlchemy ORM Data Access Layer                               |
+---------------------------------+---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                  DATABASE: SQLite (Local .db File)                |
|  - Starts at 0 dynamic records (users, pledges, checklists,       |
|    drives, RSVPs, notices) — populated solely by real actions     |
+-------------------------------------------------------------------+
```

- **Reference Knowledge vs. Dynamic DB Separation:** Unchanging, verified factual guides, simplified scheme references, checklist step definitions, and 10-language dictionaries reside in structured static reference modules (keeping Day-1 public awareness complete without seeding fake DB rows). All transactional/community tables in SQLite start at `0` rows.

---

## 3. Detailed Design: Database, APIs, Screens & Secondary Estimator

### 3.1 SQLite Relational Schema *(All Tables Start at `0` Rows)*
1. **`users`**: `id`, `name`, `email` (unique), `password_hash`, `role` (`member` | `coordinator`), `preferred_lang`, `community_area` (optional), `created_at`
2. **`checklist_progress`**: `id`, `user_id` (FK), `practice_key`, `completed` (boolean), `updated_at` *(unique on `user_id + practice_key`)*
3. **`pledges`**: `id`, `user_id` (FK), `practice_key`, `title`, `category` (`solar` | `biogas_clean_cooking` | `conservation`), `status` (`planned` | `in_progress` | `adopted`), `notes`, `created_at`, `updated_at`
4. **`community_drives`**: `id`, `created_by` (FK → `users.id`), `title`, `description`, `language_code`, `drive_date`, `location`, `topic_category`, `status` (`upcoming` | `completed` | `cancelled`), `created_at`
5. **`drive_rsvps`**: `id`, `drive_id` (FK), `user_id` (FK), `attendance_status` (`going` | `attended`), `created_at` *(unique on `drive_id + user_id`)*
6. **`community_notices`**: `id`, `created_by` (FK → `users.id`), `title`, `body`, `language_code`, `created_at`

### 3.2 REST API Endpoints (FastAPI)
- **Auth (`/api/auth`):** `POST /register` (always creates `member`), `POST /login`, `GET /me`
- **Personal Practices (`/api/practices` — Member+):**
  - `GET /my-checklist`, `PUT /my-checklist/{practice_key}`
  - `GET /my-pledges`, `POST /my-pledges`, `PATCH /my-pledges/{id}`, `DELETE /my-pledges/{id}`
- **Community Drives & Authentic Stats (`/api/community`):**
  - *Public:* `GET /drives`, `GET /notices`, `GET /impact-summary` *(live SQL `COUNT(*)` starting at `0`)*
  - *Member+:* `POST /drives/{id}/rsvp`, `DELETE /drives/{id}/rsvp`
  - *Coordinator:* `POST /drives`, `PATCH /drives/{id}`, `POST /notices`, `DELETE /notices/{id}`
- **Secondary Practice Impact Helper (`/api/tools` — Public):**
  - `POST /estimate-practice-impact`

### 3.3 Secondary Practice & Habit Impact Estimator Specification
Focused strictly on **sustainable energy practices** (keeping clear of Topic #14's rooftop kW/bill calculator):
- **User Inputs (Validated via Pydantic, zero hidden defaults):**
  - Practice type: `appliance_watt_shift` (e.g., incandescent/CFL to LED, old fan to BLDC) or `solar_water_heater_shift` (offsetting electric geyser load)
  - `old_watts` (> 0), `new_watts` (>= 0 and `< old_watts`), `quantity` (>= 1), `hours_per_day` (> 0 and <= 24), `days_per_month` (1–31), and user-entered `tariff_per_kwh` (> 0)
- **Verified Transparent Formulas (Displayed on Screen):**
  - `monthly_kwh_saved = ((old_watts - new_watts) * quantity * hours_per_day * days_per_month) / 1000`
  - `monthly_cost_saved = monthly_kwh_saved * tariff_per_kwh`

### 3.4 Mobile-First UI Screen Map
1. **`/` — Home & Public Awareness Hub:** 10-language switcher, real community impact counters (`0` baseline), renewable guides (Solar, Biogas & Clean Cooking, Energy Conservation), simplified scheme summaries.
2. **`/practices` — Practice Checklists & Pledges:** Publicly readable readiness steps; signed-in members tick checklist items and manage personal pledges.
3. **`/community` — Awareness Drives & Notices:** Public event schedule & notices; signed-in members RSVP; coordinators create/update drives and notices.
4. **`/estimator` — Practice Impact Helper *(Secondary Tool)*:** Clean user-input form displaying transparent energy & cost reduction math.
5. **`/account` — Sign In / Register & Coordinator Console:** Authentication and coordinator event/notice management.

---

## 4. Feasibility Analysis & Testing Design

### 4.1 Feasibility Analysis (`1BCP308` Week 7 & CIE Criterion 2)
- **Technical Feasibility:** Proven open-source stack (`React + Vite`, `FastAPI`, `SQLite`), modular 10-language JSON dictionaries, and zero external database server dependencies for SEE demos.
- **Economic Feasibility:** Zero licensing fees or paid cloud lock-in; deployable on standard student laptops and mobile browsers.
- **Operational Feasibility:** Login-free public awareness reduces adoption friction; Member-only registration + CLI/Admin coordinator promotion prevents spam and keeps community coordination lightweight.
- **Social & Ethical Feasibility:** Strictly non-commercial, politically neutral, minimizes personal data collection, and supports linguistic inclusion across 10 Indian languages.

### 4.2 Testing & Validation Plan (Supporting Objective O5)
- **Automated Backend & Formula Testing (`pytest` + FastAPI `TestClient`):**
  - Verify `0`-record clean DB initialization and authentic CRUD persistence (`checklists`, `pledges`, `drives`, `rsvps`, `notices`).
  - Verify Role-Based Access Control (`Public` vs. `Member` vs. `Coordinator`).
  - Verify Pydantic rejection of invalid/negative estimator inputs and exact formula accuracy.
- **UI, Multilingual & Responsive Testing:**
  - Verify all 10 language dictionaries render cleanly without missing keys or overflow across mobile (`375px`) and desktop viewports.
- **Stakeholder Usability Feedback (Objective O5):**
  - Gather structured feedback from sample users/residents on guide clarity, language switching, and checklist usefulness.

---

## 5. Checklist of Finalized Decisions

- [x] **10-Language Support:** English + 9 major Indian regional languages via modular JSON dictionaries; coordinator drives stored in author's submitted language.
- [x] **Content vs. Dynamic DB Split:** Unchanging verified factual guides/schemes/checklists in static reference modules; all SQLite tables start at `0` rows.
- [x] **Schema, APIs, Screens & Role Security:** 6 SQLite tables, 5 mobile-first screens, Member-only public sign-up + CLI/Admin coordinator promotion.
- [x] **Secondary Estimator & Testing/Feasibility:** Practice & Habit Impact Estimator only (transparent formula, strict real user inputs) + Feasibility & `pytest`/usability validation plan.

---
title: "Chapter 1: System Architecture & Technology Stack"
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

# Chapter 1: System Architecture & Technology Stack

**Project Title:** Community Renewable Energy Awareness and Management Portal  
**Course Code:** VTU 1BCP308 — Community / Societal Project  

---

## 1.1 High-Level 3-Tier Architecture

```mermaid
flowchart TB
    subgraph Client["Frontend Layer (Browser - Mobile & Desktop)"]
        UI["React (Vite) + Tailwind CSS\nLight Civic-Green & Navy Theme"]
        I18N["Modular Multilingual JSON Engine\n(en, kn, hi, ta, te, ml, mr, bn, gu, pa)"]
        KB["Static Verified Knowledge Registry\n(Guides, Schemes, Checklist Steps)"]
        UI --> I18N
        UI --> KB
    end

    subgraph Server["Backend Layer (Python / Uvicorn)"]
        API["FastAPI REST Controllers\n(/auth, /practices, /community, /tools)"]
        VAL["Pydantic Input Validation\n& Practice Formula Engine"]
        AUTH["Bearer JWT Auth\n& Role Guards (Member / Coordinator)"]
        ORM["SQLAlchemy ORM"]
        API --> VAL
        API --> AUTH
        API --> ORM
    end

    subgraph Data["Persistence Layer (Local Embedded DB)"]
        DB[("SQLite Database\n6 Normalized Tables")]
    end

    UI -->|"HTTPS / JSON (Bearer JWT)"| API
    ORM -->|"SQL (PRAGMA foreign_keys=ON)"| DB
```

---

## 1.2 Technology Stack Specification

| Layer | Technology | Purpose & Role |
| :--- | :--- | :--- |
| **Frontend UI** | **React + Vite + Tailwind CSS** | Mobile-first responsive SPA across 5 clean screens |
| **Icons & Visuals** | **Lucide Icons** | Clear visual symbols for energy topics and status cues |
| **Localization** | **Modular JSON Dictionaries (`i18n`)** | Instant multi-language switching across 10 languages with English fallback |
| **Backend API** | **FastAPI + Uvicorn (Python)** | High-speed REST API with auto-generated Swagger `/docs` |
| **Validation** | **Pydantic** | Strict schema checks for forms and estimator physics inputs |
| **Database & ORM** | **SQLite + SQLAlchemy** | Zero-config single-file relational database for real user records |
| **Authentication** | **`bcrypt` / `passlib` + `PyJWT`** | Password hashing and `Authorization: Bearer <jwt>` sessions |
| **Testing & QA** | **`pytest` + FastAPI `TestClient`** | Automated RBAC, CRUD, empty-state, and formula tests |
| **Field & Docs** | **Google Forms, Git/GitHub, Draw.io** | Baseline survey (**O1**), usability feedback (**O5**), version control |


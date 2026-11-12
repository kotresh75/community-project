# Topic #40: Proposed System — Core Features & User Workflows (Synced)

> **Status:** Synced with Finalized Introduction, Literature Survey, Objectives & Design  
> **Previous Sections:** [brainstorming-introduction.md](brainstorming-introduction.md) | [brainstorming-literature-survey.md](brainstorming-literature-survey.md) | [brainstorming-objectives.md](brainstorming-objectives.md) | [brainstorming-tools-and-technology.md](brainstorming-tools-and-technology.md) | [brainstorming-relevance-of-project.md](brainstorming-relevance-of-project.md) | [brainstorming-design-and-analysis.md](brainstorming-design-and-analysis.md)

---

## 1. Feature Map by Theme (Aligned with Finalized Scope)

### Theme 1: Open Public Awareness Hub *(No Login Required)*
1. **10-Language Renewable Energy Guides (Static Verified Modules)**
   - Plain-language visual guides for **Solar** (rooftop & solar water heating), **Biogas & Waste-to-Energy**, **Clean Cooking / Reducing Biomass & Firewood Pressure** (**SDG 15**), and **Everyday Energy Conservation**.
2. **Government Scheme Simplifier (Static Verified Modules)**
   - Clear, non-commercial summaries of public support schemes (eligibility, steps, documents needed) with direct links to official portals (e.g., PM Surya Ghar, GOBARdhan).
3. **10-Language Toggle (`English` + 9 Major Indian Regional Languages)**
   - Persistent language switcher across UI labels, core awareness guides, and checklist definitions (*Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, Punjabi*).
4. **Practice & Habit Impact Estimator *(Secondary Supporting Utility)***
   - Optional real-input helper (`appliance_watt_shift` and `solar_water_heater_shift`) deriving exact monthly kWh and cost savings strictly from user inputs and transparent formulas—keeping clear of Topic #14's rooftop bill calculator.

### Theme 2: Personal Sustainable-Practice Management *(Member Login)*
5. **Household Readiness & Practice Checklists**
   - Actionable step-by-step checklists (static verified definitions; user progress persisted in SQLite `checklist_progress`).
6. **Personal Adoption Pledges & Progress Tracking**
   - Members select or create practice pledges, track status (*Planned → In Progress → Adopted*), and view their personal adoption log.

### Theme 3: Community Initiatives & Management *(Members + Coordinators)*
7. **Community Awareness Drives & Local Notices Board**
   - Coordinators (promoted via CLI/Admin only) publish awareness drives and verified notices in SQLite (displayed in author's submitted language); public visitors view schedules; signed-in members RSVP.
8. **Authentic Community Impact Board**
   - Live counters (total real pledges, adopted practices, drives, RSVPs) computed strictly via SQL `COUNT(*)` from SQLite starting at `0`—zero dummy or hardcoded numbers.

*(Out of Scope: External utility/streetlight fault reporting — Topic #75 — is excluded per finalized Objective **O4**.)*

---

## 2. Role-Based Workflow Sketch

```text
[Public Visitor] ──▶ Switch Language (10 Languages: EN + 9 Regional)
                 ──▶ Browse Verified Renewable Guides & Simplified Schemes
                 ──▶ View Upcoming Community Drives & Notices
                 ──▶ Try Secondary Practice & Habit Impact Estimator

[Community Member (Public Sign-Up → member role)]
                 ──▶ Everything above +
                 ──▶ Tick Practice Checklists & Manage Personal Pledges
                 ──▶ RSVP to Community Awareness Drives

[Coordinator / Admin (CLI / Admin Promoted)]
                 ──▶ Create & Update Awareness Drives
                 ──▶ Publish / Delete Verified Community Notices
                 ──▶ View Authentic Community Adoption Summary
```

---

## 3. Synced Decisions

- [x] **Community Management Scope:** Practice Checklists/Pledges + Community Awareness Drives & Notices + Authentic Impact Stats (Local Issue/Fault Tracker excluded).
- [x] **Language Scope:** 10 Languages (English + 9 major Indian regional languages) via modular JSON dictionaries.
- [x] **Content vs. DB Split:** Static verified reference modules for guides/schemes/checklists; all SQLite tables start at `0` rows.
- [x] **Coordinator Security:** Member-only public sign-up + CLI/Admin promotion for Coordinators.

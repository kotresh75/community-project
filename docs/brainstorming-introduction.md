# Topic #40: Community Renewable Energy Awareness and Management Portal — Introduction & Brainstorming Notes

> **Status:** Introduction Finalized (Ready for Review)  
> **Source Syllabus:** [community_project.md](../community_project.md) (`1BCP308`, Scheme 2025, Semester 3)  
> **Engineering Rule:** [.agents/rules/no-dummy-data.md](../.agents/rules/no-dummy-data.md)

---

## 1. Syllabus & Rubric Baseline (Facts from Course Document)

- **Course:** Community Project / Societal Project (Project-Based Learning) — `1BCP308` (1 Credit, CIE 50 + SEE 50)
- **Selected Topic (#40):** *Community Renewable Energy Awareness and Management Portal*
- **Measurable Engineering Outcome:** Design and develop a web/mobile portal to provide information on renewable energy resources and promote the adoption of sustainable energy practices within the community.
- **Specific PO:** PO 6 (The Engineer and Society)
- **Aligned SDGs:**
  - **SDG 7:** Affordable and Clean Energy
  - **SDG 11:** Sustainable Cities and Communities
  - **SDG 15:** Life on Land
- **Conduct & Feasibility Constraints:**
  - Must remain academic, socially responsible, technically focused, politically neutral, and non-commercial.
  - Must consider practical constraints: cost, resources, safety, social impact, and stakeholder cooperation.
- **CIE / SEE Rubric Demands Affecting the Introduction:**
  - Problem identification must be clearly articulated with strong evidence of local relevance and a well-defined scope.
  - Requires real stakeholder interaction, preliminary survey/data collection, analysis, and a field implementation/awareness activity.
- **Data Integrity Constraint:**
  - Zero mock, dummy, or hardcoded demo data; all calculations must use real user inputs and verified formulas; database persistence starts at `0` records and updates only via real user actions.

---

## 2. Scope & Differentiation Decisions (Agreed)

### A. Overall Portal + Local Pilot Strategy
1. **Product Design = Overall & Adaptable:** Build the portal for general communities (urban households, semi-urban wards, and rural residents alike), rather than locking the software into one narrow group.
2. **Project Introduction & Validation = Local Pilot Context:** Frame the Introduction around the broader community gap, and validate/demonstrate it using an accessible local community during the Week 3 baseline survey and Week 12 awareness session.

### B. Strict Boundary: Topic #40 vs. Topic #14
In [community_project.md](../community_project.md), Topic #14 shares the exact same title (*Community Renewable Energy Awareness and Management Portal*) but has a different outcome and SDG focus:

| Aspect | Topic #14 (Primary Focus There) | Topic #40 (Our Project) |
| :--- | :--- | :--- |
| **Core Outcome** | Provide info and **estimate energy savings** | Provide info and **promote adoption of sustainable energy practices** |
| **SDGs** | 7, 11, **13** (Climate Action) | 7, 11, **15** (Life on Land) |
| **Primary Focus** | Bill/kWh savings estimation & calculators | Behavioral adoption, practical transition readiness, community drives, and land/resource-friendly energy habits |

**Decision:** Keep **Topic #40's adoption and awareness mission as the primary identity**. A **Practice & Habit Impact Estimator** stays in scope strictly as a **secondary supporting utility** (deriving strictly from real user inputs and verified formulas per [no-dummy-data.md](../.agents/rules/no-dummy-data.md)), never overshadowing practice adoption and community management.

### C. What "Management" Means for Topic #40 (Both Personal + Community)
1. **Personal / Household Practice Management (Primary):**
   - Actionable guides for sustainable practices (rooftop solar readiness, solar water heating, clean cooking/biogas, organic waste-to-energy, reducing firewood/biomass pressure, everyday energy conservation habits).
   - Personal adoption checklists, transition readiness guides, and real user-submitted practice pledges/progress tracking.
   - *(Secondary supporting utility)* Practice & Habit Impact Estimator using real user inputs and verified transparent formulas.
2. **Community Adoption & Initiative Management (Primary):**
   - Organizing and participating in local awareness drives/workshops and sharing verified community notices.
   - Real community adoption tracking (aggregated strictly from verified user pledges/activities—starting at `0`).
   - Coordinating community-level green-energy initiatives without overlapping external utility/streetlight fault reporting (Topic #75).

### D. Accessibility & Language Scope (Agreed)
- **10-Language Support (English + 9 Major Indian Regional Languages):** Interface, core renewable awareness guides, and practice checklists support English alongside 9 major regional languages (Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, Punjabi) via modular JSON dictionaries, while coordinator-posted drives appear in the author's submitted language.

### E. User Roles & Access Model (Agreed)
- **Open Public Awareness + Account-Based Management:**
  - **Public Visitors (No Login Required):** Browse renewable energy resources, switch across 10 languages, view upcoming community drives and notices, and use the secondary Practice & Habit Impact Estimator without friction.
  - **Community Members (Signed In; Member-Only Public Sign-Up):** Save personal sustainable-practice checklists and pledges, track individual adoption progress, and RSVP to local awareness drives.
  - **Community Coordinators / Admin (Signed In; Promoted via CLI/Admin Only):** Organize community drives, publish verified local notices, and oversee authentic community adoption tracking.

---

## 3. Checklist of Introduction Decisions

- [x] **Overall vs. Specific Scope:** Hybrid (overall adaptable portal + local pilot for baseline survey & usability feedback).
- [x] **Management Meaning & #14 / #75 Boundaries:** Both personal practice adoption + community drives/initiatives; Practice & Habit Impact Estimator kept strictly as a secondary side tool; external utility fault reporting excluded.
- [x] **Accessibility & Language Scope:** 10-Language Support (English + 9 major Indian regional languages).
- [x] **User Roles & Access Model:** Open public awareness + Member-only sign-up + CLI/Admin coordinator promotion.

---

## 4. Draft Introduction (Ready for Project Report & Design Spec)

### 4.1 Background and Context
Transitioning to clean and sustainable energy is both a technological challenge and a community adoption challenge. While national policies and large-scale installations continue to expand renewable generation, meaningful long-term impact depends on everyday households and local neighborhoods adopting renewable energy resources and sustainable energy practices in daily life. In urban, semi-urban, and rural communities alike, transitioning from inefficient energy use, firewood/biomass dependency, and unguided power consumption toward solar energy, biogas, clean cooking, and energy-efficient habits directly advances **SDG 7 (Affordable and Clean Energy)**, **SDG 11 (Sustainable Cities and Communities)**, and **SDG 15 (Life on Land)** while fulfilling **PO 6 (The Engineer and Society)** under the VTU **1BCP308** Community/Societal Project framework.

### 4.2 Problem Statement
Despite growing interest in clean energy, everyday community adoption remains slow due to three practical barriers:
1. **Fragmented and Technical Information:** Reliable guidance on renewable options (such as rooftop solar readiness, solar water heating, household biogas, and government support schemes) is scattered across technical documents and commercial vendor pages, making it difficult for non-technical or regional-language speakers to trust and understand.
2. **Lack of Actionable Practice Management:** Awareness alone rarely leads to adoption; residents lack structured, step-by-step checklists and simple readiness tools to adopt and track sustainable energy practices at home.
3. **Absence of a Shared Community Hub:** Neighborhoods, wards, and local groups lack a neutral, non-commercial digital platform to organize awareness drives, coordinate shared clean-energy initiatives, share verified community updates, and observe real community-wide participation.

### 4.3 Scope, Differentiation, and Target Users
This project designs and develops an overall, adaptable **Community Renewable Energy Awareness and Management Portal** (web/mobile-accessible) tailored for broad community use and evaluated through a local community baseline survey and stakeholder usability feedback.

- **Boundary vs. Topic #14 & #75:** While Topic #14 in [community_project.md](../community_project.md) focuses on *estimating energy savings* (SDGs 7, 11, 13) and Topic #75 focuses on *streetlight fault reporting*, this project strictly centers on **Topic #40**: *providing information on renewable energy resources and promoting the adoption of sustainable energy practices* (SDGs 7, 11, 15). A user-input **Practice & Habit Impact Estimator** is included solely as a secondary supporting utility rather than the primary focus.
- **Target Users & Access:**
  - *Public Visitors:* Open access to 10-language awareness guides, simplified schemes, public drives/notices, and the supporting practice estimator.
  - *Community Members:* Authenticated access (public sign-up creates `member` accounts only) for personal practice checklists, adoption pledges, and drive RSVPs.
  - *Community Coordinators / Admin:* Promoted via CLI/Admin only to organize awareness drives, post verified community notices, and oversee transparent community reporting.
- **Academic & Data Integrity Constraints:** The portal is strictly academic, non-commercial, and politically neutral. Unchanging verified educational guides reside in static reference modules, while all dynamic database records, adoption counts, and outputs start from zero and derive exclusively from authentic user inputs and verified formulas.

### 4.4 Core Objectives
1. To provide clear, neutral, and multilingual (10-language: English + 9 major Indian regional languages) educational resources on renewable energy options, sustainable daily habits, and public support schemes.
2. To enable households to adopt and manage sustainable energy practices through actionable readiness checklists, pledges, and a secondary user-input practice impact estimator.
3. To empower community coordinators and members to organize awareness drives, share verified initiatives/notices, and track real community adoption progress.
4. To evaluate usability, multilingual clarity, and societal impact through local stakeholder surveys and structured user feedback.

*(Note: Once your Week 3 local pilot survey is completed, insert the real observed findings—such as number of respondents and key barriers reported—directly into Section 4.2 as primary evidence.)*


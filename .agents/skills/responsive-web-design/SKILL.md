---
name: responsive-web-design
description: >-
  Best practices for responsive frontend architecture, Tailwind CSS utility patterns,
  fluid typographic scaling, cross-device testing, and touch accessibility across mobile, tablet, and desktop.
  Use when building responsive layouts, modernizing CSS styling, or auditing viewport performance.
---

# Responsive Web Design & Frontend Engineering Skill

This skill enforces mobile-first responsive architecture, fluid grids, touch-friendly interfaces, and clean component styling across modern web projects.

---

## 1. Breakpoint Philosophy (Mobile-First)

Always design and write layout rules starting from the smallest screen upwards:

| Breakpoint | Target Viewport Range | Primary Layout Pattern |
| :--- | :---: | :--- |
| **Default (Base)** | `< 640px` (Mobile) | Single column, stacked cards, full-width buttons ($44\text{px}$ touch targets) |
| **`sm:`** | `640px` – `767px` (Large Mobile/Phablet) | 2-column metric cards, adjusted header padding |
| **`md:`** | `768px` – `1023px` (Tablet) | Split content panes, horizontal form rows, side-by-side guides |
| **`lg:`** | `1024px` – `1279px` (Desktop) | Multi-column dashboard grids, persistent navigation bar |
| **`xl:`** | `1280px+` (Wide Display) | Constrained centered container (`max-width: 1200px`) with ample margins |

---

## 2. Layout & Container Rules

1. **Top-Level Wrapper Constraint:**
   Always cap main content containers with a responsive max-width to prevent extreme line-stretching on wide monitors:
   ```html
   <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
   ```
2. **Fluid Grids:**
   Use auto-fitting grids rather than hardcoded column counts:
   ```html
   <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
   ```
3. **No Horizontal Scroll:**
   Never use fixed width containers (e.g. `width: 500px`). Always prefer fluid widths (`w-full max-w-md`) with `overflow-x-hidden` or `overflow-x-auto` on explicit table views.

---

## 3. Touch Accessibility & Form Usability

1. **Touch Target Size:**
   All touch-interactive targets (buttons, links, toggles, checkboxes) must measure at least $44 \times 44\text{ px}$ on mobile screens.
2. **Form Input Ergonomics:**
   - Font size for mobile inputs must be at least `16px` (`1rem`) to prevent iOS Safari auto-zooming on focus.
   - Set appropriate input modes (`inputmode="numeric"`, `type="email"`, `type="tel"`) to trigger the correct native virtual keyboard.
3. **Sticky Elements & Viewport Heights:**
   - Prefer `min-h-screen` or `100dvh` (dynamic viewport height) over static `100vh` to avoid mobile address bar clipping.

---

## 4. Responsive Verification Runbook

Before completing any frontend feature, verify the interface across these standard viewport widths:
- [ ] **Mobile Narrow:** `375px` (iPhone SE / Standard Mobile) — Verify zero horizontal scroll and readable text.
- [ ] **Mobile Regular:** `414px` (Modern Large Smartphones) — Verify card and button padding.
- [ ] **Tablet Portrait:** `768px` (iPad Portrait) — Verify grid reflow and navigation wrapping.
- [ ] **Desktop:** `1280px` (Laptop / Monitor) — Verify container centering and visual balance.


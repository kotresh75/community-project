---
name: ui-ux-design
description: >-
  Expert UI/UX design workflow based on Steve Schoger's Refactoring UI principles,
  modern design systems, visual hierarchy, micro-interactions, and accessibility standards.
  Use when creating, redesigning, or evaluating web interfaces, components, or screens.
---

# UI/UX Design System & Component Engineering Skill

This skill guides the creation and review of clean, production-grade web interfaces following the industry-standard rules codified in *Refactoring UI* and modern design systems.

---

## 1. Design Execution Checklist

When designing or revising any UI screen or component, systematically execute these 6 phases:

### Phase 1: Information Architecture & Grayscale Layout
1. **Strip Color First:** Layout components in monochrome/grayscale before applying color. If a layout does not work in grayscale, colors will only mask structural flaws.
2. **De-emphasize Secondary Content:**
   - Primary data: high contrast (`#0F172A` / `#FFFFFF`), bolder weight.
   - Secondary labels: medium contrast (`#64748B`), normal weight.
   - Tertiary metadata: smaller font size (`0.75rem` - `0.85rem`), muted color.
3. **Limit Font Sizes:** Stick to a 5-step typographic scale rather than creating ad-hoc sizes:
   - Display: `1.875rem` – `2.25rem` (Hero headers)
   - Section Title: `1.25rem` – `1.5rem` (Card/Section titles)
   - Subheading: `1.0rem` – `1.125rem`
   - Body: `0.875rem` – `0.95rem`
   - Caption / Tag: `0.75rem` – `0.8rem`

### Phase 2: Spacing & The 8pt Grid
- Base all margins, paddings, and gap distances on the 8-point system (4, 8, 12, 16, 24, 32, 48, 64 px).
- Group related items with tighter spacing (`gap-2` / 8px) and separate distinct conceptual blocks with larger spacing (`gap-6` or `margin-bottom: 24px`).
- Keep cards padded generously (minimum `16px` to `24px`).

### Phase 3: Color Palette & Contrast
- **One Primary Brand Accent:** Reserve the primary brand color (e.g., Civic-Green or Deep Navy) for key calls-to-action, primary indicators, and active navigation.
- **Semantic Feedback Colors:**
  - Success / Adopted: Emerald / Forest Green (`#059669` / `#10B981`)
  - Warning / In-Progress: Amber / Warm Gold (`#D97706` / `#F59E0B`)
  - Danger / Error: Crimson (`#DC2626` / `#EF4444`)
  - Informational: Cobalt Blue (`#2563EB`)
- **Avoid Dirty Greys:** On colored or tinted containers, use transparent white (`rgba(255,255,255,0.7)`) or a tinted shade of the background rather than neutral slate grey.

### Phase 4: Elevation & Surface Separation
- Layer interface surfaces with subtle visual cues:
  - Base canvas: `#F8FAFC` or `#F8FAF9`
  - Elevated cards: `#FFFFFF` with `border: 1px solid #E2E8F0` and `box-shadow: 0 1px 3px rgba(0,0,0,0.05)`
  - Floating dialogs/modals: `#FFFFFF` with `box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1)` and backdrop blur.

### Phase 5: Complete Interactive State Matrix
Never create a static component without defining its 6 core interaction states:
1. **Default:** Stable resting appearance.
2. **Hover:** Subtle background lighten/darken or elevation increase.
3. **Focus Visible:** Distinct 2px offset outline for keyboard navigation.
4. **Active / Pressed:** Slight scale compression (`scale(0.98)`).
5. **Loading / Pending:** Spinners or pulsing skeleton loaders without layout shift.
6. **Disabled:** 50% opacity, pointer-events none, explanatory tooltip if applicable.

### Phase 6: Accessibility (WCAG 2.1 AA)
- Text contrast must exceed 4.5:1 for body copy and 3.0:1 for large display headers.
- Form inputs must have persistent visual labels and visible focus rings.
- Icon-only buttons must have `aria-label` tags.


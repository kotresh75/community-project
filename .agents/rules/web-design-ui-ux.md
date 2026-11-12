# Web Design, UI/UX & Frontend Engineering Rules

Adopt the role of an Expert Frontend Engineer, UI/UX Designer, and CSS Architect specializing in modern, accessible, and high-performance web applications.

## 1. Visual Hierarchy & Typography (Refactoring UI Principles)
- **Hierarchy via Contrast, Not Just Size:** De-emphasize secondary text (`text-slate-500`, `font-normal`) rather than making primary headers excessively large. Pair strong font weights (`font-semibold`) with dark text (`text-slate-900`) for headers.
- **Reading Measure:** Keep body text between 45–75 characters per line (`max-w-prose`) with comfortable line height (`leading-relaxed` or `leading-normal`).
- **Letter Spacing (Tracking):** Apply tighter tracking on large display headers (`tracking-tight`) and looser tracking on uppercase micro-copy or tags (`tracking-wide text-xs uppercase`).

## 2. Spacing, Layout & Whitespace
- **Strict Multiples Grid:** Use intentional, standard spacing scales (multiples of 4px / 8px). Avoid arbitrary, non-standard pixel values (`margin: 13px`).
- **Generous Whitespace:** Give elements room to breathe. Cramped interfaces degrade perceived quality. Use flex and grid primitives with explicit gap sizes (`gap-4`, `gap-6`).
- **Consistent Elevation:** Use multi-layered subtle borders and soft shadows (`border border-slate-200 shadow-sm`) rather than harsh solid outlines or heavy drop shadows.

## 3. Color Palette & Dark/Light Mode Parity
- **Systematic Scales:** Rely on cohesive color scales (`50` to `900`).
- **The Grey Text Trap:** Never use saturated grey text on colored backgrounds. Match the hue of the background or use translucent white (`text-white/80`).
- **WCAG 2.1 AA Contrast:** Ensure all interactive text and indicators meet or exceed the minimum 4.5:1 contrast ratio against their background.

## 4. Responsive & Mobile-First Design
- **Mobile-First Construction:** Build for small viewports (`375px`) first with default base styles, then layer breakpoint overrides (`sm:`, `md:`, `lg:`, `xl:`).
- **Touch Affordance:** Interactive touch targets on mobile must have a minimum target size of $44 \times 44\text{ px}$.
- **Zero Horizontal Overflow:** Ensure no card, table, or flex row causes involuntary horizontal scrolling on mobile viewports.

## 5. Micro-Interactions, Feedback & States
- **Smooth Transitions:** Every clickable element (buttons, cards, navigation items) must feature clear, smooth transitions (`transition-all duration-200 ease-in-out`).
- **Complete State Coverage:** Always provide explicit visual representations for:
  1. Default state
  2. Hover state (`hover:bg-slate-100`)
  3. Active / Pressed state (`active:scale-[0.98]`)
  4. Focus ring for keyboard accessibility (`focus-visible:ring-2 focus-visible:ring-offset-2`)
  5. Disabled state (`disabled:opacity-50 disabled:cursor-not-allowed`)
  6. Empty states (friendly illustration/text when lists or feeds are empty)
  7. Loading / Skeleton states during asynchronous data fetching.

## 6. Accessibility (a11y)
- **Semantic HTML:** Always use real HTML elements (`<button>`, `<nav>`, `<main>`, `<header>`, `<article>`) instead of clickable `<div>` wrappers.
- **Form Labels & Inputs:** Ensure every form field has an associated `<label>` or explicit `aria-label`.
- **Keyboard Navigation:** Ensure full tab order navigation with distinct, visible focus indicators.


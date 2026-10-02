# MAHA-SETU 3D Visual Design System

This document describes the reusable 3D primitives in `/src/components/3d/` and when to use each one. All primitives respect `prefers-reduced-motion` and degrade gracefully on touch devices.

---

## Primitives

### `<TiltCard>`
**What:** Wraps any card. On mouse move, tilts on X/Y axis toward cursor (configurable max tilt) with layered navy-tinted shadows that shift opposite to the tilt direction.

**Props:**
- `maxTilt` — Maximum tilt angle in degrees (default: 12). Use 4–6 for large panels, 10–14 for small cards.
- `depth` — TranslateZ depth in px (default: 20).
- `glowColor` — Optional hex color. On hover, adds a soft colored glow behind the card.

**When to use:**
- Stat cards, scheme cards, dashboard overview cards, side panels.
- NOT on dense data tables, work queue lists, or form inputs.

---

### `<FloatingPanel>`
**What:** Gentle idle float animation (translateY ±amplitude over duration). Stagger timing per card using `index` prop so multiple panels don't bob in sync.

**Props:**
- `index` — Stagger index (delays animation start by `index × 0.7s`).
- `amplitude` — Float range in px (default: 5).
- `duration` — Full cycle in seconds (default: 5).

**When to use:**
- Stat cards on Entrepreneur Dashboard, scheme cards on SchemeMatch.
- NOT on any interactive form element or text-heavy content.

---

### `<ScrollReveal3D>`
**What:** On scroll into view, elements rotate in from a 3D angle (rotateX 15° → 0°, translateZ -40 → 0) with fade. Uses Framer Motion `whileInView`.

**Props:**
- `delay` — Delay before animation starts (use for staggering multiple items).

**When to use:**
- Every major content section/card when it first enters the viewport.
- Use staggered delays (0, 0.08, 0.16...) for groups of cards.

---

### `<GlassPanel>`
**What:** Frosted glass depth panel with `backdrop-blur-xl`, inner glow border, and 3D rotate-in entry animation.

**Props:**
- `overlay` — If true, renders as a fixed-position modal with backdrop dimming.
- `isOpen` / `onClose` — Controls visibility for modal use.

**When to use:**
- Modals (SchemeMatch details, DocumentVault OCR review).
- AI chat panel, side detail panels, ExplainPanel.
- Use sparingly — not every panel needs glass.

---

### `<PressableButton3D>`
**What:** Buttons with a real pressed-in 3D effect. Resting state has a bottom shadow "lip" (like a physical key). On hover, lifts slightly. On press, depresses down with shadow collapse.

**Props:**
- Standard button props (`onClick`, `disabled`, `type`, `className`).

**When to use:**
- All primary CTAs ("Build My Approval Roadmap", "Run AI Pre-Check", "Approve").
- Action buttons in modals and panels.
- NOT on inline text links or small icon buttons.

---

### `<Icon3D>`
**What:** Dimensional icon style. Lucide icon placed inside a rounded 3D "puck" with gradient fill, inner highlight (top-left bevel), and layered shadow (bottom-right).

**Props:**
- `icon` — Any Lucide icon component.
- `bgFrom` / `bgTo` — Gradient colors for the puck background.
- `iconColor` — Color of the icon itself.
- `size` — `'sm'` | `'md'` | `'lg'`.

**When to use:**
- Dashboard stat card icons, action item icons, sidebar nav (active state).
- Section headers with icon callouts.
- NOT for every tiny inline icon — only for hero/feature positions.

---

## CSS Utilities (in `index.css`)

| Class | Purpose | Use On |
|-------|---------|--------|
| `.btn-3d` | Quick 3D button without the React component | Simple buttons where PressableButton3D is overkill |
| `.gradient-mesh-bg` | Animated background gradient mesh | Dashboard wrapper, landing sections |
| `.cal-cell-3d` | 3D hover lift for calendar cells | ComplianceCalendar day cells |
| `.cal-cell-raised` | Static raised state for cells with events | Calendar event days |
| `.shine-sweep` | Light sweep effect on hover | SchemeMatch cards, premium feature cards |
| `.text-embossed` | Carved/raised text shadow | Large stat numbers |
| `.preserve-3d` | CSS `transform-style: preserve-3d` | Any 3D parent container |
| `.perspective-1000` | CSS `perspective: 1000px` | Container wrapping tilted elements |

---

## Motion & Interaction Rules

1. **Spring physics everywhere:** All 3D interactions use `type: 'spring'`, stiffness ~200–400, damping ~20–30. Never use linear easing for 3D movement.
2. **Layered shadows:** Minimum 2 shadow layers per raised element. Color-tint toward navy (`rgba(15,23,42,...)`) not pure black.
3. **Light from top-left:** All highlights/bevels assume light from top-left consistently.
4. **Stagger animations:** Groups of cards stagger entry by 60–100ms per item.
5. **Click feedback:** Every clickable 3D element scales down slightly on press before the action fires.

## Accessibility

- All 3D is visual-only — no functional behavior depends on 3D.
- `prefers-reduced-motion` disables all float, tilt, and parallax globally.
- Touch devices: tilt-on-move disabled, replaced with tap-lift.
- Keyboard focus triggers the same "lifted" visual as hover.
- Screen readers never see Three.js canvas internals (Hero3D uses `aria-hidden`).
- Status is never conveyed by glow/color alone — text labels always accompany.

## Performance

- Three.js (Hero3D) is lazy-loaded via `React.lazy` + `Suspense`.
- CSS 3D transforms use GPU-accelerated `transform`/`opacity` only.
- Dense data views (officer work queue, admin tables) stay flat and fast.

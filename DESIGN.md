# Design System: StockNaira - Inventory & POS Manager

## 1. Visual Theme & Atmosphere
StockNaira is an executive, high-trust retail and financial control center designed for Nigerian retail business owners. The atmosphere is crisp, professional, and gallery-airy with deliberate spatial density — combining the structure of modern enterprise accounting SaaS with the rapid responsiveness of a busy Lagos counter terminal. Surfaces are pristine white elevated above a soft cool zinc canvas, framed with razor-thin whisper borders and energized by deep Nigerian emerald green accents.

- **Density:** 6/10 (Balanced operational density with legible tabular data and roomy touch-friendly actions)
- **Variance:** 6/10 (Structured sidebar with asymmetric dual-chart analytics and tabbed data view)
- **Motion:** 5/10 (Fluid spring hover states, seamless modal entrances, and perpetual pulse indicators for live bank alerts)

## 2. Color Palette & Roles
- **Canvas Cool** (`#F8FAFC`) — Primary application background canvas
- **Pure Surface** (`#FFFFFF`) — High-elevation card containers, top bar, and modal sheets
- **Deep Ink Slate** (`#0F172A`) — Slate-900 primary text, headers, and key numerical figures
- **Muted Steel** (`#64748B`) — Slate-500 secondary labels, subtext, and timestamps
- **Whisper Border** (`#E2E8F0` / `rgba(226, 232, 240, 0.8)`) — 1px structural dividing lines and card contours
- **Naira Emerald** (`#059669`) — Primary CTA, confirmed payment badges, and POS action highlights
- **Naira Deep Emerald** (`#047857`) — Button hover state, high-importance accents, active tabs
- **Amber Warning** (`#D97706` / `#FEF3C7`) — Low stock thresholds and unconfirmed transfer alerts
- **Crimson Alert** (`#DC2626` / `#FEE2E2`) — Failed transactions, out-of-stock items, and fraud warning indicators
- **Cobalt Transfer** (`#2563EB` / `#DBEAFE`) — Bank transfer identifiers, POS terminals, and NIP references

## 3. Typography Rules
- **Display & Headings:** `Plus Jakarta Sans`, font weights 600 (Semibold) and 700 (Bold), `-0.02em` letter spacing for clean modernity without screaming.
- **Body & Controls:** `Plus Jakarta Sans`, font weights 400 (Regular) and 500 (Medium), line-height 1.5 for clear reading under harsh retail lighting.
- **Monospace & Numbers:** `JetBrains Mono` / Tabular Figures for all Naira (`₦`) amounts, order codes, stock quantities, and bank transaction reference numbers.
- **Banned Typography:** Comic Sans, generic serif fonts (`Times New Roman`, `Georgia`), and low-contrast neon text.

## 4. Component Stylings
- **Buttons:**
  - Primary: Solid Naira Emerald (`#059669`) with crisp white text, subtle shadow (`0 2px 4px rgba(5, 150, 105, 0.15)`), and `-1px` push translate on click.
  - Secondary: Pristine white with Slate-200 border, Slate-700 text, and hover background `#F8FAFC`.
  - Icon Buttons: Rounded-lg neutral buttons with subtle hover shading.
- **Metric Cards:**
  - Pure surface fill (`#FFFFFF`), `1px solid #E2E8F0` border, `16px` (`rounded-2xl`) corner radius.
  - Circular icon pill badge (`w-11 h-11`) with light neutral/tinted background.
  - Large tabular numeral for primary metric (`₦245,800`), accompanied by comparative delta badges and sub-metric breakdown.
- **Charts:**
  - Dual Spline Line Chart: Smooth cubic bezier curves with gradient area fill under curves (`rgba(5, 150, 105, 0.12)` for transfers, `rgba(100, 116, 139, 0.08)` for cash).
  - Floating Tooltip Card: Dark Slate-900 or crisp White floating container with drop shadow, displaying exact date, total sales, and payment breakdown.
  - Concentric Donut Chart: Custom SVG ring arc with department color coding and center total capacity metric (`4,820 Units / 70%`).
- **Data Table:**
  - Integrated pill & underline tab switching header.
  - Hoverable rows with zebra background transition (`hover:bg-slate-50/70`).
  - Color-coded status badges: Confirmed (Green), Pending (Amber), Failed/Disputed (Red).
  - Payment method chips with recognizable badges (Cash, POS Terminal, Bank Transfer, Split).
- **Modals:**
  - Centered backdrop blur (`backdrop-blur-sm bg-slate-900/40`), smooth scale-up animation, tactile escape/close buttons.

## 5. Layout Principles
- **Sidebar & Main Canvas Grid:**
  - Fixed-width / collapsible 260px left sidebar with store identity at top, search shortcut, grouped menus, and quick-access favorites.
  - Responsive main content container (max-width `1500px`) with 24px/32px gutter spacing.
  - Grid: 3-column top metric row (collapses to 1-col on mobile), 65/35 split for analytical charts, full-width tabbed data table.
- **Responsive Strategy:**
  - Mobile (<768px): Hamburger drawer sidebar, single-column stacked metric cards, horizontally scrollable data tables with sticky column headers.

## 6. Motion & Micro-Interactions
- Smooth CSS transitions (`200ms cubic-bezier(0.16, 1, 0.3, 1)`).
- Dynamic pulsing beacon on "Pending Transfers" badge indicating real-time bank incoming queue.
- Tab indicator sliding animation and modal fade-in-up transition.

## 7. Anti-Patterns (Banned)
- No emojis as primary UI icons (use standard Lucide icons).
- No pure black `#000000` text or backgrounds.
- No neon/outer glow effects or generic purple AI themes.
- No fabricated meaningless statistics — all data reflects realistic Nigerian retail numbers, prices, and bank entities.
- No missing currency symbols — all monetary values must be prefixed with `₦` and formatted with standard thousands commas (e.g., `₦245,800.00`).

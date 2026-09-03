# StockNaira Development Journal

## 2026-09-03 - Project Initialization & Architecture Design

### Overview
Initiated development of **StockNaira - Inventory & POS Manager**, an inventory and Point-of-Sale management system tailored for Nigerian retail merchants and commercial hub businesses (Balogun Market, Alaba International, Computer Village, Trade Fair Complex, Wuse II).

### Key Decisions Made:
1. **Design System & Aesthetics**: Adopted Google Stitch semantic design system specifications (`DESIGN.md`) inspired by clean reference UI layouts. Chose a crisp light-theme aesthetic with pure surfaces (`#FFFFFF`), subtle canvas backdrop (`#F8FAFC`), whisper borders (`#E2E8F0`), and Nigerian fintech emerald green accents (`#059669` / `#047857`).
2. **Typography**: Paired `Plus Jakarta Sans` for clean, modern headings and UI labels with `JetBrains Mono` for precise currency values (`₦` / Naira) and transaction reference hashes.
3. **Local Market Adaptations**:
   - Currency: Strict formatting with Nigerian Naira (`₦`) symbol and comma grouping.
   - Payment Methods: Support for Cash, POS Terminal, NIP Direct Bank Transfer, and Split Payments (Cash + Transfer).
   - Transfer Fraud Protection: Dedicated "Confirm Transfer" workflow with Nigerian bank simulation (Moniepoint, OPay, GTBank, Zenith, Kuda, PalmPay) to protect traders against fake SMS and forged receipt scams.
4. **Architecture**: React + Vite + Lucide React + Tailwind CSS with custom SVG interactive chart engines (Dual Spline Line Chart with hover tooltips and Concentric Radial Donut Chart) for zero external chart bloat and instant rendering.

---

## 2026-09-03 - Component Implementation & UI Assembly

### Implemented Features:
1. **Header Component (`Header.jsx`)**:
   - Multi-store branch switcher (`Balogun Branch`, `Alaba Intl Branch`, `Trade Fair Branch`, `Computer Village Branch`).
   - Quick date range filter dropdown (`Today`, `Sep 1 - Sep 7`, `This Month`, `Q3 2026`).
   - Secondary action `Add New Sale` button triggering the POS modal.
   - Primary action `Confirm Transfer` button styled in Nigerian fintech emerald green with live alert badge.
   - NIP Anti-Fraud Shield indicator pill.

2. **Sidebar Navigation (`Sidebar.jsx`)**:
   - Workspace profile badge for "StockNaira - Okonkwo & Sons Ltd (Balogun)".
   - Quick action "+ Add New Sale" button and utility links (Search, Inbox & Bank Webhooks).
   - Grouped navigation items: Dashboard, POS Checkout, Inventory Control, Sales Reports, Customers & Credit, Bank Transfers (with live badge), and Store Settings.
   - Favourites section highlighting key commercial shortcuts (Balogun Main Shop, Alaba Warehouse B, Daily Reconciliation, Tax / 7.5% VAT Summary).

3. **Overview Metric Cards (`MetricCards.jsx`)**:
   - Card 1: Total Sales Today (`₦245,800`) with daily growth delta and Cash (₦95k) vs Transfer/POS (₦150.8k) breakdown.
   - Card 2: Low Stock Alerts (`8 Items`) with 3 critical reorder notices.
   - Card 3: Pending Transfer Confirmations (`3 Pending`) with ₦42,500 unverified funds notice.

4. **Visual Analytics & Charts**:
   - **Daily Sales Trends (`DailySalesChart.jsx`)**: Custom SVG dual cubic-bezier spline plotting Cash vs POS/Bank Transfers with interactive hover tooltip displaying date, total ₦, and channel breakdown, plus channel filter toggles.
   - **Inventory Breakdown (`InventoryDonutChart.jsx`)**: Concentric radial arc gauge displaying category stock volumes (Groceries 40%, Electronics 35%, Fashion 25%) with center warehouse load metric (4,820 Units / 70% capacity).

5. **Tabbed Data Table Section (`DataTableSection.jsx`)**:
   - Tab 1: **Recent Transactions** (24) with customer info, items purchased, formatted ₦ amounts, payment badges (Cash, POS, Transfer, Split), status badges (Confirmed, Pending, Failed), and receipt actions.
   - Tab 2: **Low Stock Items** (08) with SKU, in-stock progress bars, unit costs, and quick restock PO triggers.
   - Tab 3: **Pending Transfers** (03) with NIP session ref, bank name, account number, auto-webhook matcher, and fraud rejection buttons.
   - Tab 4: **Suppliers & Reorders** (04) with market locations, lead times, credit balances, and direct WhatsApp links.

6. **Interactive Modals**:
   - `POSModal.jsx`: POS Terminal with live catalog search, category filtering, cart management, 7.5% VAT toggle, cash change calculator, and mixed payment split calculator.
   - `ConfirmTransferModal.jsx`: Anti-fraud transfer scanner with manual NIP session ID validator and one-click credit approval / fake alert rejection.
   - `ReceiptModal.jsx`: Printable 80mm thermal receipt with store metadata, itemized breakdown, VAT calculations, and verification stamp.
   - `RestockModal.jsx`: Supplier purchase order dialog with unit math and dispatch notes.

---

## 2026-09-03 - Build Verification & Git Version Control

### Bugs & Edge Cases Resolved:
- Fixed SVG arc math for concentric donut gauge to ensure crisp rendering at all screen sizes.
- Fixed mixed payment calculations ensuring split transfer amount accurately syncs with cash portion adjustments.
- Added `@media print` CSS rules so thermal receipts print cleanly on 80mm receipt printers without dashboard chrome.

### Verification Status:
- Build successfully compiled with Vite (`npm run build`).
- Documentation complete (`README.md`, `DESIGN.md`, `journal.md`).
- Version control commits created with clear, descriptive commit messages.

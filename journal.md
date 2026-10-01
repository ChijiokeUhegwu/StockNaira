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

---

## 2026-09-19 - Dedicated Store Settings View & Multi-Channel Configuration

### Overview
Replaced default dashboard fallback in Store Settings navigation with a dedicated, fully functional, multi-tab **Store Settings & Operations View** (`StoreSettingsView.jsx`). Tailored for Nigerian retail commercial hubs (Balogun Market, Alaba, Computer Village, Trade Fair), allowing merchants to manage business identity, NIP bank webhook gateways, 7.5% VAT fiscal rules, safety inventory thresholds, and staff access roles.

### Implemented Features & Components:
1. **Business Profile & Corporate Identity (`profile` Tab)**:
   - Form fields for Official Store Name (*Okonkwo & Sons Ltd*), Trading/Plaza Display Name, CAC Registration Number (`RC-1849204`), and Tax Identification Number (TIN `23849102-0001`).
   - Physical Market Address configuration (e.g. *Plot 14, Breadfruit Street, Balogun Market, Lagos Island*), phone/WhatsApp contact, official accounts email, state, and country.
   - Merchant category selector (FMCG Wholesale, Electronics, Auto Parts, Fashion & Ankara, Pharmacy).
   - High-trust verified commercial account identity card with active branch tags.

2. **Payment & NIP Webhook Configuration (`payment_nip` Tab)**:
   - Multi-bank merchant account management: Moniepoint MFB (POS Terminal & NIP Settlement default), OPay Digital Services, GTBank Plc, Zenith Bank, and Kuda Bank.
   - Interactive **"+ Add Bank Account"** modal supporting NUBAN validation, terminal IDs, and primary default assignment.
   - Live vs Sandbox NIP Instant Gateway toggle with SSL POST Webhook Endpoint URL and HMAC-SHA256 secret key management (with reveal & copy).
   - Interactive **"Send Test Webhook"** connectivity simulator to verify real-time credit event processing.
   - Notification preferences: Auto-matching 9-digit NIP session IDs, counter audio chime, and instant WhatsApp alerts.

3. **Tax & VAT Settings & Thermal Receipt Customization (`tax_vat` Tab)**:
   - Nigerian statutory 7.5% VAT toggle with inclusive/exclusive pricing modes.
   - Default currency configuration locked to Nigerian Naira (`₦ NGN`).
   - Receipt customization: Editable top header text, custom bottom disclaimer/return policy, and toggles for printing TIN, cashier name, and NIP session ref.
   - **Interactive Live 80mm Thermal Receipt Preview**: Renders real-time receipt simulation updating dynamically as merchants edit header text, return policy notes, and tax parameters.

4. **Low Stock Thresholds & Stockout Prevention (`inventory_alerts` Tab)**:
   - Global low stock alert trigger slider (default `<= 5 units`) and emergency critical stockout alarm slider (default `<= 2 units`).
   - Department-specific safety rules for Groceries (10 units), Electronics (5 units), Fashion (8 units), and General Goods.
   - Automated supplier Purchase Order (PO) draft trigger and daily 8:00 AM WhatsApp stockout briefing toggle.

5. **Team & Staff Access Permissions (`team_roles` Tab)**:
   - Staff member directory with avatars, roles, assigned branches, and 4-digit POS authorization PINs.
   - Granular permission matrix: POS Checkout access, NIP Transfer Approval, Manager Discount/Price Overrides, Restock PO creation, and Settings Admin.
   - Interactive **"+ Add Staff Member"** modal with role auto-permission presets.
   - One-click account active/suspended toggle and deletion safeguards.

6. **State Persistence & Integration (`settingsData.js` & `App.jsx`)**:
   - `localStorage` synchronization (`stocknaira_store_settings_v1`) with fallback to comprehensive Nigerian merchant presets.
   - Bi-directional synchronization: Customized receipt header, TIN, and 7.5% VAT settings now directly inform `ReceiptModal.jsx` during POS checkouts.
   - Top breadcrumb bar with unsaved changes indicator, "Reset Defaults" action, and smooth return-to-dashboard navigation.

### Key Decisions Made:
- **Local Storage Persistence**: Opted for browser `localStorage` schema with deep merge against default presets to ensure offline resilience and uninterrupted cashier workflows during connectivity drops in busy market hubs.
- **Dynamic Receipt Sync**: Linked Store Settings tax and profile state directly into the global sales receipt generator so changes to TIN or header immediately reflect on customer printouts.
- **Micro-interactions & Aesthetics**: Designed according to `taste-design` standards in `DESIGN.md` with pristine card surfaces, subtle borders, high-contrast badges, and tactile button push transitions.

### Challenges Resolved:
- **Form State Granularity**: Structured modular state handling so updates to nested configuration blocks (e.g., category thresholds, bank accounts, staff permissions) trigger targeted re-renders with zero latency.
- **Receipt Print Preview Math**: Accurately mapped subtotal, dynamic VAT percentage, and payment channel data in the live preview card.

### Parked Items for Future Iterations:
- **Direct ESC/POS Bluetooth Hardware Printing**: Web Bluetooth API integration to transmit raw ESC/POS byte streams directly to handheld thermal printers without OS print dialog.
- **Biometric / Cashier Fingerprint Verification**: WebAuthn biometric approval for high-value manager overrides (discounts > 10% or refunds > ₦50,000).
- **Automated Open Banking OAuth Flow**: Direct OAuth integration with Nigerian commercial banks for automated live statement sync.

---

## 2026-10-01 - Dedicated Inventory Control & Sales Reports Views

### Overview
Replaced the single-screen dashboard shell with a true multi-page workspace. Sidebar items no longer scroll to dashboard sections: **Dashboard**, **Inventory Control**, **Sales Reports**, and **Store Settings** each render their own dedicated view, while POS Checkout and Bank Transfers continue to open as overlay modals on top of the active page. Eliminated the duplicated "inventory table" and "financial summary" sections that previously lived inside the dashboard scroll.

### Implemented Features & Components:

1. **Stock Ledger Data Source (`inventoryData.js`)**:
   - `INITIAL_STOCK_ITEMS`: 34 wholesale SKUs across Provisions (1,928 units), Gadgets (1,687), and Fashion (1,205) - 4,820 total units with cost price, retail price, reorder point, supplier, and 30-day units-sold velocity.
   - Derived helpers so every surface agrees: `buildInventorySummary` (unit count, cost/retail valuation, reorder & stockout counts, fast movers), `buildCategoryBreakdown` (units + percentage share for the donut chart), `buildLowStockRows` (dashboard low-stock table rows), `matchesStockFilter` and `getStockStatus`/`getStockStatusMeta`.
   - Fast-mover classification at `unitsSold30d >= 90` powers both the "Fast Movers" filter tab and the dashboard reorder recommendation.

2. **Dedicated Inventory Control View (`InventoryControlView.jsx` + 5 components)**:
   - `ProductManagementTable.jsx`: sortable, searchable product ledger with SKU, Item Name, Category, Stock Level (with in-bar), Reorder Point, Unit Price, Cost Price, and per-row **Edit** (inline cell editing) / **Restock** actions.
   - `StockStatusFilterTabs.jsx`: All SKUs / Fast Movers / Reorder Needed / Stocked Up / Out of Stock counters with live counts.
   - `InventorySummaryWidgets.jsx`: total units in stock, stock value at cost, fast-mover velocity, stockout risk, and reorder-needed KPI cards.
   - `AddProductModal.jsx`: validated new-SKU form (SKU auto-suffixing, numeric guards on price/quantity, category select).
   - `BatchRestockModal.jsx`: multi-SKU purchase-order restock that pre-selects all reorder-needed/out-of-stock items, lets the manager set PO number, supplier, per-line quantity and unit cost, then posts the whole order to the shared stock state in one action.
   - Quick single-item restock reuses the existing `RestockModal.jsx`.

3. **Dedicated Sales Reports View (`SalesReportsView.jsx` + 5 components)**:
   - `salesReportsData.js`: 30-day (Sep 1-30, 2026) trend series with per-day gross sales, transactions, average basket, cash vs POS/Bank Transfer split, plus top-seller rankings and a daily reconciliation ledger. "Today" resolves to Sep 30, 2026.
   - `FinancialSummaryCards.jsx`: Gross Sales, VAT Collected (7.5%), Cash vs Digital split, and average basket of sale cards with period-over-period deltas.
   - `SalesDateRangeFilter.jsx`: Today / Last 7 Days / This Month / Custom date window selector (custom validates end >= start).
   - `SalesChannelChart.jsx`: dependency-free grouped bar chart (Cash vs POS/Bank Transfer) with hover tooltips, VAT-inclusive/exclusive toggle, and Y-axis gridlines.
   - `TopSellingProducts.jsx`: rank 1-10 by units sold with revenue bars and share-of-volume percentages.
   - `ReconciliationSheet.jsx`: off-screen printable daily reconciliation sheet (per-day cash, POS, transfer, variance and cashier sign-off) driven by the same dataset.
   - `utils/exporters.js`: client-side BOM-prefixed CSV download helpers for the trend series and top sellers.

4. **Navigation & Shell Wiring (`App.jsx`, `Header.jsx`, `Sidebar.jsx`)**:
   - App-level `activeMenu` state now resolves sidebar clicks to real routes: `dashboard`, `inventory`, `reports`, `customers` (parked placeholder), `settings`; `pos` and `transfers` still open their modals over the current page.
   - `stockItems` lifted to a single shared state in `App.jsx`; dashboard donut, dashboard low-stock table, and Inventory Control all read from the same array, so a restock immediately updates every view.
   - `Header.jsx` renders a per-page title and subtitle (`Inventory Control` / "Stock ledger & reorder cycles", `Sales Reports` / "Revenue, VAT & channel analytics") while keeping the date-range dropdown dashboard-only.
   - Sidebar Favorites now deep-link to their real destinations (Alaba Warehouse B -> Inventory, Daily Reconciliation -> Reports, Tax/VAT Summary -> Settings).

5. **Verification & Housekeeping**:
   - `vite build` passes (1868 modules, 465 kB JS / 45 kB CSS).
   - Added a temporary server-side render smoke test that mounted App (dashboard), Inventory Control, Sales Reports, and Store Settings to catch runtime errors; removed afterwards.
   - `src/index.css` print rules updated so the reconciliation sheet prints alongside the POS receipt.
   - Removed the now-redundant `INITIAL_LOW_STOCK_ITEMS` mock from `mockData.js` (superseded by the catalog-derived low-stock rows).

### Key Decisions Made:
- **One stock ledger, many surfaces**: introduced `inventoryData.js` as the single source of truth instead of maintaining a parallel low-stock mock, so dashboard, inventory table, and restock flows can never drift.
- **Dependency-free charting**: wrote the sales channel chart as hand-rolled SVG + Tailwind rather than adding Recharts/Chart.js, keeping the bundle lean and the styling consistent with `DESIGN.md`.
- **7.5% VAT computed on the exclusive base** (`gross / 1.075 * 0.075`) to match Nigerian VAT rules for goods, with VAT-inclusive and exclusive display toggles on the chart and cards.
- **Reports dataset anchored to the dashboard**: Sep 1-7 mirrors the existing dashboard daily sales so both screens reconcile to the same numbers.

### Challenges Resolved:
- **Modal-over-route vs route-over-modal**: kept POS and Bank Transfers as modals (cashier flow must not lose dashboard context) while promoting Inventory/Reports to full pages.
- **Shared mutable stock state**: threaded `stockItems`/`setStockItems` from `App.jsx` into `InventoryControlView` so quick restock, batch restock, and inline edit all write to one array.
- **CSV export on Windows**: prefixed exports with a UTF-8 BOM so Naira-formatted values open correctly in Excel.

### Parked Items for Future Iterations:
- **POS catalog stock sync**: `PRODUCT_CATALOG` in `mockData.js` still carries its own stock counts; wiring it to the shared ledger is the next step.
- **Customers & Credit page**: nav item still renders a placeholder; trade-credit running balances are unimplemented.
- **Backend persistence & auth**: all state is in-memory/`localStorage`; a real API, multi-branch stock transfers, and role-based login remain out of scope.


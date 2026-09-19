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


import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import DailySalesChart from './components/DailySalesChart';
import InventoryDonutChart from './components/InventoryDonutChart';
import DataTableSection from './components/DataTableSection';
import StoreSettingsView from './components/StoreSettingsView';
import InventoryControlView from './components/InventoryControlView';
import SalesReportsView from './components/SalesReportsView';
import POSModal from './components/POSModal';
import ConfirmTransferModal from './components/ConfirmTransferModal';
import ReceiptModal from './components/ReceiptModal';
import RestockModal from './components/RestockModal';
import {
  INITIAL_STORES,
  INITIAL_METRICS,
  DAILY_SALES_TRENDS,
  INITIAL_TRANSACTIONS,
  INITIAL_PENDING_TRANSFERS,
  INITIAL_SUPPLIERS
} from './data/mockData';
import {
  INITIAL_STOCK_ITEMS,
  buildCategoryBreakdown,
  buildLowStockRows,
  getStockStatus
} from './data/inventoryData';
import { loadStoreSettings, saveStoreSettings } from './data/settingsData';

export default function App() {
  // Navigation & Store state
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState(INITIAL_STORES[0]);
  const [dateRange, setDateRange] = useState('Sep 1, 2026 - Sep 7, 2026 (7 days active)');

  // Store Settings state (persisted to localStorage)
  const [storeSettings, setStoreSettings] = useState(() => loadStoreSettings());

  // Data states
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [stockItems, setStockItems] = useState(INITIAL_STOCK_ITEMS);
  const [pendingTransfers, setPendingTransfers] = useState(INITIAL_PENDING_TRANSFERS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [activeTab, setActiveTab] = useState('transactions');

  // Derived inventory views (Dashboard low stock tab + donut gauge stay in sync
  // with the Inventory Control ledger)
  const lowStockItems = useMemo(() => buildLowStockRows(stockItems), [stockItems]);
  const inventoryCategories = useMemo(() => buildCategoryBreakdown(stockItems), [stockItems]);
  const outOfStockCount = useMemo(
    () => stockItems.filter((item) => getStockStatus(item) === 'Out of Stock').length,
    [stockItems]
  );
  const totalStockUnits = useMemo(
    () => stockItems.reduce((sum, item) => sum + item.unitsInStock, 0),
    [stockItems]
  );

  // Modal states
  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [receiptTxn, setReceiptTxn] = useState(null);
  const [restockItem, setRestockItem] = useState(null);

  // Toast / Notification banner
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handlers
  const handleSaveStoreSettings = (newSettings) => {
    setStoreSettings(newSettings);
    saveStoreSettings(newSettings);
  };

  const handleCompleteSale = (newTxn) => {
    setTransactions([newTxn, ...transactions]);

    // Update metrics
    setMetrics((prev) => ({
      ...prev,
      totalSalesToday: prev.totalSalesToday + newTxn.amount,
      cashSales: newTxn.paymentType === 'Cash' ? prev.cashSales + newTxn.amount : prev.cashSales,
      transferPosSales: newTxn.paymentType !== 'Cash' ? prev.transferPosSales + newTxn.amount : prev.transferPosSales,
    }));

    showToast(`New sale completed: ${newTxn.id} (${newTxn.customer}) for ₦${newTxn.amount.toLocaleString()}`);

    // Automatically prompt receipt view
    setReceiptTxn(newTxn);
  };

  const handleApproveTransfer = (orderId, transferId) => {
    // Update pending transfers list
    setPendingTransfers((prev) => prev.filter((t) => t.id !== transferId && t.orderId !== orderId));

    // Update transaction status
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === orderId ? { ...txn, status: 'Confirmed' } : txn))
    );

    // Update metrics
    setMetrics((prev) => ({
      ...prev,
      pendingTransfersCount: Math.max(0, prev.pendingTransfersCount - 1),
      pendingTransfersAmount: Math.max(0, prev.pendingTransfersAmount - 20000),
    }));

    showToast(`Transfer for Order ${orderId} verified and confirmed!`);
  };

  const handleRejectTransfer = (transferId) => {
    const target = pendingTransfers.find((t) => t.id === transferId);
    setPendingTransfers((prev) => prev.filter((t) => t.id !== transferId));

    if (target) {
      setTransactions((prev) =>
        prev.map((txn) =>
          (txn.id === target.orderId ? { ...txn, status: 'Failed' } : txn)
        )
      );
    }

    // Update metrics
    setMetrics((prev) => ({
      ...prev,
      pendingTransfersCount: Math.max(0, prev.pendingTransfersCount - 1),
    }));

    showToast(`Transfer ${transferId} flagged as fraudulent / fake alert and rejected.`);
  };

  const handleConfirmRestock = (itemId, reorderQty) => {
    setStockItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, unitsInStock: item.unitsInStock + reorderQty, lastRestocked: 'Just now' }
          : item
      )
    );

    showToast(`Purchase order issued! +${reorderQty} units dispatched by supplier.`);
  };

  const handleMenuChange = (menu) => {
    // POS Checkout and Bank Transfers are action entries: they open their modal
    // over the dashboard ledger instead of owning a page of their own.
    if (menu === 'pos') {
      setActiveMenu('dashboard');
      setActiveTab('transactions');
      setIsPOSOpen(true);
      return;
    }
    if (menu === 'transfers') {
      setActiveMenu('dashboard');
      setActiveTab('transfers');
      setIsTransferModalOpen(true);
      return;
    }
    if (menu === 'inventory') {
      setActiveTab('low_stock');
    }
    setActiveMenu(menu);
  };

  const renderActiveView = () => {
    switch (activeMenu) {
      case 'settings':
        return (
          <StoreSettingsView
            settings={storeSettings}
            onSaveSettings={handleSaveStoreSettings}
            onBackToDashboard={() => setActiveMenu('dashboard')}
            showToast={showToast}
            currentStore={currentStore}
            stores={INITIAL_STORES}
          />
        );

      case 'inventory':
        return (
          <InventoryControlView
            stockItems={stockItems}
            setStockItems={setStockItems}
            showToast={showToast}
            currentStore={currentStore}
            onQuickRestock={(row) => setRestockItem(row)}
          />
        );

      case 'reports':
        return (
          <SalesReportsView
            showToast={showToast}
            currentStore={currentStore}
            storeSettings={storeSettings}
          />
        );

      case 'customers':
        return <ParkedView onBackToDashboard={() => setActiveMenu('dashboard')} />;

      default:
        return (
          <>
            {/* Section 1: Overview Metric Cards */}
            <section aria-label="Key Performance Indicators">
              <MetricCards
                metrics={{
                  ...metrics,
                  totalStockUnits,
                  lowStockCount: lowStockItems.length,
                  criticalStockCount: outOfStockCount,
                  pendingTransfersCount: pendingTransfers.length
                }}
                onOpenLowStock={() => setActiveTab('low_stock')}
                onOpenTransfers={() => {
                  setActiveTab('transfers');
                  setIsTransferModalOpen(true);
                }}
                onOpenNewSale={() => setIsPOSOpen(true)}
              />
            </section>

            {/* Section 2: Visual Analytics & Charts (65% Dual Line Chart + 35% Donut Chart) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6" aria-label="Analytics & Charts">
              {/* Left 65% width: Daily Sales Trends (Cash vs Transfer) */}
              <div className="lg:col-span-8 min-h-[340px]">
                <DailySalesChart data={DAILY_SALES_TRENDS} />
              </div>

              {/* Right 35% width: Inventory Breakdown Donut Chart */}
              <div className="lg:col-span-4 min-h-[340px]">
                <InventoryDonutChart
                  categories={inventoryCategories}
                  totalUnits={totalStockUnits}
                  capacityPercent={metrics.capacityUsedPercent}
                />
              </div>
            </section>

            {/* Section 3: Data Table with Tab Navigation */}
            <section aria-label="Operational Data Ledger">
              <DataTableSection
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                transactions={transactions}
                lowStockItems={lowStockItems}
                pendingTransfers={pendingTransfers}
                suppliers={suppliers}
                onViewReceipt={(txn) => setReceiptTxn(txn)}
                onQuickRestock={(item) => setRestockItem(item)}
                onApproveTransfer={(orderId, trfId) => handleApproveTransfer(orderId, trfId)}
                onRejectTransfer={(trfId) => handleRejectTransfer(trfId)}
                onOpenNewSale={() => setIsPOSOpen(true)}
              />
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans antialiased">
      {/* Left Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={handleMenuChange}
        onOpenNewSale={() => setIsPOSOpen(true)}
        pendingTransfersCount={pendingTransfers.length}
        currentStore={currentStore}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        storeSettings={storeSettings}
      />

      {/* Main Content Area (Offset by 256px on desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 transition-all">
        {/* Top Header */}
        <Header
          currentStore={currentStore}
          setCurrentStore={(store) => {
            setCurrentStore(store);
            showToast(`Switched active store view to ${store.name}`);
          }}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onOpenNewSale={() => setIsPOSOpen(true)}
          onOpenConfirmTransfer={() => setIsTransferModalOpen(true)}
          pendingTransfersCount={pendingTransfers.length}
          setMobileOpen={setMobileOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          storeSettings={storeSettings}
        />

        {/* Main Content Container */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1550px] w-full mx-auto space-y-6">
          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="bg-emerald-800 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                <span>{toastMessage}</span>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-emerald-200 hover:text-white ml-4 text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Conditional View Rendering: one dedicated view per sidebar item */}
          {renderActiveView()}
        </main>
      </div>

      {/* Interactive Modals */}
      <POSModal
        isOpen={isPOSOpen}
        onClose={() => setIsPOSOpen(false)}
        onCompleteSale={handleCompleteSale}
      />

      <ConfirmTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        pendingTransfers={pendingTransfers}
        onApproveTransfer={(orderId, trfId) => {
          handleApproveTransfer(orderId, trfId);
        }}
        onRejectTransfer={(trfId) => {
          handleRejectTransfer(trfId);
        }}
      />

      <ReceiptModal
        isOpen={!!receiptTxn}
        onClose={() => setReceiptTxn(null)}
        transaction={receiptTxn}
        store={currentStore}
        storeSettings={storeSettings}
      />

      <RestockModal
        isOpen={!!restockItem}
        onClose={() => setRestockItem(null)}
        item={restockItem}
        onConfirmRestock={handleConfirmRestock}
      />
    </div>
  );
}

function ParkedView({ onBackToDashboard }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-10 text-center space-y-3 animate-in fade-in duration-200">
      <h2 className="text-lg font-bold text-slate-900">Customers &amp; Credit Ledger</h2>
      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
        This module is parked for a later iteration. Trade credit ledgers, customer running
        balances, and WhatsApp repayment reminders are scoped but not yet implemented.
      </p>
      <button
        type="button"
        onClick={onBackToDashboard}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

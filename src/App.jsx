import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import DailySalesChart from './components/DailySalesChart';
import InventoryDonutChart from './components/InventoryDonutChart';
import DataTableSection from './components/DataTableSection';
import StoreSettingsView from './components/StoreSettingsView';
import POSModal from './components/POSModal';
import ConfirmTransferModal from './components/ConfirmTransferModal';
import ReceiptModal from './components/ReceiptModal';
import RestockModal from './components/RestockModal';
import {
  INITIAL_STORES,
  INITIAL_METRICS,
  DAILY_SALES_TRENDS,
  INVENTORY_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_LOW_STOCK_ITEMS,
  INITIAL_PENDING_TRANSFERS,
  INITIAL_SUPPLIERS
} from './data/mockData';
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
  const [lowStockItems, setLowStockItems] = useState(INITIAL_LOW_STOCK_ITEMS);
  const [pendingTransfers, setPendingTransfers] = useState(INITIAL_PENDING_TRANSFERS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [activeTab, setActiveTab] = useState('transactions');

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
        prev.map((txn) => (txn.id === target.orderId ? { ...txn, status: 'Failed' } : txn))
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
    setLowStockItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              inStock: item.inStock + reorderQty,
              status: item.inStock + reorderQty >= item.minThreshold ? 'Stock OK' : 'Restock Ordered',
            }
          : item
      )
    );

    showToast(`Purchase order issued! +${reorderQty} units dispatched by supplier.`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans antialiased">
      {/* Left Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={(menu) => {
          setActiveMenu(menu);
          if (menu === 'pos') setIsPOSOpen(true);
          if (menu === 'transfers') {
            setActiveTab('transfers');
            setIsTransferModalOpen(true);
          }
          if (menu === 'inventory') {
            setActiveTab('low_stock');
          }
        }}
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

          {/* Conditional View Rendering: Store Settings View vs Dashboard */}
          {activeMenu === 'settings' ? (
            <StoreSettingsView
              settings={storeSettings}
              onSaveSettings={handleSaveStoreSettings}
              onBackToDashboard={() => setActiveMenu('dashboard')}
              showToast={showToast}
              currentStore={currentStore}
              stores={INITIAL_STORES}
            />
          ) : (
            <>
              {/* Section 1: Overview Metric Cards */}
              <section aria-label="Key Performance Indicators">
                <MetricCards
                  metrics={{
                    ...metrics,
                    lowStockCount: lowStockItems.length,
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
                    categories={INVENTORY_CATEGORIES}
                    totalUnits={metrics.totalStockUnits}
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
          )}
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

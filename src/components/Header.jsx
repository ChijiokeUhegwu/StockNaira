import React, { useState } from 'react';
import {
  Store,
  Calendar,
  Plus,
  ArrowRightLeft,
  ChevronDown,
  Menu,
  CheckCircle2,
  Bell,
  Sparkles,
  ShieldCheck,
  Search
} from 'lucide-react';
import { INITIAL_STORES } from '../data/mockData';

export default function Header({
  currentStore,
  setCurrentStore,
  dateRange,
  setDateRange,
  onOpenNewSale,
  onOpenConfirmTransfer,
  pendingTransfersCount = 3,
  setMobileOpen,
  activeMenu = 'dashboard',
  setActiveMenu,
  storeSettings
}) {
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const dateOptions = [
    { label: 'Today (Live Feed)', value: 'Today' },
    { label: 'Sep 1, 2026 - Sep 7, 2026 (7 days active)', value: 'Last 7 Days' },
    { label: 'This Month (Sep 2026)', value: 'This Month' },
    { label: 'Quarter 3 (Q3 2026)', value: 'Q3 2026' }
  ];

  // Per-page title so every sidebar item renders its own workspace identity
  const pageMeta = {
    dashboard: { title: 'Inventory & POS Manager', context: 'Branch overview' },
    inventory: { title: 'Inventory Control', context: 'Stock ledger & reorder cycles' },
    reports: { title: 'Sales Reports', context: 'Revenue, VAT & channel analytics' },
    customers: { title: 'Customers & Credit', context: 'Trade credit ledger' },
    settings: { title: 'Store Settings', context: 'Business & payment configuration' }
  };
  const meta = pageMeta[activeMenu] || pageMeta.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-4 transition-all">
      {/* Top Mobile Bar + Desktop Alignment */}
      <div className="flex flex-col gap-4">
        {/* Row 1: Store selector breadcrumb, Branch switcher, and Mobile Hamburger */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Store Breadcrumb / Switcher Pill (Reference UI: "< Back to projects") */}
            <div className="relative">
              <button
                onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs group"
              >
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span>Store: <strong className="text-slate-900">{currentStore.name}</strong></span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${storeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown menu */}
              {storeDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setStoreDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Store / Branch Location
                    </div>
                    {INITIAL_STORES.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => {
                          setCurrentStore(store);
                          setStoreDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition flex items-start gap-2.5 ${
                          currentStore.id === store.id
                            ? 'bg-emerald-50 text-emerald-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Store className={`w-4 h-4 mt-0.5 shrink-0 ${currentStore.id === store.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <div>
                          <p className="font-semibold text-slate-900">{store.name}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{store.address}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Live Security / Fraud Shield Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>NIP Anti-Fraud Shield Active</span>
            </div>
          </div>

          {/* Right utility badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenConfirmTransfer}
              className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
              title="Pending Bank Alerts"
            >
              <Bell className="w-4 h-4" />
              {pendingTransfersCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white shadow-xs">
                  {pendingTransfersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Big Title, Date Subtitle, and Primary Actions (Exact Reference UI Layout) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-1">
          {/* Title and Date Info */}
          <div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span>StockNaira</span>
              <span className="text-slate-300 font-normal">/</span>
              <span className="text-slate-600 font-semibold text-lg lg:text-xl">
                {meta.title}
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
              {activeMenu === 'settings' ? (
                <>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    {storeSettings?.profile?.storeName || 'Okonkwo & Sons Ltd'}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>CAC: {storeSettings?.profile?.cacNumber || 'RC-1849204'}</span>
                  <span className="text-slate-300">•</span>
                  <span>NIP Live Gateway: {storeSettings?.payment?.nipLiveStatus ? 'Active' : 'Sandbox'}</span>
                </>
              ) : activeMenu === 'dashboard' ? (
                <>
                  {/* Date Selector Dropdown */}
                  <div className="relative inline-block">
                    <button
                      onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                      className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium transition cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dateRange}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {dateDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setDateDropdownOpen(false)}
                        />
                        <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-20">
                          {dateOptions.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setDateRange(opt.value);
                                setDateDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs transition ${
                                dateRange === opt.value
                                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-normal">7 days active</span>
                </>
              ) : (
                <>
                  <span className="text-slate-600 font-medium">{meta.context}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-normal">{currentStore.name}</span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons (Reference UI: "Edit project" and "Create Invoice") */}
          <div className="flex items-center gap-2.5">
            {/* Secondary Action: Add New Sale */}
            <button
              onClick={onOpenNewSale}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition shadow-2xs active:translate-y-[1px]"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>Add New Sale</span>
            </button>

            {/* Primary Action: Confirm Transfer (Signature Nigerian Emerald Green) */}
            <button
              onClick={onOpenConfirmTransfer}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 border border-emerald-800 rounded-xl transition shadow-sm hover:shadow-md active:translate-y-[1px] group"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-200 group-hover:rotate-45 transition-transform" />
              <span>Confirm Transfer</span>
              {pendingTransfersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

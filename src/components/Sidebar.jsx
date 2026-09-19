import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  TrendingUp,
  Users,
  ArrowLeftRight,
  Settings,
  Search,
  Inbox,
  Plus,
  ChevronDown,
  Building2,
  FileText,
  BadgePercent,
  Warehouse,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Sidebar({
  activeMenu,
  setActiveMenu,
  onOpenNewSale,
  pendingTransfersCount = 3,
  currentStore,
  mobileOpen,
  setMobileOpen,
  storeSettings
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'POS Checkout', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory Control', icon: Boxes },
    { id: 'reports', label: 'Sales Reports', icon: TrendingUp },
    { id: 'customers', label: 'Customers & Credit', icon: Users },
    {
      id: 'transfers',
      label: 'Bank Transfers',
      icon: ArrowLeftRight,
      badge: pendingTransfersCount > 0 ? `${pendingTransfersCount}` : null,
      badgeColor: 'bg-amber-100 text-amber-700 font-semibold border border-amber-200'
    },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  const favorites = [
    { id: 'fav-1', name: 'Balogun Main Shop', icon: Building2, color: 'text-emerald-600', action: () => setActiveMenu('dashboard') },
    { id: 'fav-2', name: 'Alaba Warehouse B', icon: Warehouse, color: 'text-blue-600', action: () => setActiveMenu('dashboard') },
    { id: 'fav-3', name: 'Daily Reconciliation', icon: FileText, color: 'text-amber-600', action: () => setActiveMenu('dashboard') },
    { id: 'fav-4', name: 'Tax / 7.5% VAT Summary', icon: BadgePercent, color: 'text-rose-600', action: () => setActiveMenu('settings') },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Workspace Profile Header (Reference UI top left badge) */}
        <div className="p-4 border-b border-slate-100">
          <div
            onClick={() => {
              setActiveMenu('settings');
              if (window.innerWidth < 1024) setMobileOpen(false);
            }}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer border border-transparent hover:border-slate-200/60 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                {storeSettings?.profile?.logoInitials || 'SN'}
              </div>
              <div className="min-w-0 text-left">
                <h2 className="text-sm font-bold text-slate-900 truncate">StockNaira</h2>
                <p className="text-xs text-slate-500 truncate">{storeSettings?.profile?.storeName || 'Okonkwo & Sons Ltd'}</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
          </div>

          {/* Quick Action Button (Reference UI "+ New project") */}
          <button
            onClick={onOpenNewSale}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-300 rounded-xl transition shadow-2xs group"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-600 transition" />
            <span>+ Add New Sale</span>
          </button>
        </div>

        {/* Quick Utility Links (Search, Settings, Inbox) */}
        <div className="px-4 py-2 space-y-0.5 border-b border-slate-100">
          <button
            onClick={() => setActiveMenu('dashboard')}
            className="w-full flex items-center gap-3 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search Catalog / Orders</span>
          </button>
          <button
            onClick={() => {
              setActiveMenu('transfers');
              if (window.innerWidth < 1024) setMobileOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"
          >
            <div className="flex items-center gap-3">
              <Inbox className="w-3.5 h-3.5 text-slate-400" />
              <span>Inbox & Bank Webhooks</span>
            </div>
            {pendingTransfersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          {/* Main Menu */}
          <div>
            <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              MAIN MENU
            </div>
            <nav className="space-y-0.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveMenu(item.id);
                      if (window.innerWidth < 1024) setMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] rounded-full ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Favourites Section (Reference UI FAULT/FAVOURITES) */}
          <div>
            <div className="flex items-center justify-between px-3 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <span>FAVOURITES (04)</span>
            </div>
            <div className="space-y-0.5">
              {favorites.map((fav) => {
                const Icon = fav.icon;
                return (
                  <button
                    key={fav.id}
                    onClick={() => {
                      fav.action?.();
                      if (window.innerWidth < 1024) setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition group text-left"
                  >
                    <div className="w-2 h-2 rounded-xs border border-slate-300 group-hover:border-emerald-500 transition shrink-0" />
                    <Icon className={`w-3.5 h-3.5 ${fav.color} shrink-0`} />
                    <span className="truncate">{fav.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Store Status Indicator */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div
            onClick={() => {
              setActiveMenu('settings');
              if (window.innerWidth < 1024) setMobileOpen(false);
            }}
            className="flex items-center gap-2 px-2 py-1.5 bg-white border border-slate-200/70 rounded-xl hover:border-emerald-300 cursor-pointer transition"
          >
            <div className={`w-2 h-2 rounded-full ${storeSettings?.payment?.nipLiveStatus ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'} shrink-0`} />
            <div className="min-w-0 text-left">
              <p className="text-[11px] font-semibold text-slate-800 truncate">
                NIP Gateway: {storeSettings?.payment?.nipLiveStatus ? 'Active' : 'Sandbox'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{currentStore.name}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

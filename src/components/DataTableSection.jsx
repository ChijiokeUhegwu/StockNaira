import React, { useState } from 'react';
import {
  Receipt,
  AlertTriangle,
  ArrowLeftRight,
  Truck,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Printer,
  ShieldAlert,
  ShieldCheck,
  Plus,
  RefreshCw,
  Phone,
  MessageSquare
} from 'lucide-react';
import { formatNaira, formatCompactNaira } from '../utils/formatters';

export default function DataTableSection({
  activeTab,
  setActiveTab,
  transactions,
  lowStockItems,
  pendingTransfers,
  suppliers,
  onViewReceipt,
  onQuickRestock,
  onApproveTransfer,
  onRejectTransfer,
  onOpenNewSale
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTxnIds, setSelectedTxnIds] = useState([]);
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

  // Tabs definition matching reference UI bottom navigation
  const tabs = [
    { id: 'transactions', label: 'Recent Transactions', count: transactions.length, icon: Receipt },
    { id: 'low_stock', label: 'Low Stock Items', count: lowStockItems.length, icon: AlertTriangle, countColor: 'bg-amber-100 text-amber-800' },
    { id: 'transfers', label: 'Pending Transfers', count: pendingTransfers.length, icon: ArrowLeftRight, countColor: 'bg-blue-100 text-blue-800', isLive: true },
    { id: 'suppliers', label: 'Suppliers & Reorders', count: suppliers.length, icon: Truck },
  ];

  // Filtered transactions
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.items.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (txn.bankRef && txn.bankRef.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPayment =
      paymentFilter === 'all' ||
      (paymentFilter === 'cash' && txn.paymentType === 'Cash') ||
      (paymentFilter === 'pos' && txn.paymentType === 'POS') ||
      (paymentFilter === 'transfer' && txn.paymentType === 'Transfer') ||
      (paymentFilter === 'split' && txn.paymentType === 'Split');

    const matchesStatus =
      statusFilter === 'all' || txn.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesPayment && matchesStatus;
  });

  // Toggle select all transactions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTxnIds(filteredTransactions.map((t) => t.id));
    } else {
      setSelectedTxnIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedTxnIds.includes(id)) {
      setSelectedTxnIds(selectedTxnIds.filter((tId) => tId !== id));
    } else {
      setSelectedTxnIds([...selectedTxnIds, id]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Tab Navigation Header (Reference UI layout with underline active indicator) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 px-4 sm:px-6 pt-3 gap-3">
        <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 pb-3.5 px-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-emerald-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                      tab.countColor || (isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600')
                    }`}
                  >
                    {tab.count < 10 ? `0${tab.count}` : tab.count}
                  </span>
                )}
                {tab.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                )}

                {/* Active Underline Indicator matching reference UI */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action button on right of tab bar */}
        <div className="pb-3 flex items-center gap-2">
          {activeTab === 'transactions' && (
            <button
              onClick={onOpenNewSale}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Sale (POS)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === 'transactions'
                ? 'Search by Customer, Order ID, Bank Ref, or Items...'
                : activeTab === 'low_stock'
                ? 'Search stock items by SKU or Name...'
                : activeTab === 'transfers'
                ? 'Search bank alerts by sender, account or NIP ref...'
                : 'Search suppliers by name or market...'
            }
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Filter dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'transactions' && (
            <>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="text-xs bg-white border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="all">All Payment Methods</option>
                <option value="cash">Cash Only</option>
                <option value="pos">POS Terminal</option>
                <option value="transfer">Bank Transfers</option>
                <option value="split">Split Payments</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-white border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed / Disputed</option>
              </select>
            </>
          )}

          {/* Export / Print helper button */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs"
            title="Export / Print Current View"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Print / Export</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Recent Transactions Table */}
      {activeTab === 'transactions' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200/80">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedTxnIds.length > 0 &&
                      selectedTxnIds.length === filteredTransactions.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Customer Name / Order ID</th>
                <th className="py-3 px-4">Items Purchased</th>
                <th className="py-3 px-4">Total Amount (₦)</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400">
                    No transactions match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  const isSelected = selectedTxnIds.includes(txn.id);
                  const isActionOpen = actionMenuOpenId === txn.id;

                  return (
                    <tr
                      key={txn.id}
                      className={`hover:bg-slate-50/80 transition-colors group ${
                        isSelected ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(txn.id)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>

                      {/* Customer / Order */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-700 shrink-0">
                            {txn.initials}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{txn.customer}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                              <span className="font-bold text-slate-700">{txn.id}</span>
                              <span>•</span>
                              <span>{txn.time}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Items Purchased */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="truncate text-slate-700 font-medium">
                          {txn.items.join(', ')}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {txn.itemCount} item{txn.itemCount > 1 ? 's' : ''} total
                        </span>
                      </td>

                      {/* Total Amount in Naira */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 text-[13px]">
                          {formatNaira(txn.amount)}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          VAT (7.5%): {formatNaira(txn.vat)}
                        </span>
                      </td>

                      {/* Payment Method Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                            txn.paymentType === 'Cash'
                              ? 'bg-slate-100 text-slate-700 border border-slate-200'
                              : txn.paymentType === 'POS'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : txn.paymentType === 'Split'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              txn.paymentType === 'Cash'
                                ? 'bg-slate-400'
                                : txn.paymentType === 'POS'
                                ? 'bg-blue-500'
                                : txn.paymentType === 'Split'
                                ? 'bg-purple-500'
                                : 'bg-emerald-600'
                            }`}
                          />
                          {txn.paymentMethod}
                        </span>
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {txn.status === 'Confirmed' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Confirmed
                          </span>
                        )}
                        {txn.status === 'Pending' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Pending Webhook
                          </span>
                        )}
                        {txn.status === 'Failed' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-red-800 bg-red-50 border border-red-200">
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            Failed / Disputed
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap relative">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewReceipt(txn)}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                          >
                            Receipt
                          </button>

                          <div className="relative">
                            <button
                              onClick={() => setActionMenuOpenId(isActionOpen ? null : txn.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {isActionOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setActionMenuOpenId(null)}
                                />
                                <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 text-left">
                                  <button
                                    onClick={() => {
                                      onViewReceipt(txn);
                                      setActionMenuOpenId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <Receipt className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Print Thermal Receipt</span>
                                  </button>
                                  {txn.status === 'Pending' && (
                                    <button
                                      onClick={() => {
                                        onApproveTransfer(txn.id);
                                        setActionMenuOpenId(null);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs text-emerald-700 font-semibold hover:bg-emerald-50 flex items-center gap-2"
                                    >
                                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Verify & Confirm</span>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      alert(`Customer WhatsApp: ${txn.customerPhone}`);
                                      setActionMenuOpenId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                                    <span>WhatsApp Customer</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Low Stock Items */}
      {activeTab === 'low_stock' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200/80">
                <th className="py-3 px-4">Item Name & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">In Stock / Safety Minimum</th>
                <th className="py-3 px-4">Suggested Reorder</th>
                <th className="py-3 px-4">Unit Wholesale Cost</th>
                <th className="py-3 px-4">Primary Supplier</th>
                <th className="py-3 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lowStockItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{item.name}</div>
                    <span className="font-mono text-[10px] text-slate-500">{item.sku}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{item.category}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-red-600">{item.inStock} units</span>
                      <span className="text-slate-400">/ Min {item.minThreshold}</span>
                    </div>
                    {/* Stock level bar */}
                    <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${(item.inStock / item.minThreshold) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                    +{item.reorderQty} units
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {formatNaira(item.unitPrice)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {item.supplier}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onQuickRestock(item)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition shadow-2xs"
                    >
                      Reorder PO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Pending Transfers (Anti-Fraud NIP Verification Hub) */}
      {activeTab === 'transfers' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200/80">
                <th className="py-3 px-4">Reference & Order ID</th>
                <th className="py-3 px-4">Customer / Sender</th>
                <th className="py-3 px-4">Sender Bank & Account</th>
                <th className="py-3 px-4">Transfer Amount (₦)</th>
                <th className="py-3 px-4">Time & NIP Status</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingTransfers.map((trf) => (
                <tr
                  key={trf.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    trf.isSuspicious ? 'bg-amber-50/30' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900">{trf.sessionRef}</div>
                    <span className="text-[10px] text-slate-500 font-mono">Order: {trf.orderId}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {trf.customer}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{trf.bankName}</div>
                    <span className="font-mono text-[10px] text-slate-500">Acct: {trf.accountNumber}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-[13px]">
                    {formatNaira(trf.amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-600">{trf.timestamp}</div>
                    {trf.matchedWebhook ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Bank Webhook Matched
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-semibold mt-0.5">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Unconfirmed Alert (Verify First)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => onApproveTransfer(trf.orderId, trf.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition shadow-2xs"
                    >
                      Approve Credit
                    </button>
                    <button
                      onClick={() => onRejectTransfer(trf.id)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition"
                    >
                      Flag Fake Alert
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Suppliers & Reorders */}
      {activeTab === 'suppliers' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200/80">
                <th className="py-3 px-4">Supplier Name & Rating</th>
                <th className="py-3 px-4">Category Lines</th>
                <th className="py-3 px-4">Commercial Hub Location</th>
                <th className="py-3 px-4">Lead Time</th>
                <th className="py-3 px-4">Outstanding Credit (₦)</th>
                <th className="py-3 px-4 text-right">Direct Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{sup.name}</div>
                    <span className="text-[10px] text-emerald-700 font-semibold">{sup.rating} Reliability</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{sup.category}</td>
                  <td className="py-3.5 px-4 text-slate-700">{sup.location}</td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    {sup.leadTimeDays} day{sup.leadTimeDays > 1 ? 's' : ''} delivery
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {formatNaira(sup.outstandingBalance)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={`https://wa.me/${sup.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Supplier</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table Footer Pagination / Summary */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          Showing{' '}
          <strong className="text-slate-800 font-mono">
            {activeTab === 'transactions'
              ? filteredTransactions.length
              : activeTab === 'low_stock'
              ? lowStockItems.length
              : activeTab === 'transfers'
              ? pendingTransfers.length
              : suppliers.length}
          </strong>{' '}
          records for {currentStoreName(activeTab)}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Balogun & Lagos Hub Retail Engine</span>
        </div>
      </div>
    </div>
  );
}

function currentStoreName(tab) {
  switch (tab) {
    case 'transactions':
      return 'Today’s Ledger';
    case 'low_stock':
      return 'Stock Safety Thresholds';
    case 'transfers':
      return 'Live Transfer Scanner';
    case 'suppliers':
      return 'Active Wholesale Network';
    default:
      return 'Current View';
  }
}

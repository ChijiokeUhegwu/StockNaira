import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Plus,
  Banknote,
  Search,
  Filter,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle2,
  Calendar,
  CreditCard,
  TrendingDown,
  TrendingUp,
  Download,
  Phone,
  ShieldCheck,
  Building2,
  Clock,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';
import {
  calculateCreditMetrics,
  cleanPhoneNumber,
  buildWhatsAppLink
} from '../data/customerData';
import { formatNaira, formatCompactNaira, formatDate } from '../utils/formatters';
import WhatsAppReminderModal from './WhatsAppReminderModal';
import RecordRepaymentModal from './RecordRepaymentModal';
import RecordCreditSaleModal from './RecordCreditSaleModal';
import AddCustomerModal from './AddCustomerModal';
import CustomerLedgerModal from './CustomerLedgerModal';

export default function CustomersCreditView({
  customers = [],
  setCustomers,
  showToast,
  currentStore,
  storeSettings,
  onRecordGlobalTransaction
}) {
  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'overdue' | 'cleared' | 'vip'
  const [sortBy, setSortBy] = useState('balance_desc');
  const [viewMode, setViewMode] = useState('customers'); // 'customers' | 'consolidated_ledger'

  // Modal states
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isRecordRepaymentOpen, setIsRecordRepaymentOpen] = useState(false);
  const [isRecordCreditSaleOpen, setIsRecordCreditSaleOpen] = useState(false);
  const [whatsAppModalCustomer, setWhatsAppModalCustomer] = useState(null);
  const [ledgerModalCustomer, setLedgerModalCustomer] = useState(null);
  const [activeCustomerForAction, setActiveCustomerForAction] = useState(null);

  // High-level KPI calculation
  const metrics = useMemo(() => calculateCreditMetrics(customers), [customers]);

  // Filtered & Sorted Customers
  const filteredCustomers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return customers
      .filter((c) => {
        // Status filter
        if (statusFilter === 'active' && c.currentBalance <= 0) return false;
        if (statusFilter === 'overdue' && (c.daysOverdue <= 0 || c.currentBalance <= 0)) return false;
        if (statusFilter === 'cleared' && c.currentBalance > 0) return false;
        if (statusFilter === 'vip' && c.tier !== 'Wholesale VIP') return false;

        // Search query
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.businessName?.toLowerCase().includes(q) ||
          c.phone?.includes(q) ||
          c.stallNumber?.toLowerCase().includes(q) ||
          c.address?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'balance_desc') return b.currentBalance - a.currentBalance;
        if (sortBy === 'balance_asc') return a.currentBalance - b.currentBalance;
        if (sortBy === 'overdue_desc') return (b.daysOverdue || 0) - (a.daysOverdue || 0);
        if (sortBy === 'limit_desc') return b.creditLimit - a.creditLimit;
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [customers, searchTerm, statusFilter, sortBy]);

  // Consolidated ledger across all customers (all debits & credits in chronological order)
  const consolidatedLedger = useMemo(() => {
    const all = [];
    customers.forEach((c) => {
      if (Array.isArray(c.ledger)) {
        c.ledger.forEach((entry) => {
          all.push({
            ...entry,
            customerId: c.id,
            customerName: c.name,
            customerBusiness: c.businessName,
            customerPhone: c.phone
          });
        });
      }
    });
    // Sort newest first
    return all.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [customers]);

  // Handlers for Add Customer
  const handleAddCustomer = (newCustomer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    showToast?.(`New customer profile registered: ${newCustomer.name} (${formatNaira(newCustomer.creditLimit)} limit)`);
  };

  // Handlers for Repayment
  const handleConfirmRepayment = (payload) => {
    const { customerId, amount, paymentMethod, reference, cashier, notes, date } = payload;

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c;
        const newBalance = Math.max(0, c.currentBalance - amount);
        const newLedgerEntry = {
          id: `LED-${Math.floor(1000 + Math.random() * 9000)}`,
          date,
          type: 'REPAYMENT',
          reference,
          paymentMethod,
          description: notes || `Credit repayment received via ${paymentMethod}`,
          debit: 0,
          credit: amount,
          balanceAfter: newBalance,
          cashier,
          status: 'Confirmed'
        };

        return {
          ...c,
          currentBalance: newBalance,
          lastPaymentDate: date,
          lastPaymentAmount: amount,
          daysOverdue: newBalance === 0 ? 0 : c.daysOverdue,
          dueDate: newBalance === 0 ? 'N/A (Cleared)' : c.dueDate,
          riskRating: newBalance === 0 ? 'Good Standing' : c.riskRating,
          ledger: [newLedgerEntry, ...(c.ledger || [])]
        };
      })
    );

    // Optionally record to global transactions feed
    const targetCust = customers.find((c) => c.id === customerId);
    if (targetCust && onRecordGlobalTransaction) {
      onRecordGlobalTransaction({
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: targetCust.name,
        customerPhone: targetCust.phone,
        avatar: targetCust.avatar,
        initials: targetCust.initials,
        items: [`Credit Debt Repayment (${reference})`],
        itemCount: 1,
        amount,
        paymentMethod,
        paymentType: paymentMethod.includes('Cash') ? 'Cash' : 'Transfer',
        status: 'Confirmed',
        time: 'Just now',
        date,
        cashier,
        bankRef: reference,
        vat: 0
      });
    }

    showToast?.(`Repayment of ${formatNaira(amount)} recorded for ${targetCust?.name || 'Customer'}.`);
  };

  // Handlers for Credit Sale
  const handleConfirmCreditSale = (payload) => {
    const { customerId, amount, invoiceRef, description, dueDate, paymentTerms, cashier, notes } = payload;

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c;
        const newBalance = c.currentBalance + amount;
        const newLedgerEntry = {
          id: `LED-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString().split('T')[0],
          type: 'CREDIT_SALE',
          reference: invoiceRef,
          description: description || 'Credit Sale Goods Issued',
          debit: amount,
          credit: 0,
          balanceAfter: newBalance,
          cashier,
          dueDate,
          status: 'Unpaid'
        };

        return {
          ...c,
          currentBalance: newBalance,
          dueDate,
          paymentTerms: paymentTerms || c.paymentTerms,
          lifetimePurchases: (c.lifetimePurchases || 0) + amount,
          ledger: [newLedgerEntry, ...(c.ledger || [])]
        };
      })
    );

    const targetCust = customers.find((c) => c.id === customerId);
    showToast?.(`Credit sale of ${formatNaira(amount)} debited to ${targetCust?.name || 'Customer'}.`);
  };

  // Export full customer debt book
  const handleExportDebtBook = () => {
    const headers =
      'Customer ID,Name,Business,Phone,Stall,Tier,Credit Limit (NGN),Outstanding Balance (NGN),Days Overdue,Due Date,Status\n';
    const rows = customers
      .map(
        (c) =>
          `"${c.id}","${c.name}","${c.businessName}","${c.phone}","${c.stallNumber}","${c.tier}","${c.creditLimit}","${c.currentBalance}","${c.daysOverdue}","${c.dueDate}","${c.daysOverdue > 0 ? 'Overdue' : c.currentBalance === 0 ? 'Cleared' : 'Active'}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StockNaira_Trade_Credit_Book_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast?.('Exported Trade Credit Book as CSV.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
              Customers &amp; Credit Ledger
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">{currentStore?.name || 'Balogun Branch'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Trade Credit &amp; Running Debt Ledger
          </h1>
          <p className="text-xs text-slate-500">
            Monitor customer balances, credit limits, overdue repayment aging, and automated WhatsApp payment reminders.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
          <button
            type="button"
            onClick={handleExportDebtBook}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition shadow-2xs"
            title="Download full debt book CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveCustomerForAction(null);
              setIsRecordCreditSaleOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>+ Credit Sale</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveCustomerForAction(null);
              setIsRecordRepaymentOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition shadow-2xs"
          >
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            <span>Record Repayment</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddCustomerOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 border border-emerald-700 rounded-xl transition shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ New Customer</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Summary Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Trade Receivables */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Total Trade Receivables</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono font-bold text-2xl text-slate-900 tracking-tight">
            {formatNaira(metrics.totalReceivables)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>{metrics.activeDebtorsCount} Active Debtor Accounts</span>
            <span className="font-semibold text-slate-700">
              {metrics.utilizationPercent}% of Limit
            </span>
          </div>
        </div>

        {/* Card 2: Overdue Exposure */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200/70 shadow-2xs space-y-2 bg-gradient-to-br from-white to-rose-50/30">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-rose-700">Overdue Debt Exposure</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono font-bold text-2xl text-rose-600 tracking-tight">
            {formatNaira(metrics.overdueAmount)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-rose-600 pt-1 border-t border-rose-100">
            <span className="font-semibold">{metrics.overdueCount} Accounts Past Due</span>
            <span className="font-bold">{metrics.overduePercent}% of Total Debt</span>
          </div>
        </div>

        {/* Card 3: Monthly Repayments Recovered */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Collections This Month</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono font-bold text-2xl text-emerald-700 tracking-tight">
            {formatNaira(metrics.collectionsThisMonth)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Recovery Rate: <strong className="text-emerald-700">{metrics.recoveryRate}%</strong></span>
            <span className="text-slate-400">Sep 2026</span>
          </div>
        </div>

        {/* Card 4: Cleared Accounts & Credit Health */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Cleared Accounts</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono font-bold text-2xl text-slate-900 tracking-tight">
            {metrics.clearedCount} of {metrics.totalCustomersCount}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Zero Outstanding Debt
            </span>
            <span className="text-slate-500">Avg Trust 91%</span>
          </div>
        </div>
      </div>

      {/* Aging Analysis Bar */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Repayment Aging Buckets
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Based on active trade debt maturities &amp; credit agreement terms
          </span>
        </div>

        {/* Progress bar with 4 aging segments */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          {metrics.totalReceivables > 0 && (
            <>
              <div
                style={{ width: `${(metrics.aging.current / metrics.totalReceivables) * 100}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Current (0-7d): ${formatNaira(metrics.aging.current)}`}
              />
              <div
                style={{ width: `${(metrics.aging.medium / metrics.totalReceivables) * 100}%` }}
                className="bg-amber-400 h-full transition-all"
                title={`8-14 Days: ${formatNaira(metrics.aging.medium)}`}
              />
              <div
                style={{ width: `${(metrics.aging.late / metrics.totalReceivables) * 100}%` }}
                className="bg-orange-500 h-full transition-all"
                title={`15-30 Days: ${formatNaira(metrics.aging.late)}`}
              />
              <div
                style={{ width: `${(metrics.aging.critical / metrics.totalReceivables) * 100}%` }}
                className="bg-rose-500 h-full transition-all"
                title={`30+ Days Critical: ${formatNaira(metrics.aging.critical)}`}
              />
            </>
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
            <span className="text-slate-500">Current (0-7d):</span>
            <strong className="text-slate-800 font-mono">{formatCompactNaira(metrics.aging.current)}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 shrink-0" />
            <span className="text-slate-500">8-14 Days:</span>
            <strong className="text-slate-800 font-mono">{formatCompactNaira(metrics.aging.medium)}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
            <span className="text-slate-500">15-30 Days:</span>
            <strong className="text-slate-800 font-mono">{formatCompactNaira(metrics.aging.late)}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 shrink-0" />
            <span className="text-slate-500">30+ Days:</span>
            <strong className="text-slate-800 font-mono">{formatCompactNaira(metrics.aging.critical)}</strong>
          </div>
        </div>
      </div>

      {/* Control Strip: Search, Filters, View Mode Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, shop stall, phone, or market..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          {/* Sort Selector & View Mode Switcher */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('customers')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'customers'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Customer Directory
              </button>
              <button
                type="button"
                onClick={() => setViewMode('consolidated_ledger')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'consolidated_ledger'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Combined Ledger Stream
              </button>
            </div>

            <div className="flex items-center gap-1.5 pl-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="balance_desc">Highest Debt</option>
                <option value="balance_asc">Lowest Debt</option>
                <option value="overdue_desc">Most Days Overdue</option>
                <option value="limit_desc">Highest Credit Limit</option>
                <option value="name_asc">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        {viewMode === 'customers' && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
            {[
              { id: 'all', label: 'All Customers', count: customers.length },
              {
                id: 'active',
                label: 'Active Debt',
                count: metrics.activeDebtorsCount
              },
              {
                id: 'overdue',
                label: 'Overdue / Past Due',
                count: metrics.overdueCount,
                badgeColor: 'text-rose-700 bg-rose-50 border-rose-200'
              },
              {
                id: 'cleared',
                label: 'Zero Debt (Cleared)',
                count: metrics.clearedCount
              },
              {
                id: 'vip',
                label: 'Wholesale VIP',
                count: customers.filter((c) => c.tier === 'Wholesale VIP').length
              }
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-emerald-800 text-white'
                        : tab.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main View: Customer Directory Table */}
      {viewMode === 'customers' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Customers Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No customer accounts match your current search and filter criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Customer &amp; Market Stall</th>
                    <th className="py-3 px-3">Contact &amp; WhatsApp</th>
                    <th className="py-3 px-3">Credit Limit &amp; Utilization</th>
                    <th className="py-3 px-3 text-right">Running Debt</th>
                    <th className="py-3 px-3 text-center">Maturity / Aging</th>
                    <th className="py-3 px-3 text-right">Last Repayment</th>
                    <th className="py-3 px-4 text-right">Ledger Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCustomers.map((c) => {
                    const isOverdue = c.daysOverdue > 0 && c.currentBalance > 0;
                    const isCleared = c.currentBalance === 0;
                    const utilPercent =
                      c.creditLimit > 0
                        ? Math.min(100, Math.round((c.currentBalance / c.creditLimit) * 100))
                        : 0;

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition group">
                        {/* Customer & Market Stall */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-700 text-xs shadow-2xs">
                              {c.avatar ? (
                                <img
                                  src={c.avatar}
                                  alt={c.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                c.initials
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 truncate">{c.name}</span>
                                {c.tier === 'Wholesale VIP' && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                    VIP
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                <span className="font-medium text-slate-700">{c.businessName}</span>
                                <span>•</span>
                                <span className="text-slate-400">{c.stallNumber}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact & WhatsApp */}
                        <td className="py-3.5 px-3">
                          <div className="font-mono text-slate-800 text-[11px]">{c.phone}</div>
                          <button
                            type="button"
                            onClick={() => setWhatsAppModalCustomer(c)}
                            className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 transition"
                          >
                            <MessageSquare className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                            <span>WhatsApp Reminder</span>
                          </button>
                        </td>

                        {/* Credit Limit & Utilization */}
                        <td className="py-3.5 px-3 min-w-[150px]">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-slate-500">Limit: {formatNaira(c.creditLimit)}</span>
                            <span className="font-mono font-bold text-slate-700">{utilPercent}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                utilPercent > 85
                                  ? 'bg-rose-500'
                                  : utilPercent > 60
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${utilPercent}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Terms: {c.paymentTerms}
                          </div>
                        </td>

                        {/* Running Debt Balance */}
                        <td className="py-3.5 px-3 text-right">
                          <div
                            className={`font-mono font-bold text-sm tabular-nums ${
                              isOverdue
                                ? 'text-rose-600'
                                : isCleared
                                ? 'text-emerald-600'
                                : 'text-slate-900'
                            }`}
                          >
                            {formatNaira(c.currentBalance)}
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            Lifetime: {formatCompactNaira(c.lifetimePurchases)}
                          </span>
                        </td>

                        {/* Maturity / Aging Status */}
                        <td className="py-3.5 px-3 text-center">
                          {isOverdue ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              <span>{c.daysOverdue}d Past Due</span>
                            </span>
                          ) : isCleared ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Zero Debt</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                              <Calendar className="w-2.5 h-2.5 text-amber-600" />
                              <span>Due {c.dueDate}</span>
                            </span>
                          )}
                        </td>

                        {/* Last Repayment */}
                        <td className="py-3.5 px-3 text-right">
                          {c.lastPaymentDate !== 'None' ? (
                            <>
                              <div className="font-mono font-bold text-slate-900 text-xs">
                                {formatNaira(c.lastPaymentAmount)}
                              </div>
                              <div className="text-[10px] text-slate-400">{c.lastPaymentDate}</div>
                            </>
                          ) : (
                            <span className="text-slate-400 text-[11px]">No prior records</span>
                          )}
                        </td>

                        {/* Row Ledger Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveCustomerForAction(c);
                                setIsRecordRepaymentOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl border border-emerald-200 transition text-[11px] flex items-center gap-1"
                              title="Record debt repayment"
                            >
                              <Banknote className="w-3 h-3" />
                              <span>Repay</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setLedgerModalCustomer(c)}
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 transition"
                              title="View full customer statement ledger"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Consolidated Combined Activity Stream View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Consolidated Credit &amp; Repayment Activity
              </h2>
              <p className="text-xs text-slate-500">
                Live stream of all credit purchases debited and debt repayments collected across all store customers.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total Entries: <strong>{consolidatedLedger.length}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Debit (+₦)</th>
                  <th className="py-2.5 px-3 text-right">Credit (-₦)</th>
                  <th className="py-2.5 px-3 text-right">Running Balance</th>
                  <th className="py-2.5 px-3">Cashier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {consolidatedLedger.map((row, idx) => {
                  const isSale = row.type === 'CREDIT_SALE';
                  return (
                    <tr key={`${row.id}-${idx}`} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-medium text-slate-900">{row.date}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{row.customerName}</div>
                        <div className="text-[10px] text-slate-500">{row.customerBusiness}</div>
                      </td>
                      <td className="py-3 px-3">
                        {isSale ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <TrendingUp className="w-2.5 h-2.5" /> Credit Sale
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <TrendingDown className="w-2.5 h-2.5" /> Repayment
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                        {row.reference}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">{row.description}</td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-rose-600">
                        {row.debit > 0 ? `+${formatNaira(row.debit)}` : '—'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-600">
                        {row.credit > 0 ? `-${formatNaira(row.credit)}` : '—'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {formatNaira(row.balanceAfter)}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">{row.cashier}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WhatsApp Reminder Modal */}
      <WhatsAppReminderModal
        isOpen={!!whatsAppModalCustomer}
        onClose={() => setWhatsAppModalCustomer(null)}
        customer={whatsAppModalCustomer}
        storeSettings={storeSettings}
        onSuccessToast={showToast}
      />

      {/* Record Repayment Modal */}
      <RecordRepaymentModal
        isOpen={isRecordRepaymentOpen}
        onClose={() => {
          setIsRecordRepaymentOpen(false);
          setActiveCustomerForAction(null);
        }}
        customers={customers}
        selectedCustomer={activeCustomerForAction}
        onConfirmRepayment={handleConfirmRepayment}
      />

      {/* Record Credit Sale Modal */}
      <RecordCreditSaleModal
        isOpen={isRecordCreditSaleOpen}
        onClose={() => {
          setIsRecordCreditSaleOpen(false);
          setActiveCustomerForAction(null);
        }}
        customers={customers}
        selectedCustomer={activeCustomerForAction}
        onConfirmCreditSale={handleConfirmCreditSale}
      />

      {/* Add New Customer Modal */}
      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onAddCustomer={handleAddCustomer}
        totalCustomersCount={customers.length}
      />

      {/* Deep Customer Statement & Ledger Drawer/Modal */}
      <CustomerLedgerModal
        isOpen={!!ledgerModalCustomer}
        onClose={() => setLedgerModalCustomer(null)}
        customer={ledgerModalCustomer}
        onOpenRepayment={(c) => {
          setLedgerModalCustomer(null);
          setActiveCustomerForAction(c);
          setIsRecordRepaymentOpen(true);
        }}
        onOpenCreditSale={(c) => {
          setLedgerModalCustomer(null);
          setActiveCustomerForAction(c);
          setIsRecordCreditSaleOpen(true);
        }}
        onOpenWhatsAppReminder={(c) => {
          setLedgerModalCustomer(null);
          setWhatsAppModalCustomer(c);
        }}
        showToast={showToast}
      />
    </div>
  );
}

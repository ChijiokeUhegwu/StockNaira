import React, { useState } from 'react';
import {
  X,
  FileText,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Plus,
  Banknote,
  Printer,
  Download,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { formatNaira, formatDate } from '../utils/formatters';

export default function CustomerLedgerModal({
  isOpen,
  onClose,
  customer,
  onOpenRepayment,
  onOpenCreditSale,
  onOpenWhatsAppReminder,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'sales' | 'repayments'

  if (!isOpen || !customer) return null;

  const currentDebt = customer.currentBalance || 0;
  const creditLimit = customer.creditLimit || 0;
  const availableCredit = Math.max(0, creditLimit - currentDebt);
  const utilizationPercent =
    creditLimit > 0 ? Math.min(100, Math.round((currentDebt / creditLimit) * 100)) : 0;

  const ledgerEntries = customer.ledger || [];

  const filteredEntries = ledgerEntries.filter((entry) => {
    if (activeTab === 'sales') return entry.type === 'CREDIT_SALE';
    if (activeTab === 'repayments') return entry.type === 'REPAYMENT';
    return true;
  });

  const totalInvoiced = ledgerEntries.reduce((sum, e) => sum + (Number(e.debit) || 0), 0);
  const totalRepaid = ledgerEntries.reduce((sum, e) => sum + (Number(e.credit) || 0), 0);

  const handlePrint = () => {
    window.print?.();
    showToast?.(`Statement for ${customer.name} sent to printer / PDF export.`);
  };

  const handleExportCSV = () => {
    const headers = 'Date,Reference,Type,Description,Debit (NGN),Credit (NGN),Running Balance (NGN),Cashier\n';
    const rows = ledgerEntries
      .map(
        (e) =>
          `"${e.date}","${e.reference}","${e.type}","${e.description}","${e.debit}","${e.credit}","${e.balanceAfter}","${e.cashier}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Statement_${customer.id}_${customer.name.replace(/\s+/g, '_')}.csv`;
    link.click();
    showToast?.(`Ledger statement exported as CSV.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              {customer.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                customer.initials
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{customer.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {customer.id}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {customer.tier}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">{customer.businessName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {customer.stallNumber || customer.address}
                </span>
                <span>•</span>
                <span className="font-mono">{customer.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition"
              title="Print or Export PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Metric Cards & Credit Limit Meter */}
        <div className="p-6 pb-2 border-b border-slate-100 bg-slate-50/50 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Current Debt Balance
              </span>
              <div className="font-mono font-bold text-base text-rose-600 mt-0.5">
                {formatNaira(currentDebt)}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {customer.daysOverdue > 0 ? (
                  <span className="text-rose-600 font-semibold">{customer.daysOverdue} days overdue</span>
                ) : currentDebt === 0 ? (
                  <span className="text-emerald-600 font-semibold">Account Settled</span>
                ) : (
                  <span>Due {customer.dueDate}</span>
                )}
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Approved Credit Limit
              </span>
              <div className="font-mono font-bold text-base text-slate-900 mt-0.5">
                {formatNaira(creditLimit)}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                {formatNaira(availableCredit)} headroom left
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Total Invoiced (Debits)
              </span>
              <div className="font-mono font-bold text-base text-slate-900 mt-0.5">
                {formatNaira(totalInvoiced)}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {customer.paymentTerms} terms
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Total Repaid (Credits)
              </span>
              <div className="font-mono font-bold text-base text-emerald-600 mt-0.5">
                {formatNaira(totalRepaid)}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Trust: {customer.trustScore || 90}/100
              </div>
            </div>
          </div>

          {/* Credit Limit Progress Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs">
              <span className="text-slate-500">Credit Facility Utilization: </span>
              <strong className="text-slate-900 font-mono">{utilizationPercent}%</strong>
              <span className="text-slate-400 text-[11px] ml-1">
                ({formatNaira(currentDebt)} of {formatNaira(creditLimit)})
              </span>
            </div>
            <div className="w-full sm:w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  utilizationPercent > 85 ? 'bg-rose-500' : utilizationPercent > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${utilizationPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Filter & Search for Ledger */}
        <div className="px-6 pt-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: `Complete Ledger (${ledgerEntries.length})` },
              { id: 'sales', label: 'Credit Sales Only' },
              { id: 'repayments', label: 'Repayments Only' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 pb-2.5 font-medium">
            Chronological Running Balance
          </div>
        </div>

        {/* Ledger Table */}
        <div className="flex-1 overflow-y-auto p-6 pt-2">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No entries recorded under this filter yet.
            </div>
          ) : (
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3.5">Date &amp; Ref</th>
                    <th className="py-2.5 px-3">Transaction Type</th>
                    <th className="py-2.5 px-3">Description / Goods</th>
                    <th className="py-2.5 px-3 text-right">Debit (+₦)</th>
                    <th className="py-2.5 px-3 text-right">Credit (-₦)</th>
                    <th className="py-2.5 px-3 text-right">Running Balance</th>
                    <th className="py-2.5 px-3">Cashier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredEntries.map((row) => {
                    const isSale = row.type === 'CREDIT_SALE';
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-slate-900 text-xs">{row.date}</div>
                          <div className="text-[10px] font-mono text-slate-400">{row.reference}</div>
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
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-800 line-clamp-1">{row.description}</div>
                          {row.paymentMethod && (
                            <div className="text-[10px] text-slate-400 mt-0.5">{row.paymentMethod}</div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-rose-600">
                          {row.debit > 0 ? `+${formatNaira(row.debit)}` : '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-600">
                          {row.credit > 0 ? `-${formatNaira(row.credit)}` : '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 bg-slate-50/50">
                          {formatNaira(row.balanceAfter)}
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">
                          {row.cashier || 'Adeola B.'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Quick Action Toolbar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenWhatsAppReminder?.(customer);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] rounded-xl transition shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Reminder</span>
            </button>

            <a
              href={`tel:${customer.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Call Merchant</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenCreditSale?.(customer);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>+ Add Credit Sale</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenRepayment?.(customer);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl transition shadow-sm"
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>Record Repayment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

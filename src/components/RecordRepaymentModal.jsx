import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  Building2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  ArrowRight,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { formatNaira, generateNIPRef } from '../utils/formatters';

export default function RecordRepaymentModal({
  isOpen,
  onClose,
  customers = [],
  selectedCustomer = null,
  onConfirmRepayment,
  onOpenWhatsAppReceipt
}) {
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Transfer');
  const [bankName, setBankName] = useState('Guaranty Trust Bank (GTBank)');
  const [reference, setReference] = useState('');
  const [cashier, setCashier] = useState('Adeola B.');
  const [notes, setNotes] = useState('');
  const [repaymentDate, setRepaymentDate] = useState('2026-09-07');
  const [errorMsg, setErrorMsg] = useState('');

  const currentCust = customers.find((c) => c.id === customerId) || selectedCustomer || customers[0];

  useEffect(() => {
    if (selectedCustomer) {
      setCustomerId(selectedCustomer.id);
      setAmount(selectedCustomer.currentBalance > 0 ? String(selectedCustomer.currentBalance) : '');
    } else if (customers.length > 0 && !customerId) {
      const firstWithDebt = customers.find((c) => c.currentBalance > 0) || customers[0];
      setCustomerId(firstWithDebt.id);
      setAmount(firstWithDebt.currentBalance > 0 ? String(firstWithDebt.currentBalance) : '');
    }
  }, [selectedCustomer, customers, isOpen]);

  useEffect(() => {
    if (paymentMethod === 'Transfer') {
      setReference(generateNIPRef());
    } else if (paymentMethod === 'POS') {
      setReference(`POS-MNP-${Math.floor(100000 + Math.random() * 900000)}`);
    } else if (paymentMethod === 'Cash') {
      setReference(`CSH-REC-${Math.floor(1000 + Math.random() * 9000)}`);
    } else {
      setReference(`CHQ-${Math.floor(10000 + Math.random() * 90000)}`);
    }
  }, [paymentMethod]);

  if (!isOpen) return null;

  const numAmount = Number(amount) || 0;
  const currentDebt = currentCust?.currentBalance || 0;
  const remainingBalanceAfter = Math.max(0, currentDebt - numAmount);

  const handleQuickAmount = (val) => {
    setAmount(String(val));
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentCust) {
      setErrorMsg('Please select a valid customer.');
      return;
    }
    if (numAmount <= 0) {
      setErrorMsg('Please enter a valid repayment amount greater than ₦0.');
      return;
    }

    const payload = {
      customerId: currentCust.id,
      amount: numAmount,
      paymentMethod:
        paymentMethod === 'Transfer'
          ? `Bank Transfer (${bankName.split(' ')[0]})`
          : paymentMethod === 'POS'
          ? 'POS Terminal (Moniepoint)'
          : paymentMethod === 'Cash'
          ? 'Cash (Direct Counter)'
          : 'Cheque',
      reference: reference.trim() || generateNIPRef(),
      cashier,
      notes: notes.trim() || `Customer repayment toward trade credit balance`,
      date: repaymentDate,
      remainingBalanceAfter
    };

    onConfirmRepayment?.(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Record Debt Repayment</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Credit Recovery
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Credit installment, cash counter collection or NIP bank settlement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Debtor / Customer
            </label>
            <select
              value={customerId}
              onChange={(e) => {
                setCustomerId(e.target.value);
                const cust = customers.find((c) => c.id === e.target.value);
                if (cust && cust.currentBalance > 0) {
                  setAmount(String(cust.currentBalance));
                }
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.businessName || c.stallNumber}) — Debt: {formatNaira(c.currentBalance)}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Live Balance Card */}
          {currentCust && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                    {currentCust.initials}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{currentCust.name}</span>
                    <span className="text-[11px] text-slate-500">{currentCust.businessName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Debt</span>
                  <span className="font-mono font-bold text-sm text-rose-600">
                    {formatNaira(currentDebt)}
                  </span>
                </div>
              </div>

              {/* Progress Bar of Settlement */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">
                    Repayment: <strong className="text-slate-800">{formatNaira(numAmount)}</strong>
                  </span>
                  <span className="text-slate-500">
                    New Balance: <strong className="text-emerald-700">{formatNaira(remainingBalanceAfter)}</strong>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{
                      width: currentDebt > 0 ? `${Math.min(100, (numAmount / currentDebt) * 100)}%` : '0%'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Amount Input with Shortcuts */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Repayment Amount (₦)
              </label>
              {currentDebt > 0 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickAmount(currentDebt)}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                  >
                    Clear Full ({formatNaira(currentDebt)})
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAmount(Math.round(currentDebt / 2))}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                  >
                    50% ({formatNaira(Math.round(currentDebt / 2))})
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₦</span>
              <input
                type="number"
                min="1"
                step="500"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="e.g. 50000"
                className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Payment Method Switcher */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Settlement Channel
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'Transfer', label: 'Bank Transfer' },
                { id: 'Cash', label: 'Cash Counter' },
                { id: 'POS', label: 'POS Terminal' },
                { id: 'Cheque', label: 'Cheque / Draft' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`py-2 px-2 text-center rounded-xl text-[11px] font-bold border transition ${
                    paymentMethod === m.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bank / Reference Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentMethod === 'Transfer' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Deposited Bank
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option>Guaranty Trust Bank (GTBank)</option>
                  <option>Moniepoint Microfinance Bank</option>
                  <option>OPay Digital Bank</option>
                  <option>Zenith Bank Plc</option>
                  <option>Access Bank Plc</option>
                  <option>United Bank for Africa (UBA)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Reference / NIP Session No.
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. NIP/884920/GTB"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Cashier / Reconciled By
              </label>
              <select
                value={cashier}
                onChange={(e) => setCashier(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                <option>Adeola B. (Cashier)</option>
                <option>Chinedu O. (Store Mgr)</option>
                <option>Emeka Okonkwo (Director)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Repayment Date
              </label>
              <input
                type="date"
                value={repaymentDate}
                onChange={(e) => setRepaymentDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Internal Ledger Note (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Cash brought by sales boy / partial payment towards Invoice #9921"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Updates customer running balance immediately</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl transition shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm Repayment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  FileText,
  Plus,
  Package
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';
import { PRODUCT_CATALOG } from '../data/mockData';

export default function RecordCreditSaleModal({
  isOpen,
  onClose,
  customers = [],
  selectedCustomer = null,
  onConfirmCreditSale
}) {
  const [customerId, setCustomerId] = useState('');
  const [invoiceRef, setInvoiceRef] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentTerms, setPaymentTerms] = useState('Net 14 days');
  const [dueDate, setDueDate] = useState('');
  const [cashier, setCashier] = useState('Adeola B.');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentCust = customers.find((c) => c.id === customerId) || selectedCustomer || customers[0];

  useEffect(() => {
    if (selectedCustomer) {
      setCustomerId(selectedCustomer.id);
    } else if (customers.length > 0 && !customerId) {
      setCustomerId(customers[0].id);
    }
    setInvoiceRef(`INV-${Math.floor(1000 + Math.random() * 9000)}`);

    // Default due date to 14 days from today
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setDueDate(d.toISOString().split('T')[0]);
  }, [selectedCustomer, customers, isOpen]);

  // Adjust due date when payment terms changes
  const handleTermsChange = (terms) => {
    setPaymentTerms(terms);
    const d = new Date();
    if (terms === 'Net 7 days') d.setDate(d.getDate() + 7);
    else if (terms === 'Net 14 days') d.setDate(d.getDate() + 14);
    else if (terms === 'Net 30 days') d.setDate(d.getDate() + 30);
    setDueDate(d.toISOString().split('T')[0]);
  };

  const handleAddCatalogProduct = () => {
    if (!selectedProduct) return;
    const prod = PRODUCT_CATALOG.find((p) => p.id === selectedProduct);
    if (!prod) return;

    const itemCost = prod.price * Number(quantity || 1);
    const itemDesc = `${prod.name} (x${quantity})`;

    setDescription((prev) => (prev ? `${prev}, ${itemDesc}` : itemDesc));
    setAmount((prev) => String(Number(prev || 0) + itemCost));
    setSelectedProduct('');
    setQuantity(1);
  };

  if (!isOpen) return null;

  const numAmount = Number(amount) || 0;
  const currentDebt = currentCust?.currentBalance || 0;
  const creditLimit = currentCust?.creditLimit || 0;
  const projectedBalance = currentDebt + numAmount;
  const isOverLimit = projectedBalance > creditLimit;
  const overAmount = isOverLimit ? projectedBalance - creditLimit : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentCust) {
      setErrorMsg('Please select a customer.');
      return;
    }
    if (numAmount <= 0) {
      setErrorMsg('Please enter a valid credit sale amount.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please enter product description or invoice items.');
      return;
    }

    const payload = {
      customerId: currentCust.id,
      amount: numAmount,
      invoiceRef: invoiceRef.trim() || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      description: description.trim(),
      dueDate,
      paymentTerms,
      cashier,
      notes: notes.trim() || 'Credit sale authorized on account',
      projectedBalance
    };

    onConfirmCreditSale?.(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Record Credit Sale</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  Trade Credit
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Issue goods on deferred settlement and debit customer ledger
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
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Customer Account
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.businessName || c.stallNumber}) — Limit: {formatNaira(c.creditLimit)} (Balance: {formatNaira(c.currentBalance)})
                </option>
              ))}
            </select>
          </div>

          {/* Credit Limit & Utilization Headroom Card */}
          {currentCust && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Current Debt: <strong className="text-slate-900">{formatNaira(currentDebt)}</strong>
                </span>
                <span className="text-slate-500">
                  Credit Limit: <strong className="text-slate-900">{formatNaira(creditLimit)}</strong>
                </span>
                <span className="text-slate-500">
                  Available: <strong className="text-emerald-700">{formatNaira(Math.max(0, creditLimit - currentDebt))}</strong>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isOverLimit ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (projectedBalance / (creditLimit || 1)) * 100)}%`
                  }}
                />
              </div>

              {isOverLimit && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Warning:</strong> This sale exceeds the customer's credit limit by{' '}
                    <strong className="text-rose-700">{formatNaira(overAmount)}</strong>. Manager authorization applied.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Quick Catalog Adder */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Quick Add From Product Catalog
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              >
                <option value="">Select a product...</option>
                {PRODUCT_CATALOG.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {formatNaira(p.price)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-16 px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-center font-bold"
                placeholder="Qty"
              />
              <button
                type="button"
                onClick={handleAddCatalogProduct}
                disabled={!selectedProduct}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Line items description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Items Supplied / Invoice Summary
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="e.g. Dangote Sugar 50kg (x4), Golden Penny Spaghetti (x15)"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Amount & Invoice Ref */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Sale Amount (₦)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₦</span>
                <input
                  type="number"
                  min="100"
                  step="500"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="e.g. 150000"
                  className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Invoice / Order Number
              </label>
              <input
                type="text"
                value={invoiceRef}
                onChange={(e) => setInvoiceRef(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Terms & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Payment Terms
              </label>
              <div className="grid grid-cols-3 gap-1">
                {['Net 7 days', 'Net 14 days', 'Net 30 days'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTermsChange(t)}
                    className={`py-1.5 text-center rounded-lg text-[10px] font-bold border transition ${
                      paymentTerms === t
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t.replace(' days', 'd')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Settlement Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Cashier & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Authorized By / Cashier
              </label>
              <select
                value={cashier}
                onChange={(e) => setCashier(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              >
                <option>Adeola B. (Cashier)</option>
                <option>Chinedu O. (Store Mgr)</option>
                <option>Emeka Okonkwo (Director)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Internal Note
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Dispatched to Alaba via dispatch van"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            Total Debited:{' '}
            <strong className="text-slate-900 font-mono">{formatNaira(numAmount)}</strong>
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
              <span>Record Credit Sale</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Building2,
  Phone,
  MessageSquare,
  MapPin,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';

export default function AddCustomerModal({
  isOpen,
  onClose,
  onAddCustomer,
  totalCustomersCount = 8
}) {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [stallNumber, setStallNumber] = useState('');
  const [tier, setTier] = useState('Trade Retailer');
  const [creditLimit, setCreditLimit] = useState('500000');
  const [paymentTerms, setPaymentTerms] = useState('Net 14 days');
  const [openingBalance, setOpeningBalance] = useState('0');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter customer full name.');
      return;
    }
    if (!phone.trim() || phone.trim() === '+234') {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');

    const parsedLimit = Number(creditLimit) || 500000;
    const parsedOpeningBalance = Number(openingBalance) || 0;
    const nextId = `CUST-${String(totalCustomersCount + 1).padStart(3, '0')}`;

    const initialLedger = [];
    if (parsedOpeningBalance > 0) {
      initialLedger.push({
        id: `LED-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'CREDIT_SALE',
        reference: 'OPENING-BAL',
        description: 'Opening trade credit balance (Migrated ledger book)',
        debit: parsedOpeningBalance,
        credit: 0,
        balanceAfter: parsedOpeningBalance,
        cashier: 'System Admin',
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        status: 'Unpaid'
      });
    }

    const newCustomer = {
      id: nextId,
      name: name.trim(),
      businessName: businessName.trim() || name.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      avatar: null,
      initials: initials || 'CU',
      address: address.trim() || 'Balogun Commercial Hub, Lagos',
      stallNumber: stallNumber.trim() || 'Balogun Main Market',
      tier,
      creditLimit: parsedLimit,
      currentBalance: parsedOpeningBalance,
      paymentTerms,
      daysOverdue: 0,
      dueDate:
        parsedOpeningBalance > 0
          ? new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
          : 'N/A',
      lastPaymentDate: 'None',
      lastPaymentAmount: 0,
      lifetimePurchases: parsedOpeningBalance,
      riskRating: 'Good Standing',
      trustScore: 90,
      notes: notes.trim() || 'New trade customer profile',
      ledger: initialLedger
    };

    onAddCustomer(newCustomer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Add New Credit Customer</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Customer Profile
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Register merchant, configure credit limit, and assign market stall
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

          {/* Name & Business Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Person Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="e.g. Alhaji Garba Sanusi"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Business / Trading Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Garba Provisions & Oils Ltd"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Phone & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 803 000 0000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp Number (for Reminders)
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Same as phone or enter number"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Market Stall & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Market Stall / Shop Number
              </label>
              <input
                type="text"
                value={stallNumber}
                onChange={(e) => setStallNumber(e.target.value)}
                placeholder="e.g. Shop B12, Breadfruit St"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Market / Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Balogun Market, Lagos Island"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Customer Tier & Payment Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Customer Tier
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                <option>Wholesale VIP</option>
                <option>Trade Retailer</option>
                <option>Regular Merchant</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Default Credit Terms
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                <option>Net 7 days</option>
                <option>Net 14 days</option>
                <option>Net 30 days</option>
              </select>
            </div>
          </div>

          {/* Credit Limit & Initial Opening Debt Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Approved Credit Limit (₦)
              </label>
              <input
                type="number"
                min="50000"
                step="50000"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Opening Balance / Old Debt (₦)
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                placeholder="0 if fresh account"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Internal Relationship Note
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Recommended by Chief Okafor. Pays weekly on Fridays."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Assigned initial trust score: 90/100</span>
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
              <span>Create Customer Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

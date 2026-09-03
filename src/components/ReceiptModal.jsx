import React from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Receipt as ReceiptIcon,
  Store,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';

export default function ReceiptModal({ isOpen, onClose, transaction, store }) {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const vat = transaction.vat || Math.round(transaction.amount * 0.075);
  const subtotal = transaction.amount - vat;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Actions */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ReceiptIcon className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-slate-800">Official Sales Receipt</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Card */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50">
          <div
            id="printable-receipt"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-xs font-mono space-y-4 max-w-sm mx-auto"
          >
            {/* Store Header */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
              <h2 className="text-base font-extrabold tracking-tight text-slate-900 font-sans">
                STOCKNAIRA RETAIL
              </h2>
              <p className="text-[11px] font-semibold text-slate-700 font-sans">
                {store?.name || 'Balogun Main Branch'}
              </p>
              <p className="text-[10px] text-slate-500 font-sans">
                {store?.address || 'Plot 14, Breadfruit St, Balogun, Lagos'}
              </p>
              <p className="text-[10px] text-slate-500 font-sans">
                Tel: +234 803 445 9912 • TIN: 2948201-0001
              </p>
            </div>

            {/* Receipt Metadata */}
            <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-bold text-slate-900">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date/Time:</span>
                <span className="text-slate-800">{transaction.date} • {transaction.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold text-slate-900">{transaction.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cashier:</span>
                <span className="text-slate-800">{transaction.cashier || 'Adeola B.'}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2 pb-3 border-b border-dashed border-slate-300 text-[11px]">
              <div className="font-bold text-slate-800 pb-1 flex justify-between uppercase text-[10px] text-slate-400">
                <span>Item</span>
                <span>Amount</span>
              </div>
              {transaction.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start gap-2">
                  <span className="text-slate-800 font-medium truncate">{item}</span>
                  <span className="font-bold text-slate-900 shrink-0">
                    {/* approximate breakdown */}
                    {formatNaira(Math.round(transaction.amount / transaction.items.length))}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-[11px] pb-3 border-b border-dashed border-slate-300">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Excl. VAT):</span>
                <span>{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT (7.5% Standard):</span>
                <span>{formatNaira(vat)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                <span>TOTAL PAID:</span>
                <span className="text-emerald-800">{formatNaira(transaction.amount)}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-1 text-[10px] text-slate-500 pb-2">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-semibold text-slate-800">{transaction.paymentMethod}</span>
              </div>
              {transaction.bankRef && (
                <div className="flex justify-between">
                  <span>Ref / Session:</span>
                  <span className="font-bold text-slate-800">{transaction.bankRef}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-bold text-emerald-700 uppercase">
                  {transaction.status === 'Confirmed' ? '● Paid & Settled' : '● Pending Confirmation'}
                </span>
              </div>
            </div>

            {/* Barcode & Footer Stamp */}
            <div className="pt-2 text-center space-y-2">
              <div className="flex items-center justify-center gap-1 font-mono tracking-widest text-[9px] text-slate-400">
                ||| | |||| || ||||| ||| |||| |||||
              </div>
              <p className="text-[10px] text-slate-500 font-sans">
                Thank you for your business! No refunds without receipt.
              </p>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[9px] font-sans font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified by StockNaira Engine
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="p-4 bg-white border-t border-slate-200 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal Slip</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  Package,
  MessageSquare,
  AlertTriangle,
  Send
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';

export default function RestockModal({ isOpen, onClose, item, onConfirmRestock }) {
  const [reorderQty, setReorderQty] = useState(item?.reorderQty || 25);
  const [supplierNotes, setSupplierNotes] = useState('Urgent reorder for Balogun Store dispatch.');

  if (!isOpen || !item) return null;

  const totalCost = (item.unitPrice || 10000) * reorderQty;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmRestock(item.id, reorderQty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Restock Purchase Order</h2>
              <p className="text-xs text-slate-500">{item.supplier}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">{item.sku}</span>
            <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
            <div className="flex items-center gap-3 text-slate-600 pt-1 text-[11px]">
              <span>Current Stock: <strong className="text-red-600 font-mono">{item.inStock}</strong> units</span>
              <span>•</span>
              <span>Safety Minimum: <strong className="font-mono">{item.minThreshold}</strong> units</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Reorder Quantity (Units)
              </label>
              <input
                type="number"
                min="1"
                value={reorderQty}
                onChange={(e) => setReorderQty(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono font-bold text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Estimated Total Wholesale Cost
              </label>
              <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl font-mono font-bold text-emerald-900 text-sm">
                {formatNaira(totalCost)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Supplier Dispatch Instructions / Notes
            </label>
            <textarea
              rows="2"
              value={supplierNotes}
              onChange={(e) => setSupplierNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-emerald-200" />
              <span>Issue Purchase Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

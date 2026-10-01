import React, { useState, useEffect } from 'react';
import { X, PackagePlus, Save, Barcode } from 'lucide-react';
import { STOCK_CATEGORIES } from '../data/inventoryData';
import { formatNaira } from '../utils/formatters';

const EMPTY_FORM = {
  sku: '',
  name: '',
  category: 'Provisions',
  unitsInStock: 0,
  reorderPoint: 10,
  suggestedReorder: 25,
  costPrice: 0,
  unitPrice: 0,
  supplier: '',
};

export default function AddProductModal({ isOpen, onClose, onAddProduct }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) setForm(EMPTY_FORM);
  }, [isOpen]);

  if (!isOpen) return null;

  const margin =
    form.unitPrice > 0 ? ((form.unitPrice - form.costPrice) / form.unitPrice) * 100 : 0;

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.sku.trim() || !form.name.trim()) {
      alert('SKU and Item Name are required to create a stock item.');
      return;
    }
    if (Number(form.unitPrice) < Number(form.costPrice)) {
      alert('Unit Price (retail) cannot be lower than Cost Price (wholesale).');
      return;
    }
    onAddProduct({
      sku: form.sku.trim().toUpperCase(),
      name: form.name.trim(),
      category: form.category,
      unitsInStock: Math.max(0, Number(form.unitsInStock) || 0),
      reorderPoint: Math.max(0, Number(form.reorderPoint) || 0),
      suggestedReorder: Math.max(0, Number(form.suggestedReorder) || 0),
      costPrice: Math.max(0, Number(form.costPrice) || 0),
      unitPrice: Math.max(0, Number(form.unitPrice) || 0),
      supplier: form.supplier.trim() || 'Unassigned Supplier',
    });
  };

  const fieldClass =
    'w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 hover:bg-white transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add New Stock Item</h2>
              <p className="text-xs text-slate-500">
                Insert a wholesale SKU into the {form.category} department ledger
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                SKU Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => update('sku', e.target.value)}
                  placeholder="e.g. GRO-DN-042"
                  className={`${fieldClass} font-mono pr-9`}
                />
                <Barcode className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="e.g. Dangote Sugar 50kg Bag"
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Category</label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className={fieldClass}
              >
                {STOCK_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.fullLabel})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Opening Stock (Units)</label>
              <input
                type="number"
                min="0"
                value={form.unitsInStock}
                onChange={(e) => update('unitsInStock', e.target.value)}
                className={`${fieldClass} font-mono`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Reorder Point (Units)</label>
              <input
                type="number"
                min="0"
                value={form.reorderPoint}
                onChange={(e) => update('reorderPoint', e.target.value)}
                className={`${fieldClass} font-mono`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Cost Price (\u20A6)</label>
              <input
                type="number"
                min="0"
                value={form.costPrice}
                onChange={(e) => update('costPrice', e.target.value)}
                className={`${fieldClass} font-mono font-bold`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Unit Price (\u20A6)</label>
              <input
                type="number"
                min="0"
                value={form.unitPrice}
                onChange={(e) => update('unitPrice', e.target.value)}
                className={`${fieldClass} font-mono font-bold`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Expected Margin</label>
              <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 font-mono font-bold text-emerald-900">
                {margin.toFixed(1)}% &middot; {formatNaira(form.unitPrice - form.costPrice)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Primary Supplier</label>
              <input
                type="text"
                value={form.supplier}
                onChange={(e) => update('supplier', e.target.value)}
                placeholder="e.g. Dangote Foods Direct Lagos"
                className={fieldClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Suggested Reorder Quantity (Units)
              </label>
              <input
                type="number"
                min="0"
                value={form.suggestedReorder}
                onChange={(e) => update('suggestedReorder', e.target.value)}
                className={`${fieldClass} font-mono`}
              />
            </div>
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
              <Save className="w-3.5 h-3.5 text-emerald-200" />
              <span>Save Stock Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

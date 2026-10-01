import React, { useState, useMemo, useEffect } from 'react';
import { X, Truck, Send, Check, PackageX, AlertTriangle, Sparkles } from 'lucide-react';
import { formatNaira } from '../utils/formatters';
import { getStockStatus, getStockStatusMeta } from '../data/inventoryData';

export default function BatchRestockModal({ isOpen, onClose, items, onBatchRestock }) {
  const [showAll, setShowAll] = useState(false);
  const [draft, setDraft] = useState({});

  const candidates = useMemo(
    () => (showAll ? items : items.filter((i) => getStockStatus(i) !== 'Stock OK')),
    [items, showAll]
  );

  useEffect(() => {
    if (!isOpen) return;
    const next = {};
    candidates.forEach((item) => {
      next[item.id] = item.unitsInStock <= 0 ? item.suggestedReorder : item.suggestedReorder;
    });
    setDraft(next);
  }, [isOpen, candidates]);

  if (!isOpen) return null;

  const setQty = (id, qty) =>
    setDraft((prev) => ({ ...prev, [id]: Math.max(0, Number(qty) || 0) }));

  const restockToTarget = (multiplier) => {
    const next = {};
    candidates.forEach((item) => {
      const target = item.reorderPoint * multiplier;
      const needed = Math.max(0, target - item.unitsInStock);
      next[item.id] = needed > 0 ? Math.ceil(needed) : item.suggestedReorder;
    });
    setDraft(next);
  };

  const lines = candidates
    .map((item) => ({
      item,
      qty: draft[item.id] ?? 0,
      lineTotal: (draft[item.id] ?? 0) * item.costPrice,
    }))
    .filter((l) => l.qty > 0);

  const totalUnits = lines.reduce((s, l) => s + l.qty, 0);
  const totalCost = lines.reduce((s, l) => s + l.lineTotal, 0);
  const outOfStockLines = lines.filter((l) => l.item.unitsInStock <= 0).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lines.length === 0) {
      alert('Set a restock quantity for at least one SKU before issuing purchase orders.');
      return;
    }
    onBatchRestock(lines.map((l) => ({ id: l.item.id, qty: l.qty })));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Batch Restock Purchase Orders</h2>
              <p className="text-xs text-slate-500">
                Raise supplier POs for every SKU below its reorder point
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Preset shortcuts */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">Quick fill presets</p>
                <p className="text-[11px] text-slate-500">
                  {outOfStockLines} stockout line(s) need same-day supplier dispatch
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => restockToTarget(2)}
                className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg transition"
              >
                Top up to 2x reorder point
              </button>
              <button
                type="button"
                onClick={() => restockToTarget(3)}
                className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg transition"
              >
                Top up to 3x reorder point
              </button>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAll}
                  onChange={(e) => setShowAll(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                Include healthy SKUs
              </label>
            </div>
          </div>

          {/* Restock lines */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
            <div className="max-h-[46vh] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200/80">
                    <th className="py-2.5 px-3">SKU / Item</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">In Stock</th>
                    <th className="py-2.5 px-3 text-right">Cost (\u20A6)</th>
                    <th className="py-2.5 px-3 text-right">Restock Qty</th>
                    <th className="py-2.5 px-3 text-right">Line Total (\u20A6)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        Every SKU in this branch is above its reorder point. Enable &quot;Include
                        healthy SKUs&quot; to top up anyway.
                      </td>
                    </tr>
                  ) : (
                    candidates.map((item) => {
                      const meta = getStockStatusMeta(item);
                      const qty = draft[item.id] ?? 0;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 max-w-[220px]">
                            <div className="font-mono font-bold text-slate-800">{item.sku}</div>
                            <div className="text-[11px] text-slate-600 truncate">{item.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{item.supplier}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${meta.badge}`}
                            >
                              {meta.label === 'Out of Stock' ? (
                                <PackageX className="w-3 h-3" />
                              ) : meta.label === 'Reorder Needed' ? (
                                <AlertTriangle className="w-3 h-3" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                              {meta.label}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                            {item.unitsInStock.toLocaleString('en-NG')}
                            <span className="block text-[10px] text-slate-400 font-normal">
                              min {item.reorderPoint}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                            {formatNaira(item.costPrice)}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              min="0"
                              value={qty}
                              onChange={(e) => setQty(item.id, e.target.value)}
                              className="w-20 px-2 py-1 text-xs font-mono font-bold text-right border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                            <span className="block text-[10px] text-slate-400 font-mono">
                              PO +{item.suggestedReorder}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            {formatNaira(qty * item.costPrice)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals + submit */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-200">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  PO Lines
                </p>
                <p className="font-mono font-bold text-slate-900">{lines.length}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Units Inbound
                </p>
                <p className="font-mono font-bold text-slate-900">
                  +{totalUnits.toLocaleString('en-NG')}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Est. Wholesale Cost
                </p>
                <p className="font-mono font-bold text-emerald-800">{formatNaira(totalCost)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
                <span>Issue Purchase Orders</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

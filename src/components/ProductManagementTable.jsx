import React, { useState, useMemo } from 'react';
import {
  Search,
  Package,
  Truck,
  Pencil,
  Filter,
  Printer,
  X,
  Check,
  ArrowUpDown,
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';
import { STOCK_CATEGORIES, getStockStatusMeta, isFastMover } from '../data/inventoryData';

const COLUMNS = [
  { id: 'sku', label: 'SKU', sortable: true },
  { id: 'name', label: 'Item Name', sortable: true },
  { id: 'category', label: 'Category', sortable: true },
  { id: 'unitsInStock', label: 'Stock Level (Units)', sortable: true, numeric: true },
  { id: 'reorderPoint', label: 'Reorder Point', sortable: true, numeric: true },
  { id: 'unitPrice', label: 'Unit Price (\u20A6)', sortable: true, numeric: true },
  { id: 'costPrice', label: 'Cost Price (\u20A6)', sortable: true, numeric: true },
  { id: 'actions', label: 'Action', sortable: false, numeric: false },
];

export default function ProductManagementTable({
  items,
  allItems = [],
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  onRestock,
  onUpdateProduct,
  onOpenBatchRestock,
}) {
  const [sortKey, setSortKey] = useState('sku');
  const [sortDir, setSortDir] = useState('asc');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);

  const sortedItems = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return copy;
  }, [items, sortKey, sortDir]);

  const handleSort = (colId) => {
    if (sortKey === colId) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(colId);
      setSortDir('asc');
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setDraft({
      name: item.name,
      unitsInStock: item.unitsInStock,
      reorderPoint: item.reorderPoint,
      unitPrice: item.unitPrice,
      costPrice: item.costPrice,
      supplier: item.supplier,
    });
  };

  const commitEdit = () => {
    onUpdateProduct(editingId, {
      ...draft,
      unitsInStock: Math.max(0, Number(draft.unitsInStock) || 0),
      reorderPoint: Math.max(0, Number(draft.reorderPoint) || 0),
      unitPrice: Math.max(0, Number(draft.unitPrice) || 0),
      costPrice: Math.max(0, Number(draft.costPrice) || 0),
    });
    setEditingId(null);
    setDraft(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const reorderItemTotal = allItems
    .filter((i) => i.unitsInStock <= i.reorderPoint)
    .reduce((sum, i) => sum + i.suggestedReorder, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table header: title + live record count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <Package className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Product Management</h3>
            <p className="text-[11px] text-slate-500">
              Showing {items.length} of {allItems.length} stock items
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenBatchRestock}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs"
          >
            <Truck className="w-3.5 h-3.5 text-slate-400" />
            <span>Batch Restock</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs"
            title="Print stock ledger"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Print Ledger</span>
          </button>
        </div>
      </div>

      {/* Search + category toolbar */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stock items by SKU, item name, or supplier..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <Filter className="w-3 h-3 text-slate-400" />
            Category
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
          >
            <option value="all">All Categories</option>
            {STOCK_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200/80">
              {COLUMNS.map((col) => (
                <th
                  key={col.id}
                  className={`py-3 px-4 ${col.numeric ? 'text-right' : ''} ${
                    col.id === 'actions' ? 'text-right' : ''
                  }`}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.id)}
                      className={`inline-flex items-center gap-1 hover:text-slate-800 transition ${
                        col.numeric ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {col.label}
                      <ArrowUpDown
                        className={`w-3 h-3 ${sortKey === col.id ? 'text-emerald-600' : 'text-slate-300'}`}
                      />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedItems.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="py-12 text-center text-slate-400">
                  No stock items match the current filter, category, or search term.
                </td>
              </tr>
            ) : (
              sortedItems.map((item) => {
                const meta = getStockStatusMeta(item);
                const isEditing = editingId === item.id;
                const fast = isFastMover(item);
                const margin =
                  item.unitPrice > 0
                    ? ((item.unitPrice - item.costPrice) / item.unitPrice) * 100
                    : 0;
                const barPct =
                  item.reorderPoint > 0
                    ? Math.min(100, (item.unitsInStock / (item.reorderPoint * 2)) * 100)
                    : 100;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      meta.label === 'Out of Stock' ? 'bg-red-50/25' : ''
                    }`}
                  >
                    {/* SKU */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-800">{item.sku}</span>
                    </td>

                    {/* Item Name + supplier */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {isEditing ? (
                        <input
                          value={draft.name}
                          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      ) : (
                        <>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span className="truncate">{item.name}</span>
                            {fast && (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
                                FAST
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {item.supplier}
                          </span>
                        </>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                          item.category === 'Provisions'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.category === 'Gadgets'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-orange-50 text-orange-700 border-orange-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.category === 'Provisions'
                              ? 'bg-emerald-600'
                              : item.category === 'Gadgets'
                              ? 'bg-blue-600'
                              : 'bg-orange-600'
                          }`}
                        />
                        {item.category}
                      </span>
                    </td>

                    {/* Stock Level */}
                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={draft.unitsInStock}
                          onChange={(e) => setDraft({ ...draft, unitsInStock: e.target.value })}
                          className="w-20 px-2 py-1 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-right"
                        />
                      ) : (
                        <>
                          <div className="flex items-center justify-end gap-2">
                            <span className={`font-mono font-bold text-[13px] ${meta.text}`}>
                              {item.unitsInStock.toLocaleString('en-NG')}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${meta.badge}`}
                            >
                              {meta.label}
                            </span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1 ml-auto">
                            <div
                              className={`h-full rounded-full ${meta.bar} transition-all`}
                              style={{ width: `${Math.max(4, barPct)}%` }}
                            />
                          </div>
                        </>
                      )}
                    </td>

                    {/* Reorder Point */}
                    <td className="py-3.5 px-4 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={draft.reorderPoint}
                          onChange={(e) => setDraft({ ...draft, reorderPoint: e.target.value })}
                          className="w-20 px-2 py-1 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-right"
                        />
                      ) : (
                        <>
                          <span className="font-mono font-semibold text-slate-800">
                            {item.reorderPoint}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-mono">
                            PO +{item.suggestedReorder}
                          </span>
                        </>
                      )}
                    </td>

                    {/* Unit Price */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={draft.unitPrice}
                          onChange={(e) => setDraft({ ...draft, unitPrice: e.target.value })}
                          className="w-24 px-2 py-1 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-right"
                        />
                      ) : (
                        <span className="font-mono font-bold text-slate-900 text-[13px]">
                          {formatNaira(item.unitPrice)}
                        </span>
                      )}
                    </td>

                    {/* Cost Price */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={draft.costPrice}
                          onChange={(e) => setDraft({ ...draft, costPrice: e.target.value })}
                          className="w-24 px-2 py-1 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-right"
                        />
                      ) : (
                        <>
                          <span className="font-mono font-bold text-slate-900 text-[13px]">
                            {formatNaira(item.costPrice)}
                          </span>
                          <span className="block text-[10px] font-mono text-emerald-700">
                            {margin.toFixed(0)}% margin
                          </span>
                        </>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <span className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={commitEdit}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                          >
                            <Pencil className="w-3 h-3 text-slate-400" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onRestock(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition shadow-2xs"
                          >
                            <Truck className="w-3 h-3 text-emerald-200" />
                            Restock
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          Showing <strong className="text-slate-800 font-mono">{items.length}</strong> of{' '}
          <strong className="text-slate-800 font-mono">{allItems.length}</strong> stock items
        </div>
        <div className="text-[11px] text-slate-400">
          Suggested replenishment across below-threshold SKUs:{' '}
          <strong className="font-mono text-slate-700">
            +{reorderItemTotal.toLocaleString('en-NG')} units
          </strong>
        </div>
      </div>
    </div>
  );
}

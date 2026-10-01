import React, { useState, useMemo } from 'react';
import { Plus, RefreshCw, Boxes } from 'lucide-react';
import InventorySummaryWidgets from './InventorySummaryWidgets';
import ProductManagementTable from './ProductManagementTable';
import StockStatusFilterTabs from './StockStatusFilterTabs';
import AddProductModal from './AddProductModal';
import BatchRestockModal from './BatchRestockModal';
import {
  buildInventorySummary,
  buildCategoryBreakdown,
  matchesStockFilter,
  toLowStockRow,
} from '../data/inventoryData';

export default function InventoryControlView({
  stockItems,
  setStockItems,
  showToast,
  currentStore,
  onQuickRestock,
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isBatchRestockOpen, setIsBatchRestockOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return stockItems.filter((item) => {
      if (!matchesStockFilter(item, activeFilter)) return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.supplier.toLowerCase().includes(q)
      );
    });
  }, [stockItems, activeFilter, categoryFilter, searchTerm]);

  const summary = useMemo(() => buildInventorySummary(stockItems), [stockItems]);
  const categoryBreakdown = useMemo(() => buildCategoryBreakdown(stockItems), [stockItems]);
  const restockCandidates = useMemo(
    () => stockItems.filter((i) => i.unitsInStock <= i.reorderPoint),
    [stockItems]
  );

  const handleAddProduct = (payload) => {
    setStockItems((prev) => [
      {
        ...payload,
        id: `STK-${String(prev.length + 1).padStart(2, '0')}`,
        unitsSold30d: 0,
        lastRestocked: 'Newly added',
      },
      ...prev,
    ]);
    setIsAddProductOpen(false);
    showToast(`Product added to catalog: ${payload.name} (${payload.sku})`);
  };

  const handleUpdateProduct = (itemId, patch) => {
    setStockItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, ...patch } : i)));
  };

  const handleQuickRestock = (item) => {
    onQuickRestock?.(toLowStockRow(item));
  };

  const handleBatchRestock = (updates) => {
    setStockItems((prev) =>
      prev.map((item) => {
        const add = updates.find((u) => u.id === item.id);
        if (!add) return item;
        return {
          ...item,
          unitsInStock: item.unitsInStock + add.qty,
          lastRestocked: 'Just now',
        };
      })
    );
    setIsBatchRestockOpen(false);
    const totalUnits = updates.reduce((s, u) => s + u.qty, 0);
    showToast(`Batch restock issued: +${totalUnits} units across ${updates.length} SKUs.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Boxes className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
              Inventory Control
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">{currentStore?.name || 'Balogun Branch'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Stock Ledger & Reorder Management
          </h1>
          <p className="text-xs text-slate-500">
            Track wholesale stock levels, reorder points, valuation, and supplier restock cycles.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsBatchRestockOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Batch Restock</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 border border-emerald-700 rounded-xl transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      <InventorySummaryWidgets
        summary={summary}
        categoryBreakdown={categoryBreakdown}
        onSelectCategory={setCategoryFilter}
        activeCategory={categoryFilter}
      />

      <StockStatusFilterTabs
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        summary={summary}
        totalCount={stockItems.length}
      />

      <ProductManagementTable
        items={filteredItems}
        allItems={stockItems}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        onRestock={handleQuickRestock}
        onUpdateProduct={handleUpdateProduct}
        onOpenBatchRestock={() => setIsBatchRestockOpen(true)}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <BatchRestockModal
        isOpen={isBatchRestockOpen}
        onClose={() => setIsBatchRestockOpen(false)}
        items={restockCandidates}
        onBatchRestock={handleBatchRestock}
      />
    </div>
  );
}

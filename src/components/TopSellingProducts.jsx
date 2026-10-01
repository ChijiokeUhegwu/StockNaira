import React from 'react';
import { Trophy, Package, ArrowUpRight } from 'lucide-react';
import { formatNaira, formatCompactNaira } from '../utils/formatters';

const CATEGORY_BADGE = {
  Provisions: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Gadgets: 'bg-blue-50 text-blue-700 border-blue-200',
  Fashion: 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function TopSellingProducts({ products, limit = 6 }) {
  const top = products.slice(0, limit);
  const maxRevenue = top.length ? top[0].revenue : 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Top Selling Products</h3>
            <p className="text-[11px] text-slate-500">Ranked by revenue generated in period</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 font-mono">
          {products.length} SKUs
        </span>
      </div>

      <div className="space-y-2.5 flex-1">
        {top.map((product, index) => (
          <div
            key={product.sku}
            className="group p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                  index === 0
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : index === 1
                    ? 'bg-slate-200 text-slate-700'
                    : index === 2
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{product.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[10px] text-slate-400">{product.sku}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[9px] font-semibold border ${
                      CATEGORY_BADGE[product.category] || CATEGORY_BADGE.Provisions
                    }`}
                  >
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono font-bold text-[13px] text-slate-900">
                  {formatNaira(product.revenue)}
                </p>
                <p className="text-[10px] text-slate-400 font-mono inline-flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {product.unitsSold.toLocaleString('en-NG')} units
                </p>
              </div>
            </div>

            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500"
                style={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              {product.unitsSold} u &times; {formatCompactNaira(product.unitPrice)} shelf price
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          Combined revenue of top {top.length}:{' '}
          <strong className="font-mono text-slate-800">
            {formatNaira(top.reduce((s, p) => s + p.revenue, 0))}
          </strong>
        </span>
        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
          <ArrowUpRight className="w-3 h-3" />
          Volume leader
        </span>
      </div>
    </div>
  );
}

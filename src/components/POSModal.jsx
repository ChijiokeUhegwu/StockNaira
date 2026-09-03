import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Search,
  ShoppingCart,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  CheckCircle2,
  Split,
  Percent,
  Receipt,
  AlertCircle
} from 'lucide-react';
import { PRODUCT_CATALOG } from '../data/mockData';
import { formatNaira } from '../utils/formatters';

export default function POSModal({ isOpen, onClose, onCompleteSale }) {
  const [catalog, setCatalog] = useState(PRODUCT_CATALOG);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([
    { ...PRODUCT_CATALOG[0], quantity: 1 }, // Dangote Sugar 50kg
    { ...PRODUCT_CATALOG[1], quantity: 3 }, // Golden Penny Spaghetti 500g
  ]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('+234 80');
  const [paymentMethod, setPaymentMethod] = useState('Transfer'); // Cash, POS, Transfer, Split
  const [splitCashAmount, setSplitCashAmount] = useState(10000);
  const [cashTendered, setCashTendered] = useState(50000);
  const [includeVat, setIncludeVat] = useState(true);

  if (!isOpen) return null;

  const categories = ['All', 'Groceries', 'Electronics', 'Fashion'];

  const filteredCatalog = catalog.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, delta) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vatAmount = includeVat ? Math.round(subtotal * 0.075) : 0; // 7.5% Nigerian VAT
  const totalAmount = subtotal + vatAmount;

  // Split calculations
  const splitTransferAmount = Math.max(0, totalAmount - splitCashAmount);
  const cashChange = paymentMethod === 'Cash' ? Math.max(0, cashTendered - totalAmount) : 0;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Please add at least one item to the cart.');
      return;
    }

    const orderId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsPurchased = cart.map((i) => `${i.name} (x${i.quantity})`);
    const formattedPaymentMethod =
      paymentMethod === 'Cash'
        ? 'Cash'
        : paymentMethod === 'POS'
        ? 'POS (Moniepoint)'
        : paymentMethod === 'Split'
        ? `Split (Cash ${formatNaira(splitCashAmount)} + Transfer ${formatNaira(splitTransferAmount)})`
        : 'Bank Transfer (Direct NIP)';

    const newTransaction = {
      id: orderId,
      customer: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '+234 800 000 0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
      initials: (customerName || 'WC')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      items: itemsPurchased,
      itemCount: cart.reduce((sum, i) => sum + i.quantity, 0),
      amount: totalAmount,
      paymentMethod: formattedPaymentMethod,
      paymentType: paymentMethod,
      status: paymentMethod === 'Transfer' ? 'Pending' : 'Confirmed',
      time: 'Just Now',
      date: new Date().toISOString().split('T')[0],
      cashier: 'Adeola B.',
      bankRef: paymentMethod === 'Transfer' ? `NIP/${Date.now().toString().slice(-8)}/LIVE` : `POS-${Date.now().toString().slice(-6)}`,
      vat: vatAmount
    };

    onCompleteSale(newTransaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add New Sale (POS Terminal)</h2>
              <p className="text-xs text-slate-500">Balogun Branch • Cashier: Adeola B.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Product Catalog (60%) & Right Order Summary (40%) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Column: Product Selection Catalog */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col h-full overflow-hidden">
            {/* Search & Filter */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Scan barcode or search products by name, SKU..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
              </div>

              {/* Category chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-xs font-semibold rounded-xl transition whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredCatalog.map((product) => {
                const inCart = cart.find((item) => item.id === product.id);
                const isLowStock = product.stock <= 5;

                return (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left group ${
                      inCart
                        ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-500/20'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-mono text-slate-400 truncate">
                          {product.sku}
                        </span>
                        {isLowStock && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                            {product.stock} left
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                        {product.name}
                      </h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-mono font-bold text-emerald-800 text-xs">
                        {formatNaira(product.price)}
                      </span>
                      <button
                        className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Checkout Cart & Payment Methods */}
          <div className="lg:col-span-5 p-4 sm:p-6 bg-slate-50/60 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Alhaji Musa"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="+234 80..."
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Cart Items ({cart.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="text-[11px] text-red-600 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-40 overflow-y-auto divide-y divide-slate-200/60 bg-white rounded-2xl border border-slate-200/80 p-2 space-y-1">
                  {cart.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      Cart is empty. Click items on the left to add.
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="py-2 px-1 flex items-center justify-between gap-2 text-xs">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">{formatNaira(item.price)} each</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs px-1 text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="font-mono font-bold text-slate-900 text-right min-w-[70px]">
                          {formatNaira(item.price * item.quantity)}
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'Transfer', label: 'Transfer (NIP)', icon: ArrowRightLeft },
                    { id: 'POS', label: 'POS Terminal', icon: CreditCard },
                    { id: 'Cash', label: 'Cash (Naira)', icon: Banknote },
                    { id: 'Split', label: 'Split Pay', icon: Split },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    const isSelected = paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <span className="text-[10px] leading-tight">{pm.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Split Payment Helper */}
                {paymentMethod === 'Split' && (
                  <div className="mt-3 p-3 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2 text-xs">
                    <p className="font-semibold text-purple-900 text-[11px]">Nigerian Mixed Payment Split</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-purple-700 block">Cash Portion (₦)</label>
                        <input
                          type="number"
                          value={splitCashAmount}
                          onChange={(e) => setSplitCashAmount(Number(e.target.value))}
                          className="w-full px-2.5 py-1 text-xs bg-white border border-purple-200 rounded-lg font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-purple-700 block">Transfer Balance (₦)</label>
                        <input
                          type="text"
                          readOnly
                          value={formatNaira(splitTransferAmount)}
                          className="w-full px-2.5 py-1 text-xs bg-purple-100 border border-purple-200 rounded-lg font-mono font-bold text-purple-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Cash Change Helper */}
                {paymentMethod === 'Cash' && (
                  <div className="mt-3 p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-emerald-800 font-semibold block">Cash Tendered (₦)</label>
                        <input
                          type="number"
                          value={cashTendered}
                          onChange={(e) => setCashTendered(Number(e.target.value))}
                          className="w-full px-2.5 py-1 text-xs bg-white border border-emerald-300 rounded-lg font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-emerald-800 font-semibold block">Change Due (₦)</label>
                        <div className="px-2.5 py-1 text-xs bg-emerald-100 border border-emerald-300 rounded-lg font-mono font-bold text-emerald-900">
                          {formatNaira(cashChange)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Total Summary & Checkout Button */}
            <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-mono font-medium">{formatNaira(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeVat}
                    onChange={(e) => setIncludeVat(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>VAT (7.5% Nigerian Standard)</span>
                </label>
                <span className="font-mono font-medium">{formatNaira(vatAmount)}</span>
              </div>

              <div className="flex items-center justify-between pt-1 text-base font-bold text-slate-900">
                <span>Total Amount Due:</span>
                <span className="font-mono text-emerald-800 text-lg font-extrabold">
                  {formatNaira(totalAmount)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-2xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Complete Sale & Issue Receipt ({formatNaira(totalAmount)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

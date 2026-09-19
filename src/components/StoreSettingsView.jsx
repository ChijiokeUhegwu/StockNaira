import React, { useState } from 'react';
import {
  Building2,
  CreditCard,
  Receipt,
  Boxes,
  Users,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Key,
  Bell,
  Smartphone,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  Printer,
  Sparkles,
  ArrowLeft,
  DollarSign,
  HelpCircle,
  Eye,
  EyeOff,
  UserPlus,
  Lock,
  Phone,
  Mail,
  MapPin,
  FileCheck
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';
import { DEFAULT_STORE_SETTINGS } from '../data/settingsData';

export default function StoreSettingsView({
  settings,
  onSaveSettings,
  onBackToDashboard,
  showToast,
  currentStore,
  stores = []
}) {
  // Active Tab
  const [activeTab, setActiveTab] = useState('profile');
  
  // Working local state of settings
  const [formData, setFormData] = useState(settings || DEFAULT_STORE_SETTINGS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modals inside Settings
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [newBankForm, setNewBankForm] = useState({
    bankName: 'Moniepoint Microfinance Bank',
    accountNumber: '',
    accountName: '',
    accountType: 'POS Terminal & NIP Settlement',
    terminalId: ''
  });

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    role: 'Cashier & Floor Associate',
    email: '',
    phone: '+234 ',
    branch: currentStore?.name || 'Balogun Branch',
    pin: '1234',
    status: 'Active',
    permissions: {
      posAccess: true,
      approveTransfers: false,
      overrideDiscounts: false,
      manageInventory: false,
      manageSettings: false,
      viewFinancials: false,
      issueRefunds: false
    }
  });

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookSimulating, setWebhookSimulating] = useState(false);

  // Helper for updating nested formData
  const updateNestedState = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSaveSettings(formData);
      setIsSaving(false);
      setHasUnsavedChanges(false);
      showToast('Store settings updated and synced to local storage successfully!');
    }, 400);
  };

  const handleReset = () => {
    if (window.confirm('Reset all store settings to default configuration? Any unsaved edits will be discarded.')) {
      setFormData(DEFAULT_STORE_SETTINGS);
      onSaveSettings(DEFAULT_STORE_SETTINGS);
      setHasUnsavedChanges(false);
      showToast('Settings reset to default Nigerian merchant preset.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    showToast('Webhook secret key copied to clipboard');
  };

  const handleSimulateWebhook = () => {
    setWebhookSimulating(true);
    setTimeout(() => {
      setWebhookSimulating(false);
      showToast('⚡ Webhook Test Success: Inbound NIP transaction from OPay simulated (Ref: NIP/TEST/8819).');
    }, 1200);
  };

  // Bank account handlers
  const handleAddBankAccount = (e) => {
    e.preventDefault();
    if (!newBankForm.accountNumber || !newBankForm.accountName) {
      alert('Please fill in both Account Number and Account Name');
      return;
    }
    const newAcc = {
      id: `acc-${Date.now()}`,
      bankName: newBankForm.bankName,
      accountNumber: newBankForm.accountNumber,
      accountName: newBankForm.accountName,
      accountType: newBankForm.accountType,
      terminalId: newBankForm.terminalId || `MNP-${Math.floor(1000 + Math.random() * 9000)}`,
      isDefault: formData.payment.receivingAccounts.length === 0,
      isActive: true,
      nipStatus: 'Connected'
    };

    const updatedList = [...formData.payment.receivingAccounts, newAcc];
    updateNestedState('payment', 'receivingAccounts', updatedList);
    setIsAddBankModalOpen(false);
    setNewBankForm({
      bankName: 'Moniepoint Microfinance Bank',
      accountNumber: '',
      accountName: '',
      accountType: 'POS Terminal & NIP Settlement',
      terminalId: ''
    });
    showToast(`Bank account added: ${newAcc.bankName} (${newAcc.accountNumber})`);
  };

  const handleToggleBankActive = (accId) => {
    const updated = formData.payment.receivingAccounts.map((acc) =>
      acc.id === accId ? { ...acc, isActive: !acc.isActive, nipStatus: !acc.isActive ? 'Connected' : 'Paused' } : acc
    );
    updateNestedState('payment', 'receivingAccounts', updated);
  };

  const handleSetDefaultBank = (accId) => {
    const updated = formData.payment.receivingAccounts.map((acc) => ({
      ...acc,
      isDefault: acc.id === accId,
      isActive: acc.id === accId ? true : acc.isActive
    }));
    updateNestedState('payment', 'receivingAccounts', updated);
    showToast('Default transfer settlement account updated.');
  };

  const handleDeleteBank = (accId) => {
    if (formData.payment.receivingAccounts.length <= 1) {
      alert('You must maintain at least one active receiving bank account for customer payments.');
      return;
    }
    const target = formData.payment.receivingAccounts.find((a) => a.id === accId);
    const updated = formData.payment.receivingAccounts.filter((a) => a.id !== accId);
    if (target?.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    updateNestedState('payment', 'receivingAccounts', updated);
    showToast('Bank account removed.');
  };

  // Staff handlers
  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffForm.name || !newStaffForm.email) {
      alert('Please enter staff name and email address.');
      return;
    }
    const newStaffMember = {
      id: `stf-${Date.now()}`,
      name: newStaffForm.name,
      role: newStaffForm.role,
      email: newStaffForm.email,
      phone: newStaffForm.phone,
      branch: newStaffForm.branch,
      pin: newStaffForm.pin || '1234',
      status: newStaffForm.status,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000000)}?w=100&auto=format&fit=crop&q=60`,
      permissions: newStaffForm.permissions
    };

    const updated = [...formData.team.staff, newStaffMember];
    updateNestedState('team', 'staff', updated);
    setIsAddStaffModalOpen(false);
    setNewStaffForm({
      name: '',
      role: 'Cashier & Floor Associate',
      email: '',
      phone: '+234 ',
      branch: currentStore?.name || 'Balogun Branch',
      pin: '1234',
      status: 'Active',
      permissions: {
        posAccess: true,
        approveTransfers: false,
        overrideDiscounts: false,
        manageInventory: false,
        manageSettings: false,
        viewFinancials: false,
        issueRefunds: false
      }
    });
    showToast(`Staff member registered: ${newStaffMember.name} (${newStaffMember.role})`);
  };

  const handleToggleStaffStatus = (staffId) => {
    const updated = formData.team.staff.map((stf) =>
      stf.id === staffId ? { ...stf, status: stf.status === 'Active' ? 'Suspended' : 'Active' } : stf
    );
    updateNestedState('team', 'staff', updated);
  };

  const handleToggleStaffPermission = (staffId, permKey) => {
    const updated = formData.team.staff.map((stf) => {
      if (stf.id === staffId) {
        return {
          ...stf,
          permissions: {
            ...stf.permissions,
            [permKey]: !stf.permissions[permKey]
          }
        };
      }
      return stf;
    });
    updateNestedState('team', 'staff', updated);
  };

  const handleDeleteStaff = (staffId) => {
    if (formData.team.staff.length <= 1) {
      alert('You must have at least one store administrator account.');
      return;
    }
    const updated = formData.team.staff.filter((s) => s.id !== staffId);
    updateNestedState('team', 'staff', updated);
    showToast('Staff member account removed.');
  };

  const tabs = [
    { id: 'profile', label: 'Business & Profile', icon: Building2, count: null },
    { id: 'payment_nip', label: 'Payment & NIP Webhook', icon: CreditCard, count: `${formData.payment.receivingAccounts.length} Banks` },
    { id: 'tax_vat', label: 'Tax & VAT Receipts', icon: Receipt, count: formData.tax.enableVat ? '7.5% ON' : 'OFF' },
    { id: 'inventory_alerts', label: 'Low Stock Thresholds', icon: Boxes, count: `<= ${formData.inventory.globalLowStockThreshold} units` },
    { id: 'team_roles', label: 'Team & Permissions', icon: Users, count: `${formData.team.staff.length} Staff` },
  ];

  const nigerianBanks = [
    'Moniepoint Microfinance Bank',
    'OPay Digital Services',
    'Guaranty Trust Bank (GTBank)',
    'Zenith Bank Plc',
    'United Bank for Africa (UBA)',
    'Access Bank Plc',
    'First Bank of Nigeria',
    'Kuda Microfinance Bank',
    'PalmPay Limited',
    'Fidelity Bank Plc',
    'Stanbic IBTC Bank'
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header / Breadcrumb Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button
              onClick={onBackToDashboard}
              className="hover:text-emerald-600 transition flex items-center gap-1 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Dashboard</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
              Store Settings
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">{currentStore?.name || 'Balogun Branch'}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Store Configuration & Operational Settings
            </h1>
            {hasUnsavedChanges && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Unsaved changes
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Manage your CAC registration details, NIP bank transfer webhook webhooks, 7.5% Nigerian VAT calculations, stock thresholds, and cashier roles.
          </p>
        </div>

        {/* Global Save / Reset Action Controls */}
        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition shadow-2xs"
            title="Reset to default Nigerian merchant preset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Defaults</span>
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 border border-emerald-700 rounded-xl transition shadow-sm hover:shadow"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-1.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded-md font-mono ${
                      isActive ? 'bg-slate-800 text-emerald-300' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT AREAS */}

      {/* TAB 1: Business Profile Info */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Legal Identity & Commercial Profile
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official registered business details as filed with the Corporate Affairs Commission (CAC).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Store / Registered Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.profile.storeName}
                    onChange={(e) => updateNestedState('profile', 'storeName', e.target.value)}
                    placeholder="e.g. Okonkwo & Sons Ltd"
                    className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 hover:bg-white transition"
                  />
                  <p className="text-[11px] text-slate-400">Appears on POS receipts and customer payment links.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Trading / Brand Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.profile.tradingName}
                    onChange={(e) => updateNestedState('profile', 'tradingName', e.target.value)}
                    placeholder="e.g. StockNaira Balogun Commercial Hub"
                    className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 hover:bg-white transition"
                  />
                  <p className="text-[11px] text-slate-400">Trading outlet or plaza identifier.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    CAC Registration Number (RC / BN)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.profile.cacNumber}
                      onChange={(e) => updateNestedState('profile', 'cacNumber', e.target.value)}
                      placeholder="e.g. RC-1849204"
                      className="w-full px-3.5 py-2 text-xs font-mono font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 hover:bg-white transition"
                    />
                    <FileCheck className="w-4 h-4 text-emerald-600 absolute right-3 top-2.5" />
                  </div>
                  <p className="text-[11px] text-slate-400">Corporate Affairs Commission business registration.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Federal Tax Identification Number (TIN)
                  </label>
                  <input
                    type="text"
                    value={formData.profile.tinNumber}
                    onChange={(e) => updateNestedState('profile', 'tinNumber', e.target.value)}
                    placeholder="e.g. 23849102-0001"
                    className="w-full px-3.5 py-2 text-xs font-mono font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 hover:bg-white transition"
                  />
                  <p className="text-[11px] text-slate-400">FIRS / LIRS statutory taxpayer identity.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-3">Merchant Category & Trade Industry</h4>
                <select
                  value={formData.profile.businessCategory}
                  onChange={(e) => updateNestedState('profile', 'businessCategory', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 hover:bg-white transition"
                >
                  <option value="FMCG, Groceries & Textiles Wholesale">FMCG, Groceries & Textiles Wholesale (Balogun / Alaba)</option>
                  <option value="Electronics, Computers & Accessories">Electronics, Computers & Mobile Accessories (Computer Village)</option>
                  <option value="Auto Parts & Machinery Distribution">Auto Parts & Heavy Machinery (ASPAMDA Trade Fair)</option>
                  <option value="Fashion, Fabrics & Ankara Materials">Fashion, Luxury Lace & Ankara Materials</option>
                  <option value="Pharmacy, Healthcare & Provisions">Pharmacy, Healthcare & Supermarket</option>
                </select>
              </div>
            </div>

            {/* Contact & Location Section */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Market Hub Location & Contact Channels
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Physical warehouse/shop addresses and telephone channels for customer inquiries.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Primary Shop / Warehouse Physical Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.profile.address}
                    onChange={(e) => updateNestedState('profile', 'address', e.target.value)}
                    placeholder="e.g. Plot 14, Breadfruit Street, Balogun Market, Lagos Island"
                    className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 hover:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Primary Contact Telephone (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.profile.phone}
                        onChange={(e) => updateNestedState('profile', 'phone', e.target.value)}
                        placeholder="+234 803 445 9912"
                        className="w-full px-3.5 py-2 text-xs font-mono font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 hover:bg-white transition"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Official Accounts Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.profile.email}
                        onChange={(e) => updateNestedState('profile', 'email', e.target.value)}
                        placeholder="accounts@okonkwoandsons.ng"
                        className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 hover:bg-white transition"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">State / Region</label>
                    <input
                      type="text"
                      value={formData.profile.state}
                      onChange={(e) => updateNestedState('profile', 'state', e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 hover:bg-white transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Country</label>
                    <input
                      type="text"
                      disabled
                      value={formData.profile.country}
                      className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Store Identity & Verification Badge Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-extrabold text-lg shadow-inner">
                  {formData.profile.logoInitials || 'OS'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{formData.profile.storeName}</h4>
                  <p className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Commercial Account
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-700/70 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">CAC Ref:</span>
                  <span className="text-white font-semibold">{formData.profile.cacNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax ID:</span>
                  <span className="text-white font-semibold">{formData.profile.tinNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Branch:</span>
                  <span className="text-emerald-300 font-semibold">{currentStore?.name || 'Balogun Branch'}</span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  NIP Instant Verification Shield
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Automatic anti-fraud matching against Moniepoint, OPay, and GTBank NIP session streams is fully active.
                </p>
              </div>
            </div>

            {/* Quick Branches Preview */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Store Branches ({stores.length || 4})
              </h4>
              <div className="space-y-2">
                {(stores.length > 0 ? stores : [
                  { id: 'balogun', name: 'Balogun Branch', manager: 'Mrs. Funke Adeleke' },
                  { id: 'alaba', name: 'Alaba Intl Branch', manager: 'Emeka Okonkwo' },
                  { id: 'tradefair', name: 'Trade Fair Branch', manager: 'Alhaji Musa Ibrahim' },
                  { id: 'computer_village', name: 'Computer Village Branch', manager: 'Babatunde Lawal' },
                ]).map((st) => (
                  <div
                    key={st.id}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-emerald-200 bg-slate-50/50 hover:bg-emerald-50/30 transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{st.name}</p>
                      <p className="text-[11px] text-slate-400">Mgr: {st.manager}</p>
                    </div>
                    {st.id === (currentStore?.id || 'balogun') && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-md">
                        Active
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Payment & NIP Webhook Configuration */}
      {activeTab === 'payment_nip' && (
        <div className="space-y-6">
          {/* NIP Live Gateway Toggle & Webhook Endpoint Configuration */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  NIP Instant Transfer Gateway & Webhook Inbound
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Connect direct Nigerian Instant Payment (NIP) session listeners to auto-match bank transfers and reject fake SMS alerts.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">
                    {formData.payment.nipLiveStatus ? 'Live Gateway Active' : 'Sandbox / Test Mode'}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateNestedState('payment', 'nipLiveStatus', !formData.payment.nipLiveStatus)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.payment.nipLiveStatus ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        formData.payment.nipLiveStatus ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Webhook URL & Secret Key */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  Inbound Webhook Endpoint URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.payment.webhookUrl}
                    onChange={(e) => updateNestedState('payment', 'webhookUrl', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 transition pr-20"
                  />
                  <span className="absolute right-2.5 top-2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    POST SSL
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Receives real-time credit event payloads from Moniepoint / OPay / NIBSS.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  Webhook Signature Secret Key
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    value={formData.payment.webhookSecretKey}
                    onChange={(e) => updateNestedState('payment', 'webhookSecretKey', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 transition pr-20"
                  />
                  <div className="absolute right-2 top-1.5 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      className="p-1 text-slate-400 hover:text-slate-700 transition"
                      title={showSecretKey ? 'Hide key' : 'Reveal key'}
                    >
                      {showSecretKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(formData.payment.webhookSecretKey)}
                      className="p-1 text-slate-400 hover:text-emerald-600 transition"
                      title="Copy Secret Key"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">HMAC-SHA256 signature key to authenticate webhook requests.</p>
              </div>
            </div>

            {/* Inbound Webhook Test Simulator */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">NIP Webhook Connectivity Test</h4>
                  <p className="text-[11px] text-slate-500">
                    Dispatch a simulated ₦28,500 inbound payment payload from OPay to test instant ledger matching.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSimulateWebhook}
                disabled={webhookSimulating}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-xl transition shadow-2xs flex items-center gap-1.5 shrink-0"
              >
                {webhookSimulating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting payload...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Send Test Webhook</span>
                  </>
                )}
              </button>
            </div>

            {/* Notification & Matching Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.payment.autoMatchTransfers}
                  onChange={(e) => updateNestedState('payment', 'autoMatchTransfers', e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Auto-Match Session IDs</p>
                  <p className="text-[11px] text-slate-400">Automatically pair customer 9-digit NIP references with POS orders.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.payment.audioAlertOnTransfer}
                  onChange={(e) => updateNestedState('payment', 'audioAlertOnTransfer', e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Counter Audio Chime</p>
                  <p className="text-[11px] text-slate-400">Play sound alert on cashier counter when transfer is confirmed.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.payment.smsAlertNotifications}
                  onChange={(e) => updateNestedState('payment', 'smsAlertNotifications', e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800">SMS & WhatsApp Alerts</p>
                  <p className="text-[11px] text-slate-400">Push instant WhatsApp confirmation to store owner phone ({formData.payment.alertPhone}).</p>
                </div>
              </label>
            </div>
          </div>

          {/* Receiving Bank Accounts List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Receiving Bank Accounts & POS Terminals
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configured merchant accounts that receive customer instant transfers and POS card settlements.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddBankModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition shadow-2xs self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Bank Account</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.payment.receivingAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                    acc.isDefault
                      ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500/30'
                      : acc.isActive
                      ? 'border-slate-200 bg-white hover:border-slate-300'
                      : 'border-slate-200 bg-slate-50/60 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          acc.bankName.includes('Moniepoint') ? 'bg-blue-600 text-white' :
                          acc.bankName.includes('OPay') ? 'bg-emerald-600 text-white' :
                          acc.bankName.includes('GTBank') ? 'bg-orange-600 text-white' :
                          acc.bankName.includes('Zenith') ? 'bg-red-600 text-white' : 'bg-slate-700 text-white'
                        }`}>
                          {acc.bankName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">{acc.bankName}</h4>
                          <p className="text-[10px] text-slate-400">{acc.accountType}</p>
                        </div>
                      </div>

                      {acc.isDefault ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Primary Default
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultBank(acc.id)}
                          className="text-[10px] font-semibold text-slate-500 hover:text-emerald-700 underline"
                        >
                          Make Default
                        </button>
                      )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-500 text-[11px]">Account No:</span>
                        <span className="font-bold text-slate-900 text-sm tracking-wide">{acc.accountNumber}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 truncate">
                        <span className="text-slate-400">Name:</span> {acc.accountName}
                      </div>
                      {acc.terminalId && (
                        <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/50">
                          <span>Terminal ID:</span>
                          <span className="font-semibold text-slate-700">{acc.terminalId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleBankActive(acc.id)}
                      className={`text-xs font-medium flex items-center gap-1.5 ${
                        acc.isActive ? 'text-emerald-600 hover:text-emerald-700' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${acc.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                      <span>{acc.isActive ? 'Active (Receiving)' : 'Paused'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteBank(acc.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition"
                      title="Delete account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Tax & VAT Settings */}
      {activeTab === 'tax_vat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    7.5% Nigerian VAT Calculation & Rules
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure standard Nigerian Value Added Tax rates and invoice computation modes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">
                    {formData.tax.enableVat ? 'VAT Active (7.5%)' : 'VAT Disabled'}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateNestedState('tax', 'enableVat', !formData.tax.enableVat)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.tax.enableVat ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        formData.tax.enableVat ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Statutory VAT Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.tax.vatRate}
                      onChange={(e) => updateNestedState('tax', 'vatRate', parseFloat(e.target.value) || 0)}
                      disabled={!formData.tax.enableVat}
                      className="w-full px-3.5 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 disabled:opacity-50 transition"
                    />
                    <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Statutory rate under Nigerian Finance Act (7.5%).</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    VAT Pricing Model
                  </label>
                  <select
                    value={formData.tax.vatMode}
                    onChange={(e) => updateNestedState('tax', 'vatMode', e.target.value)}
                    disabled={!formData.tax.enableVat}
                    className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 disabled:opacity-50 transition"
                  >
                    <option value="exclusive">Exclusive (Added on top at Checkout)</option>
                    <option value="inclusive">Inclusive (Embedded inside catalog shelf price)</option>
                  </select>
                  <p className="text-[11px] text-slate-400">Exclusive calculates 7.5% on subtotal upon checkout.</p>
                </div>
              </div>

              {/* Currency & Formatting Configuration */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-slate-900">Default Currency & Monetary Formatting</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Default Currency</label>
                    <input
                      type="text"
                      disabled
                      value="₦ NGN - Nigerian Naira"
                      className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-100 text-slate-600 font-mono cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Receipt Paper Width</label>
                    <select
                      value={formData.tax.paperSize}
                      onChange={(e) => updateNestedState('tax', 'paperSize', e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 transition"
                    >
                      <option value="80mm">80mm Standard POS Thermal Roll (Desktop)</option>
                      <option value="58mm">58mm Handheld Bluetooth Terminal Roll</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Header & Footer Customization */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Printer className="w-4 h-4 text-emerald-600" />
                  Thermal Receipt Customization
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize the legal header, disclaimer notes, and cashier disclosures on printed customer receipts.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Receipt Top Header Text
                  </label>
                  <textarea
                    rows={3}
                    value={formData.tax.receiptHeader}
                    onChange={(e) => updateNestedState('tax', 'receiptHeader', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Receipt Bottom Footer Message & Return Policy
                  </label>
                  <textarea
                    rows={3}
                    value={formData.tax.receiptFooter}
                    onChange={(e) => updateNestedState('tax', 'receiptFooter', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.tax.showTinOnReceipt}
                      onChange={(e) => updateNestedState('tax', 'showTinOnReceipt', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Print TIN Number</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.tax.printCashierName}
                      onChange={(e) => updateNestedState('tax', 'printCashierName', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Print Cashier Name</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.tax.printNipRefCode}
                      onChange={(e) => updateNestedState('tax', 'printNipRefCode', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Print NIP Session Ref</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Thermal Receipt Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-semibold">
                <span className="flex items-center gap-2 text-emerald-400 font-mono">
                  <Printer className="w-4 h-4" />
                  Live 80mm Thermal Receipt Preview
                </span>
                <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {formData.tax.paperSize}
                </span>
              </div>

              {/* Thermal Slip Simulation */}
              <div className="mt-4 p-5 bg-white text-slate-900 rounded-xl shadow-inner font-mono text-xs border border-slate-200 select-none space-y-3 max-w-[340px] mx-auto">
                <div className="text-center space-y-1">
                  <p className="font-bold text-sm uppercase whitespace-pre-line leading-tight">
                    {formData.tax.receiptHeader}
                  </p>
                  <p className="text-[10px] text-slate-500 pt-1">
                    TEL: {formData.profile.phone}
                  </p>
                  {formData.tax.showTinOnReceipt && (
                    <p className="text-[10px] text-slate-500">
                      TIN: {formData.profile.tinNumber} | CAC: {formData.profile.cacNumber}
                    </p>
                  )}
                </div>

                <div className="border-t border-b border-dashed border-slate-400 py-1.5 text-[11px] space-y-0.5">
                  <div className="flex justify-between">
                    <span>RECEIPT #: TXN-8841</span>
                    <span>14:32 TODAY</span>
                  </div>
                  {formData.tax.printCashierName && (
                    <div className="flex justify-between text-slate-600">
                      <span>CASHIER: Adeola B.</span>
                      <span>POS-01</span>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>2x Dangote Sugar 50kg</span>
                    <span>₦94,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5x GP Spaghetti 500g</span>
                    <span>₦4,250</span>
                  </div>
                </div>

                {/* Calculations */}
                <div className="border-t border-dashed border-slate-400 pt-2 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₦98,750</span>
                  </div>
                  {formData.tax.enableVat ? (
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>VAT ({formData.tax.vatRate}%)</span>
                      <span>₦7,406</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-slate-400">
                      <span>VAT (Exempt)</span>
                      <span>₦0</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-extrabold pt-1 border-t border-slate-900">
                    <span>TOTAL DUE</span>
                    <span>{formData.tax.enableVat ? '₦106,156' : '₦98,750'}</span>
                  </div>
                </div>

                {/* Payment */}
                <div className="border-t border-dashed border-slate-400 pt-2 text-[10px] space-y-0.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>PAID VIA: Bank Transfer</span>
                    <span>GTBank Plc</span>
                  </div>
                  {formData.tax.printNipRefCode && (
                    <div className="flex justify-between font-mono">
                      <span>NIP REF:</span>
                      <span className="font-bold text-slate-800">NIP/99482103/GTB</span>
                    </div>
                  )}
                </div>

                {/* Footer Notes */}
                <div className="border-t border-dashed border-slate-400 pt-3 text-center text-[10px] text-slate-500 whitespace-pre-line leading-relaxed">
                  {formData.tax.receiptFooter}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Low Stock Thresholds & Alerts */}
      {activeTab === 'inventory_alerts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-600" />
                Global Stockout Safety Thresholds
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Set minimum buffer stock quantities to trigger low-stock alerts and automated purchase order drafts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Global Low Stock Warning Trigger</span>
                  <span className="text-xs font-bold text-amber-700 font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    &lt;= {formData.inventory.globalLowStockThreshold} Units
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={formData.inventory.globalLowStockThreshold}
                  onChange={(e) => updateNestedState('inventory', 'globalLowStockThreshold', parseInt(e.target.value))}
                  className="w-full accent-amber-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Items below this count will appear on the amber Low Stock dashboard badge.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Critical Stockout Alarm (Emergency Reorder)</span>
                  <span className="text-xs font-bold text-red-700 font-mono bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    &lt;= {formData.inventory.globalCriticalThreshold} Units
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.inventory.globalCriticalThreshold}
                  onChange={(e) => updateNestedState('inventory', 'globalCriticalThreshold', parseInt(e.target.value))}
                  className="w-full accent-red-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Items below this level trigger urgent WhatsApp restock messages to market suppliers.
                </p>
              </div>
            </div>

            {/* Category Level Overrides */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">Department & Category Safety Rules</h4>
                <span className="text-[11px] text-slate-400">Calibrated for fast-moving vs slow goods</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.inventory.categoryThresholds.map((cat, idx) => (
                  <div key={cat.category} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-800">{cat.category}</h5>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Default PO: +{cat.defaultReorderQty} units
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-medium">
                      <div>
                        <span className="text-[11px] text-slate-500 block mb-1">Low Alert (&lt;=):</span>
                        <input
                          type="number"
                          value={cat.lowThreshold}
                          onChange={(e) => {
                            const updated = [...formData.inventory.categoryThresholds];
                            updated[idx] = { ...updated[idx], lowThreshold: parseInt(e.target.value) || 1 };
                            updateNestedState('inventory', 'categoryThresholds', updated);
                          }}
                          className="w-full px-2.5 py-1 text-xs font-mono font-bold bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500 block mb-1">Critical (&lt;=):</span>
                        <input
                          type="number"
                          value={cat.criticalThreshold}
                          onChange={(e) => {
                            const updated = [...formData.inventory.categoryThresholds];
                            updated[idx] = { ...updated[idx], criticalThreshold: parseInt(e.target.value) || 1 };
                            updateNestedState('inventory', 'categoryThresholds', updated);
                          }}
                          className="w-full px-2.5 py-1 text-xs font-mono font-bold bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification triggers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inventory.enableAutoReorderDrafts}
                  onChange={(e) => updateNestedState('inventory', 'enableAutoReorderDrafts', e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Auto-Draft Supplier Purchase Orders</p>
                  <p className="text-[11px] text-slate-400">Create pending PO drafts when stock hits critical threshold for quick 1-click dispatch.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inventory.sendDailyDigest}
                  onChange={(e) => updateNestedState('inventory', 'sendDailyDigest', e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Daily 8:00 AM Stockout Briefing</p>
                  <p className="text-[11px] text-slate-400">Send WhatsApp summary of all critical items before market opens.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Team & Staff Permissions */}
      {activeTab === 'team_roles' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Staff Members, Cashier PINs & Access Roles
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage staff accounts, assign 4-digit POS authorization PINs, and define cashier vs manager permissions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddStaffModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition shadow-2xs self-start sm:self-auto"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add Staff Member</span>
              </button>
            </div>

            {/* Staff Directory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Role & Branch</th>
                    <th className="py-3 px-4">POS PIN</th>
                    <th className="py-3 px-4">Permissions Matrix</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {formData.team.staff.map((stf) => (
                    <tr key={stf.id} className="hover:bg-slate-50/60 transition">
                      {/* Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={stf.avatar}
                            alt={stf.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{stf.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{stf.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role & Branch */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border mb-1 ${
                          stf.role === 'Store Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          stf.role === 'Branch Manager' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          stf.role === 'Senior Cashier' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {stf.role}
                        </span>
                        <p className="text-[11px] text-slate-500">{stf.branch}</p>
                      </td>

                      {/* PIN */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md w-max border border-slate-200">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>{stf.pin || '••••'}</span>
                        </div>
                      </td>

                      {/* Granular Permissions */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                          <label className={`px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer select-none transition ${
                            stf.permissions.posAccess ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                          }`}>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={stf.permissions.posAccess}
                              onChange={() => handleToggleStaffPermission(stf.id, 'posAccess')}
                            />
                            POS
                          </label>

                          <label className={`px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer select-none transition ${
                            stf.permissions.approveTransfers ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                          }`}>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={stf.permissions.approveTransfers}
                              onChange={() => handleToggleStaffPermission(stf.id, 'approveTransfers')}
                            />
                            Transfer Approval
                          </label>

                          <label className={`px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer select-none transition ${
                            stf.permissions.overrideDiscounts ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                          }`}>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={stf.permissions.overrideDiscounts}
                              onChange={() => handleToggleStaffPermission(stf.id, 'overrideDiscounts')}
                            />
                            Discount Override
                          </label>

                          <label className={`px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer select-none transition ${
                            stf.permissions.manageInventory ? 'bg-teal-50 text-teal-700 border-teal-300' : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                          }`}>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={stf.permissions.manageInventory}
                              onChange={() => handleToggleStaffPermission(stf.id, 'manageInventory')}
                            />
                            Restock PO
                          </label>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStaffStatus(stf.id)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                            stf.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-amber-100 hover:text-amber-800'
                              : 'bg-red-100 text-red-800 border-red-200 hover:bg-emerald-100 hover:text-emerald-800'
                          }`}
                        >
                          {stf.status}
                        </button>
                      </td>

                      {/* Delete */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteStaff(stf.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                          title="Remove staff member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD BANK ACCOUNT */}
      {isAddBankModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Add Merchant Receiving Account
              </h3>
              <button
                onClick={() => setIsAddBankModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBankAccount} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Bank Entity</label>
                <select
                  value={newBankForm.bankName}
                  onChange={(e) => setNewBankForm({ ...newBankForm, bankName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                >
                  {nigerianBanks.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">10-Digit NUBAN Account Number</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. 8145521109"
                  value={newBankForm.accountNumber}
                  onChange={(e) => setNewBankForm({ ...newBankForm, accountNumber: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Beneficiary Account Name</label>
                <input
                  type="text"
                  placeholder="e.g. Okonkwo & Sons Ltd / POS"
                  value={newBankForm.accountName}
                  onChange={(e) => setNewBankForm({ ...newBankForm, accountName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Account Channel Type</label>
                <select
                  value={newBankForm.accountType}
                  onChange={(e) => setNewBankForm({ ...newBankForm, accountType: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                >
                  <option value="POS Terminal & NIP Settlement">POS Terminal & NIP Settlement</option>
                  <option value="Virtual Merchant Account">Virtual Dynamic Account (OPay / Moniepoint)</option>
                  <option value="Corporate Current Account">Corporate Bank Account (GTBank / Zenith / UBA)</option>
                  <option value="Tier-3 Digital Business Account">Digital Business Account (Kuda / PalmPay)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Hardware POS Terminal ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. MNP-POS-882190"
                  value={newBankForm.terminalId}
                  onChange={(e) => setNewBankForm({ ...newBankForm, terminalId: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddBankModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm"
                >
                  Save Bank Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD STAFF MEMBER */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-600" />
                Register Staff & Assign POS Authorization
              </h3>
              <button
                onClick={() => setIsAddStaffModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Staff Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Ibrahim Danladi"
                    value={newStaffForm.name}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Assigned Role</label>
                  <select
                    value={newStaffForm.role}
                    onChange={(e) => {
                      const r = e.target.value;
                      const isMgr = r === 'Branch Manager' || r === 'Store Admin';
                      setNewStaffForm({
                        ...newStaffForm,
                        role: r,
                        permissions: {
                          posAccess: true,
                          approveTransfers: isMgr || r === 'Senior Cashier',
                          overrideDiscounts: isMgr,
                          manageInventory: isMgr || r === 'Inventory & Logistics Officer',
                          manageSettings: r === 'Store Admin',
                          viewFinancials: isMgr,
                          issueRefunds: isMgr
                        }
                      });
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  >
                    <option value="Cashier & Floor Associate">Cashier & Floor Associate</option>
                    <option value="Senior Cashier">Senior Cashier</option>
                    <option value="Branch Manager">Branch Manager</option>
                    <option value="Inventory & Logistics Officer">Inventory & Logistics Officer</option>
                    <option value="Store Admin">Store Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Staff Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    placeholder="ibrahim@okonkwoandsons.ng"
                    value={newStaffForm.email}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nigerian Phone Number</label>
                  <input
                    type="text"
                    placeholder="+234 803 111 2233"
                    value={newStaffForm.phone}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Assigned Branch</label>
                  <select
                    value={newStaffForm.branch}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, branch: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  >
                    <option value="Balogun Branch">Balogun Branch</option>
                    <option value="Alaba Intl Branch">Alaba Intl Branch</option>
                    <option value="Trade Fair Branch">Trade Fair Branch</option>
                    <option value="Computer Village Branch">Computer Village Branch</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">4-Digit POS Authorization PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="1234"
                    value={newStaffForm.pin}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, pin: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 text-xs font-mono font-bold tracking-widest border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-center"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

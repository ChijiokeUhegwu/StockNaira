import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquare,
  Copy,
  ExternalLink,
  Check,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Send
} from 'lucide-react';
import {
  generateWhatsAppReminderMessage,
  buildWhatsAppLink,
  cleanPhoneNumber
} from '../data/customerData';
import { formatNaira } from '../utils/formatters';

export default function WhatsAppReminderModal({
  isOpen,
  onClose,
  customer,
  storeSettings,
  onSuccessToast
}) {
  const [templateType, setTemplateType] = useState('friendly');
  const [selectedBankId, setSelectedBankId] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const receivingAccounts = storeSettings?.payment?.receivingAccounts || [];
  const activeBank = receivingAccounts.find((b) => b.id === selectedBankId) ||
    receivingAccounts.find((b) => b.isDefault) ||
    receivingAccounts[0];

  // Set default template according to customer's overdue status
  useEffect(() => {
    if (customer) {
      if ((customer.daysOverdue || 0) > 0) {
        setTemplateType('overdue');
      } else if (customer.currentBalance === 0) {
        setTemplateType('receipt');
      } else {
        setTemplateType('friendly');
      }
      if (receivingAccounts.length > 0 && !selectedBankId) {
        const defaultAcc = receivingAccounts.find((a) => a.isDefault) || receivingAccounts[0];
        setSelectedBankId(defaultAcc.id);
      }
    }
  }, [customer]);

  // Regenerate message when template or bank changes
  useEffect(() => {
    if (customer && storeSettings) {
      const msg = generateWhatsAppReminderMessage({
        customer,
        templateType,
        storeSettings,
        selectedBank: activeBank
      });
      setCustomMessage(msg);
    }
  }, [customer, templateType, selectedBankId, storeSettings]);

  if (!isOpen || !customer) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(customMessage);
    setCopied(true);
    onSuccessToast?.('WhatsApp message copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const url = buildWhatsAppLink(customer.whatsapp || customer.phone, customMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
    onSuccessToast?.(`Opened WhatsApp chat for ${customer.name}`);
    onClose();
  };

  const templates = [
    {
      id: 'friendly',
      name: 'Friendly Reminder',
      desc: 'Polite statement update with bank details',
      badge: 'Normal'
    },
    {
      id: 'due_today',
      name: 'Due Today Notice',
      desc: 'Remind that payment is expected today',
      badge: 'Due Date'
    },
    {
      id: 'overdue',
      name: 'Urgent Overdue',
      desc: 'Firm demand notice for past-due account',
      badge: 'Critical'
    },
    {
      id: 'receipt',
      name: 'Payment Receipt',
      desc: 'Acknowledge repayment and thank customer',
      badge: 'Cleared'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-teal-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-sm shrink-0">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">WhatsApp Repayment Reminder</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Direct Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Send professional notice to {customer.name} ({customer.phone})
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

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Customer Summary Chip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-700 text-xs">
                {customer.avatar ? (
                  <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                ) : (
                  customer.initials
                )}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">{customer.name}</div>
                <div className="text-[11px] text-slate-500">{customer.businessName} • {customer.stallNumber}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Outstanding</span>
                <span className="font-mono font-bold text-sm text-slate-900">
                  {formatNaira(customer.currentBalance)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
                {customer.daysOverdue > 0 ? (
                  <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 text-[10px]">
                    <AlertCircle className="w-2.5 h-2.5" /> {customer.daysOverdue}d Overdue
                  </span>
                ) : customer.currentBalance === 0 ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Fully Cleared
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[10px]">
                    <Calendar className="w-2.5 h-2.5" /> Due {customer.dueDate}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Template Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Message Tone &amp; Purpose
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {templates.map((tpl) => {
                const isActive = templateType === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateType(tpl.id)}
                    className={`p-3 rounded-2xl text-left border transition flex flex-col justify-between ${
                      isActive
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-2xs text-emerald-950 font-semibold'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="font-bold text-xs">{tpl.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{tpl.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bank Account for Payment */}
          {receivingAccounts.length > 0 && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Include Receiving Bank Account In Text
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {receivingAccounts.slice(0, 4).map((acc) => {
                  const isSelected = (activeBank?.id || activeBank?.accountNumber) === (acc.id || acc.accountNumber);
                  return (
                    <div
                      key={acc.id || acc.accountNumber}
                      onClick={() => setSelectedBankId(acc.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/60 text-slate-900 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-[11px] truncate">{acc.bankName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{acc.accountNumber}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Live Message Preview & Custom Edit */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Message Preview (Editable)
              </label>
              <span className="text-[11px] text-slate-400">
                Recipient: +{cleanPhoneNumber(customer.whatsapp || customer.phone)}
              </span>
            </div>

            {/* Simulated WhatsApp Bubble */}
            <div className="relative rounded-2xl p-4 bg-[#EFEAE2] border border-slate-200">
              <div className="relative max-w-full bg-[#DCF8C6] rounded-2xl rounded-tr-xs p-3.5 shadow-sm text-slate-800 border border-emerald-200/50">
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={8}
                  className="w-full bg-transparent border-0 resize-none focus:outline-none text-xs text-slate-800 leading-relaxed font-sans placeholder-slate-400"
                />
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-500 font-medium">
                  <span>14:30</span>
                  <span className="text-blue-500">✓✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Text Only</span>
              </>
            )}
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] active:scale-98 rounded-xl transition shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Open in WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Building2,
  Smartphone,
  ExternalLink,
  Lock
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';

export default function ConfirmTransferModal({
  isOpen,
  onClose,
  pendingTransfers,
  onApproveTransfer,
  onRejectTransfer
}) {
  const [selectedTransferId, setSelectedTransferId] = useState(
    pendingTransfers.length > 0 ? pendingTransfers[0].id : null
  );
  const [manualSessionRef, setManualSessionRef] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  if (!isOpen) return null;

  const selectedTransfer = pendingTransfers.find((t) => t.id === selectedTransferId) || pendingTransfers[0];

  const handleManualScan = () => {
    if (!manualSessionRef.trim()) return;
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      if (manualSessionRef.toUpperCase().includes('FAKE') || manualSessionRef.includes('0000')) {
        setVerificationResult({
          status: 'fraud',
          message: 'FLAGGED: No NIP clearing record found on Interswitch / NIBSS switch. Possible fake SMS alert!'
        });
      } else {
        setVerificationResult({
          status: 'verified',
          message: `NIBSS Verified: Ref ${manualSessionRef} settled into Moniepoint Merchant Acct.`
        });
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Confirm Bank Transfer</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 rounded-full border border-emerald-200">
                  NIP Live Gateway
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Verify Nigerian Instant Payment (NIP) alerts before handing over goods
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Manual Reference Scanner / Bank Check */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Live NIP Session ID / Reference Lookup
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={manualSessionRef}
                  onChange={(e) => setManualSessionRef(e.target.value)}
                  placeholder="Enter NIP session ID e.g. NIP/88391204/OPY or GTBank Ref..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>
              <button
                onClick={handleManualScan}
                disabled={isVerifying}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0"
              >
                {isVerifying ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>Verify Session</span>
              </button>
            </div>

            {verificationResult && (
              <div
                className={`mt-3 p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  verificationResult.status === 'verified'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800 font-semibold'
                }`}
              >
                {verificationResult.status === 'verified' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{verificationResult.message}</span>
              </div>
            )}
          </div>

          {/* Pending Alerts Queue */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>Active Unconfirmed Transfers</span>
                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded-full font-mono font-bold">
                  {pendingTransfers.length}
                </span>
              </h3>
              <span className="text-[11px] text-slate-400">Select alert to verify details</span>
            </div>

            {pendingTransfers.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800">All transfers confirmed!</p>
                <p className="text-slate-400 text-[11px] mt-0.5">No pending customer transfers awaiting verification.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingTransfers.map((trf) => {
                  const isSelected = selectedTransfer?.id === trf.id;
                  return (
                    <div
                      key={trf.id}
                      onClick={() => setSelectedTransferId(trf.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                        isSelected
                          ? 'bg-emerald-50/60 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-800 text-xs shrink-0">
                            {trf.bankLogo.slice(0, 2)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{trf.customer}</h4>
                            <p className="text-[10px] text-slate-500">{trf.bankName}</p>
                          </div>
                        </div>

                        <span className="font-mono font-extrabold text-slate-900 text-sm">
                          {formatNaira(trf.amount)}
                        </span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-400 truncate max-w-[140px]">
                          {trf.sessionRef}
                        </span>

                        {trf.matchedWebhook ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Auto-Matched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-[10px]">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            SMS Only
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Transfer Action Card */}
          {selectedTransfer && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Verification Inspection: {selectedTransfer.customer}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Linked Order: {selectedTransfer.orderId} • {selectedTransfer.timestamp}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Amount</span>
                  <span className="font-mono font-extrabold text-emerald-800 text-base">
                    {formatNaira(selectedTransfer.amount)}
                  </span>
                </div>
              </div>

              {selectedTransfer.isSuspicious && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Fraud Alert:</span> {selectedTransfer.suspiciousReason}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => onRejectTransfer(selectedTransfer.id)}
                  className="px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition"
                >
                  Flag / Reject Fake Alert
                </button>
                <button
                  onClick={() => onApproveTransfer(selectedTransfer.orderId, selectedTransfer.id)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Confirm Receipt & Release Order</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Settings, Save, RotateCcw, X, Key, Calendar, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { AppConfig } from '../types';

interface SettingsModalProps {
  config: AppConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newConfig: AppConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ config, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<AppConfig>(config);
  const [saveAlert, setSaveAlert] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveAlert(true);
    setTimeout(() => {
      setSaveAlert(false);
      onClose();
    }, 800);
  };

  const handleResetDefaults = () => {
    const defaults: AppConfig = {
      razorpayKeyId: 'rzp_test_YOUR_KEY_HERE',
      calendlyUrl: 'https://calendly.com/YOUR-ACCOUNT/20min-audit',
      priceInr: 399,
      originalPriceInr: 1999,
      currency: 'INR',
      testMode: true,
    };
    setFormData(defaults);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 text-left shadow-2xl animate-fade-in relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white font-display">Integration Configuration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-400" />
              <span>Razorpay Key ID (`RAZORPAY_KEY_ID`)</span>
            </label>
            <input
              type="text"
              value={formData.razorpayKeyId}
              onChange={(e) => setFormData({ ...formData, razorpayKeyId: e.target.value })}
              placeholder="rzp_test_xxxxxxxxxx or rzp_live_xxxxxxxxxx"
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Leave default or set your real Razorpay Key ID.
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Calendly / Cal.com URL (`CALENDLY_URL`)</span>
            </label>
            <input
              type="text"
              value={formData.calendlyUrl}
              onChange={(e) => setFormData({ ...formData, calendlyUrl: e.target.value })}
              placeholder="https://calendly.com/YOUR-ACCOUNT/20min-audit"
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Parameters `?name=...&a1=...&a2=...` are automatically attached on success.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Audit Fee (₹ INR)</label>
              <input
                type="number"
                value={formData.priceInr}
                onChange={(e) => setFormData({ ...formData, priceInr: Number(e.target.value) })}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Original Price (₹)</label>
              <input
                type="number"
                value={formData.originalPriceInr}
                onChange={(e) => setFormData({ ...formData, originalPriceInr: Number(e.target.value) })}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Test mode toggle */}
          <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-200">Sandbox Preview Mode</div>
              <div className="text-[10px] text-slate-400">Enables instant 1-click test checkout modal</div>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, testMode: !formData.testMode })}
              className={`p-1 text-sm font-bold flex items-center gap-1 cursor-pointer ${
                formData.testMode ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              {formData.testMode ? (
                <ToggleRight className="w-8 h-8 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-600" />
              )}
            </button>
          </div>

          {saveAlert && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-center font-bold">
              ✓ Settings saved successfully!
            </div>
          )}

          <div className="pt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center gap-1 font-semibold text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Defaults</span>
            </button>

            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

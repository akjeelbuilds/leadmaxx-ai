import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Loader2, 
  User, 
  PhoneCall, 
  Building2, 
  AlertCircle, 
  BarChart3
} from 'lucide-react';
import { LeadFormData, AppConfig, AuditBooking } from '../types';

interface AuditOfferCardProps {
  config: AppConfig;
  onPaymentSuccess: (booking: AuditBooking) => void;
  formRef?: React.RefObject<HTMLDivElement | null>;
}

// Clean phone input and extract Indian 10-digit number
function normalizeIndianPhone(input: string): string {
  let cleaned = input.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.slice(2);
  }
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }
  return cleaned.slice(0, 10);
}

// Validate Indian WhatsApp Number
function checkWhatsAppValidity(phone: string): { isValid: boolean; error?: string } {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'WhatsApp number is required' };
  }
  if (phone.length < 10) {
    return { isValid: false, error: `Enter complete 10-digit mobile number (${phone.length}/10 digits)` };
  }
  const firstDigit = phone.charAt(0);
  if (!['6', '7', '8', '9'].includes(firstDigit)) {
    return { 
      isValid: false, 
      error: 'Invalid prefix: Indian mobile numbers must start with 6, 7, 8, or 9' 
    };
  }
  if (/^(\d)\1{9}$/.test(phone)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid personal or business WhatsApp number (repeated digits detected)' 
    };
  }
  if (phone === '1234567890' || phone === '9876543210') {
    return {
      isValid: false,
      error: 'Please enter your actual WhatsApp number for private beta onboarding & setup review'
    };
  }
  return { isValid: true };
}

export const AuditOfferCard: React.FC<AuditOfferCardProps> = ({ config, onPaymentSuccess, formRef }) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    businessName: '',
    city: 'India',
    monthlyLeads: '10 - 50 leads / month',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [businessTouched, setBusinessTouched] = useState(false);
  const [shakePhone, setShakePhone] = useState(false);

  const phoneInputRef = useRef<HTMLInputElement>(null);

  const phoneValidation = checkWhatsAppValidity(formData.phone);
  const isPhoneValid = phoneValidation.isValid;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const normalized = normalizeIndianPhone(rawVal);
    setFormData((prev) => ({ ...prev, phone: normalized }));
    if (!phoneTouched) setPhoneTouched(true);
    if (errorMsg) setErrorMsg(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setNameTouched(true);
    setPhoneTouched(true);
    setBusinessTouched(true);

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg('Please enter your full name so our founders know who to address.');
      return;
    }

    const validation = checkWhatsAppValidity(formData.phone);
    if (!validation.isValid) {
      setErrorMsg(validation.error || 'Please enter a valid 10-digit Indian WhatsApp number.');
      setShakePhone(true);
      setTimeout(() => setShakePhone(false), 500);
      phoneInputRef.current?.focus();
      return;
    }

    if (!formData.businessName.trim() || formData.businessName.trim().length < 2) {
      setErrorMsg('Please enter your business name & industry (e.g. Interior Design, Clinic, Solar, Consulting).');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      const booking: AuditBooking = {
        id: 'BETA-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        businessName: formData.businessName.trim(),
        city: formData.monthlyLeads || '10 - 50 leads / month',
        paymentId: 'PILOT_COHORT_ACCEPTED',
        amount: 0,
        date: new Date().toISOString(),
        status: 'paid',
      };

      try {
        const stored = JSON.parse(localStorage.getItem('leadmaxx_beta_applications') || '[]');
        stored.push(booking);
        localStorage.setItem('leadmaxx_beta_applications', JSON.stringify(stored));
      } catch (err) {
        // silent fallback
      }

      onPaymentSuccess(booking);
    }, 600);
  };

  return (
    <div
      ref={formRef as any}
      id="audit-booking-card"
      className="max-w-xl mx-auto bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 backdrop-blur-2xl border border-blue-500/40 p-5 sm:p-8 md:p-9 rounded-3xl text-left shadow-2xl shadow-blue-950/50 relative overflow-hidden transition-all duration-300 hover:border-blue-400/60 scroll-mt-28"
    >
      {/* Top Multi-Color Neon Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 shadow-md shadow-blue-500/30" />

      {/* Subtle Background Glow Orbs */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Title & Subtitle */}
      <div className="mb-6 border-b border-slate-800 pb-5 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight">
              Request Early Access
            </h3>
            <p className="text-xs sm:text-sm text-emerald-400 mt-1 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Limited Pilot Cohort • 1-on-1 Implementation Support</span>
            </p>
          </div>
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] font-bold shrink-0">
            Limited Pilot Cohort
          </div>
        </div>
      </div>

      {/* Pilot Cohort Value Highlights */}
      <div className="space-y-2.5 mb-6 text-xs sm:text-sm text-slate-300">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span className="leading-snug">
            <strong className="text-white font-semibold">Turnkey Implementation:</strong> Custom lead capture and instant delivery connected directly to your business.
          </span>
        </div>

        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span className="leading-snug">
            <strong className="text-white font-semibold">Zero Monthly Software Rent:</strong> 100% owned infrastructure that eliminates recurring platform subscriptions.
          </span>
        </div>

        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span className="leading-snug">
            <strong className="text-white font-semibold">Hands-On Setup:</strong> Direct 1-on-1 onboarding and workflow architecture designed for your services.
          </span>
        </div>
      </div>

      {/* Application Form */}
      <form id="auditForm" onSubmit={handleFormSubmit} className="space-y-4 relative z-10">
        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-500/15 border border-rose-500/40 rounded-2xl text-xs text-rose-200 flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="font-medium">{errorMsg}</div>
          </div>
        )}

        {/* 1. Full Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="cardUserName" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono flex items-center justify-center font-bold">1</span>
              <span>Full Name</span>
            </label>
            {nameTouched && formData.name.trim().length >= 2 && (
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="cardUserName"
              required
              value={formData.name}
              onBlur={() => setNameTouched(true)}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="e.g. Ramesh Kumar"
              className={`w-full bg-slate-950/80 border ${
                nameTouched && formData.name.trim().length < 2
                  ? 'border-rose-500/60 focus:border-rose-500'
                  : 'border-slate-700/80 focus:border-blue-500'
              } rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium`}
            />
          </div>
        </div>

        {/* 2. WhatsApp Number (with +91 country code) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="cardUserPhone" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center justify-center font-bold">2</span>
              <span>WhatsApp Number (+91)</span>
            </label>
            {formData.phone.length > 0 && (
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isPhoneValid
                    ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                    : 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                }`}
              >
                {isPhoneValid ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>✓ Valid 10-Digit WhatsApp</span>
                  </>
                ) : (
                  <span>{formData.phone.length}/10 Digits</span>
                )}
              </span>
            )}
          </div>

          <div className={`relative ${shakePhone ? 'animate-shake' : ''}`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400 font-bold text-xs gap-1.5 border-r border-slate-800 pr-2.5 my-2">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>+91</span>
            </div>
            <input
              ref={phoneInputRef}
              type="tel"
              id="cardUserPhone"
              required
              value={formData.phone}
              onBlur={() => setPhoneTouched(true)}
              onChange={handlePhoneChange}
              placeholder="98400 12345"
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              className={`w-full bg-slate-950/80 border ${
                phoneTouched && !isPhoneValid
                  ? 'border-rose-500 focus:border-rose-400 focus:ring-rose-500/30'
                  : isPhoneValid
                  ? 'border-emerald-500/80 focus:border-emerald-400 focus:ring-emerald-500/30 bg-emerald-950/10'
                  : 'border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/30'
              } rounded-2xl pl-20 pr-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all font-mono font-semibold tracking-wide`}
            />
          </div>

          {phoneTouched && !isPhoneValid && (
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-rose-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
              <span>{phoneValidation.error || 'Please enter a valid 10-digit Indian WhatsApp number (starts with 6, 7, 8, or 9)'}</span>
            </div>
          )}
        </div>

        {/* 3. Business Name & Industry */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="cardBusinessName" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-mono flex items-center justify-center font-bold">3</span>
              <span>Business Name &amp; Industry</span>
            </label>
            {businessTouched && formData.businessName.trim().length >= 2 && (
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="cardBusinessName"
              required
              value={formData.businessName}
              onBlur={() => setBusinessTouched(true)}
              onChange={(e) => {
                setFormData({ ...formData, businessName: e.target.value });
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="e.g. Interior Design, Clinic, Solar, Consulting"
              className={`w-full bg-slate-950/80 border ${
                businessTouched && formData.businessName.trim().length < 2
                  ? 'border-rose-500/60 focus:border-rose-500'
                  : 'border-slate-700/80 focus:border-blue-500'
              } rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium`}
            />
          </div>
        </div>

        {/* 4. Monthly Lead Volume */}
        <div>
          <label htmlFor="cardMonthlyLeads" className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
            <span className="h-4 w-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono flex items-center justify-center font-bold">4</span>
            <span>Monthly Lead Volume</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <BarChart3 className="w-4 h-4" />
            </div>
            <select
              id="cardMonthlyLeads"
              value={formData.monthlyLeads}
              onChange={(e) => setFormData({ ...formData, monthlyLeads: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-blue-500 rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium cursor-pointer"
            >
              <option value="10 - 50 leads / month">10 - 50 leads / month</option>
              <option value="51 - 150 leads / month">51 - 150 leads / month</option>
              <option value="151 - 500 leads / month">151 - 500 leads / month</option>
              <option value="500+ leads / month">500+ leads / month</option>
            </select>
          </div>
        </div>

        {/* Form Submit Button: "Submit Beta Application →" */}
        <div className="pt-3">
          <button
            type="submit"
            id="cardPayBtn"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base text-slate-950 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 transition-all duration-200 inline-flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group leading-none text-center"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 shrink-0 animate-spin text-slate-950" />
                <span>Submitting Beta Application...</span>
              </span>
            ) : (
              <span className="inline-flex items-center justify-center gap-2">
                <span>Submit Beta Application</span>
                <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>

          {/* Form Microcopy */}
          <p className="text-xs text-slate-400 font-medium text-center mt-3 leading-relaxed">
            Qualified service businesses will receive a direct invitation within 24 hours.
          </p>
        </div>
      </form>

      {/* Pilot Trust Indicator Bar */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400 font-medium">
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero Credit Card Required</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="inline-flex items-center gap-1 text-blue-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>No Monthly Subscription</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="inline-flex items-center gap-1 text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Data &amp; Asset Ownership</span>
          </span>
        </div>
      </div>
    </div>
  );
};

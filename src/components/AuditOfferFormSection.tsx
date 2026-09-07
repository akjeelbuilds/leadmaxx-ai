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
  AlertCircle, 
  Clock, 
  Mail,
  FileText
} from 'lucide-react';
import { LeadFormData, AppConfig, AuditBooking } from '../types';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzkEhh8fSBI7DDK5iCJtuhvwhKDk8Y4ZkovedC75S89Fv94R24NkTtkzvuxBnPRHpZ_/exec";

interface AuditOfferFormSectionProps {
  config: AppConfig;
  onPaymentSuccess: (booking: AuditBooking) => void;
  sectionRef?: React.RefObject<HTMLDivElement | null>;
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

export const AuditOfferFormSection: React.FC<AuditOfferFormSectionProps> = ({
  config,
  onPaymentSuccess,
  sectionRef,
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    email: '',
    notes: '',
    businessName: '',
    city: 'India',
    monthlyLeads: '10 - 50 leads / month',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setNameTouched(true);
    setPhoneTouched(true);
    setEmailTouched(true);

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

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          notes: formData.notes,
        }),
      });

      // Save to localStorage for persistence
      try {
        const stored = JSON.parse(localStorage.getItem('leadmaxx_beta_applications') || '[]');
        stored.push({
          id: 'BETA-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email?.trim() || '',
          notes: formData.notes?.trim() || '',
          date: new Date().toISOString(),
        });
        localStorage.setItem('leadmaxx_beta_applications', JSON.stringify(stored));
      } catch (err) {
        // silent fallback
      }
    } catch (err) {
      console.error('Error submitting beta application:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <section
      ref={sectionRef as any}
      id="audit-form-section"
      className="scroll-mt-24 sm:scroll-mt-28 px-4 py-12 sm:py-16 max-w-4xl mx-auto text-center"
    >
      {/* Section Header */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          EARLY ADOPTER ACCESS
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight">
          Apply to Join the LeadMaxx Private Beta
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-2 font-medium leading-relaxed">
          We are onboarding an exclusive cohort of Indian service businesses to deploy their custom lead engine with zero ongoing software rent.
        </p>
      </div>

      {/* Main Application Card */}
      <div
        id="audit-booking-card"
        className="max-w-xl mx-auto bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 backdrop-blur-2xl border border-blue-500/40 p-5 sm:p-8 md:p-9 rounded-3xl text-left shadow-2xl shadow-blue-950/50 relative overflow-hidden transition-all duration-300 hover:border-blue-400/60"
      >
        {/* Top Multi-Color Neon Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 shadow-md shadow-blue-500/30" />

        {/* Subtle Background Glow Orbs */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {isSubmitted ? (
          /* Beta Application Confirmation View */
          <div className="py-6 px-2 sm:px-4 text-center relative z-10 animate-fade-in">
            {/* Animated Glow / Success Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-5 shadow-2xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" />
            </div>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pilot Cohort Registered</span>
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight mb-3">
              Beta Application Received!
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed font-normal">
              Thank you for applying for early beta access. We are reviewing your details and will get back to you via WhatsApp or Email within 24 hours.
            </p>

            {/* Application Recap Box */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 max-w-md mx-auto mb-6 text-left space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-slate-400 border-b border-slate-800/60 pb-2">
                <span>Applicant:</span>
                <span className="font-semibold text-white">{formData.name}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 border-b border-slate-800/60 pb-2">
                <span>WhatsApp:</span>
                <span className="font-semibold text-emerald-400 font-mono">+91 {formData.phone}</span>
              </div>
              {formData.email && (
                <div className="flex justify-between items-center text-slate-400 border-b border-slate-800/60 pb-2">
                  <span>Email:</span>
                  <span className="font-semibold text-white truncate max-w-[200px]">{formData.email}</span>
                </div>
              )}
              {formData.notes && (
                <div className="flex justify-between items-start text-slate-400">
                  <span className="shrink-0">Notes:</span>
                  <span className="font-medium text-slate-200 text-right ml-2 line-clamp-2">{formData.notes}</span>
                </div>
              )}
            </div>

            {/* Action button */}
            <div className="max-w-md mx-auto space-y-3.5">
              <a
                href="https://wa.me/916382298388?text=Hi%2C%20I%20just%20submitted%20my%20LeadMaxx%20beta%20application!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base text-slate-950 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 transition-all duration-200 inline-flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 cursor-pointer text-center group leading-none"
              >
                <span>💬 Fast-Track Access: Ping Us on WhatsApp</span>
              </a>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Need expedited setup? Our founders respond on WhatsApp within 2 hours.</span>
              </div>
            </div>

            {/* Trust Reassurance */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400 font-medium">
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
                <span>100% Data Ownership</span>
              </span>
            </div>
          </div>
        ) : (
          <>
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
                <div className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] font-bold shrink-0">
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
                  <label htmlFor="userName" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
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
                    id="userName"
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
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                  <label htmlFor="userPhone" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
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
                    id="userPhone"
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

              {/* 3. Email Address */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="userEmail" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="h-4 w-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-mono flex items-center justify-center font-bold">3</span>
                    <span>Email Address</span>
                  </label>
                  {emailTouched && formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="userEmail"
                    value={formData.email}
                    onBlur={() => setEmailTouched(true)}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="e.g. ramesh@company.com"
                    className={`w-full bg-slate-950/80 border ${
                      emailTouched && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                        ? 'border-rose-500/60 focus:border-rose-500'
                        : 'border-slate-700/80 focus:border-blue-500'
                    } rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium`}
                  />
                </div>
              </div>

              {/* 4. Notes & Business Requirements */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="userNotes" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="h-4 w-4 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-mono flex items-center justify-center font-bold">4</span>
                    <span>Business &amp; Requirements (Notes)</span>
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute top-3.5 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <textarea
                    id="userNotes"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => {
                      setFormData({ ...formData, notes: e.target.value, businessName: e.target.value });
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="e.g. Interior Design Studio, ~50 leads/month, need instant WhatsApp responses"
                    className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-blue-500 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium resize-none"
                  />
                </div>
              </div>

              {/* Form Submit Button: "Submit Beta Application →" */}
              <div className="pt-3">
                <button
                  type="submit"
                  id="payBtn"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base text-slate-950 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 transition-all duration-200 inline-flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group leading-none text-center"
                >
                  {isSubmitting ? (
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
          </>
        )}
      </div>
    </section>
  );
};

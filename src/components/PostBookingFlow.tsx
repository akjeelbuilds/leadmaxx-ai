import React, { useState } from 'react';
import { CheckCircle2, Calendar, Clock, Video, ArrowRight, ExternalLink, Sparkles, MapPin, Copy, Check } from 'lucide-react';
import { AuditBooking, AppConfig } from '../types';

interface PostBookingFlowProps {
  booking: AuditBooking;
  config: AppConfig;
  onReset: () => void;
}

export const PostBookingFlow: React.FC<PostBookingFlowProps> = ({ booking, config, onReset }) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('Tomorrow, 11:30 AM IST');
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Generate target redirect link
  const targetCalendlyUrl = `${config.calendlyUrl}?name=${encodeURIComponent(booking.name)}&a1=${encodeURIComponent(
    booking.phone
  )}&a2=${encodeURIComponent(booking.businessName)}&payment_id=${encodeURIComponent(booking.paymentId)}`;

  const availableSlots = [
    'Tomorrow at 11:30 AM IST',
    'Tomorrow at 3:00 PM IST',
    'Tomorrow at 5:30 PM IST',
    'Day after at 10:00 AM IST',
    'Day after at 2:00 PM IST',
    'Day after at 6:30 PM IST',
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetCalendlyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-left animate-fade-in">
      {/* Top Banner */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500"></div>

        {/* Success Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Application Received
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {booking.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 font-display">
              Beta Spot Reserved for {booking.name}!
            </h1>
          </div>
        </div>

        {/* Order Details Receipt */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 text-xs sm:text-sm space-y-2 mb-6">
          <div className="flex justify-between text-slate-400">
            <span>Full Name:</span>
            <span className="text-white font-semibold">{booking.name}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Business / Industry:</span>
            <span className="text-white font-semibold">{booking.businessName}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>WhatsApp Mobile:</span>
            <span className="text-white font-semibold">+91 {booking.phone}</span>
          </div>
          <div className="flex justify-between text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Pilot Cohort Status:</span>
            <span className="text-emerald-400 font-bold text-base">100% Free Pilot Access (Zero Software Rent)</span>
          </div>
        </div>

        {/* Step 2: Lock In Meeting Slot */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-display">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>Choose Your 20-Minute Onboarding Call Time</span>
            </h2>
          </div>

          {!confirmed ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Select a convenient time for your 1-on-1 WhatsApp setup call:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                      selectedSlot === slot
                        ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500 shadow'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{slot}</span>
                    </div>
                    {selectedSlot === slot && <Check className="w-4 h-4 text-blue-400" />}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmed(true)}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer leading-none"
                >
                  <Video className="w-4 h-4 shrink-0" />
                  <span>Confirm Slot: {selectedSlot}</span>
                </button>

                <a
                  href={targetCalendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer leading-none"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Pick Different Date in Calendly</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 space-y-2 animate-fade-in">
              <div className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Call Confirmed for {selectedSlot}!</span>
              </div>
              <p className="text-xs text-emerald-300/80">
                A Google Meet link & reminder has been sent to <strong>+91 {booking.phone}</strong> on WhatsApp.
              </p>
            </div>
          )}

          {/* Diagnostic Preparation list */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-2 text-xs text-slate-400 mt-4">
            <span className="font-bold text-slate-200 block font-display">What to have ready for the call:</span>
            <ul className="space-y-1.5 list-disc list-inside text-[11px]">
              <li>Your current website or Google Business listing link (if any).</li>
              <li>1 sample brochure, price list, or photos you usually send to clients.</li>
              <li>We will show you how automated 5-second WhatsApp replies work for your business.</li>
            </ul>
          </div>
        </div>

        {/* Footer controls */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            ← Return to Homepage
          </button>

          <button
            onClick={handleCopyLink}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Calendar Link Copied!' : 'Copy Direct Booking Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

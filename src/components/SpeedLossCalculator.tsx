import React, { useState } from 'react';
import { Calculator, TrendingDown, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface SpeedLossCalculatorProps {
  onScrollToForm: () => void;
}

interface IndustryPreset {
  label: string;
  leads: number;
  dealValue: number;
}

const PRESETS: IndustryPreset[] = [
  { label: 'Interiors / Kitchens', leads: 45, dealValue: 450000 },
  { label: 'Coaching / EdTech', leads: 90, dealValue: 65000 },
  { label: 'Clinics / Dental', leads: 50, dealValue: 75000 },
  { label: 'Real Estate / Plots', leads: 60, dealValue: 250000 },
  { label: 'Solar / Contractors', leads: 35, dealValue: 220000 },
];

export const SpeedLossCalculator: React.FC<SpeedLossCalculatorProps> = ({ onScrollToForm }) => {
  const [monthlyLeads, setMonthlyLeads] = useState<number>(45);
  const [averageDealValue, setAverageDealValue] = useState<number>(450000);
  const [currentResponseTime, setCurrentResponseTime] = useState<'slow' | 'medium' | 'delay'>('medium');

  // Multipliers based on lead response studies
  const dropoffRate = currentResponseTime === 'slow' ? 0.35 : currentResponseTime === 'medium' ? 0.55 : 0.72;
  const lostLeadsCount = Math.round(monthlyLeads * dropoffRate);
  const conversionRate = 0.12; // 12% closing rate if contacted instantly
  const lostRevenue = Math.round(lostLeadsCount * conversionRate * averageDealValue);
  const recoveredRevenue = Math.round(lostRevenue * 0.75); // 75% can be salvaged by sub-30s WhatsApp

  const applyPreset = (p: IndustryPreset) => {
    setMonthlyLeads(p.leads);
    setAverageDealValue(p.dealValue);
  };

  const formatCurrency = (val: number) => {
    return '₹ ' + new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="py-14 sm:py-20 border-t border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Customer Loss Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
            How Many Sales Are You Losing to Slow Replies?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-2 font-normal">
            In Indian service businesses, 78% of customers buy from the first vendor who sends details on WhatsApp.
          </p>
        </div>

        {/* 1-Click Industry Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 custom-scrollbar mb-6 justify-start sm:justify-center">
          <span className="text-xs text-slate-400 font-semibold shrink-0 pl-1">Quick Preset:</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-medium whitespace-nowrap transition-all cursor-pointer active:scale-95"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Controls */}
          <div className="lg:col-span-7 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl text-left">
            <div>
              <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-2">
                <span className="text-slate-300">Customer Inquiries per Month:</span>
                <span className="text-blue-400 font-bold text-sm sm:text-base">{monthlyLeads} inquiries/mo</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={monthlyLeads}
                onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
                <span>10 leads</span>
                <span>150 leads</span>
                <span>300+ leads</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-2">
                <span className="text-slate-300">Average Profit / Deal Value per Sale:</span>
                <span className="text-emerald-400 font-bold text-sm sm:text-base">{formatCurrency(averageDealValue)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={averageDealValue}
                onChange={(e) => setAverageDealValue(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
                <span>₹ 10,000</span>
                <span>₹ 5,00,000</span>
                <span>₹ 10,00,000+</span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                How fast do you usually reply to new inquiries?
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentResponseTime('slow')}
                  className={`py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-semibold border text-center transition-all cursor-pointer truncate ${
                    currentResponseTime === 'slow'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 ring-1 ring-blue-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Within 30 Mins
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentResponseTime('medium')}
                  className={`py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-semibold border text-center transition-all cursor-pointer truncate ${
                    currentResponseTime === 'medium'
                      ? 'bg-amber-600/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  1 - 4 Hours
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentResponseTime('delay')}
                  className={`py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-semibold border text-center transition-all cursor-pointer truncate ${
                    currentResponseTime === 'delay'
                      ? 'bg-red-600/20 border-red-500 text-red-300 ring-1 ring-red-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Same / Next Day
                </button>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 sm:p-7 flex flex-col justify-between shadow-xl text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Calculation Summary</span>
              
              <div className="mt-4 p-4 rounded-2xl bg-red-950/30 border border-red-800/40">
                <div className="flex items-center gap-2 text-xs font-semibold text-red-400 mb-1">
                  <TrendingDown className="w-4 h-4 shrink-0" />
                  <span>Estimated Sales Lost Every Month</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-red-300 font-display">
                  {formatCurrency(lostRevenue)}
                </div>
                <div className="text-[11px] text-red-400/80 mt-1 font-normal">
                  ~{lostLeadsCount} prospects buy from faster competitors due to delayed replies.
                </div>
              </div>

              <div className="mt-3 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span>Extra Sales Won with 5-Sec WhatsApp Replies</span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-300 font-display">
                  +{formatCurrency(recoveredRevenue)}/mo
                </div>
                <div className="text-[11px] text-emerald-400/80 mt-1 font-normal">
                  By dispatching your pricing & catalog instantly on WhatsApp.
                </div>
              </div>
            </div>

            <button
              id="calc-book-cta"
              onClick={onScrollToForm}
              className="mt-6 w-full py-4 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/30 transition-all cursor-pointer group leading-none text-center"
            >
              <span>Apply for Beta Access</span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

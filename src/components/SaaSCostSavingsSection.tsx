import React from 'react';
import { 
  TrendingDown, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Server, 
  MessageSquare, 
  Database, 
  Layers,
  Globe,
  Bell,
  Check
} from 'lucide-react';

interface SaaSCostSavingsSectionProps {
  onScrollToForm: () => void;
}

export function SaaSCostSavingsSection({ onScrollToForm }: SaaSCostSavingsSectionProps) {
  // Left Column: The Monthly Subscription Trap
  const traditionalItems = [
    {
      title: '3 Separate Monthly Bills',
      badge: '₹2,500/mo',
      icon: Globe,
      detail: 'Paying separately for website hosting, form plugins, and message tools.',
    },
    {
      title: 'Extra Cut on Every Message',
      badge: 'Extra Fees',
      icon: MessageSquare,
      detail: 'Middleman software charges high markups on top of standard official rates.',
    },
    {
      title: 'Bills Auto-Debit in Slow Months',
      badge: 'Auto-Debited',
      icon: Layers,
      detail: 'Your card gets charged every month even when client inquiries are low.',
    },
    {
      title: 'Stop Paying, Lose Everything',
      badge: 'Zero Control',
      icon: Server,
      detail: 'Cancel your monthly subscription, and your forms and customer history vanish.',
    },
  ];

  // Right Column: Your Own Lead Engine
  const leadMaxxItems = [
    {
      title: 'Website & Form Included',
      badge: '₹0/mo',
      cost: '₹0/mo',
      icon: Zap,
      detail: 'High-speed landing page built specifically for your service business.',
    },
    {
      title: 'Direct Official Chat Connection',
      badge: '₹0/mo',
      cost: '₹0/mo',
      icon: MessageSquare,
      detail: 'No software middleman. You only pay direct, standard messaging charges.',
    },
    {
      title: 'Instant Phone & Sheet Sync',
      badge: '₹0/mo',
      cost: '₹0/mo',
      icon: Bell,
      detail: 'New customer details hit your personal phone and spreadsheet instantly.',
    },
    {
      title: 'You Own Your Client Data',
      badge: '₹0/mo',
      cost: '₹0/mo',
      icon: Database,
      detail: 'A permanent business asset. No third party can ever lock you out of your leads.',
    },
  ];

  return (
    <section className="px-4 sm:px-6 pt-10 sm:pt-14 pb-12 max-w-6xl mx-auto">
      {/* Outer Card with glowing border */}
      <div className="relative rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 p-4 sm:p-8 md:p-10 shadow-2xl shadow-blue-950/40 overflow-hidden">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
        
        {/* Background glow orb */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto px-4 mb-6">
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-5 max-w-full">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
            <span className="text-center leading-tight">Stop The Recurring Expense Drain</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-3">
            Stop Paying ₹50,000+ Every Year on{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Monthly Software Rent
            </span>
          </h2>
          
          <p className="text-sm leading-normal sm:text-sm sm:leading-relaxed text-slate-300 max-w-2xl mx-auto">
            Most service businesses bleed cash on separate subscriptions for landing pages, form plugins, and messaging tools. We replace recurring SaaS fees with one direct, owned lead engine.
          </p>
        </div>

        {/* Perfectly Centered Savings Banner Across All Viewports */}
        <div className="w-full max-w-md sm:max-w-lg mx-auto bg-emerald-950/40 border border-emerald-500/30 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-center justify-center gap-3 mb-8">
          <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
          </div>
          <p className="text-sm leading-snug sm:text-sm font-semibold text-white text-left m-0">
            Zero Monthly Software Rent <span className="text-emerald-400">•</span> Keep 100% of Your Data
          </p>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* Column 1: The Recurring Expense Trap */}
          <div className="rounded-2xl bg-slate-950/60 border border-rose-500/20 p-4 sm:p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm sm:text-base">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <span>The Monthly Subscription Trap (Websites + Plugins + Apps)</span>
                </div>
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 whitespace-nowrap">
                  ₹3,500 - ₹7,000 every single month
                </span>
              </div>

              <div className="space-y-3">
                {traditionalItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between min-h-[auto] sm:min-h-[96px]">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon className="w-4 h-4 text-rose-400 shrink-0" />
                            <span className="text-xs font-bold text-slate-200 truncate">{item.title}</span>
                          </div>
                          <span className="text-xs sm:text-[9px] font-semibold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                            {item.badge}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm sm:text-xs text-slate-300 mt-2 leading-snug font-medium">{item.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Footer for Subscription Trap */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between bg-rose-950/20 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 rounded-b-2xl">
              <div>
                <span className="text-xs sm:text-[11px] text-slate-400 block">Total Yearly Subscription Bills</span>
                <span className="text-sm sm:text-xs text-rose-300 font-medium">Multiple fragmented monthly tools</span>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg font-extrabold text-rose-400 font-display">
                  ₹42,000 - ₹84,000/yr
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Your Own Direct Lead Engine (LeadMaxx) */}
          <div className="rounded-2xl bg-gradient-to-b from-blue-950/30 to-slate-950/80 border border-emerald-500/40 p-4 sm:p-6 flex flex-col justify-between shadow-xl shadow-emerald-950/20 h-full">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Your Own Direct Lead Engine (LeadMaxx)</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap">
                  One-Time Setup • ₹0/mo Rent
                </span>
              </div>

              <div className="space-y-3">
                {leadMaxxItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/25 hover:border-emerald-500/50 transition-colors flex flex-col justify-between min-h-[auto] sm:min-h-[96px]">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="text-xs font-bold text-white truncate">{item.title}</span>
                          </div>
                          <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap shrink-0">
                            {item.cost}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm sm:text-xs text-slate-200 mt-2 leading-snug font-medium">{item.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Footer for LeadMaxx */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between bg-emerald-950/30 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 rounded-b-2xl">
              <div>
                <span className="text-xs sm:text-[11px] text-emerald-300 block font-semibold">Total Monthly Platform Rent</span>
                <span className="text-sm sm:text-xs text-slate-400 font-normal">Direct wholesale infrastructure only</span>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg font-extrabold text-emerald-400 font-display">
                  ₹0/yr Rent
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Reassurance Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-sm leading-normal sm:text-sm sm:leading-relaxed font-semibold text-slate-300 mb-4">
            Built specifically for Indian service businesses who want to own their systems instead of renting them forever.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-xs font-bold text-white block">100% Data Ownership</span>
              <span className="text-xs sm:text-[11px] text-slate-400 leading-snug">All customer inquiries saved to your private Google Sheet</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-xs font-bold text-white block">Official Meta Developer API</span>
              <span className="text-xs sm:text-[11px] text-slate-400 leading-snug">1,000 free service conversations every month</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-xs font-bold text-white block">Zero Monthly Tool Fees</span>
              <span className="text-xs sm:text-[11px] text-slate-400 leading-snug">Pay only official Meta conversation rates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


import React from 'react';
import { 
  Globe, 
  ShieldCheck, 
  MessageSquare, 
  PhoneCall, 
  Table, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Zap
} from 'lucide-react';

interface AllInclusiveSectionProps {
  onScrollToForm: () => void;
}

export const AllInclusiveSection: React.FC<AllInclusiveSectionProps> = ({ onScrollToForm }) => {
  const deliverables = [
    {
      icon: Globe,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      badge: 'Under 2s Speed',
      title: 'High-Speed Mobile Landing Page',
      description:
        'Loads in under 2 seconds on Indian 4G/5G mobile networks, built to capture customer attention instantly without heavy plugin lag.',
      highlights: ['Under 2s mobile load time', 'Optimized for Indian mobile buyers', 'Zero WordPress plugin bloat'],
    },
    {
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      badge: 'Official Meta Connection',
      title: 'Official Green-Badge Ready WhatsApp Setup',
      description:
        'Connected directly to your verified business phone number with official Meta developer endpoints for maximum delivery rates.',
      highlights: ['Direct Meta Cloud API connection', 'Works with your business number', '1,000 free conversations/month'],
    },
    {
      icon: MessageSquare,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/10 border-green-500/20',
      badge: '5-Second Delivery',
      title: 'Automatic Rate Sheet & PDF Brochure Dispatch',
      description:
        'Customer immediately gets your price list, catalog, or portfolio on WhatsApp in 5 seconds while their buying interest is at its peak.',
      highlights: ['Instant PDF rate sheet dispatch', 'Customized to customer requirement', 'No manual copying or forwarding'],
    },
    {
      icon: PhoneCall,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10 border-purple-500/20',
      badge: 'Instant Mobile Ding',
      title: "Instant WhatsApp Alert to Owner's Phone",
      description:
        "Ding notification on your phone with customer name, budget, requirement, and direct 1-tap call button so you can call before rivals do.",
      highlights: ['1-tap direct call button', 'Instant mobile notification', 'Full inquiry summary formatted'],
    },
    {
      icon: Table,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      badge: '100% Data Ownership',
      title: 'Google Sheet Auto-Sync',
      description:
        'Every customer inquiry automatically recorded in your own Google Sheet with date, time, customer phone, and requested service.',
      highlights: ['Real-time automatic sync', '100% private Google Sheet access', 'Export to Excel or CRM anytime'],
    },
    {
      icon: Zap,
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/10 border-indigo-500/20',
      badge: 'Lifetime Setup',
      title: 'Zero Monthly Software Fees',
      description:
        'Lifetime setup with no recurring software agency charges or monthly platform maintenance fees to keep running.',
      highlights: ['Pay ₹0 monthly platform rent', 'No agency retainer charges', 'Lifetime direct infrastructure ownership'],
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 max-w-6xl mx-auto relative overflow-hidden" id="all-inclusive-setup">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Zap className="w-3.5 h-3.5 shrink-0" />
          <span>100% DONE-FOR-YOU</span>
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display mb-3 text-balance">
          Everything We Build &amp; Set Up For You
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          No confusing technical work. No monthly software bills. We build and launch your complete lead generation setup ready to get customers.
        </p>
      </div>

      {/* 6 Deliverable Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {deliverables.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/90 p-5 sm:p-6 backdrop-blur-sm flex flex-col justify-between hover:border-slate-700/80 transition-all group hover:bg-slate-900/90 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div
                    className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border ${item.iconBg} ${item.iconColor}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white font-display mb-2 group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm leading-normal sm:text-sm sm:leading-relaxed text-slate-300 mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                {item.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Card Ribbon */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-blue-950/50 border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 text-left">
        <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 w-full sm:w-auto">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-xs font-bold text-emerald-400 uppercase tracking-wider">
              TOTAL MONTHLY RUNNING COST FOR EVERYTHING ABOVE
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-display flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-emerald-400 font-extrabold tracking-tight">₹ 0<span className="text-base sm:text-lg font-semibold text-emerald-300/90 ml-1">/month</span></span>
              <span className="text-sm sm:text-xs font-normal text-slate-400 block sm:inline ml-1">(Pay only your regular ~₹ 800/year domain renewal)</span>
            </div>
          </div>
        </div>

        <button
          onClick={onScrollToForm}
          className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 whitespace-nowrap shrink-0"
        >
          <span>Apply for Beta Access →</span>
        </button>
      </div>
    </section>
  );
};

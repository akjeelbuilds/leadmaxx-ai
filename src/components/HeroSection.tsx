import React from 'react';
import { WhatsAppSimulator } from './WhatsAppSimulator';

interface HeroSectionProps {
  onScrollToAudit: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToAudit }) => {
  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center pt-4 pb-8 sm:pt-6 sm:pb-12 lg:py-6 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-4 lg:px-6 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full max-w-7xl mx-auto">
          
          {/* Left Column (col-span-5): Copy, Pain Point & Primary CTA */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4 text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[11px] sm:text-xs font-semibold text-slate-200 self-start">
              <span>🇮🇳 BUILT FOR INDIAN MSMES • PRIVATE BETA</span>
            </div>

            {/* Headline <h1> */}
            <h1 className="text-[clamp(1.18rem,4.9vw,1.45rem)] sm:text-2xl md:text-3xl lg:text-[1.72rem] font-black leading-tight tracking-tight text-white mb-2">
              <span className="block">Never Keep an Inquiry Waiting.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mt-0.5 sm:mt-1 whitespace-nowrap">
                Your Complete 5-Second Lead Engine.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs leading-normal sm:text-sm md:text-base sm:leading-relaxed text-slate-300 max-w-lg">
              While competitors take hours to follow up, your engine delivers prices, brochures, and booking links to their WhatsApp instantly. 100% owned infrastructure with zero monthly SaaS rent.
            </p>

            {/* The 4 Clean Bullet Chips (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <div className="py-1 px-2 text-[11px] sm:text-xs md:text-sm rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 flex items-center gap-1.5 min-w-0">
                <span className="shrink-0 text-emerald-400 text-xs sm:text-sm">⚡</span>
                <span className="truncate whitespace-nowrap">Fast Mobile Funnel</span>
              </div>
              <div className="py-1 px-2 text-[11px] sm:text-xs md:text-sm rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 flex items-center gap-1.5 min-w-0">
                <span className="shrink-0 text-blue-400 text-xs sm:text-sm">💬</span>
                <span className="truncate whitespace-nowrap">Official WhatsApp</span>
              </div>
              <div className="py-1 px-2 text-[11px] sm:text-xs md:text-sm rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 flex items-center gap-1.5 min-w-0">
                <span className="shrink-0 text-amber-400 text-xs sm:text-sm">📄</span>
                <span className="truncate whitespace-nowrap">Instant Rate Cards</span>
              </div>
              <div className="py-1 px-2 text-[11px] sm:text-xs md:text-sm rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 flex items-center gap-1.5 min-w-0">
                <span className="shrink-0 text-purple-400 text-xs sm:text-sm">📲</span>
                <span className="truncate whitespace-nowrap">Hot Lead Alerts</span>
              </div>
            </div>

            {/* Primary CTA Area */}
            <div>
              <button
                id="hero-primary-cta"
                onClick={onScrollToAudit}
                className="w-full sm:w-auto inline-flex items-center justify-center py-2.5 px-4 sm:px-6 sm:py-3.5 rounded-xl text-xs sm:text-sm md:text-base font-bold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer group leading-none text-center"
              >
                <span>Request Beta Access (Free Pilot) →</span>
              </button>
              <p className="text-[11px] text-slate-400 mt-2">Private Beta • Limited to 25 verified Indian service businesses</p>
            </div>
          </div>

          {/* Right Column (col-span-7): Live WhatsApp Simulator */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col w-full max-w-2xl mx-auto lg:max-w-none">
            <div className="relative group w-full flex flex-col">
              {/* Subtle surrounding glow aura */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-lg opacity-25 group-hover:opacity-35 transition duration-500 pointer-events-none"></div>

              <WhatsAppSimulator onBookCall={onScrollToAudit} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


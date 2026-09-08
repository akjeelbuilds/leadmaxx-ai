import React from 'react';
import { WhatsAppSimulator } from './WhatsAppSimulator';

interface HeroSectionProps {
  onScrollToAudit: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToAudit }) => {
  return (
    <section className="relative w-full min-h-0 sm:min-h-[calc(100vh-4rem)] flex items-center justify-center pt-6 sm:pt-4 pb-6 sm:pb-12 lg:py-6 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-4 lg:px-6 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-8 items-start w-full max-w-7xl mx-auto">
          
          {/* Left Column: Copy, Pain Point & Primary CTA */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center space-y-2 sm:space-y-4 text-left w-full max-w-2xl lg:max-w-2xl">
            {/* Pill Tag */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 self-start mt-2 mb-3 sm:mb-4">
              <svg 
                viewBox="0 0 24 16" 
                className="w-4 h-3 rounded-[2px] overflow-hidden shrink-0 mr-1.5 shadow-sm inline-block" 
                aria-label="Flag of India"
                role="img"
              >
                <rect width="24" height="5.33" fill="#FF9933" />
                <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
                <rect y="10.66" width="24" height="5.34" fill="#138808" />
                <circle cx="12" cy="8" r="2" fill="none" stroke="#000080" strokeWidth="0.8" />
                <circle cx="12" cy="8" r="0.6" fill="#000080" />
              </svg>
              <span>BUILT FOR INDIAN MSMES • PRIVATE BETA</span>
            </div>

            {/* Headline <h1> */}
            <h1 className="font-black leading-tight lg:leading-[1.15] tracking-tight text-white mb-2">
              <span className="block text-2xl sm:text-3xl lg:text-[2.4rem] xl:text-[2.75rem] lg:whitespace-nowrap">
                Never Keep an Inquiry Waiting.
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-[2.1rem] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mt-1 whitespace-normal sm:whitespace-nowrap">
                Your 5-Second Lead Engine.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base leading-normal sm:leading-relaxed text-slate-300 max-w-lg mb-3">
              While competitors take hours to follow up, your engine delivers prices, brochures, and booking links to their WhatsApp instantly. 100% owned infrastructure with zero monthly SaaS rent.
            </p>

            {/* The 4 Clean Bullet Chips (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <div className="py-1 px-2 text-xs md:text-sm rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 flex items-center gap-1.5 min-w-0">
                <span className="shrink-0 text-xs sm:text-sm">🚀</span>
                <span className="truncate whitespace-nowrap">Instant Lead Capture</span>
              </div>
              <div className="py-1 px-2 text-xs md:text-sm rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 flex items-center gap-1.5 min-w-0">
                <span className="shrink-0 text-xs sm:text-sm">📲</span>
                <span className="truncate whitespace-nowrap">Real-Time Owner Alert</span>
              </div>
              <div className="py-1 px-2 text-xs md:text-sm rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 flex items-center gap-1.5 min-w-0">
                <span className="shrink-0 text-xs sm:text-sm">📋</span>
                <span className="truncate whitespace-nowrap">Auto Rates & Details</span>
              </div>
              <div className="py-1 px-2 text-xs md:text-sm rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 flex items-center gap-1.5 min-w-0">
                <span className="shrink-0 text-xs sm:text-sm">💰</span>
                <span className="truncate whitespace-nowrap">₹0 Software Cost</span>
              </div>
            </div>

            {/* Primary CTA Area - Hidden on mobile, leaving sticky nav / bottom CTA */}
            <div className="hidden sm:block">
              <button
                id="hero-primary-cta"
                onClick={onScrollToAudit}
                className="w-full sm:w-auto inline-flex items-center justify-center py-2.5 px-4 sm:px-6 sm:py-3.5 rounded-xl text-xs sm:text-sm md:text-base font-bold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer group leading-none text-center"
              >
                <span>Request Beta Access (Free Pilot) →</span>
              </button>
              <p className="text-xs sm:text-[11px] text-slate-400 mt-2">Private Beta • Limited to 25 verified Indian service businesses</p>
            </div>
          </div>

          {/* Right Column: Live WhatsApp Simulator */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col w-full max-w-2xl mx-auto lg:max-w-none h-auto min-h-0">
            <div className="relative group w-full flex flex-col h-auto min-h-0">
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


import React from 'react';
import { Settings, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AppConfig } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  config: AppConfig;
  onOpenSettings: () => void;
  onScrollToForm: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ config, onOpenSettings, onScrollToForm }) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-colors">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="cursor-pointer group flex items-center shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo size="md" />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Config / Settings button */}
          <button
            id="nav-settings-btn"
            onClick={onOpenSettings}
            title="Configure Razorpay & Calendly"
            className="hidden sm:inline-flex p-2 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-sm cursor-pointer shrink-0 items-center justify-center"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* CTA Button */}
          <button
            id="nav-book-cta"
            onClick={onScrollToForm}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all duration-200 shadow-sm leading-none text-center cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="leading-none">Request Beta Access</span>
          </button>
        </div>
      </div>
    </header>
  );
};

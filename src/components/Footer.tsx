import React from 'react';
import { Heart, Shield, Lock, MapPin, Mail, FileText, RotateCcw, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';
import { LegalDocType } from './LegalModal';

interface FooterProps {
  onScrollToForm: () => void;
  onOpenLegal: (doc: LegalDocType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToForm, onOpenLegal }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 pt-12 pb-16 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Tier */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-5 sm:gap-6 pb-8 border-b border-slate-800/80 text-center sm:text-left">
          <Logo size="sm" showSubtitle={false} />

          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-6 text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Built for Small &amp; Service Businesses
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              100% Free Pilot Access
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              Zero Platform Subscription Rent
            </span>
          </div>

          <button
            onClick={onScrollToForm}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer"
          >
            <span>Join Private Beta ↑</span>
          </button>
        </div>

        {/* Legal Links Row */}
        <div className="py-6 border-b border-slate-900 flex flex-wrap items-center justify-center sm:justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium text-slate-400">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3 h-3 text-slate-500" />
              <span>Terms & Conditions</span>
            </button>
            <button
              onClick={() => onOpenLegal('refund')}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-emerald-500" />
              <span>Refund Policy</span>
            </button>
            <button
              onClick={() => onOpenLegal('disclaimer')}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <AlertCircle className="w-3 h-3 text-amber-500" />
              <span>Disclaimer</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>Support:</span>
            <a 
              href="mailto:support@leadmaxx.ai" 
              className="text-slate-300 hover:text-blue-400 font-mono transition-colors"
            >
              support@leadmaxx.ai
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-[11px] text-slate-500 text-center sm:text-left leading-snug">
          <div>
            <p>
              © {new Date().getFullYear()} LeadMaxx.ai. Automatic WhatsApp Replies &amp; Lead Engines for Small Businesses.
            </p>
            <p className="text-xs sm:text-[10px] text-slate-500 mt-1 leading-snug">
              Proudly built for Indian service businesses, founders, and local practices. Zero monthly software rent, 100% owned infrastructure.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="font-mono text-xs sm:text-[10px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              DPDP Act (India) Compliant
            </span>
            <p className="flex items-center justify-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Growing Businesses
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

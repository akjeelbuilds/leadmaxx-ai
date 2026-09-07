import React from 'react';
import {
  Home,
  HeartPulse,
  GraduationCap,
  Building2,
  SunMedium,
  Compass,
  Sparkles,
  Stethoscope,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface BrandBadge {
  name: string;
  category: string;
  location: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

const BRANDS: BrandBadge[] = [
  {
    name: 'Royal Living Interiors',
    category: 'Home & Modular Kitchens',
    location: 'Bengaluru',
    icon: Home,
    tag: '₹4.5L+ Deals',
  },
  {
    name: 'Care Dental & Implants',
    category: 'Specialized Healthcare',
    location: 'Hyderabad',
    icon: Stethoscope,
    tag: 'Instant X-Ray Booking',
  },
  {
    name: 'MindSpire NEET & JEE Academy',
    category: 'Coaching & Entrance Prep',
    location: 'Kota & Delhi-NCR',
    icon: GraduationCap,
    tag: 'Auto Batch Guides',
  },
  {
    name: 'Green Meadows Villa Plots',
    category: 'Real Estate & Land',
    location: 'Chennai',
    icon: Building2,
    tag: 'RERA Layout Dispatches',
  },
  {
    name: 'Apex Aesthetic & Hair Clinic',
    category: 'Cosmetic & Derma Care',
    location: 'Mumbai',
    icon: HeartPulse,
    tag: 'Doctor Slot Engine',
  },
  {
    name: 'UrbanNest Modular Studio',
    category: 'Home Renovation & Decor',
    location: 'Pune',
    icon: Compass,
    tag: '3BHK Cost Estimator',
  },
  {
    name: 'GreenSun Solar Solutions',
    category: 'Solar & Rooftop EPC',
    location: 'Ahmedabad',
    icon: SunMedium,
    tag: 'Govt Subsidy Automation',
  },
  {
    name: 'PrimeStone Estates & Commercial',
    category: 'Real Estate Agency',
    location: 'Gurugram',
    icon: Sparkles,
    tag: 'Cab Site Visit Flow',
  },
];

export function TrustedMarquee() {
  // Duplicate list to achieve continuous seamless loop
  const marqueeList = [...BRANDS, ...BRANDS];

  return (
    <section className="py-8 sm:py-10 border-y border-slate-800/80 bg-slate-950/70 backdrop-blur-md overflow-hidden relative">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 via-transparent to-blue-950/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-4 sm:mb-5">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Trusted by Indian Small Businesses & Service Owners</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Verified WhatsApp Engine</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>5-Sec Speed to Lead</span>
            </span>
          </div>
        </div>
      </div>

      {/* Marquee Track with Fade Masks */}
      <div className="relative w-full overflow-hidden marquee-mask">
        <div className="animate-marquee flex items-center py-2 space-x-4 sm:space-x-6">
          {marqueeList.map((brand, index) => {
            const Icon = brand.icon;
            return (
              <div
                key={`${brand.name}-${index}`}
                className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-800/50 transition-all duration-200 cursor-default select-none shrink-0"
              >
                {/* Logo Icon in Grayscale with subtle glow on hover */}
                <div className="h-8 w-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/40 transition-colors">
                  <Icon className="w-4 h-4 shrink-0" />
                </div>

                {/* Brand Details */}
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-semibold text-slate-300 group-hover:text-white transition-colors whitespace-nowrap">
                      {brand.name}
                    </span>
                    {brand.tag && (
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/50 hidden md:inline-block whitespace-nowrap">
                        {brand.tag}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 whitespace-nowrap">
                    <span>{brand.category}</span>
                    <span>•</span>
                    <span className="text-slate-400 font-normal">{brand.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const LogoMark: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => {
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 rounded-xl bg-slate-950 border border-slate-700/60 shadow-[0_0_20px_rgba(37,99,235,0.25)] overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient background glow inside the icon box */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-indigo-600/10 to-transparent pointer-events-none" />
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400/20 blur-sm rounded-full pointer-events-none" />

      {/* Bespoke Geometric Vector Mark: Interlocking L + M Speed Chevron */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1.5"
      >
        <defs>
          <linearGradient id="lm-primary-grad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="lm-accent-grad" x1="18" y1="10" x2="42" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <linearGradient id="lm-inner-shade" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.4" />
          </linearGradient>

          <filter id="lm-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#2563EB" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer dynamic angled hex track */}
        <path
          d="M 12 10 L 24 4 L 38 11 L 38 25 L 26 31 L 12 24 Z"
          fill="url(#lm-inner-shade)"
          opacity="0.25"
        />

        {/* Base 'L' - Architectural Left Pillar & Foundation */}
        <path
          d="M 10 12 C 10 10.895 10.895 10 12 10 L 17 10 C 18.105 10 19 10.895 19 12 L 19 28 L 27 28 C 28.105 28 29 28.895 29 30 L 29 34 C 29 35.105 28.105 36 27 36 L 12 36 C 10.895 36 10 35.105 10 34 Z"
          fill="url(#lm-primary-grad)"
          filter="url(#lm-glow)"
        />

        {/* Forward Speed Chevron / 'M' Apex & Velocity Arrow */}
        <path
          d="M 21 13 C 21 11.8 22.3 11.1 23.3 11.8 L 37.2 21.6 C 38.3 22.4 38.3 24.0 37.2 24.8 L 23.3 34.6 C 22.3 35.3 21 34.6 21 33.4 L 21 28.5 L 29.5 23.2 L 21 17.9 Z"
          fill="url(#lm-accent-grad)"
        />

        {/* Precision Speed Accent Core */}
        <circle cx="33" cy="23.2" r="2.2" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true, className = '' }) => {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;
  const titleSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg sm:text-xl';

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      <LogoMark size={iconSize} />
      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5 leading-none">
          <span className={`font-black ${titleSize} tracking-tight text-white font-display`}>
            Lead<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300">Maxx</span>
          </span>
          <span className="px-1.5 py-0.5 rounded-md text-xs sm:text-[10px] font-extrabold uppercase tracking-wider bg-blue-950/80 border border-blue-500/30 text-cyan-300 shadow-sm leading-none">
            .ai
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase leading-none mt-1 block">
            Instant WhatsApp Replies for Small Businesses
          </span>
        )}
      </div>
    </div>
  );
};

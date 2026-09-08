import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  CheckCheck, 
  FileText, 
  PhoneCall, 
  Smartphone, 
  RotateCcw, 
  CheckCircle2, 
  Database,
  ArrowRight,
  User,
  Phone,
  Clock
} from 'lucide-react';

export interface NicheTemplate {
  id: string;
  name: string;
  category: string;
  customerPrompt: string;
  brochureName: string;
  priceList: string;
  consultation: string;
  dealValue: string;
}

export const TEMPLATES: NicheTemplate[] = [
  {
    id: 'interior_design',
    name: 'Royal Living Interiors',
    category: 'Interiors',
    customerPrompt: 'Looking for 3BHK interior woodwork & modular kitchen estimate in Bangalore.',
    brochureName: 'Royal_Interior_Catalog_2026.pdf',
    priceList: '3BHK Modular Design Packages (₹4.5L - ₹7.5L)',
    consultation: 'VIP Interior Designer 3D Consultation Slot',
    dealValue: '₹4,50,000 avg deal',
  },
  {
    id: 'dental_clinic',
    name: 'Care Dental & Aesthetic Clinic',
    category: 'Healthcare',
    customerPrompt: 'Painless dental implant consultation slots this Saturday.',
    brochureName: 'Dental_Implant_Care_Guide.pdf',
    priceList: 'German Titanium Implants (₹28,000 - ₹45,000)',
    consultation: 'Doctor Consultation & Digital 3D OPG X-Ray',
    dealValue: '₹80,000 / treatment',
  },
  {
    id: 'solar_contractor',
    name: 'GreenSun Rooftop Solar',
    category: 'Solar',
    customerPrompt: '3kW rooftop solar quotation for home with PM Surya Ghar subsidy details.',
    brochureName: 'Rooftop_Solar_Pricing_Guide.pdf',
    priceList: '3kW & 5kW Monocrystalline Packages (from ₹1.45L)',
    consultation: 'Free Rooftop Shadow Analysis & Subsidy Filing',
    dealValue: '₹2,20,000 / install',
  },
  {
    id: 'coaching_academy',
    name: 'Apex NEET & JEE Academy',
    category: 'Coaching',
    customerPrompt: 'Fee details and batch timings for Class 11 & 12 NEET coaching.',
    brochureName: 'Apex_NEET_Fee_Structure_2026.pdf',
    priceList: 'NEET 2-Year Classroom Batch (₹65,000/year)',
    consultation: 'Free Scholarship Assessment & Demo Class Slot',
    dealValue: '₹65,000 / student',
  },
  {
    id: 'real_estate',
    name: 'Green Meadows Villa Plots',
    category: 'Real Estate',
    customerPrompt: 'Master layout map and price per sq.ft for DTCP approved gated plots.',
    brochureName: 'GreenMeadows_MasterPlan_2026.pdf',
    priceList: 'Villa Plots Price Sheet (₹1,450/sq.ft)',
    consultation: 'Free AC Cab Site Visit Booking',
    dealValue: '₹2,50,000 commission',
  },
];

type RequestedAsset = 'Price List' | 'PDF Catalog' | 'Consultation';

const getDeliveryStatusText = (_asset: RequestedAsset): string => {
  return '✓ Inquiry details delivered. Reply here to speak with us directly.';
};

interface WhatsAppSimulatorProps {
  onBookCall?: () => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({ onBookCall }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<NicheTemplate>(TEMPLATES[0]);
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98840 XXXXX');
  const [requestedAsset, setRequestedAsset] = useState<RequestedAsset>('Price List');
  
  // simulationState: 'idle' | 'submitting' | 'bot_typing' | 'delivered'
  const [simulationState, setSimulationState] = useState<'idle' | 'submitting' | 'bot_typing' | 'delivered'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const resetSimulation = (template?: NicheTemplate) => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setSimulationState('idle');
    setToastMessage(null);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  const handleRunSimulation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    setSimulationState('submitting');

    // Auto-scroll on mobile when test enquiry starts
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }

    // Realistic 500ms transition state: Show button in brief loading/delivering state, then render incoming WhatsApp card
    const t = setTimeout(() => {
      setSimulationState('delivered');
    }, 500);

    timeoutsRef.current = [t];
  };

  const handleTestReply = (e?: React.FormEvent | React.MouseEvent | React.TouchEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    handleRunSimulation(e as React.FormEvent);
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  const industries = [
    { id: 'Interiors', label: 'Interiors' },
    { id: 'Healthcare', label: 'Healthcare' },
    { id: 'Solar', label: 'Solar' },
    { id: 'Coaching', label: 'Coaching' },
    { id: 'Real Estate', label: 'Real Estate' },
  ];

  const activeIndustry = selectedTemplate.category;
  const setActiveIndustry = (industryCategory: string) => {
    const template = TEMPLATES.find((t) => t.category === industryCategory);
    if (template) {
      resetSimulation(template);
    }
  };

  const handleOtherServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBookCall) {
      onBookCall();
    } else {
      const target = document.getElementById('audit-form-section') || document.getElementById('auditForm');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="w-full bg-slate-950/80 border border-slate-700/60 hover:border-slate-600/80 transition-colors rounded-2xl p-3 sm:p-6 shadow-2xl relative space-y-2 sm:space-y-3">
      {/* Top Niche Selection Bar & Other Services Link */}
      <div className="w-full space-y-1 sm:space-y-1.5">
        {/* Mobile View (<640px): Custom Native Select Dropdown */}
        <div className="sm:hidden w-full">
          <label htmlFor="industry-select" className="sr-only">Select Industry</label>
          <div className="relative">
            <select
              id="industry-select"
              value={activeIndustry}
              onChange={(e) => setActiveIndustry(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 text-white text-xs font-semibold rounded-xl py-1.5 px-3 pr-8 appearance-none focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="Interiors">Interiors & Kitchens</option>
              <option value="Healthcare">Healthcare & Clinics</option>
              <option value="Solar">Rooftop Solar</option>
              <option value="Coaching">Coaching & Institutes</option>
              <option value="Real Estate">Real Estate & Builders</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Desktop/Tablet View (>=640px): 5-Tab Segmented Row */}
        <div className="hidden sm:flex w-full items-center justify-between gap-1 p-1 bg-slate-900/60 rounded-xl border border-slate-800/80">
          {industries.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setActiveIndustry(ind.id)}
              className={`flex-1 text-center text-xs py-1.5 px-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeIndustry === ind.id
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {ind.label}
            </button>
          ))}
        </div>

        {/* Subtle centered hyperlink for other services */}
        <div className="text-center pt-0.5 pb-0.5 sm:pb-1">
          <a
            id="other-services-beta-link"
            href="#audit-form-section"
            onClick={handleOtherServicesClick}
            className="text-[11px] sm:text-xs text-slate-400 hover:text-blue-400 underline transition-colors text-center w-full block cursor-pointer"
          >
            Apply for beta access for other services →
          </a>
        </div>
      </div>

      {/* Dual Column Layout: Left = Customer Form | Right = Instant WhatsApp Result */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 min-h-0 md:min-h-[380px] md:h-[370px]">
        
        {/* Left Card: Customer Action on Your Website */}
        <div className="flex flex-col justify-between h-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-3.5 text-left relative z-20">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 sm:pb-2 mb-1.5 sm:mb-2 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-6 w-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20 shrink-0">
                  1
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                  Customer fills site form
                </h4>
              </div>
              <span className="text-xs sm:text-[10px] text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-900 border border-slate-800 shrink-0 whitespace-nowrap">
                Website Form
              </span>
            </div>

            {/* Simulated Form Fields */}
            <form onSubmit={(e) => { e.preventDefault(); handleTestReply(); }} className="space-y-2">
              {/* Name field */}
              <div>
                <label className="block text-[11px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-medium"
                    placeholder="Rahul Sharma"
                  />
                </div>
              </div>

              {/* WhatsApp field */}
              <div>
                <label className="block text-[11px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono text-emerald-400 font-semibold"
                    placeholder="+91 98840 XXXXX"
                  />
                </div>
              </div>

              {/* Selector Chips: Send me your */}
              <div>
                <label className="block text-[11px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                  Send me your:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Price List', 'PDF Catalog', 'Consultation'] as RequestedAsset[]).map((asset) => (
                    <button
                      key={asset}
                      type="button"
                      onClick={() => setRequestedAsset(asset)}
                      className={`py-1 px-1 rounded-lg text-xs sm:text-[11px] font-semibold transition-all text-center border cursor-pointer truncate ${
                        requestedAsset === asset
                          ? 'bg-blue-600/30 border-blue-500 text-blue-300 shadow-sm'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {asset === 'Consultation' ? 'Consult' : asset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-1 sm:pt-1.5">
                <button
                  type="button"
                  id="simulator-test-reply-btn"
                  disabled={simulationState === 'submitting'}
                  onClick={handleTestReply}
                  onTouchEnd={(e) => { e.preventDefault(); handleTestReply(); }}
                  className={`relative z-30 w-full py-2.5 sm:py-3.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all duration-200 hover:brightness-110 shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 cursor-pointer select-none touch-manipulation ${
                    simulationState === 'submitting' ? 'opacity-90 cursor-wait' : ''
                  }`}
                >
                  {simulationState === 'submitting' ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0"></span>
                      <span>Delivering Instant Reply...</span>
                    </span>
                  ) : (
                    <span>Test Instant Reply →</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-2 pt-1 text-[11px] sm:text-[11px] text-slate-400 flex items-center justify-between">
            <span className="truncate">⚡ Direct to official WhatsApp</span>
            <button
              type="button"
              onClick={() => resetSimulation()}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0 ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Right Card: Instant Result (< 2s WhatsApp Delivery & Owner Phone Alert) */}
        <div ref={resultsRef} className="flex flex-col justify-between h-full bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 overflow-hidden text-left relative scroll-mt-20">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2 gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20 shrink-0">
                2
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 min-w-0 truncate">
                <span>Instant Result</span>
                {simulationState === 'delivered' && (
                  <span className="text-xs sm:text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-[#25D366]" /> 1.4s
                  </span>
                )}
              </h4>
            </div>
            <span className="text-xs sm:text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 shrink-0 whitespace-nowrap">
              WhatsApp
            </span>
          </div>

          {/* Body Canvas */}
          {simulationState === 'idle' && (
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center py-6 px-3 bg-slate-900/40 rounded-xl border border-dashed border-slate-800 space-y-2">
                <div className="h-10 w-10 mx-auto rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-slate-400 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300">
                    Awaiting inquiry submission...
                  </div>
                  <p className="text-xs sm:text-[11px] leading-snug text-slate-500 max-w-xs mx-auto mt-0.5">
                    Tap &quot;Test Instant Reply&quot; to see the WhatsApp message delivery and owner phone alert in real time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {simulationState === 'submitting' && (
            <div className="flex-1 flex flex-col justify-center text-center py-8 space-y-2 animate-fade-in">
              <div className="h-8 w-8 mx-auto rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
              <div className="text-xs font-semibold text-emerald-400">Delivering to customer WhatsApp...</div>
            </div>
          )}

          {simulationState === 'bot_typing' && (
            <div className="flex-1 flex flex-col justify-center items-center animate-fade-in">
              <div className="bg-[#202c33] text-slate-300 p-3 rounded-2xl rounded-tl-none shadow-md flex items-center space-x-2 w-fit mx-auto mb-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"></span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs sm:text-[11px] text-emerald-400 font-medium ml-1">
                  Delivering {requestedAsset} to customer WhatsApp...
                </span>
              </div>
            </div>
          )}

          {simulationState === 'delivered' && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar gap-2 transition-all duration-300 ease-out transform translate-y-0 opacity-100 animate-fade-in">
              {/* Mock WhatsApp Message Card */}
              <div className="bg-[#202c33]/90 backdrop-blur-sm border border-emerald-500/20 rounded-2xl rounded-tl-none p-2.5 text-slate-100 shadow-md space-y-1.5 text-xs leading-tight">
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-1 text-xs sm:text-[10px] gap-2">
                  <span className="font-bold text-emerald-300 flex items-center gap-1 min-w-0 truncate">
                    <span className="truncate">{selectedTemplate.name}</span>
                    <span className="text-[9px] text-slate-400 font-normal shrink-0 hidden xs:inline">WhatsApp</span>
                  </span>
                  <span className="text-slate-400 flex items-center gap-0.5 shrink-0">
                    <Clock className="w-2.5 h-2.5" /> Just now
                  </span>
                </div>

                <p className="text-xs leading-tight text-slate-200">
                  Hello <strong className="text-white">{customerName || 'Rahul'}</strong>! 🙏 Thank you for contacting {selectedTemplate.name}.
                </p>

                {/* PDF Attachment Pill */}
                <div className="bg-[#111b21] border border-slate-700 rounded-xl py-1.5 px-2 text-xs sm:text-[11px] flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
                    <FileText className="w-3 h-3" />
                  </div>
                  <div className="truncate flex-1 min-w-0">
                    <div className="font-semibold text-white text-xs sm:text-[11px] truncate leading-tight">
                      {requestedAsset === 'Price List' && selectedTemplate.priceList}
                      {requestedAsset === 'PDF Catalog' && selectedTemplate.brochureName}
                      {requestedAsset === 'Consultation' && selectedTemplate.consultation}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-[9px] text-slate-400 pt-0.5 gap-2">
                  <span className="text-emerald-400 font-semibold leading-tight">
                    {getDeliveryStatusText(requestedAsset)}
                  </span>
                  <span className="flex items-center gap-0.5 text-[#25D366] shrink-0 font-medium">
                    <CheckCheck className="w-3.5 h-3.5 text-[#25D366]" /> Read
                  </span>
                </div>
              </div>

              {/* Owner Alert Card */}
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 mt-auto space-y-1.5 shadow-md text-xs">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Smartphone className="w-3.5 h-3.5" />
                    🚨 Instant Owner Alert
                  </span>
                  <span className="text-xs sm:text-[10px] text-blue-300 font-mono">1-Tap Ready</span>
                </div>

                <div className="text-xs sm:text-[11px] text-slate-300 flex items-center justify-between bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 gap-2">
                  <div className="min-w-0 truncate">
                    <strong className="text-white">{customerName}</strong>
                    <span className="text-slate-400 ml-1.5 font-mono text-xs sm:text-[11px]">{customerPhone}</span>
                  </div>
                  <span className="text-emerald-400 text-xs sm:text-[10px] font-bold uppercase tracking-wider shrink-0">
                    {requestedAsset}
                  </span>
                </div>

                {/* Action buttons ("Call Customer", "Chat on WA"): h-7 py-1 px-2 text-[11px] */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => showToast(`📞 Calling ${customerName} (${customerPhone})...`)}
                    className="h-7 py-1 px-2 text-xs sm:text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 whitespace-nowrap min-w-0"
                  >
                    <PhoneCall className="w-3 h-3 shrink-0" />
                    <span className="truncate">Call Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast(`💬 Opening WhatsApp chat with ${customerName}...`)}
                    className="h-7 py-1 px-2 text-xs sm:text-[11px] bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 whitespace-nowrap min-w-0"
                  >
                    <Send className="w-3 h-3 shrink-0" />
                    <span className="truncate">Chat on WA</span>
                  </button>
                </div>

                {toastMessage && (
                  <div className="p-1 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-center text-xs sm:text-[10px] font-bold animate-fade-in">
                    {toastMessage}
                  </div>
                )}

                <div className="text-xs sm:text-[9px] text-slate-400 flex items-center justify-between pt-0.5 border-t border-slate-800">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Database className="w-2.5 h-2.5 text-blue-400" />
                    Auto-saved to Google Sheets
                  </span>
                  <span className="text-emerald-400 font-semibold">Response: 1.4s</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

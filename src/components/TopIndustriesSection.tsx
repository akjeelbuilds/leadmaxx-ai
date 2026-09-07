import React, { useState } from 'react';
import { 
  Building, 
  GraduationCap, 
  Stethoscope, 
  Home, 
  SunMedium, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Smartphone, 
  FileText,
  DollarSign
} from 'lucide-react';

interface IndustryData {
  id: string;
  name: string;
  shortName: string;
  icon: React.ElementType;
  avgDeal: string;
  dealNumber: number;
  painPoint: string;
  whatsappBrochure: string;
  beforeDelay: string;
  afterResult: string;
  sampleMessage: string;
  roiMultiplier: string;
}

export const TOP_5_INDUSTRIES: IndustryData[] = [
  {
    id: 'interiors',
    name: 'Interior Designers & Modular Kitchens',
    shortName: '1. Interior Designers & Modular Kitchens',
    icon: Home,
    avgDeal: '₹3,50,000 - ₹12,00,000',
    dealNumber: 450000,
    painPoint: 'Prospects request quotes from 3 designers simultaneously on Instagram and Google. If you email a quote 6 hours later, they have already booked a site visit with a competitor who replied on WhatsApp.',
    whatsappBrochure: '2026_Modular_Kitchen_&_3BHK_Pricing_Guide.pdf',
    beforeDelay: '4.5 Hours (Lost to competitor)',
    afterResult: '5 Seconds (Catalog sent + Owner alerted)',
    sampleMessage: 'Hello! Thank you for inquiring with Royal Living Interiors. Attached is our 2026 3BHK portfolio and budget estimator (₹4.5L - ₹8.5L). Our lead designer will call you in 5 minutes!',
    roiMultiplier: '3.8x More Site Visits',
  },
  {
    id: 'healthcare',
    name: 'Clinics & Aesthetic Doctors',
    shortName: '2. Clinics & Aesthetic Doctors',
    icon: Stethoscope,
    avgDeal: '₹35,000 - ₹2,50,000 / treatment',
    dealNumber: 80000,
    painPoint: 'Patients inquiring about dental implants, hair transplants, or skin treatments are seeking immediate reassurance. A 2-hour delay causes them to call and book another clinic nearby.',
    whatsappBrochure: 'Treatment_Care_&_Pricing_Booklet.pdf',
    beforeDelay: '3 Hours (Patient calls rival clinic)',
    afterResult: '4 Seconds (Treatment FAQs + Doctor slot)',
    sampleMessage: 'Hello! Thank you for consulting Care Dental & Aesthetic Clinic. Here is our treatment guide & digital smile scan overview. Doctor consultation slots are open for this Saturday.',
    roiMultiplier: '70% Reduction in No-Shows',
  },
  {
    id: 'solar',
    name: 'Rooftop Solar Installers',
    shortName: '3. Rooftop Solar Installers',
    icon: SunMedium,
    avgDeal: '₹1,80,000 - ₹6,00,000 / install',
    dealNumber: 220000,
    painPoint: 'Homeowners want to know their PM Surya Ghar government subsidy calculation and electricity bill savings immediately. Delayed estimates result in lost rooftop install bookings.',
    whatsappBrochure: 'PM_Surya_Ghar_Subsidy_&_3kW_Savings_Chart.pdf',
    beforeDelay: '8 Hours (Homeowner forgets)',
    afterResult: '5 Seconds (Subsidy calculator + Quote PDF)',
    sampleMessage: 'Hello! Thanks for reaching out to GreenSun Solar. For a 3kW system, government subsidy is ₹78,000, saving you ~₹3,200/month on electricity. See attached quotation breakdown.',
    roiMultiplier: '3.4x More Closed Deals',
  },
  {
    id: 'coaching',
    name: 'Coaching & Study Abroad Institutes',
    shortName: '4. Coaching & Study Abroad Institutes',
    icon: GraduationCap,
    avgDeal: '₹45,000 - ₹1,80,000 / student',
    dealNumber: 65000,
    painPoint: 'Parents researching tuition or entrance batches compare fee structures late in the evening or on weekends. Traditional website forms sit unread until the next working day, losing admissions.',
    whatsappBrochure: 'NEET_JEE_2026_Batch_Timings_&_Fee_Breakup.pdf',
    beforeDelay: '14 Hours (Lead goes cold)',
    afterResult: '3 Seconds (Fee chart + Demo class link)',
    sampleMessage: 'Namaste! Here is the complete batch schedule, faculty credentials, and fee breakup for Apex Academy. Click here to reserve your free demo class slot.',
    roiMultiplier: '4.2x Faster Enrollments',
  },
  {
    id: 'realestate',
    name: 'Real Estate & Builders',
    shortName: '5. Real Estate & Builders',
    icon: Building,
    avgDeal: '₹1,50,000 - ₹8,00,000 commission',
    dealNumber: 250000,
    painPoint: 'Buyers clicking on property ads want floor plans, layout approvals, and price sheets instantly on WhatsApp. Long contact forms cause 85% drop-offs on mobile.',
    whatsappBrochure: 'Gated_Community_Plots_Layout_&_Pricing.pdf',
    beforeDelay: '6 Hours (Buyer forgot which ad they clicked)',
    afterResult: '5 Seconds (Master plan PDF + Location pin)',
    sampleMessage: 'Hello! Here is the DTCP/RERA approved layout map, price chart per sq.ft, and video walk-through for Green Meadows Villa Plots. Would you like a cab arranged for a site visit?',
    roiMultiplier: '5x Site Visit Bookings',
  },
];

interface TopIndustriesSectionProps {
  onScrollToForm: () => void;
}

export const TopIndustriesSection: React.FC<TopIndustriesSectionProps> = ({ onScrollToForm }) => {
  const [activeTab, setActiveTab] = useState<string>('interiors');
  const activeIndustry = TOP_5_INDUSTRIES.find((i) => i.id === activeTab) || TOP_5_INDUSTRIES[0];

  return (
    <section className="py-16 sm:py-24 border-t border-slate-800/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Tailored for India's Top 5 Service Sectors</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
            Built for Indian Businesses Where the <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Fastest WhatsApp Reply Closes the Deal
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
            Customers inquire with 3 competitors on Google and Instagram at the same time. The first to reply gets the site visit or consultation.
          </p>
        </div>

        {/* Industry Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 custom-scrollbar mb-8">
          {TOP_5_INDUSTRIES.map((ind) => {
            const Icon = ind.icon;
            const isActive = ind.id === activeTab;
            return (
              <button
                key={ind.id}
                onClick={() => setActiveTab(ind.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{ind.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Active Industry Deep-Dive Card */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <div className="text-[11px] sm:text-xs font-bold text-blue-400 uppercase tracking-wider">Industry Breakdown</div>
              <h3 className="text-lg sm:text-2xl font-bold text-white font-display mt-0.5">
                {activeIndustry.name}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
              <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-left">
                <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Deal Value</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 font-display truncate">
                  {activeIndustry.avgDeal}
                </div>
              </div>
              <div className="bg-blue-950/40 border border-blue-800/40 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-left">
                <div className="text-[9px] sm:text-[10px] text-blue-300 uppercase font-semibold">Impact</div>
                <div className="text-xs sm:text-sm font-bold text-blue-200 truncate">
                  {activeIndustry.roiMultiplier}
                </div>
              </div>
            </div>
          </div>

          {/* Pain point vs Instant WhatsApp Fix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* The Leak */}
            <div className="bg-red-950/20 border border-red-800/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-red-400" />
                <span>The Usual Fatal Leak</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeIndustry.painPoint}
              </p>
              <div className="pt-2 border-t border-red-900/40 text-[11px] text-red-300 font-medium">
                ⏱️ Traditional response lag: <strong className="text-white">{activeIndustry.beforeDelay}</strong>
              </div>
            </div>

            {/* The 5-Second Fix */}
            <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>The 5-Second WhatsApp Engine</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Prospect immediately receives your customized price brochure and catalog on their WhatsApp. Your phone alerts you with a 1-tap call button before they leave your site.
              </p>
              <div className="pt-2 border-t border-emerald-900/40 text-[11px] text-emerald-300 font-medium">
                ⚡ Instant WhatsApp speed: <strong className="text-white">{activeIndustry.afterResult}</strong>
              </div>
            </div>
          </div>

          {/* Sample Automated WhatsApp Output */}
          <div className="bg-slate-950/90 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                Sample Automated Customer WhatsApp Dispatch
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Delivered in &lt; 5s
              </span>
            </div>

            <div className="bg-[#0b141a] p-4 rounded-xl border border-emerald-900/30 text-xs text-slate-200 space-y-2.5 max-w-xl">
              <p className="leading-relaxed">{activeIndustry.sampleMessage}</p>
              <div className="flex items-center space-x-2.5 bg-[#1f2c34] p-2.5 rounded-lg border border-slate-700/50">
                <FileText className="w-6 h-6 text-red-400 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-white text-[11px] truncate">
                    {activeIndustry.whatsappBrochure}
                  </div>
                  <div className="text-[9px] text-slate-400">PDF Document • 2.1 MB</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              Want this exact 5-second automation flow deployed for your {activeIndustry.shortName} business?
            </p>
            <button
              id="industry-book-cta"
              onClick={onScrollToForm}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer group leading-none whitespace-nowrap"
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

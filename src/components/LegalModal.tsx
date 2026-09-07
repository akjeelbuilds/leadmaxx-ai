import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Mail, 
  ExternalLink,
  ChevronRight,
  Printer
} from 'lucide-react';
import { Logo } from './Logo';

export type LegalDocType = 'privacy' | 'terms' | 'refund' | 'disclaimer';

interface LegalModalProps {
  isOpen: boolean;
  activeDoc: LegalDocType;
  onClose: () => void;
  onSelectDoc: (doc: LegalDocType) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  activeDoc,
  onClose,
  onSelectDoc,
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const DOCS = [
    { id: 'privacy' as LegalDocType, title: 'Privacy Policy', icon: Lock },
    { id: 'terms' as LegalDocType, title: 'Terms & Conditions', icon: FileText },
    { id: 'refund' as LegalDocType, title: 'Refund Policy', icon: RotateCcw },
    { id: 'disclaimer' as LegalDocType, title: 'Disclaimer', icon: AlertCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-slate-700/50 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Brand & Close Button */}
        <div className="bg-slate-950/90 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <Logo size="sm" showSubtitle={false} />
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              Legal & Compliance Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs hidden sm:flex items-center gap-1.5 transition-all cursor-pointer"
              title="Print Policy"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Policy Tab Nav */}
        <div className="flex items-center space-x-2 px-6 py-3 bg-slate-950/40 border-b border-slate-800 overflow-x-auto custom-scrollbar shrink-0">
          {DOCS.map((doc) => {
            const Icon = doc.icon;
            const isActive = activeDoc === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{doc.title}</span>
              </button>
            );
          })}
        </div>

        {/* Policy Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar text-xs sm:text-sm text-slate-300 space-y-6 leading-relaxed flex-1">
          
          {/* PRIVACY POLICY */}
          {activeDoc === 'privacy' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-4">
                <div className="text-[11px] font-mono uppercase text-blue-400 font-bold tracking-wider">
                  LeadMaxx.ai Legal Document
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                  Privacy Policy
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Last Updated: August 31, 2026 • Compliant with Information Technology Act, 2000 & Digital Personal Data Protection (DPDP) Act.
                </p>
              </div>

              <div className="space-y-4">
                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">1. Introduction & Scope</h2>
                  <p>
                    Welcome to <strong>LeadMaxx.ai</strong> (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We respect your privacy and are committed to protecting personal and business data collected via our website, interactive simulations, and client onboarding workflows.
                  </p>
                  <p>
                    This Privacy Policy outlines what information we collect, how it is processed, and your rights regarding the storage, processing, and protection of your data.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">2. Information We Collect</h2>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                    <li>
                      <strong className="text-white">Business & Contact Information:</strong> Name, business name, WhatsApp mobile number, email address, city, and website URL submitted when booking a setup call or inquiring about services.
                    </li>
                    <li>
                      <strong className="text-white">Payment & Billing Details:</strong> Transaction IDs, payment timestamps, and amount paid. Note that sensitive card/UPI credentials are encrypted and processed directly via PCI-DSS compliant gateways (e.g. Razorpay). We do not store raw card numbers.
                    </li>
                    <li>
                      <strong className="text-white">WhatsApp & Automation Data:</strong> Message templates, PDF brochure files, and automation triggers configured during client deployment.
                    </li>
                    <li>
                      <strong className="text-white">Technical & Usage Data:</strong> IP address, device type, browser metadata, and engagement events for system diagnostics and fraud prevention.
                    </li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">3. How We Use Your Data</h2>
                  <p>We process collected information solely for legitimate business purposes:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li>To schedule, confirm, and conduct your 20-minute WhatsApp Lead Engine Setup Strategy Call.</li>
                    <li>To configure, test, and deploy automated WhatsApp auto-responders and Google Sheets sync webhooks.</li>
                    <li>To send critical operational alerts, booking receipts, and invoice confirmations.</li>
                    <li>To improve system reliability, server response times, and prevent malicious activities.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">4. Zero-Spam Commitment & Data Sharing</h2>
                  <p>
                    <strong className="text-emerald-400">We do NOT sell, rent, or trade your contact details</strong> to third-party telemarketers, lead brokers, or advertising networks. We only share necessary parameters with trusted infrastructure providers (e.g., Razorpay for payment processing, Google Workspace for calendar booking, and Meta WhatsApp Business API cloud endpoints) strictly required to execute services.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">5. Data Retention & Security</h2>
                  <p>
                    We implement 256-bit SSL encryption, strict role-based access control, and periodic vulnerability scanning to safeguard your information. Client configurations and webhook records are retained only for the duration of the engagement or as required by Indian financial regulations.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">6. Your Rights & Grievance Contact</h2>
                  <p>
                    You may request access to, correction of, or permanent deletion of your stored contact data at any time by emailing our Data Grievance Officer at <strong className="text-blue-400 font-mono">support@leadmaxx.ai</strong>.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TERMS & CONDITIONS */}
          {activeDoc === 'terms' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-4">
                <div className="text-[11px] font-mono uppercase text-blue-400 font-bold tracking-wider">
                  LeadMaxx.ai Legal Document
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                  Terms & Conditions
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Last Updated: August 31, 2026 • Governing use of LeadMaxx.ai services and advisory consultations.
                </p>
              </div>

              <div className="space-y-4">
                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">1. Agreement to Terms</h2>
                  <p>
                    By accessing <strong>LeadMaxx.ai</strong> or purchasing our ₹399 Strategy Setup & Review Call, you agree to be bound by these Terms and Conditions and all applicable local, state, and national laws in India.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">2. Service Description</h2>
                  <p>
                    LeadMaxx.ai provides marketing automation advisory, speed-to-lead architecture consulting, custom WhatsApp Business auto-reply blueprints, and zero-cost serverless webhook integrations. The ₹399 consultation covers:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li>A 1-on-1 20-minute live screen-share strategy call with a lead automation engineer.</li>
                    <li>Live audit of your current inquiry response time, form friction, and competitor response speeds.</li>
                    <li>Custom 5-second WhatsApp auto-responder message template & PDF brochure workflow blueprint.</li>
                    <li>A full 100% fee credit (₹399) applied toward custom turnkey implementation if you choose full deployment.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">3. WhatsApp & Meta Platform Compliance</h2>
                  <p>
                    Users agree to utilize WhatsApp automation strictly in compliance with Meta's WhatsApp Business Messaging Policy. Automation must only be triggered for inbound customer inquiries where the prospect has explicitly requested pricing, brochures, or site visits. Unsolicited bulk spam messages or scraped contact broadcasts are strictly prohibited.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">4. Intellectual Property</h2>
                  <p>
                    All proprietary templates, code snippets, visual designs, simulators, and brand marks on LeadMaxx.ai are protected under copyright and trademark laws. Clients receive a perpetual, non-exclusive license to use the custom automation blueprints deployed for their specific business.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">5. Limitation of Liability</h2>
                  <p>
                    While our 5-second automation workflows consistently improve contact rates and lead qualification, business conversion rates ultimately depend on the client's sales closing ability, pricing competitiveness, and service quality. LeadMaxx.ai shall not be liable for indirect or consequential business losses.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">6. Jurisdiction & Dispute Resolution</h2>
                  <p>
                    These terms are governed by the laws of India. Any disputes arising out of these services shall be subject to the exclusive jurisdiction of the competent courts in Chennai / Bangalore, India.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* REFUND POLICY */}
          {activeDoc === 'refund' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-4">
                <div className="text-[11px] font-mono uppercase text-emerald-400 font-bold tracking-wider">
                  LeadMaxx.ai Guarantee & Policies
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                  100% Money-Back & Refund Policy
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Last Updated: August 31, 2026 • 100% Risk-Free Guarantee for all strategy sessions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200 leading-relaxed">
                  <strong className="text-white">Our No-Questions-Asked Guarantee:</strong> If after our 20-minute strategy call you feel the session did not provide at least 10x value (₹4,000+ worth of actionable speed-to-lead insights), simply tell us before the call ends and we will refund your ₹399 immediately.
                </div>
              </div>

              <div className="space-y-4">
                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">1. Eligibility for Refunds</h2>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                    <li>
                      <strong className="text-white">Strategy Session Dissatisfaction:</strong> If the 20-minute setup call does not deliver clear, actionable automation blueprints for your service business, you are entitled to a 100% refund.
                    </li>
                    <li>
                      <strong className="text-white">Rescheduling & Cancellations:</strong> You can reschedule or cancel your booked slot up to 2 hours before the scheduled time with no penalty and a full refund.
                    </li>
                    <li>
                      <strong className="text-white">Technical Incompatibilities:</strong> If our engineering team determines your business model or website framework cannot support automated WhatsApp dispatch, your fee will be refunded promptly.
                    </li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">2. Refund Processing Time</h2>
                  <p>
                    Refunds are processed through our primary payment gateway (Razorpay) to your original payment method (UPI, Net Banking, Credit/Debit Card). Depending on your bank, funds typically reflect in your account within <strong className="text-white">3 to 5 business days</strong>.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">3. 100% Credit Toward Implementation</h2>
                  <p>
                    If you choose to hire our team to fully deploy and host the 5-second WhatsApp automation engine, the ₹399 consultation fee is credited 100% toward your implementation invoice.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">4. How to Request a Refund</h2>
                  <p>
                    To claim a refund, simply email <strong className="text-blue-400 font-mono">support@leadmaxx.ai</strong> with your payment ID or transaction screenshot. Our support team will process it within 24 hours.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* DISCLAIMER */}
          {activeDoc === 'disclaimer' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-4">
                <div className="text-[11px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                  LeadMaxx.ai Legal Document
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                  Disclaimer & Trademark Notice
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Last Updated: August 31, 2026 • Independent technology service provider declaration.
                </p>
              </div>

              <div className="space-y-4">
                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">1. Trademark & Non-Affiliation Notice</h2>
                  <p>
                    <strong>WhatsApp®</strong> and the WhatsApp logo are registered trademarks of <strong>Meta Platforms, Inc.</strong> LeadMaxx.ai is an independent software development, consulting, and marketing automation service. We are not officially endorsed by, sponsored by, or affiliated with Meta Platforms, Inc. or WhatsApp LLC.
                  </p>
                  <p>
                    All references to WhatsApp, Google, Razorpay, or other third-party services are purely for descriptive purposes to illustrate compatibility with standard APIs and webhooks.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">2. Business Results & Earnings Disclaimer</h2>
                  <p>
                    Case studies, testimonials, and ROI calculator metrics displayed on LeadMaxx.ai reflect actual results achieved by specific client businesses (e.g. interior designers, coaching academies, dental clinics, real estate agents) in India.
                  </p>
                  <p>
                    However, individual business results may vary depending on factors such as ad budget, lead quality, customer demand, pricing competitiveness, and speed of follow-up by the business owner. We do not guarantee a specific rupee amount in revenue.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">3. Interactive Simulation Representation</h2>
                  <p>
                    The interactive phone simulators on this website are illustrative demonstrations designed to preview typical speed-to-lead response latencies and WhatsApp catalog delivery mechanics. Actual client delivery speeds vary between 1 to 5 seconds depending on network conditions and Meta Cloud API latencies.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">4. Contact Information</h2>
                  <p>
                    For questions regarding these disclaimers or legal policies, please contact us at:
                  </p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 font-mono text-xs text-slate-300">
                    <div>LeadMaxx.ai Support & Legal Desk</div>
                    <div>Email: <a href="mailto:support@leadmaxx.ai" className="text-blue-400 hover:underline">support@leadmaxx.ai</a></div>
                    <div>Operating Headquarters: Chennai & Bangalore, India</div>
                  </div>
                </section>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure 256-bit SSL Encrypted • 100% Money-Back Guarantee</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

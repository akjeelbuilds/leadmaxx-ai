import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What happens after I apply for Private Beta access?',
      a: 'Once verified, we review your current inquiry workflow, configure your custom landing page, connect your official WhatsApp pipeline, and set up your instant price card and owner alerts. You get a turnkey lead engine configured with zero monthly tool subscriptions.',
    },
    {
      q: 'What is the cost to join the Private Beta?',
      a: 'The pilot cohort is 100% free with zero platform setup fees. Selected businesses receive hands-on architecture and 1-on-1 deployment support with zero recurring software subscriptions.',
    },
    {
      q: 'How does the ₹0 monthly software bill actually work with WhatsApp?',
      a: "Third-party tools charge you ₹2,000 to ₹3,000/month just for a dashboard. We bypass these middlemen completely by connecting your engine directly to Meta's official WhatsApp API. Customer replies are 100% free, and automated catalog dispatches cost pure utility rates (~12 paise/lead) paid directly to Meta. No monthly tool rent, no platform markups.",
    },
    {
      q: 'What support is included after launch?',
      a: 'Every deployment includes Premium 90-Day Support covering catalog updates, Meta API monitoring, and priority technical assistance.',
    },
    {
      q: 'Can I keep my existing website, domain, and WhatsApp phone number?',
      a: 'Yes, absolutely! You do not need to replace your existing domain or business phone number. We can connect the fast 5-second WhatsApp reply system into your existing WordPress, Wix, Shopify, or custom landing page, or deploy a fresh, ultra-fast serverless lead engine.',
    },
    {
      q: 'Do I need to leave a computer on or keep WhatsApp Web open 24/7?',
      a: 'Not at all. The entire automation runs 24/7 on Google Cloud serverless infrastructure. When an interested buyer inquires at 11 PM or over the weekend, the system instantly delivers your pricing guide to their WhatsApp and alerts your mobile phone, even while you sleep.',
    },
    {
      q: 'How fast is full implementation if we decide to have you build it?',
      a: 'Full turnkey implementation takes just 24 to 48 hours. We handle the Meta Business API verification, PDF portfolio/pricing guide integration, Google Sheets lead database connection, and custom 1-tap owner alert setup so you can start closing high-ticket leads right away.',
    },
    {
      q: 'How does the automated Google Sheets lead synchronization work?',
      a: 'Every customer name, phone number, selected service, and inquiry timestamp is securely logged in real-time to your private Google Sheet spreadsheet. You have 100% data ownership with zero export limits or proprietary CRM lock-in.',
    },
    {
      q: 'What happens if our business receives more than 1,000 inquiries in a month?',
      a: "Customer-initiated chats and replies inside the 24-hour service window are free. For outbound catalog deliveries beyond high volumes, Meta bills at pure direct utility rates (~12 to 14 paise per message) straight to your account. There are zero platform markups, zero overage penalties, and zero monthly software fees.",
    },
  ];

  return (
    <section className="py-14 sm:py-20 border-t border-slate-800/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <span>GOT QUESTIONS?</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-2">
            Everything you need to know about setting up your 5-second WhatsApp response engine with ₹0 monthly software fees.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 text-sm sm:text-base font-bold text-slate-200 hover:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm leading-normal sm:text-sm sm:leading-relaxed text-slate-400 border-t border-slate-800/60 animate-fade-in font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-10 p-6 sm:p-7 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <ShieldCheck className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <h3 className="text-base sm:text-lg font-bold text-white font-display">Private Beta Pilot Cohort</h3>
          <p className="text-sm leading-normal sm:text-sm sm:leading-relaxed text-slate-300 max-w-lg mx-auto mt-1">
            We are onboarding a select cohort of 25 verified Indian service businesses to test our zero-cost lead engine with no monthly software rent.
          </p>
          <div className="mt-3.5 inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>100% Free Pilot Access • Zero Software Rent</span>
          </div>
        </div>
      </div>
    </section>
  );
};

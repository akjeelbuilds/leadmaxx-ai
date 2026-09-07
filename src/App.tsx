import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SaaSCostSavingsSection } from './components/SaaSCostSavingsSection';
import { AllInclusiveSection } from './components/AllInclusiveSection';
import { TopIndustriesSection } from './components/TopIndustriesSection';
import { SpeedLossCalculator } from './components/SpeedLossCalculator';
import { AuditOfferFormSection } from './components/AuditOfferFormSection';
import { FAQSection } from './components/FAQSection';
import { PostBookingFlow } from './components/PostBookingFlow';
import { SettingsModal } from './components/SettingsModal';
import { LegalModal, LegalDocType } from './components/LegalModal';
import { Footer } from './components/Footer';
import { AppConfig, AuditBooking } from './types';

const DEFAULT_CONFIG: AppConfig = {
  razorpayKeyId: 'rzp_test_YOUR_KEY_HERE',
  calendlyUrl: 'https://calendly.com/YOUR-ACCOUNT/20min-audit',
  priceInr: 399,
  originalPriceInr: 1999,
  currency: 'INR',
  testMode: true,
};

export default function App() {
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem('leadengine_config');
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Error reading config from localStorage', e);
    }
    return DEFAULT_CONFIG;
  });

  const [activeBooking, setActiveBooking] = useState<AuditBooking | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>('privacy');
  const auditFormRef = useRef<HTMLDivElement | null>(null);

  const handleOpenLegal = (doc: LegalDocType) => {
    setActiveLegalDoc(doc);
    setLegalModalOpen(true);
  };

  const handleSaveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('leadengine_config', JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Error saving config to localStorage', e);
    }
  };

  const handleScrollToForm = () => {
    if (activeBooking) {
      setActiveBooking(null);
    }
    setTimeout(() => {
      if (auditFormRef.current) {
        auditFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handlePaymentSuccess = (booking: AuditBooking) => {
    setActiveBooking(booking);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased gradient-glow selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Navbar */}
      <Navbar
        config={config}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onScrollToForm={handleScrollToForm}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeBooking ? (
          <PostBookingFlow
            booking={activeBooking}
            config={config}
            onReset={() => setActiveBooking(null)}
          />
        ) : (
          <>
            {/* 1. Hero Section (with Live WhatsApp Simulator) */}
            <HeroSection onScrollToAudit={handleScrollToForm} />

            {/* 2. SaaS Cost Comparison Section ("Stop Paying SaaS Tax") */}
            <SaaSCostSavingsSection onScrollToForm={handleScrollToForm} />

            {/* 3. Everything Included Deliverables Section ("Everything We Build & Set Up For You") */}
            <AllInclusiveSection onScrollToForm={handleScrollToForm} />

            {/* 4. Industry Demos Section ("Built To Help Local Service Offices") */}
            <TopIndustriesSection onScrollToForm={handleScrollToForm} />

            {/* 5. Speed-to-lead ROI Loss Calculator ("How Many Sales Are You Losing?") */}
            <SpeedLossCalculator onScrollToForm={handleScrollToForm} />

            {/* 6. Claim Private Beta Access & Implementation Onboarding */}
            <AuditOfferFormSection
              config={config}
              onPaymentSuccess={handlePaymentSuccess}
              sectionRef={auditFormRef}
            />

            {/* 7. FAQ Section */}
            <FAQSection />
          </>
        )}
      </main>

      {/* 8. Footer */}
      <Footer 
        onScrollToForm={handleScrollToForm} 
        onOpenLegal={handleOpenLegal}
      />

      {/* Legal & Compliance Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        activeDoc={activeLegalDoc}
        onClose={() => setLegalModalOpen(false)}
        onSelectDoc={(doc) => setActiveLegalDoc(doc)}
      />

      {/* Settings Modal */}
      <SettingsModal
        config={config}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveConfig}
      />
    </div>
  );
}

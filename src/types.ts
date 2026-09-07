export interface LeadFormData {
  name: string;
  phone: string;
  businessName: string;
  city: string;
  websiteUrl?: string;
  monthlyLeads?: string;
}

export type PaymentMethod = 'razorpay' | 'upi_test' | 'card_test';

export interface AuditBooking {
  id: string;
  name: string;
  phone: string;
  businessName: string;
  city: string;
  paymentId: string;
  amount: number;
  date: string;
  scheduledTime?: string;
  status: 'paid' | 'scheduled';
}

export interface AppConfig {
  razorpayKeyId: string;
  calendlyUrl: string;
  priceInr: number;
  originalPriceInr: number;
  currency: string;
  testMode: boolean;
}

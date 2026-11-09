// =========================================================================
// Subscription Tiers & Quota Management
// =========================================================================

export type SubscriptionTier = 'free' | 'pro' | 'business';

export interface PlanConfig {
  id: SubscriptionTier;
  name: string;
  priceMonthly: number;
  stripePriceId: string;
  maxCompanies: number;
  features: string[];
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free / Basis',
    priceMonthly: 0,
    stripePriceId: '',
    maxCompanies: 3,
    features: [
      'Bis zu 3 Unternehmen überwachen',
      'Täglicher Registerstatus-Abgleich',
      'Grundlegende Insolvenzprüfung',
      'E-Mail-Benachrichtigung bei Verfahren',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro Sentinel',
    priceMonthly: 29,
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO || 'price_pro_monthly',
    maxCompanies: 25,
    features: [
      'Bis zu 25 Unternehmen gleichzeitig überwachen',
      'Täglicher 07:00 Uhr Eil-Scan der Justizportale',
      'Vollständiges 4-Ebenen Due Diligence Dossier',
      'Kapitalmarkt- & Realtime-Kurse (XETRA)',
      'EU-USt-IdNr. VIES-Validierung',
      'Unbegrenzter 1-Klick PDF-Export für Wirtschaftsprüfer',
      'Vorrangige E-Mail-Warnungen',
    ],
  },
  business: {
    id: 'business',
    name: 'Kanzlei & Enterprise',
    priceMonthly: 79,
    stripePriceId: process.env.STRIPE_PRICE_ID_BUSINESS || 'price_business_monthly',
    maxCompanies: 100,
    features: [
      'Bis zu 100 Unternehmen überwachen',
      'CSV-Massenimport von Kundenlisten',
      'Mehrbenutzer-Zugang (bis zu 5 Mitarbeiter)',
      'Audit-Log Export nach Art. 30 DSGVO',
      'Dedizierter deutschsprachiger Support',
    ],
  },
};

/**
 * Validates whether user is allowed to add another company
 */
export function canAddCompany(currentCount: number, tier: SubscriptionTier = 'free'): {
  allowed: boolean;
  limit: number;
  remaining: number;
} {
  const plan = SUBSCRIPTION_PLANS[tier] || SUBSCRIPTION_PLANS.free;
  const allowed = currentCount < plan.maxCompanies;
  return {
    allowed,
    limit: plan.maxCompanies,
    remaining: Math.max(0, plan.maxCompanies - currentCount),
  };
}

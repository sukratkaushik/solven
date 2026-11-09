'use client';

import { useState } from 'react';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '@/lib/subscription';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: SubscriptionTier;
  userEmail?: string;
  userId?: string;
}

export default function PricingModal({
  isOpen,
  onClose,
  currentTier = 'free',
  userEmail,
  userId,
}: PricingModalProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubscribe = async (plan: 'pro' | 'business') => {
    setIsLoading(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userEmail, userId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Fehler beim Starten des Bezahlvorgangs');
      }
    } catch (err) {
      console.error(err);
      alert('Verbindungsfehler zu Stripe');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            Enterprise Schutz & Frühwarnung
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Wählen Sie Ihren passenden Überwachungstarif
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
            Schützen Sie Ihre offenen Forderungen vor unerwarteten Insolvenzen. Monatlich kündbar, alle Preise zzgl. 19% MwSt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pro Plan */}
          <div className="bg-slate-50 rounded-xl p-6 border-2 border-blue-600 relative flex flex-col justify-between shadow-xs">
            <div className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs">
              Empfehlung
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900">{SUBSCRIPTION_PLANS.pro.name}</h3>
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-900">€ 29</span>
                  <span className="text-xs text-slate-500 font-medium"> / Monat</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-4 font-medium">
                Ideal für Geschäftsführer, Berater, Agenturen & B2B-Lieferanten.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                {SUBSCRIPTION_PLANS.pro.features.map((feat, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('pro')}
              disabled={isLoading === 'pro' || currentTier === 'pro'}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading === 'pro' ? (
                <span>Wird geladen...</span>
              ) : currentTier === 'pro' ? (
                <span>✓ Aktiver Tarif</span>
              ) : (
                <span>Jetzt Pro aktivieren (14 Tage testen) →</span>
              )}
            </button>
          </div>

          {/* Business / Kanzlei Plan */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 relative flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900">{SUBSCRIPTION_PLANS.business.name}</h3>
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-900">€ 79</span>
                  <span className="text-xs text-slate-500 font-medium"> / Monat</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-4 font-medium">
                Für Kanzleien, Steuerberater, Großhändler & Teams.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                {SUBSCRIPTION_PLANS.business.features.map((feat, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-4 h-4 text-blue-600 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('business')}
              disabled={isLoading === 'business' || currentTier === 'business'}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading === 'business' ? (
                <span>Wird geladen...</span>
              ) : currentTier === 'business' ? (
                <span>✓ Aktiver Tarif</span>
              ) : (
                <span>Kanzlei-Tarif wählen →</span>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>🔒 Sichere Zahlungsabwicklung via Stripe (SEPA-Lastschrift & Kreditkarte)</span>
          <span>🇩🇪 Rechnungsstellung mit ausgewiesener deutscher MwSt. (19%)</span>
        </div>
      </div>
    </div>
  );
}

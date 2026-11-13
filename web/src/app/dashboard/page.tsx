'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SearchModal from '@/components/SearchModal';
import CompanyDossierModal from '@/components/CompanyDossierModal';
import PricingModal from '@/components/PricingModal';
import { useLanguage } from '@/lib/i18n';
import { getCountryByCode } from '@/lib/countries';

interface WatchlistItem {
  id: string;
  company_name: string;
  company_city: string | null;
  legal_form: string | null;
  company_id: string | null;
  status: string | null;
  country_code?: string | null;
  register_authority?: string | null;
  vat_number?: string | null;
  currency?: string | null;
}

const DEFAULT_DEMO_WATCHLIST: WatchlistItem[] = [
  {
    id: 'demo-1',
    company_name: 'SAP SE',
    company_city: 'Walldorf',
    legal_form: 'Europäische Gesellschaft (SE)',
    company_id: 'HRB 719915',
    status: 'Aktiv',
    country_code: 'DE',
    register_authority: 'Amtsgericht Mannheim',
    currency: 'EUR',
    vat_number: 'DE143454363',
  },
  {
    id: 'demo-2',
    company_name: 'Red Bull GmbH',
    company_city: 'Fuschl am See',
    legal_form: 'GmbH',
    company_id: 'FN 56249 v',
    status: 'Aktiv',
    country_code: 'AT',
    register_authority: 'Landesgericht Salzburg',
    currency: 'EUR',
    vat_number: 'ATU33864707',
  },
  {
    id: 'demo-3',
    company_name: 'Nestlé S.A.',
    company_city: 'Vevey',
    legal_form: 'Société Anonyme (S.A.)',
    company_id: 'CHE-105.843.834',
    status: 'Aktiv',
    country_code: 'CH',
    register_authority: 'Registre du Commerce Vaud',
    currency: 'CHF',
    vat_number: 'CHE-105.843.834 MWST',
  },
  {
    id: 'demo-4',
    company_name: 'ASML Holding N.V.',
    company_city: 'Veldhoven',
    legal_form: 'Naamloze Vennootschap (N.V.)',
    company_id: 'KVK 17085892',
    status: 'Aktiv',
    country_code: 'NL',
    register_authority: 'Kamer van Koophandel Oost-Brabant',
    currency: 'EUR',
    vat_number: 'NL803738548B01',
  },
];

export default function DashboardPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<WatchlistItem | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  const fetchWatchlist = useCallback(async () => {
    try {
      const isDemo =
        typeof window !== 'undefined' &&
        (sessionStorage.getItem('demo_mode') === 'true' ||
          window.location.search.includes('demo=true'));

      const authRes = await fetch('/api/auth/me');
      const authData = authRes.ok ? await authRes.json() : { user: null };

      if (isDemo || !authData?.user) {
        if (isDemo) {
          sessionStorage.setItem('demo_mode', 'true');
          const stored = sessionStorage.getItem('demo_watchlist');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              setWatchlist(parsed);
              setIsLoading(false);
              return;
            } catch {
              // fallback to defaults
            }
          }
          setWatchlist(DEFAULT_DEMO_WATCHLIST);
          sessionStorage.setItem('demo_watchlist', JSON.stringify(DEFAULT_DEMO_WATCHLIST));
          setIsLoading(false);
          return;
        }

        router.push('/login');
        return;
      }

      const res = await fetch('/api/watchlist');
      if (!res.ok) {
        console.error('Error fetching watchlist:', await res.text());
      } else {
        const data = await res.json();
        setWatchlist(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleDelete = async (id: string) => {
    if (!confirm(t('dash.remove_confirm'))) return;

    const isDemo =
      id.startsWith('demo-') ||
      (typeof window !== 'undefined' &&
        (sessionStorage.getItem('demo_mode') === 'true' ||
          window.location.search.includes('demo=true')));

    if (isDemo) {
      setWatchlist((prev) => {
        const next = prev.filter((item) => item.id !== id);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('demo_watchlist', JSON.stringify(next));
        }
        return next;
      });
      if (selectedCompany?.id === id) {
        setSelectedCompany(null);
      }
      return;
    }

    try {
      const res = await fetch(`/api/watchlist?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setWatchlist((prev) => prev.filter((item) => item.id !== id));
      if (selectedCompany?.id === id) {
        setSelectedCompany(null);
      }
    } catch (error) {
      console.error('Error deleting item from Cloud SQL:', error);
      // Graceful fallback: remove locally
      setWatchlist((prev) => prev.filter((item) => item.id !== id));
      if (selectedCompany?.id === id) {
        setSelectedCompany(null);
      }
    }
  };

  // Formatted exposure volume calculated from portfolio (default €25,000 per exposure)
  const formattedVolume = useMemo(() => {
    const volume = watchlist.length * 25000;
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(volume);
  }, [watchlist.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">{t('dash.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 print:bg-white print:p-0 print:m-0 print:min-h-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 print:hidden">
        {/* Dashboard Top Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate tracking-tight">
              {t('dash.title')}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {watchlist.length === 1 ? t('dash.subtitle_single', { n: watchlist.length }) : t('dash.subtitle', { n: watchlist.length })}
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-3 md:mt-0 md:ml-4">
            <button
              onClick={() => setIsPricingOpen(true)}
              className="inline-flex items-center px-3.5 py-2 border border-slate-300 rounded-lg shadow-2xs text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              Tarif: Pro aktivieren
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D4ED8] transition-colors"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              {t('dash.add_btn')}
            </button>
          </div>
        </div>

        {/* Feature 1: Executive Portfolio Health Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {/* Card 1: Monitored Companies */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200/90 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('dash.health.monitored_title')}
              </span>
              <div className="p-2.5 bg-blue-50 text-[#1D4ED8] rounded-xl">
                <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {watchlist.length}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block mr-1.5"></span>
                {t('dash.health.monitored_sub')}
              </p>
            </div>
          </div>

          {/* Card 2: Portfolio Status */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200/90 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('dash.health.status_title')}
              </span>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-2 shrink-0"></span>
                {t('dash.health.status_val')}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {t('dash.health.status_sub')}
              </p>
            </div>
          </div>

          {/* Card 3: Last Registry Sync */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200/90 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('dash.health.sync_title')}
              </span>
              <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t('dash.health.sync_val')}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block mr-1.5"></span>
                {t('dash.health.sync_sub')}
              </p>
            </div>
          </div>

          {/* Card 4: Monitored Invoice Volume */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200/90 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('dash.health.volume_title')}
              </span>
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {formattedVolume}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {t('dash.health.volume_sub')}
              </p>
            </div>
          </div>
        </div>

        {/* Watchlist Section */}
        {watchlist.length === 0 ? (
          <div className="bg-white shadow-sm border border-slate-200 overflow-hidden rounded-xl text-center py-12 px-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('dash.empty_title')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('dash.empty_desc')}</p>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#1D4ED8] hover:bg-blue-800"
              >
                {t('dash.add')}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {watchlist.map((item) => {
              const country = getCountryByCode(item.country_code || 'DE');
              return (
                <div
                  key={item.id}
                  className="bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl p-6 flex flex-col justify-between border-t-4 border-[#1D4ED8] border-x border-b border-slate-200/80"
                >
                  <div>
                    {/* Country & Jurisdiction Pill */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{country.flag}</span>
                        <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                          {country.nameDe}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200 font-mono font-medium">
                          {country.code}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${item.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                        {item.status === 'active' ? t('dash.active') : item.status || t('dash.unknown')}
                      </span>
                    </div>

                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2" title={item.company_name}>
                        {item.company_name}
                      </h3>
                    </div>

                    <div className="space-y-2.5 text-sm text-gray-600 bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                      {item.company_id && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400 font-medium">{t('dash.reg_no')}</span>
                          <span className="font-mono text-gray-800 font-semibold">{item.company_id}</span>
                        </div>
                      )}
                      {item.legal_form && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400 font-medium">{t('dash.legal_form')}</span>
                          <span className="text-gray-800 font-medium">{item.legal_form}</span>
                        </div>
                      )}
                      {item.company_city && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400 font-medium">{t('dash.city')}</span>
                          <span className="text-gray-800 font-medium">{item.company_city}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/60">
                        <span className="text-gray-400 font-medium">Register:</span>
                        <span className="text-slate-600 text-[11px] font-medium truncate max-w-[170px]" title={item.register_authority || country.registerName}>
                          {item.register_authority || country.registerName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Watchlist Card Action Area */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  {/* Primary Action Button: Open Dossier / View Risk Audit */}
                  <button
                    onClick={() => setSelectedCompany(item)}
                    className="inline-flex items-center px-3.5 py-1.5 border border-[#1D4ED8] text-xs font-semibold rounded-lg text-[#1D4ED8] bg-blue-50/70 hover:bg-[#1D4ED8] hover:text-white transition-all shadow-sm group"
                  >
                    <svg className="mr-1.5 h-4 w-4 text-[#1D4ED8] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t('dash.view_dossier')}
                  </button>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center text-xs font-medium text-gray-400 hover:text-red-600 focus:outline-none transition-colors p-1.5 rounded-lg hover:bg-red-50"
                    title={t('dash.remove')}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      {/* Search Modal */}
      {isModalOpen && (
        <SearchModal 
          onClose={() => setIsModalOpen(false)} 
          onAdded={() => {
            fetchWatchlist();
          }} 
        />
      )}

      {/* Pricing & Billing Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
      />

      {/* Feature 2: Interactive Company Risk Dossier Modal */}
      {selectedCompany && (
        <CompanyDossierModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
}

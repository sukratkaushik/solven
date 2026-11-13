'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/lib/i18n';
import { SUPPORTED_COUNTRIES, CountryConfig, getCountryByCode } from '@/lib/countries';

interface SearchModalProps {
  onClose: () => void;
  onAdded: () => void;
}

interface Company {
  id: string;
  name: string;
  city?: string;
  legal_form?: string;
  country_code?: string;
  register_authority?: string;
  vat_number?: string;
}

interface RawCompanyResult {
  id?: string;
  reg_number?: string;
  company_id?: string;
  name?: string;
  company_name?: string;
  city?: string;
  address?: { city?: string };
  legal_form?: string;
  type?: string;
  country_code?: string;
  register_authority?: string;
  court?: string;
  vat_number?: string;
}

const PRIMARY_COUNTRY_CODES = ['DE', 'AT', 'CH', 'NL', 'FR', 'IT', 'ES', 'PL'];

export default function SearchModal({ onClose, onAdded }: SearchModalProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(getCountryByCode('DE'));
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Company[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const { t, language } = useLanguage();

  const performSearch = useCallback(
    async (q: string, countryCode: string) => {
      setIsSearching(true);
      setError(null);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&country=${encodeURIComponent(countryCode)}`);
        if (!res.ok) {
          throw new Error(t('search.error_search'));
        }
        const data = await res.json();

        let companiesList = [];
        if (Array.isArray(data)) {
          companiesList = data;
        } else if (data && Array.isArray(data.data)) {
          companiesList = data.data;
        } else if (data && Array.isArray(data.results)) {
          companiesList = data.results;
        }

        const mapped: Company[] = companiesList.map((c: RawCompanyResult) => ({
          id: c.id || c.reg_number || c.company_id || 'HRB 000000',
          name: c.name || c.company_name || t('dash.unknown'),
          city: c.city || c.address?.city || '',
          legal_form: c.legal_form || c.type || '',
          country_code: c.country_code || countryCode,
          register_authority: c.register_authority || c.court,
          vat_number: c.vat_number,
        }));

        setResults(mapped);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsSearching(false);
      }
    },
    [t]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query, selectedCountry.code);
      } else {
        setResults([]);
      }
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [query, selectedCountry, performSearch]);

  const handleCountryChange = (country: CountryConfig) => {
    setSelectedCountry(country);
    if (query.trim().length >= 2) {
      performSearch(query, country.code);
    }
  };

  const handleAdd = async (company: Company) => {
    setAddingId(company.id);
    setError(null);
    try {
      const isDemo =
        typeof window !== 'undefined' &&
        (sessionStorage.getItem('demo_mode') === 'true' ||
          window.location.search.includes('demo=true'));

      const authRes = await fetch('/api/auth/me');
      const authData = authRes.ok ? await authRes.json() : { user: null };

      // If user is in demo mode or unauthenticated demo preview
      if (isDemo || !authData?.user) {
        if (isDemo || typeof window !== 'undefined') {
          sessionStorage.setItem('demo_mode', 'true');
          const stored = sessionStorage.getItem('demo_watchlist');
          let currentList = [];
          if (stored) {
            try {
              currentList = JSON.parse(stored);
            } catch {
              currentList = [];
            }
          }
          if (currentList.length >= 25) {
            setError('Demo-Limit erreicht (maximal 25 Unternehmen in der Demo).');
            return;
          }
          const newDemoItem = {
            id: `demo-${Date.now()}`,
            company_name: company.name,
            company_id: company.id,
            company_city: company.city || '',
            legal_form: company.legal_form || '',
            status: 'Aktiv',
            country_code: company.country_code || selectedCountry.code,
            register_authority: company.register_authority || selectedCountry.registerName,
            currency: selectedCountry.currency,
            vat_number: company.vat_number,
          };
          const updated = [newDemoItem, ...currentList];
          sessionStorage.setItem('demo_watchlist', JSON.stringify(updated));
          onAdded();
          onClose();
          return;
        }

        throw new Error(t('search.error_auth'));
      }

      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: company.name,
          company_id: company.id,
          company_city: company.city,
          legal_form: company.legal_form,
          country_code: company.country_code || selectedCountry.code,
          register_authority: company.register_authority || selectedCountry.registerName,
          currency: selectedCountry.currency,
          vat_number: company.vat_number,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Fehler beim Hinzufügen.');
        return;
      }

      onAdded();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setAddingId(null);
    }
  };

  const countryDisplayName = language === 'de' ? selectedCountry.nameDe : selectedCountry.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>🏛️</span> {t('search.title')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direktzugriff auf EU-Unternehmensregister &amp; Europäische Insolvenzbekanntmachungen (IRI)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* STEP 1: Mandatory Country Selector */}
        <div className="px-6 py-3.5 bg-slate-100/70 border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
              {t('search.select_country')}
            </label>
            <span className="text-[11px] text-slate-500 font-medium">
              Aktuell: <span className="font-semibold text-slate-800">{selectedCountry.flag} {countryDisplayName}</span>
            </span>
          </div>

          {/* Quick-Pick Country Chips */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {SUPPORTED_COUNTRIES.filter((c) => PRIMARY_COUNTRY_CODES.includes(c.code)).map((country) => {
              const isSelected = selectedCountry.code === country.code;
              return (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountryChange(country)}
                  className={`px-2.5 py-1 text-xs rounded-md flex items-center gap-1.5 transition border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-700 font-semibold shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  <span className="text-sm">{country.flag}</span>
                  <span>{country.code}</span>
                </button>
              );
            })}
          </div>

          {/* Extended Country Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Weitere EU-Staaten:</span>
            <select
              value={selectedCountry.code}
              onChange={(e) => handleCountryChange(getCountryByCode(e.target.value))}
              className="text-xs bg-white border border-slate-300 text-slate-800 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600 flex-1"
            >
              {SUPPORTED_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {language === 'de' ? c.nameDe : c.name} ({c.code}) - {c.registerName}
                </option>
              ))}
            </select>
          </div>

          {/* Active Jurisdiction Specs */}
          <div className="mt-2 text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              <strong>Register:</strong> {selectedCountry.registerName}
            </span>
            <span>•</span>
            <span>
              <strong>Währung:</strong> {selectedCountry.currency}
            </span>
            <span>•</span>
            <span>
              <strong>USt-Präfix:</strong> {selectedCountry.vatPrefix}
            </span>
          </div>
        </div>

        {/* STEP 2: Company Search Input */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">2</span>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Unternehmen in {selectedCountry.flag} {countryDisplayName} suchen
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
              placeholder={`Firma in ${countryDisplayName} suchen (z.B. ${selectedCountry.sampleCompany})...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <div className="absolute left-3 top-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Results / List */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          {isSearching ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mb-2"></div>
              <p className="text-xs text-slate-500">{t('search.loading')}</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-xs">
              <strong>Hinweis:</strong> {error}
            </div>
          ) : results.length > 0 ? (
            <ul className="space-y-2.5">
              {results.map((c) => (
                <li
                  key={c.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center shadow-xs hover:border-slate-300 transition"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{selectedCountry.flag}</span>
                      <h3 className="font-semibold text-slate-900 text-sm truncate">{c.name}</h3>
                      {c.legal_form && (
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                          {c.legal_form}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-2">
                      <span className="font-mono text-slate-600 font-medium">{c.id}</span>
                      {c.city && <span>• {c.city}</span>}
                      {c.register_authority && <span className="text-slate-400">• {c.register_authority}</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAdd(c)}
                    disabled={addingId === c.id}
                    className="shrink-0 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 transition shadow-xs"
                  >
                    {addingId === c.id ? t('search.adding') : `+ Überwachen`}
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="text-center py-8">
              <p className="text-sm font-semibold text-slate-700">{t('search.no_results')}</p>
              <p className="text-xs text-slate-500 mt-1">
                Prüfen Sie den Firmennamen oder wählen Sie ein anderes Land aus.
              </p>
            </div>
          ) : (
            <div className="py-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Häufig überwachte Unternehmen in {selectedCountry.flag} {countryDisplayName}:
              </p>
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800">{selectedCountry.sampleCompany}</span>
                  <span className="text-slate-400 ml-2">• {selectedCountry.registerName}</span>
                </div>
                <button
                  onClick={() => {
                    setQuery(selectedCountry.sampleCompany);
                    performSearch(selectedCountry.sampleCompany, selectedCountry.code);
                  }}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Suchen ➔
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white rounded-b-xl flex items-center justify-between text-[11px] text-slate-500">
          <span>Gedeckt durch DSGVO &amp; EU-Transparenzrichtlinie</span>
          <button onClick={onClose} className="px-3 py-1 text-slate-600 hover:text-slate-900 font-medium">
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}

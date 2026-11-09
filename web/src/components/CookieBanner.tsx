'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 print:hidden">
      <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-300 leading-normal">
          <span className="font-bold text-white block mb-1">🔒 Datenschutz & Notwendige Cookies</span>
          Wir verwenden ausschließlich technisch notwendige Cookies zur Gewährleistung der Sitzungssicherheit. Keine Drittanbieter-Tracker oder Werbe-Cookies. Serverstandort: Frankfurt am Main. Weitere Informationen in unserer{' '}
          <Link href="/datenschutz" className="text-blue-400 underline hover:text-blue-300">
            Datenschutzerklärung
          </Link>
          .
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            Verstanden & Schließen
          </button>
        </div>
      </div>
    </div>
  );
}

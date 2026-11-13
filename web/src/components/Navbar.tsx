'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';

interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
}

export default function Navbar() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  const navLinks = language === 'de' ? [
    { name: 'Risiko-Realität', href: '/#risiko-realitaet' },
    { name: 'Funktionen', href: '/#funktionen' },
    { name: 'Live-Prüfung', href: '/#live-demo' },
    { name: 'Schadens-Kalkulator', href: '/#kalkulator' },
    { name: 'Zielgruppen', href: '/#zielgruppen' },
    { name: 'Preise', href: '/#preise' },
    { name: 'FAQ', href: '/#faq' },
  ] : [
    { name: 'Risk Reality', href: '/#risiko-realitaet' },
    { name: 'Features', href: '/#funktionen' },
    { name: 'Live Audit', href: '/#live-demo' },
    { name: 'Loss Calculator', href: '/#kalkulator' },
    { name: 'Solutions', href: '/#zielgruppen' },
    { name: 'Pricing', href: '/#preise' },
    { name: 'FAQ', href: '/#faq' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-200 print:hidden ${
      isScrolled 
        ? 'bg-[#FBFBF9]/95 backdrop-blur-md border-b border-[#E8EAE6] shadow-xs' 
        : 'bg-[#FBFBF9] border-b border-[#E8EAE6]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#0F2922] flex items-center justify-center text-white shadow-xs group-hover:bg-[#153B31] transition-colors">
                <svg className="w-5 h-5 text-[#34D399]" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-bold text-[#14231E] tracking-tight font-serif">
                    Insolvenz-Wächter
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-[#E8F3EE] text-[#14533C] border border-[#C6E2D5]">
                    DACH SENTINEL
                  </span>
                </div>
                <span className="text-[10px] text-[#556960] font-medium tracking-tight -mt-0.5">
                  Commercial Intelligence & Risk Engine
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-[13px] font-medium text-[#41544B]">
            {navLinks.map((item) => (
              <a 
                key={item.href} 
                href={item.href} 
                className="hover:text-[#113E30] transition-colors hover:underline decoration-[#34D399] decoration-2 underline-offset-4"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Controls: Language & Auth CTAs */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
              className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-[#3D4F46] bg-[#ECEFEA] hover:bg-[#E0E5DC] rounded-full border border-[#D5DDD2] transition-colors"
              title={language === 'de' ? 'Switch to English' : 'Auf Deutsch umschalten'}
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981] mr-1.5"></span>
              {language.toUpperCase()}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center text-xs font-semibold text-[#14231E] bg-[#E8F3EE] hover:bg-[#D5EADF] text-[#134E39] px-3.5 py-2 rounded-full border border-[#BDE0D0] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 mr-1.5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-[#556960] hover:text-[#14231E] px-2 py-1 transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex text-xs font-medium text-[#41544B] hover:text-[#113E30] px-3 py-2 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center text-xs font-semibold text-white bg-[#0F2922] hover:bg-[#174337] px-4 py-2 rounded-full shadow-xs hover:shadow transition-all"
                >
                  <span>{language === 'de' ? 'Kostenlos starten' : 'Get Started Free'}</span>
                  <svg className="w-3.5 h-3.5 ml-1 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#556960] hover:text-[#14231E] hover:bg-[#E8EAE6] focus:outline-hidden"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8EAE6] py-3 px-2 space-y-1 bg-[#FBFBF9]">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-[#3D4F46] hover:bg-[#ECEFEA] hover:text-[#113E30]"
              >
                {item.name}
              </a>
            ))}
            {!user && (
              <div className="pt-2 border-t border-[#E8EAE6] flex flex-col space-y-2 px-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-medium text-[#41544B] py-2"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-semibold text-white bg-[#0F2922] py-2.5 rounded-full"
                >
                  {language === 'de' ? 'Kostenlos starten (3 Firmen gratis)' : 'Get Started Free (3 Companies)'}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

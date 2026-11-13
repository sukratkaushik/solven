'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isRecovery, setIsRecovery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const isDe = language === 'de';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const errParam = new URLSearchParams(window.location.search).get('error');
      if (errParam === 'google_not_configured') {
        setError(
          isDe
            ? 'Google Sign-In ist noch nicht konfiguriert (GOOGLE_CLIENT_ID fehlt).'
            : 'Google Sign-In is not configured yet (missing GOOGLE_CLIENT_ID).'
        );
      } else if (errParam) {
        setError(
          isDe
            ? 'Google-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.'
            : 'Google sign-in failed. Please try again.'
        );
      }
    }

    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (data?.user && !isRecovery) {
          router.push('/dashboard');
        }
      })
      .catch(() => {});
  }, [router, isRecovery, isDe]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || (isDe ? 'Anmeldung fehlgeschlagen.' : 'Login failed.'));
      } else {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('demo_mode');
        }
        router.push('/dashboard');
      }
    } catch {
      setError(isDe ? 'Verbindungsfehler. Bitte versuchen Sie es erneut.' : 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecovery(false);
    setMessage(
      isDe
        ? 'Passwort-Reset wird in Kürze über Google Sign-In verwaltet.'
        : 'Password management is transitioning to Google Sign-In.'
    );
  };

  const handleResetPasswordRequest = async () => {
    setError(null);
    setMessage(
      isDe
        ? 'Bitte nutzen Sie den Demo-Zugang oder erstellen Sie ein neues Konto.'
        : 'Please use Demo Access or create a new account.'
    );
  };

  const handleDemoAccess = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('demo_mode', 'true');
    }
    router.push('/dashboard?demo=true');
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center bg-[#FBFBF9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#DCE2D8] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Form (7 cols on desktop) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Logo & Headline */}
            <div className="flex items-center space-x-2.5 mb-6">
              <div className="w-8 h-8 rounded-xl bg-[#0F2922] flex items-center justify-center text-[#34D399]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-base font-bold text-[#0F2922] tracking-tight font-serif">
                Insolvenz-Wächter
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0F2922] tracking-tight mb-2">
              {isRecovery 
                ? (isDe ? 'Neues Passwort vergeben' : 'Set New Password')
                : (isDe ? 'Willkommen zurück' : 'Welcome back')}
            </h1>
            <p className="text-xs sm:text-sm text-[#52665B] mb-8 leading-relaxed">
              {isRecovery
                ? (isDe ? 'Geben Sie ein sicheres Passwort mit mindestens 6 Zeichen ein.' : 'Enter a secure password with at least 6 characters.')
                : (isDe 
                    ? 'Melden Sie sich an, um Ihr Solvenz-Dashboard und Ihre Kunden-Watchlist zu verwalten.' 
                    : 'Sign in to access your solvency dashboard and company watchlist.')}
            </p>

            {message && (
              <div className="mb-6 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs p-3.5 rounded-xl font-medium flex items-center">
                <svg className="w-4 h-4 mr-2 text-[#059669] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs p-3.5 rounded-xl font-medium flex items-center">
                <svg className="w-4 h-4 mr-2 text-[#DC2626] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {isRecovery ? (
              /* Password Reset Form */
              <form className="space-y-4" onSubmit={handleUpdatePassword}>
                <div>
                  <label className="block text-xs font-bold text-[#14231E] uppercase tracking-wider mb-1.5">
                    {isDe ? 'Neues Passwort' : 'New Password'}
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={isDe ? 'Mindestens 6 Zeichen' : 'At least 6 characters'}
                    className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-[#FBFBF9] border border-[#DCE2D8] text-[#14231E] placeholder-[#8EA197] focus:outline-hidden focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-full text-xs font-bold text-white bg-[#0F2922] hover:bg-[#184639] transition-all shadow-xs disabled:opacity-50"
                >
                  {isLoading ? (isDe ? 'Wird gespeichert...' : 'Saving...') : (isDe ? 'Passwort speichern & Weiter' : 'Save Password & Continue')}
                </button>
              </form>
            ) : (
              <>
                <GoogleSignInButton mode="signin" />

                <div className="my-5 flex items-center">
                  <div className="flex-1 border-t border-[#E8EAE6]" />
                  <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#8EA197]">
                    {isDe ? 'oder mit E-Mail' : 'or with email'}
                  </span>
                  <div className="flex-1 border-t border-[#E8EAE6]" />
                </div>

                {/* Standard Login Form */}
                <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <label className="block text-xs font-bold text-[#14231E] uppercase tracking-wider mb-1.5">
                    {isDe ? 'Geschäftliche E-Mail' : 'Business Email'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isDe ? 'name@unternehmen.de' : 'name@company.com'}
                      className="w-full px-4 py-3 pl-10 rounded-xl text-xs sm:text-sm bg-[#FBFBF9] border border-[#DCE2D8] text-[#14231E] placeholder-[#8EA197] focus:outline-hidden focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all"
                    />
                    <svg className="w-4 h-4 text-[#8EA197] absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#14231E] uppercase tracking-wider">
                      {isDe ? 'Passwort' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={handleResetPasswordRequest}
                      className="text-[11px] font-semibold text-[#1B6D4F] hover:text-[#0F2922] transition-colors"
                    >
                      {isDe ? 'Passwort vergessen?' : 'Forgot password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pl-10 pr-10 rounded-xl text-xs sm:text-sm bg-[#FBFBF9] border border-[#DCE2D8] text-[#14231E] placeholder-[#8EA197] focus:outline-hidden focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all"
                    />
                    <svg className="w-4 h-4 text-[#8EA197] absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-[#8EA197] hover:text-[#14231E]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-full text-xs font-bold text-white bg-[#0F2922] hover:bg-[#184639] transition-all shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{isLoading ? (isDe ? 'Wird angemeldet...' : 'Signing in...') : (isDe ? 'Anmelden' : 'Sign in')}</span>
                  <svg className="w-4 h-4 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                {/* Instant Demo Access (Clean Fullscript Pill) */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleDemoAccess}
                    className="w-full py-2.5 px-4 rounded-full text-xs font-semibold text-[#183B30] bg-[#E8F3EE] hover:bg-[#D5EADF] border border-[#BDE0D0] transition-colors flex items-center justify-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                    <span>{isDe ? '⚡ Dashboard direkt im Demo-Modus öffnen' : '⚡ Open Dashboard in Demo Mode'}</span>
                  </button>
                </div>
              </form>
              </>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-[#E8EDE5] text-xs text-center text-[#556960]">
            {isDe ? 'Noch kein Account?' : "Don't have an account yet?"}{' '}
            <Link href="/signup" className="font-bold text-[#0F2922] hover:text-[#184639] underline decoration-[#34D399] decoration-2 underline-offset-4">
              {isDe ? 'Jetzt 3 Firmen kostenlos anlegen →' : 'Register 3 companies free →'}
            </Link>
          </div>
        </div>

        {/* Right Column: Institutional Trust Sidebar (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-[#0F2922] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#1A4537] blur-3xl opacity-40 pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#184639] text-[#34D399] border border-[#276452] mb-6">
              {isDe ? 'Geschützter Amtsgericht-Zugang' : 'Court Sentinel Access'}
            </span>

            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight mb-4">
              {isDe ? 'Früherkennung für offene Forderungen' : 'Early Warning for Trade Receivables'}
            </h2>

            <p className="text-xs text-[#BFD4CB] leading-relaxed mb-8">
              {isDe 
                ? 'Schützen Sie Ihr Unternehmen vor unerwarteten Insolvenzanträgen, abrupten Geschäftsführer-Wechseln und Bilanz-Verzügen Ihrer Debitoren.'
                : 'Protect your business against surprise insolvency petitions, abrupt director turnarounds, and statutory filing delays.'}
            </p>

            <div className="space-y-4 pt-4 border-t border-[#1C473A]">
              <div className="flex items-start space-x-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-[#184639] text-[#34D399] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <div className="font-bold text-white">150+ Amtsgerichte (HRB/HRA)</div>
                  <div className="text-[11px] text-[#8FB7A4]">{isDe ? 'Täglicher Eil-Scan um 07:00 Uhr morgens' : 'Daily 7:00 AM rush court scan'}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-[#184639] text-[#34D399] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <div className="font-bold text-white">100% DSGVO & Server Frankfurt</div>
                  <div className="text-[11px] text-[#8FB7A4]">{isDe ? 'ISO 27001 zertifiziertes deutsches Rechenzentrum' : 'ISO 27001 certified German data center'}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-[#184639] text-[#34D399] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <div className="font-bold text-white">BaFin MaRisk & StaRUG Konform</div>
                  <div className="text-[11px] text-[#8FB7A4]">{isDe ? 'Revisionssichere Due-Diligence-Dossiers' : 'Audit-proof compliance documentation'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-[#1C473A] mt-8 text-[11px] text-[#8FB7A4]">
            {isDe 
              ? 'Probleme beim Anmelden? Kontaktieren Sie support@insolvenz-waechter.de'
              : 'Need help signing in? Contact support@insolvenz-waechter.de'}
          </div>
        </div>

      </div>
    </div>
  );
}

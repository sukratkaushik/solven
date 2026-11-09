'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const isDe = language === 'de';

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError(
        isDe 
          ? 'Das Passwort muss mindestens 6 Zeichen lang sein.' 
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage(
          isDe 
            ? 'Registrierung erfolgreich! Bitte überprüfen Sie Ihren E-Mail-Posteingang, um Ihre Adresse zu bestätigen.'
            : 'Registration successful! Please check your email inbox to verify your account.'
        );
      }
    } catch {
      setError(
        isDe 
          ? 'Fehler bei der Registrierung. Bitte versuchen Sie es später erneut.' 
          : 'Signup error. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center bg-[#FBFBF9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#DCE2D8] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Form */}
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
              {isDe ? 'Kostenloses Konto erstellen' : 'Create Free Account'}
            </h1>
            <p className="text-xs sm:text-sm text-[#52665B] mb-8 leading-relaxed">
              {isDe 
                ? 'Starten Sie mit 3 Unternehmen dauerhaft kostenlos. Keine Kreditkarte erforderlich.' 
                : 'Start monitoring 3 companies free forever. No credit card required.'}
            </p>

            {message && (
              <div className="mb-6 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs p-4 rounded-xl font-medium flex items-start">
                <svg className="w-5 h-5 mr-2.5 text-[#059669] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <label className="block text-xs font-bold text-[#14231E] uppercase tracking-wider mb-1.5">
                  {isDe ? 'Vollständiger Name' : 'Full Name'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isDe ? 'z.B. Dr. Michael Weber' : 'e.g. John Doe'}
                    className="w-full px-4 py-3 pl-10 rounded-xl text-xs sm:text-sm bg-[#FBFBF9] border border-[#DCE2D8] text-[#14231E] placeholder-[#8EA197] focus:outline-hidden focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all"
                  />
                  <svg className="w-4 h-4 text-[#8EA197] absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14231E] uppercase tracking-wider mb-1.5">
                  {isDe ? 'Geschäftliche E-Mail-Adresse' : 'Business Email Address'}
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
                <label className="block text-xs font-bold text-[#14231E] uppercase tracking-wider mb-1.5">
                  {isDe ? 'Passwort wählen' : 'Choose Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isDe ? 'Mindestens 6 Zeichen' : 'At least 6 characters'}
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-full text-xs font-bold text-white bg-[#0F2922] hover:bg-[#184639] transition-all shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{isLoading ? (isDe ? 'Konto wird erstellt...' : 'Creating account...') : (isDe ? 'Kostenlos registrieren' : 'Register for Free')}</span>
                  <svg className="w-4 h-4 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              <div className="text-[11px] text-[#71857A] text-center pt-2">
                {isDe ? (
                  <>Mit der Registrierung akzeptieren Sie unsere <Link href="/agb" className="underline hover:text-[#0F2922]">AGB</Link> und die <Link href="/datenschutz" className="underline hover:text-[#0F2922]">Datenschutzerklärung</Link>.</>
                ) : (
                  <>By signing up, you accept our <Link href="/agb" className="underline hover:text-[#0F2922]">Terms</Link> and <Link href="/datenschutz" className="underline hover:text-[#0F2922]">Privacy Policy</Link>.</>
                )}
              </div>
            </form>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E8EDE5] text-xs text-center text-[#556960]">
            {isDe ? 'Bereits registriert?' : 'Already have an account?'}{' '}
            <Link href="/login" className="font-bold text-[#0F2922] hover:text-[#184639] underline decoration-[#34D399] decoration-2 underline-offset-4">
              {isDe ? 'Hier direkt anmelden →' : 'Sign in here →'}
            </Link>
          </div>
        </div>

        {/* Right Column: Benefits Sidebar */}
        <div className="lg:col-span-5 bg-[#0F2922] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#1A4537] blur-3xl opacity-40 pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#184639] text-[#34D399] border border-[#276452] mb-6">
              {isDe ? 'Basis-Tarif: 100% Kostenlos' : 'Free Tier Included'}
            </span>

            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight mb-4">
              {isDe ? 'Ihr Frühwarnsystem in unter 60 Sekunden' : 'Your Sentinel Ready in Under 60 Seconds'}
            </h2>

            <p className="text-xs text-[#BFD4CB] leading-relaxed mb-8">
              {isDe 
                ? 'Schließen Sie sich hunderten Beratern, Agenturen und Lieferanten an, die offene Forderungen proaktiv schützen.' 
                : 'Join hundreds of freelancers, agencies, and suppliers protecting their accounts receivable proactively.'}
            </p>

            <div className="space-y-4 pt-4 border-t border-[#1C473A]">
              <div className="flex items-start space-x-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-[#184639] text-[#34D399] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <div className="font-bold text-white">{isDe ? '3 Unternehmen gratis überwachen' : 'Monitor 3 companies free'}</div>
                  <div className="text-[11px] text-[#8FB7A4]">{isDe ? 'Dauerhaft ohne Kosten & ohne Kreditkarte' : 'Forever free, no card required'}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-[#184639] text-[#34D399] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <div className="font-bold text-white">{isDe ? 'Täglicher Justizportal-Abgleich' : 'Daily Court Gazette Sync'}</div>
                  <div className="text-[11px] text-[#8FB7A4]">{isDe ? 'Automatische E-Mail bei Insolvenzanträgen' : 'Instant email on insolvency petitions'}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-[#184639] text-[#34D399] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <div className="font-bold text-white">{isDe ? 'Keine automatische Verlängerung' : 'Zero Lock-in'}</div>
                  <div className="text-[11px] text-[#8FB7A4]">{isDe ? 'Jederzeit mit einem Klick kündbar' : 'Upgrade or cancel anytime'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-[#1C473A] mt-8 text-[11px] text-[#8FB7A4]">
            {isDe ? 'Fragen zum Onboarding? support@insolvenz-waechter.de' : 'Questions? support@insolvenz-waechter.de'}
          </div>
        </div>

      </div>
    </div>
  );
}

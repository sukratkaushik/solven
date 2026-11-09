import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CookieBanner from "@/components/CookieBanner";
import { LanguageProvider } from "@/lib/i18n";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Insolvenz-Wächter | B2B Commercial Intelligence & Insolvency Sentinel",
  description: "Automatisches Frühwarnsystem für deutsche Handelsregister- und Gerichtsbekanntmachungen. Schützen Sie Ihre offenen Forderungen vor unerwarteten Insolvenzen.",
  keywords: [
    "Insolvenz Früherkennung",
    "Handelsregister Überwachung",
    "Amtsgericht Bekanntmachungen",
    "B2B Bonitätsprüfung",
    "Gläubigerschutz",
    "StaRUG Frühwarnsystem",
    "BaFin MaRisk",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col justify-between bg-[#FBFBF9] text-[#14231E]`}
      >
        <LanguageProvider>
          <div>
            <Navbar />
            <main>{children}</main>
          </div>
          
          {/* Institutional Fullscript-style Footer */}
          <footer className="bg-[#0D241C] text-white border-t border-[#1C473A] pt-14 pb-12 px-4 print:hidden">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1C473A]">
                
                {/* Brand & Purpose */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#1B4B3D] flex items-center justify-center text-[#34D399]">
                      <svg className="w-5 h-5" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight font-serif">
                      Insolvenz-Wächter
                    </span>
                  </div>
                  <p className="text-xs text-[#A5C4B5] max-w-md leading-relaxed">
                    Die führende Plattform für kontinuierliche Register-Überwachung, Due-Diligence-Audits und 
                    Insolvenz-Früherkennung im DACH-Raum. Entwickelt zur automatischen Absicherung von Forderungen für 
                    Freelancer, Agenturen, Steuerberater und Kreditinstitute.
                  </p>
                  <div className="flex items-center space-x-3 text-[11px] text-[#7EA895]">
                    <span className="inline-flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#34D399] mr-1.5"></span>
                      150+ Amtsgerichte vernetzt
                    </span>
                    <span>•</span>
                    <span>Server: Frankfurt am Main</span>
                    <span>•</span>
                    <span>100% DSGVO-konform</span>
                  </div>
                </div>

                {/* Platform Navigation */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#34D399] mb-4">
                    Plattform & Module
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#D1DDD7]">
                    <li>
                      <a href="/#funktionen" className="hover:text-white transition-colors">
                        Company Profile Engine
                      </a>
                    </li>
                    <li>
                      <a href="/#funktionen" className="hover:text-white transition-colors">
                        Executive Screening & Phoenix-Check
                      </a>
                    </li>
                    <li>
                      <a href="/#live-demo" className="hover:text-white transition-colors">
                        4-Ebenen Due Diligence Dossier
                      </a>
                    </li>
                    <li>
                      <a href="/#kalkulator" className="hover:text-white transition-colors">
                        Interaktiver Schadens-Kalkulator
                      </a>
                    </li>
                    <li>
                      <a href="/#preise" className="hover:text-white transition-colors">
                        Tarife & Enterprise API
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Legal & Compliance */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#34D399] mb-4">
                    Recht & Compliance
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#D1DDD7]">
                    <li>
                      <Link href="/impressum" className="hover:text-white transition-colors">
                        Impressum (§ 5 DDG)
                      </Link>
                    </li>
                    <li>
                      <Link href="/datenschutz" className="hover:text-white transition-colors">
                        Datenschutz (DSGVO)
                      </Link>
                    </li>
                    <li>
                      <Link href="/agb" className="hover:text-white transition-colors">
                        Allgemeine Geschäftsbedingungen
                      </Link>
                    </li>
                    <li>
                      <span className="text-[#7EA895]">
                        BaFin MaRisk § 25a KWG Ready
                      </span>
                    </li>
                    <li>
                      <span className="text-[#7EA895]">
                        StaRUG § 102 Frühwarnstandard
                      </span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Bottom Copyright & Disclaimer */}
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7EA895] gap-4">
                <div>
                  © {new Date().getFullYear()} Insolvenz-Wächter. Alle Rechte vorbehalten. 
                  Geschäftsregister- und Gerichtsdaten des Bundes und der Länder.
                </div>
                <div className="flex items-center space-x-4">
                  <span>Frankfurt am Main, Hessen</span>
                  <span>•</span>
                  <span>SSL 256-Bit Verschlüsselung</span>
                </div>
              </div>
            </div>
          </footer>

          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}

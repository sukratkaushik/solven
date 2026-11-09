'use client';

import { useState, useId } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

interface SampleCompany {
  id: string;
  name: string;
  court: string;
  regNumber: string;
  legalForm: string;
  city: string;
  capital: string;
  directors: string[];
  status: 'active' | 'warning' | 'critical';
  score: number;
  scoreLabel: string;
  equityRatio: string;
  balanceSheetStatus: string;
  vatStatus: string;
  mediaSentiment: {
    score: number;
    headline: string;
    source: string;
    time: string;
    isRisk: boolean;
  };
  courtStatus: string;
  riskReasons: string[];
}

const SAMPLE_COMPANIES: SampleCompany[] = [
  {
    id: 'sample-1',
    name: 'Süd-Werkzeugbau & Präzisionstechnik GmbH',
    court: 'Amtsgericht Stuttgart',
    regNumber: 'HRB 748291',
    legalForm: 'Gesellschaft mit beschränkter Haftung (GmbH)',
    city: 'Stuttgart',
    capital: '€ 1.250.000 (100% eingezahlt)',
    directors: ['Dr. Thomas M. Weber', 'Karin Schneider'],
    status: 'active',
    score: 94,
    scoreLabel: 'Exzellente Bonität • Prime Solvency',
    equityRatio: '41,8% (Solide Eigenkapitalbasis)',
    balanceSheetStatus: 'Fristgerecht im Bundesanzeiger hinterlegt',
    vatStatus: 'USt-IdNr. DE289410928 aktiv & im EU-VIES bestätigt',
    mediaSentiment: {
      score: 92,
      headline: 'Auftragsbestand im Maschinenbau stabilisiert sich im Vorquartal',
      source: 'Handelsblatt',
      time: 'vor 3 Tagen',
      isRisk: false,
    },
    courtStatus: 'Keine negativen Eintragungen in den Justizportalen der 16 Bundesländer',
    riskReasons: [
      'Stabile Geschäftsführung ohne Wechsel seit 48 Monaten',
      'Kontinuierliche Eigenkapitalstärkung im Unternehmensregister',
      'Keine Zwangsvollstreckungs- oder Schutzschirmverfahren anhängig',
    ],
  },
  {
    id: 'sample-2',
    name: 'Apex Logistik & Frachtkontor Nord GmbH',
    court: 'Amtsgericht Hamburg',
    regNumber: 'HRB 189402',
    legalForm: 'GmbH',
    city: 'Hamburg',
    capital: '€ 25.000',
    directors: ['Marc Jansen (neu bestellt vor 4 Monaten)'],
    status: 'warning',
    score: 52,
    scoreLabel: 'Erhöhte Wachsamkeit • Frühwarnsignal',
    equityRatio: '9,4% (Kritische Unterkapitalisierung)',
    balanceSheetStatus: 'Offenlegung für 2024 um 14 Monate überfällig (§ 335 HGB)',
    vatStatus: 'USt-IdNr. DE319884210 gültig',
    mediaSentiment: {
      score: 48,
      headline: 'Frachtgewerbe leidet unter Margendruck und gestiegenen Flottenfinanzierungen',
      source: 'DVZ Deutsche Verkehrszeitung',
      time: 'vor 1 Woche',
      isRisk: true,
    },
    courtStatus: 'Zwei Mahnverfahren im zentralen Vollstreckungsportal vermerkt',
    riskReasons: [
      'Abrupter Geschäftsführerwechsel nach vorheriger Amtsniederlegung',
      'Verzug bei der gesetzlichen Bilanzhinterlegung > 12 Monate',
      'Eigenkapitalquote unter der Risikogrenze von 10%',
    ],
  },
  {
    id: 'sample-3',
    name: 'Kronos Retail & Kaufhausverbund AG',
    court: 'Amtsgericht Köln',
    regNumber: 'HRB 54210',
    legalForm: 'Aktiengesellschaft (AG)',
    city: 'Köln',
    capital: '€ 12.000.000',
    directors: ['Sanierungsvorstand Dr. H. Brandt (Restrukturierung)'],
    status: 'critical',
    score: 19,
    scoreLabel: 'Akutes Ausfallrisiko • Schutzschirmverfahren',
    equityRatio: 'Negativ (- € 3.4M nicht durch EK gedeckter Fehlbetrag)',
    balanceSheetStatus: 'Geschäftsbericht testiert mit Fortführungswarnung (Going Concern)',
    vatStatus: 'USt-IdNr. DE122904812 unter behördlicher Prüfung',
    mediaSentiment: {
      score: 14,
      headline: 'Gläubigerversammlung einberufen: Verhandlungen über Sanierungsplan nach StaRUG',
      source: 'Frankfurter Allgemeine Zeitung (FAZ)',
      time: 'vor 18 Stunden',
      isRisk: true,
    },
    courtStatus: 'Vorläufiges Schutzschirmverfahren nach § 270d InsO registriert',
    riskReasons: [
      'Amtliche Insolvenzbekanntmachung des Amtsgerichts aktiv',
      'Lieferantenkredite sofort stoppen (Forderungsausfallquote > 95% droht)',
      'Gefahr von Insolvenzanfechtung nach § 133 InsO für zurückliegende Zahlungen',
    ],
  },
];

export default function LandingPage() {
  const { language } = useLanguage();
  const isDe = language === 'de';

  // Interactive Live Demo State
  const [selectedCompany, setSelectedCompany] = useState<SampleCompany>(SAMPLE_COMPANIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [demoActiveTab, setDemoActiveTab] = useState<'overview' | 'media' | 'finance' | 'legal'>('overview');

  // Interactive Calculator State
  const [invoiceVolume, setInvoiceVolume] = useState<number>(45000);
  const [customerCount, setCustomerCount] = useState<number>(12);
  const volumeSliderId = useId();
  const customerCountSliderId = useId();

  // Audience Segment Tab
  const [activeSegment, setActiveSegment] = useState<'freelance' | 'agency' | 'advisor' | 'bank'>('freelance');

  // Billing Cycle Toggle (Monthly vs Annual)
  const [isAnnual, setIsAnnual] = useState(true);

  // FAQ Open State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Calculator Math:
  // German statistics: Creditor default losses recover on average 2.8% of unsecured claims.
  // Loss without Insolvenz-Wächter = invoiceVolume * (1 - 0.028) = 97.2% write-off.
  const expectedRecoveryQuota = 0.028;
  const potentialLoss = Math.round(invoiceVolume * (1 - expectedRecoveryQuota));
  const recoveredAmount = Math.round(invoiceVolume * expectedRecoveryQuota);
  const annualCostPro = isAnnual ? 24 * 12 : 29 * 12; // €288 or €348
  const roiMultiplier = Math.round(potentialLoss / (29 * 12));

  return (
    <div className="bg-[#FBFBF9] text-[#14231E] min-h-screen selection:bg-[#BDE0D0] selection:text-[#0D241C]">
      
      {/* 1. TOP STRATEGIC ALERT BAR */}
      <div className="bg-[#0D241C] text-white py-2.5 px-4 text-xs font-medium border-b border-[#1E3E33]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444] text-white tracking-wider uppercase">
              {isDe ? 'Insolvenz-Rekord 2025/2026' : 'Insolvency Peak 2025/2026'}
            </span>
            <span className="text-[#D1DDD7]">
              {isDe 
                ? '23.900+ Unternehmensinsolvenzen in Deutschland (+23% YoY) • €57 Mrd. Gläubigerschaden laut Destatis.'
                : '23,900+ Corporate Insolvencies in Germany (+23% YoY) • €57B Creditor Default Losses.'}
            </span>
          </div>
          <a 
            href="#risiko-realitaet" 
            className="text-[#34D399] hover:text-[#6EE7B7] text-[11px] font-semibold underline underline-offset-4 shrink-0 transition-colors"
          >
            {isDe ? 'Wie gefährdet sind Ihre offenen Rechnungen? →' : 'How exposed are your open invoices? →'}
          </a>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Soft atmospheric gradient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#E2F0E8] to-[#CBE5D7] blur-3xl" />
          <div className="absolute top-[10%] right-[15%] w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-[#EBF5EE] to-[#DCECE2] blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EBF4EF] border border-[#CDE5D8] text-[#134E39] text-xs font-semibold tracking-wide mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>{isDe ? 'Handelsregister & Insolvenz-Frühwarnsystem DACH' : 'DACH Commercial Register & Insolvency Sentinel'}</span>
              <span className="text-[#8FB7A4]">•</span>
              <span className="text-[#2D6A4F]">{isDe ? 'Täglicher 07:00 Uhr Justiz-Scan' : 'Daily 7:00 AM Court Scan'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F2922] font-serif leading-[1.15] mb-6">
              {isDe ? (
                <>
                  B2B-Bonität & Insolvenz-Frühwarnung,{' '}
                  <span className="italic font-normal text-[#1B6D4F] underline decoration-[#A8DAC2] decoration-4 underline-offset-8">
                    bevor Rechnungen platzen.
                  </span>
                </>
              ) : (
                <>
                  B2B Credit Intelligence & Insolvency Early Warning,{' '}
                  <span className="italic font-normal text-[#1B6D4F] underline decoration-[#A8DAC2] decoration-4 underline-offset-8">
                    before invoices bounce.
                  </span>
                </>
              )}
            </h1>

            {/* Comprehensive Explanation of Who We Are & What We Offer */}
            <p className="text-base sm:text-lg text-[#3E5248] leading-relaxed max-w-3xl mx-auto mb-10">
              {isDe ? (
                <>
                  <strong>Insolvenz-Wächter</strong> vernetzt die amtlichen Register aller <strong>150+ deutschen Amtsgerichte</strong>, 
                  des Bundesanzeigers und der amtlichen Insolvenzbekanntmachungen in einer KI-gestützten Überwachungs-Engine. 
                  Erkennen Sie akute Liquiditätskrisen, abrupte Geschäftsführer-Wechsel und Bilanz-Verzüge bei Ihren Geschäftspartnern bis zu 
                  <strong> 90 Tage vor dem amtlichen Verfahren</strong>.
                </>
              ) : (
                <>
                  <strong>Insolvenz-Wächter</strong> connects the official registers of all <strong>150+ German commercial courts</strong>, 
                  the Federal Gazette, and statutory insolvency bulletins into an automated risk intelligence engine. 
                  Detect severe liquidity distress, abrupt director turnarounds, and balance-sheet delays 
                  <strong> up to 90 days before legal bankruptcy hits the court registry</strong>.
                </>
              )}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-bold text-white bg-[#0F2922] hover:bg-[#184639] shadow-md hover:shadow-lg transition-all group"
              >
                <span>{isDe ? 'Kostenlos starten (3 Firmen gratis)' : 'Get Started Free (3 Companies)'}</span>
                <svg className="w-4 h-4 ml-2 text-[#34D399] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <a
                href="#live-demo"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-full text-sm font-semibold text-[#183B30] bg-[#E8F1EC] hover:bg-[#D9EADE] border border-[#BFDFCE] transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981] mr-2"></span>
                <span>{isDe ? 'Interaktive Live-Prüfung testen' : 'Try Live Audit Demo'}</span>
              </a>
            </div>

            {/* Trust Metrics Bar (Fullscript style) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-[#E5E9E2] max-w-4xl mx-auto text-left">
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-[#E3E8DF] shadow-2xs">
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#0F2922]">150+</div>
                <div className="text-xs text-[#52665B] mt-0.5 font-medium">
                  {isDe ? 'Deutsche Amtsgerichte (HRB/HRA)' : 'German Registry Courts'}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-[#E3E8DF] shadow-2xs">
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#0F2922]">07:00 Uhr</div>
                <div className="text-xs text-[#52665B] mt-0.5 font-medium">
                  {isDe ? 'Täglicher Eil-Scan der Justiz' : 'Daily Morning Court Sync'}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-[#E3E8DF] shadow-2xs">
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#0F2922]">90 Tage</div>
                <div className="text-xs text-[#52665B] mt-0.5 font-medium">
                  {isDe ? 'Früherkennungshorizont' : 'Average Early Warning Window'}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-[#E3E8DF] shadow-2xs">
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#0F2922]">100% DSGVO</div>
                <div className="text-xs text-[#52665B] mt-0.5 font-medium">
                  {isDe ? 'Server in Frankfurt am Main' : 'Hosted in Frankfurt, Germany'}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. THE HARD REALITY: WHAT GOES WRONG IF YOU DON'T USE OUR PLATFORM (FAILURE MODES) */}
      <section id="risiko-realitaet" className="py-20 bg-[#F4F6F2] border-y border-[#E2E6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA] mb-3">
              {isDe ? 'Kosten der Untätigkeit • Die Gefahr im Geschäftsalltag' : 'Cost of Inaction • The Business Hazard'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2922] font-serif tracking-tight mb-4">
              {isDe ? 'Was passiert, wenn Sie unsere Plattform nicht nutzen?' : 'What can go wrong if you don’t use our platform?'}
            </h2>
            <p className="text-sm sm:text-base text-[#4A5D53] leading-relaxed">
              {isDe ? (
                <>
                  In einer Phase mit <strong>23.900 Insolvenzen</strong> verlassen sich viele Unternehmen weiterhin auf das Prinzip Hoffnung 
                  oder veraltete Auskünfte. Das sind die fünf verheerenden Risiken für Lieferanten, Agenturen, Berater und Banken:
                </>
              ) : (
                <>
                  In a wave of <strong>23,900+ German insolvencies</strong>, relying on gut feeling or stale credit reports is fatal. 
                  Here are the five severe risks your business faces without automated sentinel monitoring:
                </>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Risk Card 1 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E3E7DE] shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#EF4444] transition-colors">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#EF4444]"></div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center font-bold font-mono text-sm border border-[#FEE2E2]">
                    01
                  </span>
                  <span className="text-[11px] font-bold text-[#DC2626] bg-[#FEF2F2] px-2.5 py-0.5 rounded-full border border-[#FEE2E2]">
                    {isDe ? 'Totalausfall: < 3% Quote' : 'Default: < 3% Recovery'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0F2922] mb-2 font-serif">
                  {isDe ? 'Die 97%-Totalverlust-Falle' : 'The 97% Loss Trap'}
                </h3>
                <p className="text-xs sm:text-sm text-[#4E6157] leading-relaxed">
                  {isDe ? (
                    <>
                      Wenn eine Insolvenz erst beim <em>Amtsgericht</em> im Register steht, ist die Kasse leer. 
                      Laut offizieller BMJ- und Destatis-Statistik erhalten ungesicherte Gläubiger im Durchschnitt lediglich 
                      <strong> 2,1% bis 2,8% ihrer offenen Rechnungen</strong> zurück. 97%+ Ihres Geldes sind unwiederbringlich verloren.
                    </>
                  ) : (
                    <>
                      By the time an insolvency petition is registered at the court, the bank account is drained. 
                      Official German Ministry of Justice data confirms unsecured trade creditors recover an average of only 
                      <strong> 2.1% to 2.8%</strong> of their claims. Over 97% of your money is completely wiped out.
                    </>
                  )}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F0F2ED] text-[11px] font-semibold text-[#B91C1C]">
                {isDe ? 'Ohne Wächter: Sie liefern weiter Ware, während der Kunde bereits überschuldet ist.' : 'Without Sentinel: You keep delivering while the client is already broke.'}
              </div>
            </div>

            {/* Risk Card 2 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E3E7DE] shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#F59E0B] transition-colors">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#F59E0B]"></div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center font-bold font-mono text-sm border border-[#FEF3C7]">
                    02
                  </span>
                  <span className="text-[11px] font-bold text-[#D97706] bg-[#FFFBEB] px-2.5 py-0.5 rounded-full border border-[#FEF3C7]">
                    {isDe ? '60–90 Tage Blindflug' : '60–90 Day Blind Spot'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0F2922] mb-2 font-serif">
                  {isDe ? 'Der 90-Tage-Informationsverzug' : 'The 90-Day Information Delay'}
                </h3>
                <p className="text-xs sm:text-sm text-[#4E6157] leading-relaxed">
                  {isDe ? (
                    <>
                      Klassische Wirtschaftsauskunfteien arbeiten mit trägen Quartalsabgleichen. 
                      Bevor deren Bonitätsampel auf Rot springt, haben die Geschäftsführer bereits 2 Monate lang Gehälter gestundet, 
                      Lieferanten vertröstet und Zahlungen gestoppt. Sie erfahren von der Pleite erst, wenn Überweisungen zurückgewiesen werden.
                    </>
                  ) : (
                    <>
                      Traditional legacy credit bureaus update via quarterly file dumps. 
                      Long before their score reflects trouble, management has postponed payroll, made excuses to suppliers, 
                      and halted payments. You find out months too late when invoices bounce and bank accounts are locked.
                    </>
                  )}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F0F2ED] text-[11px] font-semibold text-[#D97706]">
                {isDe ? 'Ohne Wächter: Kein Frühsignal über vorläufige Verfahren oder Gläubigeranträge.' : 'Without Sentinel: Zero advance notice of preliminary protective filings.'}
              </div>
            </div>

            {/* Risk Card 3 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E3E7DE] shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#DC2626] transition-colors">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#DC2626]"></div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center font-bold font-mono text-sm border border-[#FEE2E2]">
                    03
                  </span>
                  <span className="text-[11px] font-bold text-[#DC2626] bg-[#FEF2F2] px-2.5 py-0.5 rounded-full border border-[#FEE2E2]">
                    § 133 InsO
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0F2922] mb-2 font-serif">
                  {isDe ? 'Insolvenzanfechtungs-Falle' : 'Clawback Contestation Trap'}
                </h3>
                <p className="text-xs sm:text-sm text-[#4E6157] leading-relaxed">
                  {isDe ? (
                    <>
                      Der schlimmste Schock im deutschen Wirtschaftsrecht: Wenn ein Kunde Ihre Rechnung bezahlt hat, 
                      kann der Insolvenzverwalter dieses Geld <strong>noch Jahre später zurückfordern</strong>, 
                      falls er Ihnen nachweisen kann, dass Sie die Krise des Kunden hätten ahnen müssen (z.B. durch wiederholte Mahnungen oder Ratenzahlungsbitten).
                    </>
                  ) : (
                    <>
                      Under German insolvency law (§ 133 InsO), an insolvency administrator can legally claw back payments 
                      you already received months or years ago if they claim you should have known the customer was in distress 
                      (e.g., from payment installment plans or late dunning notices).
                    </>
                  )}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F0F2ED] text-[11px] font-semibold text-[#B91C1C]">
                {isDe ? 'Ohne Wächter: Sie haben keine rechtssichere Audit-Dokumentation zur Enthaftung.' : 'Without Sentinel: You lack certified compliance audit logs for defense.'}
              </div>
            </div>

            {/* Risk Card 4 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E3E7DE] shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#4B5563] transition-colors">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#4B5563]"></div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-[#F3F4F6] text-[#374151] flex items-center justify-center font-bold font-mono text-sm border border-[#E5E7EB]">
                    04
                  </span>
                  <span className="text-[11px] font-bold text-[#374151] bg-[#F3F4F6] px-2.5 py-0.5 rounded-full border border-[#E5E7EB]">
                    {isDe ? 'Betrugsmuster' : 'Fraud Pattern'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0F2922] mb-2 font-serif">
                  {isDe ? 'Die \u201EPhoenix-Gesch\u00E4ftsf\u00FChrer\u201C' : 'Phoenix Director Scams'}
                </h3>
                <p className="text-xs sm:text-sm text-[#4E6157] leading-relaxed">
                  {isDe ? (
                    <>
                      Unredliche Akteure liquidieren überschuldete GmbHs, lassen offene Lieferantenverbindlichkeiten zurück 
                      und gründen wenige Wochen später unter gleicher Büroadresse eine neue Gesellschaft. 
                      Ohne personengenaue Verknüpfung aller deutschen Handelsregister erkennen Sie diesen Serienbankrotteur nicht.
                    </>
                  ) : (
                    <>
                      Serial bankrupts routinely liquidate debt-burdened entities, abandon trade liabilities, 
                      and spin up new shell companies from the exact same address weeks later. 
                      Without cross-registry executive screening, you have no visibility into a CEO’s trail of liquidations.
                    </>
                  )}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F0F2ED] text-[11px] font-semibold text-[#374151]">
                {isDe ? 'Ohne Wächter: Sie schließen neue Verträge mit Betreibern abgewickelter Pleitefirmen.' : 'Without Sentinel: You sign contracts with serial insolvent operators.'}
              </div>
            </div>

            {/* Risk Card 5 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E3E7DE] shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#6366F1] transition-colors">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#6366F1]"></div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center font-bold font-mono text-sm border border-[#E0E7FF]">
                    05
                  </span>
                  <span className="text-[11px] font-bold text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full border border-[#E0E7FF]">
                    {isDe ? 'Beraterhaftung § 102 StaRUG' : 'Advisory Liability'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0F2922] mb-2 font-serif">
                  {isDe ? 'Haftungsrisiken für Steuerberater & CFOs' : 'Legal Liability for Advisors & Banks'}
                </h3>
                <p className="text-xs sm:text-sm text-[#4E6157] leading-relaxed">
                  {isDe ? (
                    <>
                      Steuerberater und Wirtschaftsprüfer haften persönlich, wenn sie Mandanten nicht rechtzeitig auf drohende 
                      Insolvenztatbestände hinweisen (§ 102 StaRUG). Kreditinstitute und Sparkassen verletzen ohne automatisierte 
                      Kreditüberwachung die strengen Vorgaben der BaFin MaRisk (§ 25a KWG).
                    </>
                  ) : (
                    <>
                      Tax advisors and CPAs face direct civil liability if they fail to alert clients to impending 
                      insolvency triggers (§ 102 StaRUG). Lending banks and savings banks breach BaFin MaRisk 
                      regulatory mandates without persistent borrower surveillance.
                    </>
                  )}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F0F2ED] text-[11px] font-semibold text-[#4F46E5]">
                {isDe ? 'Ohne Wächter: Persönliches Beraterhaftungs- und Regressrisiko.' : 'Without Sentinel: Personal professional liability exposure and audit penalties.'}
              </div>
            </div>

            {/* Risk Card 6: Positive Inversion Banner */}
            <div className="bg-[#0F2922] rounded-2xl p-6 text-white shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#34D399]"></div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-[#1A3F34] text-[#34D399] flex items-center justify-center font-bold text-sm">
                    ✓
                  </span>
                  <span className="text-[11px] font-bold text-[#34D399] bg-[#174337] px-2.5 py-0.5 rounded-full">
                    {isDe ? 'Die Lösung' : 'The Solution'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-serif">
                  {isDe ? 'Insolvenz-Wächter als Schutzschild' : 'Insolvenz-Wächter as Your Shield'}
                </h3>
                <p className="text-xs sm:text-sm text-[#BFD4CB] leading-relaxed">
                  {isDe ? (
                    <>
                      Statt 60 Tage zu spät von der Katastrophe zu erfahren, alarmiert Sie unsere Engine bei der ersten 
                      Register-Auffälligkeit: Vorkasse verlangen, Lieferungen stoppen, Sicherungsübereignungen aktivieren. 
                      Sie sichern Ihr Geld, bevor das Gericht die Konten einfriert.
                    </>
                  ) : (
                    <>
                      Instead of discovering the disaster 60 days too late, our engine warns you at the first registry anomaly: 
                      demand upfront payment, pause pending shipments, and enforce retention of title. 
                      You recover 100% of your funds before court freezes take effect.
                    </>
                  )}
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-full text-xs font-bold text-[#0F2922] bg-[#34D399] hover:bg-[#6EE7B7] transition-colors"
                >
                  {isDe ? 'Jetzt 3 Firmen kostenlos absichern →' : 'Protect 3 Companies Free Now →'}
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE LIVE PRODUCT DEMO & DOSSIER PREVIEW */}
      <section id="live-demo" className="py-20 bg-[#FBFBF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#E8F3EE] text-[#14533C] border border-[#C6E2D5] mb-3">
              {isDe ? 'Hands-On Produktdemo' : 'Interactive Product Demo'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2922] font-serif tracking-tight mb-4">
              {isDe ? 'Erleben Sie das 4-Ebenen Due Diligence Dossier' : 'Experience the 4-Layer Due Diligence Dossier'}
            </h2>
            <p className="text-sm sm:text-base text-[#4E6157]">
              {isDe ? (
                <>
                  Klicken Sie auf ein Beispielunternehmen oder geben Sie einen Firmennamen ein, um die amtliche Registeranalyse, 
                  die Medienkrisen-Erkennung, Finanzkennzahlen und Gerichtsbekanntmachungen in Echtzeit zu prüfen:
                </>
              ) : (
                <>
                  Click a sample business or enter a name to inspect official register records, crisis news sentiment, 
                  statutory financials, and court bulletins in real time:
                </>
              )}
            </p>
          </div>

          {/* Live Search Bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  const found = SAMPLE_COMPANIES.find(c => 
                    c.name.toLowerCase().includes(val.toLowerCase()) || 
                    c.city.toLowerCase().includes(val.toLowerCase())
                  );
                  if (found) setSelectedCompany(found);
                }}
                placeholder={isDe ? 'Unternehmen nach Namen oder Stadt filtern...' : 'Filter sample company by name or city...'}
                className="w-full px-4 py-2.5 pl-10 rounded-full text-xs bg-white border border-[#DCE2D8] text-[#14231E] placeholder-[#8EA197] focus:outline-hidden focus:border-[#10B981] shadow-2xs"
              />
              <svg className="w-4 h-4 text-[#8EA197] absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Interactive Company Selector Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <span className="text-xs font-semibold text-[#5B6F64] mr-2">
              {isDe ? 'Musterfälle testen:' : 'Test sample cases:'}
            </span>
            {SAMPLE_COMPANIES
              .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.city.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((company) => {
              const isSelected = selectedCompany.id === company.id;
              return (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-[#0F2922] text-white border-[#0F2922] shadow-xs'
                      : 'bg-white text-[#384941] hover:bg-[#F2F5F0] border-[#DCE2D8]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    company.status === 'active' 
                      ? 'bg-[#10B981]' 
                      : company.status === 'warning' 
                      ? 'bg-[#F59E0B]' 
                      : 'bg-[#EF4444]'
                  }`} />
                  <span>{company.name.split(' ')[0]} {company.name.split(' ')[1]}</span>
                  <span className={`ml-2 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#EAEFE8] text-[#556960]'
                  }`}>
                    {company.score}/100
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dossier Mockup Window */}
          <div className="bg-white rounded-3xl border border-[#D8DFD5] shadow-xl overflow-hidden max-w-5xl mx-auto">
            
            {/* Dossier Window Header */}
            <div className="bg-[#122A23] text-white p-6 sm:p-8 border-b border-[#214238]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[#34D399] bg-[#1C473A] px-2.5 py-0.5 rounded-full font-bold">
                      {isDe ? 'Amtlicher Gerichts-Audit' : 'Official Court Audit'}
                    </span>
                    <span className="text-xs text-[#8FB7A4] font-mono">
                      {selectedCompany.regNumber} • {selectedCompany.court}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                    {selectedCompany.name}
                  </h3>
                  <div className="text-xs text-[#A1C2B2] mt-1 flex items-center space-x-3">
                    <span>{selectedCompany.legalForm}</span>
                    <span>•</span>
                    <span>Sitz: {selectedCompany.city}</span>
                    <span>•</span>
                    <span>{isDe ? 'Letzter Sync: Heute, 07:00 Uhr' : 'Last sync: Today, 07:00 AM'}</span>
                  </div>
                </div>

                {/* Score Dial Badge */}
                <div className="flex items-center space-x-4 bg-[#193B31] p-3 rounded-2xl border border-[#275345]">
                  <div className="text-right">
                    <div className="text-[10px] text-[#A1C2B2] uppercase font-bold tracking-wider">
                      {isDe ? 'Solvenz-Risikoscore' : 'Solvency Score'}
                    </div>
                    <div className="text-xs font-semibold text-white">
                      {selectedCompany.scoreLabel}
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-xl shadow-xs ${
                    selectedCompany.score >= 80 
                      ? 'bg-[#10B981] text-white' 
                      : selectedCompany.score >= 45 
                      ? 'bg-[#F59E0B] text-white' 
                      : 'bg-[#EF4444] text-white animate-pulse'
                  }`}>
                    <span>{selectedCompany.score}</span>
                    <span className="text-[9px] -mt-1 font-sans font-normal opacity-80">/100</span>
                  </div>
                </div>
              </div>

              {/* Dossier Tabs */}
              <div className="flex space-x-2 mt-6 pt-6 border-t border-[#214238] overflow-x-auto text-xs font-medium">
                <button
                  onClick={() => setDemoActiveTab('overview')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    demoActiveTab === 'overview'
                      ? 'bg-white text-[#0F2922] font-bold shadow-xs'
                      : 'text-[#A1C2B2] hover:text-white hover:bg-[#1A3E33]'
                  }`}
                >
                  {isDe ? '1. Register & Geschäftsführung' : '1. Register & Management'}
                </button>
                <button
                  onClick={() => setDemoActiveTab('media')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    demoActiveTab === 'media'
                      ? 'bg-white text-[#0F2922] font-bold shadow-xs'
                      : 'text-[#A1C2B2] hover:text-white hover:bg-[#1A3E33]'
                  }`}
                >
                  {isDe ? '2. Medien- & Restrukturierungs-Radar' : '2. Media Crisis Radar'}
                </button>
                <button
                  onClick={() => setDemoActiveTab('finance')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    demoActiveTab === 'finance'
                      ? 'bg-white text-[#0F2922] font-bold shadow-xs'
                      : 'text-[#A1C2B2] hover:text-white hover:bg-[#1A3E33]'
                  }`}
                >
                  {isDe ? '3. Bilanztransparenz & EU-USt' : '3. Financials & VAT'}
                </button>
                <button
                  onClick={() => setDemoActiveTab('legal')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    demoActiveTab === 'legal'
                      ? 'bg-white text-[#0F2922] font-bold shadow-xs'
                      : 'text-[#A1C2B2] hover:text-white hover:bg-[#1A3E33]'
                  }`}
                >
                  {isDe ? '4. Justizportal & Schutzschirm (§§ 9, 10 InsO)' : '4. Insolvency Gazette'}
                </button>
              </div>
            </div>

            {/* Dossier Tab Content */}
            <div className="p-6 sm:p-8 bg-white">
              
              {demoActiveTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E4EAE1]">
                      <div className="text-xs font-bold text-[#556960] uppercase tracking-wider mb-2">
                        {isDe ? 'Registerstamm & Stammkapital' : 'Registry & Capital'}
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#6D8075]">{isDe ? 'Amtsgericht:' : 'Court:'}</span>
                          <span className="font-semibold text-[#14231E]">{selectedCompany.court}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6D8075]">{isDe ? 'Registernummer:' : 'Reg. Number:'}</span>
                          <span className="font-semibold text-[#14231E] font-mono">{selectedCompany.regNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6D8075]">{isDe ? 'Stammkapital:' : 'Share Capital:'}</span>
                          <span className="font-semibold text-[#14231E]">{selectedCompany.capital}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6D8075]">{isDe ? 'Rechtsform:' : 'Legal Form:'}</span>
                          <span className="font-semibold text-[#14231E]">{selectedCompany.legalForm}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E4EAE1]">
                      <div className="text-xs font-bold text-[#556960] uppercase tracking-wider mb-2">
                        {isDe ? 'Aktuelle Vertretungsorgane' : 'Managing Directors'}
                      </div>
                      <ul className="space-y-2 text-xs">
                        {selectedCompany.directors.map((director, i) => (
                          <li key={i} className="flex items-center text-[#14231E] font-medium">
                            <svg className="w-3.5 h-3.5 text-[#10B981] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {director}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 text-[11px] text-[#6D8075]">
                        {isDe ? 'Vollständige Befugnisse: Einzelvertretungsberechtigung, Befreiung von § 181 BGB geprüft.' : 'Screened across 150+ decentralized registers.'}
                      </div>
                    </div>
                  </div>

                  {/* Risk indicators list */}
                  <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E4EAE1]">
                    <div className="text-xs font-bold text-[#14231E] mb-3 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#34D399] mr-2"></span>
                      {isDe ? 'Prüfprotokoll der Risiko-Engine' : 'Risk Engine Audit Log'}
                    </div>
                    <div className="space-y-2">
                      {selectedCompany.riskReasons.map((reason, i) => (
                        <div key={i} className="flex items-start text-xs text-[#384C42]">
                          <span className="mr-2 text-sm leading-none">•</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {demoActiveTab === 'media' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E4EAE1] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#14231E]">
                        {isDe ? 'KI-gestützter Presse- & Krisen-Radar' : 'AI Press & Crisis Radar'}
                      </div>
                      <div className="text-xs text-[#63776D] mt-0.5">
                        {isDe ? 'Scannt Handelsblatt, FAZ, Wirtschaftswoche, dpa-AFX nach Restrukturierungen & Gewinnwarnungen' : 'Scans German financial press for restructuring rumors & profit warnings'}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        selectedCompany.mediaSentiment.isRisk 
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]' 
                          : 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                      }`}>
                        {selectedCompany.mediaSentiment.score}% {selectedCompany.mediaSentiment.isRisk ? 'Risiko-Warnung' : 'Positiv / Stabil'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#E4EAE1] hover:bg-[#FBFDF9] transition-colors">
                    <div className="flex items-center justify-between text-xs text-[#63776D] mb-1">
                      <span className="font-semibold text-[#0F2922]">{selectedCompany.mediaSentiment.source}</span>
                      <span>{selectedCompany.mediaSentiment.time}</span>
                    </div>
                    <div className="text-sm font-semibold text-[#14231E] mb-1">
                      &ldquo;{selectedCompany.mediaSentiment.headline}&rdquo;
                    </div>
                    <p className="text-xs text-[#4F6459]">
                      {isDe ? 'Automatischer Volltext-Scan bestätigt keine anhängigen Insolvenzanträge oder Gläubigervergleiche.' : 'Automated full-text scan confirms absence of adverse petitions.'}
                    </p>
                  </div>
                </div>
              )}

              {demoActiveTab === 'finance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E4EAE1]">
                    <div className="text-xs font-bold text-[#556960] uppercase tracking-wider mb-2">
                      {isDe ? 'Eigenkapital & Bilanzhinterlegung' : 'Equity & Balance Sheet Status'}
                    </div>
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="text-[#6D8075]">{isDe ? 'Eigenkapitalquote (Bundesanzeiger):' : 'Statutory Equity Ratio:'}</div>
                        <div className="font-semibold text-[#14231E] mt-0.5">{selectedCompany.equityRatio}</div>
                      </div>
                      <div>
                        <div className="text-[#6D8075]">{isDe ? 'Publizitätsprüfung (§ 325 HGB):' : 'Filing Compliance:'}</div>
                        <div className="font-semibold text-[#14231E] mt-0.5">{selectedCompany.balanceSheetStatus}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E4EAE1]">
                    <div className="text-xs font-bold text-[#556960] uppercase tracking-wider mb-2">
                      {isDe ? 'EU USt-IdNr. VIES-Validierung' : 'EU VAT VIES Validation'}
                    </div>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center text-[#059669] font-medium">
                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{selectedCompany.vatStatus}</span>
                      </div>
                      <p className="text-[11px] text-[#6D8075]">
                        {isDe 
                          ? 'Echtzeitabgleich mit dem Bundeszentralamt für Steuern (BZSt) und der Europäischen Kommission.'
                          : 'Live handshake with the Federal Central Tax Office (BZSt) and EU VIES register.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {demoActiveTab === 'legal' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E4EAE1]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-bold text-[#14231E]">
                        {isDe ? 'Insolvenzbekanntmachungen.de (16 Bundesländer)' : 'Official Insolvency Bulletins (16 Federal States)'}
                      </div>
                      <span className="text-[10px] font-mono text-[#059669] bg-[#E8F8F0] px-2 py-0.5 rounded-full font-bold">
                        {isDe ? '16/16 Gerichtsbezirke geprüft' : '16/16 Districts Audited'}
                      </span>
                    </div>
                    <p className="text-xs text-[#384C42] leading-relaxed">
                      {selectedCompany.courtStatus}
                    </p>
                    <div className="mt-3 text-[11px] text-[#6D8075] border-t border-[#E8EDE5] pt-2">
                      {isDe ? 'Überwachungsgrundlage: §§ 9, 10 InsO, § 270d InsO (Schutzschirmverfahren), StaRUG-Restrukturierungspläne.' : 'Scans preliminary proceedings, asset rejections, and creditor assemblies.'}
                    </div>
                  </div>
                </div>
              )}

              {/* Action bar inside mockup */}
              <div className="mt-6 pt-4 border-t border-[#EAEFE8] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-[#556960]">
                  {isDe ? 'Möchten Sie diese Firma live in Ihrer Watchlist überwachen?' : 'Want to monitor this company in your live watchlist?'}
                </div>
                <Link
                  href="/signup"
                  className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0F2922] hover:bg-[#1A4237] transition-colors shadow-xs"
                >
                  <span>{isDe ? 'Zur Watchlist hinzufügen' : 'Add to Watchlist'}</span>
                  <svg className="w-3.5 h-3.5 ml-1.5 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE LOSS & ROI CALCULATOR */}
      <section id="kalkulator" className="py-20 bg-[#F4F6F2] border-y border-[#E2E6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#E8F3EE] text-[#14533C] border border-[#C6E2D5] mb-3">
              {isDe ? 'Interaktiver Schadens-Kalkulator' : 'Interactive Loss Calculator'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2922] font-serif tracking-tight mb-4">
              {isDe ? 'Was kostet Sie ein einziger ungeplanter Ausfall?' : 'How much would a single default cost you?'}
            </h2>
            <p className="text-sm sm:text-base text-[#4E6157]">
              {isDe ? (
                <>
                  Schieben Sie den Regler auf Ihre typische offene Forderungssumme oder Ihr Projektvolumen. 
                  Sehen Sie sofort den realen Verlust bei Insolvenzeröffnung im Vergleich zum Jahrespreis von Insolvenz-Wächter:
                </>
              ) : (
                <>
                  Adjust the slider to your average outstanding invoice volume. 
                  Immediately calculate your real write-off exposure under official court recovery rates:
                </>
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#DCE2D8] shadow-lg max-w-4xl mx-auto p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Sliders Area (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor={volumeSliderId} className="text-xs font-bold text-[#14231E] uppercase tracking-wider">
                      {isDe ? 'Offenes Forderungsvolumen (Gesamtexposure):' : 'Open Receivables Volume:'}
                    </label>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[#0F2922]">
                      € {invoiceVolume.toLocaleString('de-DE')}
                    </span>
                  </div>
                  <input
                    id={volumeSliderId}
                    type="range"
                    min={5000}
                    max={250000}
                    step={5000}
                    value={invoiceVolume}
                    aria-label={isDe ? 'Offenes Forderungsvolumen (Gesamtexposure)' : 'Open Receivables Volume'}
                    onChange={(e) => setInvoiceVolume(Number(e.target.value))}
                    className="w-full h-2.5 bg-[#E4ECE6] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                  />
                  <div className="flex justify-between text-[11px] text-[#6D8075] mt-1">
                    <span>€ 5.000 (Freelancer)</span>
                    <span>€ 100.000 (Agentur)</span>
                    <span>€ 250.000+ (Lieferant / Mittelstand)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor={customerCountSliderId} className="text-xs font-bold text-[#14231E] uppercase tracking-wider">
                      {isDe ? 'Anzahl überwachter B2B-Kunden:' : 'Number of Monitored Clients:'}
                    </label>
                    <span className="text-lg font-bold font-mono text-[#0F2922]">
                      {customerCount} {isDe ? 'Unternehmen' : 'Companies'}
                    </span>
                  </div>
                  <input
                    id={customerCountSliderId}
                    type="range"
                    min={1}
                    max={50}
                    step={1}
                    value={customerCount}
                    aria-label={isDe ? 'Anzahl überwachter B2B-Kunden' : 'Number of Monitored Clients'}
                    onChange={(e) => setCustomerCount(Number(e.target.value))}
                    className="w-full h-2.5 bg-[#E4ECE6] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E3E9DF] text-xs text-[#4F6459] leading-relaxed">
                  <div className="font-semibold text-[#14231E] mb-1">
                    {isDe ? 'Amtliche statistische Berechnungsgrundlage:' : 'Official Statistical Benchmark:'}
                  </div>
                  {isDe ? (
                    <>
                      Nach Eröffnung des Insolvenzverfahrens am Amtsgericht beträgt die durchschnittliche Insolvenzquote für 
                      ungesicherte Gläubiger nur <strong>2,8%</strong> (Quelle: Destatis / BMJ InsO-Evaluation). 
                      Sie verlieren bei Insolvenz <strong>€ {potentialLoss.toLocaleString('de-DE')}</strong> für immer.
                    </>
                  ) : (
                    <>
                      Following insolvency opening at court, the empirical quota for unsecured trade creditors is 
                      <strong> 2.8%</strong> (Destatis / German Ministry of Justice). 
                      You permanently lose <strong>€ {potentialLoss.toLocaleString('de-DE')}</strong>.
                    </>
                  )}
                </div>
              </div>

              {/* Results Breakdown (5 cols) */}
              <div className="lg:col-span-5 bg-[#0F2922] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-[#34D399] uppercase tracking-wider mb-1">
                    {isDe ? 'Realer Netto-Verlust' : 'Net Write-Off Loss'}
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-[#F87171] mb-1">
                    - € {potentialLoss.toLocaleString('de-DE')}
                  </div>
                  <div className="text-[11px] text-[#A1C2B2] mb-6">
                    {isDe ? `(Lediglich ~€ ${recoveredAmount.toLocaleString('de-DE')} Insolvenzquote rückholbar)` : `(Only ~€ ${recoveredAmount.toLocaleString('de-DE')} recovered)`}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#1C473A] text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#A1C2B2]">{isDe ? 'Kosten Insolvenz-Wächter Pro:' : 'Cost of Insolvenz-Wächter Pro:'}</span>
                      <span className="font-bold text-white font-mono">€ {annualCostPro} / Jahr</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#A1C2B2]">{isDe ? 'Geschütztes Eigenkapital:' : 'Protected Capital:'}</span>
                      <span className="font-bold text-[#34D399] font-mono">€ {invoiceVolume.toLocaleString('de-DE')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#A1C2B2]">{isDe ? 'Risiko-ROI:' : 'Risk Mitigation ROI:'}</span>
                      <span className="font-bold text-[#34D399] font-mono">{roiMultiplier}x Absicherung</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1C473A]">
                  <Link
                    href="/signup"
                    className="w-full inline-flex items-center justify-center px-4 py-3 rounded-full text-xs font-bold text-[#0F2922] bg-[#34D399] hover:bg-[#6EE7B7] transition-all"
                  >
                    {isDe ? 'Jetzt Absicherung aktivieren →' : 'Activate Sentinel Protection →'}
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. SIDE-BY-SIDE COMPARISON: TRADITIONAL VS. INSOLVENZ-WÄCHTER */}
      <section className="py-20 bg-[#FBFBF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#E8F3EE] text-[#14533C] border border-[#C6E2D5] mb-3">
              {isDe ? 'Der Systemvergleich' : 'Platform Comparison'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2922] font-serif tracking-tight mb-4">
              {isDe ? 'Manuelle Prüfung vs. Legacy-Auskunftei vs. Insolvenz-Wächter' : 'Manual Checking vs. Legacy Bureaus vs. Insolvenz-Wächter'}
            </h2>
            <p className="text-sm sm:text-base text-[#4E6157]">
              {isDe ? (
                <>Warum führende Unternehmen vom manuellen Justizportal und starren Schufa-Berichten zur automatisierten Echtzeit-Sentinel-Engine wechseln:</>
              ) : (
                <>Why forward-thinking teams transition from manual register lookups and legacy bureaus to automated real-time sentinel intelligence:</>
              )}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-5xl mx-auto bg-white rounded-2xl border border-[#DCE2D8] shadow-xs overflow-hidden text-left text-xs sm:text-sm">
              <thead className="bg-[#0F2922] text-white">
                <tr>
                  <th className="py-4 px-5 font-semibold">{isDe ? 'Vergleichsdimension' : 'Dimension'}</th>
                  <th className="py-4 px-5 font-semibold text-[#CBDAD2]">{isDe ? 'Manuelle Suche (Justizportal)' : 'Manual Lookups'}</th>
                  <th className="py-4 px-5 font-semibold text-[#CBDAD2]">{isDe ? 'Alte Auskunfteien (Schufa/Creditreform)' : 'Legacy Bureaus'}</th>
                  <th className="py-4 px-5 font-bold text-[#34D399] bg-[#143B30]">{isDe ? 'Insolvenz-Wächter' : 'Insolvenz-Wächter'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6EBE2] text-[#33463B]">
                <tr className="hover:bg-[#F9FAF8]">
                  <td className="py-3.5 px-5 font-bold text-[#14231E]">{isDe ? 'Überwachungshorizont' : 'Warning Horizon'}</td>
                  <td className="py-3.5 px-5 text-[#B91C1C]">{isDe ? '0 Tage (nur bei Erinnerung)' : '0 days (ad-hoc)'}</td>
                  <td className="py-3.5 px-5 text-[#B45309]">{isDe ? 'Träge (Quartalsberichte)' : 'Slow quarterly updates'}</td>
                  <td className="py-3.5 px-5 font-bold text-[#059669] bg-[#F2F8F4]">{isDe ? 'Bis zu 90 Tage Frühsignal' : 'Up to 90 days early warning'}</td>
                </tr>
                <tr className="hover:bg-[#F9FAF8]">
                  <td className="py-3.5 px-5 font-bold text-[#14231E]">{isDe ? 'Aktualisierungsfrequenz' : 'Update Frequency'}</td>
                  <td className="py-3.5 px-5 text-[#6D8075]">{isDe ? 'Manuell durch Mitarbeiter' : 'Manual staff effort'}</td>
                  <td className="py-3.5 px-5 text-[#6D8075]">{isDe ? 'Monatlich / Quartalsweise' : 'Monthly / quarterly batch'}</td>
                  <td className="py-3.5 px-5 font-bold text-[#059669] bg-[#F2F8F4]">{isDe ? 'Täglich um 07:00 Uhr morgens' : 'Daily 7:00 AM court sync'}</td>
                </tr>
                <tr className="hover:bg-[#F9FAF8]">
                  <td className="py-3.5 px-5 font-bold text-[#14231E]">{isDe ? 'Amtsgerichte abgedeckt' : 'Courts Covered'}</td>
                  <td className="py-3.5 px-5 text-[#6D8075]">{isDe ? '1 nach dem anderen manuell' : '1 by 1 fragmented'}</td>
                  <td className="py-3.5 px-5 text-[#6D8075]">{isDe ? 'Teilweise aggregiert' : 'Partial aggregation'}</td>
                  <td className="py-3.5 px-5 font-bold text-[#059669] bg-[#F2F8F4]">{isDe ? 'Alle 150+ deutschen Registergerichte' : 'All 150+ German registry courts'}</td>
                </tr>
                <tr className="hover:bg-[#F9FAF8]">
                  <td className="py-3.5 px-5 font-bold text-[#14231E]">{isDe ? 'Geschäftsführer-Historie' : 'Executive Trace'}</td>
                  <td className="py-3.5 px-5 text-[#B91C1C]">{isDe ? 'Nicht ermittelbar' : 'Not possible'}</td>
                  <td className="py-3.5 px-5 text-[#6D8075]">{isDe ? 'Teure Zusatzberichte' : 'Expensive add-on'}</td>
                  <td className="py-3.5 px-5 font-bold text-[#059669] bg-[#F2F8F4]">{isDe ? 'Integrierter Phoenix-Director-Check' : 'Built-in Phoenix Director screening'}</td>
                </tr>
                <tr className="hover:bg-[#F9FAF8]">
                  <td className="py-3.5 px-5 font-bold text-[#14231E]">{isDe ? 'Benachrichtigungsweg' : 'Alerting'}</td>
                  <td className="py-3.5 px-5 text-[#B91C1C]">{isDe ? 'Keiner (muss gesucht werden)' : 'None'}</td>
                  <td className="py-3.5 px-5 text-[#6D8075]">{isDe ? 'Portal-Login erforderlich' : 'Portal login required'}</td>
                  <td className="py-3.5 px-5 font-bold text-[#059669] bg-[#F2F8F4]">{isDe ? 'E-Mail, Webhook, Slack, Teams' : 'Email, Webhooks, Slack, Teams'}</td>
                </tr>
                <tr className="hover:bg-[#F9FAF8]">
                  <td className="py-3.5 px-5 font-bold text-[#14231E]">{isDe ? 'Preismodell' : 'Pricing'}</td>
                  <td className="py-3.5 px-5 text-[#6D8075]">{isDe ? 'Kostenlos, aber extrem zeitintensiv' : 'Free but hours wasted'}</td>
                  <td className="py-3.5 px-5 text-[#B91C1C]">{isDe ? '€ 1.200 – € 5.000 / Jahr + Knebelvertrag' : '€1,200 – €5,000/yr lock-in'}</td>
                  <td className="py-3.5 px-5 font-bold text-[#059669] bg-[#F2F8F4]">{isDe ? '0 € bis 29 € / Monat • Monatlich kündbar' : '€0 to €29/mo • Cancel anytime'}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 7. WHO WE ARE & WHAT WE OFFER: THE 5 DATA ENGINE MODULES */}
      <section id="funktionen" className="py-20 bg-[#F4F6F2] border-y border-[#E2E6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#E8F3EE] text-[#14533C] border border-[#C6E2D5] mb-3">
              {isDe ? 'Unsere Kern-Technologie' : 'Core Technology Stack'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2922] font-serif tracking-tight mb-4">
              {isDe ? 'Wer wir sind: Die Architektur hinter Insolvenz-Wächter' : 'Who We Are: The Platform Architecture'}
            </h2>
            <p className="text-sm sm:text-base text-[#4E6157] leading-relaxed">
              {isDe ? (
                <>
                  Wir sind kein einfacher E-Mail-Dienst. Unsere Plattform konsolidiert dezentrale staatliche Register 
                  und offene Datenquellen in fünf spezialisierten Software-Modulen:
                </>
              ) : (
                <>
                  We are not a basic alert tool. Our infrastructure consolidates decentralized state registers 
                  and open data layers into five institutional software modules:
                </>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Module 1 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1E6DC] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#E8F3EE] text-[#134E39] flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#0F2922] mb-2 font-serif">
                {isDe ? '1. Company Profile Engine' : '1. Company Profile Engine'}
              </h3>
              <p className="text-xs text-[#52665B] leading-relaxed mb-4">
                {isDe ? (
                  <>
                    Vollständiger Abgleich von HRB/HRA, Amtsgericht, Stammkapital, Rechtsform, Unternehmensgegenstand 
                    und den wirtschaftlich Berechtigten (UBO / GwG-Compliance). Ersetzt manuelle Registerauszüge.
                  </>
                ) : (
                  <>
                    Real-time extraction of court number, legal form, corporate purpose, share capital, 
                    and ultimate beneficial owners (UBO / AML). Eliminates manual government portal fees.
                  </>
                )}
              </p>
              <div className="text-[11px] font-semibold text-[#1B6D4F]">
                {isDe ? 'Nutzen: Automatisiertes Onboarding im ERP/CRM' : 'Benefit: Instant Counterparty Verification'}
              </div>
            </div>

            {/* Module 2 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1E6DC] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#E8F3EE] text-[#134E39] flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#0F2922] mb-2 font-serif">
                {isDe ? '2. Executive Screening Pipeline' : '2. Executive Screening Pipeline'}
              </h3>
              <p className="text-xs text-[#52665B] leading-relaxed mb-4">
                {isDe ? (
                  <>
                    Personenbezogene Verknüpfung über alle deutschen Gerichtsbezirke. Zeigt frühere Geschäftsführer-Mandate, 
                    liquidierte Vorfirmen und deckt verdeckte Verflechtungen auf.
                  </>
                ) : (
                  <>
                    Cross-references any managing director across all German registries to reveal prior corporate insolvencies, 
                    dissolved shell companies, and shared director networks.
                  </>
                )}
              </p>
              <div className="text-[11px] font-semibold text-[#1B6D4F]">
                {isDe ? 'Nutzen: Schutz vor "Phoenix-Geschäftsführern"' : 'Benefit: Phoenix Director Fraud Prevention'}
              </div>
            </div>

            {/* Module 3 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1E6DC] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#E8F3EE] text-[#134E39] flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#0F2922] mb-2 font-serif">
                {isDe ? '3. Live Court Signals Stream' : '3. Live Court Signals Stream'}
              </h3>
              <p className="text-xs text-[#52665B] leading-relaxed mb-4">
                {isDe ? (
                  <>
                    Echtzeit-Feed aller amtlichen Gerichtsveröffentlichungen: Kapitalherabsetzungen, Geschäftsführer-Widerrufe, 
                    Verschmelzungen und vorläufige Schutzschirmverfahren nach §§ 9, 10 InsO.
                  </>
                ) : (
                  <>
                    Real-time normalized stream of all court decrees: capital reductions, sudden executive revocations, 
                    mergers, and preliminary insolvency notifications.
                  </>
                )}
              </p>
              <div className="text-[11px] font-semibold text-[#1B6D4F]">
                {isDe ? 'Nutzen: Bis zu 90 Tage früher warnen & Vorkasse verlangen' : 'Benefit: Weeks of advance notice to demand prepayment'}
              </div>
            </div>

            {/* Module 4 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1E6DC] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#E8F3EE] text-[#134E39] flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#0F2922] mb-2 font-serif">
                {isDe ? '4. 1-Klick Audit Dossier (PDF)' : '4. 1-Click Due Diligence Dossier'}
              </h3>
              <p className="text-xs text-[#52665B] leading-relaxed mb-4">
                {isDe ? (
                  <>
                    Vorstandsfertige, 3-seitige Audit-Berichte mit digitalem Zeitstempel. Dokumentiert die Solvenzprüfung 
                    zur rechtlichen Enthaftung nach den Grundsätzen ordnungsgemäßer Geschäftsführung (GoG).
                  </>
                ) : (
                  <>
                    Boardroom-ready 3-page executive audit report exportable in one click. Provides certified proof 
                    of solvency due diligence for auditors and legal compliance.
                  </>
                )}
              </p>
              <div className="text-[11px] font-semibold text-[#1B6D4F]">
                {isDe ? 'Nutzen: Schutz vor Anfechtungsklagen (§ 133 InsO)' : 'Benefit: Defense against clawback lawsuits'}
              </div>
            </div>

            {/* Module 5 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1E6DC] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#E8F3EE] text-[#134E39] flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#0F2922] mb-2 font-serif">
                {isDe ? '5. Portfolio & Webhook Sentinel' : '5. Continuous Webhook Sentinel'}
              </h3>
              <p className="text-xs text-[#52665B] leading-relaxed mb-4">
                {isDe ? (
                  <>
                    Automatischer Massenimport (CSV oder API) für hunderte Kunden gleichzeitig. 
                    Verbindet sich mit Slack, Microsoft Teams oder Buchhaltungs-Webhooks bei jeder Registeränderung.
                  </>
                ) : (
                  <>
                    Enterprise batch watchlist upload enabling credit controllers to monitor 5,000+ borrowers or suppliers 
                    simultaneously with signed zero-latency webhooks.
                  </>
                )}
              </p>
              <div className="text-[11px] font-semibold text-[#1B6D4F]">
                {isDe ? 'Nutzen: Null manueller Aufwand im Kreditcontrolling' : 'Benefit: Zero manual polling across large portfolios'}
              </div>
            </div>

            {/* Module 6: Zero Cost Data Multi-Layer */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1E6DC] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#E8F3EE] text-[#134E39] flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#0F2922] mb-2 font-serif">
                {isDe ? '6. Multi-Layer Open Intelligence' : '6. Multi-Layer Open Intelligence'}
              </h3>
              <p className="text-xs text-[#52665B] leading-relaxed mb-4">
                {isDe ? (
                  <>
                    Integrierte Prüfung von EU-USt-IdNr. (VIES), Echtzeit-Börsenkurse (XETRA) für börsennotierte AGs, 
                    Pressestimmen (Handelsblatt) und digitale Infrastruktur (Domain/Mail-Sentinel).
                  </>
                ) : (
                  <>
                    Multi-source verification covering EU VAT validity, live market capitalization & stock volatility (XETRA), 
                    media restructuring press, and active digital domain DNS checks.
                  </>
                )}
              </p>
              <div className="text-[11px] font-semibold text-[#1B6D4F]">
                {isDe ? 'Nutzen: Ganzheitliches 360-Grad-Lagebild' : 'Benefit: Complete 360-degree counterparty cockpit'}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. AUDIENCE SEGMENTS (FULLSCRIPT STYLE DUAL-PATHWAY) */}
      <section id="zielgruppen" className="py-20 bg-[#FBFBF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#E8F3EE] text-[#14533C] border border-[#C6E2D5] mb-3">
              {isDe ? 'Maßgeschneiderte Lösungen' : 'Tailored Solutions'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2922] font-serif tracking-tight mb-4">
              {isDe ? 'Für wen ist Insolvenz-Wächter gebaut?' : 'Who is Insolvenz-Wächter built for?'}
            </h2>
            <p className="text-sm sm:text-base text-[#4E6157]">
              {isDe ? (
                <>Vom einzelnen IT-Berater in Walldorf bis zur Sparkasse mit Milliarden-Kreditportfolio:</>
              ) : (
                <>From solo SAP contractors to regional savings banks managing billion-euro loan books:</>
              )}
            </p>
          </div>

          {/* Segment Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveSegment('freelance')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeSegment === 'freelance'
                  ? 'bg-[#0F2922] text-white shadow-xs'
                  : 'bg-white text-[#41544B] hover:bg-[#EFF3EE] border border-[#D8DFD5]'
              }`}
            >
              {isDe ? 'Freelancer & IT-Berater (Micro-B2B)' : 'Freelancers & IT Contractors'}
            </button>
            <button
              onClick={() => setActiveSegment('agency')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeSegment === 'agency'
                  ? 'bg-[#0F2922] text-white shadow-xs'
                  : 'bg-white text-[#41544B] hover:bg-[#EFF3EE] border border-[#D8DFD5]'
              }`}
            >
              {isDe ? 'Agenturen, Personal & B2B-Lieferanten' : 'Agencies & Suppliers'}
            </button>
            <button
              onClick={() => setActiveSegment('advisor')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeSegment === 'advisor'
                  ? 'bg-[#0F2922] text-white shadow-xs'
                  : 'bg-white text-[#41544B] hover:bg-[#EFF3EE] border border-[#D8DFD5]'
              }`}
            >
              {isDe ? 'Steuerberater & Kanzleien' : 'Tax Advisors & CPAs'}
            </button>
            <button
              onClick={() => setActiveSegment('bank')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeSegment === 'bank'
                  ? 'bg-[#0F2922] text-white shadow-xs'
                  : 'bg-white text-[#41544B] hover:bg-[#EFF3EE] border border-[#D8DFD5]'
              }`}
            >
              {isDe ? 'Sparkassen & Kreditbanken (Enterprise)' : 'Banks & Savings Banks'}
            </button>
          </div>

          {/* Segment Details Box */}
          <div className="bg-white rounded-3xl border border-[#DCE2D8] shadow-lg max-w-4xl mx-auto p-6 sm:p-10">
            
            {activeSegment === 'freelance' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] bg-[#E8F8F0] px-3 py-1 rounded-full">
                    {isDe ? '1.600.000 Freelancer in Deutschland' : '1.6M Freelancers in Germany'}
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-[#0F2922] mt-3 mb-3">
                    {isDe ? 'Ein einziger Zahlungsausfall bedroht die Existenz' : 'One defaulted invoice wipes out your quarterly income'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4E6157] leading-relaxed mb-4">
                    {isDe ? (
                      <>
                        IT- und SAP-Berater mit Tagessätzen von 800 € bis 1.200 € arbeiten oft 60 bis 90 Tage auf Vorleistung, 
                        bevor die Rechnung fällig ist. Geht der Kunde pleite, sind 20.000 € bis 50.000 € auf einen Schlag weg.
                      </>
                    ) : (
                      <>
                        IT and SAP contractors billing €800 to €1,200/day often work 60 to 90 days before invoices settle. 
                        A client collapse immediately eliminates €20,000 to €50,000 of hard work.
                      </>
                    )}
                  </p>
                  <ul className="space-y-2 text-xs text-[#384C42] mb-6">
                    <li className="flex items-center">✓ {isDe ? 'Bis zu 3 Kunden dauerhaft 100% kostenlos überwachen' : 'Monitor 3 clients 100% free forever'}</li>
                    <li className="flex items-center">✓ {isDe ? 'Sofortige Warnung bei Schutzschirm- oder Insolvenzantrag' : 'Instant alert if protective proceedings begin'}</li>
                    <li className="flex items-center">✓ {isDe ? 'Günstiger als 20 Minuten Ihres Stundensatzes' : 'Costs less than 20 minutes of your billing rate'}</li>
                  </ul>
                  <Link
                    href="/signup"
                    className="inline-flex items-center px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#0F2922] hover:bg-[#1A4237]"
                  >
                    {isDe ? 'Kostenlos 3 Kunden anlegen →' : 'Add 3 Clients Free →'}
                  </Link>
                </div>
                <div className="bg-[#F8FAF7] rounded-2xl p-6 border border-[#E3E8DF]">
                  <div className="text-xs font-bold text-[#14231E] mb-2 font-mono">CASE: SAP-Freelancer Walldorf</div>
                  <blockquote className="text-xs text-[#52665B] italic leading-relaxed mb-4">
                    &ldquo;{isDe 
                      ? 'Letztes Jahr ging ein Mittelständler in Insolvenz, für den ich 3 Monate Software entwickelt hatte. Schaden: 34.000 €. Mit Insolvenz-Wächter hätte ich schon 6 Wochen vorher gewusst, dass der Geschäftsführer gewechselt hat und Mahnverfahren liefen.'
                      : 'Last year a client went bankrupt after I developed 3 months of code. Total loss: €34,000. With Insolvenz-Wächter I would have known 6 weeks earlier when the director resigned.'}&rdquo;
                  </blockquote>
                  <div className="text-[11px] font-bold text-[#14231E]">— M. K., Senior SAP Architect (Rhein-Neckar)</div>
                </div>
              </div>
            )}

            {activeSegment === 'agency' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] bg-[#E8F8F0] px-3 py-1 rounded-full">
                    {isDe ? '55.000 Agenturen & Personaldienstleister' : '55,000 Agencies & Staffing Firms'}
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-[#0F2922] mt-3 mb-3">
                    {isDe ? 'Hohe Personalkosten vorfinanzieren ohne Schutz?' : 'Financing 6-figure payroll without default protection?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4E6157] leading-relaxed mb-4">
                    {isDe ? (
                      <>
                        Agenturen und Personalvermittler zahlen Mitarbeiter und Subunternehmer monatlich pünktlich aus, 
                        während Enterprise-Kunden Zahlungsziele von 60 oder 90 Tagen verlangen. 
                        Ein einziger Großkundenausfall zieht die Agentur in den Abgrund.
                      </>
                    ) : (
                      <>
                        Agencies pay employees and sub-contractors on time each month while corporate clients 
                        negotiate 60 or 90 day payment terms. A single default pushes the agency into liquidity crisis.
                      </>
                    )}
                  </p>
                  <ul className="space-y-2 text-xs text-[#384C42] mb-6">
                    <li className="flex items-center">✓ {isDe ? '25 bis 100 Kunden parallel auf Autopilot überwachen' : 'Monitor 25 to 100 clients on autopilot'}</li>
                    <li className="flex items-center">✓ {isDe ? '1-Klick Due Diligence Dossiers vor Vertragsunterzeichnung' : '1-click due diligence reports before contract signing'}</li>
                    <li className="flex items-center">✓ {isDe ? 'Direkte Slack- & Teams-Integration für das Debitoren-Team' : 'Direct Slack & Teams alerts for your finance team'}</li>
                  </ul>
                  <Link
                    href="/signup"
                    className="inline-flex items-center px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#0F2922] hover:bg-[#1A4237]"
                  >
                    {isDe ? 'Agentur-Tarif ansehen (€29/Mo) →' : 'View Agency Plan (€29/mo) →'}
                  </Link>
                </div>
                <div className="bg-[#F8FAF7] rounded-2xl p-6 border border-[#E3E8DF]">
                  <div className="text-xs font-bold text-[#14231E] mb-2 font-mono">CASE: Digitalagentur Berlin (35 Mitarbeiter)</div>
                  <blockquote className="text-xs text-[#52665B] italic leading-relaxed mb-4">
                    &ldquo;{isDe 
                      ? 'Wir nutzen Insolvenz-Wächter als festen Bestandteil unserer Vertriebsfreigabe. Bevor wir ein 6-stelliges Projekt pitchen, ziehen wir das Dossier. Es hat uns bereits vor einem insolventen E-Commerce-Kunden gerettet.'
                      : 'We run every prospect through Insolvenz-Wächter before pitching 6-figure retainers. It already saved us from a bankrupt retailer.'}&rdquo;
                  </blockquote>
                  <div className="text-[11px] font-bold text-[#14231E]">— Sarah L., Managing Director</div>
                </div>
              </div>
            )}

            {activeSegment === 'advisor' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] bg-[#E8F8F0] px-3 py-1 rounded-full">
                    {isDe ? '90.000 Steuerberater & Kanzleien' : '90,000 Tax Advisors & Law Firms'}
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-[#0F2922] mt-3 mb-3">
                    {isDe ? 'Gesetzliche Frühwarnpflicht (§ 102 StaRUG) rechtssicher erfüllen' : 'Statutory Early Warning Duty (§ 102 StaRUG)'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4E6157] leading-relaxed mb-4">
                    {isDe ? (
                      <>
                        Steuerberater sind gesetzlich verpflichtet, Mandanten auf drohende Zahlungsunfähigkeit hinzuweisen. 
                        Insolvenz-Wächter liefert die revisionssichere Dokumentation zur Enthaftung der Kanzlei 
                        und schützt das eigene Beraterhonorar.
                      </>
                    ) : (
                      <>
                        Tax advisors in Germany face statutory obligations to alert clients to impending insolvency hazards. 
                        Insolvenz-Wächter delivers audit-proof documentation protecting advisors from liability.
                      </>
                    )}
                  </p>
                  <ul className="space-y-2 text-xs text-[#384C42] mb-6">
                    <li className="flex items-center">✓ {isDe ? 'Rechtssichere PDF-Dossiers mit digitalem Prüfsiegel' : 'Certified compliance PDF exports with timestamp'}</li>
                    <li className="flex items-center">✓ {isDe ? 'Mandanten-Massenimport per CSV' : 'Client roster bulk upload via CSV'}</li>
                    <li className="flex items-center">✓ {isDe ? 'DSGVO-konforme Auftragsverarbeitung (AVV) inklusive' : 'GDPR Article 30 DPA agreement included'}</li>
                  </ul>
                  <Link
                    href="/signup"
                    className="inline-flex items-center px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#0F2922] hover:bg-[#1A4237]"
                  >
                    {isDe ? 'Kanzlei-Tarif testen →' : 'Explore CPA Tier →'}
                  </Link>
                </div>
                <div className="bg-[#F8FAF7] rounded-2xl p-6 border border-[#E3E8DF]">
                  <div className="text-xs font-bold text-[#14231E] mb-2 font-mono">CASE: Steuerberatungsgesellschaft Frankfurt</div>
                  <blockquote className="text-xs text-[#52665B] italic leading-relaxed mb-4">
                    &ldquo;{isDe 
                      ? 'Das Dossier spart unseren Wirtschaftsprüfern Stunden manueller Recherche im Unternehmensregister. Mit einem Klick haben wir die vollständige Eigentümerstruktur, Vertretungsorgane und Registerhistorie.'
                      : 'The dossier saves our auditors hours of digging in the federal gazette. In one click we have ownership, management history, and court verification.'}&rdquo;
                  </blockquote>
                  <div className="text-[11px] font-bold text-[#14231E]">— Dr. Klaus W., Steuerberater & Partner</div>
                </div>
              </div>
            )}

            {activeSegment === 'bank' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] bg-[#E8F8F0] px-3 py-1 rounded-full">
                    {isDe ? '337 Sparkassen & 690 Volksbanken' : '337 Sparkassen & 690 Volksbanken'}
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-[#0F2922] mt-3 mb-3">
                    {isDe ? 'BaFin MaRisk § 25a KWG konforme Portfolio-Überwachung' : 'Institutional BaFin MaRisk Compliance'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4E6157] leading-relaxed mb-4">
                    {isDe ? (
                      <>
                        Deutsche Sparkassen verwalten über 500 Milliarden Euro Kreditvolumen an den Mittelstand. 
                        Unter den Mindestanforderungen der BaFin an das Risikomanagement (MaRisk) müssen tausende 
                        Kreditnehmer laufend überwacht werden. Unsere API ersetzt langsame, teure Altsysteme.
                      </>
                    ) : (
                      <>
                        German savings banks manage over €500B in commercial loans to German SMEs. 
                        Under strict BaFin MaRisk rules, thousands of borrowers require continuous standing checks. 
                        Our API replaces outdated legacy manual workflows.
                      </>
                    )}
                  </p>
                  <ul className="space-y-2 text-xs text-[#384C42] mb-6">
                    <li className="flex items-center">✓ {isDe ? '5.000 bis 20.000 Kreditnehmer je Sparkasse per API' : '5,000 to 20,000 corporate borrowers via API'}</li>
                    <li className="flex items-center">✓ {isDe ? 'Signierte Webhook-Payloads bei Registeränderungen' : 'Signed real-time webhooks for core banking systems'}</li>
                    <li className="flex items-center">✓ {isDe ? 'Dedizierte On-Premises- oder Private-Cloud-Optionen' : 'Dedicated Private Cloud or On-Premises deployment'}</li>
                  </ul>
                  <a
                    href="mailto:enterprise@insolvenz-waechter.de"
                    className="inline-flex items-center px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#0F2922] hover:bg-[#1A4237]"
                  >
                    {isDe ? 'Enterprise-Gespräch anfordern →' : 'Request Institutional Briefing →'}
                  </a>
                </div>
                <div className="bg-[#F8FAF7] rounded-2xl p-6 border border-[#E3E8DF]">
                  <div className="text-xs font-bold text-[#14231E] mb-2 font-mono">CASE: Sparkasse Kreditrisiko-Abteilung</div>
                  <div className="space-y-2 text-xs text-[#52665B]">
                    <div className="flex justify-between border-b border-[#E3E8DF] pb-1">
                      <span>{isDe ? 'Kreditvolumen Mittelstand:' : 'Commercial SME Loan Book:'}</span>
                      <span className="font-bold text-[#14231E]">&gt; € 1,4 Mrd.</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E3E8DF] pb-1">
                      <span>{isDe ? 'Überwachte Firmenkunden:' : 'Corporate Borrowers:'}</span>
                      <span className="font-bold text-[#14231E]">6.800 Gewerbekunden</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isDe ? 'BaFin MaRisk Audit Status:' : 'Audit Status:'}</span>
                      <span className="font-bold text-[#059669]">100% Konform</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 9. TRANSPARENT PRICING TIERS */}
      <section id="preise" className="py-20 bg-[#F4F6F2] border-y border-[#E2E6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#E8F3EE] text-[#14533C] border border-[#C6E2D5] mb-3">
              {isDe ? 'Transparente Tarife' : 'Transparent Pricing'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2922] font-serif tracking-tight mb-4">
              {isDe ? 'Wählen Sie Ihren passenden Schutzschirm' : 'Choose Your Sentinel Protection'}
            </h2>
            <p className="text-sm sm:text-base text-[#4E6157] mb-8">
              {isDe 
                ? 'Monatlich flexibel kündbar. Keine Einrichtungsgebühr. 100% DSGVO-konform.' 
                : 'Cancel anytime. No setup fees. 100% GDPR compliant with German servers.'}
            </p>

            {/* Billing Toggle (Monthly / Annual) */}
            <div className="inline-flex items-center bg-[#E5ECE5] p-1.5 rounded-full border border-[#D0DED1]">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  !isAnnual ? 'bg-white text-[#0F2922] shadow-xs' : 'text-[#556960] hover:text-[#0F2922]'
                }`}
              >
                {isDe ? 'Monatliche Abrechnung' : 'Monthly'}
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center ${
                  isAnnual ? 'bg-[#0F2922] text-white shadow-xs' : 'text-[#556960] hover:text-[#0F2922]'
                }`}
              >
                <span>{isDe ? 'Jährliche Abrechnung' : 'Annual (Save 20%)'}</span>
                <span className="ml-1.5 text-[10px] bg-[#34D399] text-[#0F2922] px-1.5 py-0.2 rounded-full font-bold">
                  {isDe ? '2 Monate gratis' : '2 Mo Free'}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Free Tier */}
            <div className="bg-white rounded-3xl p-8 border border-[#DCE2D8] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#0F2922] mb-1">Free / Basis</h3>
                <p className="text-xs text-[#5C7065] mb-6">
                  {isDe ? 'Für Solo-Freelancer & Einsteiger' : 'For solo freelancers & contractors'}
                </p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold font-mono text-[#0F2922]">€ 0</span>
                  <span className="text-xs text-[#5C7065] ml-2">/ {isDe ? 'dauerhaft kostenlos' : 'forever free'}</span>
                </div>
                <ul className="space-y-3 text-xs text-[#384C42] mb-8">
                  <li className="flex items-center">✓ {isDe ? 'Bis zu 3 Unternehmen überwachen' : 'Monitor up to 3 companies'}</li>
                  <li className="flex items-center">✓ {isDe ? 'Täglicher Registerstatus-Abgleich' : 'Daily registry status sync'}</li>
                  <li className="flex items-center">✓ {isDe ? 'Grundlegende Insolvenzprüfung' : 'Basic insolvency checks'}</li>
                  <li className="flex items-center">✓ {isDe ? 'E-Mail-Warnung bei Verfahrenseröffnung' : 'Email alerts upon filing'}</li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-full text-xs font-bold text-[#0F2922] bg-[#E8F1EC] hover:bg-[#D9EADE] border border-[#BFDFCE] transition-colors"
              >
                {isDe ? 'Kostenlos starten' : 'Get Started Free'}
              </Link>
            </div>

            {/* Pro Tier (Featured / Highlighting Fullscript green) */}
            <div className="bg-[#0F2922] text-white rounded-3xl p-8 border-2 border-[#34D399] shadow-xl relative flex flex-col justify-between transform md:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#34D399] text-[#0F2922] text-[10px] font-black uppercase px-4 py-1 rounded-full tracking-wider shadow-xs">
                {isDe ? 'Beliebteste Wahl' : 'Most Popular'}
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-white mb-1">Pro Sentinel</h3>
                <p className="text-xs text-[#A1C2B2] mb-6">
                  {isDe ? 'Für Geschäftsführer, Agenturen & Berater' : 'For founders, agencies & suppliers'}
                </p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold font-mono text-white">
                    € {isAnnual ? '24' : '29'}
                  </span>
                  <span className="text-xs text-[#A1C2B2] ml-2">/ {isDe ? 'Monat (zzgl. MwSt.)' : 'month (+ VAT)'}</span>
                </div>
                <ul className="space-y-3 text-xs text-[#D1DDD7] mb-8">
                  <li className="flex items-center">✓ <strong>{isDe ? 'Bis zu 25 Unternehmen' : 'Up to 25 companies'}</strong></li>
                  <li className="flex items-center">✓ {isDe ? 'Täglicher 07:00 Uhr Eil-Scan aller Justizportale' : 'Daily 7:00 AM rush court scan'}</li>
                  <li className="flex items-center">✓ {isDe ? '4-Ebenen Due Diligence Dossiers (unbegrenzt)' : 'Full 4-layer due diligence dossiers'}</li>
                  <li className="flex items-center">✓ {isDe ? 'Geschäftsführer-Wechsel & Phoenix-Detection' : 'Director change & Phoenix detection'}</li>
                  <li className="flex items-center">✓ {isDe ? '1-Klick PDF-Export für Wirtschaftsprüfer' : '1-click audit-proof PDF export'}</li>
                  <li className="flex items-center">✓ {isDe ? 'EU-USt VIES- & XETRA-Börsenkurse' : 'EU VAT VIES & stock ticker monitoring'}</li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-full text-xs font-bold text-[#0F2922] bg-[#34D399] hover:bg-[#6EE7B7] transition-all shadow-md"
              >
                {isDe ? 'Pro 14 Tage testen →' : 'Start 14-Day Pro Trial →'}
              </Link>
            </div>

            {/* Business / Kanzlei Tier */}
            <div className="bg-white rounded-3xl p-8 border border-[#DCE2D8] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#0F2922] mb-1">Kanzlei & Team</h3>
                <p className="text-xs text-[#5C7065] mb-6">
                  {isDe ? 'Für Steuerberater, Kanzleien & Mittelstand' : 'For CPAs, law firms & enterprise credit teams'}
                </p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold font-mono text-[#0F2922]">
                    € {isAnnual ? '65' : '79'}
                  </span>
                  <span className="text-xs text-[#5C7065] ml-2">/ {isDe ? 'Monat' : 'month'}</span>
                </div>
                <ul className="space-y-3 text-xs text-[#384C42] mb-8">
                  <li className="flex items-center">✓ <strong>{isDe ? 'Bis zu 100 Unternehmen' : 'Up to 100 companies'}</strong></li>
                  <li className="flex items-center">✓ {isDe ? 'CSV-Massenimport kompletter Mandantenlisten' : 'CSV bulk roster upload'}</li>
                  <li className="flex items-center">✓ {isDe ? 'Mehrbenutzer-Zugang (bis zu 5 Sitze)' : 'Multi-user seats (up to 5 team members)'}</li>
                  <li className="flex items-center">✓ {isDe ? 'DSGVO Art. 30 Audit-Log Export' : 'GDPR Article 30 audit logs'}</li>
                  <li className="flex items-center">✓ {isDe ? 'Dedizierter telefonischer Support' : 'Dedicated priority telephone support'}</li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-full text-xs font-bold text-white bg-[#0F2922] hover:bg-[#1A4237] transition-colors"
              >
                {isDe ? 'Kanzlei-Tarif wählen' : 'Choose Team Plan'}
              </Link>
            </div>

          </div>

          {/* Institutional Banking Callout */}
          <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-[#DCE2D8] max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold text-[#14533C] bg-[#E8F3EE] px-2.5 py-0.5 rounded-full border border-[#C6E2D5] uppercase tracking-wider">
                {isDe ? 'Enterprise & Banken-Schnittstelle' : 'Institutional & Banking API'}
              </span>
              <h4 className="text-lg font-bold font-serif text-[#0F2922] mt-2 mb-1">
                {isDe ? 'Sparkassen, Volksbanken & Factoring-Institute' : 'Savings Banks, Lenders & Factoring Platforms'}
              </h4>
              <p className="text-xs text-[#556960] max-w-2xl">
                {isDe 
                  ? 'Maßgeschneiderte Rahmenverträge für mehr als 1.000 bis 20.000 überwachte Kreditnehmer, dedizierte REST-API mit signierten Webhooks und BaFin MaRisk Compliance-Dokumentation.'
                  : 'Custom volume licenses for 1,000 to 20,000+ borrowers, dedicated REST APIs with signed webhooks, and BaFin MaRisk documentation.'}
              </p>
            </div>
            <a
              href="mailto:enterprise@insolvenz-waechter.de"
              className="inline-flex items-center px-6 py-3 rounded-full text-xs font-bold text-[#0F2922] bg-[#E8F1EC] hover:bg-[#D9EADE] border border-[#BFDFCE] shrink-0 transition-colors"
            >
              {isDe ? 'Enterprise anfragen →' : 'Contact Enterprise →'}
            </a>
          </div>

        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
      <section id="faq" className="py-20 bg-[#FBFBF9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#E8F3EE] text-[#14533C] border border-[#C6E2D5] mb-3">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2922] font-serif tracking-tight mb-3">
              {isDe ? 'Häufig gestellte Fragen' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-sm text-[#4E6157]">
              {isDe ? 'Alles, was Sie über Datenquellen, Rechtssicherheit und Früherkennung wissen müssen.' : 'Everything you need to know about data sources, legality, and early warnings.'}
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                qDe: 'Woher bezieht Insolvenz-Wächter die Daten und wie aktuell sind sie?',
                qEn: 'Where does Insolvenz-Wächter source its data and how fresh is it?',
                aDe: 'Unsere Daten stammen direkt aus den amtlichen deutschen Registern: allen 150+ dezentralen Amtsgerichten (Handelsregister A und B), dem gemeinsamen Justizportal des Bundes und der Länder (Insolvenzbekanntmachungen.de) sowie dem amtlichen Bundesanzeiger (Unternehmensregister). Unsere Engine führt täglich um 07:00 Uhr morgens vollautomatisierte Scans durch.',
                aEn: 'Our data is ingested directly from official German federal portals: all 150+ decentralized commercial registry courts (Handelsregister A & B), the Joint Justice Portal (Insolvenzbekanntmachungen.de), and the Federal Gazette. Our automated crawler executes daily at 07:00 AM.',
              },
              {
                qDe: 'Wie kann Insolvenz-Wächter eine Krise bis zu 90 Tage früher erkennen?',
                qEn: 'How can Insolvenz-Wächter detect distress up to 90 days earlier?',
                aDe: 'Bevor ein offizieller Insolvenzantrag registriert wird, zeigen Firmen typische Vorzeichen im Handelsregister: plötzliche Amtsniederlegungen von Geschäftsführern, Verzug bei der gesetzlichen Hinterlegung von Jahresabschlüssen (> 12 bis 18 Monate Überfälligkeit), Reduzierungen des Stammkapitals oder Vorab-Sanierungsnotizen nach StaRUG. Insolvenz-Wächter aggregiert diese Signale in einem algorithmischen Risikoscore.',
                aEn: 'Before formal insolvency is published, companies exhibit typical precursor signals in court records: abrupt managing director resignations, statutory balance sheet publication delays exceeding 12 to 18 months, capital reductions, or preliminary restructuring notices under StaRUG. Our engine correlates these into a quantitative risk index.',
              },
              {
                qDe: 'Schützt mich das Due Diligence Dossier vor Insolvenzanfechtungen (§ 133 InsO)?',
                qEn: 'Does the Due Diligence Dossier protect against insolvency contestations (§ 133 InsO)?',
                aDe: 'Ja, das Dossier bietet entscheidende Entlastungsbeweise. Nach § 133 InsO versuchen Insolvenzverwalter oft zu behaupten, ein Gläubiger hätte von der Zahlungsunfähigkeit gewusst. Wenn Sie nachweisen können, dass Sie vor Vertragsschluss ein amtliches Insolvenz-Wächter Audit mit digitalem Zeitstempel archiviert haben, das den Status "Keine negativen Einträge" belegt, entkräften Sie den Vorwurf grober Fahrlässigkeit.',
                aEn: 'Yes, the dossier provides essential compliance evidence. Under § 133 InsO, bankruptcy administrators routinely attempt clawbacks claiming trade creditors "must have suspected" distress. Archiving a certified, timestamped Insolvenz-Wächter Dossier showing clean court records proves professional diligence and defeats bad-faith allegations.',
              },
              {
                qDe: 'Ist die Nutzung DSGVO-konform?',
                qEn: 'Is the platform GDPR / DSGVO compliant?',
                aDe: 'Zu 100%. Unsere Server stehen in Frankfurt am Main (Deutschland). Wir verarbeiten ausschließlich öffentlich zugängliche amtliche Handelsregister- und Justizbekanntmachungen gemäß den strengen europäischen Datenschutzrichtlinien. Enterprise-Kunden erhalten standardmäßig eine Auftragsverarbeitungsvereinbarung (AVV nach Art. 28 DSGVO).',
                aEn: '100% compliant. Our server infrastructure is located in Frankfurt am Main, Germany. We strictly process public statutory registry records and judicial gazettes under European data privacy laws. We provide GDPR Article 28 DPAs for enterprise clients.',
              },
              {
                qDe: 'Kann ich meinen Tarif jederzeit kündigen?',
                qEn: 'Can I cancel my subscription anytime?',
                aDe: 'Ja. Bei monatlicher Zahlweise können Sie Ihren Tarif mit einem einzigen Klick im Dashboard zum Monatsende kündigen. Es gibt keine versteckten Mindestvertragslaufzeiten.',
                aEn: 'Yes. With monthly billing, you can cancel your subscription with a single click in your dashboard at any time. There are no multi-year lock-in clauses.',
              },
            ].map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#DCE2D8] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full py-4 px-6 text-left flex justify-between items-center text-sm sm:text-base font-bold text-[#0F2922] focus:outline-hidden"
                  >
                    <span>{isDe ? faq.qDe : faq.qEn}</span>
                    <span className="ml-4 w-6 h-6 rounded-full bg-[#F4F6F2] flex items-center justify-center text-xs font-mono text-[#556960] shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-[#4E6157] leading-relaxed border-t border-[#F0F3ED] pt-3">
                      {isDe ? faq.aDe : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 11. FINAL HIGH-CONVERTING HERO CTA BANNER */}
      <section className="py-20 bg-[#0F2922] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#1A4537] blur-3xl opacity-50 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#184639] text-[#34D399] border border-[#276452] mb-4">
            {isDe ? 'Insolvenz-Schutz ohne Risiko' : 'Risk-Free Sentinel Protection'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-white mb-6">
            {isDe 
              ? 'Schützen Sie Ihre offenen Forderungen noch heute vor dem nächsten Zahlungsausfall.'
              : 'Protect your open receivables before the next counterparty default.'}
          </h2>
          <p className="text-sm sm:text-base text-[#BFD4CB] max-w-2xl mx-auto mb-8 leading-relaxed">
            {isDe 
              ? 'Starten Sie mit 3 Unternehmen dauerhaft kostenlos. Keine Kreditkarte erforderlich. Einrichtung in weniger als 60 Sekunden.'
              : 'Start monitoring 3 companies free forever. No credit card required. Setup takes under 60 seconds.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-bold text-[#0F2922] bg-[#34D399] hover:bg-[#6EE7B7] shadow-lg hover:shadow-xl transition-all"
            >
              <span>{isDe ? 'Jetzt 3 Firmen kostenlos überwachen' : 'Monitor 3 Companies Free Now'}</span>
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-colors"
            >
              {isDe ? 'Bereits Kunde? Zum Login' : 'Existing Customer? Login'}
            </Link>
          </div>
          <div className="mt-8 text-xs text-[#8FB7A4] flex items-center justify-center space-x-6">
            <span>✓ {isDe ? 'Keine Kreditkarte nötig' : 'No credit card needed'}</span>
            <span>✓ {isDe ? 'Server in Frankfurt' : 'Frankfurt Server'}</span>
            <span>✓ {isDe ? 'Täglicher Justiz-Scan' : 'Daily Court Sync'}</span>
          </div>
        </div>
      </section>

    </div>
  );
}

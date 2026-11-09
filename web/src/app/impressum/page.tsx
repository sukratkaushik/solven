import Link from 'next/link';

export const metadata = {
  title: 'Impressum | Insolvenz-Wächter',
  description: 'Gesetzliche Anbieterkennzeichnung gemäß § 5 Digitale-Dienste-Gesetz (DDG)',
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm">
        <Link href="/dashboard" className="text-xs font-bold text-blue-600 hover:underline mb-6 inline-block">
          ← Zurück zum Dashboard
        </Link>

        <h1 className="text-2xl font-black text-slate-900 mb-6">Impressum</h1>
        <p className="text-xs text-slate-500 mb-8">Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)</p>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">Diensteanbieter</h2>
            <p>Insolvenz-Wächter B2B Intelligence</p>
            <p>Musterstraße 123</p>
            <p>60311 Frankfurt am Main, Deutschland</p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">Kontakt</h2>
            <p>E-Mail: kontakt@insolvenz-waechter.de</p>
            <p>Internet: https://insolvenz-waechter.de</p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">Umsatzsteuer-ID</h2>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: DE 123 456 789 (in Gründung)</p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>Sukrat Kaushik</p>
            <p>Musterstraße 123, 60311 Frankfurt am Main</p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">Haftung für Inhalte und amtliche Registerdaten</h2>
            <p className="text-xs text-slate-600">
              Die im System bereitgestellten Insolvenz- und Registerdaten stammen aus amtlichen Veröffentlichungen der Justizportale der Länder sowie des Handelsregisters. Trotz sorgfältiger und täglicher automatisierter Abfrage wird keine Haftung für die Richtigkeit, Vollständigkeit oder Aktualität der amtlichen Primärdaten übernommen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

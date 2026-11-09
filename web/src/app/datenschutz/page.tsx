import Link from 'next/link';

export const metadata = {
  title: 'Datenschutzerklärung | Insolvenz-Wächter',
  description: 'DSGVO-konforme Datenschutzerklärung mit Datenverarbeitung in Frankfurt am Main (Deutschland)',
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm">
        <Link href="/dashboard" className="text-xs font-bold text-blue-600 hover:underline mb-6 inline-block">
          ← Zurück zum Dashboard
        </Link>

        <h1 className="text-2xl font-black text-slate-900 mb-2">Datenschutzerklärung</h1>
        <p className="text-xs text-slate-500 mb-8">Stand: Oktober 2026 • Gemäß Art. 13, 14 DSGVO</p>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
              🇩🇪 Deutscher Serverstandort & DSGVO-Garantie
            </h3>
            <p className="text-xs text-emerald-800">
              Alle Kundendaten, Watchlists und Firmenabfragen werden ausschließlich im ISO-27001-zertifizierten Google Cloud Rechenzentrum in <strong>Frankfurt am Main (Region europe-west3, Deutschland)</strong> gespeichert und verarbeitet.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">1. Verantwortliche Stelle</h2>
            <p>Insolvenz-Wächter B2B Intelligence, E-Mail: datenschutz@insolvenz-waechter.de</p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">2. Erhebung und Speicherung personenbezogener Daten</h2>
            <p>
              Beim Besuch unserer Website und bei Registrierung erheben wir folgende Daten:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-600">
              <li>E-Mail-Adresse und Passwort-Hash (zur Authentifizierung)</li>
              <li>Vom Nutzer zusammengestellte Watchlist überwachter Unternehmen</li>
              <li>Abrechnungs- und Transaktionsdaten (übermittelt an unseren Zahlungsdienstleister Stripe)</li>
              <li>Server-Logfiles (IP-Adresse anonymisiert, Zugriffszeitpunkt, User-Agent)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">3. Zahlungsabwicklung über Stripe</h2>
            <p className="text-xs text-slate-600">
              Zahlungen werden über die Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublin 2, Irland abgewickelt. Ihre Zahlungsdaten (z.B. Kreditkartennummer oder IBAN) werden verschlüsselt direkt an Stripe übertragen und nicht auf unseren Servern gespeichert.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">4. Ihre Rechte</h2>
            <p className="text-xs text-slate-600">
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung (Art. 15 DSGVO) sowie ein Recht auf Berichtigung (Art. 16 DSGVO) oder Löschung (Art. 17 DSGVO).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

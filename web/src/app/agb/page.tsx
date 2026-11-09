import Link from 'next/link';

export const metadata = {
  title: 'AGB | Insolvenz-Wächter',
  description: 'Allgemeine Geschäftsbedingungen für B2B-Abonnements von Insolvenz-Wächter',
};

export default function AgbPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm">
        <Link href="/dashboard" className="text-xs font-bold text-blue-600 hover:underline mb-6 inline-block">
          ← Zurück zum Dashboard
        </Link>

        <h1 className="text-2xl font-black text-slate-900 mb-2">Allgemeine Geschäftsbedingungen (AGB)</h1>
        <p className="text-xs text-slate-500 mb-8">B2B SaaS-Nutzungsvertrag • Stand: Oktober 2026</p>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">§ 1 Geltungsbereich</h2>
            <p className="text-xs text-slate-600">
              Diese Geschäftsbedingungen gelten für alle Verträge zwischen Insolvenz-Wächter und Unternehmern (§ 14 BGB), juristischen Personen des öffentlichen Rechts oder öffentlich-rechtlichen Sondervermögen über die Bereitstellung des Frühwarn- und Firmenüberwachungsdienstes.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">§ 2 Leistungsumfang & Verfügbarkeit</h2>
            <p className="text-xs text-slate-600">
              Insolvenz-Wächter bietet eine automatisierte Abfrage öffentlich zugänglicher Register- und Justizdaten (u.a. Insolvenzbekanntmachungen, Handelsregister). Der Dienst strebt eine jährliche Verfügbarkeit von 99,5% an.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">§ 3 Vergütung & Zahlungsbedingungen</h2>
            <p className="text-xs text-slate-600">
              Abonnementgebühren (z.B. Pro: 29 € / Monat zzgl. MwSt.) werden im Voraus monatlich über den gewählten Zahlungsdienstleister (Kreditkarte oder SEPA-Lastschrift) fällig.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">§ 4 Laufzeit & Kündigung</h2>
            <p className="text-xs text-slate-600">
              Das monatliche Abonnement ist jederzeit zum Ende des jeweiligen monatlichen Abrechnungszeitraums über das Self-Service-Kundenportal mit einem Klick kündbar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

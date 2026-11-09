// =========================================================================
// Insolvenz-Wächter Transactional Email Engine (Resend API)
// =========================================================================

interface SendAlertEmailParams {
  to: string;
  companyName: string;
  courtName: string;
  caseNumber: string;
  filingType: string;
  dossierUrl: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY is not configured. Email logged to console:');
    console.log(`[To: ${to}] Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Insolvenz-Wächter <warnung@insolvenz-waechter.de>',
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend API error:', err);
      return { success: false, error: err };
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

/**
 * High-priority German insolvency court filing alert
 */
export async function sendInsolvencyAlertEmail({
  to,
  companyName,
  courtName,
  caseNumber,
  filingType,
  dossierUrl,
}: SendAlertEmailParams) {
  const subject = `🚨 WICHTIG: Insolvenzbekanntmachung zu ${companyName} (${caseNumber})`;

  const html = `
    <!DOCTYPE html>
    <html lang="de">
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="background-color: #991b1b; padding: 20px 24px; color: #ffffff;">
          <h1 style="margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.02em;">Insolvenz-Wächter Eilmeldung</h1>
          <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Automatische Justiz-Überwachung nach §§ 9, 10 InsO</p>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 15px; color: #1e293b; margin: 0 0 16px 0;">
            Sehr geehrte Damen und Herren,
          </p>
          <p style="font-size: 14px; color: #334155; line-height: 1.5; margin: 0 0 20px 0;">
            für ein von Ihnen überwachtes Unternehmen wurde soeben ein amtlicher Justizeintrag im Register für Insolvenzbekanntmachungen veröffentlicht:
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Unternehmen:</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: 700;">${companyName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Zuständiges Gericht:</td>
              <td style="padding: 10px 0; color: #0f172a;">${courtName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Aktenzeichen:</td>
              <td style="padding: 10px 0; color: #991b1b; font-weight: 700; font-family: monospace;">${caseNumber}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Verfahrensart:</td>
              <td style="padding: 10px 0; color: #0f172a;">${filingType}</td>
            </tr>
          </table>

          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px; margin-bottom: 24px;">
            <strong style="color: #991b1b; font-size: 13px; display: block; margin-bottom: 4px;">Empfohlene Handlungsschritte:</strong>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #7f1d1d; line-height: 1.5;">
              <li>Offene Forderungen & Fälligkeiten sofort saldieren</li>
              <li>Ausstehende Lieferungen & Leistungsphasen prüfen</li>
              <li>Forderungsanmeldung beim vorläufigen Insolvenzverwalter vorbereiten</li>
            </ul>
          </div>

          <a href="${dossierUrl}" style="display: inline-block; background-color: #1d4ed8; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; text-align: center;">
            Vollständiges Prüfdossier öffnen →
          </a>
        </div>
        <div style="background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
          Insolvenz-Wächter B2B Risk Sentinel • Datenstand: Bundesweite Justizportale der 16 Bundesländer
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

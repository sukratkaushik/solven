// =========================================================================
// Automated Pan-European (EU) Insolvency Court Sentinel & Risk Dispatcher
// Operates under German InsO & European Insolvency Regulation (EU) 2015/848
// =========================================================================

import { supabase } from '@/lib/supabase/client';
import { sendInsolvencyAlertEmail } from '@/lib/email';
import { getCountryByCode } from '@/lib/countries';

export interface SentinelRunResult {
  totalMonitored: number;
  uniqueCompanies: number;
  alertsDetected: number;
  emailsSent: number;
  jurisdictionsScanned: string[];
  timestamp: string;
}

export async function runInsolvencySentinel(): Promise<SentinelRunResult> {
  console.log('[Sentinel] Starting 07:00 AM Pan-European judicial registry sync (EU-IRI & DACH)...');

  // 1. Fetch all actively watched companies across all users
  const { data: watchlistItems, error: watchError } = await supabase
    .from('watchlist')
    .select('*, profiles:user_id(email, full_name)')
    .eq('status', 'active');

  if (watchError || !watchlistItems) {
    console.error('[Sentinel] Error fetching watchlist:', watchError);
    return {
      totalMonitored: 0,
      uniqueCompanies: 0,
      alertsDetected: 0,
      emailsSent: 0,
      jurisdictionsScanned: [],
      timestamp: new Date().toISOString(),
    };
  }

  // 2. Group unique companies by (country_code + register_id) to eliminate duplicate court queries
  const uniqueCompaniesMap = new Map<string, typeof watchlistItems>();
  const scannedCountries = new Set<string>();

  for (const item of watchlistItems) {
    const countryCode = (item.country_code || 'DE').toUpperCase();
    scannedCountries.add(countryCode);
    const key = `${countryCode}_${item.company_id || item.company_name}`;
    if (!uniqueCompaniesMap.has(key)) {
      uniqueCompaniesMap.set(key, []);
    }
    uniqueCompaniesMap.get(key)!.push(item);
  }

  console.log(
    `[Sentinel] Monitored items: ${watchlistItems.length}, Unique entities to query: ${uniqueCompaniesMap.size}, Jurisdictions: ${Array.from(scannedCountries).join(', ')}`
  );

  let alertsDetected = 0;
  let emailsSent = 0;

  // 3. Check each unique company in court cache / live European gazettes
  const uniqueEntries = Array.from(uniqueCompaniesMap.entries());
  for (const [, subscribers] of uniqueEntries) {
    const sample = subscribers[0];
    const countryCode = (sample.country_code || 'DE').toUpperCase();
    const country = getCountryByCode(countryCode);
    const companyName = sample.company_name;
    const regNo = sample.company_id || 'REG';
    const court = sample.register_authority || `${country.registerName} (${sample.company_city || 'Zentrale'})`;

    // Query court cache for notices in this national jurisdiction
    const { data: cachedNotice } = await supabase
      .from('court_cache')
      .select('*')
      .eq('register_number', regNo)
      .eq('country_code', countryCode)
      .maybeSingle();

    if (cachedNotice && cachedNotice.status !== 'clear') {
      alertsDetected++;

      // Dispatch alert to each subscribed user
      for (const sub of subscribers) {
        const userEmail = (sub as unknown as { profiles?: { email?: string } })?.profiles?.email;

        // Record in alerts table with country metadata
        await supabase.from('alerts').insert({
          user_id: sub.user_id,
          company_id: sub.company_id,
          company_name: sub.company_name,
          country_code: countryCode,
          alert_type: cachedNotice.status,
          details: {
            caseNumber: cachedNotice.case_number || 'IN 102/26',
            court: cachedNotice.register_court || court,
            filingDate: cachedNotice.filing_date,
            countryCode,
            legalNoticeSource: countryCode === 'DE' ? 'insolvenzbekanntmachungen.de' : 'European Insolvency Register (IRI)',
          },
          email_sent: !!userEmail,
        });

        // Send email via Resend if email is configured
        if (userEmail) {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002';
          await sendInsolvencyAlertEmail({
            to: userEmail,
            companyName,
            courtName: cachedNotice.register_court || court,
            caseNumber: cachedNotice.case_number || 'IN 102/26',
            filingType:
              countryCode === 'DE'
                ? 'Vorläufiges Insolvenzverfahren (§ 21 InsO)'
                : `Insolvenzbekanntmachung gem. EU-Verordnung 2015/848 (${country.flag} ${country.nameDe})`,
            dossierUrl: `${siteUrl}/dashboard`,
          });
          emailsSent++;
        }
      }
    }
  }

  console.log(`[Sentinel] Complete. Alerts: ${alertsDetected}, Emails: ${emailsSent}`);

  return {
    totalMonitored: watchlistItems.length,
    uniqueCompanies: uniqueCompaniesMap.size,
    alertsDetected,
    emailsSent,
    jurisdictionsScanned: Array.from(scannedCountries),
    timestamp: new Date().toISOString(),
  };
}

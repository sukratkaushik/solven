import { NextResponse } from 'next/server';
import { getCountryByCode } from '@/lib/countries';

interface EUCompanySeed {
  name: string;
  city: string;
  legal_form: string;
  reg_number: string;
  court: string;
  vat_id: string;
}

const PAN_EU_DIRECTORY: Record<string, EUCompanySeed[]> = {
  DE: [
    { name: 'Global Foods Trading GmbH', city: 'Biebesheim am Rhein', legal_form: 'GmbH', reg_number: 'HRB 54602', court: 'Amtsgericht Darmstadt', vat_id: 'DE195744889' },
    { name: 'SAP SE', city: 'Walldorf', legal_form: 'SE', reg_number: 'HRB 719915', court: 'Amtsgericht Mannheim', vat_id: 'DE143454363' },
    { name: 'Siemens AG', city: 'München', legal_form: 'AG', reg_number: 'HRB 6684', court: 'Amtsgericht München', vat_id: 'DE129274202' },
    { name: 'Volkswagen AG', city: 'Wolfsburg', legal_form: 'AG', reg_number: 'HRB 100484', court: 'Amtsgericht Braunschweig', vat_id: 'DE115235683' },
    { name: 'BMW AG', city: 'München', legal_form: 'AG', reg_number: 'HRB 42243', court: 'Amtsgericht München', vat_id: 'DE129273398' },
    { name: 'Mercedes-Benz Group AG', city: 'Stuttgart', legal_form: 'AG', reg_number: 'HRB 19360', court: 'Amtsgericht Stuttgart', vat_id: 'DE812526315' },
    { name: 'Robert Bosch GmbH', city: 'Stuttgart', legal_form: 'GmbH', reg_number: 'HRB 14000', court: 'Amtsgericht Stuttgart', vat_id: 'DE147849646' },
    { name: 'BASF SE', city: 'Ludwigshafen', legal_form: 'SE', reg_number: 'HRB 61512', court: 'Amtsgericht Ludwigshafen', vat_id: 'DE149255280' },
    { name: 'Allianz SE', city: 'München', legal_form: 'SE', reg_number: 'HRB 164232', court: 'Amtsgericht München', vat_id: 'DE129274113' },
    { name: 'Deutsche Telekom AG', city: 'Bonn', legal_form: 'AG', reg_number: 'HRB 6794', court: 'Amtsgericht Bonn', vat_id: 'DE122265412' },
    { name: 'Deutsche Post AG (DHL Group)', city: 'Bonn', legal_form: 'AG', reg_number: 'HRB 6792', court: 'Amtsgericht Bonn', vat_id: 'DE169838187' },
    { name: 'Bayer AG', city: 'Leverkusen', legal_form: 'AG', reg_number: 'HRB 48248', court: 'Amtsgericht Köln', vat_id: 'DE123659859' },
    { name: 'Adidas AG', city: 'Herzogenaurach', legal_form: 'AG', reg_number: 'HRB 3868', court: 'Amtsgericht Fürth', vat_id: 'DE132490588' },
    { name: 'Lufthansa AG', city: 'Köln', legal_form: 'AG', reg_number: 'HRB 2168', court: 'Amtsgericht Köln', vat_id: 'DE122652565' },
  ],
  AT: [
    { name: 'Red Bull GmbH', city: 'Fuschl am See', legal_form: 'GmbH', reg_number: 'FN 56249 v', court: 'Landesgericht Salzburg', vat_id: 'ATU33864707' },
    { name: 'Erste Group Bank AG', city: 'Wien', legal_form: 'AG', reg_number: 'FN 33209 m', court: 'Handelsgericht Wien', vat_id: 'ATU16310403' },
    { name: 'voestalpine AG', city: 'Linz', legal_form: 'AG', reg_number: 'FN 66209 t', court: 'Landesgericht Linz', vat_id: 'ATU36919100' },
    { name: 'OMV Aktiengesellschaft', city: 'Wien', legal_form: 'AG', reg_number: 'FN 93363 z', court: 'Handelsgericht Wien', vat_id: 'ATU14210606' },
    { name: 'Verbund AG', city: 'Wien', legal_form: 'AG', reg_number: 'FN 76023 z', court: 'Handelsgericht Wien', vat_id: 'ATU14703908' },
    { name: 'Raiffeisen Bank International AG', city: 'Wien', legal_form: 'AG', reg_number: 'FN 122119 m', court: 'Handelsgericht Wien', vat_id: 'ATU57531200' },
  ],
  CH: [
    { name: 'Nestlé S.A.', city: 'Vevey', legal_form: 'S.A.', reg_number: 'CHE-105.843.834', court: 'Registre du Commerce Vaud', vat_id: 'CHE-105.843.834 MWST' },
    { name: 'Novartis AG', city: 'Basel', legal_form: 'AG', reg_number: 'CHE-106.057.284', court: 'Handelsregisteramt Basel-Stadt', vat_id: 'CHE-106.057.284 MWST' },
    { name: 'Roche Holding AG', city: 'Basel', legal_form: 'AG', reg_number: 'CHE-103.964.073', court: 'Handelsregisteramt Basel-Stadt', vat_id: 'CHE-103.964.073 MWST' },
    { name: 'UBS Group AG', city: 'Zürich', legal_form: 'AG', reg_number: 'CHE-395.345.923', court: 'Handelsregisteramt Zürich', vat_id: 'CHE-395.345.923 MWST' },
    { name: 'ABB Ltd', city: 'Zürich', legal_form: 'AG', reg_number: 'CHE-101.049.653', court: 'Handelsregisteramt Zürich', vat_id: 'CHE-101.049.653 MWST' },
  ],
  NL: [
    { name: 'ASML Holding N.V.', city: 'Veldhoven', legal_form: 'N.V.', reg_number: 'KVK 17085892', court: 'Kamer van Koophandel Oost-Brabant', vat_id: 'NL803738548B01' },
    { name: 'Heineken N.V.', city: 'Amsterdam', legal_form: 'N.V.', reg_number: 'KVK 33011433', court: 'Kamer van Koophandel Amsterdam', vat_id: 'NL001627446B01' },
    { name: 'ING Groep N.V.', city: 'Amsterdam', legal_form: 'N.V.', reg_number: 'KVK 33231073', court: 'Kamer van Koophandel Amsterdam', vat_id: 'NL008581958B01' },
    { name: 'Philips N.V.', city: 'Amsterdam', legal_form: 'N.V.', reg_number: 'KVK 17001910', court: 'Kamer van Koophandel Amsterdam', vat_id: 'NL002242130B01' },
    { name: 'Adyen N.V.', city: 'Amsterdam', legal_form: 'N.V.', reg_number: 'KVK 34259528', court: 'Kamer van Koophandel Amsterdam', vat_id: 'NL817112001B01' },
  ],
  FR: [
    { name: 'TotalEnergies SE', city: 'Courbevoie', legal_form: 'SE', reg_number: 'RCS Nanterre 542 051 180', court: 'Tribunal de Commerce de Nanterre', vat_id: 'FR59542051180' },
    { name: 'LVMH Moët Hennessy Louis Vuitton SE', city: 'Paris', legal_form: 'SE', reg_number: 'RCS Paris 775 670 417', court: 'Tribunal de Commerce de Paris', vat_id: 'FR00775670417' },
    { name: 'Airbus SE', city: 'Toulouse', legal_form: 'SE', reg_number: 'RCS Toulouse 383 474 814', court: 'Tribunal de Commerce de Toulouse', vat_id: 'FR08383474814' },
    { name: 'BNP Paribas S.A.', city: 'Paris', legal_form: 'S.A.', reg_number: 'RCS Paris 662 042 449', court: 'Tribunal de Commerce de Paris', vat_id: 'FR76662042449' },
    { name: 'Sanofi S.A.', city: 'Paris', legal_form: 'S.A.', reg_number: 'RCS Paris 395 030 844', court: 'Tribunal de Commerce de Paris', vat_id: 'FR82395030844' },
  ],
  IT: [
    { name: 'Eni S.p.A.', city: 'Roma', legal_form: 'S.p.A.', reg_number: 'REA RM-381903', court: 'Camera di Commercio di Roma', vat_id: 'IT00484960588' },
    { name: 'Enel S.p.A.', city: 'Roma', legal_form: 'S.p.A.', reg_number: 'REA RM-158445', court: 'Camera di Commercio di Roma', vat_id: 'IT00934061003' },
    { name: 'Ferrari N.V. / S.p.A.', city: 'Maranello', legal_form: 'S.p.A.', reg_number: 'REA MO-288219', court: 'Camera di Commercio di Modena', vat_id: 'IT00159560366' },
    { name: 'Intesa Sanpaolo S.p.A.', city: 'Torino', legal_form: 'S.p.A.', reg_number: 'REA TO-1025531', court: 'Camera di Commercio di Torino', vat_id: 'IT00799960158' },
  ],
  ES: [
    { name: 'Inditex S.A. (Zara)', city: 'Arteixo (A Coruña)', legal_form: 'S.A.', reg_number: 'Tomo 1891, Folio 1, Hoja C-17988', court: 'Registro Mercantil de A Coruña', vat_id: 'ESA15075062' },
    { name: 'Banco Santander S.A.', city: 'Santander', legal_form: 'S.A.', reg_number: 'Tomo 404, Folio 1, Hoja 1010', court: 'Registro Mercantil de Cantabria', vat_id: 'ESA39000013' },
    { name: 'Iberdrola S.A.', city: 'Bilbao', legal_form: 'S.A.', reg_number: 'Tomo 17, Folio 114, Hoja 901', court: 'Registro Mercantil de Bizkaia', vat_id: 'ESA48010114' },
    { name: 'Telefónica S.A.', city: 'Madrid', legal_form: 'S.A.', reg_number: 'Tomo 124, Folio 15, Hoja M-2731', court: 'Registro Mercantil de Madrid', vat_id: 'ESA28015865' },
  ],
  PL: [
    { name: 'Orlen S.A.', city: 'Płock', legal_form: 'S.A.', reg_number: 'KRS 0000028860', court: 'Sąd Rejonowy dla m.st. Warszawy', vat_id: 'PL7740001454' },
    { name: 'PKO Bank Polski S.A.', city: 'Warszawa', legal_form: 'S.A.', reg_number: 'KRS 0000026438', court: 'Sąd Rejonowy dla m.st. Warszawy', vat_id: 'PL5250007983' },
  ],
  BE: [
    { name: 'Anheuser-Busch InBev SA/NV', city: 'Leuven', legal_form: 'SA/NV', reg_number: 'KBO 0417.497.106', court: 'Ondernemingsrechtbank Leuven', vat_id: 'BE0417497106' },
    { name: 'KBC Group NV', city: 'Brussel', legal_form: 'NV', reg_number: 'KBO 0403.227.515', court: 'Ondernemingsrechtbank Brussel', vat_id: 'BE0403227515' },
  ],
  SE: [
    { name: 'Volvo AB', city: 'Göteborg', legal_form: 'AB', reg_number: 'Org.nr 556012-5790', court: 'Bolagsverket Sundsvall', vat_id: 'SE556012579001' },
    { name: 'Spotify AB', city: 'Stockholm', legal_form: 'AB', reg_number: 'Org.nr 556703-7485', court: 'Bolagsverket Sundsvall', vat_id: 'SE556703748501' },
  ],
  DK: [
    { name: 'Novo Nordisk A/S', city: 'Bagsværd', legal_form: 'A/S', reg_number: 'CVR-nr 24256790', court: 'Erhvervsstyrelsen København', vat_id: 'DK24256790' },
    { name: 'A.P. Møller - Mærsk A/S', city: 'København', legal_form: 'A/S', reg_number: 'CVR-nr 22756214', court: 'Erhvervsstyrelsen København', vat_id: 'DK22756214' },
  ],
  LU: [
    { name: 'ArcelorMittal S.A.', city: 'Luxembourg', legal_form: 'S.A.', reg_number: 'RCS B82454', court: 'RCS Luxembourg', vat_id: 'LU15987995' },
  ],
  IE: [
    { name: 'Ryanair Holdings plc', city: 'Swords, Dublin', legal_form: 'plc', reg_number: 'CRO 249885', court: 'Companies Registration Office Dublin', vat_id: 'IE6300406R' },
  ],
};

interface RemoteOrg {
  id?: string;
  name?: string;
  company_name?: string;
  city?: string;
  address?: { city?: string };
  legal_form?: string;
  type?: string;
  registration?: { register_number?: string; court?: string };
  register_number?: string;
  company_id?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const countryParam = (searchParams.get('country') || 'DE').toUpperCase();

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: 'Query parameter "q" with at least 2 characters is required' }, { status: 400 });
  }

  const country = getCountryByCode(countryParam);
  const countryCode = country.code;
  const qLower = query.toLowerCase().trim();

  // 1. Attempt live query if DE and API key configured
  const apiKey = process.env.HANDELSREGISTER_API_KEY;
  let apiStatus: 'live' | 'credits_exhausted' | 'directory_only' | 'error' = 'directory_only';
  let warning: string | undefined;

  if (countryCode === 'DE' && apiKey && !apiKey.startsWith('demo_')) {
    try {
      const res = await fetch(`https://handelsregister.ai/api/v1/search-organizations?q=${encodeURIComponent(query)}&api_key=${apiKey}`, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        const results = Array.isArray(data) ? data : data.data || data.results || data.organizations || [];
        if (results.length > 0) {
          const mapped = results.map((c: RemoteOrg) => ({
            id: c.registration?.register_number || c.register_number || c.company_id || String(c.id || ''),
            name: c.name || c.company_name || query,
            city: c.address?.city || c.city || 'Deutschland',
            legal_form: c.legal_form || c.type || '',
            country_code: 'DE',
            register_authority: c.registration?.court || 'Handelsregister (Amtsgericht)',
          }));
          return NextResponse.json({
            data: mapped,
            country: countryCode,
            apiStatus: 'live',
            source: 'handelsregister.ai (Live)',
          });
        }
        apiStatus = 'live';
      } else if (res.status === 402) {
        apiStatus = 'credits_exhausted';
        warning = 'Live Handelsregister API credits exhausted (0 remaining). Showing verified directory entries only.';
      } else {
        apiStatus = 'error';
        warning = `Live Handelsregister API returned status ${res.status}. Showing verified directory entries only.`;
      }
    } catch {
      apiStatus = 'error';
      warning = 'Live Handelsregister API unreachable. Showing verified directory entries only.';
    }
  }

  // 2. Query verified directory for selected country (never fabricate fake companies)
  const directory = PAN_EU_DIRECTORY[countryCode] || [];
  const matches = directory.filter(
    (c) => c.name.toLowerCase().includes(qLower) || c.city.toLowerCase().includes(qLower) || c.reg_number.toLowerCase().includes(qLower)
  );

  const finalResults = matches.map((c) => ({
    id: c.reg_number,
    name: c.name,
    city: c.city,
    legal_form: c.legal_form,
    country_code: countryCode,
    register_authority: c.court,
    vat_number: c.vat_id,
  }));

  return NextResponse.json({
    data: finalResults,
    country: countryCode,
    registry: country.registerName,
    apiStatus,
    warning,
    source: apiStatus === 'directory_only' ? 'Verified Pan-European Directory' : 'Directory Fallback',
  });
}

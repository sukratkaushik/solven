// =========================================================================
// Pan-European Country & Registry Configuration
// =========================================================================

export interface CountryConfig {
  code: string;
  name: string;
  nameDe: string;
  flag: string;
  registerName: string;
  currency: string;
  vatPrefix: string;
  sampleCompany: string;
}

export const SUPPORTED_COUNTRIES: CountryConfig[] = [
  {
    code: 'DE',
    name: 'Germany',
    nameDe: 'Deutschland',
    flag: '🇩🇪',
    registerName: 'Handelsregister (Amtsgericht)',
    currency: 'EUR',
    vatPrefix: 'DE',
    sampleCompany: 'SAP SE',
  },
  {
    code: 'AT',
    name: 'Austria',
    nameDe: 'Österreich',
    flag: '🇦🇹',
    registerName: 'Firmenbuch (Landesgericht)',
    currency: 'EUR',
    vatPrefix: 'ATU',
    sampleCompany: 'Red Bull GmbH',
  },
  {
    code: 'CH',
    name: 'Switzerland',
    nameDe: 'Schweiz',
    flag: '🇨🇭',
    registerName: 'Zefix / Handelsregisteramt',
    currency: 'CHF',
    vatPrefix: 'CHE',
    sampleCompany: 'Nestlé S.A.',
  },
  {
    code: 'NL',
    name: 'Netherlands',
    nameDe: 'Niederlande',
    flag: '🇳🇱',
    registerName: 'Kamer van Koophandel (KVK)',
    currency: 'EUR',
    vatPrefix: 'NL',
    sampleCompany: 'ASML Holding N.V.',
  },
  {
    code: 'FR',
    name: 'France',
    nameDe: 'Frankreich',
    flag: '🇫🇷',
    registerName: 'Infogreffe / RCS (Tribunal de Commerce)',
    currency: 'EUR',
    vatPrefix: 'FR',
    sampleCompany: 'TotalEnergies SE',
  },
  {
    code: 'IT',
    name: 'Italy',
    nameDe: 'Italien',
    flag: '🇮🇹',
    registerName: 'Registro delle Imprese (Camera di Commercio)',
    currency: 'EUR',
    vatPrefix: 'IT',
    sampleCompany: 'Eni S.p.A.',
  },
  {
    code: 'ES',
    name: 'Spain',
    nameDe: 'Spanien',
    flag: '🇪🇸',
    registerName: 'Registro Mercantil Central',
    currency: 'EUR',
    vatPrefix: 'ES',
    sampleCompany: 'Inditex S.A. (Zara)',
  },
  {
    code: 'PL',
    name: 'Poland',
    nameDe: 'Polen',
    flag: '🇵🇱',
    registerName: 'Krajowy Rejestr Sądowy (KRS)',
    currency: 'PLN',
    vatPrefix: 'PL',
    sampleCompany: 'Orlen S.A.',
  },
  {
    code: 'BE',
    name: 'Belgium',
    nameDe: 'Belgien',
    flag: '🇧🇪',
    registerName: 'Kruispuntbank van Ondernemingen (KBO/BCE)',
    currency: 'EUR',
    vatPrefix: 'BE',
    sampleCompany: 'Anheuser-Busch InBev',
  },
  {
    code: 'SE',
    name: 'Sweden',
    nameDe: 'Schweden',
    flag: '🇸🇪',
    registerName: 'Bolagsverket',
    currency: 'SEK',
    vatPrefix: 'SE',
    sampleCompany: 'Volvo AB',
  },
  {
    code: 'DK',
    name: 'Denmark',
    nameDe: 'Dänemark',
    flag: '🇩🇰',
    registerName: 'CVR-registret',
    currency: 'DKK',
    vatPrefix: 'DK',
    sampleCompany: 'Novo Nordisk A/S',
  },
  {
    code: 'LU',
    name: 'Luxembourg',
    nameDe: 'Luxemburg',
    flag: '🇱🇺',
    registerName: 'Registre de Commerce et des Sociétés (RCS)',
    currency: 'EUR',
    vatPrefix: 'LU',
    sampleCompany: 'ArcelorMittal S.A.',
  },
  {
    code: 'IE',
    name: 'Ireland',
    nameDe: 'Irland',
    flag: '🇮🇪',
    registerName: 'Companies Registration Office (CRO)',
    currency: 'EUR',
    vatPrefix: 'IE',
    sampleCompany: 'Ryanair Holdings plc',
  },
];

export function getCountryByCode(code: string = 'DE'): CountryConfig {
  const upper = (code || 'DE').toUpperCase();
  return SUPPORTED_COUNTRIES.find((c) => c.code === upper) || SUPPORTED_COUNTRIES[0];
}

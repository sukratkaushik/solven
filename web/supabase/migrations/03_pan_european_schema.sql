-- =========================================================================
-- Insolvenz-Wächter Pan-European (EU) Schema Migration (Migration 03)
-- Extends tables for full EU-27 + DACH coverage
-- =========================================================================

-- 1. Extend watchlist table with country and cross-border identifiers
ALTER TABLE public.watchlist
ADD COLUMN IF NOT EXISTS country_code VARCHAR(2) DEFAULT 'DE' NOT NULL,
ADD COLUMN IF NOT EXISTS vat_number TEXT,
ADD COLUMN IF NOT EXISTS register_authority TEXT,
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'EUR';

CREATE INDEX IF NOT EXISTS idx_watchlist_country ON public.watchlist(country_code);

-- 2. Extend court notice cache with country_code & European Interconnected Insolvency Register (IRI) fields
ALTER TABLE public.court_cache
ADD COLUMN IF NOT EXISTS country_code VARCHAR(2) DEFAULT 'DE' NOT NULL,
ADD COLUMN IF NOT EXISTS iri_notice_id TEXT,
ADD COLUMN IF NOT EXISTS cross_border_flag BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_court_cache_country ON public.court_cache(country_code);

-- 3. Extend alerts table with country_code
ALTER TABLE public.alerts
ADD COLUMN IF NOT EXISTS country_code VARCHAR(2) DEFAULT 'DE' NOT NULL;

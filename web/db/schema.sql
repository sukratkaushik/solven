-- =========================================================================
-- Solven / Insolvenz-Wächter: Native GCP Cloud SQL PostgreSQL Schema
-- Region: europe-west3 (Frankfurt am Main)
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Users & Subscription Profiles (supports Email/Password & Google OAuth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- NULL allowed for Google OAuth-only accounts
    google_sub TEXT UNIQUE,
    full_name TEXT,
    stripe_customer_id TEXT,
    subscription_status TEXT DEFAULT 'inactive',
    subscription_tier TEXT DEFAULT 'free',
    max_companies INTEGER DEFAULT 3,
    billing_interval TEXT DEFAULT 'month',
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Pan-European Watchlist
CREATE TABLE IF NOT EXISTS public.watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    company_name TEXT NOT NULL,
    company_id TEXT,
    company_city TEXT,
    legal_form TEXT,
    status TEXT DEFAULT 'active',
    country_code VARCHAR(2) DEFAULT 'DE' NOT NULL,
    vat_number TEXT,
    register_authority TEXT,
    currency VARCHAR(3) DEFAULT 'EUR',
    last_checked_at TIMESTAMP WITH TIME ZONE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON public.watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_country ON public.watchlist(country_code);

-- 3. Deduplicated Court Notice Cache (Germany + EU-IRI)
CREATE TABLE IF NOT EXISTS public.court_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    register_court TEXT NOT NULL,
    register_number TEXT NOT NULL,
    company_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'clear',
    filing_date DATE,
    case_number TEXT,
    country_code VARCHAR(2) DEFAULT 'DE' NOT NULL,
    iri_notice_id TEXT,
    cross_border_flag BOOLEAN DEFAULT FALSE,
    details JSONB DEFAULT '{}'::jsonb,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_court_register UNIQUE (register_court, register_number)
);

CREATE INDEX IF NOT EXISTS idx_court_cache_lookup ON public.court_cache(register_court, register_number);
CREATE INDEX IF NOT EXISTS idx_court_cache_country ON public.court_cache(country_code);

-- 4. Alerts Dispatch Log
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    company_id TEXT,
    company_name TEXT NOT NULL,
    country_code VARCHAR(2) DEFAULT 'DE' NOT NULL,
    alert_type TEXT NOT NULL,
    details JSONB,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    email_sent BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);

-- 5. Stripe Subscriptions Ledger
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT NOT NULL,
    status TEXT NOT NULL,
    price_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. DSGVO / GDPR Compliance Audit Log (Art. 30 DSGVO)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_company TEXT NOT NULL,
    ip_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

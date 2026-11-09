-- =========================================================================
-- Insolvenz-Wächter Enterprise Production Schema (Migration 02)
-- Compatible with Cloud SQL PostgreSQL (Frankfurt) & Supabase
-- =========================================================================

-- 1. Extend profiles with tier limits and billing details
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS max_companies INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS billing_interval TEXT DEFAULT 'month',
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- 2. Deduplicated Court Notice Cache
-- Stores the latest official court status from insolvenzbekanntmachungen.de
-- Shared across all users monitoring the same company to eliminate duplicate API requests
CREATE TABLE IF NOT EXISTS public.court_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    register_court TEXT NOT NULL,         -- e.g. "Mannheim"
    register_number TEXT NOT NULL,        -- e.g. "HRB 719915"
    company_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'clear', -- 'clear', 'preliminary_proceeding', 'insolvency_opened', 'dismissed'
    filing_date DATE,
    case_number TEXT,                     -- e.g. "IN 102/26"
    details JSONB DEFAULT '{}'::jsonb,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_court_register UNIQUE (register_court, register_number)
);

CREATE INDEX IF NOT EXISTS idx_court_cache_lookup ON public.court_cache(register_court, register_number);

-- 3. Stripe Invoices & Subscriptions Ledger
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT NOT NULL,
    status TEXT NOT NULL,                -- 'active', 'trialing', 'past_due', 'canceled'
    price_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions." ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- 4. DSGVO / GDPR Compliance Audit Log (Art. 30 DSGVO)
-- Records audit queries to satisfy institutional banking & legal compliance
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,                -- 'VIEW_DOSSIER', 'EXPORT_PDF', 'ADD_WATCHLIST'
    target_company TEXT NOT NULL,
    ip_hash TEXT,                        -- Anonymized IP hash
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit logs." ON public.audit_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON public.watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);

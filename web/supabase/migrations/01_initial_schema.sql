-- supabase/migrations/01_initial_schema.sql

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    stripe_customer_id TEXT,
    subscription_status TEXT DEFAULT 'inactive',
    subscription_tier TEXT DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile." ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile." ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);


-- Watchlist table
CREATE TABLE public.watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_name TEXT NOT NULL,
    company_id TEXT, -- Register number or internal ID
    company_city TEXT,
    legal_form TEXT,
    status TEXT DEFAULT 'active',
    last_checked_at TIMESTAMP WITH TIME ZONE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watchlist." ON public.watchlist
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own watchlist." ON public.watchlist
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlist." ON public.watchlist
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from own watchlist." ON public.watchlist
    FOR DELETE USING (auth.uid() = user_id);


-- Alerts table
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_id TEXT,
    company_name TEXT NOT NULL,
    alert_type TEXT NOT NULL,
    details JSONB,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    email_sent BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts." ON public.alerts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts." ON public.alerts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts." ON public.alerts
    FOR DELETE USING (auth.uid() = user_id);

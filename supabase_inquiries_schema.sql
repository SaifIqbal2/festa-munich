-- ==============================================================================
-- 🏛️ FESTA MUNICH — WHOLESALE RFQ & INQUIRIES DATABASE SCHEMA
-- 
-- HIDAYAT (INSTRUCTIONS):
-- 1. Supabase Dashboard kholain: https://supabase.com/dashboard/project/ufzsgtbaprwbpvlwxutt
-- 2. Left sidebar se "SQL Editor" par click karein
-- 3. "+ New Query" button dabayein
-- 4. Yeh poora SQL code paste karein aur green "Run" button dabayein
-- ==============================================================================

-- STEP 1: Inquiries / RFQ Table Create karein
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT,
    phone TEXT,
    product_title TEXT,
    quantity TEXT DEFAULT 'Wholesale MOQ',
    custom_specs TEXT,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- STEP 2: Row Level Security (RLS) Enable karein
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- STEP 3: Policies Create karein (Taake website se inquiry direct save ho sake aur Admin panel me nazar aye)
DROP POLICY IF EXISTS "Public Insert Inquiries" ON public.inquiries;
CREATE POLICY "Public Insert Inquiries" 
    ON public.inquiries 
    FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Inquiries" ON public.inquiries;
CREATE POLICY "Public Read Inquiries" 
    ON public.inquiries 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Public Update Inquiries" ON public.inquiries;
CREATE POLICY "Public Update Inquiries" 
    ON public.inquiries 
    FOR UPDATE 
    USING (true) 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public Delete Inquiries" ON public.inquiries;
CREATE POLICY "Public Delete Inquiries" 
    ON public.inquiries 
    FOR DELETE 
    USING (true);

-- STEP 4: High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);

-- ==============================================================================
-- ✅ MUBARAK HO! Ab apka RFQ & Quotation Inquiries system Supabase Cloud par 
-- 100% live connect ho chuka hai!
-- ==============================================================================

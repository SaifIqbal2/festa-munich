-- Festa Munich: Cart, Coupon and Gift Card repair migration
-- Safe to run on an existing Supabase project. No tables are dropped.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Required cart table
CREATE TABLE IF NOT EXISTS public.user_cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    image TEXT,
    material TEXT,
    selected_size TEXT,
    selected_color TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id, selected_size, selected_color)
);

-- Coupon table used by the admin panel and checkout
CREATE TABLE IF NOT EXISTS public.coupon_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    min_purchase_amount NUMERIC(10, 2),
    applicable_categories TEXT[],
    active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    usage_limit_per_user INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Gift card table used by the admin panel and checkout
CREATE TABLE IF NOT EXISTS public.gift_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    balance NUMERIC(10, 2) NOT NULL CHECK (balance >= 0),
    original_amount NUMERIC(10, 2) NOT NULL CHECK (original_amount >= 0),
    is_active BOOLEAN DEFAULT true,
    created_by_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    redeemed_by_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    redeemed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.user_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own cart" ON public.user_cart;
CREATE POLICY "Users can manage own cart"
ON public.user_cart
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Public read active coupons" ON public.coupon_codes;
CREATE POLICY "Public read active coupons"
ON public.coupon_codes
FOR SELECT
USING (active = true);

DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupon_codes;
CREATE POLICY "Admins can manage coupons"
ON public.coupon_codes
FOR ALL
TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Public read active gift cards" ON public.gift_cards;
CREATE POLICY "Public read active gift cards"
ON public.gift_cards
FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage gift cards" ON public.gift_cards;
CREATE POLICY "Admins can manage gift cards"
ON public.gift_cards
FOR ALL
TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_cart TO authenticated;
GRANT SELECT ON public.coupon_codes TO anon, authenticated;
GRANT SELECT ON public.gift_cards TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.coupon_codes TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gift_cards TO authenticated;

CREATE INDEX IF NOT EXISTS idx_user_cart_user_id ON public.user_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_codes_code ON public.coupon_codes(code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON public.gift_cards(code);

NOTIFY pgrst, 'reload schema';

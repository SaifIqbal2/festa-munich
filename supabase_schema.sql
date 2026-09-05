-- ==============================================================================
-- FESTA MUNICH - SUPABASE DATABASE SCHEMA
-- Execute this SQL script in your Supabase SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),
    images TEXT[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL,
    craftsmanship_details TEXT[] DEFAULT '{}',
    material TEXT NOT NULL,
    available_sizes TEXT[] DEFAULT '{"S", "M", "L", "XL", "XXL"}',
    colors TEXT[] DEFAULT '{"Black", "Cognac", "Espresso"}',
    stock INTEGER DEFAULT 15,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    badge TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT DEFAULT 'Cash on Delivery / Wire',
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    tracking_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Products (Public Read & Write for Demo/Admin)
CREATE POLICY "Public Read Products" 
ON public.products FOR SELECT 
USING (true);

CREATE POLICY "Public Insert/Update/Delete Products" 
ON public.products FOR ALL 
USING (true)
WITH CHECK (true);

-- 5. RLS Policies for Orders (Public Create & Read for Customer Tracking / Admin)
CREATE POLICY "Public Read Orders" 
ON public.orders FOR SELECT 
USING (true);

CREATE POLICY "Public Insert Orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update Orders" 
ON public.orders FOR UPDATE 
USING (true)
WITH CHECK (true);

-- 6. Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

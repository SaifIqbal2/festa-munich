-- ==============================================================================
-- 🚀 FESTA MUNICH — PERMANENT FIX FOR 409 DELETE CONFLICT
-- 
-- INSTRUCTIONS:
-- 1. Supabase Dashboard kholain: https://supabase.com/dashboard/project/ufzsgtbaprwbpvlwxutt
-- 2. Left menu se "SQL Editor" par click karein
-- 3. Neeche diya gaya poora code paste karein aur green "RUN" button dabayein
-- ==============================================================================

-- STEP 1: order_items table mein product_id ko nullable banayein
ALTER TABLE public.order_items 
  ALTER COLUMN product_id DROP NOT NULL;

-- STEP 2: Purana foreign key constraint hatayein (jo delete hone se rokta tha)
ALTER TABLE public.order_items 
  DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- STEP 3: Naya foreign key lagayein with ON DELETE SET NULL
-- Is se product hamesha delete hoga, aur purane order receipts bhi safe rahenge!
ALTER TABLE public.order_items 
  ADD CONSTRAINT order_items_product_id_fkey 
  FOREIGN KEY (product_id) 
  REFERENCES public.products(id) 
  ON DELETE SET NULL;

-- STEP 4: Baqi tables (reviews, wishlists, cart) mein bhi CASCADE delete enable karein
ALTER TABLE IF EXISTS public.reviews 
  DROP CONSTRAINT IF EXISTS reviews_product_id_fkey;
ALTER TABLE IF EXISTS public.reviews 
  ADD CONSTRAINT reviews_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.wishlists 
  DROP CONSTRAINT IF EXISTS wishlists_product_id_fkey;
ALTER TABLE IF EXISTS public.wishlists 
  ADD CONSTRAINT wishlists_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.cart 
  DROP CONSTRAINT IF EXISTS cart_product_id_fkey;
ALTER TABLE IF EXISTS public.cart 
  ADD CONSTRAINT cart_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

-- STEP 5: Soft-delete column (is_active) bhi add kar lein safety ke liye
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

UPDATE public.products 
  SET is_active = true 
  WHERE is_active IS NULL;

-- ==============================================================================
-- ✅ SUCCESS: Yeh run hone ke baad koi bhi product bina kisi 409 error ke 
-- direct delete ho jayega!
-- ==============================================================================

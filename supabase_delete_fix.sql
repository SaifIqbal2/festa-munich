-- ==============================================================================
-- FESTA MUNICH — Product Delete Fix
-- Run this in Supabase SQL Editor to permanently fix the 409 delete issue
-- ==============================================================================

-- OPTION 1 (Recommended): Add is_active column for soft delete support
-- (Run this if your products table doesn't have is_active column)
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing products to be active
UPDATE public.products SET is_active = true WHERE is_active IS NULL;

-- OPTION 2 (Optional): Fix the foreign key to allow CASCADE delete
-- This means deleting a product will also delete its order_items references
-- WARNING: This removes order history for deleted products!
-- Only run this if you want hard deletes to work:

-- ALTER TABLE public.order_items 
--   DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
-- ALTER TABLE public.order_items
--   ADD CONSTRAINT order_items_product_id_fkey 
--   FOREIGN KEY (product_id) REFERENCES public.products(id) 
--   ON DELETE SET NULL;  -- or ON DELETE CASCADE

-- OPTION 3: Make product_id nullable in order_items (safest for history)
-- ALTER TABLE public.order_items ALTER COLUMN product_id DROP NOT NULL;

-- ==============================================================================
-- After running OPTION 1, the app will use soft delete automatically:
-- - Products with order history → marked is_active=false (hidden from shop)
-- - Products without order history → permanently deleted
-- ==============================================================================

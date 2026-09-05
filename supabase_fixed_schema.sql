create extension if not exists pgcrypto;

-- Create tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  phone text,
  address text,
  city text,
  country text default 'Pakistan',
  postal_code text,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.user_cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  cart_items jsonb not null default '[]'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  order_number text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10,2) default 0,
  discount_applied numeric(10,2) default 0,
  total_amount numeric(10,2) not null,
  currency text default 'USD',
  payment_method text,
  status text default 'Pending',
  tracking_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create update trigger function
create or replace function public.update_modified_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create triggers
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.update_modified_column();

drop trigger if exists set_user_cart_updated_at on public.user_cart;
create trigger set_user_cart_updated_at
before update on public.user_cart
for each row execute function public.update_modified_column();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.update_modified_column();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.user_cart enable row level security;
alter table public.orders enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

drop policy if exists "Users can view own cart" on public.user_cart;
drop policy if exists "Users can insert own cart" on public.user_cart;
drop policy if exists "Users can update own cart" on public.user_cart;
drop policy if exists "Users can delete own cart" on public.user_cart;

drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Users can insert own orders" on public.orders;
drop policy if exists "Users can update own orders" on public.orders;

-- Profiles policies
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- User cart policies
create policy "Users can view own cart"
on public.user_cart
for select
using (auth.uid() = user_id);

create policy "Users can insert own cart"
on public.user_cart
for insert
with check (auth.uid() = user_id);

create policy "Users can update own cart"
on public.user_cart
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own cart"
on public.user_cart
for delete
using (auth.uid() = user_id);

-- Orders policies
create policy "Users can view own orders"
on public.orders
for select
using (auth.uid() = user_id);

create policy "Users can insert own orders"
on public.orders
for insert
with check (auth.uid() = user_id);

create policy "Users can update own orders"
on public.orders
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

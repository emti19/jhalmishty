-- Run this in the Supabase SQL Editor.
-- It creates the orders table used by checkout and the admin dashboard.

create table if not exists public.orders (
  id text primary key,
  items jsonb not null,
  shipping_address jsonb not null,
  payment_method text not null check (payment_method in ('cod', 'bkash', 'bank')),
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  shipping numeric(10, 2) not null default 0 check (shipping >= 0),
  tax numeric(10, 2) not null default 0 check (tax >= 0),
  total numeric(10, 2) not null check (total >= 0),
  status text not null default 'confirmed' check (
    status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
  ),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

create or replace function public.set_orders_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_orders_updated_at on public.orders;

create trigger trg_orders_updated_at
before update on public.orders
for each row
execute procedure public.set_orders_updated_at();

alter table public.orders enable row level security;

drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
on public.orders
for insert
to anon, authenticated
with check (true);

alter table public.orders
drop constraint if exists orders_payment_method_check;

alter table public.orders
add constraint orders_payment_method_check
check (payment_method in ('cod', 'bkash', 'bank'));

drop policy if exists "Authenticated users can view orders" on public.orders;
create policy "Authenticated users can view orders"
on public.orders
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can update orders" on public.orders;
create policy "Authenticated users can update orders"
on public.orders
for update
to authenticated
using (true)
with check (true);

-- Run this in the Supabase SQL Editor to add product discount support.

alter table public.products
add column if not exists discount_percent numeric(5, 2) not null default 0;

update public.products
set discount_percent = 0
where discount_percent is null;

alter table public.products
drop constraint if exists products_discount_percent_check;

alter table public.products
add constraint products_discount_percent_check
check (discount_percent >= 0 and discount_percent <= 100);

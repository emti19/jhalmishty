-- Run this in the Supabase SQL Editor.
-- It creates the homepage hero slider table, timestamp trigger,
-- public read access for the storefront, authenticated write access for admin,
-- and a public storage bucket for the uploaded slider images.

create table if not exists public.hero_slider_images (
  position smallint primary key check (position between 1 and 3),
  image_url text not null,
  storage_path text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_hero_slider_images_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_hero_slider_images_updated_at on public.hero_slider_images;

create trigger trg_hero_slider_images_updated_at
before update on public.hero_slider_images
for each row
execute procedure public.set_hero_slider_images_updated_at();

alter table public.hero_slider_images enable row level security;

drop policy if exists "Anyone can view hero slider images" on public.hero_slider_images;
create policy "Anyone can view hero slider images"
on public.hero_slider_images
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users can insert hero slider images" on public.hero_slider_images;
create policy "Authenticated users can insert hero slider images"
on public.hero_slider_images
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update hero slider images" on public.hero_slider_images;
create policy "Authenticated users can update hero slider images"
on public.hero_slider_images
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete hero slider images" on public.hero_slider_images;
create policy "Authenticated users can delete hero slider images"
on public.hero_slider_images
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('hero-slider-images', 'hero-slider-images', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public can view hero slider bucket images" on storage.objects;
create policy "Public can view hero slider bucket images"
on storage.objects
for select
to public
using (bucket_id = 'hero-slider-images');

drop policy if exists "Authenticated users can upload hero slider bucket images" on storage.objects;
create policy "Authenticated users can upload hero slider bucket images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'hero-slider-images');

drop policy if exists "Authenticated users can update hero slider bucket images" on storage.objects;
create policy "Authenticated users can update hero slider bucket images"
on storage.objects
for update
to authenticated
using (bucket_id = 'hero-slider-images')
with check (bucket_id = 'hero-slider-images');

drop policy if exists "Authenticated users can delete hero slider bucket images" on storage.objects;
create policy "Authenticated users can delete hero slider bucket images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'hero-slider-images');

import { supabase } from "../lib/supabase";
import type { HeroSlide, HeroSlidePosition } from "../types";

export const HERO_SLIDER_BUCKET = "hero-slider-images";
export const HERO_SLIDE_POSITIONS: HeroSlidePosition[] = [1, 2, 3];

type HeroSlideRow = {
  position: number;
  image_url: string;
  storage_path: string;
  updated_at?: string;
};

function isHeroSlidePosition(value: number): value is HeroSlidePosition {
  return value === 1 || value === 2 || value === 3;
}

function mapHeroSlideRow(row: HeroSlideRow): HeroSlide | null {
  if (!isHeroSlidePosition(row.position)) {
    return null;
  }

  return {
    position: row.position,
    imageUrl: row.image_url,
    storagePath: row.storage_path,
    updatedAt: row.updated_at,
  };
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await supabase
    .from("hero_slider_images")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as HeroSlideRow[])
    .map(mapHeroSlideRow)
    .filter((slide): slide is HeroSlide => slide !== null);
}

export async function upsertHeroSlides(slides: HeroSlide[]): Promise<HeroSlide[]> {
  const payload = slides.map((slide) => ({
    position: slide.position,
    image_url: slide.imageUrl,
    storage_path: slide.storagePath,
  }));

  const { data, error } = await supabase
    .from("hero_slider_images")
    .upsert(payload, { onConflict: "position" })
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as HeroSlideRow[])
    .map(mapHeroSlideRow)
    .filter((slide): slide is HeroSlide => slide !== null);
}

export async function uploadHeroSlideImage(
  file: File,
  position: HeroSlidePosition,
): Promise<Pick<HeroSlide, "imageUrl" | "storagePath">> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `slide-${position}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${fileExt}`;
  const storagePath = `slides/${fileName}`;

  const { error } = await supabase.storage
    .from(HERO_SLIDER_BUCKET)
    .upload(storagePath, file);

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(HERO_SLIDER_BUCKET).getPublicUrl(storagePath);

  return {
    imageUrl: publicUrl,
    storagePath,
  };
}

export async function deleteHeroSlideImage(storagePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(HERO_SLIDER_BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new Error(error.message);
  }
}

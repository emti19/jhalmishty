import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import {
  HERO_SLIDE_POSITIONS,
  deleteHeroSlideImage,
  upsertHeroSlides,
  uploadHeroSlideImage,
} from "../services/heroSliderService";
import type { HeroSlide, HeroSlidePosition } from "../types";

interface AdminSliderManagementProps {
  slides: HeroSlide[];
  loading: boolean;
  onSlidesSaved: (slides: HeroSlide[]) => void;
}

type SlideDraft = {
  file: File | null;
  previewUrl: string;
  existingUrl: string;
  storagePath: string;
};

type SlideDraftMap = Record<HeroSlidePosition, SlideDraft>;

function createDrafts(slides: HeroSlide[]): SlideDraftMap {
  const slidesByPosition = new Map(slides.map((slide) => [slide.position, slide]));

  return {
    1: {
      file: null,
      previewUrl: slidesByPosition.get(1)?.imageUrl ?? "",
      existingUrl: slidesByPosition.get(1)?.imageUrl ?? "",
      storagePath: slidesByPosition.get(1)?.storagePath ?? "",
    },
    2: {
      file: null,
      previewUrl: slidesByPosition.get(2)?.imageUrl ?? "",
      existingUrl: slidesByPosition.get(2)?.imageUrl ?? "",
      storagePath: slidesByPosition.get(2)?.storagePath ?? "",
    },
    3: {
      file: null,
      previewUrl: slidesByPosition.get(3)?.imageUrl ?? "",
      existingUrl: slidesByPosition.get(3)?.imageUrl ?? "",
      storagePath: slidesByPosition.get(3)?.storagePath ?? "",
    },
  };
}

function revokePreviewUrl(url: string) {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export function AdminSliderManagement({
  slides,
  loading,
  onSlidesSaved,
}: AdminSliderManagementProps) {
  const [drafts, setDrafts] = useState<SlideDraftMap>(() => createDrafts(slides));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const draftsRef = useRef(drafts);

  useEffect(() => {
    draftsRef.current = drafts;
  }, [drafts]);

  useEffect(() => {
    setDrafts((current) => {
      for (const position of HERO_SLIDE_POSITIONS) {
        revokePreviewUrl(current[position].previewUrl);
      }

      return createDrafts(slides);
    });
  }, [slides]);

  useEffect(() => {
    return () => {
      for (const position of HERO_SLIDE_POSITIONS) {
        revokePreviewUrl(draftsRef.current[position].previewUrl);
      }
    };
  }, []);

  const handleFileChange = (
    position: HeroSlidePosition,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");
    setDrafts((current) => {
      revokePreviewUrl(current[position].previewUrl);

      return {
        ...current,
        [position]: {
          ...current[position],
          file,
          previewUrl: URL.createObjectURL(file),
        },
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    const currentSlides = new Map(slides.map((slide) => [slide.position, slide]));
    const uploadedStoragePaths: string[] = [];
    const oldStoragePathsToDelete: string[] = [];

    try {
      const nextSlides: HeroSlide[] = [];

      for (const position of HERO_SLIDE_POSITIONS) {
        const draft = drafts[position];
        const existingSlide = currentSlides.get(position);

        if (draft.file) {
          const uploadedSlide = await uploadHeroSlideImage(draft.file, position);
          uploadedStoragePaths.push(uploadedSlide.storagePath);
          nextSlides.push({
            position,
            imageUrl: uploadedSlide.imageUrl,
            storagePath: uploadedSlide.storagePath,
          });

          if (
            existingSlide?.storagePath &&
            existingSlide.storagePath !== uploadedSlide.storagePath
          ) {
            oldStoragePathsToDelete.push(existingSlide.storagePath);
          }
        } else if (draft.existingUrl && draft.storagePath) {
          nextSlides.push({
            position,
            imageUrl: draft.existingUrl,
            storagePath: draft.storagePath,
            updatedAt: existingSlide?.updatedAt,
          });
        } else {
          throw new Error(`Please upload image ${position} before saving.`);
        }
      }

      const savedSlides = await upsertHeroSlides(nextSlides);
      await Promise.all(
        oldStoragePathsToDelete.map(async (storagePath) => {
          try {
            await deleteHeroSlideImage(storagePath);
          } catch (cleanupError) {
            console.error("Failed to delete old hero slider image:", cleanupError);
          }
        }),
      );

      onSlidesSaved(savedSlides);
      setSuccess("Hero slider images updated successfully.");
    } catch (saveError) {
      await Promise.all(
        uploadedStoragePaths.map(async (storagePath) => {
          try {
            await deleteHeroSlideImage(storagePath);
          } catch (cleanupError) {
            console.error("Failed to roll back uploaded hero slider image:", cleanupError);
          }
        }),
      );

      console.error("Failed to save hero slider:", saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Slider images could not be saved. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-lg">
      <div className="flex flex-col gap-3 border-b border-[#E5E7EB] pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#1A2E28]">
            Homepage Slider Images
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[#4a6b5f]">
            Upload exactly three hero images. These are stored in the
            `hero_slider_images` table, while the actual files live in the
            `hero-slider-images` storage bucket.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2F5D50] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#264d43] disabled:cursor-not-allowed disabled:bg-[#A8C686]"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Slider
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Save Slider Images
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center text-sm text-[#4a6b5f]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#2F5D50]" />
          Loading slider settings...
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {HERO_SLIDE_POSITIONS.map((position) => {
            const draft = drafts[position];
            const hasPreview = Boolean(draft.previewUrl);

            return (
              <div
                key={position}
                className="rounded-3xl border border-[#E5E7EB] bg-[#FAF7F2] p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1A2E28]">
                      Slide {position}
                    </p>
                    <p className="text-xs text-[#4a6b5f]">
                      Recommended landscape image
                    </p>
                  </div>
                  <span className="rounded-full bg-[#2F5D50]/10 px-3 py-1 text-xs font-semibold text-[#2F5D50]">
                    Position {position}
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#D1D5DB] bg-white">
                  {hasPreview ? (
                    <img
                      src={draft.previewUrl}
                      alt={`Hero slide ${position}`}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 w-full flex-col items-center justify-center bg-[#F8FAFC] text-[#94A3B8]">
                      <ImagePlus className="mb-3 h-8 w-8" />
                      <p className="text-sm font-medium">No image uploaded yet</p>
                    </div>
                  )}
                </div>

                <label className="mt-4 block text-sm font-medium text-[#334155]">
                  Upload image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileChange(position, event)}
                    disabled={saving}
                    className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#0F172A] file:mr-4 file:rounded-lg file:border-0 file:bg-[#2F5D50] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#264d43] focus:border-[#2F5D50] focus:outline-none"
                  />
                </label>

                {draft.file ? (
                  <p className="mt-2 text-sm text-[#2F5D50]">
                    Selected: {draft.file.name}
                  </p>
                ) : draft.existingUrl ? (
                  <p className="mt-2 text-sm text-[#4a6b5f]">
                    Current image is already saved in Supabase.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-[#B91C1C]">
                    This slide still needs an image.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

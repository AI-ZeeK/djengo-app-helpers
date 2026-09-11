export const ASSET_LISTING_IMAGE_SUBJECT = {
  EXTERIOR: "EXTERIOR",
  BEDROOM: "BEDROOM",
  BATHROOM: "BATHROOM",
  KITCHEN: "KITCHEN",
  LIVING_ROOM: "LIVING_ROOM",
  DINING_ROOM: "DINING_ROOM",
  BALCONY: "BALCONY",
  VIEW: "VIEW",
  AMENITY: "AMENITY",
  FLOOR_PLAN: "FLOOR_PLAN",
  OTHER: "OTHER",
} as const;

export type AssetListingImageSubject =
  (typeof ASSET_LISTING_IMAGE_SUBJECT)[keyof typeof ASSET_LISTING_IMAGE_SUBJECT];

export type AssetListingImageForm = {
  id: string;
  url: string;
  subject: AssetListingImageSubject | "";
  caption: string;
  is_thumbnail: boolean;
};

export const ASSET_LISTING_IMAGE_SUBJECT_LABELS: Record<
  AssetListingImageSubject,
  string
> = {
  EXTERIOR: "Exterior",
  BEDROOM: "Bedroom",
  BATHROOM: "Bathroom",
  KITCHEN: "Kitchen",
  LIVING_ROOM: "Living room",
  DINING_ROOM: "Dining room",
  BALCONY: "Balcony",
  VIEW: "View",
  AMENITY: "Amenity",
  FLOOR_PLAN: "Floor plan",
  OTHER: "Other",
};

export function emptyListingImage(
  partial?: Partial<AssetListingImageForm>,
): AssetListingImageForm {
  return {
    id: partial?.id ?? makeListingImageId(),
    url: partial?.url ?? "",
    subject: partial?.subject ?? "",
    caption: partial?.caption ?? "",
    is_thumbnail: partial?.is_thumbnail ?? false,
  };
}

export function makeListingImageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeSubject(value: unknown): AssetListingImageSubject | "" {
  const raw = String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
  if (!raw) return "";
  return raw in ASSET_LISTING_IMAGE_SUBJECT
    ? (raw as AssetListingImageSubject)
    : ASSET_LISTING_IMAGE_SUBJECT.OTHER;
}

export function parseListingImages(raw: unknown): AssetListingImageForm[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const url = String(row.url ?? "").trim();
      if (!url) return null;
      return emptyListingImage({
        id: String(row.id ?? makeListingImageId()),
        url,
        subject: normalizeSubject(row.subject),
        caption: typeof row.caption === "string" ? row.caption : "",
        is_thumbnail: !!row.is_thumbnail,
      });
    })
    .filter((item): item is AssetListingImageForm => item !== null);
}

export function serializeListingImages(
  images: AssetListingImageForm[],
): Array<Record<string, unknown>> {
  return images
    .filter((img) => img.url.trim())
    .map((img) => ({
      id: img.id || makeListingImageId(),
      url: img.url.trim(),
      ...(img.subject ? { subject: img.subject } : {}),
      ...(img.caption.trim() ? { caption: img.caption.trim() } : {}),
      ...(img.is_thumbnail ? { is_thumbnail: true } : {}),
    }));
}

/** Ensure exactly one thumbnail when images exist. */
export function normalizeListingImages(
  images: AssetListingImageForm[],
): AssetListingImageForm[] {
  if (!images.length) return [];
  const withUrls = images.filter((img) => img.url.trim());
  if (!withUrls.length) return [];
  const thumbIndex = withUrls.findIndex((img) => img.is_thumbnail);
  const index = thumbIndex >= 0 ? thumbIndex : 0;
  return withUrls.map((img, i) => ({
    ...img,
    is_thumbnail: i === index,
  }));
}

export function getListingThumbnailUrl(
  images: AssetListingImageForm[] | undefined,
): string | null {
  if (!images?.length) return null;
  const thumb = images.find((img) => img.is_thumbnail && img.url.trim());
  return thumb?.url.trim() || images.find((img) => img.url.trim())?.url || null;
}

export function listingImageSubjectLabel(
  subject: AssetListingImageSubject | "" | undefined,
): string {
  if (!subject) return "Photo";
  return ASSET_LISTING_IMAGE_SUBJECT_LABELS[subject] ?? "Photo";
}

export class FacilityListingMediaHelper {
  static readonly ASSET_LISTING_IMAGE_SUBJECT = ASSET_LISTING_IMAGE_SUBJECT;
  static readonly ASSET_LISTING_IMAGE_SUBJECT_LABELS =
    ASSET_LISTING_IMAGE_SUBJECT_LABELS;
  static emptyListingImage = emptyListingImage;
  static makeListingImageId = makeListingImageId;
  static parseListingImages = parseListingImages;
  static serializeListingImages = serializeListingImages;
  static normalizeListingImages = normalizeListingImages;
  static getListingThumbnailUrl = getListingThumbnailUrl;
  static listingImageSubjectLabel = listingImageSubjectLabel;
}


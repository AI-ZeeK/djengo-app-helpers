"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityListingMediaHelper = exports.ASSET_LISTING_IMAGE_SUBJECT_LABELS = exports.ASSET_LISTING_IMAGE_SUBJECT = void 0;
exports.emptyListingImage = emptyListingImage;
exports.makeListingImageId = makeListingImageId;
exports.parseListingImages = parseListingImages;
exports.serializeListingImages = serializeListingImages;
exports.normalizeListingImages = normalizeListingImages;
exports.getListingThumbnailUrl = getListingThumbnailUrl;
exports.listingImageSubjectLabel = listingImageSubjectLabel;
exports.ASSET_LISTING_IMAGE_SUBJECT = {
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
};
exports.ASSET_LISTING_IMAGE_SUBJECT_LABELS = {
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
function emptyListingImage(partial) {
    return {
        id: partial?.id ?? makeListingImageId(),
        url: partial?.url ?? "",
        subject: partial?.subject ?? "",
        caption: partial?.caption ?? "",
        is_thumbnail: partial?.is_thumbnail ?? false,
    };
}
function makeListingImageId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function normalizeSubject(value) {
    const raw = String(value ?? "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");
    if (!raw)
        return "";
    return raw in exports.ASSET_LISTING_IMAGE_SUBJECT
        ? raw
        : exports.ASSET_LISTING_IMAGE_SUBJECT.OTHER;
}
function parseListingImages(raw) {
    if (!Array.isArray(raw))
        return [];
    return raw
        .map((item) => {
        if (!item || typeof item !== "object")
            return null;
        const row = item;
        const url = String(row.url ?? "").trim();
        if (!url)
            return null;
        return emptyListingImage({
            id: String(row.id ?? makeListingImageId()),
            url,
            subject: normalizeSubject(row.subject),
            caption: typeof row.caption === "string" ? row.caption : "",
            is_thumbnail: !!row.is_thumbnail,
        });
    })
        .filter((item) => item !== null);
}
function serializeListingImages(images) {
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
function normalizeListingImages(images) {
    if (!images.length)
        return [];
    const withUrls = images.filter((img) => img.url.trim());
    if (!withUrls.length)
        return [];
    const thumbIndex = withUrls.findIndex((img) => img.is_thumbnail);
    const index = thumbIndex >= 0 ? thumbIndex : 0;
    return withUrls.map((img, i) => ({
        ...img,
        is_thumbnail: i === index,
    }));
}
function getListingThumbnailUrl(images) {
    if (!images?.length)
        return null;
    const thumb = images.find((img) => img.is_thumbnail && img.url.trim());
    return thumb?.url.trim() || images.find((img) => img.url.trim())?.url || null;
}
function listingImageSubjectLabel(subject) {
    if (!subject)
        return "Photo";
    return exports.ASSET_LISTING_IMAGE_SUBJECT_LABELS[subject] ?? "Photo";
}
class FacilityListingMediaHelper {
}
exports.FacilityListingMediaHelper = FacilityListingMediaHelper;
FacilityListingMediaHelper.ASSET_LISTING_IMAGE_SUBJECT = exports.ASSET_LISTING_IMAGE_SUBJECT;
FacilityListingMediaHelper.ASSET_LISTING_IMAGE_SUBJECT_LABELS = exports.ASSET_LISTING_IMAGE_SUBJECT_LABELS;
FacilityListingMediaHelper.emptyListingImage = emptyListingImage;
FacilityListingMediaHelper.makeListingImageId = makeListingImageId;
FacilityListingMediaHelper.parseListingImages = parseListingImages;
FacilityListingMediaHelper.serializeListingImages = serializeListingImages;
FacilityListingMediaHelper.normalizeListingImages = normalizeListingImages;
FacilityListingMediaHelper.getListingThumbnailUrl = getListingThumbnailUrl;
FacilityListingMediaHelper.listingImageSubjectLabel = listingImageSubjectLabel;
//# sourceMappingURL=facility-listing-media.js.map
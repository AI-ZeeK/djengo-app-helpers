export declare const ASSET_LISTING_IMAGE_SUBJECT: {
    readonly EXTERIOR: "EXTERIOR";
    readonly BEDROOM: "BEDROOM";
    readonly BATHROOM: "BATHROOM";
    readonly KITCHEN: "KITCHEN";
    readonly LIVING_ROOM: "LIVING_ROOM";
    readonly DINING_ROOM: "DINING_ROOM";
    readonly BALCONY: "BALCONY";
    readonly VIEW: "VIEW";
    readonly AMENITY: "AMENITY";
    readonly FLOOR_PLAN: "FLOOR_PLAN";
    readonly OTHER: "OTHER";
};
export type AssetListingImageSubject = (typeof ASSET_LISTING_IMAGE_SUBJECT)[keyof typeof ASSET_LISTING_IMAGE_SUBJECT];
export type AssetListingImageForm = {
    id: string;
    url: string;
    subject: AssetListingImageSubject | "";
    caption: string;
    is_thumbnail: boolean;
};
export declare const ASSET_LISTING_IMAGE_SUBJECT_LABELS: Record<AssetListingImageSubject, string>;
export declare function emptyListingImage(partial?: Partial<AssetListingImageForm>): AssetListingImageForm;
export declare function makeListingImageId(): string;
export declare function parseListingImages(raw: unknown): AssetListingImageForm[];
export declare function serializeListingImages(images: AssetListingImageForm[]): Array<Record<string, unknown>>;
/** Ensure exactly one thumbnail when images exist. */
export declare function normalizeListingImages(images: AssetListingImageForm[]): AssetListingImageForm[];
export declare function getListingThumbnailUrl(images: AssetListingImageForm[] | undefined): string | null;
export declare function listingImageSubjectLabel(subject: AssetListingImageSubject | "" | undefined): string;
export declare class FacilityListingMediaHelper {
    static readonly ASSET_LISTING_IMAGE_SUBJECT: {
        readonly EXTERIOR: "EXTERIOR";
        readonly BEDROOM: "BEDROOM";
        readonly BATHROOM: "BATHROOM";
        readonly KITCHEN: "KITCHEN";
        readonly LIVING_ROOM: "LIVING_ROOM";
        readonly DINING_ROOM: "DINING_ROOM";
        readonly BALCONY: "BALCONY";
        readonly VIEW: "VIEW";
        readonly AMENITY: "AMENITY";
        readonly FLOOR_PLAN: "FLOOR_PLAN";
        readonly OTHER: "OTHER";
    };
    static readonly ASSET_LISTING_IMAGE_SUBJECT_LABELS: Record<AssetListingImageSubject, string>;
    static emptyListingImage: typeof emptyListingImage;
    static makeListingImageId: typeof makeListingImageId;
    static parseListingImages: typeof parseListingImages;
    static serializeListingImages: typeof serializeListingImages;
    static normalizeListingImages: typeof normalizeListingImages;
    static getListingThumbnailUrl: typeof getListingThumbnailUrl;
    static listingImageSubjectLabel: typeof listingImageSubjectLabel;
}
//# sourceMappingURL=facility-listing-media.d.ts.map
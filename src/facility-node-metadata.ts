/** Physical size stored under `metadata_json.space` on facility nodes (metres). */
export type FacilityNodeSpaceMetrics = {
  /** Gross floor area (m²) */
  area_sq_m?: number;
  /** Net / usable area when different from gross (m²) */
  usable_area_sq_m?: number;
  length_m?: number;
  width_m?: number;
  /** Ceiling or clear height (m) */
  height_m?: number;
  volume_m3?: number;
  /** Display hint: `m` (default) or `ft` */
  measurement_unit?: "m" | "ft" | string;
};

/** Floor level stored under `metadata_json.floor` (hierarchy, not 2D grid). */
export type FacilityFloorMetadata = {
  floor_index: number;
  floor_label?: string;
};

/** Optional fields stored in facility_nodes.metadata_json */
export type FacilityNodeMetadata = {
  description?: string;
  space?: FacilityNodeSpaceMetrics;
  floor?: FacilityFloorMetadata;
  /** On-site operation — restaurant, bar, hotel, spa, … */
  operationKind?: string;
  /** Estate / unit public offer: monthly rent, lease, sale, Airbnb-style, or short stay. */
  listingOffer?: "RENT" | "LEASE" | "BUY" | "BNB" | "SHORT_STAY";
};

export const LISTING_OFFER_OPTIONS = [
  { id: "RENT", name: "Monthly rent" },
  { id: "LEASE", name: "Lease" },
  { id: "BUY", name: "For sale" },
  { id: "BNB", name: "Airbnb-style" },
  { id: "SHORT_STAY", name: "Short stay" },
] as const;

export type ListingOffer = (typeof LISTING_OFFER_OPTIONS)[number]["id"];

function normalizeListingOffer(
  value: unknown,
): ListingOffer | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim().toUpperCase();
  if (v === "AIRBNB") return "BNB";
  if (v === "SALE") return "BUY";
  if (v === "RENT" || v === "LEASE" || v === "BUY" || v === "BNB" || v === "SHORT_STAY")
    return v;
  return undefined;
}

function readPositiveNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }
  return value;
}

function parseFloorMetadata(raw: unknown): FacilityFloorMetadata | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const f = raw as Record<string, unknown>;
  const idx =
    typeof f.floor_index === "number"
      ? f.floor_index
      : typeof f.index === "number"
        ? f.index
        : null;
  if (idx == null || !Number.isFinite(idx) || idx < 0) return undefined;
  return {
    floor_index: Math.floor(idx),
    floor_label:
      typeof f.floor_label === "string"
        ? f.floor_label
        : typeof f.label === "string"
          ? f.label
          : undefined,
  };
}

function parseSpaceMetrics(raw: unknown): FacilityNodeSpaceMetrics | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const s = raw as Record<string, unknown>;
  const space: FacilityNodeSpaceMetrics = {
    area_sq_m: readPositiveNumber(s.area_sq_m),
    usable_area_sq_m: readPositiveNumber(s.usable_area_sq_m),
    length_m: readPositiveNumber(s.length_m),
    width_m: readPositiveNumber(s.width_m),
    height_m: readPositiveNumber(s.height_m),
    volume_m3: readPositiveNumber(s.volume_m3),
    measurement_unit:
      typeof s.measurement_unit === "string" ? s.measurement_unit : undefined,
  };
  const hasValue = Object.values(space).some((v) => v !== undefined);
  return hasValue ? space : undefined;
}

export function parseFacilityMetadata(
  metadataJson?: string | Record<string, unknown> | null,
): FacilityNodeMetadata {
  let parsed: Record<string, unknown> | null = null;
  if (metadataJson && typeof metadataJson === "object") {
    parsed = metadataJson as Record<string, unknown>;
  } else if (typeof metadataJson === "string" && metadataJson.trim()) {
    try {
      const value = JSON.parse(metadataJson) as unknown;
      if (value && typeof value === "object") {
        parsed = value as Record<string, unknown>;
      }
    } catch {
      return {};
    }
  }
  if (!parsed) return {};
  const description =
    typeof parsed.description === "string" ? parsed.description : undefined;
  const space = parseSpaceMetrics(parsed.space);
  const floor = parseFloorMetadata(parsed.floor);
  const operationKind =
    typeof parsed.operation_kind === "string"
      ? parsed.operation_kind
      : typeof parsed.operationKind === "string"
        ? parsed.operationKind
        : undefined;
  const listingOffer = normalizeListingOffer(
    parsed.listing_offer ?? parsed.listingOffer,
  );
  return { description, space, floor, operationKind, listingOffer };
}

export function getNodeDescription(node: {
  metadata_json?: string;
  description?: string;
}): string {
  if (node.description?.trim()) return node.description.trim();
  return parseFacilityMetadata(node.metadata_json).description?.trim() ?? "";
}

export function getNodeSpaceMetrics(node: {
  metadata_json?: string;
}): FacilityNodeSpaceMetrics | undefined {
  return parseFacilityMetadata(node.metadata_json).space;
}

/** Whether the node has any usable space / dimension metadata. */
export function hasNodeSpaceData(node: { metadata_json?: string }): boolean {
  const space = getNodeSpaceMetrics(node);
  if (!space) return false;
  return (
    (space.usable_area_sq_m ?? space.area_sq_m) != null ||
    (space.length_m != null && space.width_m != null) ||
    space.length_m != null ||
    space.width_m != null
  );
}

/**
 * Single positive size score for relative 3D scaling (≈ characteristic edge length in m).
 * Nodes without space data return `1` (neutral vs median).
 */
export function getNodeSpatialSizeMetric(node: {
  metadata_json?: string;
}): number {
  const space = getNodeSpaceMetrics(node);
  if (!space) return 1;

  const area = space.usable_area_sq_m ?? space.area_sq_m;
  if (area != null && area > 0) return Math.sqrt(area);

  if (space.length_m != null && space.width_m != null) {
    const lw = space.length_m * space.width_m;
    if (lw > 0) return Math.sqrt(lw);
  }
  if (space.length_m != null && space.length_m > 0) return space.length_m;
  if (space.width_m != null && space.width_m > 0) return space.width_m;

  return 1;
}

/** Primary area for display (usable preferred over gross). */
export function getNodeAreaSqM(node: {
  metadata_json?: string;
}): number | undefined {
  const space = getNodeSpaceMetrics(node);
  if (!space) return undefined;
  return space.usable_area_sq_m ?? space.area_sq_m;
}

/** Human-readable size summary for tables / inspector (empty when unset). */
export function formatNodeSpaceSummary(
  node: { metadata_json?: string },
  options?: { compact?: boolean },
): string {
  const space = getNodeSpaceMetrics(node);
  if (!space) return "";

  const parts: string[] = [];
  const area = space.usable_area_sq_m ?? space.area_sq_m;
  if (area != null) {
    parts.push(
      options?.compact ? `${area} m²` : `${area} m²${space.usable_area_sq_m ? " usable" : ""}`,
    );
  }

  if (space.length_m != null && space.width_m != null) {
    parts.push(`${space.length_m} × ${space.width_m} m`);
  } else if (space.length_m != null) {
    parts.push(`L ${space.length_m} m`);
  } else if (space.width_m != null) {
    parts.push(`W ${space.width_m} m`);
  }

  if (space.height_m != null) {
    parts.push(options?.compact ? `H ${space.height_m}m` : `height ${space.height_m} m`);
  }

  if (space.volume_m3 != null && !options?.compact) {
    parts.push(`${space.volume_m3} m³`);
  }

  return parts.join(options?.compact ? " · " : ", ");
}

export function buildMetadataJson(
  patch: FacilityNodeMetadata,
  existingJson?: string | null,
): string | undefined {
  const base = parseFacilityMetadata(existingJson);

  const description = patch.description?.trim();
  if (description) base.description = description;
  else if (patch.description === "") delete base.description;

  if (patch.space !== undefined) {
    const hasSpace =
      patch.space &&
      Object.values(patch.space).some(
        (v) => v !== undefined && v !== null && v !== "",
      );
    if (hasSpace) base.space = patch.space;
    else delete base.space;
  }

  if (patch.floor !== undefined) {
    if (
      patch.floor &&
      typeof patch.floor.floor_index === "number" &&
      patch.floor.floor_index >= 0
    ) {
      base.floor = {
        floor_index: Math.floor(patch.floor.floor_index),
        floor_label: patch.floor.floor_label?.trim() || undefined,
      };
    } else {
      delete base.floor;
    }
  }

  if (patch.operationKind !== undefined) {
    if (patch.operationKind?.trim()) base.operationKind = patch.operationKind.trim();
    else delete base.operationKind;
  }

  if (patch.listingOffer !== undefined) {
    if (patch.listingOffer) base.listingOffer = patch.listingOffer;
    else delete base.listingOffer;
  }

  const out: Record<string, unknown> = {};
  if (base.description?.trim()) out.description = base.description.trim();
  if (base.space) out.space = base.space;
  if (base.floor) out.floor = base.floor;
  if (base.operationKind) out.operation_kind = base.operationKind;
  if (base.listingOffer) out.listing_offer = base.listingOffer;

  if (Object.keys(out).length === 0) return undefined;
  return JSON.stringify(out);
}

export class FacilityNodeMetadataHelper {
  static readonly LISTING_OFFER_OPTIONS = LISTING_OFFER_OPTIONS;
  static parseFacilityMetadata = parseFacilityMetadata;
  static getNodeDescription = getNodeDescription;
  static getNodeSpaceMetrics = getNodeSpaceMetrics;
  static hasNodeSpaceData = hasNodeSpaceData;
  static getNodeSpatialSizeMetric = getNodeSpatialSizeMetric;
  static getNodeAreaSqM = getNodeAreaSqM;
  static formatNodeSpaceSummary = formatNodeSpaceSummary;
  static buildMetadataJson = buildMetadataJson;
}


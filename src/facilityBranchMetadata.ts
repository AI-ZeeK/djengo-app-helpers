import type { FacilityMode } from "./facility-enums";

export type OnSiteOperationKey =
  | "has_hotel"
  | "has_restaurant"
  | "has_bar"
  | "has_lounge"
  | "has_kitchen"
  | "has_spa"
  | "has_gym"
  | "has_pool"
  | "has_conference_rooms"
  | "has_supermarket"
  | "has_clinical";

export type FacilityOnSiteOperations = Record<OnSiteOperationKey, boolean> & {
  other?: string[];
};

export type FacilityOperationPolicy = {
  f_and_b_combined: boolean;
  lounge_shares_bar_staff: boolean;
  kitchen_shared: boolean;
  /** Amenities (gym, spa, pool, …) share this site instead of a separate location. */
  amenities_on_same_site?: boolean;
};

export type FacilityOccupancyAnchor = {
  /** Node type where stays are created (BED, ROOM, TABLE, …). */
  node_type: string;
};

export type PublicListingHospitalInfo = {
  has_emergency_department?: boolean;
  er_hours?: "24_7" | "SCHEDULED";
  accepts_ambulance?: boolean;
  specialties?: string[];
  public_phone?: string;
  public_phone_dial_code?: string;
};

export type PublicListingHospitalityInfo = {
  listing_style?: "HOTEL" | "SHORT_STAY" | "BNB";
};

export type PublicListingEstateInfo = {
  listing_style?: "RENTAL" | "SALE" | "MIXED" | "LEASE";
};

export type PublicListingMetadata = {
  is_listed?: boolean;
  tagline?: string;
  description?: string;
  /** Public browse card cover for this branch. */
  cover_image_url?: string | null;
  /** Branch operation kinds published to guest explore. */
  public_operation_kinds?: string[];
  hospital?: PublicListingHospitalInfo;
  hospitality?: PublicListingHospitalityInfo;
  estate?: PublicListingEstateInfo;
};

/** Node types that can hold occupancy / stays. */
export const OCCUPIABLE_NODE_TYPES = new Set([
  "BED",
  "ROOM",
  "TABLE",
  "CHAIR",
  "HOUSE",
  "UNIT",
  "SECTION",
]);

export function defaultOccupancyAnchorForMode(
  mode: FacilityMode | null | undefined,
): string {
  if (mode === "HOSPITAL") return "BED";
  if (mode === "RESTAURANT") return "TABLE";
  if (mode === "ESTATE") return "HOUSE";
  return "ROOM";
}

export function pickOccupancyAnchor(
  occupiableNodeTypes: string[],
  mode: FacilityMode | null | undefined,
  existing?: string | null,
): string {
  const preferred =
    existing?.trim() || defaultOccupancyAnchorForMode(mode);
  if (occupiableNodeTypes.includes(preferred)) return preferred;
  return occupiableNodeTypes[0] ?? preferred;
}

export type FacilityDiningMetadata = {
  occupancy_anchor?: FacilityOccupancyAnchor;
};

export type FacilityBranchProfileMetadata = {
  on_site_operations?: Partial<FacilityOnSiteOperations> & {
    other?: string[];
  };
  operation_policy?: Partial<FacilityOperationPolicy>;
  occupancy_policy?: unknown;
  occupancy_anchor?: FacilityOccupancyAnchor;
  /** F&B bookable leaf when dining hierarchy (or pure restaurant) is in use. */
  dining?: FacilityDiningMetadata;
  public_listing?: PublicListingMetadata;
};

/** True when branch needs a dining hierarchy (pure restaurant or hotel/estate + F&B ops). */
export function needsDiningHierarchy(
  mode: FacilityMode | null | undefined,
  ops?: Partial<FacilityOnSiteOperations> | null,
): boolean {
  if (mode === "RESTAURANT") return true;
  return Boolean(ops?.has_restaurant || ops?.has_bar);
}

/** Dining bookable leaf from metadata — defaults to TABLE. */
export function getDiningOccupancyAnchor(
  meta: FacilityBranchProfileMetadata | null | undefined,
): FacilityOccupancyAnchor {
  const fromDining = meta?.dining?.occupancy_anchor?.node_type?.trim();
  if (fromDining) {
    return { node_type: fromDining.toUpperCase() };
  }
  const fromPrimary = meta?.occupancy_anchor?.node_type?.trim()?.toUpperCase();
  if (fromPrimary === "TABLE" || fromPrimary === "CHAIR") {
    return { node_type: fromPrimary };
  }
  return { node_type: "TABLE" };
}

export const EMPTY_ON_SITE_OPERATIONS: FacilityOnSiteOperations = {
  has_hotel: false,
  has_restaurant: false,
  has_bar: false,
  has_lounge: false,
  has_kitchen: false,
  has_spa: false,
  has_gym: false,
  has_pool: false,
  has_conference_rooms: false,
  has_supermarket: false,
  has_clinical: false,
  other: [],
};

export const DEFAULT_OPERATION_POLICY: FacilityOperationPolicy = {
  f_and_b_combined: false,
  lounge_shares_bar_staff: false,
  kitchen_shared: true,
};

export function parsePublicListingMetadata(
  metadataJson?: string | null,
): PublicListingMetadata {
  return parseBranchProfileMetadata(metadataJson).public_listing ?? {};
}

export function mergePublicListingMetadata(
  existingJson: string | null | undefined,
  patch: PublicListingMetadata,
): string {
  const existing = parseBranchProfileMetadata(existingJson);
  return JSON.stringify({
    ...existing,
    public_listing: {
      ...existing.public_listing,
      ...patch,
    },
  });
}

export function parseBranchProfileMetadata(
  metadataJson?: string | null,
): FacilityBranchProfileMetadata {
  if (!metadataJson?.trim()) return {};
  try {
    return JSON.parse(metadataJson) as FacilityBranchProfileMetadata;
  } catch {
    return {};
  }
}

/** Restaurant / bar outlets imply a kitchen queue at the branch. */
const FOOD_SERVICE_KITCHEN_TRIGGERS: OnSiteOperationKey[] = [
  "has_restaurant",
  "has_bar",
];

export function ensureKitchenWithFoodService(
  ops: FacilityOnSiteOperations,
  mode?: FacilityMode | null,
): FacilityOnSiteOperations {
  if (!operationAllowedForFacilityMode(mode, "has_kitchen")) return ops;
  const needsKitchen = FOOD_SERVICE_KITCHEN_TRIGGERS.some((k) => ops[k]);
  if (needsKitchen && !ops.has_kitchen) {
    return { ...ops, has_kitchen: true };
  }
  return ops;
}

export function resolveOnSiteOperations(
  metadataJson?: string | null,
  facilityMode?: FacilityMode | null,
): FacilityOnSiteOperations {
  const meta = parseBranchProfileMetadata(metadataJson);
  const fromMeta = meta.on_site_operations ?? {};
  const merged: FacilityOnSiteOperations = {
    ...EMPTY_ON_SITE_OPERATIONS,
    ...fromMeta,
    other: fromMeta.other ?? [],
  };

  const hasAny = Object.entries(merged).some(
    ([k, v]) => k !== "other" && v === true,
  );

  const sanitized = sanitizeOperationsForMode(facilityMode, merged);
  const withKitchen = ensureKitchenWithFoodService(sanitized, facilityMode);
  if (hasAny || !facilityMode) return withKitchen;

  return ensureKitchenWithFoodService(
    suggestedOnSiteOperations(facilityMode),
    facilityMode,
  );
}

/** Drop operation flags that are not valid for this facility / company type. */
export function sanitizeOperationsForMode(
  mode: FacilityMode | null | undefined,
  ops: FacilityOnSiteOperations,
): FacilityOnSiteOperations {
  const allowed = new Set(allowedOperationsForFacilityMode(mode));
  const next: FacilityOnSiteOperations = { ...EMPTY_ON_SITE_OPERATIONS, other: ops.other ?? [] };
  if (!allowed.size) return next;
  allowed.forEach((key) => {
    next[key] = ops[key];
  });
  return next;
}

export function operationsHintForFacilityMode(
  mode: FacilityMode | null | undefined,
): string {
  switch (mode) {
    case "HOSPITALITY":
      return "Hotel — guest rooms, housekeeping, F&B outlets, and kitchen.";
    case "HOSPITAL":
      return "Clinical — wards, beds, and patient flow.";
    case "RESTAURANT":
      return "F&B — restaurant, bar, lounge, and kitchen.";
    case "ESTATE":
      return "Estate amenities — gym, pool, retail/supermarket, conference, and community spaces.";
    default:
      return "Operations available for your company type.";
  }
}

export function resolveOperationPolicy(
  metadataJson?: string | null,
): FacilityOperationPolicy {
  const meta = parseBranchProfileMetadata(metadataJson);
  return {
    ...DEFAULT_OPERATION_POLICY,
    ...meta.operation_policy,
  };
}

/** Suggested toggles when nothing is saved yet — not persisted until user saves. */
export function suggestedOnSiteOperations(
  mode: FacilityMode,
): FacilityOnSiteOperations {
  const base = { ...EMPTY_ON_SITE_OPERATIONS, other: [] as string[] };
  switch (mode) {
    case "HOSPITALITY":
      return { ...base, has_hotel: true };
    case "RESTAURANT":
      return { ...base, has_restaurant: true, has_kitchen: true };
    case "HOSPITAL":
      return { ...base, has_clinical: true };
    case "ESTATE":
      return base;
    default:
      return base;
  }
}

export function buildBranchProfileMetadataJson(options: {
  onSiteOperations: FacilityOnSiteOperations;
  operationPolicy: FacilityOperationPolicy;
  occupancyAnchor?: FacilityOccupancyAnchor | null;
  diningOccupancyAnchor?: FacilityOccupancyAnchor | null;
  existingJson?: string | null;
}): string {
  const existing = parseBranchProfileMetadata(options.existingJson);
  const ops = { ...options.onSiteOperations };
  const other = (ops.other ?? []).filter(Boolean);
  const payload: FacilityBranchProfileMetadata = {
    ...existing,
    on_site_operations: {
      has_hotel: ops.has_hotel,
      has_restaurant: ops.has_restaurant,
      has_bar: ops.has_bar,
      has_lounge: ops.has_lounge,
      has_kitchen: ops.has_kitchen,
      has_spa: ops.has_spa,
      has_gym: ops.has_gym,
      has_pool: ops.has_pool,
      has_conference_rooms: ops.has_conference_rooms,
      has_supermarket: ops.has_supermarket,
      has_clinical: ops.has_clinical,
      ...(other.length ? { other } : {}),
    },
    operation_policy: { ...options.operationPolicy },
  };
  if ("occupancyAnchor" in options) {
    if (options.occupancyAnchor?.node_type?.trim()) {
      payload.occupancy_anchor = {
        node_type: options.occupancyAnchor.node_type.trim().toUpperCase(),
      };
    } else {
      delete payload.occupancy_anchor;
    }
  }
  if ("diningOccupancyAnchor" in options) {
    const dining = { ...(payload.dining ?? {}) };
    if (options.diningOccupancyAnchor?.node_type?.trim()) {
      dining.occupancy_anchor = {
        node_type: options.diningOccupancyAnchor.node_type.trim().toUpperCase(),
      };
      payload.dining = dining;
    } else {
      delete dining.occupancy_anchor;
      if (Object.keys(dining).length === 0) {
        delete payload.dining;
      } else {
        payload.dining = dining;
      }
    }
  }
  return JSON.stringify(payload);
}

/** Operations a branch may declare for each facility / company layout type. */
export const OPERATIONS_BY_FACILITY_MODE: Record<
  Exclude<FacilityMode, "GENERAL">,
  OnSiteOperationKey[]
> = {
  HOSPITAL: ["has_clinical", "has_spa"],
  HOSPITALITY: [
    "has_hotel",
    "has_restaurant",
    "has_bar",
    "has_lounge",
    "has_kitchen",
    "has_spa",
    "has_gym",
    "has_pool",
  ],
  RESTAURANT: ["has_restaurant", "has_bar", "has_lounge", "has_kitchen"],
  ESTATE: [
    "has_gym",
    "has_pool",
    "has_spa",
    "has_supermarket",
    "has_conference_rooms",
  ],
};

export function allowedOperationsForFacilityMode(
  mode: FacilityMode | null | undefined,
): OnSiteOperationKey[] {
  if (!mode || mode === "GENERAL") return [];
  return OPERATIONS_BY_FACILITY_MODE[mode] ?? [];
}

export function operationAllowedForFacilityMode(
  mode: FacilityMode | null | undefined,
  key: OnSiteOperationKey,
): boolean {
  return allowedOperationsForFacilityMode(mode).includes(key);
}

export function countEnabledOperations(ops: FacilityOnSiteOperations): number {
  return (Object.keys(EMPTY_ON_SITE_OPERATIONS) as OnSiteOperationKey[]).filter(
    (k) => ops[k],
  ).length;
}

/** Map branch wizard facility toggles to on-site operations metadata. */
export function branchWizardTypeToOnSiteOperations(input: {
  has_hotel?: boolean;
  has_restaurant?: boolean;
  has_spa?: boolean;
  has_gym?: boolean;
  has_pool?: boolean;
  has_conference_rooms?: boolean;
  other_facilities?: string[];
}): FacilityOnSiteOperations {
  const ops: FacilityOnSiteOperations = {
    ...EMPTY_ON_SITE_OPERATIONS,
    has_hotel: !!input.has_hotel,
    has_restaurant: !!input.has_restaurant,
    has_spa: !!input.has_spa,
    has_gym: !!input.has_gym,
    has_pool: !!input.has_pool,
    has_conference_rooms: !!input.has_conference_rooms,
    other: (input.other_facilities ?? []).filter(Boolean),
  };
  return ensureKitchenWithFoodService(ops);
}

export class FacilityBranchMetadataHelper {
  static readonly OCCUPIABLE_NODE_TYPES = OCCUPIABLE_NODE_TYPES;
  static readonly EMPTY_ON_SITE_OPERATIONS = EMPTY_ON_SITE_OPERATIONS;
  static readonly DEFAULT_OPERATION_POLICY = DEFAULT_OPERATION_POLICY;
  static readonly OPERATIONS_BY_FACILITY_MODE = OPERATIONS_BY_FACILITY_MODE;
  static defaultOccupancyAnchorForMode = defaultOccupancyAnchorForMode;
  static pickOccupancyAnchor = pickOccupancyAnchor;
  static needsDiningHierarchy = needsDiningHierarchy;
  static getDiningOccupancyAnchor = getDiningOccupancyAnchor;
  static parsePublicListingMetadata = parsePublicListingMetadata;
  static mergePublicListingMetadata = mergePublicListingMetadata;
  static parseBranchProfileMetadata = parseBranchProfileMetadata;
  static ensureKitchenWithFoodService = ensureKitchenWithFoodService;
  static resolveOnSiteOperations = resolveOnSiteOperations;
  static sanitizeOperationsForMode = sanitizeOperationsForMode;
  static operationsHintForFacilityMode = operationsHintForFacilityMode;
  static resolveOperationPolicy = resolveOperationPolicy;
  static suggestedOnSiteOperations = suggestedOnSiteOperations;
  static buildBranchProfileMetadataJson = buildBranchProfileMetadataJson;
  static allowedOperationsForFacilityMode = allowedOperationsForFacilityMode;
  static operationAllowedForFacilityMode = operationAllowedForFacilityMode;
  static countEnabledOperations = countEnabledOperations;
  static branchWizardTypeToOnSiteOperations =
    branchWizardTypeToOnSiteOperations;
}


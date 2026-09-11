import {
  FACILITY_ASSET_KIND_ENUM,
  FACILITY_MODE_ENUM,
  FACILITY_NODE_TYPE_ENUM,
  type FacilityAssetKind,
  type FacilityMode,
  type FacilityNodeType,
} from "./facility-enums";

/** Node types that receive a 1:1 occupancy asset profile. */
export const OCCUPIABLE_FACILITY_NODE_TYPES: readonly FacilityNodeType[] = [
  FACILITY_NODE_TYPE_ENUM.BED,
  FACILITY_NODE_TYPE_ENUM.ROOM,
  FACILITY_NODE_TYPE_ENUM.TABLE,
  FACILITY_NODE_TYPE_ENUM.CHAIR,
  FACILITY_NODE_TYPE_ENUM.HOUSE,
  FACILITY_NODE_TYPE_ENUM.UNIT,
  FACILITY_NODE_TYPE_ENUM.SECTION,
] as const;

const NODE_TYPE_TO_ASSET_KIND: Partial<
  Record<FACILITY_NODE_TYPE_ENUM, FACILITY_ASSET_KIND_ENUM>
> = {
  [FACILITY_NODE_TYPE_ENUM.BED]: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_BED,
  [FACILITY_NODE_TYPE_ENUM.ROOM]: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_ROOM,
  [FACILITY_NODE_TYPE_ENUM.TABLE]: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_TABLE,
  [FACILITY_NODE_TYPE_ENUM.CHAIR]: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_CHAIR,
  [FACILITY_NODE_TYPE_ENUM.HOUSE]: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_HOUSE,
  [FACILITY_NODE_TYPE_ENUM.UNIT]: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_UNIT,
  [FACILITY_NODE_TYPE_ENUM.SECTION]: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_SECTION,
};

/** Proto FacilityAssetKind numeric values → string enum (facility.proto). */
const FACILITY_ASSET_KIND_BY_NUMBER: Record<number, FACILITY_ASSET_KIND_ENUM> =
  {
    0: FACILITY_ASSET_KIND_ENUM.FACILITY_ASSET_KIND_UNSPECIFIED,
    1: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_BED,
    2: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_ROOM,
    3: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_TABLE,
    4: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_HOUSE,
    5: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_UNIT,
    6: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_SECTION,
    7: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_CHAIR,
  };

/** Normalize API/proto asset kind (number, "1", ASSET_KIND_BED) to string enum. */
export function normalizeFacilityAssetKind(
  value: unknown,
): FACILITY_ASSET_KIND_ENUM | "" {
  if (value == null || value === "") return "";
  if (typeof value === "number" && Number.isFinite(value)) {
    return FACILITY_ASSET_KIND_BY_NUMBER[value] ?? "";
  }
  const raw = String(value).trim();
  const asNum = Number(raw);
  if (raw !== "" && !Number.isNaN(asNum) && String(asNum) === raw) {
    return FACILITY_ASSET_KIND_BY_NUMBER[asNum] ?? "";
  }
  return coerceEnumValue(FACILITY_ASSET_KIND_ENUM, raw, "");
}

export function isEnumMember<E extends Record<string, string>>(
  enumObj: E,
  value: unknown,
): value is E[keyof E] {
  if (value == null) return false;
  const s = String(value);
  return (Object.values(enumObj) as string[]).includes(s);
}

/** Parse unknown JSON value to an enum member, or return fallback (often ""). */
export function coerceEnumValue<E extends Record<string, string>>(
  enumObj: E,
  raw: unknown,
  fallback: E[keyof E] | "" = "",
): E[keyof E] | "" {
  if (raw == null || raw === "") return fallback;
  const s = String(raw).trim();
  return isEnumMember(enumObj, s) ? s : fallback;
}

export function nodeTypeToAssetKind(
  nodeType: string | undefined | null,
): FacilityAssetKind | null {
  if (!nodeType) return null;
  const kind = NODE_TYPE_TO_ASSET_KIND[nodeType as FACILITY_NODE_TYPE_ENUM];
  return (kind as FacilityAssetKind | undefined) ?? null;
}

export function isOccupiableFacilityNodeType(
  nodeType: string | undefined | null,
): nodeType is FacilityNodeType {
  if (!nodeType) return false;
  return (OCCUPIABLE_FACILITY_NODE_TYPES as readonly string[]).includes(nodeType);
}

/** Default capacity_max when creating an occupiable asset (mirrors FacilityAssetRules.cs). */
export function defaultFacilityAssetCapacity(
  nodeType: FacilityNodeType,
  facilityMode: FacilityMode = FACILITY_MODE_ENUM.GENERAL,
): number {
  switch (nodeType) {
    case FACILITY_NODE_TYPE_ENUM.BED:
      return 1;
    case FACILITY_NODE_TYPE_ENUM.TABLE:
      return 4;
    case FACILITY_NODE_TYPE_ENUM.CHAIR:
      return 1;
    case FACILITY_NODE_TYPE_ENUM.ROOM:
      return facilityMode === FACILITY_MODE_ENUM.HOSPITAL ? 1 : 2;
    case FACILITY_NODE_TYPE_ENUM.HOUSE:
      return facilityMode === FACILITY_MODE_ENUM.ESTATE ? 6 : 1;
    case FACILITY_NODE_TYPE_ENUM.UNIT:
      return facilityMode === FACILITY_MODE_ENUM.ESTATE ? 4 : 1;
    case FACILITY_NODE_TYPE_ENUM.SECTION:
      return 8;
    default:
      return 1;
  }
}

/** Human-readable asset kind label from ASSET_KIND_* value (string or proto number). */
export function formatFacilityAssetKindLabel(assetKind: unknown): string {
  const normalized = normalizeFacilityAssetKind(assetKind);
  if (
    !normalized ||
    normalized === FACILITY_ASSET_KIND_ENUM.FACILITY_ASSET_KIND_UNSPECIFIED
  ) {
    return "asset";
  }
  return normalized
    .replace(/^ASSET_KIND_/, "")
    .replace(/_/g, " ")
    .toLowerCase();
}

/** Labels for enum option UIs (e.g. "icu" → "ICU"). */
export function formatEnumOptionLabel(value: string): string {
  if (!value) return "";
  return value
    .split("_")
    .map((part) =>
      part.length <= 3 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

export function enumSelectOptions<E extends Record<string, string>>(
  enumObj: E,
): { value: E[keyof E]; label: string }[] {
  return (Object.values(enumObj) as E[keyof E][]).map((value) => ({
    value,
    label: formatEnumOptionLabel(value),
  }));
}

const FACILITY_NODE_TYPE_BY_NUMBER: Record<number, FacilityNodeType> = {
  0: FACILITY_NODE_TYPE_ENUM.FACILITY_NODE_TYPE_UNSPECIFIED,
  1: FACILITY_NODE_TYPE_ENUM.BLOCK,
  2: FACILITY_NODE_TYPE_ENUM.BUILDING,
  3: FACILITY_NODE_TYPE_ENUM.WARD,
  4: FACILITY_NODE_TYPE_ENUM.UNIT,
  5: FACILITY_NODE_TYPE_ENUM.ROOM,
  6: FACILITY_NODE_TYPE_ENUM.BED,
  7: FACILITY_NODE_TYPE_ENUM.FLOOR,
  8: FACILITY_NODE_TYPE_ENUM.WING,
  9: FACILITY_NODE_TYPE_ENUM.HOUSE,
  10: FACILITY_NODE_TYPE_ENUM.TABLE,
  11: FACILITY_NODE_TYPE_ENUM.ZONE,
  12: FACILITY_NODE_TYPE_ENUM.SECTION,
  13: FACILITY_NODE_TYPE_ENUM.SITE,
  14: FACILITY_NODE_TYPE_ENUM.CHAIR,
};

const KNOWN_NODE_TYPES = new Set<string>(
  Object.values(FACILITY_NODE_TYPE_ENUM),
);

/** Normalize API/proto node type (number, "6", BED) to the string enum. */
export function normalizeFacilityNodeType(value: unknown): FacilityNodeType {
  if (value === undefined || value === null || value === "") {
    return FACILITY_NODE_TYPE_ENUM.FACILITY_NODE_TYPE_UNSPECIFIED;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return (
      FACILITY_NODE_TYPE_BY_NUMBER[value] ??
      FACILITY_NODE_TYPE_ENUM.FACILITY_NODE_TYPE_UNSPECIFIED
    );
  }
  const raw = String(value).trim();
  const asNum = Number(raw);
  if (raw !== "" && !Number.isNaN(asNum) && String(asNum) === raw) {
    return (
      FACILITY_NODE_TYPE_BY_NUMBER[asNum] ??
      FACILITY_NODE_TYPE_ENUM.FACILITY_NODE_TYPE_UNSPECIFIED
    );
  }
  const upper = raw.toUpperCase();
  if (KNOWN_NODE_TYPES.has(upper)) return upper as FacilityNodeType;
  return FACILITY_NODE_TYPE_ENUM.FACILITY_NODE_TYPE_UNSPECIFIED;
}

export type FacilitySpaceUsage =
  | "UNSPECIFIED"
  | "BOOKABLE"
  | "DEPARTMENT"
  | "OPERATIONAL";

/** Normalize API/proto space_usage (number or string) to the string enum. */
export function normalizeSpaceUsage(
  raw?: string | number | null,
): FacilitySpaceUsage {
  if (raw === undefined || raw === null || raw === "") return "UNSPECIFIED";
  if (typeof raw === "number") {
    switch (raw) {
      case 1:
        return "BOOKABLE";
      case 2:
        return "DEPARTMENT";
      case 3:
        return "OPERATIONAL";
      default:
        return "UNSPECIFIED";
    }
  }
  const u = String(raw).trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (u === "1" || u.includes("BOOKABLE")) return "BOOKABLE";
  if (u === "2" || u.includes("DEPARTMENT")) return "DEPARTMENT";
  if (u === "3" || u.includes("OPERATIONAL")) return "OPERATIONAL";
  return "UNSPECIFIED";
}

/** Default display label for a node type (Room, Bed, …). */
export function facilityNodeTypeLabel(nodeType: string | unknown): string {
  const key = normalizeFacilityNodeType(nodeType);
  if (key === FACILITY_NODE_TYPE_ENUM.FACILITY_NODE_TYPE_UNSPECIFIED) {
    return "Location";
  }
  return formatEnumOptionLabel(key);
}

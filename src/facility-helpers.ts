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
  [FACILITY_NODE_TYPE_ENUM.HOUSE]: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_HOUSE,
  [FACILITY_NODE_TYPE_ENUM.UNIT]: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_UNIT,
  [FACILITY_NODE_TYPE_ENUM.SECTION]: FACILITY_ASSET_KIND_ENUM.ASSET_KIND_SECTION,
};

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

/** Human-readable asset kind label from ASSET_KIND_* value. */
export function formatFacilityAssetKindLabel(
  assetKind: string | undefined | null,
): string {
  if (!assetKind) return "asset";
  return assetKind.replace(/^ASSET_KIND_/, "").replace(/_/g, " ").toLowerCase();
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

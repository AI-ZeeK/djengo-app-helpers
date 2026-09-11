import type { FacilityMode, FacilityNodeType } from "./facility-enums";
import { normalizeFacilityNodeType } from "./facility-helpers";

/**
 * Which node types may be placed directly under a given parent type.
 * Floor contains wings/rooms — wing cannot contain floor.
 * House under floor is estate-only (see getAllowedChildLevelTypesForMode).
 */
export const ALLOWED_CHILDREN_BY_PARENT: Partial<
  Record<FacilityNodeType, FacilityNodeType[]>
> = {
  SITE: ["BLOCK", "BUILDING", "ZONE", "HOUSE"],
  BLOCK: ["BUILDING", "WING", "WARD", "FLOOR", "ZONE", "SECTION", "HOUSE"],
  BUILDING: ["FLOOR", "WING", "WARD", "UNIT", "ROOM", "ZONE", "SECTION"],
  FLOOR: ["WING", "WARD", "UNIT", "ROOM", "SECTION", "ZONE"],
  WING: ["WARD", "UNIT", "ROOM", "SECTION"],
  WARD: ["ROOM", "UNIT", "SECTION"],
  UNIT: ["ROOM", "SECTION"],
  ROOM: ["BED", "TABLE", "SECTION"],
  SECTION: ["ROOM", "UNIT", "BED", "TABLE", "CHAIR"],
  ZONE: ["BLOCK", "BUILDING", "WING", "WARD", "SECTION", "ROOM", "TABLE", "CHAIR"],
  HOUSE: ["FLOOR", "UNIT", "ROOM"],
  BED: [],
  TABLE: ["CHAIR"],
  CHAIR: [],
};

/** Types that may be added at branch root (no parent node). */
const ROOT_CHILD_TYPES: FacilityNodeType[] = [
  "SITE",
  "BLOCK",
  "BUILDING",
  "ZONE",
  "HOUSE",
];

/**
 * Suggested next types under a parent. Hierarchy save no longer requires this
 * chain — operators can order levels however they need.
 */
export function getAllowedChildLevelTypesForMode(
  mode: FacilityMode | null | undefined,
  parent: FacilityNodeType,
): FacilityNodeType[] {
  if (mode === "RESTAURANT") {
    switch (parent) {
      case "ZONE":
      case "SITE":
        // Prefer Zone → Table; Section kept for legacy dining layouts.
        return ["TABLE", "SECTION", "CHAIR"];
      case "SECTION":
        return ["TABLE", "CHAIR"];
      case "TABLE":
        return ["CHAIR"];
      default:
        return [];
    }
  }

  if (parent === "HOUSE" && mode === "ESTATE") {
    return [];
  }

  const base = [...(ALLOWED_CHILDREN_BY_PARENT[parent] ?? [])];

  if (mode === "ESTATE") {
    if (
      (parent === "BUILDING" || parent === "FLOOR" || parent === "BLOCK") &&
      !base.includes("HOUSE")
    ) {
      base.push("HOUSE");
    }
  }

  return base;
}

export function isAllowedChildLevelTypeForMode(
  mode: FacilityMode | null | undefined,
  parent: FacilityNodeType,
  child: FacilityNodeType,
): boolean {
  return getAllowedChildLevelTypesForMode(mode, parent).includes(child);
}

export function getAllowedChildTypesUnderParent(
  parentType: FacilityNodeType | string | null | undefined,
): FacilityNodeType[] {
  if (!parentType) return [...ROOT_CHILD_TYPES];
  const parent = normalizeFacilityNodeType(parentType);
  if (parent === "FACILITY_NODE_TYPE_UNSPECIFIED") return [...ROOT_CHILD_TYPES];
  return [...(ALLOWED_CHILDREN_BY_PARENT[parent] ?? [])];
}

export function isAllowedChildTypeUnderParent(
  parentType: FacilityNodeType | string | null | undefined,
  childType: FacilityNodeType | string,
): boolean {
  const child = normalizeFacilityNodeType(childType);
  if (child === "FACILITY_NODE_TYPE_UNSPECIFIED") return false;
  const allowed = getAllowedChildTypesUnderParent(parentType);
  return allowed.includes(child);
}

export class FacilityChildTypeHelper {
  static readonly ALLOWED_CHILDREN_BY_PARENT = ALLOWED_CHILDREN_BY_PARENT;
  static getAllowedChildLevelTypesForMode = getAllowedChildLevelTypesForMode;
  static isAllowedChildLevelTypeForMode = isAllowedChildLevelTypeForMode;
  static getAllowedChildTypesUnderParent = getAllowedChildTypesUnderParent;
  static isAllowedChildTypeUnderParent = isAllowedChildTypeUnderParent;
}


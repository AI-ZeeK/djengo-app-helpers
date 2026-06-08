/**
 * Facility enums aligned with facility.proto and asset metadata_json shapes.
 * Use these across gateway, frontend, and services to avoid string drift.
 */

/** Matches facility.proto FacilityMode */
export enum FACILITY_MODE_ENUM {
  FACILITY_MODE_UNSPECIFIED = "FACILITY_MODE_UNSPECIFIED",
  GENERAL = "GENERAL",
  HOSPITAL = "HOSPITAL",
  ESTATE = "ESTATE",
  HOSPITALITY = "HOSPITALITY",
  RESTAURANT = "RESTAURANT",
}

/** Matches facility.proto FacilityNodeType */
export enum FACILITY_NODE_TYPE_ENUM {
  FACILITY_NODE_TYPE_UNSPECIFIED = "FACILITY_NODE_TYPE_UNSPECIFIED",
  BLOCK = "BLOCK",
  BUILDING = "BUILDING",
  WARD = "WARD",
  UNIT = "UNIT",
  ROOM = "ROOM",
  BED = "BED",
  FLOOR = "FLOOR",
  WING = "WING",
  HOUSE = "HOUSE",
  TABLE = "TABLE",
  ZONE = "ZONE",
  SECTION = "SECTION",
  SITE = "SITE",

  BAR = "BAR",
}

/** Matches facility.proto FacilityAssetKind */
export enum FACILITY_ASSET_KIND_ENUM {
  FACILITY_ASSET_KIND_UNSPECIFIED = "FACILITY_ASSET_KIND_UNSPECIFIED",
  ASSET_KIND_BED = "ASSET_KIND_BED",
  ASSET_KIND_ROOM = "ASSET_KIND_ROOM",
  ASSET_KIND_TABLE = "ASSET_KIND_TABLE",
  ASSET_KIND_HOUSE = "ASSET_KIND_HOUSE",
  ASSET_KIND_UNIT = "ASSET_KIND_UNIT",
  ASSET_KIND_SECTION = "ASSET_KIND_SECTION",
}

/** Matches facility.proto FacilityStatus */
export enum FACILITY_STATUS_ENUM {
  FACILITY_STATUS_UNSPECIFIED = "FACILITY_STATUS_UNSPECIFIED",
  AVAILABLE = "AVAILABLE",
  MAINTENANCE = "MAINTENANCE",
  TEMPORARILY_OUT_OF_COMMISSION = "TEMPORARILY_OUT_OF_COMMISSION",
  OUT_OF_SERVICE = "OUT_OF_SERVICE",
  RESERVED = "RESERVED",
}

/** metadata_json.bed_type — clinical bed classification */
export enum BED_TYPE_ENUM {
  STANDARD = "standard",
  ICU = "icu",
  MATERNITY = "maternity",
  PEDIATRIC = "pediatric",
  ISOLATION = "isolation",
  EMERGENCY = "emergency",
  BARIATRIC = "bariatric",
}

/** metadata_json.room_class */
export enum ROOM_CLASS_ENUM {
  SINGLE = "single",
  DOUBLE = "double",
  TWIN = "twin",
  SUITE = "suite",
  ISOLATION = "isolation",
  OPERATING = "operating",
  ICU = "icu",
  MATERNITY = "maternity",
}

/** metadata_json.table_shape */
export enum TABLE_SHAPE_ENUM {
  ROUND = "round",
  SQUARE = "square",
  RECTANGULAR = "rectangular",
  BOOTH = "booth",
  BAR = "bar",
  OVAL = "oval",
}

/** metadata_json.unit_type */
export enum UNIT_TYPE_ENUM {
  APARTMENT = "apartment",
  TOWNHOUSE = "townhouse",
  PENTHOUSE = "penthouse",
  STUDIO = "studio",
  DUPLEX = "duplex",
}

/** metadata_json.section_class */
export enum SECTION_CLASS_ENUM {
  WARD_BAY = "ward_bay",
  DINING = "dining",
  PARKING = "parking",
  RETAIL = "retail",
  LOUNGE = "lounge",
}

/** metadata_json.occupants[].role */
export enum OCCUPANT_CONTACT_ROLE_ENUM {
  PRIMARY = "primary",
  NEXT_OF_KIN = "next_of_kin",
}

/** String union for API payloads (assignable with `"ROOM"` literals). */
export type FacilityMode = Exclude<
  `${FACILITY_MODE_ENUM}`,
  `${FACILITY_MODE_ENUM.FACILITY_MODE_UNSPECIFIED}`
>;

/** Includes `FACILITY_NODE_TYPE_UNSPECIFIED` for raw API / mapper fallbacks. */
export type FacilityNodeType = `${FACILITY_NODE_TYPE_ENUM}`;

export type FacilityAssetKind = `${FACILITY_ASSET_KIND_ENUM}`;

export type BedTypeValue = BED_TYPE_ENUM | "";
export type RoomClassValue = ROOM_CLASS_ENUM | "";
export type TableShapeValue = TABLE_SHAPE_ENUM | "";
export type UnitTypeValue = UNIT_TYPE_ENUM | "";
export type SectionClassValue = SECTION_CLASS_ENUM | "";
export type OccupantContactRole = OCCUPANT_CONTACT_ROLE_ENUM;

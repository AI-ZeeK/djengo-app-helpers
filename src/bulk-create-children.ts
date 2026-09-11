import type { FacilityNodeLike } from "./facility-types";
import type { FacilityNodeType } from "./facility-enums";
import type { FacilitySpaceUsage } from "./facility-helpers";
import {
  facilityNodeTypeLabel,
  normalizeFacilityNodeType,
} from "./facility-helpers";
import { buildMetadataJson } from "./facility-node-metadata";
import {
  buildFloorMetadataPatch,
  defaultFloorDisplayName,
  isFloorNodeType,
  nextFloorIndexFromSiblings,
} from "./facility-floor";

export const MIN_BULK_CHILD_COUNT = 1;
export const MAX_BULK_CHILD_COUNT = 50;
export const DEFAULT_BULK_CHILD_COUNT = 3;

export function clampBulkChildCount(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_BULK_CHILD_COUNT;
  return Math.min(
    MAX_BULK_CHILD_COUNT,
    Math.max(MIN_BULK_CHILD_COUNT, Math.floor(value)),
  );
}

export function countSameTypeSiblings<T extends FacilityNodeLike>(
  siblings: T[],
  childType: FacilityNodeType,
): number {
  return siblings.filter(
    (n) =>
      normalizeFacilityNodeType(n.node_level?.node_type ?? n.node_type) ===
      childType,
  ).length;
}

/** Preview names for the next N children of this type under the parent. */
export function previewBulkChildNames<T extends FacilityNodeLike>(
  childType: FacilityNodeType,
  count: number,
  siblings: T[],
): string[] {
  const safeCount = clampBulkChildCount(count);
  const names: string[] = [];

  if (isFloorNodeType(childType)) {
    const floorSiblings = siblings.filter((n) =>
      isFloorNodeType(n.node_level?.node_type ?? n.node_type),
    );
    let floorIdx = nextFloorIndexFromSiblings(floorSiblings);
    for (let i = 0; i < safeCount; i++) {
      names.push(defaultFloorDisplayName(floorIdx));
      floorIdx += 1;
    }
    return names;
  }

  const existing = countSameTypeSiblings(siblings, childType);
  const label = facilityNodeTypeLabel(childType);
  for (let i = 0; i < safeCount; i++) {
    names.push(`${label} ${existing + i + 1}`);
  }
  return names;
}

export type BulkCreateNodeDto = {
  parent_facility_node_id?: string;
  node_level_id: string;
  name: string;
  metadata_json?: string;
  department_id?: string;
  space_usage?: FacilitySpaceUsage;
  branch_id?: string;
  staffScoped?: boolean;
};

export type BulkCreateChildrenParams<T extends FacilityNodeLike = FacilityNodeLike> = {
  count: number;
  childType: FacilityNodeType;
  levelId: string;
  parentFacilityNodeId?: string;
  branchId: string;
  staffScoped?: boolean;
  siblings: T[];
  description?: string;
  departmentId?: string;
  spaceUsage?: FacilitySpaceUsage;
  createNode: (dto: BulkCreateNodeDto) => Promise<unknown>;
  onProgress?: (done: number, total: number) => void;
};

/** Creates N sibling locations under the same parent with auto-generated names. */
export async function bulkCreateChildrenUnderParent(
  params: BulkCreateChildrenParams,
): Promise<number> {
  const safeCount = clampBulkChildCount(params.count);
  if (safeCount < 1) return 0;

  const branchArg = params.staffScoped
    ? { staffScoped: true as const }
    : { branch_id: params.branchId };

  let created = 0;

  if (isFloorNodeType(params.childType)) {
    const floorSiblings = params.siblings.filter((n) =>
      isFloorNodeType(n.node_level?.node_type ?? n.node_type),
    );
    let floorIdx = nextFloorIndexFromSiblings(floorSiblings);

    for (let i = 0; i < safeCount; i++) {
      const name = defaultFloorDisplayName(floorIdx);
      await params.createNode({
        ...branchArg,
        parent_facility_node_id: params.parentFacilityNodeId,
        node_level_id: params.levelId,
        name,
        metadata_json: buildMetadataJson(
          buildFloorMetadataPatch(floorIdx, name),
        ),
        ...(params.departmentId
          ? { department_id: params.departmentId }
          : {}),
        ...(params.spaceUsage && params.spaceUsage !== "UNSPECIFIED"
          ? { space_usage: params.spaceUsage }
          : {}),
      });
      floorIdx += 1;
      created += 1;
      params.onProgress?.(created, safeCount);
    }
    return created;
  }

  const existing = countSameTypeSiblings(params.siblings, params.childType);
  const label = facilityNodeTypeLabel(params.childType);

  for (let i = 0; i < safeCount; i++) {
    const name = `${label} ${existing + i + 1}`;
    await params.createNode({
      ...branchArg,
      parent_facility_node_id: params.parentFacilityNodeId,
      node_level_id: params.levelId,
      name,
      ...(params.description?.trim()
        ? { metadata_json: buildMetadataJson({ description: params.description }) }
        : {}),
      ...(params.departmentId ? { department_id: params.departmentId } : {}),
      ...(params.spaceUsage && params.spaceUsage !== "UNSPECIFIED"
        ? { space_usage: params.spaceUsage }
        : {}),
    });
    created += 1;
    params.onProgress?.(created, safeCount);
  }

  return created;
}

export class FacilityBulkCreateHelper {
  static readonly MIN_BULK_CHILD_COUNT = MIN_BULK_CHILD_COUNT;
  static readonly MAX_BULK_CHILD_COUNT = MAX_BULK_CHILD_COUNT;
  static readonly DEFAULT_BULK_CHILD_COUNT = DEFAULT_BULK_CHILD_COUNT;
  static clampBulkChildCount = clampBulkChildCount;
  static countSameTypeSiblings = countSameTypeSiblings;
  static previewBulkChildNames = previewBulkChildNames;
  static bulkCreateChildrenUnderParent = bulkCreateChildrenUnderParent;
}


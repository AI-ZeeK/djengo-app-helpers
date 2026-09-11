"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityBulkCreateHelper = exports.DEFAULT_BULK_CHILD_COUNT = exports.MAX_BULK_CHILD_COUNT = exports.MIN_BULK_CHILD_COUNT = void 0;
exports.clampBulkChildCount = clampBulkChildCount;
exports.countSameTypeSiblings = countSameTypeSiblings;
exports.previewBulkChildNames = previewBulkChildNames;
exports.bulkCreateChildrenUnderParent = bulkCreateChildrenUnderParent;
const facility_helpers_1 = require("./facility-helpers");
const facility_node_metadata_1 = require("./facility-node-metadata");
const facility_floor_1 = require("./facility-floor");
exports.MIN_BULK_CHILD_COUNT = 1;
exports.MAX_BULK_CHILD_COUNT = 50;
exports.DEFAULT_BULK_CHILD_COUNT = 3;
function clampBulkChildCount(value) {
    if (!Number.isFinite(value))
        return exports.DEFAULT_BULK_CHILD_COUNT;
    return Math.min(exports.MAX_BULK_CHILD_COUNT, Math.max(exports.MIN_BULK_CHILD_COUNT, Math.floor(value)));
}
function countSameTypeSiblings(siblings, childType) {
    return siblings.filter((n) => (0, facility_helpers_1.normalizeFacilityNodeType)(n.node_level?.node_type ?? n.node_type) ===
        childType).length;
}
/** Preview names for the next N children of this type under the parent. */
function previewBulkChildNames(childType, count, siblings) {
    const safeCount = clampBulkChildCount(count);
    const names = [];
    if ((0, facility_floor_1.isFloorNodeType)(childType)) {
        const floorSiblings = siblings.filter((n) => (0, facility_floor_1.isFloorNodeType)(n.node_level?.node_type ?? n.node_type));
        let floorIdx = (0, facility_floor_1.nextFloorIndexFromSiblings)(floorSiblings);
        for (let i = 0; i < safeCount; i++) {
            names.push((0, facility_floor_1.defaultFloorDisplayName)(floorIdx));
            floorIdx += 1;
        }
        return names;
    }
    const existing = countSameTypeSiblings(siblings, childType);
    const label = (0, facility_helpers_1.facilityNodeTypeLabel)(childType);
    for (let i = 0; i < safeCount; i++) {
        names.push(`${label} ${existing + i + 1}`);
    }
    return names;
}
/** Creates N sibling locations under the same parent with auto-generated names. */
async function bulkCreateChildrenUnderParent(params) {
    const safeCount = clampBulkChildCount(params.count);
    if (safeCount < 1)
        return 0;
    const branchArg = params.staffScoped
        ? { staffScoped: true }
        : { branch_id: params.branchId };
    let created = 0;
    if ((0, facility_floor_1.isFloorNodeType)(params.childType)) {
        const floorSiblings = params.siblings.filter((n) => (0, facility_floor_1.isFloorNodeType)(n.node_level?.node_type ?? n.node_type));
        let floorIdx = (0, facility_floor_1.nextFloorIndexFromSiblings)(floorSiblings);
        for (let i = 0; i < safeCount; i++) {
            const name = (0, facility_floor_1.defaultFloorDisplayName)(floorIdx);
            await params.createNode({
                ...branchArg,
                parent_facility_node_id: params.parentFacilityNodeId,
                node_level_id: params.levelId,
                name,
                metadata_json: (0, facility_node_metadata_1.buildMetadataJson)((0, facility_floor_1.buildFloorMetadataPatch)(floorIdx, name)),
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
    const label = (0, facility_helpers_1.facilityNodeTypeLabel)(params.childType);
    for (let i = 0; i < safeCount; i++) {
        const name = `${label} ${existing + i + 1}`;
        await params.createNode({
            ...branchArg,
            parent_facility_node_id: params.parentFacilityNodeId,
            node_level_id: params.levelId,
            name,
            ...(params.description?.trim()
                ? { metadata_json: (0, facility_node_metadata_1.buildMetadataJson)({ description: params.description }) }
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
class FacilityBulkCreateHelper {
}
exports.FacilityBulkCreateHelper = FacilityBulkCreateHelper;
FacilityBulkCreateHelper.MIN_BULK_CHILD_COUNT = exports.MIN_BULK_CHILD_COUNT;
FacilityBulkCreateHelper.MAX_BULK_CHILD_COUNT = exports.MAX_BULK_CHILD_COUNT;
FacilityBulkCreateHelper.DEFAULT_BULK_CHILD_COUNT = exports.DEFAULT_BULK_CHILD_COUNT;
FacilityBulkCreateHelper.clampBulkChildCount = clampBulkChildCount;
FacilityBulkCreateHelper.countSameTypeSiblings = countSameTypeSiblings;
FacilityBulkCreateHelper.previewBulkChildNames = previewBulkChildNames;
FacilityBulkCreateHelper.bulkCreateChildrenUnderParent = bulkCreateChildrenUnderParent;
//# sourceMappingURL=bulk-create-children.js.map
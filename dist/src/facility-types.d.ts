/** Duck-typed facility node — enough for shared helpers without Redux DTOs. */
export type FacilityNodeLike = {
    facility_node_id?: string;
    name?: string;
    code?: string;
    description?: string;
    node_type?: string;
    metadata_json?: string;
    spatial_position_json?: string;
    orientation?: string | number | null;
    space_usage?: string | number | null;
    department_id?: string | null;
    parent_facility_node_id?: string | null;
    child_count?: number;
    children?: unknown[];
    is_active?: boolean;
    node_level?: {
        node_type?: string;
        hierarchy_domain?: string;
        color?: string;
    } | null;
};
export type FacilityNodeLevelLike = {
    facility_node_level_id?: string;
    node_type?: string;
    hierarchy_domain?: string;
    is_active?: boolean;
    deleted_at?: string | null;
    level_number?: number;
};
//# sourceMappingURL=facility-types.d.ts.map
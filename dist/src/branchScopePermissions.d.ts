import { PermissionName } from "./permissions";
/** Domains for cross-branch staff access. */
export declare enum BranchPermissionScopeKey {
    STAFF = "STAFF",
    LEAVE = "LEAVE",
    APPROVALS = "APPROVALS",
    FINANCIALS = "FINANCIALS",
    SHIFTS = "SHIFTS",
    TASKS = "TASKS",
    RECEPTION = "RECEPTION",
    FACILITY = "FACILITY"
}
export declare const BRANCH_SCOPE_PERMISSION_SLUG: Record<BranchPermissionScopeKey, PermissionName>;
export declare const BRANCH_SCOPE_LABELS: Record<BranchPermissionScopeKey, string>;
/** gRPC BranchPermissionScope numeric values for effective-branches API. */
export declare const BRANCH_SCOPE_KEY_TO_API: Record<BranchPermissionScopeKey, number>;
export type RoleBranchScopeFormEntry = {
    scope: BranchPermissionScopeKey;
    branch_ids: string[];
    all_branches: boolean;
};
export declare function permissionSlugToBranchScope(slug: string): BranchPermissionScopeKey | null;
export declare function isBranchScopePermissionSlug(slug: string): boolean;
export declare function grpcScopeToKey(scope: number | string | undefined): BranchPermissionScopeKey | null;
export declare function grantedBranchScopesFromPermissions(permissions: {
    permission_name: string;
    state: boolean;
}[]): BranchPermissionScopeKey[];
export declare class BranchScopeHelper {
    static readonly BranchPermissionScopeKey: typeof BranchPermissionScopeKey;
    static readonly BRANCH_SCOPE_PERMISSION_SLUG: Record<BranchPermissionScopeKey, PermissionName>;
    static readonly BRANCH_SCOPE_LABELS: Record<BranchPermissionScopeKey, string>;
    static readonly BRANCH_SCOPE_KEY_TO_API: Record<BranchPermissionScopeKey, number>;
    static permissionSlugToBranchScope: typeof permissionSlugToBranchScope;
    static isBranchScopePermissionSlug: typeof isBranchScopePermissionSlug;
    static grpcScopeToKey: typeof grpcScopeToKey;
    static grantedBranchScopesFromPermissions: typeof grantedBranchScopesFromPermissions;
}
//# sourceMappingURL=branchScopePermissions.d.ts.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchScopeHelper = exports.BRANCH_SCOPE_KEY_TO_API = exports.BRANCH_SCOPE_LABELS = exports.BRANCH_SCOPE_PERMISSION_SLUG = exports.BranchPermissionScopeKey = void 0;
exports.permissionSlugToBranchScope = permissionSlugToBranchScope;
exports.isBranchScopePermissionSlug = isBranchScopePermissionSlug;
exports.grpcScopeToKey = grpcScopeToKey;
exports.grantedBranchScopesFromPermissions = grantedBranchScopesFromPermissions;
const permissions_1 = require("./permissions");
/** Domains for cross-branch staff access. */
var BranchPermissionScopeKey;
(function (BranchPermissionScopeKey) {
    BranchPermissionScopeKey["STAFF"] = "STAFF";
    BranchPermissionScopeKey["LEAVE"] = "LEAVE";
    BranchPermissionScopeKey["APPROVALS"] = "APPROVALS";
    BranchPermissionScopeKey["FINANCIALS"] = "FINANCIALS";
    BranchPermissionScopeKey["SHIFTS"] = "SHIFTS";
    BranchPermissionScopeKey["TASKS"] = "TASKS";
    BranchPermissionScopeKey["RECEPTION"] = "RECEPTION";
    BranchPermissionScopeKey["FACILITY"] = "FACILITY";
})(BranchPermissionScopeKey || (exports.BranchPermissionScopeKey = BranchPermissionScopeKey = {}));
exports.BRANCH_SCOPE_PERMISSION_SLUG = {
    [BranchPermissionScopeKey.STAFF]: permissions_1.PermissionName.VIEW_BRANCH_STAFF,
    [BranchPermissionScopeKey.LEAVE]: permissions_1.PermissionName.VIEW_ALL_BRANCHES,
    [BranchPermissionScopeKey.APPROVALS]: permissions_1.PermissionName.VIEW_ALL_BRANCHES,
    [BranchPermissionScopeKey.FINANCIALS]: permissions_1.PermissionName.VIEW_ALL_BRANCHES,
    [BranchPermissionScopeKey.SHIFTS]: permissions_1.PermissionName.VIEW_ALL_BRANCHES,
    [BranchPermissionScopeKey.TASKS]: permissions_1.PermissionName.VIEW_ALL_BRANCHES,
    [BranchPermissionScopeKey.RECEPTION]: permissions_1.PermissionName.VIEW_ALL_BRANCHES,
    [BranchPermissionScopeKey.FACILITY]: permissions_1.PermissionName.VIEW_ALL_BRANCHES,
};
exports.BRANCH_SCOPE_LABELS = {
    [BranchPermissionScopeKey.STAFF]: "Staff profiles",
    [BranchPermissionScopeKey.LEAVE]: "Leave",
    [BranchPermissionScopeKey.APPROVALS]: "Approvals",
    [BranchPermissionScopeKey.FINANCIALS]: "Payroll & financials",
    [BranchPermissionScopeKey.SHIFTS]: "Shifts & schedules",
    [BranchPermissionScopeKey.TASKS]: "Tasks",
    [BranchPermissionScopeKey.RECEPTION]: "Reception",
    [BranchPermissionScopeKey.FACILITY]: "Facility layout",
};
/** gRPC BranchPermissionScope numeric values for effective-branches API. */
exports.BRANCH_SCOPE_KEY_TO_API = {
    [BranchPermissionScopeKey.STAFF]: 1,
    [BranchPermissionScopeKey.LEAVE]: 2,
    [BranchPermissionScopeKey.APPROVALS]: 3,
    [BranchPermissionScopeKey.FINANCIALS]: 4,
    [BranchPermissionScopeKey.SHIFTS]: 5,
    [BranchPermissionScopeKey.TASKS]: 6,
    [BranchPermissionScopeKey.RECEPTION]: 7,
    [BranchPermissionScopeKey.FACILITY]: 8,
};
function permissionSlugToBranchScope(slug) {
    const normalized = slug.trim().toLowerCase();
    if (normalized === permissions_1.PermissionName.VIEW_BRANCH_STAFF) {
        return BranchPermissionScopeKey.STAFF;
    }
    return null;
}
function isBranchScopePermissionSlug(slug) {
    return permissionSlugToBranchScope(slug) != null;
}
function grpcScopeToKey(scope) {
    if (scope == null)
        return null;
    if (typeof scope === "string") {
        const key = scope
            .replace(/^BRANCH_PERMISSION_SCOPE_/, "")
            .toUpperCase();
        if (key in BranchPermissionScopeKey) {
            return key;
        }
    }
    const map = {
        1: BranchPermissionScopeKey.STAFF,
        2: BranchPermissionScopeKey.LEAVE,
        3: BranchPermissionScopeKey.APPROVALS,
        4: BranchPermissionScopeKey.FINANCIALS,
        5: BranchPermissionScopeKey.SHIFTS,
        6: BranchPermissionScopeKey.TASKS,
        7: BranchPermissionScopeKey.RECEPTION,
        8: BranchPermissionScopeKey.FACILITY,
    };
    return typeof scope === "number" ? map[scope] ?? null : null;
}
function grantedBranchScopesFromPermissions(permissions) {
    const granted = new Set(permissions.filter((p) => p.state).map((p) => p.permission_name));
    const scopes = new Set();
    if (granted.has(permissions_1.PermissionName.VIEW_BRANCH_STAFF)) {
        scopes.add(BranchPermissionScopeKey.STAFF);
    }
    return Array.from(scopes);
}
class BranchScopeHelper {
}
exports.BranchScopeHelper = BranchScopeHelper;
BranchScopeHelper.BranchPermissionScopeKey = BranchPermissionScopeKey;
BranchScopeHelper.BRANCH_SCOPE_PERMISSION_SLUG = exports.BRANCH_SCOPE_PERMISSION_SLUG;
BranchScopeHelper.BRANCH_SCOPE_LABELS = exports.BRANCH_SCOPE_LABELS;
BranchScopeHelper.BRANCH_SCOPE_KEY_TO_API = exports.BRANCH_SCOPE_KEY_TO_API;
BranchScopeHelper.permissionSlugToBranchScope = permissionSlugToBranchScope;
BranchScopeHelper.isBranchScopePermissionSlug = isBranchScopePermissionSlug;
BranchScopeHelper.grpcScopeToKey = grpcScopeToKey;
BranchScopeHelper.grantedBranchScopesFromPermissions = grantedBranchScopesFromPermissions;
//# sourceMappingURL=branchScopePermissions.js.map
import { PermissionName } from "./permissions";

/** Domains for cross-branch staff access. */
export enum BranchPermissionScopeKey {
  STAFF = "STAFF",
  LEAVE = "LEAVE",
  APPROVALS = "APPROVALS",
  FINANCIALS = "FINANCIALS",
  SHIFTS = "SHIFTS",
  TASKS = "TASKS",
  RECEPTION = "RECEPTION",
  FACILITY = "FACILITY",
}

export const BRANCH_SCOPE_PERMISSION_SLUG: Record<
  BranchPermissionScopeKey,
  PermissionName
> = {
  [BranchPermissionScopeKey.STAFF]:
    PermissionName.VIEW_BRANCH_STAFF,
  [BranchPermissionScopeKey.LEAVE]: PermissionName.VIEW_ALL_BRANCHES,
  [BranchPermissionScopeKey.APPROVALS]:
    PermissionName.VIEW_ALL_BRANCHES,
  [BranchPermissionScopeKey.FINANCIALS]:
    PermissionName.VIEW_ALL_BRANCHES,
  [BranchPermissionScopeKey.SHIFTS]: PermissionName.VIEW_ALL_BRANCHES,
  [BranchPermissionScopeKey.TASKS]: PermissionName.VIEW_ALL_BRANCHES,
  [BranchPermissionScopeKey.RECEPTION]:
    PermissionName.VIEW_ALL_BRANCHES,
  [BranchPermissionScopeKey.FACILITY]:
    PermissionName.VIEW_ALL_BRANCHES,
};

export const BRANCH_SCOPE_LABELS: Record<BranchPermissionScopeKey, string> = {
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
export const BRANCH_SCOPE_KEY_TO_API: Record<BranchPermissionScopeKey, number> =
  {
    [BranchPermissionScopeKey.STAFF]: 1,
    [BranchPermissionScopeKey.LEAVE]: 2,
    [BranchPermissionScopeKey.APPROVALS]: 3,
    [BranchPermissionScopeKey.FINANCIALS]: 4,
    [BranchPermissionScopeKey.SHIFTS]: 5,
    [BranchPermissionScopeKey.TASKS]: 6,
    [BranchPermissionScopeKey.RECEPTION]: 7,
    [BranchPermissionScopeKey.FACILITY]: 8,
  };

export type RoleBranchScopeFormEntry = {
  scope: BranchPermissionScopeKey;
  branch_ids: string[];
  all_branches: boolean;
};

export function permissionSlugToBranchScope(
  slug: string,
): BranchPermissionScopeKey | null {
  const normalized = slug.trim().toLowerCase();
  if (normalized === PermissionName.VIEW_BRANCH_STAFF) {
    return BranchPermissionScopeKey.STAFF;
  }
  return null;
}

export function isBranchScopePermissionSlug(slug: string): boolean {
  return permissionSlugToBranchScope(slug) != null;
}

export function grpcScopeToKey(
  scope: number | string | undefined,
): BranchPermissionScopeKey | null {
  if (scope == null) return null;
  if (typeof scope === "string") {
    const key = scope
      .replace(/^BRANCH_PERMISSION_SCOPE_/, "")
      .toUpperCase();
    if (key in BranchPermissionScopeKey) {
      return key as BranchPermissionScopeKey;
    }
  }
  const map: Record<number, BranchPermissionScopeKey> = {
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

export function grantedBranchScopesFromPermissions(
  permissions: { permission_name: string; state: boolean }[],
): BranchPermissionScopeKey[] {
  const granted = new Set(
    permissions.filter((p) => p.state).map((p) => p.permission_name),
  );
  const scopes = new Set<BranchPermissionScopeKey>();
  if (granted.has(PermissionName.VIEW_BRANCH_STAFF)) {
    scopes.add(BranchPermissionScopeKey.STAFF);
  }
  return Array.from(scopes);
}

export class BranchScopeHelper {
  static readonly BranchPermissionScopeKey = BranchPermissionScopeKey;
  static readonly BRANCH_SCOPE_PERMISSION_SLUG = BRANCH_SCOPE_PERMISSION_SLUG;
  static readonly BRANCH_SCOPE_LABELS = BRANCH_SCOPE_LABELS;
  static readonly BRANCH_SCOPE_KEY_TO_API = BRANCH_SCOPE_KEY_TO_API;
  static permissionSlugToBranchScope = permissionSlugToBranchScope;
  static isBranchScopePermissionSlug = isBranchScopePermissionSlug;
  static grpcScopeToKey = grpcScopeToKey;
  static grantedBranchScopesFromPermissions = grantedBranchScopesFromPermissions;
}


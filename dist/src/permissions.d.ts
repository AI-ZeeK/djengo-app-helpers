/**
 * Canonical organization permission catalog — the single source of truth.
 *
 * Everything downstream is derived from this file:
 *   - organization-service seeds the Permission and PermissionGroup tables from it
 *   - gateway-service's `@RequirePermissions` decorators type against the enum
 *   - the client and mobile frontends gate UI on the same slugs
 *   - the .NET services read `Permissions.g.cs`, generated from this file by
 *     `npm run gen:csharp` and copied in by `scripts/sync-dotnet-shared.sh`
 *
 * Edit here, run `npm run build`, then `npm run sync:dotnet`. Nothing else
 * declares a permission slug.
 *
 * ── Naming ──────────────────────────────────────────────────────────────────
 * One flat namespace: `{verb}_{resource}`, with no audience prefix. A permission
 * describes a capability, not who holds it, so `view_operations` is a single
 * permission that a business user role and a staff role can both grant.
 *
 * That matters because one person can hold several roles at once. Effective
 * permissions are the union of what those roles grant — look the permission up
 * and take it if any of the user's roles grants it. Splitting the same
 * capability into `business_user_view_operations` and `staff_view_operations`
 * would make the answer depend on which role you happened to read.
 *
 * Who sees which permission in the role editor is decided by the *groups* below,
 * not by the permission name. A shared capability simply appears in both a
 * BUSINESS_USER group and a STAFF group.
 *
 * Verbs and their level:
 *   1 — view / access            (read a page or record)
 *   2 — manage / request / send  (create, edit, submit)
 *   3 — approve / restrict       (sign off, or take access away from others)
 *
 * `permission_name` is VarChar(50); keep slugs under that.
 */
/** Every permission slug the platform recognises. */
export declare enum PermissionName {
    MANAGE_ORGANIZATION = "manage_organization",
    VIEW_SETTINGS = "view_settings",
    MANAGE_SETTINGS = "manage_settings",
    VIEW_COMPANIES = "view_companies",
    MANAGE_COMPANIES = "manage_companies",
    VIEW_BRANCHES = "view_branches",
    MANAGE_BRANCHES = "manage_branches",
    RESTRICT_BRANCH_ACCESS = "restrict_branch_access",
    VIEW_DEPARTMENTS = "view_departments",
    MANAGE_DEPARTMENTS = "manage_departments",
    VIEW_ROLES = "view_roles",
    MANAGE_ROLES = "manage_roles",
    VIEW_PARTNERS = "view_partners",
    MANAGE_PARTNERS = "manage_partners",
    VIEW_STAFF = "view_staff",
    MANAGE_STAFF = "manage_staff",
    MANAGE_INVITATIONS = "manage_invitations",
    VIEW_AUDIT = "view_audit",
    MANAGE_AUDIT = "manage_audit",
    ACCESS_KITCHEN = "access_kitchen",
    MANAGE_KITCHEN = "manage_kitchen",
    ACCESS_RECEPTION = "access_reception",
    MANAGE_RECEPTION = "manage_reception",
    ACCESS_HOTEL = "access_hotel",
    MANAGE_HOTEL = "manage_hotel",
    ACCESS_RESTAURANT = "access_restaurant",
    MANAGE_RESTAURANT = "manage_restaurant",
    VIEW_DASHBOARD = "view_dashboard",
    VIEW_PROFILE = "view_profile",
    MANAGE_PROFILE = "manage_profile",
    ACCESS_BRANCH = "access_branch",
    MANAGE_BRANCH = "manage_branch",
    VIEW_ALL_BRANCHES = "view_all_branches",
    VIEW_BRANCH_STAFF = "view_branch_staff",
    VIEW_BRANCH_LEAVE = "view_branch_leave",
    VIEW_BRANCH_APPROVALS = "view_branch_approvals",
    VIEW_BRANCH_FINANCIALS = "view_branch_financials",
    VIEW_BRANCH_SHIFTS = "view_branch_shifts",
    VIEW_BRANCH_TASKS = "view_branch_tasks",
    VIEW_BRANCH_RECEPTION = "view_branch_reception",
    VIEW_BRANCH_FACILITY = "view_branch_facility",
    ACCESS_FACILITY = "access_facility",
    MANAGE_FACILITY = "manage_facility",
    VIEW_OPERATIONS = "view_operations",
    MANAGE_OPERATIONS = "manage_operations",
    VIEW_TASKS = "view_tasks",
    MANAGE_TASKS = "manage_tasks",
    VIEW_INVENTORY = "view_inventory",
    MANAGE_INVENTORY = "manage_inventory",
    VIEW_ASSETS = "view_assets",
    MANAGE_ASSETS = "manage_assets",
    VIEW_RESERVATIONS = "view_reservations",
    MANAGE_RESERVATIONS = "manage_reservations",
    APPROVE_RESERVATIONS = "approve_reservations",
    VIEW_GUESTS = "view_guests",
    MANAGE_GUESTS = "manage_guests",
    VIEW_SCHEDULE = "view_schedule",
    MANAGE_SCHEDULE = "manage_schedule",
    VIEW_SHIFTS = "view_shifts",
    MANAGE_SHIFTS = "manage_shifts",
    VIEW_TIME = "view_time",
    MANAGE_TIME = "manage_time",
    VIEW_ATTENDANCE = "view_attendance",
    MANAGE_ATTENDANCE = "manage_attendance",
    VIEW_LEAVE = "view_leave",
    MANAGE_LEAVE = "manage_leave",
    APPROVE_LEAVE = "approve_leave",
    VIEW_CALENDAR_EVENTS = "view_calendar_events",
    MANAGE_CALENDAR_EVENTS = "manage_calendar_events",
    VIEW_APPROVALS = "view_approvals",
    MANAGE_APPROVALS = "manage_approvals",
    MANAGE_APPROVAL_CHAINS = "manage_approval_chains",
    VIEW_COMMUNICATION = "view_communication",
    MANAGE_COMMUNICATION = "manage_communication",
    VIEW_COMPLAINTS = "view_complaints",
    MANAGE_COMPLAINTS = "manage_complaints",
    VIEW_STAFF_PROFILES = "view_staff_profiles",
    MANAGE_STAFF_PROFILES = "manage_staff_profiles",
    VIEW_HR_RECORDS = "view_hr_records",
    MANAGE_HR_RECORDS = "manage_hr_records",
    VIEW_FINANCES = "view_finances",
    MANAGE_FINANCES = "manage_finances",
    VIEW_INVOICES = "view_invoices",
    MANAGE_INVOICES = "manage_invoices",
    MANAGE_BILLING_POLICY = "manage_billing_policy",
    VIEW_PROCUREMENT = "view_procurement",
    MANAGE_PROCUREMENT = "manage_procurement",
    APPROVE_PROCUREMENT = "approve_procurement",
    VIEW_PAYROLLS = "view_payrolls",
    MANAGE_PAYROLLS = "manage_payrolls",
    APPROVE_PAYROLLS = "approve_payrolls",
    SEND_PAYROLL = "send_payroll",
    VIEW_PAYROLL_REPORTS = "view_payroll_reports",
    MANAGE_PAYROLL_SCHEDULES = "manage_payroll_schedules",
    VIEW_MONTHLY_BUDGETS = "view_monthly_budgets",
    MANAGE_MONTHLY_BUDGETS = "manage_monthly_budgets",
    APPROVE_MONTHLY_BUDGETS = "approve_monthly_budgets",
    VIEW_BRANCH_BUDGET = "view_branch_budget",
    VIEW_BRANCH_ALLOCATIONS = "view_branch_allocations",
    MANAGE_BRANCH_ALLOCATIONS = "manage_branch_allocations",
    APPROVE_BRANCH_ALLOCATIONS = "approve_branch_allocations",
    VIEW_ALLOCATIONS = "view_allocations",
    MANAGE_ALLOCATIONS = "manage_allocations",
    REQUEST_FUNDS = "request_funds",
    VIEW_FUND_REQUESTS = "view_fund_requests",
    APPROVE_FUND_REQUESTS = "approve_fund_requests",
    REQUEST_EXTRA_FUNDS = "request_extra_funds",
    VIEW_EXTRA_FUND_REQUESTS = "view_extra_fund_requests",
    APPROVE_EXTRA_FUND_REQUESTS = "approve_extra_fund_requests",
    VIEW_DISBURSEMENTS = "view_disbursements",
    MANAGE_DISBURSEMENTS = "manage_disbursements",
    APPROVE_DISBURSEMENTS = "approve_disbursements"
}
/**
 * Mirrors the Prisma `PermissionCategory` enum in organization-service. Declared
 * as a string union rather than imported so this package stays free of any
 * Prisma dependency — the values are checked against the generated client where
 * the seed consumes them.
 */
export type PermissionCategoryName = 'DEPARTMENT' | 'BUSINESS_USER' | 'STAFF' | 'ORGANIZATION' | 'DESIGNATION';
/** Mirrors the Prisma `PermissionGroupType` enum in organization-service. */
export type PermissionGroupTypeName = 'PAGE_ACCESS' | 'SECURITY' | 'OPERATIONS' | 'STAFF_MANAGEMENT' | 'COMMUNICATION' | 'FINANCIALS' | 'GENERAL';
export type PermissionDef = {
    name: PermissionName;
    description: string;
    level: number;
    category: PermissionCategoryName;
};
export type PermissionGroupDef = {
    group_name: string;
    description: string;
    level: number;
    category: PermissionCategoryName;
    group_type: PermissionGroupTypeName;
    permissions: PermissionName[];
};
export declare const ALL_PERMISSIONS: PermissionDef[];
export declare const PERMISSION_GROUPS: PermissionGroupDef[];
/**
 * Old slug → canonical slug.
 *
 * Grants live in `entity_permissions.permission_id`, so renaming in place keeps
 * every existing role grant intact. Where both names already exist the seed
 * merges the old row into the canonical one instead of renaming.
 *
 * The `staff_`-prefixed entries were inserted by earlier SQL migrations
 * (20260616130000, 20260619000000, 20260620000000) and are folded back into the
 * single unprefixed namespace here.
 */
export declare const LEGACY_PERMISSION_RENAMES: Record<string, PermissionName>;
/** Every slug, in catalog order. */
export declare const ALL_PERMISSION_NAMES: PermissionName[];
/** Narrows an arbitrary string to a known slug — use before trusting user input. */
export declare function isPermissionName(value: string): value is PermissionName;
/** Resolves a legacy slug to its canonical form; returns unknown slugs unchanged. */
export declare function canonicalPermissionName(value: string): string;
/**
 * Slugs of the two roles organization-service creates with every new
 * organization, each holding the whole catalog above.
 *
 * They exist to break a chicken-and-egg problem: a new organization has no
 * roles, and creating one is itself permission-gated. Both are ordinary roles
 * once created — editable, renameable, deletable.
 *
 * The slugs are shared because organization-service writes them and
 * profile-service reads them back to assign the creator. Duplicating the
 * literal would let the two drift, and the failure is silent: the lookup
 * returns nothing and the creator is left with no role at all.
 */
export declare const BOOTSTRAP_ROLE_SLUGS: {
    /** Organization-wide admin, held by business users. Assigned to the creator. */
    readonly BUSINESS_ADMIN: "business-admin";
    /** Company-wide admin, held by staff. Assigned to staff as they are onboarded. */
    readonly ADMIN_USER: "admin-user";
};
export type BootstrapRoleSlug = (typeof BOOTSTRAP_ROLE_SLUGS)[keyof typeof BOOTSTRAP_ROLE_SLUGS];
/**
 * Old bootstrap slug → current slug.
 *
 * Provisioning matches an existing role by slug, so a rename without this map
 * would leave the old role in place and create a second one beside it. The
 * organization-service provisioner renames in place instead, which keeps every
 * staff assignment pointing at the same role_id.
 */
export declare const LEGACY_BOOTSTRAP_ROLE_SLUGS: Record<string, BootstrapRoleSlug>;
//# sourceMappingURL=permissions.d.ts.map
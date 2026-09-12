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
 * describes a capability, not who holds it, so `view_payroll` is a single
 * permission that a business user role and a staff role can both grant.
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
 *
 * Members marked “alias” share a slug with the canonical member so existing
 * TypeScript still compiles. They are not extra catalog rows.
 *
 * Support tickets are staff/company complaints. There is no communications
 * permission, and no view_dashboard / view_profile catalog rows.
 */
/** Every permission slug the platform recognises. */
export declare enum PermissionName {
    VIEW_COMPANY_DETAILS = "view_company_details",
    MANAGE_COMPANY_DETAILS = "manage_company_details",
    VIEW_COMPANY_PLANS_BILLINGS = "view_company_plans_billings",
    MANAGE_COMPANY_PLANS_BILLINGS = "manage_company_plans_billings",
    VIEW_ALL_BRANCHES = "view_all_branches",
    MANAGE_ALL_BRANCHES = "manage_all_branches",
    VIEW_DEPARTMENTS = "view_departments",
    MANAGE_DEPARTMENTS = "manage_departments",
    VIEW_ROLES = "view_roles",
    MANAGE_ROLES = "manage_roles",
    VIEW_INVITATIONS = "view_invitations",
    MANAGE_INVITATIONS = "manage_invitations",
    VIEW_BRANCH_STAFF = "view_branch_staff",
    MANAGE_BRANCH_STAFF = "manage_branch_staff",
    VIEW_APPROVAL_CHAIN = "view_approval_chain",
    MANAGE_APPROVAL_CHAIN = "manage_approval_chain",
    VIEW_BOOKING_REQUESTS = "view_booking_requests",
    MANAGE_BOOKING = "manage_booking",
    VIEW_RECEPTION_ANALYTICS = "view_reception_analytics",
    VIEW_RECEPTION = "view_reception",
    VIEW_REFUND_REQUESTS = "view_refund_requests",
    MANAGE_REFUND_REQUESTS = "manage_refund_requests",
    VIEW_GUESTS = "view_guests",
    MANAGE_GUESTS = "manage_guests",
    VIEW_KITCHEN_ANALYTICS = "view_kitchen_analytics",
    VIEW_KITCHEN_MENU = "view_kitchen_menu",
    MANAGE_KITCHEN_MENU = "manage_kitchen_menu",
    VIEW_KITCHEN_BOARD = "view_kitchen_board",
    MANAGE_KITCHEN_BOARD = "manage_kitchen_board",
    VIEW_KITCHEN_ORDERS = "view_kitchen_orders",
    MANAGE_KITCHEN_ORDERS = "manage_kitchen_orders",
    VIEW_STAFF_ATTENDANCE = "view_staff_attendance",
    VIEW_COMPANY_CONTRACTS = "view_company_contracts",
    MANAGE_COMPANY_CONTRACTS = "manage_company_contracts",
    VIEW_STAFF_PERFORMANCE = "view_staff_performance",
    MANAGE_STAFF_PERFORMANCE = "manage_staff_performance",
    VIEW_STAFF_TRAINING = "view_staff_training",
    MANAGE_STAFF_TRAINING = "manage_staff_training",
    VIEW_DISCIPLINARY_RECORDS = "view_disciplinary_records",
    MANAGE_DISCIPLINARY_RECORDS = "manage_disciplinary_records",
    VIEW_STAFF_DOCUMENTS = "view_staff_documents",
    MANAGE_STAFF_DOCUMENTS = "manage_staff_documents",
    VIEW_STAFF_POSITION_CHANGES = "view_staff_position_changes",
    MANAGE_STAFF_POSITION_CHANGES = "manage_staff_position_changes",
    VIEW_SALARY_STRUCTURES = "view_salary_structures",
    MANAGE_SALARY_STRUCTURES = "manage_salary_structures",
    VIEW_STAFF_COMPLAINTS = "view_staff_complaints",
    MANAGE_STAFF_COMPLAINTS = "manage_staff_complaints",
    VIEW_COMPANY_COMPLAINTS = "view_company_complaints",
    MANAGE_COMPANY_COMPLAINTS = "manage_company_complaints",
    VIEW_COMPLIANCE = "view_compliance",
    MANAGE_COMPLIANCE = "manage_compliance",
    VIEW_COMPANY_REPORT_SCHEDULES = "view_company_report_schedules",
    MANAGE_REPORT_SCHEDULES = "manage_report_schedules",
    VIEW_COMPANY_AUDIT_LOGS = "view_company_audit_logs",
    VIEW_COMPANY_REPORTS = "view_company_reports",
    MANAGE_COMPANY_REPORTS = "manage_company_reports",
    VIEW_SHIFT_TEMPLATES = "view_shift_templates",
    MANAGE_SHIFT_TEMPLATES = "manage_shift_templates",
    VIEW_SHIFT_ASSIGNMENTS = "view_shift_assignments",
    MANAGE_SHIFT_ASSIGNMENTS = "manage_shift_assignments",
    VIEW_SHIFT_COVERAGE = "view_shift_coverage",
    VIEW_COMPANY_CALENDAR = "view_company_calendar",
    MANAGE_COMPANY_CALENDAR = "manage_company_calendar",
    MANAGE_DUTY_ASSIGNMENTS = "manage_duty_assignments",
    VIEW_LEAVE_POLICY = "view_leave_policy",
    VIEW_LEAVE_REQUESTS = "view_leave_requests",
    MANAGE_LEAVE_REQUESTS = "manage_leave_requests",
    VIEW_LEAVE_ANALYTICS = "view_leave_analytics",
    VIEW_LEAVE_BALANCE = "view_leave_balance",
    MANAGE_LEAVE_BALANCE = "manage_leave_balance",
    VIEW_FACILITIES = "view_facilities",
    MANAGE_FACILITIES = "manage_facilities",
    VIEW_HOUSEKEEPING = "view_housekeeping",
    MANAGE_HOUSEKEEPING = "manage_housekeeping",
    VIEW_WORK_ORDERS = "view_work_orders",
    MANAGE_WORK_ORDERS = "manage_work_orders",
    VIEW_INCIDENT_REPORTS = "view_incident_reports",
    MANAGE_INCIDENT_REPORTS = "manage_incident_reports",
    VIEW_INVENTORY = "view_inventory",
    MANAGE_INVENTORY = "manage_inventory",
    VIEW_ASSETS = "view_assets",
    MANAGE_ASSETS = "manage_assets",
    VIEW_FINANCIALS_ANALYTICS = "view_financials_analytics",
    VIEW_FINANCIAL_REPORTS = "view_financial_reports",
    MANAGE_FINANCIAL_REPORTS = "manage_financial_reports",
    VIEW_COMPANY_BUDGET = "view_company_budget",
    MANAGE_COMPANY_BUDGETS = "manage_company_budgets",
    APPROVE_MONTHLY_BUDGETS = "approve_monthly_budgets",
    MANAGE_BUDGET_ALLOCATIONS = "manage_budget_allocations",
    VIEW_REVENUE_STREAMS = "view_revenue_streams",
    MANAGE_REVENUE_STREAMS = "manage_revenue_streams",
    VIEW_COMPANY_WALLET = "view_company_wallet",
    MANAGE_COMPANY_WALLETS = "manage_company_wallets",
    VIEW_WALLET_AUDIT_TRAILS = "view_wallet_audit_trails",
    VIEW_COMPANY_TRANSACTIONS = "view_company_transactions",
    VIEW_REMITTANCES = "view_remittances",
    MANAGE_REMITTANCES = "manage_remittances",
    VIEW_COMPANY_INVOICES = "view_company_invoices",
    MANAGE_COMPANY_INVOICES = "manage_company_invoices",
    VIEW_VARIANCE_REPORTS = "view_variance_reports",
    VIEW_FINANCIAL_STATEMENTS = "view_financial_statements",
    VIEW_PAYROLL = "view_payroll",
    MANAGE_PAYROLL = "manage_payroll",
    VIEW_PAYROLL_YTD = "view_payroll_ytd",
    APPROVE_PAYROLLS = "approve_payrolls",
    SEND_PAYROLL = "send_payroll",
    MANAGE_PAYROLL_SCHEDULES = "manage_payroll_schedules",
    VIEW_ALLOCATIONS = "view_allocations",
    MANAGE_ALLOCATIONS = "manage_allocations",
    VIEW_COMPANIES = "view_company_details",
    MANAGE_COMPANIES = "manage_company_details",
    MANAGE_ORGANIZATION = "manage_company_details",
    VIEW_SETTINGS = "view_company_details",
    MANAGE_SETTINGS = "manage_company_details",
    VIEW_BRANCHES = "view_all_branches",
    MANAGE_BRANCHES = "manage_all_branches",
    VIEW_BRANCH = "view_all_branches",
    MANAGE_BRANCH = "manage_all_branches",
    RESTRICT_BRANCH_ACCESS = "manage_all_branches",
    VIEW_STAFF = "view_branch_staff",
    MANAGE_STAFF = "manage_branch_staff",
    VIEW_STAFF_PROFILES = "view_branch_staff",
    MANAGE_STAFF_PROFILES = "manage_branch_staff",
    VIEW_PARTNERS = "view_branch_staff",
    MANAGE_PARTNERS = "manage_branch_staff",
    VIEW_BILLING_POLICY = "view_company_plans_billings",
    MANAGE_BILLING_POLICY = "manage_company_plans_billings",
    VIEW_APPROVALS = "view_approval_chain",
    MANAGE_APPROVALS = "manage_approval_chain",
    MANAGE_APPROVAL_CHAINS = "manage_approval_chain",
    VIEW_RESERVATIONS = "view_booking_requests",
    MANAGE_RESERVATIONS = "manage_booking",
    APPROVE_RESERVATIONS = "manage_booking",
    MANAGE_RECEPTION = "manage_booking",
    VIEW_HOTEL = "view_reception",
    MANAGE_HOTEL = "manage_booking",
    VIEW_KITCHEN = "view_kitchen_board",
    MANAGE_KITCHEN = "manage_kitchen_board",
    VIEW_RESTAURANT = "view_kitchen_board",
    MANAGE_RESTAURANT = "manage_kitchen_orders",
    VIEW_ATTENDANCE = "view_staff_attendance",
    MANAGE_ATTENDANCE = "view_staff_attendance",
    MANAGE_STAFF_ATTENDANCE = "view_staff_attendance",
    VIEW_TIME = "view_staff_attendance",
    MANAGE_TIME = "view_staff_attendance",
    VIEW_HR_PERFORMANCE = "view_staff_performance",
    MANAGE_HR_PERFORMANCE = "manage_staff_performance",
    VIEW_HR_DOCUMENTS = "view_staff_documents",
    MANAGE_HR_DOCUMENTS = "manage_staff_documents",
    VIEW_COMPLAINTS = "view_staff_complaints",
    MANAGE_COMPLAINTS = "manage_staff_complaints",
    VIEW_AUDIT = "view_company_audit_logs",
    MANAGE_AUDIT = "manage_compliance",
    VIEW_SHIFTS = "view_shift_assignments",
    MANAGE_SHIFTS = "manage_shift_assignments",
    VIEW_SCHEDULE = "view_shift_assignments",
    MANAGE_SCHEDULE = "manage_shift_assignments",
    VIEW_CALENDAR_EVENTS = "view_company_calendar",
    MANAGE_CALENDAR_EVENTS = "manage_company_calendar",
    VIEW_LEAVE = "view_leave_requests",
    MANAGE_LEAVE = "manage_leave_requests",
    MANAGE_LEAVE_POLICY = "manage_leave_requests",
    APPROVE_LEAVE = "manage_leave_requests",
    VIEW_FACILITY = "view_facilities",
    MANAGE_FACILITY = "manage_facilities",
    VIEW_OPERATIONS = "view_facilities",
    MANAGE_OPERATIONS = "manage_facilities",
    VIEW_TASKS = "view_work_orders",
    MANAGE_TASKS = "manage_work_orders",
    VIEW_FINANCIAL_ANALYTICS = "view_financials_analytics",
    MANAGE_FINANCIAL_ANALYTICS = "manage_financial_reports",
    VIEW_MONTHLY_BUDGETS = "view_company_budget",
    MANAGE_MONTHLY_BUDGETS = "manage_company_budgets",
    VIEW_BRANCH_BUDGET = "view_company_budget",
    VIEW_COMPANY_FUNDS = "view_company_wallet",
    MANAGE_COMPANY_FUNDS = "manage_company_wallets",
    VIEW_TRANSACTIONS = "view_company_transactions",
    MANAGE_TRANSACTIONS = "view_company_transactions",
    MANAGE_COMPANY_TRANSACTIONS = "view_company_transactions",
    VIEW_INVOICES = "view_company_invoices",
    MANAGE_INVOICES = "manage_company_invoices",
    VIEW_PAYROLLS = "view_payroll",
    MANAGE_PAYROLLS = "manage_payroll",
    VIEW_PAYROLL_REPORTS = "view_payroll_ytd",
    VIEW_BRANCH_ALLOCATIONS = "view_allocations",
    MANAGE_BRANCH_ALLOCATIONS = "manage_budget_allocations",
    APPROVE_BRANCH_ALLOCATIONS = "manage_budget_allocations",
    VIEW_FINANCIAL_PERIODS = "view_financial_statements",
    MANAGE_FINANCIAL_PERIODS = "manage_financial_reports",
    VIEW_PROCUREMENT = "view_inventory",
    MANAGE_PROCUREMENT = "manage_inventory",
    APPROVE_PROCUREMENT = "manage_inventory",
    REQUEST_FUNDS = "manage_company_wallets",
    VIEW_FUND_REQUESTS = "view_company_wallet",
    APPROVE_FUND_REQUESTS = "manage_company_wallets",
    REQUEST_EXTRA_FUNDS = "manage_company_wallets",
    VIEW_EXTRA_FUND_REQUESTS = "view_company_wallet",
    APPROVE_EXTRA_FUND_REQUESTS = "manage_company_wallets",
    VIEW_DISBURSEMENTS = "view_company_wallet",
    MANAGE_DISBURSEMENTS = "manage_company_wallets",
    APPROVE_DISBURSEMENTS = "manage_company_wallets",
    VIEW_BRANCH_LEAVE = "view_all_branches",
    VIEW_BRANCH_APPROVALS = "view_all_branches",
    VIEW_BRANCH_FINANCIALS = "view_all_branches",
    VIEW_BRANCH_SHIFTS = "view_all_branches",
    VIEW_BRANCH_TASKS = "view_all_branches",
    VIEW_BRANCH_RECEPTION = "view_all_branches",
    VIEW_BRANCH_FACILITY = "view_all_branches"
}
/**
 * Mirrors the Prisma `PermissionCategory` enum in organization-service. Declared
 * as a string union rather than imported so this package stays free of any
 * Prisma dependency — the values are checked against the generated client where
 * the seed consumes them.
 */
export type PermissionCategoryName = "DEPARTMENT" | "BUSINESS_USER" | "STAFF" | "ORGANIZATION" | "DESIGNATION";
/** Mirrors the Prisma `PermissionGroupType` enum in organization-service. */
export type PermissionGroupTypeName = "PAGE_ACCESS" | "SECURITY" | "OPERATIONS" | "STAFF_MANAGEMENT" | "COMMUNICATION" | "FINANCIALS" | "GENERAL";
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
 * Dashboard and profile are dropped, not remapped. Communication grants fold
 * into support tickets (staff complaints).
 */
export declare const LEGACY_PERMISSION_RENAMES: Record<string, PermissionName>;
/** Every slug, in catalog order. */
export declare const ALL_PERMISSION_NAMES: PermissionName[];
/** Narrows an arbitrary string to a known slug — use before trusting user input. */
export declare function isPermissionName(value: string): value is PermissionName;
/** Resolves a legacy slug to its canonical form; returns unknown slugs unchanged. */
export declare function canonicalPermissionName(value: string): string;
/**
 * Approval-chain entity slugs (events ApprovalChainService) → the grant that
 * marks a company/staff role as eligible to sit on that chain's steps.
 */
export declare const APPROVAL_ENTITY_PERMISSIONS: Readonly<Record<string, PermissionName>>;
/** Looks up the approve_* permission for an approval-entity slug. */
export declare function approvalPermissionForEntity(entityTypeSlug: string | undefined | null): PermissionName | undefined;
/**
 * Any-of permissions that open the personal approvals inbox.
 * Chain configuration stays on view/manage_approval_chain; inbox is also
 * available to anyone who can sit on a chain step.
 */
export declare const APPROVAL_INBOX_PERMISSIONS: PermissionName[];
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
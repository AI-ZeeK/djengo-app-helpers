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
export enum PermissionName {
  // ── Organization-wide ──────────────────────────────────────────────────────
  MANAGE_ORGANIZATION = 'manage_organization',
  VIEW_SETTINGS = 'view_settings',
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_COMPANIES = 'view_companies',
  MANAGE_COMPANIES = 'manage_companies',
  VIEW_BRANCHES = 'view_branches',
  MANAGE_BRANCHES = 'manage_branches',
  RESTRICT_BRANCH_ACCESS = 'restrict_branch_access',
  VIEW_DEPARTMENTS = 'view_departments',
  MANAGE_DEPARTMENTS = 'manage_departments',
  VIEW_ROLES = 'view_roles',
  MANAGE_ROLES = 'manage_roles',
  VIEW_PARTNERS = 'view_partners',
  MANAGE_PARTNERS = 'manage_partners',
  VIEW_STAFF = 'view_staff',
  MANAGE_STAFF = 'manage_staff',
  MANAGE_INVITATIONS = 'manage_invitations',
  VIEW_AUDIT = 'view_audit',
  MANAGE_AUDIT = 'manage_audit',

  // ── Department page access ────────────────────────────────────────────────
  ACCESS_KITCHEN = 'access_kitchen',
  MANAGE_KITCHEN = 'manage_kitchen',
  ACCESS_RECEPTION = 'access_reception',
  MANAGE_RECEPTION = 'manage_reception',
  ACCESS_HOTEL = 'access_hotel',
  MANAGE_HOTEL = 'manage_hotel',
  ACCESS_RESTAURANT = 'access_restaurant',
  MANAGE_RESTAURANT = 'manage_restaurant',

  // ── Dashboard & profile ───────────────────────────────────────────────────
  VIEW_DASHBOARD = 'view_dashboard',
  VIEW_PROFILE = 'view_profile',
  MANAGE_PROFILE = 'manage_profile',

  // ── Branch access ─────────────────────────────────────────────────────────
  // The `view_branch_*` slugs widen a scope to other branches; they map to
  // BranchPermissionScope in organization-service/branch-scope-permissions.util.ts.
  ACCESS_BRANCH = 'access_branch',
  MANAGE_BRANCH = 'manage_branch',
  VIEW_ALL_BRANCHES = 'view_all_branches',
  VIEW_BRANCH_STAFF = 'view_branch_staff',
  VIEW_BRANCH_LEAVE = 'view_branch_leave',
  VIEW_BRANCH_APPROVALS = 'view_branch_approvals',
  VIEW_BRANCH_FINANCIALS = 'view_branch_financials',
  VIEW_BRANCH_SHIFTS = 'view_branch_shifts',
  VIEW_BRANCH_TASKS = 'view_branch_tasks',
  VIEW_BRANCH_RECEPTION = 'view_branch_reception',
  VIEW_BRANCH_FACILITY = 'view_branch_facility',

  // ── Facility ──────────────────────────────────────────────────────────────
  ACCESS_FACILITY = 'access_facility',
  MANAGE_FACILITY = 'manage_facility',

  // ── Operations, tasks, stock ──────────────────────────────────────────────
  VIEW_OPERATIONS = 'view_operations',
  MANAGE_OPERATIONS = 'manage_operations',
  VIEW_TASKS = 'view_tasks',
  MANAGE_TASKS = 'manage_tasks',
  VIEW_INVENTORY = 'view_inventory',
  MANAGE_INVENTORY = 'manage_inventory',
  VIEW_ASSETS = 'view_assets',
  MANAGE_ASSETS = 'manage_assets',

  // ── Reception desk — bookings and guests ──────────────────────────────────
  VIEW_RESERVATIONS = 'view_reservations',
  MANAGE_RESERVATIONS = 'manage_reservations',
  APPROVE_RESERVATIONS = 'approve_reservations',
  VIEW_GUESTS = 'view_guests',
  MANAGE_GUESTS = 'manage_guests',

  // ── Schedule, shifts, time, leave ─────────────────────────────────────────
  VIEW_SCHEDULE = 'view_schedule',
  MANAGE_SCHEDULE = 'manage_schedule',
  VIEW_SHIFTS = 'view_shifts',
  MANAGE_SHIFTS = 'manage_shifts',
  VIEW_TIME = 'view_time',
  MANAGE_TIME = 'manage_time',
  VIEW_ATTENDANCE = 'view_attendance',
  MANAGE_ATTENDANCE = 'manage_attendance',
  VIEW_LEAVE = 'view_leave',
  MANAGE_LEAVE = 'manage_leave',
  APPROVE_LEAVE = 'approve_leave',
  VIEW_LEAVE_POLICY = 'view_leave_policy',
  MANAGE_LEAVE_POLICY = 'manage_leave_policy',
  VIEW_CALENDAR_EVENTS = 'view_calendar_events',
  MANAGE_CALENDAR_EVENTS = 'manage_calendar_events',

  // ── Approvals ─────────────────────────────────────────────────────────────
  VIEW_APPROVALS = 'view_approvals',
  MANAGE_APPROVALS = 'manage_approvals',
  MANAGE_APPROVAL_CHAINS = 'manage_approval_chains',

  // ── Communication & support ───────────────────────────────────────────────
  VIEW_COMMUNICATION = 'view_communication',
  MANAGE_COMMUNICATION = 'manage_communication',
  VIEW_COMPLAINTS = 'view_complaints',
  MANAGE_COMPLAINTS = 'manage_complaints',

  // ── HR ────────────────────────────────────────────────────────────────────
  VIEW_STAFF_PROFILES = 'view_staff_profiles',
  MANAGE_STAFF_PROFILES = 'manage_staff_profiles',
  VIEW_HR_RECORDS = 'view_hr_records',
  MANAGE_HR_RECORDS = 'manage_hr_records',

  // ── Financials ────────────────────────────────────────────────────────────
  VIEW_FINANCES = 'view_finances',
  MANAGE_FINANCES = 'manage_finances',
  VIEW_INVOICES = 'view_invoices',
  MANAGE_INVOICES = 'manage_invoices',
  MANAGE_BILLING_POLICY = 'manage_billing_policy',
  VIEW_PROCUREMENT = 'view_procurement',
  MANAGE_PROCUREMENT = 'manage_procurement',
  APPROVE_PROCUREMENT = 'approve_procurement',

  // ── Payroll ───────────────────────────────────────────────────────────────
  VIEW_PAYROLLS = 'view_payrolls',
  MANAGE_PAYROLLS = 'manage_payrolls',
  APPROVE_PAYROLLS = 'approve_payrolls',
  SEND_PAYROLL = 'send_payroll',
  VIEW_PAYROLL_REPORTS = 'view_payroll_reports',
  MANAGE_PAYROLL_SCHEDULES = 'manage_payroll_schedules',

  // ── Fund management ───────────────────────────────────────────────────────
  VIEW_MONTHLY_BUDGETS = 'view_monthly_budgets',
  MANAGE_MONTHLY_BUDGETS = 'manage_monthly_budgets',
  APPROVE_MONTHLY_BUDGETS = 'approve_monthly_budgets',
  VIEW_BRANCH_BUDGET = 'view_branch_budget',
  VIEW_BRANCH_ALLOCATIONS = 'view_branch_allocations',
  MANAGE_BRANCH_ALLOCATIONS = 'manage_branch_allocations',
  APPROVE_BRANCH_ALLOCATIONS = 'approve_branch_allocations',
  VIEW_ALLOCATIONS = 'view_allocations',
  MANAGE_ALLOCATIONS = 'manage_allocations',
  REQUEST_FUNDS = 'request_funds',
  VIEW_FUND_REQUESTS = 'view_fund_requests',
  APPROVE_FUND_REQUESTS = 'approve_fund_requests',
  REQUEST_EXTRA_FUNDS = 'request_extra_funds',
  VIEW_EXTRA_FUND_REQUESTS = 'view_extra_fund_requests',
  APPROVE_EXTRA_FUND_REQUESTS = 'approve_extra_fund_requests',
  VIEW_DISBURSEMENTS = 'view_disbursements',
  MANAGE_DISBURSEMENTS = 'manage_disbursements',
  APPROVE_DISBURSEMENTS = 'approve_disbursements',
}

/**
 * Mirrors the Prisma `PermissionCategory` enum in organization-service. Declared
 * as a string union rather than imported so this package stays free of any
 * Prisma dependency — the values are checked against the generated client where
 * the seed consumes them.
 */
export type PermissionCategoryName =
  | 'DEPARTMENT'
  | 'BUSINESS_USER'
  | 'STAFF'
  | 'ORGANIZATION'
  | 'DESIGNATION';

/** Mirrors the Prisma `PermissionGroupType` enum in organization-service. */
export type PermissionGroupTypeName =
  | 'PAGE_ACCESS'
  | 'SECURITY'
  | 'OPERATIONS'
  | 'STAFF_MANAGEMENT'
  | 'COMMUNICATION'
  | 'FINANCIALS'
  | 'GENERAL';

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

/** [permission, level, description] */
type PermissionRow = [name: PermissionName, level: number, description: string];

function define(
  category: PermissionCategoryName,
  rows: PermissionRow[],
): PermissionDef[] {
  return rows.map(([name, level, description]) => ({
    name,
    level,
    description,
    category,
  }));
}

const P = PermissionName;

// ─── Organization-wide capabilities ──────────────────────────────────────────
// Primarily held by owners and business users. Category is the permission's home
// for catalog queries; the groups decide where it shows up.

const ORGANIZATION_PERMISSIONS: PermissionDef[] = define('BUSINESS_USER', [
  [P.MANAGE_ORGANIZATION, 2, 'Manage organization'],
  [P.VIEW_SETTINGS, 1, 'View settings'],
  [P.MANAGE_SETTINGS, 2, 'Manage settings'],

  [P.VIEW_COMPANIES, 1, 'View companies'],
  [P.MANAGE_COMPANIES, 2, 'Manage companies'],
  [P.VIEW_BRANCHES, 1, 'View branches'],
  [P.MANAGE_BRANCHES, 2, 'Manage branches'],
  [P.RESTRICT_BRANCH_ACCESS, 3, 'Restrict branch access'],

  [P.VIEW_DEPARTMENTS, 1, 'View departments'],
  [P.MANAGE_DEPARTMENTS, 2, 'Manage departments'],
  [P.VIEW_ROLES, 1, 'View roles'],
  [P.MANAGE_ROLES, 2, 'Manage roles'],
  [P.VIEW_PARTNERS, 1, 'View partners'],
  [P.MANAGE_PARTNERS, 2, 'Manage partners'],

  [P.VIEW_STAFF, 1, 'View staff'],
  [P.MANAGE_STAFF, 2, 'Manage staff'],
  [P.MANAGE_INVITATIONS, 2, 'Manage invitations'],

  [P.VIEW_AUDIT, 1, 'View audit'],
  [P.MANAGE_AUDIT, 2, 'Manage audit'],
]);

// ─── Department page access ──────────────────────────────────────────────────
// Gates a specific operational area. Everything else a department role can do
// comes from the general staff set.

const DEPARTMENT_PERMISSIONS: PermissionDef[] = define('DEPARTMENT', [
  [P.ACCESS_KITCHEN, 1, 'Access kitchen'],
  [P.MANAGE_KITCHEN, 2, 'Manage kitchen'],
  [P.ACCESS_RECEPTION, 1, 'Access reception'],
  [P.MANAGE_RECEPTION, 2, 'Manage reception'],
  [P.ACCESS_HOTEL, 1, 'Access hotel'],
  [P.MANAGE_HOTEL, 2, 'Manage hotel'],
  [P.ACCESS_RESTAURANT, 1, 'Access restaurant'],
  [P.MANAGE_RESTAURANT, 2, 'Manage restaurant'],
]);

// ─── Everything else ─────────────────────────────────────────────────────────
// Labels shown in the role editor — keep them short: View / Manage / Approve.

const GENERAL_PERMISSIONS: PermissionDef[] = define('STAFF', [
  // Dashboard & profile
  [P.VIEW_DASHBOARD, 1, 'View dashboard'],
  [P.VIEW_PROFILE, 1, 'View profile'],
  [P.MANAGE_PROFILE, 2, 'Manage profile'],

  // Branch access
  [P.ACCESS_BRANCH, 1, 'Access branch'],
  [P.MANAGE_BRANCH, 2, 'Manage branch'],
  [P.VIEW_ALL_BRANCHES, 1, 'View all branches'],
  [P.VIEW_BRANCH_STAFF, 1, 'View branch staff'],
  [P.VIEW_BRANCH_LEAVE, 1, 'View branch leave'],
  [P.VIEW_BRANCH_APPROVALS, 1, 'View branch approvals'],
  [P.VIEW_BRANCH_FINANCIALS, 1, 'View branch financials'],
  [P.VIEW_BRANCH_SHIFTS, 1, 'View branch shifts'],
  [P.VIEW_BRANCH_TASKS, 1, 'View branch tasks'],
  [P.VIEW_BRANCH_RECEPTION, 1, 'View branch reception'],
  [P.VIEW_BRANCH_FACILITY, 1, 'View branch facility'],

  // Facility
  [P.ACCESS_FACILITY, 1, 'Access facility'],
  [P.MANAGE_FACILITY, 2, 'Manage facility'],

  // Operations, tasks, stock
  [P.VIEW_OPERATIONS, 1, 'View operations'],
  [P.MANAGE_OPERATIONS, 2, 'Manage operations'],
  [P.VIEW_TASKS, 1, 'View tasks'],
  [P.MANAGE_TASKS, 2, 'Manage tasks'],
  [P.VIEW_INVENTORY, 1, 'View inventory'],
  [P.MANAGE_INVENTORY, 2, 'Manage inventory'],
  [P.VIEW_ASSETS, 1, 'View assets'],
  [P.MANAGE_ASSETS, 2, 'Manage assets'],

  // Reception desk — bookings and guests
  [P.VIEW_RESERVATIONS, 1, 'View reservations'],
  [P.MANAGE_RESERVATIONS, 2, 'Manage reservations'],
  [P.APPROVE_RESERVATIONS, 3, 'Approve reservations'],
  [P.VIEW_GUESTS, 1, 'View guests'],
  [P.MANAGE_GUESTS, 2, 'Manage guests'],

  // Schedule, shifts, time, leave
  [P.VIEW_SCHEDULE, 1, 'View schedule'],
  [P.MANAGE_SCHEDULE, 2, 'Manage schedule'],
  [P.VIEW_SHIFTS, 1, 'View shifts'],
  [P.MANAGE_SHIFTS, 2, 'Manage shifts'],
  [P.VIEW_TIME, 1, 'View time'],
  [P.MANAGE_TIME, 2, 'Manage time'],
  [P.VIEW_ATTENDANCE, 1, 'View attendance'],
  [P.MANAGE_ATTENDANCE, 2, 'Manage attendance'],
  [P.VIEW_LEAVE, 1, 'View leave'],
  [P.MANAGE_LEAVE, 2, 'Manage leave'],
  [P.APPROVE_LEAVE, 3, 'Approve leave'],
  [P.VIEW_LEAVE_POLICY, 1, 'View leave policy'],
  [P.MANAGE_LEAVE_POLICY, 2, 'Manage leave policy'],
  [P.VIEW_CALENDAR_EVENTS, 1, 'View calendar'],
  [P.MANAGE_CALENDAR_EVENTS, 2, 'Manage calendar'],

  // Approvals
  [P.VIEW_APPROVALS, 1, 'View approvals'],
  [P.MANAGE_APPROVALS, 2, 'Manage approvals'],
  [P.MANAGE_APPROVAL_CHAINS, 2, 'Manage approval chains'],

  // Communication & support
  [P.VIEW_COMMUNICATION, 1, 'View communication'],
  [P.MANAGE_COMMUNICATION, 2, 'Manage communication'],
  [P.VIEW_COMPLAINTS, 1, 'View complaints'],
  [P.MANAGE_COMPLAINTS, 2, 'Manage complaints'],

  // HR
  [P.VIEW_STAFF_PROFILES, 1, 'View staff profiles'],
  [P.MANAGE_STAFF_PROFILES, 2, 'Manage staff profiles'],
  [P.VIEW_HR_RECORDS, 1, 'View HR records'],
  [P.MANAGE_HR_RECORDS, 2, 'Manage HR records'],

  // Financials
  [P.VIEW_FINANCES, 1, 'View finances'],
  [P.MANAGE_FINANCES, 2, 'Manage finances'],
  [P.VIEW_INVOICES, 1, 'View invoices'],
  [P.MANAGE_INVOICES, 2, 'Manage invoices'],
  [P.MANAGE_BILLING_POLICY, 2, 'Manage billing policy'],
  [P.VIEW_PROCUREMENT, 1, 'View procurement'],
  [P.MANAGE_PROCUREMENT, 2, 'Manage procurement'],
  [P.APPROVE_PROCUREMENT, 3, 'Approve procurement'],

  // Payroll
  [P.VIEW_PAYROLLS, 1, 'View payrolls'],
  [P.MANAGE_PAYROLLS, 2, 'Manage payrolls'],
  [P.APPROVE_PAYROLLS, 3, 'Approve payrolls'],
  [P.SEND_PAYROLL, 3, 'Send payroll'],
  [P.VIEW_PAYROLL_REPORTS, 1, 'View payroll reports'],
  [P.MANAGE_PAYROLL_SCHEDULES, 2, 'Manage payroll schedules'],

  // Fund management
  [P.VIEW_MONTHLY_BUDGETS, 1, 'View monthly budgets'],
  [P.MANAGE_MONTHLY_BUDGETS, 2, 'Manage monthly budgets'],
  [P.APPROVE_MONTHLY_BUDGETS, 3, 'Approve monthly budgets'],
  [P.VIEW_BRANCH_BUDGET, 1, 'View branch budget'],
  [P.VIEW_BRANCH_ALLOCATIONS, 1, 'View branch allocations'],
  [P.MANAGE_BRANCH_ALLOCATIONS, 2, 'Manage branch allocations'],
  [P.APPROVE_BRANCH_ALLOCATIONS, 3, 'Approve branch allocations'],
  [P.VIEW_ALLOCATIONS, 1, 'View allocations'],
  [P.MANAGE_ALLOCATIONS, 2, 'Manage allocations'],
  [P.REQUEST_FUNDS, 2, 'Request funds'],
  [P.VIEW_FUND_REQUESTS, 1, 'View fund requests'],
  [P.APPROVE_FUND_REQUESTS, 3, 'Approve fund requests'],
  [P.REQUEST_EXTRA_FUNDS, 2, 'Request extra funds'],
  [P.VIEW_EXTRA_FUND_REQUESTS, 1, 'View extra fund requests'],
  [P.APPROVE_EXTRA_FUND_REQUESTS, 3, 'Approve extra fund requests'],
  [P.VIEW_DISBURSEMENTS, 1, 'View disbursements'],
  [P.MANAGE_DISBURSEMENTS, 2, 'Manage disbursements'],
  [P.APPROVE_DISBURSEMENTS, 3, 'Approve disbursements'],
]);

export const ALL_PERMISSIONS: PermissionDef[] = [
  ...ORGANIZATION_PERMISSIONS,
  ...DEPARTMENT_PERMISSIONS,
  ...GENERAL_PERMISSIONS,
];

// ─── GROUPS ──────────────────────────────────────────────────────────────────
// Groups are what the role editor renders, and they decide which audience can be
// granted what. A permission outside every group can never be granted from the
// UI. Group names are unique per category, so the same label can appear for both
// a department role and a general staff role.

export const PERMISSION_GROUPS: PermissionGroupDef[] = [
  // ── BUSINESS_USER ─────────────────────────────────────────────────────────
  {
    group_name: 'Organization',
    description: 'Dashboard, organization profile and settings',
    level: 1,
    category: 'BUSINESS_USER',
    group_type: 'GENERAL',
    permissions: [
      P.VIEW_DASHBOARD,
      P.MANAGE_ORGANIZATION,
      P.VIEW_SETTINGS,
      P.MANAGE_SETTINGS,
    ],
  },
  {
    group_name: 'Companies',
    description: 'Companies in the organization',
    level: 1,
    category: 'BUSINESS_USER',
    group_type: 'OPERATIONS',
    permissions: [P.VIEW_COMPANIES, P.MANAGE_COMPANIES],
  },
  {
    group_name: 'Branches',
    description: 'Branches and branch access restrictions',
    level: 1,
    category: 'BUSINESS_USER',
    group_type: 'OPERATIONS',
    permissions: [
      P.VIEW_BRANCHES,
      P.MANAGE_BRANCHES,
      P.RESTRICT_BRANCH_ACCESS,
    ],
  },
  {
    group_name: 'Structure',
    description: 'Departments and designations',
    level: 2,
    category: 'BUSINESS_USER',
    group_type: 'STAFF_MANAGEMENT',
    permissions: [P.VIEW_DEPARTMENTS, P.MANAGE_DEPARTMENTS],
  },
  {
    group_name: 'Roles',
    description: 'Roles, role levels and permission grants',
    level: 2,
    category: 'BUSINESS_USER',
    group_type: 'STAFF_MANAGEMENT',
    permissions: [P.VIEW_ROLES, P.MANAGE_ROLES],
  },
  {
    group_name: 'Partners',
    description: 'Partner companies',
    level: 2,
    category: 'BUSINESS_USER',
    group_type: 'STAFF_MANAGEMENT',
    permissions: [P.VIEW_PARTNERS, P.MANAGE_PARTNERS],
  },
  {
    group_name: 'Staff',
    description: 'Staff records and invitations',
    level: 1,
    category: 'BUSINESS_USER',
    group_type: 'STAFF_MANAGEMENT',
    permissions: [P.VIEW_STAFF, P.MANAGE_STAFF, P.MANAGE_INVITATIONS],
  },
  {
    group_name: 'Operations',
    description: 'Operational data and workflows',
    level: 1,
    category: 'BUSINESS_USER',
    group_type: 'OPERATIONS',
    permissions: [P.VIEW_OPERATIONS, P.MANAGE_OPERATIONS],
  },
  {
    group_name: 'Reservations',
    description: 'Bookings and reservation approvals',
    level: 1,
    category: 'BUSINESS_USER',
    group_type: 'OPERATIONS',
    permissions: [
      P.VIEW_RESERVATIONS,
      P.MANAGE_RESERVATIONS,
      P.APPROVE_RESERVATIONS,
    ],
  },
  {
    group_name: 'Approvals',
    description: 'Approval inbox and chain configuration',
    level: 2,
    category: 'BUSINESS_USER',
    group_type: 'OPERATIONS',
    permissions: [
      P.VIEW_APPROVALS,
      P.MANAGE_APPROVALS,
      P.MANAGE_APPROVAL_CHAINS,
    ],
  },
  {
    group_name: 'Calendar',
    description: 'Company calendar and events',
    level: 1,
    category: 'BUSINESS_USER',
    group_type: 'GENERAL',
    permissions: [P.VIEW_CALENDAR_EVENTS, P.MANAGE_CALENDAR_EVENTS],
  },
  {
    group_name: 'Finances',
    description: 'Financial summaries and settings',
    level: 2,
    category: 'BUSINESS_USER',
    group_type: 'FINANCIALS',
    permissions: [P.VIEW_FINANCES, P.MANAGE_FINANCES],
  },
  {
    group_name: 'Invoices',
    description: 'Invoices and billing policy',
    level: 2,
    category: 'BUSINESS_USER',
    group_type: 'FINANCIALS',
    permissions: [
      P.VIEW_INVOICES,
      P.MANAGE_INVOICES,
      P.MANAGE_BILLING_POLICY,
    ],
  },
  {
    group_name: 'Payroll',
    description: 'Payroll runs, reports and schedules',
    level: 2,
    category: 'BUSINESS_USER',
    group_type: 'FINANCIALS',
    permissions: [
      P.VIEW_PAYROLLS,
      P.MANAGE_PAYROLLS,
      P.APPROVE_PAYROLLS,
      P.VIEW_PAYROLL_REPORTS,
      P.MANAGE_PAYROLL_SCHEDULES,
    ],
  },
  {
    group_name: 'Budgets',
    description: 'Monthly budgets and branch allocations',
    level: 2,
    category: 'BUSINESS_USER',
    group_type: 'FINANCIALS',
    permissions: [
      P.VIEW_MONTHLY_BUDGETS,
      P.MANAGE_MONTHLY_BUDGETS,
      P.APPROVE_MONTHLY_BUDGETS,
      P.VIEW_BRANCH_ALLOCATIONS,
      P.MANAGE_BRANCH_ALLOCATIONS,
      P.APPROVE_BRANCH_ALLOCATIONS,
    ],
  },
  {
    group_name: 'Fund Requests',
    description: 'Fund and extra-fund requests',
    level: 2,
    category: 'BUSINESS_USER',
    group_type: 'FINANCIALS',
    permissions: [
      P.VIEW_FUND_REQUESTS,
      P.APPROVE_FUND_REQUESTS,
      P.VIEW_EXTRA_FUND_REQUESTS,
      P.APPROVE_EXTRA_FUND_REQUESTS,
    ],
  },
  {
    group_name: 'Disbursements',
    description: 'Fund disbursements',
    level: 2,
    category: 'BUSINESS_USER',
    group_type: 'FINANCIALS',
    permissions: [P.VIEW_DISBURSEMENTS, P.APPROVE_DISBURSEMENTS],
  },
  {
    group_name: 'Procurement',
    description: 'Vendors, requisitions and purchase orders',
    level: 2,
    category: 'BUSINESS_USER',
    group_type: 'FINANCIALS',
    permissions: [
      P.VIEW_PROCUREMENT,
      P.MANAGE_PROCUREMENT,
      P.APPROVE_PROCUREMENT,
    ],
  },
  {
    group_name: 'Audit',
    description: 'Audit logs and compliance',
    level: 2,
    category: 'BUSINESS_USER',
    group_type: 'SECURITY',
    permissions: [P.VIEW_AUDIT, P.MANAGE_AUDIT],
  },

  // ── DEPARTMENT ────────────────────────────────────────────────────────────
  {
    group_name: 'Kitchen',
    description: 'Kitchen page access',
    level: 1,
    category: 'DEPARTMENT',
    group_type: 'PAGE_ACCESS',
    permissions: [P.ACCESS_KITCHEN, P.MANAGE_KITCHEN],
  },
  {
    group_name: 'Reception',
    description: 'Reception desk and reservations',
    level: 1,
    category: 'DEPARTMENT',
    group_type: 'PAGE_ACCESS',
    permissions: [
      P.ACCESS_RECEPTION,
      P.MANAGE_RECEPTION,
      P.VIEW_RESERVATIONS,
      P.MANAGE_RESERVATIONS,
      P.APPROVE_RESERVATIONS,
    ],
  },
  {
    group_name: 'Hotel',
    description: 'Hotel page access',
    level: 1,
    category: 'DEPARTMENT',
    group_type: 'PAGE_ACCESS',
    permissions: [P.ACCESS_HOTEL, P.MANAGE_HOTEL],
  },
  {
    group_name: 'Restaurant',
    description: 'Restaurant page access',
    level: 1,
    category: 'DEPARTMENT',
    group_type: 'PAGE_ACCESS',
    permissions: [P.ACCESS_RESTAURANT, P.MANAGE_RESTAURANT],
  },

  // ── STAFF ─────────────────────────────────────────────────────────────────
  {
    group_name: 'Dashboard',
    description: 'Dashboard, profile and settings',
    level: 1,
    category: 'STAFF',
    group_type: 'GENERAL',
    permissions: [
      P.VIEW_DASHBOARD,
      P.VIEW_PROFILE,
      P.MANAGE_PROFILE,
      P.VIEW_SETTINGS,
    ],
  },
  {
    group_name: 'Branch Access',
    description: 'Branch pages and cross-branch scopes',
    level: 1,
    category: 'STAFF',
    group_type: 'PAGE_ACCESS',
    permissions: [
      P.ACCESS_BRANCH,
      P.MANAGE_BRANCH,
      P.VIEW_ALL_BRANCHES,
      P.VIEW_BRANCH_STAFF,
      P.VIEW_BRANCH_LEAVE,
      P.VIEW_BRANCH_APPROVALS,
      P.VIEW_BRANCH_FINANCIALS,
      P.VIEW_BRANCH_SHIFTS,
      P.VIEW_BRANCH_TASKS,
      P.VIEW_BRANCH_RECEPTION,
      P.VIEW_BRANCH_FACILITY,
    ],
  },
  {
    group_name: 'Facility',
    description: 'Facility layout and occupancy',
    level: 1,
    category: 'STAFF',
    group_type: 'PAGE_ACCESS',
    permissions: [P.ACCESS_FACILITY, P.MANAGE_FACILITY],
  },
  {
    group_name: 'Reception',
    description: 'Reception desk access',
    level: 1,
    category: 'STAFF',
    group_type: 'PAGE_ACCESS',
    permissions: [P.ACCESS_RECEPTION, P.MANAGE_RECEPTION],
  },
  {
    group_name: 'Reservations',
    description: 'Bookings and reservation approvals',
    level: 1,
    category: 'STAFF',
    group_type: 'OPERATIONS',
    permissions: [
      P.VIEW_RESERVATIONS,
      P.MANAGE_RESERVATIONS,
      P.APPROVE_RESERVATIONS,
    ],
  },
  {
    group_name: 'Guests',
    description: 'Guest profiles',
    level: 1,
    category: 'STAFF',
    group_type: 'OPERATIONS',
    permissions: [P.VIEW_GUESTS, P.MANAGE_GUESTS],
  },
  {
    group_name: 'Tasks',
    description: 'Tasks and work orders',
    level: 1,
    category: 'STAFF',
    group_type: 'OPERATIONS',
    permissions: [P.VIEW_TASKS, P.MANAGE_TASKS],
  },
  {
    group_name: 'Operations',
    description: 'Operational data',
    level: 1,
    category: 'STAFF',
    group_type: 'OPERATIONS',
    permissions: [P.VIEW_OPERATIONS, P.MANAGE_OPERATIONS],
  },
  {
    group_name: 'Inventory',
    description: 'Inventory and assets',
    level: 1,
    category: 'STAFF',
    group_type: 'OPERATIONS',
    permissions: [
      P.VIEW_INVENTORY,
      P.MANAGE_INVENTORY,
      P.VIEW_ASSETS,
      P.MANAGE_ASSETS,
    ],
  },
  {
    group_name: 'Schedule',
    description: 'Schedules and shifts',
    level: 1,
    category: 'STAFF',
    group_type: 'OPERATIONS',
    permissions: [
      P.VIEW_SCHEDULE,
      P.MANAGE_SCHEDULE,
      P.VIEW_SHIFTS,
      P.MANAGE_SHIFTS,
    ],
  },
  {
    group_name: 'Time & Attendance',
    description: 'Time tracking and attendance',
    level: 1,
    category: 'STAFF',
    group_type: 'OPERATIONS',
    permissions: [
      P.VIEW_TIME,
      P.MANAGE_TIME,
      P.VIEW_ATTENDANCE,
      P.MANAGE_ATTENDANCE,
    ],
  },
  {
    group_name: 'Leave',
    description: 'Leave requests, balances and policies',
    level: 1,
    category: 'STAFF',
    group_type: 'STAFF_MANAGEMENT',
    permissions: [
      P.VIEW_LEAVE,
      P.MANAGE_LEAVE,
      P.APPROVE_LEAVE,
      P.VIEW_LEAVE_POLICY,
      P.MANAGE_LEAVE_POLICY,
    ],
  },
  {
    group_name: 'Calendar',
    description: 'Company calendar and events',
    level: 1,
    category: 'STAFF',
    group_type: 'GENERAL',
    permissions: [P.VIEW_CALENDAR_EVENTS, P.MANAGE_CALENDAR_EVENTS],
  },
  {
    group_name: 'Approvals',
    description: 'Approval inbox and chain configuration',
    level: 1,
    category: 'STAFF',
    group_type: 'OPERATIONS',
    permissions: [
      P.VIEW_APPROVALS,
      P.MANAGE_APPROVALS,
      P.MANAGE_APPROVAL_CHAINS,
    ],
  },
  {
    group_name: 'Communication',
    description: 'Messaging and announcements',
    level: 1,
    category: 'STAFF',
    group_type: 'COMMUNICATION',
    permissions: [P.VIEW_COMMUNICATION, P.MANAGE_COMMUNICATION],
  },
  {
    group_name: 'Complaints',
    description: 'Complaints and support tickets',
    level: 1,
    category: 'STAFF',
    group_type: 'COMMUNICATION',
    permissions: [P.VIEW_COMPLAINTS, P.MANAGE_COMPLAINTS],
  },
  {
    group_name: 'Staff Profiles',
    description: 'Other staff profiles',
    level: 1,
    category: 'STAFF',
    group_type: 'STAFF_MANAGEMENT',
    permissions: [P.VIEW_STAFF_PROFILES, P.MANAGE_STAFF_PROFILES],
  },
  {
    group_name: 'HR Records',
    description: 'Contracts, documents and performance',
    level: 1,
    category: 'STAFF',
    group_type: 'STAFF_MANAGEMENT',
    permissions: [P.VIEW_HR_RECORDS, P.MANAGE_HR_RECORDS],
  },
  {
    group_name: 'Payroll',
    description: 'Payroll runs, reports and schedules',
    level: 2,
    category: 'STAFF',
    group_type: 'FINANCIALS',
    permissions: [
      P.VIEW_PAYROLLS,
      P.MANAGE_PAYROLLS,
      P.SEND_PAYROLL,
      P.VIEW_PAYROLL_REPORTS,
      P.MANAGE_PAYROLL_SCHEDULES,
    ],
  },
  {
    group_name: 'Invoices',
    description: 'Invoices and remittances',
    level: 2,
    category: 'STAFF',
    group_type: 'FINANCIALS',
    permissions: [P.VIEW_INVOICES, P.MANAGE_INVOICES],
  },
  {
    group_name: 'Procurement',
    description: 'Vendors, requisitions and purchase orders',
    level: 2,
    category: 'STAFF',
    group_type: 'FINANCIALS',
    permissions: [P.VIEW_PROCUREMENT, P.MANAGE_PROCUREMENT],
  },
  {
    group_name: 'Fund Requests',
    description: 'Branch budget and fund request submission',
    level: 2,
    category: 'STAFF',
    group_type: 'FINANCIALS',
    permissions: [
      P.VIEW_BRANCH_BUDGET,
      P.REQUEST_FUNDS,
      P.VIEW_FUND_REQUESTS,
      P.REQUEST_EXTRA_FUNDS,
      P.VIEW_EXTRA_FUND_REQUESTS,
    ],
  },
  {
    group_name: 'Disbursements',
    description: 'Disbursements',
    level: 2,
    category: 'STAFF',
    group_type: 'FINANCIALS',
    permissions: [
      P.VIEW_DISBURSEMENTS,
      P.MANAGE_DISBURSEMENTS,
      P.APPROVE_DISBURSEMENTS,
    ],
  },
  {
    group_name: 'Allocations',
    description: 'Fund allocations',
    level: 2,
    category: 'STAFF',
    group_type: 'FINANCIALS',
    permissions: [P.VIEW_ALLOCATIONS, P.MANAGE_ALLOCATIONS],
  },
];

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
export const LEGACY_PERMISSION_RENAMES: Record<string, PermissionName> = {
  profile: P.MANAGE_PROFILE,
  view_payroll: P.VIEW_PAYROLLS,
  manage_payroll: P.MANAGE_PAYROLLS,

  staff_view_all_branches: P.VIEW_ALL_BRANCHES,
  staff_view_branch_staff: P.VIEW_BRANCH_STAFF,
  staff_view_branch_leave: P.VIEW_BRANCH_LEAVE,
  staff_view_branch_approvals: P.VIEW_BRANCH_APPROVALS,
  staff_view_branch_financials: P.VIEW_BRANCH_FINANCIALS,
  staff_view_branch_shifts: P.VIEW_BRANCH_SHIFTS,
  staff_view_branch_tasks: P.VIEW_BRANCH_TASKS,
  staff_view_branch_reception: P.VIEW_BRANCH_RECEPTION,
  staff_view_branch_facility: P.VIEW_BRANCH_FACILITY,
  staff_access_facility: P.ACCESS_FACILITY,
  staff_manage_facility: P.MANAGE_FACILITY,
  staff_access_reception: P.ACCESS_RECEPTION,
  staff_manage_reception: P.MANAGE_RECEPTION,
  staff_view_dashboard: P.VIEW_DASHBOARD,
  staff_view_operations: P.VIEW_OPERATIONS,
  staff_manage_operations: P.MANAGE_OPERATIONS,
  staff_access_branch: P.ACCESS_BRANCH,
  staff_manage_branch: P.MANAGE_BRANCH,
  staff_view_payroll: P.VIEW_PAYROLLS,
  staff_manage_payroll: P.MANAGE_PAYROLLS,
  staff_manage_schedule: P.MANAGE_SCHEDULE,
};

/** Every slug, in catalog order. */
export const ALL_PERMISSION_NAMES: PermissionName[] = ALL_PERMISSIONS.map(
  (p) => p.name,
);

const PERMISSION_NAME_SET = new Set<string>(ALL_PERMISSION_NAMES);

/** Narrows an arbitrary string to a known slug — use before trusting user input. */
export function isPermissionName(value: string): value is PermissionName {
  return PERMISSION_NAME_SET.has(value);
}

/** Resolves a legacy slug to its canonical form; returns unknown slugs unchanged. */
export function canonicalPermissionName(value: string): string {
  return LEGACY_PERMISSION_RENAMES[value] ?? value;
}

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
export const BOOTSTRAP_ROLE_SLUGS = {
  /** Organization-wide admin, held by business users. Assigned to the creator. */
  BUSINESS_ADMIN: "business-admin",
  /** Company-wide admin, held by staff. Assigned to staff as they are onboarded. */
  ADMIN_USER: "admin-user",
} as const;

export type BootstrapRoleSlug =
  (typeof BOOTSTRAP_ROLE_SLUGS)[keyof typeof BOOTSTRAP_ROLE_SLUGS];

/**
 * Old bootstrap slug → current slug.
 *
 * Provisioning matches an existing role by slug, so a rename without this map
 * would leave the old role in place and create a second one beside it. The
 * organization-service provisioner renames in place instead, which keeps every
 * staff assignment pointing at the same role_id.
 */
export const LEGACY_BOOTSTRAP_ROLE_SLUGS: Record<string, BootstrapRoleSlug> = {
  "staff-admin": BOOTSTRAP_ROLE_SLUGS.ADMIN_USER,
};

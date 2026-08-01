"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_PERMISSION_NAMES = exports.LEGACY_PERMISSION_RENAMES = exports.PERMISSION_GROUPS = exports.ALL_PERMISSIONS = exports.PermissionName = void 0;
exports.isPermissionName = isPermissionName;
exports.canonicalPermissionName = canonicalPermissionName;
/** Every permission slug the platform recognises. */
var PermissionName;
(function (PermissionName) {
    // ── Organization-wide ──────────────────────────────────────────────────────
    PermissionName["MANAGE_ORGANIZATION"] = "manage_organization";
    PermissionName["VIEW_SETTINGS"] = "view_settings";
    PermissionName["MANAGE_SETTINGS"] = "manage_settings";
    PermissionName["VIEW_COMPANIES"] = "view_companies";
    PermissionName["MANAGE_COMPANIES"] = "manage_companies";
    PermissionName["VIEW_BRANCHES"] = "view_branches";
    PermissionName["MANAGE_BRANCHES"] = "manage_branches";
    PermissionName["RESTRICT_BRANCH_ACCESS"] = "restrict_branch_access";
    PermissionName["VIEW_DEPARTMENTS"] = "view_departments";
    PermissionName["MANAGE_DEPARTMENTS"] = "manage_departments";
    PermissionName["VIEW_ROLES"] = "view_roles";
    PermissionName["MANAGE_ROLES"] = "manage_roles";
    PermissionName["VIEW_PARTNERS"] = "view_partners";
    PermissionName["MANAGE_PARTNERS"] = "manage_partners";
    PermissionName["VIEW_STAFF"] = "view_staff";
    PermissionName["MANAGE_STAFF"] = "manage_staff";
    PermissionName["MANAGE_INVITATIONS"] = "manage_invitations";
    PermissionName["VIEW_AUDIT"] = "view_audit";
    PermissionName["MANAGE_AUDIT"] = "manage_audit";
    // ── Department page access ────────────────────────────────────────────────
    PermissionName["ACCESS_KITCHEN"] = "access_kitchen";
    PermissionName["MANAGE_KITCHEN"] = "manage_kitchen";
    PermissionName["ACCESS_RECEPTION"] = "access_reception";
    PermissionName["MANAGE_RECEPTION"] = "manage_reception";
    PermissionName["ACCESS_HOTEL"] = "access_hotel";
    PermissionName["MANAGE_HOTEL"] = "manage_hotel";
    PermissionName["ACCESS_RESTAURANT"] = "access_restaurant";
    PermissionName["MANAGE_RESTAURANT"] = "manage_restaurant";
    // ── Dashboard & profile ───────────────────────────────────────────────────
    PermissionName["VIEW_DASHBOARD"] = "view_dashboard";
    PermissionName["VIEW_PROFILE"] = "view_profile";
    PermissionName["MANAGE_PROFILE"] = "manage_profile";
    // ── Branch access ─────────────────────────────────────────────────────────
    // The `view_branch_*` slugs widen a scope to other branches; they map to
    // BranchPermissionScope in organization-service/branch-scope-permissions.util.ts.
    PermissionName["ACCESS_BRANCH"] = "access_branch";
    PermissionName["MANAGE_BRANCH"] = "manage_branch";
    PermissionName["VIEW_ALL_BRANCHES"] = "view_all_branches";
    PermissionName["VIEW_BRANCH_STAFF"] = "view_branch_staff";
    PermissionName["VIEW_BRANCH_LEAVE"] = "view_branch_leave";
    PermissionName["VIEW_BRANCH_APPROVALS"] = "view_branch_approvals";
    PermissionName["VIEW_BRANCH_FINANCIALS"] = "view_branch_financials";
    PermissionName["VIEW_BRANCH_SHIFTS"] = "view_branch_shifts";
    PermissionName["VIEW_BRANCH_TASKS"] = "view_branch_tasks";
    PermissionName["VIEW_BRANCH_RECEPTION"] = "view_branch_reception";
    PermissionName["VIEW_BRANCH_FACILITY"] = "view_branch_facility";
    // ── Facility ──────────────────────────────────────────────────────────────
    PermissionName["ACCESS_FACILITY"] = "access_facility";
    PermissionName["MANAGE_FACILITY"] = "manage_facility";
    // ── Operations, tasks, stock ──────────────────────────────────────────────
    PermissionName["VIEW_OPERATIONS"] = "view_operations";
    PermissionName["MANAGE_OPERATIONS"] = "manage_operations";
    PermissionName["VIEW_TASKS"] = "view_tasks";
    PermissionName["MANAGE_TASKS"] = "manage_tasks";
    PermissionName["VIEW_INVENTORY"] = "view_inventory";
    PermissionName["MANAGE_INVENTORY"] = "manage_inventory";
    PermissionName["VIEW_ASSETS"] = "view_assets";
    PermissionName["MANAGE_ASSETS"] = "manage_assets";
    // ── Reception desk — bookings and guests ──────────────────────────────────
    PermissionName["VIEW_RESERVATIONS"] = "view_reservations";
    PermissionName["MANAGE_RESERVATIONS"] = "manage_reservations";
    PermissionName["APPROVE_RESERVATIONS"] = "approve_reservations";
    PermissionName["VIEW_GUESTS"] = "view_guests";
    PermissionName["MANAGE_GUESTS"] = "manage_guests";
    // ── Schedule, shifts, time, leave ─────────────────────────────────────────
    PermissionName["VIEW_SCHEDULE"] = "view_schedule";
    PermissionName["MANAGE_SCHEDULE"] = "manage_schedule";
    PermissionName["VIEW_SHIFTS"] = "view_shifts";
    PermissionName["MANAGE_SHIFTS"] = "manage_shifts";
    PermissionName["VIEW_TIME"] = "view_time";
    PermissionName["MANAGE_TIME"] = "manage_time";
    PermissionName["VIEW_ATTENDANCE"] = "view_attendance";
    PermissionName["MANAGE_ATTENDANCE"] = "manage_attendance";
    PermissionName["VIEW_LEAVE"] = "view_leave";
    PermissionName["MANAGE_LEAVE"] = "manage_leave";
    PermissionName["APPROVE_LEAVE"] = "approve_leave";
    PermissionName["VIEW_CALENDAR_EVENTS"] = "view_calendar_events";
    PermissionName["MANAGE_CALENDAR_EVENTS"] = "manage_calendar_events";
    // ── Approvals ─────────────────────────────────────────────────────────────
    PermissionName["VIEW_APPROVALS"] = "view_approvals";
    PermissionName["MANAGE_APPROVALS"] = "manage_approvals";
    PermissionName["MANAGE_APPROVAL_CHAINS"] = "manage_approval_chains";
    // ── Communication & support ───────────────────────────────────────────────
    PermissionName["VIEW_COMMUNICATION"] = "view_communication";
    PermissionName["MANAGE_COMMUNICATION"] = "manage_communication";
    PermissionName["VIEW_COMPLAINTS"] = "view_complaints";
    PermissionName["MANAGE_COMPLAINTS"] = "manage_complaints";
    // ── HR ────────────────────────────────────────────────────────────────────
    PermissionName["VIEW_STAFF_PROFILES"] = "view_staff_profiles";
    PermissionName["MANAGE_STAFF_PROFILES"] = "manage_staff_profiles";
    PermissionName["VIEW_HR_RECORDS"] = "view_hr_records";
    PermissionName["MANAGE_HR_RECORDS"] = "manage_hr_records";
    // ── Financials ────────────────────────────────────────────────────────────
    PermissionName["VIEW_FINANCES"] = "view_finances";
    PermissionName["MANAGE_FINANCES"] = "manage_finances";
    PermissionName["VIEW_INVOICES"] = "view_invoices";
    PermissionName["MANAGE_INVOICES"] = "manage_invoices";
    PermissionName["MANAGE_BILLING_POLICY"] = "manage_billing_policy";
    PermissionName["VIEW_PROCUREMENT"] = "view_procurement";
    PermissionName["MANAGE_PROCUREMENT"] = "manage_procurement";
    PermissionName["APPROVE_PROCUREMENT"] = "approve_procurement";
    // ── Payroll ───────────────────────────────────────────────────────────────
    PermissionName["VIEW_PAYROLLS"] = "view_payrolls";
    PermissionName["MANAGE_PAYROLLS"] = "manage_payrolls";
    PermissionName["APPROVE_PAYROLLS"] = "approve_payrolls";
    PermissionName["SEND_PAYROLL"] = "send_payroll";
    PermissionName["VIEW_PAYROLL_REPORTS"] = "view_payroll_reports";
    PermissionName["MANAGE_PAYROLL_SCHEDULES"] = "manage_payroll_schedules";
    // ── Fund management ───────────────────────────────────────────────────────
    PermissionName["VIEW_MONTHLY_BUDGETS"] = "view_monthly_budgets";
    PermissionName["MANAGE_MONTHLY_BUDGETS"] = "manage_monthly_budgets";
    PermissionName["APPROVE_MONTHLY_BUDGETS"] = "approve_monthly_budgets";
    PermissionName["VIEW_BRANCH_BUDGET"] = "view_branch_budget";
    PermissionName["VIEW_BRANCH_ALLOCATIONS"] = "view_branch_allocations";
    PermissionName["MANAGE_BRANCH_ALLOCATIONS"] = "manage_branch_allocations";
    PermissionName["APPROVE_BRANCH_ALLOCATIONS"] = "approve_branch_allocations";
    PermissionName["VIEW_ALLOCATIONS"] = "view_allocations";
    PermissionName["MANAGE_ALLOCATIONS"] = "manage_allocations";
    PermissionName["REQUEST_FUNDS"] = "request_funds";
    PermissionName["VIEW_FUND_REQUESTS"] = "view_fund_requests";
    PermissionName["APPROVE_FUND_REQUESTS"] = "approve_fund_requests";
    PermissionName["REQUEST_EXTRA_FUNDS"] = "request_extra_funds";
    PermissionName["VIEW_EXTRA_FUND_REQUESTS"] = "view_extra_fund_requests";
    PermissionName["APPROVE_EXTRA_FUND_REQUESTS"] = "approve_extra_fund_requests";
    PermissionName["VIEW_DISBURSEMENTS"] = "view_disbursements";
    PermissionName["MANAGE_DISBURSEMENTS"] = "manage_disbursements";
    PermissionName["APPROVE_DISBURSEMENTS"] = "approve_disbursements";
})(PermissionName || (exports.PermissionName = PermissionName = {}));
function define(category, rows) {
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
const ORGANIZATION_PERMISSIONS = define('BUSINESS_USER', [
    [P.MANAGE_ORGANIZATION, 2, 'Manage organization profile and settings'],
    [P.VIEW_SETTINGS, 1, 'View settings'],
    [P.MANAGE_SETTINGS, 2, 'Change settings'],
    [P.VIEW_COMPANIES, 1, 'View companies in the organization'],
    [P.MANAGE_COMPANIES, 2, 'Create and update companies'],
    [P.VIEW_BRANCHES, 1, 'View branches'],
    [P.MANAGE_BRANCHES, 2, 'Create and update branches'],
    [P.RESTRICT_BRANCH_ACCESS, 3, 'Restrict which branches a role can reach'],
    [P.VIEW_DEPARTMENTS, 1, 'View departments and designations'],
    [P.MANAGE_DEPARTMENTS, 2, 'Create and update departments and designations'],
    [P.VIEW_ROLES, 1, 'View roles and role levels'],
    [P.MANAGE_ROLES, 2, 'Create roles and assign permissions'],
    [P.VIEW_PARTNERS, 1, 'View partner companies'],
    [P.MANAGE_PARTNERS, 2, 'Onboard and manage partner companies'],
    [P.VIEW_STAFF, 1, 'View staff records across the organization'],
    [P.MANAGE_STAFF, 2, 'Onboard, update and offboard staff'],
    [P.MANAGE_INVITATIONS, 2, 'Send and revoke staff invitations'],
    [P.VIEW_AUDIT, 1, 'View audit logs'],
    [P.MANAGE_AUDIT, 2, 'Manage audit and compliance settings'],
]);
// ─── Department page access ──────────────────────────────────────────────────
// Gates a specific operational area. Everything else a department role can do
// comes from the general staff set.
const DEPARTMENT_PERMISSIONS = define('DEPARTMENT', [
    [P.ACCESS_KITCHEN, 1, 'Open kitchen pages'],
    [P.MANAGE_KITCHEN, 2, 'Manage kitchen operations and menu'],
    [P.ACCESS_RECEPTION, 1, 'Open reception pages'],
    [P.MANAGE_RECEPTION, 2, 'Manage reception operations'],
    [P.ACCESS_HOTEL, 1, 'Open hotel pages'],
    [P.MANAGE_HOTEL, 2, 'Manage hotel operations'],
    [P.ACCESS_RESTAURANT, 1, 'Open restaurant pages'],
    [P.MANAGE_RESTAURANT, 2, 'Manage restaurant operations'],
]);
// ─── Everything else ─────────────────────────────────────────────────────────
const GENERAL_PERMISSIONS = define('STAFF', [
    // Dashboard & profile
    [P.VIEW_DASHBOARD, 1, 'View the dashboard'],
    [P.VIEW_PROFILE, 1, 'View own profile'],
    [P.MANAGE_PROFILE, 2, 'Edit own profile'],
    // Branch access
    [P.ACCESS_BRANCH, 1, 'Open branch pages'],
    [P.MANAGE_BRANCH, 2, 'Manage branch settings'],
    [P.VIEW_ALL_BRANCHES, 1, 'Work across every branch in the company'],
    [P.VIEW_BRANCH_STAFF, 1, 'View staff at other branches'],
    [P.VIEW_BRANCH_LEAVE, 1, 'View leave at other branches'],
    [P.VIEW_BRANCH_APPROVALS, 1, 'View approvals at other branches'],
    [P.VIEW_BRANCH_FINANCIALS, 1, 'View payroll and financials at other branches'],
    [P.VIEW_BRANCH_SHIFTS, 1, 'View shifts at other branches'],
    [P.VIEW_BRANCH_TASKS, 1, 'View tasks at other branches'],
    [P.VIEW_BRANCH_RECEPTION, 1, 'View reception at other branches'],
    [P.VIEW_BRANCH_FACILITY, 1, 'View facility at other branches'],
    // Facility
    [P.ACCESS_FACILITY, 1, 'View facility layout and occupancy'],
    [P.MANAGE_FACILITY, 2, 'Manage facility layout and occupancy'],
    // Operations, tasks, stock
    [P.VIEW_OPERATIONS, 1, 'View operational data'],
    [P.MANAGE_OPERATIONS, 2, 'Manage operations'],
    [P.VIEW_TASKS, 1, 'View assigned tasks'],
    [P.MANAGE_TASKS, 2, 'Create and assign tasks'],
    [P.VIEW_INVENTORY, 1, 'View inventory'],
    [P.MANAGE_INVENTORY, 2, 'Adjust inventory'],
    [P.VIEW_ASSETS, 1, 'View assets'],
    [P.MANAGE_ASSETS, 2, 'Manage assets'],
    // Reception desk — bookings and guests
    [P.VIEW_RESERVATIONS, 1, 'View bookings and reservations'],
    [P.MANAGE_RESERVATIONS, 2, 'Create, edit and check in bookings'],
    [P.APPROVE_RESERVATIONS, 3, 'Approve or decline booking requests'],
    [P.VIEW_GUESTS, 1, 'View guest profiles'],
    [P.MANAGE_GUESTS, 2, 'Create and edit guest profiles'],
    // Schedule, shifts, time, leave
    [P.VIEW_SCHEDULE, 1, 'View work schedule'],
    [P.MANAGE_SCHEDULE, 2, 'Create and edit schedules'],
    [P.VIEW_SHIFTS, 1, 'View shifts'],
    [P.MANAGE_SHIFTS, 2, 'Create and assign shifts'],
    [P.VIEW_TIME, 1, 'View time tracking records'],
    [P.MANAGE_TIME, 2, 'Manage time and attendance records'],
    [P.VIEW_ATTENDANCE, 1, 'View attendance'],
    [P.MANAGE_ATTENDANCE, 2, 'Record and correct attendance'],
    [P.VIEW_LEAVE, 1, 'View leave requests and balances'],
    [P.MANAGE_LEAVE, 2, 'Submit and manage leave requests'],
    [P.APPROVE_LEAVE, 3, 'Approve or decline leave requests'],
    [P.VIEW_CALENDAR_EVENTS, 1, 'View the company calendar'],
    [P.MANAGE_CALENDAR_EVENTS, 2, 'Create and edit calendar events'],
    // Approvals
    [P.VIEW_APPROVALS, 1, 'View approval requests'],
    [P.MANAGE_APPROVALS, 2, 'Act on approval requests routed to the role'],
    [P.MANAGE_APPROVAL_CHAINS, 2, 'Configure approval chains and steps'],
    // Communication & support
    [P.VIEW_COMMUNICATION, 1, 'View messages and announcements'],
    [P.MANAGE_COMMUNICATION, 2, 'Send and manage communications'],
    [P.VIEW_COMPLAINTS, 1, 'View complaints and support tickets'],
    [P.MANAGE_COMPLAINTS, 2, 'Respond to and resolve complaints'],
    // HR
    [P.VIEW_STAFF_PROFILES, 1, 'View other staff profiles'],
    [P.MANAGE_STAFF_PROFILES, 2, 'Edit other staff profiles'],
    [P.VIEW_HR_RECORDS, 1, 'View contracts, documents and performance records'],
    [
        P.MANAGE_HR_RECORDS,
        2,
        'Manage contracts, documents and performance records',
    ],
    // Financials
    [P.VIEW_FINANCES, 1, 'View financial summaries'],
    [P.MANAGE_FINANCES, 2, 'Manage financial settings'],
    [P.VIEW_INVOICES, 1, 'View invoices and remittances'],
    [P.MANAGE_INVOICES, 2, 'Issue and update invoices'],
    [P.MANAGE_BILLING_POLICY, 2, 'Configure billing policies'],
    [P.VIEW_PROCUREMENT, 1, 'View vendors, requisitions and purchase orders'],
    [P.MANAGE_PROCUREMENT, 2, 'Raise and manage procurement documents'],
    [P.APPROVE_PROCUREMENT, 3, 'Approve purchase requests and orders'],
    // Payroll
    [P.VIEW_PAYROLLS, 1, 'View payroll records'],
    [P.MANAGE_PAYROLLS, 2, 'Manage payroll entries'],
    [P.APPROVE_PAYROLLS, 3, 'Approve payroll runs'],
    [P.SEND_PAYROLL, 3, 'Release payroll for payment'],
    [P.VIEW_PAYROLL_REPORTS, 1, 'View payroll reports'],
    [P.MANAGE_PAYROLL_SCHEDULES, 2, 'Configure payroll schedules'],
    // Fund management
    [P.VIEW_MONTHLY_BUDGETS, 1, 'View monthly budgets'],
    [P.MANAGE_MONTHLY_BUDGETS, 2, 'Create and edit monthly budgets'],
    [P.APPROVE_MONTHLY_BUDGETS, 3, 'Approve monthly budgets'],
    [P.VIEW_BRANCH_BUDGET, 1, 'View the branch budget'],
    [P.VIEW_BRANCH_ALLOCATIONS, 1, 'View branch fund allocations'],
    [P.MANAGE_BRANCH_ALLOCATIONS, 2, 'Manage branch fund allocations'],
    [P.APPROVE_BRANCH_ALLOCATIONS, 3, 'Approve branch fund allocations'],
    [P.VIEW_ALLOCATIONS, 1, 'View fund allocations'],
    [P.MANAGE_ALLOCATIONS, 2, 'Manage fund allocations'],
    [P.REQUEST_FUNDS, 2, 'Submit fund requests'],
    [P.VIEW_FUND_REQUESTS, 1, 'View fund requests'],
    [P.APPROVE_FUND_REQUESTS, 3, 'Approve fund requests'],
    [P.REQUEST_EXTRA_FUNDS, 2, 'Submit extra fund requests'],
    [P.VIEW_EXTRA_FUND_REQUESTS, 1, 'View extra fund requests'],
    [P.APPROVE_EXTRA_FUND_REQUESTS, 3, 'Approve extra fund requests'],
    [P.VIEW_DISBURSEMENTS, 1, 'View disbursements'],
    [P.MANAGE_DISBURSEMENTS, 2, 'Manage disbursements'],
    [P.APPROVE_DISBURSEMENTS, 3, 'Approve disbursements'],
]);
exports.ALL_PERMISSIONS = [
    ...ORGANIZATION_PERMISSIONS,
    ...DEPARTMENT_PERMISSIONS,
    ...GENERAL_PERMISSIONS,
];
// ─── GROUPS ──────────────────────────────────────────────────────────────────
// Groups are what the role editor renders, and they decide which audience can be
// granted what. A permission outside every group can never be granted from the
// UI. Group names are unique per category, so the same label can appear for both
// a department role and a general staff role.
exports.PERMISSION_GROUPS = [
    // ── BUSINESS_USER ─────────────────────────────────────────────────────────
    {
        group_name: 'Organization Overview',
        description: 'Dashboard and top-level organization settings',
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
        group_name: 'Company Management',
        description: 'Create and manage companies within the organization',
        level: 1,
        category: 'BUSINESS_USER',
        group_type: 'OPERATIONS',
        permissions: [P.VIEW_COMPANIES, P.MANAGE_COMPANIES],
    },
    {
        group_name: 'Branch Management',
        description: 'Manage branches and control branch-level access',
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
        group_name: 'Structure & Roles',
        description: 'Departments, designations, roles and partner companies',
        level: 2,
        category: 'BUSINESS_USER',
        group_type: 'STAFF_MANAGEMENT',
        permissions: [
            P.VIEW_DEPARTMENTS,
            P.MANAGE_DEPARTMENTS,
            P.VIEW_ROLES,
            P.MANAGE_ROLES,
            P.VIEW_PARTNERS,
            P.MANAGE_PARTNERS,
        ],
    },
    {
        group_name: 'Staff Management',
        description: 'View, onboard and manage staff across the organization',
        level: 1,
        category: 'BUSINESS_USER',
        group_type: 'STAFF_MANAGEMENT',
        permissions: [P.VIEW_STAFF, P.MANAGE_STAFF, P.MANAGE_INVITATIONS],
    },
    {
        group_name: 'Operations & Bookings',
        description: 'Operational data plus the booking and reservation pipeline',
        level: 1,
        category: 'BUSINESS_USER',
        group_type: 'OPERATIONS',
        permissions: [
            P.VIEW_OPERATIONS,
            P.MANAGE_OPERATIONS,
            P.VIEW_RESERVATIONS,
            P.MANAGE_RESERVATIONS,
            P.APPROVE_RESERVATIONS,
        ],
    },
    {
        group_name: 'Approvals',
        description: 'Approval inbox and approval chain configuration',
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
        group_name: 'Calendar & Events',
        description: 'Company calendar and scheduled events',
        level: 1,
        category: 'BUSINESS_USER',
        group_type: 'GENERAL',
        permissions: [P.VIEW_CALENDAR_EVENTS, P.MANAGE_CALENDAR_EVENTS],
    },
    {
        group_name: 'Financial Management',
        description: 'Financial summaries, invoices and billing policy',
        level: 2,
        category: 'BUSINESS_USER',
        group_type: 'FINANCIALS',
        permissions: [
            P.VIEW_FINANCES,
            P.MANAGE_FINANCES,
            P.VIEW_INVOICES,
            P.MANAGE_INVOICES,
            P.MANAGE_BILLING_POLICY,
        ],
    },
    {
        group_name: 'Payroll Management',
        description: 'Full payroll lifecycle — view, manage, approve, schedule',
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
        group_name: 'Fund Management',
        description: 'Budgets, allocations, fund requests and disbursements',
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
            P.VIEW_FUND_REQUESTS,
            P.APPROVE_FUND_REQUESTS,
            P.VIEW_DISBURSEMENTS,
            P.APPROVE_DISBURSEMENTS,
            P.VIEW_EXTRA_FUND_REQUESTS,
            P.APPROVE_EXTRA_FUND_REQUESTS,
        ],
    },
    {
        group_name: 'Procurement',
        description: 'Vendors, purchase requests, orders and goods received',
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
        group_name: 'Audit & Compliance',
        description: 'Audit logs and compliance data',
        level: 2,
        category: 'BUSINESS_USER',
        group_type: 'SECURITY',
        permissions: [P.VIEW_AUDIT, P.MANAGE_AUDIT],
    },
    // ── DEPARTMENT ────────────────────────────────────────────────────────────
    {
        group_name: 'Kitchen Access',
        description: 'Kitchen pages, board and menu',
        level: 1,
        category: 'DEPARTMENT',
        group_type: 'PAGE_ACCESS',
        permissions: [P.ACCESS_KITCHEN, P.MANAGE_KITCHEN],
    },
    {
        group_name: 'Reception Access',
        description: 'Reception desk pages and workflows',
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
        group_name: 'Hotel Access',
        description: 'Hotel pages and workflows',
        level: 1,
        category: 'DEPARTMENT',
        group_type: 'PAGE_ACCESS',
        permissions: [P.ACCESS_HOTEL, P.MANAGE_HOTEL],
    },
    {
        group_name: 'Restaurant Access',
        description: 'Restaurant pages and workflows',
        level: 1,
        category: 'DEPARTMENT',
        group_type: 'PAGE_ACCESS',
        permissions: [P.ACCESS_RESTAURANT, P.MANAGE_RESTAURANT],
    },
    // ── STAFF ─────────────────────────────────────────────────────────────────
    {
        group_name: 'Dashboard & Profile',
        description: 'Dashboard, personal profile and settings',
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
        description: 'Branch pages, plus which scopes reach other branches',
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
        group_name: 'Facility Access',
        description: 'Facility layout and occupancy at the assigned branch',
        level: 1,
        category: 'STAFF',
        group_type: 'PAGE_ACCESS',
        permissions: [P.ACCESS_FACILITY, P.MANAGE_FACILITY],
    },
    {
        group_name: 'Reception Access',
        description: 'Reception desk pages for staff outside a reception department',
        level: 1,
        category: 'STAFF',
        group_type: 'PAGE_ACCESS',
        permissions: [P.ACCESS_RECEPTION, P.MANAGE_RECEPTION],
    },
    {
        group_name: 'Reservations & Guests',
        description: 'Booking requests, check-in and guest records',
        level: 1,
        category: 'STAFF',
        group_type: 'OPERATIONS',
        permissions: [
            P.VIEW_RESERVATIONS,
            P.MANAGE_RESERVATIONS,
            P.APPROVE_RESERVATIONS,
            P.VIEW_GUESTS,
            P.MANAGE_GUESTS,
        ],
    },
    {
        group_name: 'Tasks & Orders',
        description: 'Tasks and work orders',
        level: 1,
        category: 'STAFF',
        group_type: 'OPERATIONS',
        permissions: [P.VIEW_TASKS, P.MANAGE_TASKS],
    },
    {
        group_name: 'Operations & Inventory',
        description: 'Operational data, stock and assets',
        level: 1,
        category: 'STAFF',
        group_type: 'OPERATIONS',
        permissions: [
            P.VIEW_OPERATIONS,
            P.MANAGE_OPERATIONS,
            P.VIEW_INVENTORY,
            P.MANAGE_INVENTORY,
            P.VIEW_ASSETS,
            P.MANAGE_ASSETS,
        ],
    },
    {
        group_name: 'Schedule & Time',
        description: 'Schedules, shifts, time tracking and attendance',
        level: 1,
        category: 'STAFF',
        group_type: 'OPERATIONS',
        permissions: [
            P.VIEW_SCHEDULE,
            P.MANAGE_SCHEDULE,
            P.VIEW_SHIFTS,
            P.MANAGE_SHIFTS,
            P.VIEW_TIME,
            P.MANAGE_TIME,
            P.VIEW_ATTENDANCE,
            P.MANAGE_ATTENDANCE,
        ],
    },
    {
        group_name: 'Leave Management',
        description: 'Leave requests, balances and approvals',
        level: 1,
        category: 'STAFF',
        group_type: 'STAFF_MANAGEMENT',
        permissions: [P.VIEW_LEAVE, P.MANAGE_LEAVE, P.APPROVE_LEAVE],
    },
    {
        group_name: 'Calendar & Events',
        description: 'Company calendar and scheduled events',
        level: 1,
        category: 'STAFF',
        group_type: 'GENERAL',
        permissions: [P.VIEW_CALENDAR_EVENTS, P.MANAGE_CALENDAR_EVENTS],
    },
    {
        group_name: 'Approvals',
        description: 'Approval inbox for requests routed to this role',
        level: 1,
        category: 'STAFF',
        group_type: 'OPERATIONS',
        permissions: [P.VIEW_APPROVALS, P.MANAGE_APPROVALS],
    },
    {
        group_name: 'Communication',
        description: 'Internal messaging, announcements and complaints',
        level: 1,
        category: 'STAFF',
        group_type: 'COMMUNICATION',
        permissions: [
            P.VIEW_COMMUNICATION,
            P.MANAGE_COMMUNICATION,
            P.VIEW_COMPLAINTS,
            P.MANAGE_COMPLAINTS,
        ],
    },
    {
        group_name: 'Staff & Profiles',
        description: 'Other staff profiles and HR records',
        level: 1,
        category: 'STAFF',
        group_type: 'STAFF_MANAGEMENT',
        permissions: [
            P.VIEW_STAFF_PROFILES,
            P.MANAGE_STAFF_PROFILES,
            P.VIEW_HR_RECORDS,
            P.MANAGE_HR_RECORDS,
        ],
    },
    {
        group_name: 'Payroll',
        description: 'Payroll, reports and schedules',
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
        group_name: 'Invoices & Procurement',
        description: 'Invoicing and procurement documents',
        level: 2,
        category: 'STAFF',
        group_type: 'FINANCIALS',
        permissions: [
            P.VIEW_INVOICES,
            P.MANAGE_INVOICES,
            P.VIEW_PROCUREMENT,
            P.MANAGE_PROCUREMENT,
        ],
    },
    {
        group_name: 'Fund Requests',
        description: 'Branch budget visibility and fund request submission',
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
        group_name: 'Disbursements & Allocations',
        description: 'Disbursements and fund allocations',
        level: 2,
        category: 'STAFF',
        group_type: 'FINANCIALS',
        permissions: [
            P.VIEW_DISBURSEMENTS,
            P.MANAGE_DISBURSEMENTS,
            P.APPROVE_DISBURSEMENTS,
            P.VIEW_ALLOCATIONS,
            P.MANAGE_ALLOCATIONS,
        ],
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
exports.LEGACY_PERMISSION_RENAMES = {
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
exports.ALL_PERMISSION_NAMES = exports.ALL_PERMISSIONS.map((p) => p.name);
const PERMISSION_NAME_SET = new Set(exports.ALL_PERMISSION_NAMES);
/** Narrows an arbitrary string to a known slug — use before trusting user input. */
function isPermissionName(value) {
    return PERMISSION_NAME_SET.has(value);
}
/** Resolves a legacy slug to its canonical form; returns unknown slugs unchanged. */
function canonicalPermissionName(value) {
    return exports.LEGACY_PERMISSION_RENAMES[value] ?? value;
}
//# sourceMappingURL=permissions.js.map
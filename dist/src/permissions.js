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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEGACY_BOOTSTRAP_ROLE_SLUGS = exports.BOOTSTRAP_ROLE_SLUGS = exports.APPROVAL_INBOX_PERMISSIONS = exports.APPROVAL_ENTITY_PERMISSIONS = exports.ALL_PERMISSION_NAMES = exports.LEGACY_PERMISSION_RENAMES = exports.PERMISSION_GROUPS = exports.ALL_PERMISSIONS = exports.PermissionName = void 0;
exports.isPermissionName = isPermissionName;
exports.canonicalPermissionName = canonicalPermissionName;
exports.approvalPermissionForEntity = approvalPermissionForEntity;
/** Every permission slug the platform recognises. */
var PermissionName;
(function (PermissionName) {
    // ── Organization / company ─────────────────────────────────────────────────
    PermissionName["VIEW_COMPANY_DETAILS"] = "view_company_details";
    PermissionName["MANAGE_COMPANY_DETAILS"] = "manage_company_details";
    PermissionName["VIEW_COMPANY_PLANS_BILLINGS"] = "view_company_plans_billings";
    PermissionName["MANAGE_COMPANY_PLANS_BILLINGS"] = "manage_company_plans_billings";
    PermissionName["VIEW_ALL_BRANCHES"] = "view_all_branches";
    PermissionName["MANAGE_ALL_BRANCHES"] = "manage_all_branches";
    PermissionName["VIEW_DEPARTMENTS"] = "view_departments";
    PermissionName["MANAGE_DEPARTMENTS"] = "manage_departments";
    PermissionName["VIEW_ROLES"] = "view_roles";
    PermissionName["MANAGE_ROLES"] = "manage_roles";
    PermissionName["VIEW_INVITATIONS"] = "view_invitations";
    PermissionName["MANAGE_INVITATIONS"] = "manage_invitations";
    PermissionName["VIEW_BRANCH_STAFF"] = "view_branch_staff";
    PermissionName["MANAGE_BRANCH_STAFF"] = "manage_branch_staff";
    // ── Approvals ──────────────────────────────────────────────────────────────
    PermissionName["VIEW_APPROVAL_CHAIN"] = "view_approval_chain";
    PermissionName["MANAGE_APPROVAL_CHAIN"] = "manage_approval_chain";
    // ── Reception / bookings ───────────────────────────────────────────────────
    PermissionName["VIEW_BOOKING_REQUESTS"] = "view_booking_requests";
    PermissionName["MANAGE_BOOKING"] = "manage_booking";
    PermissionName["VIEW_RECEPTION_ANALYTICS"] = "view_reception_analytics";
    PermissionName["VIEW_RECEPTION"] = "view_reception";
    PermissionName["VIEW_REFUND_REQUESTS"] = "view_refund_requests";
    PermissionName["MANAGE_REFUND_REQUESTS"] = "manage_refund_requests";
    PermissionName["VIEW_GUESTS"] = "view_guests";
    PermissionName["MANAGE_GUESTS"] = "manage_guests";
    // ── Kitchen ────────────────────────────────────────────────────────────────
    PermissionName["VIEW_KITCHEN_ANALYTICS"] = "view_kitchen_analytics";
    PermissionName["VIEW_KITCHEN_MENU"] = "view_kitchen_menu";
    PermissionName["MANAGE_KITCHEN_MENU"] = "manage_kitchen_menu";
    PermissionName["VIEW_KITCHEN_BOARD"] = "view_kitchen_board";
    PermissionName["MANAGE_KITCHEN_BOARD"] = "manage_kitchen_board";
    PermissionName["VIEW_KITCHEN_ORDERS"] = "view_kitchen_orders";
    PermissionName["MANAGE_KITCHEN_ORDERS"] = "manage_kitchen_orders";
    // ── HR ─────────────────────────────────────────────────────────────────────
    PermissionName["VIEW_STAFF_ATTENDANCE"] = "view_staff_attendance";
    PermissionName["VIEW_COMPANY_CONTRACTS"] = "view_company_contracts";
    PermissionName["MANAGE_COMPANY_CONTRACTS"] = "manage_company_contracts";
    PermissionName["VIEW_STAFF_PERFORMANCE"] = "view_staff_performance";
    PermissionName["MANAGE_STAFF_PERFORMANCE"] = "manage_staff_performance";
    PermissionName["VIEW_STAFF_TRAINING"] = "view_staff_training";
    PermissionName["MANAGE_STAFF_TRAINING"] = "manage_staff_training";
    PermissionName["VIEW_DISCIPLINARY_RECORDS"] = "view_disciplinary_records";
    PermissionName["MANAGE_DISCIPLINARY_RECORDS"] = "manage_disciplinary_records";
    PermissionName["VIEW_STAFF_DOCUMENTS"] = "view_staff_documents";
    PermissionName["MANAGE_STAFF_DOCUMENTS"] = "manage_staff_documents";
    PermissionName["VIEW_STAFF_POSITION_CHANGES"] = "view_staff_position_changes";
    PermissionName["MANAGE_STAFF_POSITION_CHANGES"] = "manage_staff_position_changes";
    PermissionName["VIEW_SALARY_STRUCTURES"] = "view_salary_structures";
    PermissionName["MANAGE_SALARY_STRUCTURES"] = "manage_salary_structures";
    PermissionName["VIEW_STAFF_COMPLAINTS"] = "view_staff_complaints";
    PermissionName["MANAGE_STAFF_COMPLAINTS"] = "manage_staff_complaints";
    PermissionName["VIEW_COMPANY_COMPLAINTS"] = "view_company_complaints";
    PermissionName["MANAGE_COMPANY_COMPLAINTS"] = "manage_company_complaints";
    // ── Compliance & reports ───────────────────────────────────────────────────
    PermissionName["VIEW_COMPLIANCE"] = "view_compliance";
    PermissionName["MANAGE_COMPLIANCE"] = "manage_compliance";
    PermissionName["VIEW_COMPANY_REPORT_SCHEDULES"] = "view_company_report_schedules";
    PermissionName["MANAGE_REPORT_SCHEDULES"] = "manage_report_schedules";
    PermissionName["VIEW_COMPANY_AUDIT_LOGS"] = "view_company_audit_logs";
    PermissionName["VIEW_COMPANY_REPORTS"] = "view_company_reports";
    PermissionName["MANAGE_COMPANY_REPORTS"] = "manage_company_reports";
    // ── Shifts / calendar ──────────────────────────────────────────────────────
    PermissionName["VIEW_SHIFT_TEMPLATES"] = "view_shift_templates";
    PermissionName["MANAGE_SHIFT_TEMPLATES"] = "manage_shift_templates";
    PermissionName["VIEW_SHIFT_ASSIGNMENTS"] = "view_shift_assignments";
    PermissionName["MANAGE_SHIFT_ASSIGNMENTS"] = "manage_shift_assignments";
    PermissionName["VIEW_SHIFT_COVERAGE"] = "view_shift_coverage";
    PermissionName["VIEW_COMPANY_CALENDAR"] = "view_company_calendar";
    PermissionName["MANAGE_COMPANY_CALENDAR"] = "manage_company_calendar";
    PermissionName["MANAGE_DUTY_ASSIGNMENTS"] = "manage_duty_assignments";
    // ── Leave ──────────────────────────────────────────────────────────────────
    PermissionName["VIEW_LEAVE_POLICY"] = "view_leave_policy";
    PermissionName["VIEW_LEAVE_REQUESTS"] = "view_leave_requests";
    PermissionName["MANAGE_LEAVE_REQUESTS"] = "manage_leave_requests";
    PermissionName["VIEW_LEAVE_ANALYTICS"] = "view_leave_analytics";
    PermissionName["VIEW_LEAVE_BALANCE"] = "view_leave_balance";
    PermissionName["MANAGE_LEAVE_BALANCE"] = "manage_leave_balance";
    // ── Facilities ─────────────────────────────────────────────────────────────
    PermissionName["VIEW_FACILITIES"] = "view_facilities";
    PermissionName["MANAGE_FACILITIES"] = "manage_facilities";
    PermissionName["VIEW_HOUSEKEEPING"] = "view_housekeeping";
    PermissionName["MANAGE_HOUSEKEEPING"] = "manage_housekeeping";
    PermissionName["VIEW_WORK_ORDERS"] = "view_work_orders";
    PermissionName["MANAGE_WORK_ORDERS"] = "manage_work_orders";
    PermissionName["VIEW_INCIDENT_REPORTS"] = "view_incident_reports";
    PermissionName["MANAGE_INCIDENT_REPORTS"] = "manage_incident_reports";
    PermissionName["VIEW_INVENTORY"] = "view_inventory";
    PermissionName["MANAGE_INVENTORY"] = "manage_inventory";
    PermissionName["VIEW_ASSETS"] = "view_assets";
    PermissionName["MANAGE_ASSETS"] = "manage_assets";
    // ── Financials ─────────────────────────────────────────────────────────────
    PermissionName["VIEW_FINANCIALS_ANALYTICS"] = "view_financials_analytics";
    PermissionName["VIEW_FINANCIAL_REPORTS"] = "view_financial_reports";
    PermissionName["MANAGE_FINANCIAL_REPORTS"] = "manage_financial_reports";
    PermissionName["VIEW_COMPANY_BUDGET"] = "view_company_budget";
    PermissionName["MANAGE_COMPANY_BUDGETS"] = "manage_company_budgets";
    PermissionName["APPROVE_MONTHLY_BUDGETS"] = "approve_monthly_budgets";
    PermissionName["MANAGE_BUDGET_ALLOCATIONS"] = "manage_budget_allocations";
    PermissionName["VIEW_REVENUE_STREAMS"] = "view_revenue_streams";
    PermissionName["MANAGE_REVENUE_STREAMS"] = "manage_revenue_streams";
    PermissionName["VIEW_COMPANY_WALLET"] = "view_company_wallet";
    PermissionName["MANAGE_COMPANY_WALLETS"] = "manage_company_wallets";
    PermissionName["VIEW_WALLET_AUDIT_TRAILS"] = "view_wallet_audit_trails";
    PermissionName["VIEW_COMPANY_TRANSACTIONS"] = "view_company_transactions";
    PermissionName["VIEW_REMITTANCES"] = "view_remittances";
    PermissionName["MANAGE_REMITTANCES"] = "manage_remittances";
    PermissionName["VIEW_COMPANY_INVOICES"] = "view_company_invoices";
    PermissionName["MANAGE_COMPANY_INVOICES"] = "manage_company_invoices";
    PermissionName["VIEW_VARIANCE_REPORTS"] = "view_variance_reports";
    PermissionName["VIEW_FINANCIAL_STATEMENTS"] = "view_financial_statements";
    PermissionName["VIEW_PAYROLL"] = "view_payroll";
    PermissionName["MANAGE_PAYROLL"] = "manage_payroll";
    PermissionName["VIEW_PAYROLL_YTD"] = "view_payroll_ytd";
    PermissionName["APPROVE_PAYROLLS"] = "approve_payrolls";
    PermissionName["SEND_PAYROLL"] = "send_payroll";
    PermissionName["MANAGE_PAYROLL_SCHEDULES"] = "manage_payroll_schedules";
    PermissionName["VIEW_ALLOCATIONS"] = "view_allocations";
    PermissionName["MANAGE_ALLOCATIONS"] = "manage_allocations";
    // ── Aliases (same slug as a canonical member above) ────────────────────────
    PermissionName["VIEW_COMPANIES"] = "view_company_details";
    PermissionName["MANAGE_COMPANIES"] = "manage_company_details";
    PermissionName["MANAGE_ORGANIZATION"] = "manage_company_details";
    PermissionName["VIEW_SETTINGS"] = "view_company_details";
    PermissionName["MANAGE_SETTINGS"] = "manage_company_details";
    PermissionName["VIEW_BRANCHES"] = "view_all_branches";
    PermissionName["MANAGE_BRANCHES"] = "manage_all_branches";
    PermissionName["VIEW_BRANCH"] = "view_all_branches";
    PermissionName["MANAGE_BRANCH"] = "manage_all_branches";
    PermissionName["RESTRICT_BRANCH_ACCESS"] = "manage_all_branches";
    PermissionName["VIEW_STAFF"] = "view_branch_staff";
    PermissionName["MANAGE_STAFF"] = "manage_branch_staff";
    PermissionName["VIEW_STAFF_PROFILES"] = "view_branch_staff";
    PermissionName["MANAGE_STAFF_PROFILES"] = "manage_branch_staff";
    PermissionName["VIEW_PARTNERS"] = "view_branch_staff";
    PermissionName["MANAGE_PARTNERS"] = "manage_branch_staff";
    PermissionName["VIEW_BILLING_POLICY"] = "view_company_plans_billings";
    PermissionName["MANAGE_BILLING_POLICY"] = "manage_company_plans_billings";
    PermissionName["VIEW_APPROVALS"] = "view_approval_chain";
    PermissionName["MANAGE_APPROVALS"] = "manage_approval_chain";
    PermissionName["MANAGE_APPROVAL_CHAINS"] = "manage_approval_chain";
    PermissionName["VIEW_RESERVATIONS"] = "view_booking_requests";
    PermissionName["MANAGE_RESERVATIONS"] = "manage_booking";
    PermissionName["APPROVE_RESERVATIONS"] = "manage_booking";
    PermissionName["MANAGE_RECEPTION"] = "manage_booking";
    PermissionName["VIEW_HOTEL"] = "view_reception";
    PermissionName["MANAGE_HOTEL"] = "manage_booking";
    PermissionName["VIEW_KITCHEN"] = "view_kitchen_board";
    PermissionName["MANAGE_KITCHEN"] = "manage_kitchen_board";
    PermissionName["VIEW_RESTAURANT"] = "view_kitchen_board";
    PermissionName["MANAGE_RESTAURANT"] = "manage_kitchen_orders";
    PermissionName["VIEW_ATTENDANCE"] = "view_staff_attendance";
    PermissionName["MANAGE_ATTENDANCE"] = "view_staff_attendance";
    PermissionName["MANAGE_STAFF_ATTENDANCE"] = "view_staff_attendance";
    PermissionName["VIEW_TIME"] = "view_staff_attendance";
    PermissionName["MANAGE_TIME"] = "view_staff_attendance";
    PermissionName["VIEW_HR_PERFORMANCE"] = "view_staff_performance";
    PermissionName["MANAGE_HR_PERFORMANCE"] = "manage_staff_performance";
    PermissionName["VIEW_HR_DOCUMENTS"] = "view_staff_documents";
    PermissionName["MANAGE_HR_DOCUMENTS"] = "manage_staff_documents";
    PermissionName["VIEW_COMPLAINTS"] = "view_staff_complaints";
    PermissionName["MANAGE_COMPLAINTS"] = "manage_staff_complaints";
    PermissionName["VIEW_AUDIT"] = "view_company_audit_logs";
    PermissionName["MANAGE_AUDIT"] = "manage_compliance";
    PermissionName["VIEW_SHIFTS"] = "view_shift_assignments";
    PermissionName["MANAGE_SHIFTS"] = "manage_shift_assignments";
    PermissionName["VIEW_SCHEDULE"] = "view_shift_assignments";
    PermissionName["MANAGE_SCHEDULE"] = "manage_shift_assignments";
    PermissionName["VIEW_CALENDAR_EVENTS"] = "view_company_calendar";
    PermissionName["MANAGE_CALENDAR_EVENTS"] = "manage_company_calendar";
    PermissionName["VIEW_LEAVE"] = "view_leave_requests";
    PermissionName["MANAGE_LEAVE"] = "manage_leave_requests";
    PermissionName["MANAGE_LEAVE_POLICY"] = "manage_leave_requests";
    PermissionName["APPROVE_LEAVE"] = "manage_leave_requests";
    PermissionName["VIEW_FACILITY"] = "view_facilities";
    PermissionName["MANAGE_FACILITY"] = "manage_facilities";
    PermissionName["VIEW_OPERATIONS"] = "view_facilities";
    PermissionName["MANAGE_OPERATIONS"] = "manage_facilities";
    PermissionName["VIEW_TASKS"] = "view_work_orders";
    PermissionName["MANAGE_TASKS"] = "manage_work_orders";
    PermissionName["VIEW_FINANCIAL_ANALYTICS"] = "view_financials_analytics";
    PermissionName["MANAGE_FINANCIAL_ANALYTICS"] = "manage_financial_reports";
    PermissionName["VIEW_MONTHLY_BUDGETS"] = "view_company_budget";
    PermissionName["MANAGE_MONTHLY_BUDGETS"] = "manage_company_budgets";
    PermissionName["VIEW_BRANCH_BUDGET"] = "view_company_budget";
    PermissionName["VIEW_COMPANY_FUNDS"] = "view_company_wallet";
    PermissionName["MANAGE_COMPANY_FUNDS"] = "manage_company_wallets";
    PermissionName["VIEW_TRANSACTIONS"] = "view_company_transactions";
    PermissionName["MANAGE_TRANSACTIONS"] = "view_company_transactions";
    PermissionName["MANAGE_COMPANY_TRANSACTIONS"] = "view_company_transactions";
    PermissionName["VIEW_INVOICES"] = "view_company_invoices";
    PermissionName["MANAGE_INVOICES"] = "manage_company_invoices";
    PermissionName["VIEW_PAYROLLS"] = "view_payroll";
    PermissionName["MANAGE_PAYROLLS"] = "manage_payroll";
    PermissionName["VIEW_PAYROLL_REPORTS"] = "view_payroll_ytd";
    PermissionName["VIEW_BRANCH_ALLOCATIONS"] = "view_allocations";
    PermissionName["MANAGE_BRANCH_ALLOCATIONS"] = "manage_budget_allocations";
    PermissionName["APPROVE_BRANCH_ALLOCATIONS"] = "manage_budget_allocations";
    PermissionName["VIEW_FINANCIAL_PERIODS"] = "view_financial_statements";
    PermissionName["MANAGE_FINANCIAL_PERIODS"] = "manage_financial_reports";
    PermissionName["VIEW_PROCUREMENT"] = "view_inventory";
    PermissionName["MANAGE_PROCUREMENT"] = "manage_inventory";
    PermissionName["APPROVE_PROCUREMENT"] = "manage_inventory";
    PermissionName["REQUEST_FUNDS"] = "manage_company_wallets";
    PermissionName["VIEW_FUND_REQUESTS"] = "view_company_wallet";
    PermissionName["APPROVE_FUND_REQUESTS"] = "manage_company_wallets";
    PermissionName["REQUEST_EXTRA_FUNDS"] = "manage_company_wallets";
    PermissionName["VIEW_EXTRA_FUND_REQUESTS"] = "view_company_wallet";
    PermissionName["APPROVE_EXTRA_FUND_REQUESTS"] = "manage_company_wallets";
    PermissionName["VIEW_DISBURSEMENTS"] = "view_company_wallet";
    PermissionName["MANAGE_DISBURSEMENTS"] = "manage_company_wallets";
    PermissionName["APPROVE_DISBURSEMENTS"] = "manage_company_wallets";
    PermissionName["VIEW_BRANCH_LEAVE"] = "view_all_branches";
    PermissionName["VIEW_BRANCH_APPROVALS"] = "view_all_branches";
    PermissionName["VIEW_BRANCH_FINANCIALS"] = "view_all_branches";
    PermissionName["VIEW_BRANCH_SHIFTS"] = "view_all_branches";
    PermissionName["VIEW_BRANCH_TASKS"] = "view_all_branches";
    PermissionName["VIEW_BRANCH_RECEPTION"] = "view_all_branches";
    PermissionName["VIEW_BRANCH_FACILITY"] = "view_all_branches";
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
const ORGANIZATION_PERMISSIONS = define("BUSINESS_USER", [
    [P.VIEW_COMPANY_DETAILS, 1, "View company details"],
    [P.MANAGE_COMPANY_DETAILS, 2, "Manage company details"],
    [P.VIEW_COMPANY_PLANS_BILLINGS, 1, "View plans and billing"],
    [P.MANAGE_COMPANY_PLANS_BILLINGS, 2, "Manage plans and billing"],
    [P.VIEW_ALL_BRANCHES, 1, "View all branches"],
    [P.MANAGE_ALL_BRANCHES, 2, "Manage all branches"],
    [P.VIEW_DEPARTMENTS, 1, "View departments"],
    [P.MANAGE_DEPARTMENTS, 2, "Manage departments"],
    [P.VIEW_ROLES, 1, "View roles"],
    [P.MANAGE_ROLES, 2, "Manage roles"],
    [P.VIEW_BRANCH_STAFF, 1, "View staff"],
    [P.MANAGE_BRANCH_STAFF, 2, "Manage staff"],
    [P.VIEW_INVITATIONS, 1, "View invitations"],
    [P.MANAGE_INVITATIONS, 2, "Manage invitations"],
    [P.VIEW_COMPANY_AUDIT_LOGS, 1, "View company audit logs"],
    [P.VIEW_COMPLIANCE, 1, "View compliance"],
    [P.MANAGE_COMPLIANCE, 2, "Manage compliance"],
]);
const DEPARTMENT_PERMISSIONS = define("DEPARTMENT", [
    [P.VIEW_KITCHEN_ANALYTICS, 1, "View kitchen analytics"],
    [P.VIEW_KITCHEN_MENU, 1, "View kitchen menu"],
    [P.MANAGE_KITCHEN_MENU, 2, "Manage kitchen menu"],
    [P.VIEW_KITCHEN_BOARD, 1, "View kitchen board"],
    [P.MANAGE_KITCHEN_BOARD, 2, "Manage kitchen board"],
    [P.VIEW_KITCHEN_ORDERS, 1, "View kitchen orders"],
    [P.MANAGE_KITCHEN_ORDERS, 2, "Manage kitchen orders"],
    [P.VIEW_RECEPTION, 1, "View reception"],
    [P.VIEW_RECEPTION_ANALYTICS, 1, "View reception analytics"],
]);
const GENERAL_PERMISSIONS = define("STAFF", [
    [P.VIEW_APPROVAL_CHAIN, 1, "View approval chain"],
    [P.MANAGE_APPROVAL_CHAIN, 2, "Manage approval chain"],
    [P.VIEW_BOOKING_REQUESTS, 1, "View booking requests"],
    [P.MANAGE_BOOKING, 2, "Manage bookings"],
    [P.VIEW_REFUND_REQUESTS, 1, "View refund requests"],
    [P.MANAGE_REFUND_REQUESTS, 2, "Manage refund requests"],
    [P.VIEW_GUESTS, 1, "View guests"],
    [P.MANAGE_GUESTS, 2, "Manage guests"],
    [P.VIEW_STAFF_ATTENDANCE, 1, "View staff attendance"],
    [P.VIEW_COMPANY_CONTRACTS, 1, "View company contracts"],
    [P.MANAGE_COMPANY_CONTRACTS, 2, "Manage company contracts"],
    [P.VIEW_STAFF_PERFORMANCE, 1, "View staff performance"],
    [P.MANAGE_STAFF_PERFORMANCE, 2, "Manage staff performance"],
    [P.VIEW_STAFF_TRAINING, 1, "View staff training"],
    [P.MANAGE_STAFF_TRAINING, 2, "Manage staff training"],
    [P.VIEW_DISCIPLINARY_RECORDS, 1, "View disciplinary records"],
    [P.MANAGE_DISCIPLINARY_RECORDS, 2, "Manage disciplinary records"],
    [P.VIEW_STAFF_DOCUMENTS, 1, "View staff documents"],
    [P.MANAGE_STAFF_DOCUMENTS, 2, "Manage staff documents"],
    [P.VIEW_STAFF_POSITION_CHANGES, 1, "View staff position changes"],
    [P.MANAGE_STAFF_POSITION_CHANGES, 2, "Manage staff position changes"],
    [P.VIEW_SALARY_STRUCTURES, 1, "View salary structures"],
    [P.MANAGE_SALARY_STRUCTURES, 2, "Manage salary structures"],
    [P.VIEW_STAFF_COMPLAINTS, 1, "View staff complaints"],
    [P.MANAGE_STAFF_COMPLAINTS, 2, "Manage staff complaints"],
    [P.VIEW_COMPANY_COMPLAINTS, 1, "View company complaints"],
    [P.MANAGE_COMPANY_COMPLAINTS, 2, "Manage company complaints"],
    [P.VIEW_COMPANY_REPORT_SCHEDULES, 1, "View report schedules"],
    [P.MANAGE_REPORT_SCHEDULES, 2, "Manage report schedules"],
    [P.VIEW_COMPANY_REPORTS, 1, "View company reports"],
    [P.MANAGE_COMPANY_REPORTS, 2, "Manage company reports"],
    [P.VIEW_SHIFT_TEMPLATES, 1, "View shift templates"],
    [P.MANAGE_SHIFT_TEMPLATES, 2, "Manage shift templates"],
    [P.VIEW_SHIFT_ASSIGNMENTS, 1, "View shift assignments"],
    [P.MANAGE_SHIFT_ASSIGNMENTS, 2, "Manage shift assignments"],
    [P.VIEW_SHIFT_COVERAGE, 1, "View shift coverage"],
    [P.VIEW_COMPANY_CALENDAR, 1, "View company calendar"],
    [P.MANAGE_COMPANY_CALENDAR, 2, "Manage company calendar"],
    [P.MANAGE_DUTY_ASSIGNMENTS, 2, "Manage duty assignments"],
    [P.VIEW_LEAVE_POLICY, 1, "View leave policy"],
    [P.VIEW_LEAVE_REQUESTS, 1, "View leave requests"],
    [P.MANAGE_LEAVE_REQUESTS, 2, "Manage leave requests"],
    [P.VIEW_LEAVE_ANALYTICS, 1, "View leave analytics"],
    [P.VIEW_LEAVE_BALANCE, 1, "View leave balance"],
    [P.MANAGE_LEAVE_BALANCE, 2, "Manage leave balance"],
    [P.VIEW_FACILITIES, 1, "View facilities"],
    [P.MANAGE_FACILITIES, 2, "Manage facilities"],
    [P.VIEW_HOUSEKEEPING, 1, "View housekeeping"],
    [P.MANAGE_HOUSEKEEPING, 2, "Manage housekeeping"],
    [P.VIEW_WORK_ORDERS, 1, "View work orders"],
    [P.MANAGE_WORK_ORDERS, 2, "Manage work orders"],
    [P.VIEW_INCIDENT_REPORTS, 1, "View incident reports"],
    [P.MANAGE_INCIDENT_REPORTS, 2, "Manage incident reports"],
    [P.VIEW_INVENTORY, 1, "View inventory"],
    [P.MANAGE_INVENTORY, 2, "Manage inventory"],
    [P.VIEW_ASSETS, 1, "View assets"],
    [P.MANAGE_ASSETS, 2, "Manage assets"],
    [P.VIEW_FINANCIALS_ANALYTICS, 1, "View financial analytics"],
    [P.VIEW_FINANCIAL_REPORTS, 1, "View financial reports"],
    [P.MANAGE_FINANCIAL_REPORTS, 2, "Manage financial reports"],
    [P.VIEW_COMPANY_BUDGET, 1, "View company budget"],
    [P.MANAGE_COMPANY_BUDGETS, 2, "Manage company budgets"],
    [P.APPROVE_MONTHLY_BUDGETS, 3, "Approve monthly budgets"],
    [P.MANAGE_BUDGET_ALLOCATIONS, 2, "Manage budget allocations"],
    [P.VIEW_REVENUE_STREAMS, 1, "View revenue streams"],
    [P.MANAGE_REVENUE_STREAMS, 2, "Manage revenue streams"],
    [P.VIEW_COMPANY_WALLET, 1, "View company wallet"],
    [P.MANAGE_COMPANY_WALLETS, 2, "Manage company wallets"],
    [P.VIEW_WALLET_AUDIT_TRAILS, 1, "View wallet audit trails"],
    [P.VIEW_COMPANY_TRANSACTIONS, 1, "View company transactions"],
    [P.VIEW_REMITTANCES, 1, "View remittances"],
    [P.MANAGE_REMITTANCES, 2, "Manage remittances"],
    [P.VIEW_COMPANY_INVOICES, 1, "View company invoices"],
    [P.MANAGE_COMPANY_INVOICES, 2, "Manage company invoices"],
    [P.VIEW_VARIANCE_REPORTS, 1, "View variance reports"],
    [P.VIEW_FINANCIAL_STATEMENTS, 1, "View financial statements"],
    [P.VIEW_PAYROLL, 1, "View payroll"],
    [P.MANAGE_PAYROLL, 2, "Manage payroll"],
    [P.VIEW_PAYROLL_YTD, 1, "View payroll YTD"],
    [P.APPROVE_PAYROLLS, 3, "Approve payrolls"],
    [P.SEND_PAYROLL, 3, "Send payroll"],
    [P.MANAGE_PAYROLL_SCHEDULES, 2, "Manage payroll schedules"],
    [P.VIEW_ALLOCATIONS, 1, "View allocations"],
    [P.MANAGE_ALLOCATIONS, 2, "Manage allocations"],
]);
exports.ALL_PERMISSIONS = [
    ...ORGANIZATION_PERMISSIONS,
    ...DEPARTMENT_PERMISSIONS,
    ...GENERAL_PERMISSIONS,
];
const STAFF_AND_BU = (group_name, description, group_type, permissions, level = 1) => [
    {
        group_name,
        description,
        level,
        category: "BUSINESS_USER",
        group_type,
        permissions,
    },
    {
        group_name,
        description,
        level,
        category: "STAFF",
        group_type,
        permissions,
    },
];
exports.PERMISSION_GROUPS = [
    {
        group_name: "Organization",
        description: "Company profile, plans and billing",
        level: 1,
        category: "BUSINESS_USER",
        group_type: "GENERAL",
        permissions: [
            P.VIEW_COMPANY_DETAILS,
            P.MANAGE_COMPANY_DETAILS,
            P.VIEW_COMPANY_PLANS_BILLINGS,
            P.MANAGE_COMPANY_PLANS_BILLINGS,
        ],
    },
    {
        group_name: "Branches",
        description: "Branches",
        level: 1,
        category: "BUSINESS_USER",
        group_type: "OPERATIONS",
        permissions: [P.VIEW_ALL_BRANCHES, P.MANAGE_ALL_BRANCHES],
    },
    {
        group_name: "Structure",
        description: "Departments and designations",
        level: 2,
        category: "BUSINESS_USER",
        group_type: "STAFF_MANAGEMENT",
        permissions: [P.VIEW_DEPARTMENTS, P.MANAGE_DEPARTMENTS],
    },
    {
        group_name: "Roles",
        description: "Roles and permission grants",
        level: 2,
        category: "BUSINESS_USER",
        group_type: "STAFF_MANAGEMENT",
        permissions: [P.VIEW_ROLES, P.MANAGE_ROLES],
    },
    {
        group_name: "Staff",
        description: "Staff records and invitations",
        level: 1,
        category: "BUSINESS_USER",
        group_type: "STAFF_MANAGEMENT",
        permissions: [
            P.VIEW_BRANCH_STAFF,
            P.MANAGE_BRANCH_STAFF,
            P.VIEW_INVITATIONS,
            P.MANAGE_INVITATIONS,
        ],
    },
    {
        group_name: "Audit & compliance",
        description: "Audit logs and compliance documents",
        level: 2,
        category: "BUSINESS_USER",
        group_type: "SECURITY",
        permissions: [
            P.VIEW_COMPANY_AUDIT_LOGS,
            P.VIEW_COMPLIANCE,
            P.MANAGE_COMPLIANCE,
        ],
    },
    {
        group_name: "Kitchen",
        description: "Kitchen menu, board and orders",
        level: 1,
        category: "DEPARTMENT",
        group_type: "PAGE_ACCESS",
        permissions: [
            P.VIEW_KITCHEN_ANALYTICS,
            P.VIEW_KITCHEN_MENU,
            P.MANAGE_KITCHEN_MENU,
            P.VIEW_KITCHEN_BOARD,
            P.MANAGE_KITCHEN_BOARD,
            P.VIEW_KITCHEN_ORDERS,
            P.MANAGE_KITCHEN_ORDERS,
        ],
    },
    {
        group_name: "Reception",
        description: "Reception desk and bookings",
        level: 1,
        category: "DEPARTMENT",
        group_type: "PAGE_ACCESS",
        permissions: [
            P.VIEW_RECEPTION,
            P.VIEW_RECEPTION_ANALYTICS,
            P.VIEW_BOOKING_REQUESTS,
            P.MANAGE_BOOKING,
            P.VIEW_REFUND_REQUESTS,
            P.MANAGE_REFUND_REQUESTS,
        ],
    },
    {
        group_name: "Company",
        description: "Company profile, plans and billing",
        level: 1,
        category: "STAFF",
        group_type: "GENERAL",
        permissions: [
            P.VIEW_COMPANY_DETAILS,
            P.MANAGE_COMPANY_DETAILS,
            P.VIEW_COMPANY_PLANS_BILLINGS,
            P.MANAGE_COMPANY_PLANS_BILLINGS,
        ],
    },
    {
        group_name: "Branch Access",
        description: "Home branch, all branches and staff",
        level: 1,
        category: "STAFF",
        group_type: "PAGE_ACCESS",
        permissions: [
            P.VIEW_ALL_BRANCHES,
            P.MANAGE_ALL_BRANCHES,
            P.VIEW_BRANCH_STAFF,
            P.MANAGE_BRANCH_STAFF,
        ],
    },
    {
        group_name: "Roles",
        description: "View and manage company roles",
        level: 2,
        category: "STAFF",
        group_type: "STAFF_MANAGEMENT",
        permissions: [P.VIEW_ROLES, P.MANAGE_ROLES],
    },
    {
        group_name: "Staff",
        description: "Staff records and invitations",
        level: 2,
        category: "STAFF",
        group_type: "STAFF_MANAGEMENT",
        permissions: [
            P.VIEW_BRANCH_STAFF,
            P.MANAGE_BRANCH_STAFF,
            P.VIEW_INVITATIONS,
            P.MANAGE_INVITATIONS,
        ],
    },
    {
        group_name: "Reception",
        description: "Reception desk",
        level: 1,
        category: "STAFF",
        group_type: "PAGE_ACCESS",
        permissions: [P.VIEW_RECEPTION, P.VIEW_RECEPTION_ANALYTICS],
    },
    {
        group_name: "Kitchen",
        description: "Kitchen menu, board and orders",
        level: 1,
        category: "STAFF",
        group_type: "PAGE_ACCESS",
        permissions: [
            P.VIEW_KITCHEN_ANALYTICS,
            P.VIEW_KITCHEN_MENU,
            P.MANAGE_KITCHEN_MENU,
            P.VIEW_KITCHEN_BOARD,
            P.MANAGE_KITCHEN_BOARD,
            P.VIEW_KITCHEN_ORDERS,
            P.MANAGE_KITCHEN_ORDERS,
        ],
    },
    ...STAFF_AND_BU("Approvals", "Approval inbox and chain configuration", "OPERATIONS", [P.VIEW_APPROVAL_CHAIN, P.MANAGE_APPROVAL_CHAIN], 2),
    ...STAFF_AND_BU("Bookings", "Booking requests, refunds and guests", "OPERATIONS", [
        P.VIEW_BOOKING_REQUESTS,
        P.MANAGE_BOOKING,
        P.VIEW_REFUND_REQUESTS,
        P.MANAGE_REFUND_REQUESTS,
        P.VIEW_GUESTS,
        P.MANAGE_GUESTS,
    ]),
    ...STAFF_AND_BU("HR records", "Contracts, performance, training, documents, salary structures", "STAFF_MANAGEMENT", [
        P.VIEW_COMPANY_CONTRACTS,
        P.MANAGE_COMPANY_CONTRACTS,
        P.VIEW_STAFF_PERFORMANCE,
        P.MANAGE_STAFF_PERFORMANCE,
        P.VIEW_STAFF_TRAINING,
        P.MANAGE_STAFF_TRAINING,
        P.VIEW_DISCIPLINARY_RECORDS,
        P.MANAGE_DISCIPLINARY_RECORDS,
        P.VIEW_STAFF_DOCUMENTS,
        P.MANAGE_STAFF_DOCUMENTS,
        P.VIEW_STAFF_POSITION_CHANGES,
        P.MANAGE_STAFF_POSITION_CHANGES,
        P.VIEW_SALARY_STRUCTURES,
        P.MANAGE_SALARY_STRUCTURES,
    ]),
    ...STAFF_AND_BU("Support tickets", "Staff and company support tickets", "COMMUNICATION", [
        P.VIEW_STAFF_COMPLAINTS,
        P.MANAGE_STAFF_COMPLAINTS,
        P.VIEW_COMPANY_COMPLAINTS,
        P.MANAGE_COMPANY_COMPLAINTS,
    ]),
    ...STAFF_AND_BU("Reports", "Company reports and schedules", "GENERAL", [
        P.VIEW_COMPANY_REPORTS,
        P.MANAGE_COMPANY_REPORTS,
        P.VIEW_COMPANY_REPORT_SCHEDULES,
        P.MANAGE_REPORT_SCHEDULES,
    ], 2),
    ...STAFF_AND_BU("Shifts", "Templates, assignments, coverage and duties", "OPERATIONS", [
        P.VIEW_SHIFT_TEMPLATES,
        P.MANAGE_SHIFT_TEMPLATES,
        P.VIEW_SHIFT_ASSIGNMENTS,
        P.MANAGE_SHIFT_ASSIGNMENTS,
        P.VIEW_SHIFT_COVERAGE,
        P.MANAGE_DUTY_ASSIGNMENTS,
    ]),
    ...STAFF_AND_BU("Calendar", "Company calendar", "GENERAL", [
        P.VIEW_COMPANY_CALENDAR,
        P.MANAGE_COMPANY_CALENDAR,
    ]),
    ...STAFF_AND_BU("Attendance", "Staff attendance", "OPERATIONS", [
        P.VIEW_STAFF_ATTENDANCE,
    ]),
    ...STAFF_AND_BU("Leave", "Leave policy, requests, balances and analytics", "STAFF_MANAGEMENT", [
        P.VIEW_LEAVE_POLICY,
        P.VIEW_LEAVE_REQUESTS,
        P.MANAGE_LEAVE_REQUESTS,
        P.VIEW_LEAVE_ANALYTICS,
        P.VIEW_LEAVE_BALANCE,
        P.MANAGE_LEAVE_BALANCE,
    ]),
    ...STAFF_AND_BU("Facilities", "Facilities, housekeeping, work orders and incidents", "OPERATIONS", [
        P.VIEW_FACILITIES,
        P.MANAGE_FACILITIES,
        P.VIEW_HOUSEKEEPING,
        P.MANAGE_HOUSEKEEPING,
        P.VIEW_WORK_ORDERS,
        P.MANAGE_WORK_ORDERS,
        P.VIEW_INCIDENT_REPORTS,
        P.MANAGE_INCIDENT_REPORTS,
    ]),
    ...STAFF_AND_BU("Inventory", "Inventory and assets", "OPERATIONS", [
        P.VIEW_INVENTORY,
        P.MANAGE_INVENTORY,
        P.VIEW_ASSETS,
        P.MANAGE_ASSETS,
    ]),
    ...STAFF_AND_BU("Financial analytics", "Financial overview, reports and statements", "FINANCIALS", [
        P.VIEW_FINANCIALS_ANALYTICS,
        P.VIEW_FINANCIAL_REPORTS,
        P.MANAGE_FINANCIAL_REPORTS,
        P.VIEW_FINANCIAL_STATEMENTS,
        P.VIEW_VARIANCE_REPORTS,
    ], 2),
    ...STAFF_AND_BU("Budgets", "Budgets, allocations and revenue", "FINANCIALS", [
        P.VIEW_COMPANY_BUDGET,
        P.MANAGE_COMPANY_BUDGETS,
        P.APPROVE_MONTHLY_BUDGETS,
        P.MANAGE_BUDGET_ALLOCATIONS,
        P.VIEW_ALLOCATIONS,
        P.MANAGE_ALLOCATIONS,
        P.VIEW_REVENUE_STREAMS,
        P.MANAGE_REVENUE_STREAMS,
    ], 2),
    ...STAFF_AND_BU("Wallet", "Company wallet, transactions and remittances", "FINANCIALS", [
        P.VIEW_COMPANY_WALLET,
        P.MANAGE_COMPANY_WALLETS,
        P.VIEW_WALLET_AUDIT_TRAILS,
        P.VIEW_COMPANY_TRANSACTIONS,
        P.VIEW_REMITTANCES,
        P.MANAGE_REMITTANCES,
    ], 2),
    ...STAFF_AND_BU("Invoices", "Company invoices", "FINANCIALS", [P.VIEW_COMPANY_INVOICES, P.MANAGE_COMPANY_INVOICES], 2),
    ...STAFF_AND_BU("Payroll", "Payroll runs, YTD, send, schedules and salary structures", "FINANCIALS", [
        P.VIEW_PAYROLL,
        P.MANAGE_PAYROLL,
        P.APPROVE_PAYROLLS,
        P.SEND_PAYROLL,
        P.VIEW_PAYROLL_YTD,
        P.MANAGE_PAYROLL_SCHEDULES,
        P.VIEW_SALARY_STRUCTURES,
        P.MANAGE_SALARY_STRUCTURES,
    ], 2),
];
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
exports.LEGACY_PERMISSION_RENAMES = {
    view_payroll: P.VIEW_PAYROLL,
    manage_payroll: P.MANAGE_PAYROLL,
    view_payrolls: P.VIEW_PAYROLL,
    manage_payrolls: P.MANAGE_PAYROLL,
    view_payroll_reports: P.VIEW_PAYROLL_YTD,
    access_kitchen: P.VIEW_KITCHEN_BOARD,
    view_kitchen: P.VIEW_KITCHEN_BOARD,
    manage_kitchen: P.MANAGE_KITCHEN_BOARD,
    access_reception: P.VIEW_RECEPTION,
    access_hotel: P.VIEW_RECEPTION,
    view_hotel: P.VIEW_RECEPTION,
    manage_hotel: P.MANAGE_BOOKING,
    access_restaurant: P.VIEW_KITCHEN_BOARD,
    view_restaurant: P.VIEW_KITCHEN_BOARD,
    manage_restaurant: P.MANAGE_KITCHEN_ORDERS,
    access_branch: P.VIEW_ALL_BRANCHES,
    view_branch: P.VIEW_ALL_BRANCHES,
    manage_branch: P.MANAGE_ALL_BRANCHES,
    access_facility: P.VIEW_FACILITIES,
    view_facility: P.VIEW_FACILITIES,
    manage_facility: P.MANAGE_FACILITIES,
    view_finances: P.VIEW_FINANCIALS_ANALYTICS,
    manage_finances: P.MANAGE_FINANCIAL_REPORTS,
    view_financial_analytics: P.VIEW_FINANCIALS_ANALYTICS,
    manage_financial_analytics: P.MANAGE_FINANCIAL_REPORTS,
    view_company_funds: P.VIEW_COMPANY_WALLET,
    manage_company_funds: P.MANAGE_COMPANY_WALLETS,
    view_monthly_budgets: P.VIEW_COMPANY_BUDGET,
    manage_monthly_budgets: P.MANAGE_COMPANY_BUDGETS,
    view_branch_budget: P.VIEW_COMPANY_BUDGET,
    view_branch_allocations: P.VIEW_ALLOCATIONS,
    manage_branch_allocations: P.MANAGE_BUDGET_ALLOCATIONS,
    approve_branch_allocations: P.MANAGE_BUDGET_ALLOCATIONS,
    view_transactions: P.VIEW_COMPANY_TRANSACTIONS,
    manage_transactions: P.VIEW_COMPANY_TRANSACTIONS,
    manage_company_transactions: P.VIEW_COMPANY_TRANSACTIONS,
    view_invoices: P.VIEW_COMPANY_INVOICES,
    manage_invoices: P.MANAGE_COMPANY_INVOICES,
    view_billing_policy: P.VIEW_COMPANY_PLANS_BILLINGS,
    manage_billing_policy: P.MANAGE_COMPANY_PLANS_BILLINGS,
    view_companies: P.VIEW_COMPANY_DETAILS,
    manage_companies: P.MANAGE_COMPANY_DETAILS,
    manage_organization: P.MANAGE_COMPANY_DETAILS,
    view_settings: P.VIEW_COMPANY_DETAILS,
    manage_settings: P.MANAGE_COMPANY_DETAILS,
    view_branches: P.VIEW_ALL_BRANCHES,
    manage_branches: P.MANAGE_ALL_BRANCHES,
    restrict_branch_access: P.MANAGE_ALL_BRANCHES,
    view_staff: P.VIEW_BRANCH_STAFF,
    manage_staff: P.MANAGE_BRANCH_STAFF,
    view_staff_profiles: P.VIEW_BRANCH_STAFF,
    manage_staff_profiles: P.MANAGE_BRANCH_STAFF,
    view_partners: P.VIEW_BRANCH_STAFF,
    manage_partners: P.MANAGE_BRANCH_STAFF,
    view_hr_records: P.VIEW_STAFF_DOCUMENTS,
    manage_hr_records: P.MANAGE_STAFF_DOCUMENTS,
    view_hr_documents: P.VIEW_STAFF_DOCUMENTS,
    manage_hr_documents: P.MANAGE_STAFF_DOCUMENTS,
    view_hr_performance: P.VIEW_STAFF_PERFORMANCE,
    manage_hr_performance: P.MANAGE_STAFF_PERFORMANCE,
    view_complaints: P.VIEW_STAFF_COMPLAINTS,
    manage_complaints: P.MANAGE_STAFF_COMPLAINTS,
    view_communication: P.VIEW_STAFF_COMPLAINTS,
    manage_communication: P.MANAGE_STAFF_COMPLAINTS,
    view_audit: P.VIEW_COMPANY_AUDIT_LOGS,
    manage_audit: P.MANAGE_COMPLIANCE,
    view_approvals: P.VIEW_APPROVAL_CHAIN,
    manage_approvals: P.MANAGE_APPROVAL_CHAIN,
    manage_approval_chains: P.MANAGE_APPROVAL_CHAIN,
    view_reservations: P.VIEW_BOOKING_REQUESTS,
    manage_reservations: P.MANAGE_BOOKING,
    approve_reservations: P.MANAGE_BOOKING,
    manage_reception: P.MANAGE_BOOKING,
    view_attendance: P.VIEW_STAFF_ATTENDANCE,
    manage_attendance: P.VIEW_STAFF_ATTENDANCE,
    manage_staff_attendance: P.VIEW_STAFF_ATTENDANCE,
    view_time: P.VIEW_STAFF_ATTENDANCE,
    manage_time: P.VIEW_STAFF_ATTENDANCE,
    view_shifts: P.VIEW_SHIFT_ASSIGNMENTS,
    manage_shifts: P.MANAGE_SHIFT_ASSIGNMENTS,
    view_schedule: P.VIEW_SHIFT_ASSIGNMENTS,
    manage_schedule: P.MANAGE_SHIFT_ASSIGNMENTS,
    view_calendar_events: P.VIEW_COMPANY_CALENDAR,
    manage_calendar_events: P.MANAGE_COMPANY_CALENDAR,
    view_leave: P.VIEW_LEAVE_REQUESTS,
    manage_leave: P.MANAGE_LEAVE_REQUESTS,
    manage_leave_policy: P.MANAGE_LEAVE_REQUESTS,
    approve_leave: P.MANAGE_LEAVE_REQUESTS,
    view_tasks: P.VIEW_WORK_ORDERS,
    manage_tasks: P.MANAGE_WORK_ORDERS,
    view_operations: P.VIEW_FACILITIES,
    manage_operations: P.MANAGE_FACILITIES,
    view_financial_periods: P.VIEW_FINANCIAL_STATEMENTS,
    manage_financial_periods: P.MANAGE_FINANCIAL_REPORTS,
    view_procurement: P.VIEW_INVENTORY,
    manage_procurement: P.MANAGE_INVENTORY,
    approve_procurement: P.MANAGE_INVENTORY,
    request_funds: P.MANAGE_COMPANY_WALLETS,
    view_fund_requests: P.VIEW_COMPANY_WALLET,
    approve_fund_requests: P.MANAGE_COMPANY_WALLETS,
    request_extra_funds: P.MANAGE_COMPANY_WALLETS,
    view_extra_fund_requests: P.VIEW_COMPANY_WALLET,
    approve_extra_fund_requests: P.MANAGE_COMPANY_WALLETS,
    view_disbursements: P.VIEW_COMPANY_WALLET,
    manage_disbursements: P.MANAGE_COMPANY_WALLETS,
    approve_disbursements: P.MANAGE_COMPANY_WALLETS,
    view_branch_leave: P.VIEW_ALL_BRANCHES,
    view_branch_approvals: P.VIEW_ALL_BRANCHES,
    view_branch_financials: P.VIEW_ALL_BRANCHES,
    view_branch_shifts: P.VIEW_ALL_BRANCHES,
    view_branch_tasks: P.VIEW_ALL_BRANCHES,
    view_branch_reception: P.VIEW_ALL_BRANCHES,
    view_branch_facility: P.VIEW_ALL_BRANCHES,
    staff_view_all_branches: P.VIEW_ALL_BRANCHES,
    staff_view_branch_staff: P.VIEW_BRANCH_STAFF,
    staff_view_branch_leave: P.VIEW_ALL_BRANCHES,
    staff_view_branch_approvals: P.VIEW_ALL_BRANCHES,
    staff_view_branch_financials: P.VIEW_ALL_BRANCHES,
    staff_view_branch_shifts: P.VIEW_ALL_BRANCHES,
    staff_view_branch_tasks: P.VIEW_ALL_BRANCHES,
    staff_view_branch_reception: P.VIEW_ALL_BRANCHES,
    staff_view_branch_facility: P.VIEW_ALL_BRANCHES,
    staff_access_facility: P.VIEW_FACILITIES,
    staff_manage_facility: P.MANAGE_FACILITIES,
    staff_access_reception: P.VIEW_RECEPTION,
    staff_manage_reception: P.MANAGE_BOOKING,
    staff_view_operations: P.VIEW_FACILITIES,
    staff_manage_operations: P.MANAGE_FACILITIES,
    staff_access_branch: P.VIEW_ALL_BRANCHES,
    staff_manage_branch: P.MANAGE_ALL_BRANCHES,
    staff_view_payroll: P.VIEW_PAYROLL,
    staff_manage_payroll: P.MANAGE_PAYROLL,
    staff_manage_schedule: P.MANAGE_SHIFT_ASSIGNMENTS,
    staff_view_communication: P.VIEW_STAFF_COMPLAINTS,
    staff_manage_communication: P.MANAGE_STAFF_COMPLAINTS,
    staff_view_kitchen: P.VIEW_KITCHEN_BOARD,
    staff_manage_kitchen: P.MANAGE_KITCHEN_BOARD,
    staff_view_tasks: P.VIEW_WORK_ORDERS,
    staff_manage_tasks: P.MANAGE_WORK_ORDERS,
    staff_view_schedule: P.VIEW_SHIFT_ASSIGNMENTS,
    staff_view_reception: P.VIEW_RECEPTION,
    staff_view_hotel: P.VIEW_RECEPTION,
    staff_manage_hotel: P.MANAGE_BOOKING,
    staff_view_restaurant: P.VIEW_KITCHEN_BOARD,
    staff_manage_restaurant: P.MANAGE_KITCHEN_ORDERS,
    staff_view_branch: P.VIEW_ALL_BRANCHES,
    staff_send_payroll: P.SEND_PAYROLL,
    staff_view_payroll_reports: P.VIEW_PAYROLL_YTD,
    staff_manage_payroll_schedules: P.MANAGE_PAYROLL_SCHEDULES,
    staff_view_branch_budget: P.VIEW_COMPANY_BUDGET,
    staff_request_funds: P.MANAGE_COMPANY_WALLETS,
    staff_view_fund_requests: P.VIEW_COMPANY_WALLET,
    staff_request_extra_funds: P.MANAGE_COMPANY_WALLETS,
    staff_view_extra_fund_requests: P.VIEW_COMPANY_WALLET,
    staff_view_disbursements: P.VIEW_COMPANY_WALLET,
    staff_manage_disbursements: P.MANAGE_COMPANY_WALLETS,
    staff_approve_disbursements: P.MANAGE_COMPANY_WALLETS,
    staff_view_allocations: P.VIEW_ALLOCATIONS,
    staff_manage_allocations: P.MANAGE_ALLOCATIONS,
    staff_manage_time: P.VIEW_STAFF_ATTENDANCE,
    staff_view_time: P.VIEW_STAFF_ATTENDANCE,
    STAFF_VIEW_KITCHEN: P.VIEW_KITCHEN_BOARD,
    STAFF_MANAGE_KITCHEN: P.MANAGE_KITCHEN_BOARD,
    STAFF_VIEW_TASKS: P.VIEW_WORK_ORDERS,
    STAFF_MANAGE_TASKS: P.MANAGE_WORK_ORDERS,
    STAFF_VIEW_OPERATIONS: P.VIEW_FACILITIES,
    STAFF_MANAGE_OPERATIONS: P.MANAGE_FACILITIES,
    STAFF_VIEW_SCHEDULE: P.VIEW_SHIFT_ASSIGNMENTS,
    STAFF_MANAGE_SCHEDULE: P.MANAGE_SHIFT_ASSIGNMENTS,
    STAFF_MANAGE_TIME: P.VIEW_STAFF_ATTENDANCE,
    STAFF_VIEW_COMMUNICATION: P.VIEW_STAFF_COMPLAINTS,
    STAFF_MANAGE_COMMUNICATION: P.MANAGE_STAFF_COMPLAINTS,
    STAFF_VIEW_PAYROLL: P.VIEW_PAYROLL,
    STAFF_MANAGE_PAYROLL: P.MANAGE_PAYROLL,
    STAFF_SEND_PAYROLL: P.SEND_PAYROLL,
    STAFF_VIEW_PAYROLL_REPORTS: P.VIEW_PAYROLL_YTD,
    STAFF_MANAGE_PAYROLL_SCHEDULES: P.MANAGE_PAYROLL_SCHEDULES,
    STAFF_VIEW_BRANCH_BUDGET: P.VIEW_COMPANY_BUDGET,
    STAFF_REQUEST_FUNDS: P.MANAGE_COMPANY_WALLETS,
    STAFF_VIEW_FUND_REQUESTS: P.VIEW_COMPANY_WALLET,
    STAFF_REQUEST_EXTRA_FUNDS: P.MANAGE_COMPANY_WALLETS,
    STAFF_VIEW_EXTRA_FUND_REQUESTS: P.VIEW_COMPANY_WALLET,
    STAFF_VIEW_DISBURSEMENTS: P.VIEW_COMPANY_WALLET,
    STAFF_MANAGE_DISBURSEMENTS: P.MANAGE_COMPANY_WALLETS,
    STAFF_APPROVE_DISBURSEMENTS: P.MANAGE_COMPANY_WALLETS,
    STAFF_VIEW_ALLOCATIONS: P.VIEW_ALLOCATIONS,
    STAFF_MANAGE_ALLOCATIONS: P.MANAGE_ALLOCATIONS,
    STAFF_VIEW_RECEPTION: P.VIEW_RECEPTION,
    STAFF_MANAGE_RECEPTION: P.MANAGE_BOOKING,
    STAFF_VIEW_BRANCH: P.VIEW_ALL_BRANCHES,
    STAFF_MANAGE_BRANCH: P.MANAGE_ALL_BRANCHES,
    STAFF_VIEW_HOTEL: P.VIEW_RECEPTION,
    STAFF_MANAGE_HOTEL: P.MANAGE_BOOKING,
    STAFF_VIEW_RESTAURANT: P.VIEW_KITCHEN_BOARD,
    STAFF_MANAGE_RESTAURANT: P.MANAGE_KITCHEN_ORDERS,
    BUSINESS_USER_MANAGE_ORGANIZATION: P.MANAGE_COMPANY_DETAILS,
    BUSINESS_USER_VIEW_PAYROLLS: P.VIEW_PAYROLL,
    BUSINESS_USER_MANAGE_PAYROLLS: P.MANAGE_PAYROLL,
    business_user_manage_organization: P.MANAGE_COMPANY_DETAILS,
    business_user_restrict_branch_access: P.MANAGE_ALL_BRANCHES,
    business_user_view_finances: P.VIEW_FINANCIALS_ANALYTICS,
    business_user_manage_finances: P.MANAGE_FINANCIAL_REPORTS,
    business_user_view_payrolls: P.VIEW_PAYROLL,
    business_user_manage_payrolls: P.MANAGE_PAYROLL,
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
    const trimmed = value.trim();
    if (!trimmed)
        return trimmed;
    const lower = trimmed.toLowerCase();
    return exports.LEGACY_PERMISSION_RENAMES[lower] ?? lower;
}
/**
 * Approval-chain entity slugs (events ApprovalChainService) → the grant that
 * marks a company/staff role as eligible to sit on that chain's steps.
 */
exports.APPROVAL_ENTITY_PERMISSIONS = {
    payroll: P.APPROVE_PAYROLLS,
    budget: P.APPROVE_MONTHLY_BUDGETS,
    leave: P.MANAGE_LEAVE_REQUESTS,
    vendor: P.MANAGE_INVENTORY,
    purchase_request: P.MANAGE_INVENTORY,
    purchase_order: P.MANAGE_INVENTORY,
    goods_receipt: P.MANAGE_INVENTORY,
    reservation: P.MANAGE_BOOKING,
    booking: P.MANAGE_BOOKING,
    wallet_withdrawal: P.MANAGE_COMPANY_WALLETS,
    withdrawal: P.MANAGE_COMPANY_WALLETS,
    salary_advance: P.APPROVE_PAYROLLS,
    advance: P.APPROVE_PAYROLLS,
    staff_termination: P.MANAGE_BRANCH_STAFF,
    termination: P.MANAGE_BRANCH_STAFF,
};
/** Looks up the approve_* permission for an approval-entity slug. */
function approvalPermissionForEntity(entityTypeSlug) {
    if (!entityTypeSlug)
        return undefined;
    return exports.APPROVAL_ENTITY_PERMISSIONS[entityTypeSlug.toLowerCase()];
}
/**
 * Any-of permissions that open the personal approvals inbox.
 * Chain configuration stays on view/manage_approval_chain; inbox is also
 * available to anyone who can sit on a chain step.
 */
exports.APPROVAL_INBOX_PERMISSIONS = Array.from(new Set([
    P.VIEW_APPROVAL_CHAIN,
    P.MANAGE_APPROVAL_CHAIN,
    ...Object.values(exports.APPROVAL_ENTITY_PERMISSIONS),
]));
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
exports.BOOTSTRAP_ROLE_SLUGS = {
    /** Organization-wide admin, held by business users. Assigned to the creator. */
    BUSINESS_ADMIN: "business-admin",
    /** Company-wide admin, held by staff. Assigned to staff as they are onboarded. */
    ADMIN_USER: "admin-user",
};
/**
 * Old bootstrap slug → current slug.
 *
 * Provisioning matches an existing role by slug, so a rename without this map
 * would leave the old role in place and create a second one beside it. The
 * organization-service provisioner renames in place instead, which keeps every
 * staff assignment pointing at the same role_id.
 */
exports.LEGACY_BOOTSTRAP_ROLE_SLUGS = {
    "staff-admin": exports.BOOTSTRAP_ROLE_SLUGS.ADMIN_USER,
};
//# sourceMappingURL=permissions.js.map
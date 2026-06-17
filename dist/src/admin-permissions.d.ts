/** Platform admin permission slugs — single source for seed, guards, and services. */
export declare enum AdminPlatformPermission {
    VIEW_DASHBOARD = "admin_view_dashboard",
    MANAGE_DASHBOARD = "admin_manage_dashboard",
    VIEW_CHATS = "admin_view_chats",
    MANAGE_CHATS = "admin_manage_chats",
    VIEW_SUPPORT = "admin_view_support",
    MANAGE_SUPPORT = "admin_manage_support",
    VIEW_USERS = "admin_view_users",
    MANAGE_USERS = "admin_manage_users",
    VIEW_ORGANIZATIONS = "admin_view_organizations",
    MANAGE_ORGANIZATIONS = "admin_manage_organizations",
    VIEW_SECURITY = "admin_view_security",
    MANAGE_SECURITY = "admin_manage_security",
    VIEW_FINANCIAL = "admin_view_financial",
    MANAGE_FINANCIAL = "admin_manage_financial",
    VIEW_TRANSACTIONS = "admin_view_transactions",
    MANAGE_TRANSACTIONS = "admin_manage_transactions",
    VIEW_PAYROLLS = "admin_view_payrolls",
    MANAGE_PAYROLLS = "admin_manage_payrolls",
    VIEW_DISBURSEMENTS = "admin_view_disbursements",
    MANAGE_DISBURSEMENTS = "admin_manage_disbursements",
    VIEW_SUBSCRIPTIONS = "admin_view_subscriptions",
    MANAGE_SUBSCRIPTIONS = "admin_manage_subscriptions",
    VIEW_FINANCIAL_AUDIT = "admin_view_financial_audit",
    MANAGE_FINANCIAL_AUDIT = "admin_manage_financial_audit",
    VIEW_ADMIN_TEAM = "admin_view_admin_team",
    MANAGE_ADMIN_TEAM = "admin_manage_admin_team",
    VIEW_ADMIN_ROLES = "admin_view_admin_roles",
    MANAGE_ADMIN_ROLES = "admin_manage_admin_roles",
    VIEW_SETTINGS = "admin_view_settings",
    MANAGE_SETTINGS = "admin_manage_settings"
}
/** Nav sections — keys match `AdminModule` names in admin.proto. */
export declare enum AdminNavModule {
    DASHBOARD = "DASHBOARD",
    CHATS = "CHATS",
    SUPPORT = "SUPPORT",
    MANAGEMENT = "MANAGEMENT",
    SECURITY = "SECURITY",
    FINANCIAL = "FINANCIAL",
    SETTINGS = "SETTINGS",
    ADMIN_MANAGEMENT = "ADMIN_MANAGEMENT"
}
export type AdminPermissionDef = {
    name: string;
    description: string;
    level: number;
};
export type AdminPermissionGroupDef = {
    group_name: string;
    description: string;
    level: number;
    group_type: string;
    permissions: AdminPermissionDef[];
};
/** Fine-grained admin permissions — view + manage per page. */
export declare const ADMIN_PERMISSION_GROUPS: AdminPermissionGroupDef[];
export declare const ALL_ADMIN_PERMISSION_NAMES: string[];
/** Default ADMIN role — everything except admin team / roles management. */
export declare const DEFAULT_ADMIN_PERMISSION_NAMES: string[];
/** View permissions that grant access to a nav section / route group. */
export declare const ADMIN_MODULE_VIEW_PERMISSIONS: Record<AdminNavModule, string[]>;
/** Manage permissions required for mutating actions within a section. */
export declare const ADMIN_MODULE_MANAGE_PERMISSIONS: Record<AdminNavModule, string[]>;
/** Frontend admin nav keys → view permissions for sidebar / route guards. */
export declare const ADMIN_NAV_SECTION_VIEW_PERMISSIONS: {
    readonly overview: string[];
    readonly chats: string[];
    readonly support: string[];
    readonly management: string[];
    readonly security: string[];
    readonly adminTeam: string[];
    readonly financial: string[];
    readonly settings: string[];
};
/** @deprecated Use ADMIN_NAV_SECTION_VIEW_PERMISSIONS — kept for existing imports. */
export declare const NAV_SECTION_VIEW_PERMISSIONS: {
    readonly overview: string[];
    readonly chats: string[];
    readonly support: string[];
    readonly management: string[];
    readonly security: string[];
    readonly adminTeam: string[];
    readonly financial: string[];
    readonly settings: string[];
};
//# sourceMappingURL=admin-permissions.d.ts.map
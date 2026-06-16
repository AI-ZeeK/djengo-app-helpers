/** Platform admin permission slugs — single source for seed, guards, and services. */
export enum AdminPlatformPermission {
  VIEW_DASHBOARD = 'admin_view_dashboard',
  MANAGE_DASHBOARD = 'admin_manage_dashboard',
  VIEW_CHATS = 'admin_view_chats',
  MANAGE_CHATS = 'admin_manage_chats',
  VIEW_SUPPORT = 'admin_view_support',
  MANAGE_SUPPORT = 'admin_manage_support',
  VIEW_USERS = 'admin_view_users',
  MANAGE_USERS = 'admin_manage_users',
  VIEW_ORGANIZATIONS = 'admin_view_organizations',
  MANAGE_ORGANIZATIONS = 'admin_manage_organizations',
  VIEW_SECURITY = 'admin_view_security',
  MANAGE_SECURITY = 'admin_manage_security',
  VIEW_FINANCIAL = 'admin_view_financial',
  MANAGE_FINANCIAL = 'admin_manage_financial',
  VIEW_TRANSACTIONS = 'admin_view_transactions',
  MANAGE_TRANSACTIONS = 'admin_manage_transactions',
  VIEW_PAYROLLS = 'admin_view_payrolls',
  MANAGE_PAYROLLS = 'admin_manage_payrolls',
  VIEW_DISBURSEMENTS = 'admin_view_disbursements',
  MANAGE_DISBURSEMENTS = 'admin_manage_disbursements',
  VIEW_SUBSCRIPTIONS = 'admin_view_subscriptions',
  MANAGE_SUBSCRIPTIONS = 'admin_manage_subscriptions',
  VIEW_FINANCIAL_AUDIT = 'admin_view_financial_audit',
  MANAGE_FINANCIAL_AUDIT = 'admin_manage_financial_audit',
  VIEW_ADMIN_TEAM = 'admin_view_admin_team',
  MANAGE_ADMIN_TEAM = 'admin_manage_admin_team',
  VIEW_ADMIN_ROLES = 'admin_view_admin_roles',
  MANAGE_ADMIN_ROLES = 'admin_manage_admin_roles',
  VIEW_SETTINGS = 'admin_view_settings',
  MANAGE_SETTINGS = 'admin_manage_settings',
}

/** Nav sections — keys match `AdminModule` names in admin.proto. */
export enum AdminNavModule {
  DASHBOARD = 'DASHBOARD',
  CHATS = 'CHATS',
  SUPPORT = 'SUPPORT',
  MANAGEMENT = 'MANAGEMENT',
  SECURITY = 'SECURITY',
  FINANCIAL = 'FINANCIAL',
  SETTINGS = 'SETTINGS',
  ADMIN_MANAGEMENT = 'ADMIN_MANAGEMENT',
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

const P = AdminPlatformPermission;

/** Fine-grained admin permissions — view + manage per page. */
export const ADMIN_PERMISSION_GROUPS: AdminPermissionGroupDef[] = [
  {
    group_name: 'Overview',
    description: 'Dashboard overview and analytics',
    level: 1,
    group_type: 'PAGE_ACCESS',
    permissions: [
      { name: P.VIEW_DASHBOARD, description: 'View overview dashboard', level: 1 },
      { name: P.MANAGE_DASHBOARD, description: 'Manage overview dashboard', level: 2 },
    ],
  },
  {
    group_name: 'Chats',
    description: 'Platform chat moderation',
    level: 1,
    group_type: 'PAGE_ACCESS',
    permissions: [
      { name: P.VIEW_CHATS, description: 'View chats', level: 1 },
      { name: P.MANAGE_CHATS, description: 'Manage chats', level: 2 },
    ],
  },
  {
    group_name: 'Support',
    description: 'Support tickets and help desk',
    level: 1,
    group_type: 'PAGE_ACCESS',
    permissions: [
      { name: P.VIEW_SUPPORT, description: 'View support tickets', level: 1 },
      { name: P.MANAGE_SUPPORT, description: 'Manage support tickets', level: 2 },
    ],
  },
  {
    group_name: 'Users',
    description: 'Tenant user management',
    level: 1,
    group_type: 'PAGE_ACCESS',
    permissions: [
      { name: P.VIEW_USERS, description: 'View platform users', level: 1 },
      { name: P.MANAGE_USERS, description: 'Manage platform users', level: 2 },
    ],
  },
  {
    group_name: 'Organizations',
    description: 'Organization and company management',
    level: 1,
    group_type: 'PAGE_ACCESS',
    permissions: [
      { name: P.VIEW_ORGANIZATIONS, description: 'View organizations', level: 1 },
      { name: P.MANAGE_ORGANIZATIONS, description: 'Manage organizations', level: 2 },
    ],
  },
  {
    group_name: 'Security',
    description: 'Security monitoring and restrictions',
    level: 1,
    group_type: 'SECURITY',
    permissions: [
      { name: P.VIEW_SECURITY, description: 'View security pages', level: 1 },
      { name: P.MANAGE_SECURITY, description: 'Apply security actions', level: 2 },
    ],
  },
  {
    group_name: 'Financial Overview',
    description: 'Financial dashboard',
    level: 1,
    group_type: 'FINANCIALS',
    permissions: [
      { name: P.VIEW_FINANCIAL, description: 'View financial overview', level: 1 },
      { name: P.MANAGE_FINANCIAL, description: 'Manage financial overview', level: 2 },
    ],
  },
  {
    group_name: 'Transactions',
    description: 'Transaction ledger',
    level: 1,
    group_type: 'FINANCIALS',
    permissions: [
      { name: P.VIEW_TRANSACTIONS, description: 'View transactions', level: 1 },
      { name: P.MANAGE_TRANSACTIONS, description: 'Manage transactions', level: 2 },
    ],
  },
  {
    group_name: 'Payrolls',
    description: 'Payroll administration',
    level: 1,
    group_type: 'FINANCIALS',
    permissions: [
      { name: P.VIEW_PAYROLLS, description: 'View payrolls', level: 1 },
      { name: P.MANAGE_PAYROLLS, description: 'Manage payrolls', level: 2 },
    ],
  },
  {
    group_name: 'Disbursements',
    description: 'Disbursement operations',
    level: 1,
    group_type: 'FINANCIALS',
    permissions: [
      { name: P.VIEW_DISBURSEMENTS, description: 'View disbursements', level: 1 },
      { name: P.MANAGE_DISBURSEMENTS, description: 'Manage disbursements', level: 2 },
    ],
  },
  {
    group_name: 'Subscriptions',
    description: 'Subscription billing',
    level: 1,
    group_type: 'FINANCIALS',
    permissions: [
      { name: P.VIEW_SUBSCRIPTIONS, description: 'View subscriptions', level: 1 },
      { name: P.MANAGE_SUBSCRIPTIONS, description: 'Manage subscriptions', level: 2 },
    ],
  },
  {
    group_name: 'Financial Audit',
    description: 'Financial audit logs',
    level: 1,
    group_type: 'FINANCIALS',
    permissions: [
      { name: P.VIEW_FINANCIAL_AUDIT, description: 'View financial audit logs', level: 1 },
      { name: P.MANAGE_FINANCIAL_AUDIT, description: 'Manage financial audit logs', level: 2 },
    ],
  },
  {
    group_name: 'Admin Team',
    description: 'Platform admin accounts',
    level: 1,
    group_type: 'ADMIN_MANAGEMENT',
    permissions: [
      { name: P.VIEW_ADMIN_TEAM, description: 'View admin team accounts', level: 1 },
      { name: P.MANAGE_ADMIN_TEAM, description: 'Create and edit admin accounts', level: 2 },
    ],
  },
  {
    group_name: 'Admin Roles',
    description: 'Platform admin roles and permissions',
    level: 1,
    group_type: 'ADMIN_MANAGEMENT',
    permissions: [
      { name: P.VIEW_ADMIN_ROLES, description: 'View admin roles', level: 1 },
      { name: P.MANAGE_ADMIN_ROLES, description: 'Create and edit admin roles', level: 2 },
    ],
  },
  {
    group_name: 'Settings',
    description: 'Platform settings',
    level: 1,
    group_type: 'GENERAL',
    permissions: [
      { name: P.VIEW_SETTINGS, description: 'View settings', level: 1 },
      { name: P.MANAGE_SETTINGS, description: 'Manage settings', level: 2 },
    ],
  },
];

export const ALL_ADMIN_PERMISSION_NAMES = ADMIN_PERMISSION_GROUPS.flatMap((g) =>
  g.permissions.map((p) => p.name),
);

/** Default ADMIN role — everything except admin team / roles management. */
export const DEFAULT_ADMIN_PERMISSION_NAMES = ALL_ADMIN_PERMISSION_NAMES.filter(
  (n) => !n.includes('admin_team') && !n.includes('admin_roles'),
);

/** View permissions that grant access to a nav section / route group. */
export const ADMIN_MODULE_VIEW_PERMISSIONS: Record<AdminNavModule, string[]> = {
  [AdminNavModule.DASHBOARD]: [P.VIEW_DASHBOARD],
  [AdminNavModule.CHATS]: [P.VIEW_CHATS],
  [AdminNavModule.SUPPORT]: [P.VIEW_SUPPORT],
  [AdminNavModule.MANAGEMENT]: [P.VIEW_USERS, P.VIEW_ORGANIZATIONS],
  [AdminNavModule.SECURITY]: [P.VIEW_SECURITY],
  [AdminNavModule.FINANCIAL]: [
    P.VIEW_FINANCIAL,
    P.VIEW_TRANSACTIONS,
    P.VIEW_PAYROLLS,
    P.VIEW_DISBURSEMENTS,
    P.VIEW_SUBSCRIPTIONS,
    P.VIEW_FINANCIAL_AUDIT,
  ],
  [AdminNavModule.SETTINGS]: [P.VIEW_SETTINGS],
  [AdminNavModule.ADMIN_MANAGEMENT]: [P.VIEW_ADMIN_TEAM, P.VIEW_ADMIN_ROLES],
};

/** Manage permissions required for mutating actions within a section. */
export const ADMIN_MODULE_MANAGE_PERMISSIONS: Record<AdminNavModule, string[]> = {
  [AdminNavModule.DASHBOARD]: [P.MANAGE_DASHBOARD],
  [AdminNavModule.CHATS]: [P.MANAGE_CHATS],
  [AdminNavModule.SUPPORT]: [P.MANAGE_SUPPORT],
  [AdminNavModule.MANAGEMENT]: [P.MANAGE_USERS, P.MANAGE_ORGANIZATIONS],
  [AdminNavModule.SECURITY]: [P.MANAGE_SECURITY],
  [AdminNavModule.FINANCIAL]: [
    P.MANAGE_FINANCIAL,
    P.MANAGE_TRANSACTIONS,
    P.MANAGE_PAYROLLS,
    P.MANAGE_DISBURSEMENTS,
    P.MANAGE_SUBSCRIPTIONS,
    P.MANAGE_FINANCIAL_AUDIT,
  ],
  [AdminNavModule.SETTINGS]: [P.MANAGE_SETTINGS],
  [AdminNavModule.ADMIN_MANAGEMENT]: [P.MANAGE_ADMIN_TEAM, P.MANAGE_ADMIN_ROLES],
};

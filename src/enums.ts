export enum CALENDAR_EVENT_TYPE_ENUM {
  MEETING = "MEETING",
  TASK = "TASK",
  REMINDER = "REMINDER",
  HOLIDAY = "HOLIDAY",
  LEAVE = "LEAVE",
  STAFF_EVENT = "STAFF_EVENT",
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_UPDATED = "ORDER_UPDATED",
  ORDER_COMPLETED = "ORDER_COMPLETED",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  PAYMENT_DUE = "PAYMENT_DUE",
  INVOICE_GENERATED = "INVOICE_GENERATED",
  INVOICE_DUE = "INVOICE_DUE",
  SYSTEM_NOTIFICATION = "SYSTEM_NOTIFICATION",
  OTHER = "OTHER",
}

export enum COMPANY_SERVICE_TYPE_ENUM {
  SPA = "SPA",
  HOTEL = "HOTEL",
  RESTAURANT = "RESTAURANT",
  SUPERMARKET = "SUPERMARKET",
  HOSPITAL = "HOSPITAL",
  GYM = "GYM",
}
export enum DAY_OF_WEEK_ENUM {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export enum BED_SIZE_ENUM {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
  QUEEN = "QUEEN",
  KING = "KING",
  CALIFORNIA_KING = "CALIFORNIA_KING",
  TWIN = "TWIN",
  TWIN_XL = "TWIN_XL",
  BUNK = "BUNK",
  SOFA_BED = "SOFA_BED",
}

export enum ROOM_LOCATION_TYPE_ENUM {
  NORTH_WING = "NORTH_WING",
  SOUTH_WING = "SOUTH_WING",
  EAST_WING = "EAST_WING",
  WEST_WING = "WEST_WING",
  CENTRAL_AREA = "CENTRAL_AREA",
  PENTHOUSE = "PENTHOUSE",
}

export enum TABLE_LOCATION_TYPE_ENUM {
  WINDOW = "WINDOW",
  CENTER_AREA = "CENTER_AREA",
  ENTRANCE = "ENTRANCE",
  BAR = "BAR",
  PATIO = "PATIO",
  QUIET_CORNER = "QUIET_CORNER",
  HIGH_TRAFFIC_AREA = "HIGH_TRAFFIC_AREA",
  PRIVATE_SECTION = "PRIVATE_SECTION",
}

export enum BUSINESS_DAY_ENUM {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export enum ROLES_ENUM {
  PLATFORM_USER = "PLATFORM_USER",
  BUSINESS_USER = "BUSINESS_USER",
  PLATFORM = "PLATFORM",
  CLIENT = "CLIENT",
  BRANCH = "BRANCH",
  STAFF = "STAFF",
  TENANT = "TENANT",

  AGENCY = "AGENCY",
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
}

export enum BASE_ORGANIZATION_ROLE_ENUM {
  CREATOR = "CREATOR",
}

export enum TIMELINE_ENUM {
  _1m = "1m",
  _3m = "3m",
  _6m = "6m",
  _1y = "1y",
  all = "all",
}
export enum PARTNER_TYPE {
  TENANT = "TENANT", // e.g. tenant in an estate or commercial property
  CONTRACTOR = "CONTRACTOR", // e.g. building or maintenance contractor
  VENDOR = "VENDOR", // goods supplier
  FREELANCER = "FREELANCER", // project-based independent worker
  CONSULTANT = "CONSULTANT", // advisory / professional services
  AGENT = "AGENT", // sales or letting agent
  OTHER = "OTHER", // catch-all
}

export enum ADDRESS_TYPE_ENUM {
  USER_HOME = "user_home",
  USER_WORK = "user_work",
  BUSINESS_PRIMARY = "business_primary",
  BUSINESS_BRANCH = "business_branch",
  CALENDAR_EVENT = "calendar_event",
  PROFI_SERVICE_AREA = "profi_service_area",
  ORDER_DELIVERY = "order_delivery",
  TRAINING_VENUE = "training_venue",
  INSTRUCTOR_LOCATION = "instructor_location",
  BILLING_ADDRESS = "billing_address",
  BANK_BRANCH = "bank_branch",
  MANUFACTURER_LOCATION = "manufacturer_location",
  SUPPLIER_LOCATION = "supplier_location",
  WAREHOUSE_LOCATION = "warehouse_location",
  STORAGE_LOCATION = "storage_location",
  CREATED_CLIENT = "created_client",
}

export enum FILE_ENTITY_TYPE_ENUM {
  USER_AVATAR = "user_avatar",
  ORGANIZATION_LOGO = "organization_logo",
  BUSINESS_LOGO = "business_logo",
  PLATFORM_USER_AVATAR = "platform_user_avatar",
  ADDRESS_PROOF = "address_proof",
  IDENTITY_PROOF = "identity_proof",
  EMPLOYMENT_CONTRACT = "employment_contract",
  TAX_DOCUMENT = "tax_document",
  BANK_DETAILS = "bank_details",
  RESUME = "resume",
}

/**
 * User roles in the system
 */
export enum UserRole {
  PLATFORM_USER = "PLATFORM_USER",
  BUSINESS_USER = "BUSINESS_USER",
  PLATFORM = "PLATFORM",
  CLIENT = "CLIENT",
  BRANCH = "BRANCH",
  STAFF = "STAFF",
  ESTATE_TENANT = "ESTATE_TENANT",
  AGENCY = "AGENCY",
}

//  * Base organization roles
//  */
export enum OrganizationRole {
  CREATOR = "CREATOR",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

/**
 * Address types in the system
 */
export enum AddressType {
  USER_HOME = "user_home",
  USER_WORK = "user_work",
  BUSINESS_PRIMARY = "business_primary",
  BUSINESS_BRANCH = "business_branch",
  CALENDAR_EVENT = "calendar_event",
  SERVICE_AREA = "service_area",
  ORDER_DELIVERY = "order_delivery",
  TRAINING_VENUE = "training_venue",
  INSTRUCTOR_LOCATION = "instructor_location",
  BILLING_ADDRESS = "billing_address",
  BANK_BRANCH = "bank_branch",
  MANUFACTURER_LOCATION = "manufacturer_location",
  SUPPLIER_LOCATION = "supplier_location",
  WAREHOUSE_LOCATION = "warehouse_location",
  STORAGE_LOCATION = "storage_location",
}

/**
 * File entity types
 */
export enum FileEntityType {
  USER_AVATAR = "user_avatar",
  ORGANIZATION_LOGO = "organization_logo",
  BUSINESS_LOGO = "business_logo",
  PRODUCT_IMAGE = "product_image",
  DOCUMENT = "document",
}

/**
 * Email types
 */
export enum EmailType {
  WELCOME = "welcome",
  VERIFICATION = "verification",
  PASSWORD_RESET = "password_reset",
  OTP = "otp",
  NOTIFICATION = "notification",
}

/**
 * Notification types
 */
export enum NotificationType {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
  IN_APP = "in_app",
}

/**
 * OTP types
 */
export enum OtpType {
  SIGNIN = "signin",
  REGISTRATION = "registration",
  PASSWORD_RESET = "password_reset",
  EMAIL_VERIFICATION = "email_verification",
}

/**
 * User status
 */
export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING = "pending",
  BLOCKED = "blocked",
}

/**
 * Business user permissions
 */
export enum BusinessUserPermission {
  VIEW_DASHBOARD = "BUSINESS_USER_VIEW_DASHBOARD",
  MANAGE_ORGANIZATION = "BUSINESS_USER_MANAGE_ORGANIZATION",
  VIEW_COMPANIES = "BUSINESS_USER_VIEW_COMPANIES",
  MANAGE_COMPANIES = "BUSINESS_USER_MANAGE_COMPANIES",
  VIEW_BRANCHES = "BUSINESS_USER_VIEW_BRANCHES",
  MANAGE_BRANCHES = "BUSINESS_USER_MANAGE_BRANCHES",
  RESTRICT_BRANCH_ACCESS = "BUSINESS_USER_RESTRICT_BRANCH_ACCESS",
  VIEW_STAFF = "BUSINESS_USER_VIEW_STAFF",
  MANAGE_STAFF = "BUSINESS_USER_MANAGE_STAFF",
  VIEW_FINANCES = "BUSINESS_USER_VIEW_FINANCES",
  MANAGE_FINANCES = "BUSINESS_USER_MANAGE_FINANCES",
}

/**
 * Staff permissions
 */
export enum StaffPermission {
  VIEW_DASHBOARD = "STAFF_VIEW_DASHBOARD",
  MANAGE_PROFILE = "STAFF_MANAGE_PROFILE",
  VIEW_PROFILE = "STAFF_VIEW_PROFILE",
  MANAGE_SCHEDULE = "STAFF_MANAGE_SCHEDULE",
  VIEW_SCHEDULE = "STAFF_VIEW_SCHEDULE",
  MANAGE_TIME = "STAFF_MANAGE_TIME",
  ACCESS_BRANCH = "STAFF_ACCESS_BRANCH",
  MANAGE_BRANCH = "STAFF_MANAGE_BRANCH",
}

/**
 * Permission restrictions
 */
export enum PermissionRestriction {
  RESTRICT_BRANCH_ACCESS = "RESTRICT_BRANCH_ACCESS",
  RESTRICT_PAGE_ACCESS = "RESTRICT_PAGE_ACCESS",
  RESTRICT_GLOBAL_PERMISSIONS = "RESTRICT_GLOBAL_PERMISSIONS",
  RESTRICT_PAYROLL_ACCESS = "RESTRICT_PAYROLL_ACCESS",
  RESTRICT_PAYROLL_APPROVAL = "RESTRICT_PAYROLL_APPROVAL",
  RESTRICT_PAYROLL_MANAGEMENT = "RESTRICT_PAYROLL_MANAGEMENT",
  RESTRICT_FUND_MANAGEMENT = "RESTRICT_FUND_MANAGEMENT",
  RESTRICT_FUND_APPROVAL = "RESTRICT_FUND_APPROVAL",
}

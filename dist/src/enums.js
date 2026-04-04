"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRestriction = exports.StaffPermission = exports.BusinessUserPermission = exports.UserStatus = exports.OtpType = exports.NotificationType = exports.EmailType = exports.FileEntityType = exports.AddressType = exports.OrganizationRole = exports.UserRole = exports.FILE_ENTITY_TYPE_ENUM = exports.ADDRESS_TYPE_ENUM = exports.TIMELINE_ENUM = exports.BASE_ORGANIZATION_ROLE_ENUM = exports.ROLES_ENUM = exports.BUSINESS_DAY_ENUM = exports.TABLE_LOCATION_TYPE_ENUM = exports.ROOM_LOCATION_TYPE_ENUM = exports.BED_SIZE_ENUM = exports.DAY_OF_WEEK_ENUM = exports.COMPANY_SERVICE_TYPE_ENUM = void 0;
var COMPANY_SERVICE_TYPE_ENUM;
(function (COMPANY_SERVICE_TYPE_ENUM) {
    COMPANY_SERVICE_TYPE_ENUM["SPA"] = "SPA";
    COMPANY_SERVICE_TYPE_ENUM["HOTEL"] = "HOTEL";
    COMPANY_SERVICE_TYPE_ENUM["RESTAURANT"] = "RESTAURANT";
    COMPANY_SERVICE_TYPE_ENUM["SUPERMARKET"] = "SUPERMARKET";
    COMPANY_SERVICE_TYPE_ENUM["HOSPITAL"] = "HOSPITAL";
    COMPANY_SERVICE_TYPE_ENUM["GYM"] = "GYM";
})(COMPANY_SERVICE_TYPE_ENUM || (exports.COMPANY_SERVICE_TYPE_ENUM = COMPANY_SERVICE_TYPE_ENUM = {}));
var DAY_OF_WEEK_ENUM;
(function (DAY_OF_WEEK_ENUM) {
    DAY_OF_WEEK_ENUM["MONDAY"] = "MONDAY";
    DAY_OF_WEEK_ENUM["TUESDAY"] = "TUESDAY";
    DAY_OF_WEEK_ENUM["WEDNESDAY"] = "WEDNESDAY";
    DAY_OF_WEEK_ENUM["THURSDAY"] = "THURSDAY";
    DAY_OF_WEEK_ENUM["FRIDAY"] = "FRIDAY";
    DAY_OF_WEEK_ENUM["SATURDAY"] = "SATURDAY";
    DAY_OF_WEEK_ENUM["SUNDAY"] = "SUNDAY";
})(DAY_OF_WEEK_ENUM || (exports.DAY_OF_WEEK_ENUM = DAY_OF_WEEK_ENUM = {}));
var BED_SIZE_ENUM;
(function (BED_SIZE_ENUM) {
    BED_SIZE_ENUM["SINGLE"] = "SINGLE";
    BED_SIZE_ENUM["DOUBLE"] = "DOUBLE";
    BED_SIZE_ENUM["QUEEN"] = "QUEEN";
    BED_SIZE_ENUM["KING"] = "KING";
    BED_SIZE_ENUM["CALIFORNIA_KING"] = "CALIFORNIA_KING";
    BED_SIZE_ENUM["TWIN"] = "TWIN";
    BED_SIZE_ENUM["TWIN_XL"] = "TWIN_XL";
    BED_SIZE_ENUM["BUNK"] = "BUNK";
    BED_SIZE_ENUM["SOFA_BED"] = "SOFA_BED";
})(BED_SIZE_ENUM || (exports.BED_SIZE_ENUM = BED_SIZE_ENUM = {}));
var ROOM_LOCATION_TYPE_ENUM;
(function (ROOM_LOCATION_TYPE_ENUM) {
    ROOM_LOCATION_TYPE_ENUM["NORTH_WING"] = "NORTH_WING";
    ROOM_LOCATION_TYPE_ENUM["SOUTH_WING"] = "SOUTH_WING";
    ROOM_LOCATION_TYPE_ENUM["EAST_WING"] = "EAST_WING";
    ROOM_LOCATION_TYPE_ENUM["WEST_WING"] = "WEST_WING";
    ROOM_LOCATION_TYPE_ENUM["CENTRAL_AREA"] = "CENTRAL_AREA";
    ROOM_LOCATION_TYPE_ENUM["PENTHOUSE"] = "PENTHOUSE";
})(ROOM_LOCATION_TYPE_ENUM || (exports.ROOM_LOCATION_TYPE_ENUM = ROOM_LOCATION_TYPE_ENUM = {}));
var TABLE_LOCATION_TYPE_ENUM;
(function (TABLE_LOCATION_TYPE_ENUM) {
    TABLE_LOCATION_TYPE_ENUM["WINDOW"] = "WINDOW";
    TABLE_LOCATION_TYPE_ENUM["CENTER_AREA"] = "CENTER_AREA";
    TABLE_LOCATION_TYPE_ENUM["ENTRANCE"] = "ENTRANCE";
    TABLE_LOCATION_TYPE_ENUM["BAR"] = "BAR";
    TABLE_LOCATION_TYPE_ENUM["PATIO"] = "PATIO";
    TABLE_LOCATION_TYPE_ENUM["QUIET_CORNER"] = "QUIET_CORNER";
    TABLE_LOCATION_TYPE_ENUM["HIGH_TRAFFIC_AREA"] = "HIGH_TRAFFIC_AREA";
    TABLE_LOCATION_TYPE_ENUM["PRIVATE_SECTION"] = "PRIVATE_SECTION";
})(TABLE_LOCATION_TYPE_ENUM || (exports.TABLE_LOCATION_TYPE_ENUM = TABLE_LOCATION_TYPE_ENUM = {}));
var BUSINESS_DAY_ENUM;
(function (BUSINESS_DAY_ENUM) {
    BUSINESS_DAY_ENUM["MONDAY"] = "MONDAY";
    BUSINESS_DAY_ENUM["TUESDAY"] = "TUESDAY";
    BUSINESS_DAY_ENUM["WEDNESDAY"] = "WEDNESDAY";
    BUSINESS_DAY_ENUM["THURSDAY"] = "THURSDAY";
    BUSINESS_DAY_ENUM["FRIDAY"] = "FRIDAY";
    BUSINESS_DAY_ENUM["SATURDAY"] = "SATURDAY";
    BUSINESS_DAY_ENUM["SUNDAY"] = "SUNDAY";
})(BUSINESS_DAY_ENUM || (exports.BUSINESS_DAY_ENUM = BUSINESS_DAY_ENUM = {}));
var ROLES_ENUM;
(function (ROLES_ENUM) {
    ROLES_ENUM["PLATFORM_USER"] = "PLATFORM_USER";
    ROLES_ENUM["BUSINESS_USER"] = "BUSINESS_USER";
    ROLES_ENUM["PLATFORM"] = "PLATFORM";
    ROLES_ENUM["CLIENT"] = "CLIENT";
    ROLES_ENUM["BRANCH"] = "BRANCH";
    ROLES_ENUM["STAFF"] = "STAFF";
    ROLES_ENUM["TENANT"] = "TENANT";
    ROLES_ENUM["AGENCY"] = "AGENCY";
    ROLES_ENUM["SUPER_ADMIN"] = "SUPER_ADMIN";
    ROLES_ENUM["ADMIN"] = "ADMIN";
})(ROLES_ENUM || (exports.ROLES_ENUM = ROLES_ENUM = {}));
var BASE_ORGANIZATION_ROLE_ENUM;
(function (BASE_ORGANIZATION_ROLE_ENUM) {
    BASE_ORGANIZATION_ROLE_ENUM["CREATOR"] = "CREATOR";
})(BASE_ORGANIZATION_ROLE_ENUM || (exports.BASE_ORGANIZATION_ROLE_ENUM = BASE_ORGANIZATION_ROLE_ENUM = {}));
var TIMELINE_ENUM;
(function (TIMELINE_ENUM) {
    TIMELINE_ENUM["_1m"] = "1m";
    TIMELINE_ENUM["_3m"] = "3m";
    TIMELINE_ENUM["_6m"] = "6m";
    TIMELINE_ENUM["_1y"] = "1y";
    TIMELINE_ENUM["all"] = "all";
})(TIMELINE_ENUM || (exports.TIMELINE_ENUM = TIMELINE_ENUM = {}));
var ADDRESS_TYPE_ENUM;
(function (ADDRESS_TYPE_ENUM) {
    ADDRESS_TYPE_ENUM["USER_HOME"] = "user_home";
    ADDRESS_TYPE_ENUM["USER_WORK"] = "user_work";
    ADDRESS_TYPE_ENUM["BUSINESS_PRIMARY"] = "business_primary";
    ADDRESS_TYPE_ENUM["BUSINESS_BRANCH"] = "business_branch";
    ADDRESS_TYPE_ENUM["CALENDAR_EVENT"] = "calendar_event";
    ADDRESS_TYPE_ENUM["PROFI_SERVICE_AREA"] = "profi_service_area";
    ADDRESS_TYPE_ENUM["ORDER_DELIVERY"] = "order_delivery";
    ADDRESS_TYPE_ENUM["TRAINING_VENUE"] = "training_venue";
    ADDRESS_TYPE_ENUM["INSTRUCTOR_LOCATION"] = "instructor_location";
    ADDRESS_TYPE_ENUM["BILLING_ADDRESS"] = "billing_address";
    ADDRESS_TYPE_ENUM["BANK_BRANCH"] = "bank_branch";
    ADDRESS_TYPE_ENUM["MANUFACTURER_LOCATION"] = "manufacturer_location";
    ADDRESS_TYPE_ENUM["SUPPLIER_LOCATION"] = "supplier_location";
    ADDRESS_TYPE_ENUM["WAREHOUSE_LOCATION"] = "warehouse_location";
    ADDRESS_TYPE_ENUM["STORAGE_LOCATION"] = "storage_location";
    ADDRESS_TYPE_ENUM["CREATED_CLIENT"] = "created_client";
})(ADDRESS_TYPE_ENUM || (exports.ADDRESS_TYPE_ENUM = ADDRESS_TYPE_ENUM = {}));
var FILE_ENTITY_TYPE_ENUM;
(function (FILE_ENTITY_TYPE_ENUM) {
    FILE_ENTITY_TYPE_ENUM["USER_AVATAR"] = "user_avatar";
    FILE_ENTITY_TYPE_ENUM["ORGANIZATION_LOGO"] = "organization_logo";
    FILE_ENTITY_TYPE_ENUM["BUSINESS_LOGO"] = "business_logo";
    FILE_ENTITY_TYPE_ENUM["PLATFORM_USER_AVATAR"] = "platform_user_avatar";
    FILE_ENTITY_TYPE_ENUM["ADDRESS_PROOF"] = "address_proof";
    FILE_ENTITY_TYPE_ENUM["IDENTITY_PROOF"] = "identity_proof";
    FILE_ENTITY_TYPE_ENUM["EMPLOYMENT_CONTRACT"] = "employment_contract";
    FILE_ENTITY_TYPE_ENUM["TAX_DOCUMENT"] = "tax_document";
    FILE_ENTITY_TYPE_ENUM["BANK_DETAILS"] = "bank_details";
    FILE_ENTITY_TYPE_ENUM["RESUME"] = "resume";
})(FILE_ENTITY_TYPE_ENUM || (exports.FILE_ENTITY_TYPE_ENUM = FILE_ENTITY_TYPE_ENUM = {}));
/**
 * User roles in the system
 */
var UserRole;
(function (UserRole) {
    UserRole["PLATFORM_USER"] = "PLATFORM_USER";
    UserRole["BUSINESS_USER"] = "BUSINESS_USER";
    UserRole["PLATFORM"] = "PLATFORM";
    UserRole["CLIENT"] = "CLIENT";
    UserRole["BRANCH"] = "BRANCH";
    UserRole["STAFF"] = "STAFF";
    UserRole["ESTATE_TENANT"] = "ESTATE_TENANT";
    UserRole["AGENCY"] = "AGENCY";
})(UserRole || (exports.UserRole = UserRole = {}));
//  * Base organization roles
//  */
var OrganizationRole;
(function (OrganizationRole) {
    OrganizationRole["CREATOR"] = "CREATOR";
    OrganizationRole["ADMIN"] = "ADMIN";
    OrganizationRole["MEMBER"] = "MEMBER";
})(OrganizationRole || (exports.OrganizationRole = OrganizationRole = {}));
/**
 * Address types in the system
 */
var AddressType;
(function (AddressType) {
    AddressType["USER_HOME"] = "user_home";
    AddressType["USER_WORK"] = "user_work";
    AddressType["BUSINESS_PRIMARY"] = "business_primary";
    AddressType["BUSINESS_BRANCH"] = "business_branch";
    AddressType["CALENDAR_EVENT"] = "calendar_event";
    AddressType["SERVICE_AREA"] = "service_area";
    AddressType["ORDER_DELIVERY"] = "order_delivery";
    AddressType["TRAINING_VENUE"] = "training_venue";
    AddressType["INSTRUCTOR_LOCATION"] = "instructor_location";
    AddressType["BILLING_ADDRESS"] = "billing_address";
    AddressType["BANK_BRANCH"] = "bank_branch";
    AddressType["MANUFACTURER_LOCATION"] = "manufacturer_location";
    AddressType["SUPPLIER_LOCATION"] = "supplier_location";
    AddressType["WAREHOUSE_LOCATION"] = "warehouse_location";
    AddressType["STORAGE_LOCATION"] = "storage_location";
})(AddressType || (exports.AddressType = AddressType = {}));
/**
 * File entity types
 */
var FileEntityType;
(function (FileEntityType) {
    FileEntityType["USER_AVATAR"] = "user_avatar";
    FileEntityType["ORGANIZATION_LOGO"] = "organization_logo";
    FileEntityType["BUSINESS_LOGO"] = "business_logo";
    FileEntityType["PRODUCT_IMAGE"] = "product_image";
    FileEntityType["DOCUMENT"] = "document";
})(FileEntityType || (exports.FileEntityType = FileEntityType = {}));
/**
 * Email types
 */
var EmailType;
(function (EmailType) {
    EmailType["WELCOME"] = "welcome";
    EmailType["VERIFICATION"] = "verification";
    EmailType["PASSWORD_RESET"] = "password_reset";
    EmailType["OTP"] = "otp";
    EmailType["NOTIFICATION"] = "notification";
})(EmailType || (exports.EmailType = EmailType = {}));
/**
 * Notification types
 */
var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "email";
    NotificationType["SMS"] = "sms";
    NotificationType["PUSH"] = "push";
    NotificationType["IN_APP"] = "in_app";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
/**
 * OTP types
 */
var OtpType;
(function (OtpType) {
    OtpType["SIGNIN"] = "signin";
    OtpType["REGISTRATION"] = "registration";
    OtpType["PASSWORD_RESET"] = "password_reset";
    OtpType["EMAIL_VERIFICATION"] = "email_verification";
})(OtpType || (exports.OtpType = OtpType = {}));
/**
 * User status
 */
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["PENDING"] = "pending";
    UserStatus["BLOCKED"] = "blocked";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
/**
 * Business user permissions
 */
var BusinessUserPermission;
(function (BusinessUserPermission) {
    BusinessUserPermission["VIEW_DASHBOARD"] = "BUSINESS_USER_VIEW_DASHBOARD";
    BusinessUserPermission["MANAGE_ORGANIZATION"] = "BUSINESS_USER_MANAGE_ORGANIZATION";
    BusinessUserPermission["VIEW_COMPANIES"] = "BUSINESS_USER_VIEW_COMPANIES";
    BusinessUserPermission["MANAGE_COMPANIES"] = "BUSINESS_USER_MANAGE_COMPANIES";
    BusinessUserPermission["VIEW_BRANCHES"] = "BUSINESS_USER_VIEW_BRANCHES";
    BusinessUserPermission["MANAGE_BRANCHES"] = "BUSINESS_USER_MANAGE_BRANCHES";
    BusinessUserPermission["RESTRICT_BRANCH_ACCESS"] = "BUSINESS_USER_RESTRICT_BRANCH_ACCESS";
    BusinessUserPermission["VIEW_STAFF"] = "BUSINESS_USER_VIEW_STAFF";
    BusinessUserPermission["MANAGE_STAFF"] = "BUSINESS_USER_MANAGE_STAFF";
    BusinessUserPermission["VIEW_FINANCES"] = "BUSINESS_USER_VIEW_FINANCES";
    BusinessUserPermission["MANAGE_FINANCES"] = "BUSINESS_USER_MANAGE_FINANCES";
})(BusinessUserPermission || (exports.BusinessUserPermission = BusinessUserPermission = {}));
/**
 * Staff permissions
 */
var StaffPermission;
(function (StaffPermission) {
    StaffPermission["VIEW_DASHBOARD"] = "STAFF_VIEW_DASHBOARD";
    StaffPermission["MANAGE_PROFILE"] = "STAFF_MANAGE_PROFILE";
    StaffPermission["VIEW_PROFILE"] = "STAFF_VIEW_PROFILE";
    StaffPermission["MANAGE_SCHEDULE"] = "STAFF_MANAGE_SCHEDULE";
    StaffPermission["VIEW_SCHEDULE"] = "STAFF_VIEW_SCHEDULE";
    StaffPermission["MANAGE_TIME"] = "STAFF_MANAGE_TIME";
    StaffPermission["ACCESS_BRANCH"] = "STAFF_ACCESS_BRANCH";
    StaffPermission["MANAGE_BRANCH"] = "STAFF_MANAGE_BRANCH";
})(StaffPermission || (exports.StaffPermission = StaffPermission = {}));
/**
 * Permission restrictions
 */
var PermissionRestriction;
(function (PermissionRestriction) {
    PermissionRestriction["RESTRICT_BRANCH_ACCESS"] = "RESTRICT_BRANCH_ACCESS";
    PermissionRestriction["RESTRICT_PAGE_ACCESS"] = "RESTRICT_PAGE_ACCESS";
    PermissionRestriction["RESTRICT_GLOBAL_PERMISSIONS"] = "RESTRICT_GLOBAL_PERMISSIONS";
    PermissionRestriction["RESTRICT_PAYROLL_ACCESS"] = "RESTRICT_PAYROLL_ACCESS";
    PermissionRestriction["RESTRICT_PAYROLL_APPROVAL"] = "RESTRICT_PAYROLL_APPROVAL";
    PermissionRestriction["RESTRICT_PAYROLL_MANAGEMENT"] = "RESTRICT_PAYROLL_MANAGEMENT";
    PermissionRestriction["RESTRICT_FUND_MANAGEMENT"] = "RESTRICT_FUND_MANAGEMENT";
    PermissionRestriction["RESTRICT_FUND_APPROVAL"] = "RESTRICT_FUND_APPROVAL";
})(PermissionRestriction || (exports.PermissionRestriction = PermissionRestriction = {}));
//# sourceMappingURL=enums.js.map
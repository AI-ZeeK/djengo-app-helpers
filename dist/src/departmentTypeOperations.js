"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentTypeHelper = exports.ALWAYS_ALLOWED_DEPARTMENT_TYPES = exports.DEPARTMENT_TYPE_REQUIRED_OPERATIONS = void 0;
exports.normalizeOperationKeys = normalizeOperationKeys;
exports.isDepartmentTypeAllowed = isDepartmentTypeAllowed;
exports.departmentTypeRequiresFacilitySetup = departmentTypeRequiresFacilitySetup;
exports.filterAllowedDepartmentTypeOptions = filterAllowedDepartmentTypeOptions;
exports.filterAllowedDepartmentTypes = filterAllowedDepartmentTypes;
const enums_1 = require("./enums");
/**
 * Facility site-operation keys that must be declared before a department
 * category can be created (see Facility → branch operations).
 */
exports.DEPARTMENT_TYPE_REQUIRED_OPERATIONS = {
    [enums_1.DEPARTMENT_TYPE_ENUM.KITCHEN]: ["kitchen", "restaurant", "f_and_b"],
    [enums_1.DEPARTMENT_TYPE_ENUM.RECEPTION]: ["hotel", "clinical"],
};
/** Back-office / generic categories — always available. */
exports.ALWAYS_ALLOWED_DEPARTMENT_TYPES = [
    enums_1.DEPARTMENT_TYPE_ENUM.HR,
    enums_1.DEPARTMENT_TYPE_ENUM.LEGAL,
    enums_1.DEPARTMENT_TYPE_ENUM.OPERATIONS,
    enums_1.DEPARTMENT_TYPE_ENUM.CUSTOM,
];
function normalizeOperationKeys(operations) {
    return new Set(operations.map((o) => o.key.trim().toLowerCase()).filter(Boolean));
}
function isDepartmentTypeAllowed(type, operationKeys) {
    if (exports.ALWAYS_ALLOWED_DEPARTMENT_TYPES.includes(type)) {
        return true;
    }
    const required = exports.DEPARTMENT_TYPE_REQUIRED_OPERATIONS[type];
    if (!required?.length)
        return true;
    return required.some((k) => operationKeys.has(k));
}
function departmentTypeRequiresFacilitySetup(type) {
    return Boolean(exports.DEPARTMENT_TYPE_REQUIRED_OPERATIONS[type]?.length);
}
function filterAllowedDepartmentTypeOptions(options, operationKeys) {
    return options.filter((o) => isDepartmentTypeAllowed(o.value, operationKeys));
}
function filterAllowedDepartmentTypes(types, operationKeys) {
    return types.filter((t) => isDepartmentTypeAllowed(t.type, operationKeys));
}
class DepartmentTypeHelper {
}
exports.DepartmentTypeHelper = DepartmentTypeHelper;
DepartmentTypeHelper.DEPARTMENT_TYPE_REQUIRED_OPERATIONS = exports.DEPARTMENT_TYPE_REQUIRED_OPERATIONS;
DepartmentTypeHelper.ALWAYS_ALLOWED_DEPARTMENT_TYPES = exports.ALWAYS_ALLOWED_DEPARTMENT_TYPES;
DepartmentTypeHelper.normalizeOperationKeys = normalizeOperationKeys;
DepartmentTypeHelper.isDepartmentTypeAllowed = isDepartmentTypeAllowed;
DepartmentTypeHelper.departmentTypeRequiresFacilitySetup = departmentTypeRequiresFacilitySetup;
DepartmentTypeHelper.filterAllowedDepartmentTypeOptions = filterAllowedDepartmentTypeOptions;
DepartmentTypeHelper.filterAllowedDepartmentTypes = filterAllowedDepartmentTypes;
//# sourceMappingURL=departmentTypeOperations.js.map
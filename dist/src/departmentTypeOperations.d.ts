import { DEPARTMENT_TYPE_ENUM } from "./enums";
/**
 * Facility site-operation keys that must be declared before a department
 * category can be created (see Facility → branch operations).
 */
export declare const DEPARTMENT_TYPE_REQUIRED_OPERATIONS: Partial<Record<DEPARTMENT_TYPE_ENUM, readonly string[]>>;
/** Back-office / generic categories — always available. */
export declare const ALWAYS_ALLOWED_DEPARTMENT_TYPES: readonly DEPARTMENT_TYPE_ENUM[];
export declare function normalizeOperationKeys(operations: {
    key: string;
}[]): Set<string>;
export declare function isDepartmentTypeAllowed(type: string, operationKeys: Set<string>): boolean;
export declare function departmentTypeRequiresFacilitySetup(type: string): boolean;
export declare function filterAllowedDepartmentTypeOptions<T extends {
    value: string;
}>(options: T[], operationKeys: Set<string>): T[];
export declare function filterAllowedDepartmentTypes<T extends {
    type: DEPARTMENT_TYPE_ENUM | string;
}>(types: T[], operationKeys: Set<string>): T[];
export declare class DepartmentTypeHelper {
    static readonly DEPARTMENT_TYPE_REQUIRED_OPERATIONS: Partial<Record<DEPARTMENT_TYPE_ENUM, readonly string[]>>;
    static readonly ALWAYS_ALLOWED_DEPARTMENT_TYPES: readonly DEPARTMENT_TYPE_ENUM[];
    static normalizeOperationKeys: typeof normalizeOperationKeys;
    static isDepartmentTypeAllowed: typeof isDepartmentTypeAllowed;
    static departmentTypeRequiresFacilitySetup: typeof departmentTypeRequiresFacilitySetup;
    static filterAllowedDepartmentTypeOptions: typeof filterAllowedDepartmentTypeOptions;
    static filterAllowedDepartmentTypes: typeof filterAllowedDepartmentTypes;
}
//# sourceMappingURL=departmentTypeOperations.d.ts.map
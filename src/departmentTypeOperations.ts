import { DEPARTMENT_TYPE_ENUM } from "./enums";

/**
 * Facility site-operation keys that must be declared before a department
 * category can be created (see Facility → branch operations).
 */
export const DEPARTMENT_TYPE_REQUIRED_OPERATIONS: Partial<
  Record<DEPARTMENT_TYPE_ENUM, readonly string[]>
> = {
  [DEPARTMENT_TYPE_ENUM.KITCHEN]: ["kitchen", "restaurant", "f_and_b"],
  [DEPARTMENT_TYPE_ENUM.RECEPTION]: ["hotel", "clinical"],
};

/** Back-office / generic categories — always available. */
export const ALWAYS_ALLOWED_DEPARTMENT_TYPES: readonly DEPARTMENT_TYPE_ENUM[] = [
  DEPARTMENT_TYPE_ENUM.HR,
  DEPARTMENT_TYPE_ENUM.LEGAL,
  DEPARTMENT_TYPE_ENUM.OPERATIONS,
  DEPARTMENT_TYPE_ENUM.CUSTOM,
];

export function normalizeOperationKeys(
  operations: { key: string }[],
): Set<string> {
  return new Set(
    operations.map((o) => o.key.trim().toLowerCase()).filter(Boolean),
  );
}

export function isDepartmentTypeAllowed(
  type: string,
  operationKeys: Set<string>,
): boolean {
  if (
    ALWAYS_ALLOWED_DEPARTMENT_TYPES.includes(type as DEPARTMENT_TYPE_ENUM)
  ) {
    return true;
  }
  const required = DEPARTMENT_TYPE_REQUIRED_OPERATIONS[type as DEPARTMENT_TYPE_ENUM];
  if (!required?.length) return true;
  return required.some((k) => operationKeys.has(k));
}

export function departmentTypeRequiresFacilitySetup(type: string): boolean {
  return Boolean(
    DEPARTMENT_TYPE_REQUIRED_OPERATIONS[type as DEPARTMENT_TYPE_ENUM]?.length,
  );
}

export function filterAllowedDepartmentTypeOptions<
  T extends { value: string },
>(options: T[], operationKeys: Set<string>): T[] {
  return options.filter((o) => isDepartmentTypeAllowed(o.value, operationKeys));
}

export function filterAllowedDepartmentTypes<
  T extends { type: DEPARTMENT_TYPE_ENUM | string },
>(types: T[], operationKeys: Set<string>): T[] {
  return types.filter((t) =>
    isDepartmentTypeAllowed(t.type as DEPARTMENT_TYPE_ENUM, operationKeys),
  );
}

export class DepartmentTypeHelper {
  static readonly DEPARTMENT_TYPE_REQUIRED_OPERATIONS =
    DEPARTMENT_TYPE_REQUIRED_OPERATIONS;
  static readonly ALWAYS_ALLOWED_DEPARTMENT_TYPES =
    ALWAYS_ALLOWED_DEPARTMENT_TYPES;
  static normalizeOperationKeys = normalizeOperationKeys;
  static isDepartmentTypeAllowed = isDepartmentTypeAllowed;
  static departmentTypeRequiresFacilitySetup =
    departmentTypeRequiresFacilitySetup;
  static filterAllowedDepartmentTypeOptions =
    filterAllowedDepartmentTypeOptions;
  static filterAllowedDepartmentTypes = filterAllowedDepartmentTypes;
}


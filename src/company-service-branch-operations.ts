/**
 * Maps facility branch operation kinds to priced company-service business
 * type catalog names. Dining (restaurant/bar/lounge) and lodging are facility
 * operations, not priced company services.
 */
export const OPERATION_KIND_TO_BUSINESS_TYPE_NAME: Readonly<
  Record<string, string>
> = {
  spa: "SPA",
  pool: "SPA",
  gym: "GYM",
};

/** Types that appear in Company Services (price plans). */
export const PRICED_COMPANY_SERVICE_TYPE_NAMES = new Set(["SPA", "GYM"]);

/** Facility operations — not priced company services. */
export const FACILITY_OPERATION_TYPE_NAMES = new Set([
  "RESTAURANT",
  "HOTEL",
  "LOUNGE",
]);

export function normalizeBranchOperationKinds(
  operations: { operation_kind?: string | null }[],
): Set<string> {
  return new Set(
    operations
      .map((o) => o.operation_kind?.trim().toLowerCase())
      .filter((k): k is string => Boolean(k)),
  );
}

export function businessTypeNamesFromOperationKeys(
  operationKeys: Set<string>,
): Set<string> {
  const names = new Set<string>();
  operationKeys.forEach((kind) => {
    const name = OPERATION_KIND_TO_BUSINESS_TYPE_NAME[kind];
    if (name) names.add(name);
  });
  return names;
}

export function intersectSets<T>(sets: Set<T>[]): Set<T> {
  if (!sets.length) return new Set();
  const [first, ...rest] = sets;
  const out = new Set<T>();
  first.forEach((item) => {
    if (rest.every((s) => s.has(item))) out.add(item);
  });
  return out;
}

export function filterBusinessTypesByBranchOperations<
  T extends { name?: string | null },
>(types: T[], allowedBusinessTypeNames: Set<string>): T[] {
  if (!allowedBusinessTypeNames.size) return [];
  return types.filter((t) =>
    allowedBusinessTypeNames.has(t.name?.trim().toUpperCase() ?? ""),
  );
}

export class CompanyServiceBranchOperationsHelper {
  static readonly OPERATION_KIND_TO_BUSINESS_TYPE_NAME =
    OPERATION_KIND_TO_BUSINESS_TYPE_NAME;
  static readonly PRICED_COMPANY_SERVICE_TYPE_NAMES =
    PRICED_COMPANY_SERVICE_TYPE_NAMES;
  static readonly FACILITY_OPERATION_TYPE_NAMES = FACILITY_OPERATION_TYPE_NAMES;
  static normalizeBranchOperationKinds = normalizeBranchOperationKinds;
  static businessTypeNamesFromOperationKeys =
    businessTypeNamesFromOperationKeys;
  static intersectSets = intersectSets;
  static filterBusinessTypesByBranchOperations =
    filterBusinessTypesByBranchOperations;
}

/**
 * Maps facility branch operation kinds to priced company-service business
 * type catalog names. Dining (restaurant/bar) and lodging are facility
 * operations, not priced company services.
 */
export declare const OPERATION_KIND_TO_BUSINESS_TYPE_NAME: Readonly<Record<string, string>>;
/** Types that appear in Company Services (price plans). */
export declare const PRICED_COMPANY_SERVICE_TYPE_NAMES: Set<string>;
/** Facility operations — not priced company services. */
export declare const FACILITY_OPERATION_TYPE_NAMES: Set<string>;
export declare function normalizeBranchOperationKinds(operations: {
    operation_kind?: string | null;
}[]): Set<string>;
export declare function businessTypeNamesFromOperationKeys(operationKeys: Set<string>): Set<string>;
export declare function intersectSets<T>(sets: Set<T>[]): Set<T>;
export declare function filterBusinessTypesByBranchOperations<T extends {
    name?: string | null;
}>(types: T[], allowedBusinessTypeNames: Set<string>): T[];
export declare class CompanyServiceBranchOperationsHelper {
    static readonly OPERATION_KIND_TO_BUSINESS_TYPE_NAME: Readonly<Record<string, string>>;
    static readonly PRICED_COMPANY_SERVICE_TYPE_NAMES: Set<string>;
    static readonly FACILITY_OPERATION_TYPE_NAMES: Set<string>;
    static normalizeBranchOperationKinds: typeof normalizeBranchOperationKinds;
    static businessTypeNamesFromOperationKeys: typeof businessTypeNamesFromOperationKeys;
    static intersectSets: typeof intersectSets;
    static filterBusinessTypesByBranchOperations: typeof filterBusinessTypesByBranchOperations;
}
//# sourceMappingURL=company-service-branch-operations.d.ts.map
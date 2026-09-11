"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyServiceBranchOperationsHelper = exports.FACILITY_OPERATION_TYPE_NAMES = exports.PRICED_COMPANY_SERVICE_TYPE_NAMES = exports.OPERATION_KIND_TO_BUSINESS_TYPE_NAME = void 0;
exports.normalizeBranchOperationKinds = normalizeBranchOperationKinds;
exports.businessTypeNamesFromOperationKeys = businessTypeNamesFromOperationKeys;
exports.intersectSets = intersectSets;
exports.filterBusinessTypesByBranchOperations = filterBusinessTypesByBranchOperations;
/**
 * Maps facility branch operation kinds to priced company-service business
 * type catalog names. Dining (restaurant/bar) and lodging are facility
 * operations, not priced company services.
 */
exports.OPERATION_KIND_TO_BUSINESS_TYPE_NAME = {
    spa: "SPA",
    pool: "SPA",
    gym: "GYM",
};
/** Types that appear in Company Services (price plans). */
exports.PRICED_COMPANY_SERVICE_TYPE_NAMES = new Set(["SPA", "GYM"]);
/** Facility operations — not priced company services. */
exports.FACILITY_OPERATION_TYPE_NAMES = new Set(["RESTAURANT", "HOTEL"]);
function normalizeBranchOperationKinds(operations) {
    return new Set(operations
        .map((o) => o.operation_kind?.trim().toLowerCase())
        .filter((k) => Boolean(k)));
}
function businessTypeNamesFromOperationKeys(operationKeys) {
    const names = new Set();
    operationKeys.forEach((kind) => {
        const name = exports.OPERATION_KIND_TO_BUSINESS_TYPE_NAME[kind];
        if (name)
            names.add(name);
    });
    return names;
}
function intersectSets(sets) {
    if (!sets.length)
        return new Set();
    const [first, ...rest] = sets;
    const out = new Set();
    first.forEach((item) => {
        if (rest.every((s) => s.has(item)))
            out.add(item);
    });
    return out;
}
function filterBusinessTypesByBranchOperations(types, allowedBusinessTypeNames) {
    if (!allowedBusinessTypeNames.size)
        return [];
    return types.filter((t) => allowedBusinessTypeNames.has(t.name?.trim().toUpperCase() ?? ""));
}
class CompanyServiceBranchOperationsHelper {
}
exports.CompanyServiceBranchOperationsHelper = CompanyServiceBranchOperationsHelper;
CompanyServiceBranchOperationsHelper.OPERATION_KIND_TO_BUSINESS_TYPE_NAME = exports.OPERATION_KIND_TO_BUSINESS_TYPE_NAME;
CompanyServiceBranchOperationsHelper.PRICED_COMPANY_SERVICE_TYPE_NAMES = exports.PRICED_COMPANY_SERVICE_TYPE_NAMES;
CompanyServiceBranchOperationsHelper.FACILITY_OPERATION_TYPE_NAMES = exports.FACILITY_OPERATION_TYPE_NAMES;
CompanyServiceBranchOperationsHelper.normalizeBranchOperationKinds = normalizeBranchOperationKinds;
CompanyServiceBranchOperationsHelper.businessTypeNamesFromOperationKeys = businessTypeNamesFromOperationKeys;
CompanyServiceBranchOperationsHelper.intersectSets = intersectSets;
CompanyServiceBranchOperationsHelper.filterBusinessTypesByBranchOperations = filterBusinessTypesByBranchOperations;
//# sourceMappingURL=company-service-branch-operations.js.map
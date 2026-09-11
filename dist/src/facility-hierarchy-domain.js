"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityHierarchyDomainHelper = void 0;
exports.normalizeHierarchyDomain = normalizeHierarchyDomain;
exports.hierarchyDomainLabel = hierarchyDomainLabel;
exports.nodeHierarchyDomain = nodeHierarchyDomain;
exports.levelHierarchyDomain = levelHierarchyDomain;
exports.domainsFromLevels = domainsFromLevels;
exports.filterNodesByHierarchyDomain = filterNodesByHierarchyDomain;
function normalizeHierarchyDomain(raw) {
    return String(raw ?? "")
        .trim()
        .toUpperCase() === "DINING"
        ? "DINING"
        : "PRIMARY";
}
function hierarchyDomainLabel(domain) {
    return domain === "DINING" ? "Dining / reception" : "Stay / rentals";
}
function nodeHierarchyDomain(node) {
    return normalizeHierarchyDomain(node?.node_level?.hierarchy_domain);
}
function levelHierarchyDomain(level) {
    return normalizeHierarchyDomain(level?.hierarchy_domain);
}
/** Domains that have at least one active level configured. */
function domainsFromLevels(levels) {
    const set = new Set();
    for (const level of levels) {
        if (!level.is_active || level.deleted_at)
            continue;
        set.add(levelHierarchyDomain(level));
    }
    return set;
}
function filterNodesByHierarchyDomain(nodes, domain) {
    return nodes.filter((n) => nodeHierarchyDomain(n) === domain);
}
class FacilityHierarchyDomainHelper {
}
exports.FacilityHierarchyDomainHelper = FacilityHierarchyDomainHelper;
FacilityHierarchyDomainHelper.normalizeHierarchyDomain = normalizeHierarchyDomain;
FacilityHierarchyDomainHelper.hierarchyDomainLabel = hierarchyDomainLabel;
FacilityHierarchyDomainHelper.nodeHierarchyDomain = nodeHierarchyDomain;
FacilityHierarchyDomainHelper.levelHierarchyDomain = levelHierarchyDomain;
FacilityHierarchyDomainHelper.domainsFromLevels = domainsFromLevels;
FacilityHierarchyDomainHelper.filterNodesByHierarchyDomain = filterNodesByHierarchyDomain;
//# sourceMappingURL=facility-hierarchy-domain.js.map
import type { FacilityNodeLevelLike, FacilityNodeLike } from "./facility-types";
export type HierarchyDomainPick = "PRIMARY" | "DINING";
export declare function normalizeHierarchyDomain(raw?: string | null): HierarchyDomainPick;
export declare function hierarchyDomainLabel(domain: HierarchyDomainPick): string;
export declare function nodeHierarchyDomain(node: FacilityNodeLike | null | undefined): HierarchyDomainPick;
export declare function levelHierarchyDomain(level: FacilityNodeLevelLike | null | undefined): HierarchyDomainPick;
/** Domains that have at least one active level configured. */
export declare function domainsFromLevels(levels: FacilityNodeLevelLike[]): Set<HierarchyDomainPick>;
export declare function filterNodesByHierarchyDomain<T extends FacilityNodeLike>(nodes: T[], domain: HierarchyDomainPick): T[];
export declare class FacilityHierarchyDomainHelper {
    static normalizeHierarchyDomain: typeof normalizeHierarchyDomain;
    static hierarchyDomainLabel: typeof hierarchyDomainLabel;
    static nodeHierarchyDomain: typeof nodeHierarchyDomain;
    static levelHierarchyDomain: typeof levelHierarchyDomain;
    static domainsFromLevels: typeof domainsFromLevels;
    static filterNodesByHierarchyDomain: typeof filterNodesByHierarchyDomain;
}
//# sourceMappingURL=facility-hierarchy-domain.d.ts.map
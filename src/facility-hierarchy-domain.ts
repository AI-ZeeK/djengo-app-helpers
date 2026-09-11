import type { FacilityNodeLevelLike, FacilityNodeLike } from "./facility-types";

export type HierarchyDomainPick = "PRIMARY" | "DINING";

export function normalizeHierarchyDomain(
  raw?: string | null,
): HierarchyDomainPick {
  return String(raw ?? "")
    .trim()
    .toUpperCase() === "DINING"
    ? "DINING"
    : "PRIMARY";
}

export function hierarchyDomainLabel(domain: HierarchyDomainPick): string {
  return domain === "DINING" ? "Dining / reception" : "Stay / rentals";
}

export function nodeHierarchyDomain(
  node: FacilityNodeLike | null | undefined,
): HierarchyDomainPick {
  return normalizeHierarchyDomain(node?.node_level?.hierarchy_domain);
}

export function levelHierarchyDomain(
  level: FacilityNodeLevelLike | null | undefined,
): HierarchyDomainPick {
  return normalizeHierarchyDomain(level?.hierarchy_domain);
}

/** Domains that have at least one active level configured. */
export function domainsFromLevels(
  levels: FacilityNodeLevelLike[],
): Set<HierarchyDomainPick> {
  const set = new Set<HierarchyDomainPick>();
  for (const level of levels) {
    if (!level.is_active || level.deleted_at) continue;
    set.add(levelHierarchyDomain(level));
  }
  return set;
}

export function filterNodesByHierarchyDomain<T extends FacilityNodeLike>(
  nodes: T[],
  domain: HierarchyDomainPick,
): T[] {
  return nodes.filter((n) => nodeHierarchyDomain(n) === domain);
}

export class FacilityHierarchyDomainHelper {
  static normalizeHierarchyDomain = normalizeHierarchyDomain;
  static hierarchyDomainLabel = hierarchyDomainLabel;
  static nodeHierarchyDomain = nodeHierarchyDomain;
  static levelHierarchyDomain = levelHierarchyDomain;
  static domainsFromLevels = domainsFromLevels;
  static filterNodesByHierarchyDomain = filterNodesByHierarchyDomain;
}


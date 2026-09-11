
export type RevenueStreamKindOption = {
  id: string;
  name: string;
};

/** Fallback catalog when kinds API is unavailable. */
export const REVENUE_STREAM_KIND_CATALOG: RevenueStreamKindOption[] = [
  { id: "ROOM", name: "Rooms" },
  { id: "FNB", name: "Food & beverage" },
  { id: "EVENTS", name: "Events" },
  { id: "SPA", name: "Spa" },
  { id: "PARKING", name: "Parking" },
  { id: "OTHER", name: "Other" },
];

export function labelForRevenueStreamKind(
  kind: string | undefined | null,
  options: RevenueStreamKindOption[] = REVENUE_STREAM_KIND_CATALOG,
): string {
  if (!kind) return "—";
  return options.find((k) => k.id === kind)?.name ?? kind;
}

export class RevenueStreamHelper {
  static readonly REVENUE_STREAM_KIND_CATALOG = REVENUE_STREAM_KIND_CATALOG;
  static labelForRevenueStreamKind = labelForRevenueStreamKind;
}


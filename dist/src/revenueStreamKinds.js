"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueStreamHelper = exports.REVENUE_STREAM_KIND_CATALOG = void 0;
exports.labelForRevenueStreamKind = labelForRevenueStreamKind;
/** Fallback catalog when kinds API is unavailable. */
exports.REVENUE_STREAM_KIND_CATALOG = [
    { id: "ROOM", name: "Rooms" },
    { id: "FNB", name: "Food & beverage" },
    { id: "EVENTS", name: "Events" },
    { id: "SPA", name: "Spa" },
    { id: "PARKING", name: "Parking" },
    { id: "OTHER", name: "Other" },
];
function labelForRevenueStreamKind(kind, options = exports.REVENUE_STREAM_KIND_CATALOG) {
    if (!kind)
        return "—";
    return options.find((k) => k.id === kind)?.name ?? kind;
}
class RevenueStreamHelper {
}
exports.RevenueStreamHelper = RevenueStreamHelper;
RevenueStreamHelper.REVENUE_STREAM_KIND_CATALOG = exports.REVENUE_STREAM_KIND_CATALOG;
RevenueStreamHelper.labelForRevenueStreamKind = labelForRevenueStreamKind;
//# sourceMappingURL=revenueStreamKinds.js.map
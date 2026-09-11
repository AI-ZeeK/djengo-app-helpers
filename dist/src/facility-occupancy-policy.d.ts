import { type FacilityMode } from "./facility-enums";
export type OccupancyFeatureKey = "admit_discharge" | "transfer_between_locations" | "guest_admittance" | "family_on_lease" | "entrance_exit_checks" | "reservation_slots";
export type FacilityOccupancyPolicy = {
    primary_occupant_kind: string;
    primary_occupant_label: string;
    primary_partner_type: string;
    features: Record<OccupancyFeatureKey, boolean>;
};
export type AssetOccupancyRules = {
    allows_companions: boolean;
    max_companions?: number;
    allows_registered_guests: boolean;
    requires_check_in: boolean;
};
/**
 * Branch occupancy defaults (mode + optional profile metadata_json overlay).
 * Shared by client / mobile / forms-ui — no UI or Redux.
 */
export declare class FacilityOccupancyPolicyHelper {
    static readonly FEATURE_KEYS: OccupancyFeatureKey[];
    static defaultsForMode(facilityMode: FacilityMode | string | null | undefined): FacilityOccupancyPolicy;
    /** Merge branch `metadata_json.occupancy_policy` onto mode defaults. Feature flags only turn on. */
    static resolve(facilityMode: FacilityMode | string | null | undefined, profileMetadataJson?: string | null): FacilityOccupancyPolicy;
    static featureLabels(policy: FacilityOccupancyPolicy): string[];
    static defaultAssetRules(facilityMode: FacilityMode | string | null | undefined): AssetOccupancyRules;
}
//# sourceMappingURL=facility-occupancy-policy.d.ts.map
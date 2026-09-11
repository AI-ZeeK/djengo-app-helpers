import { FACILITY_MODE_ENUM, type FacilityMode } from "./facility-enums";

export type OccupancyFeatureKey =
  | "admit_discharge"
  | "transfer_between_locations"
  | "guest_admittance"
  | "family_on_lease"
  | "entrance_exit_checks"
  | "reservation_slots";

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

const DEFAULTS: Record<FacilityMode, FacilityOccupancyPolicy> = {
  HOSPITAL: {
    primary_occupant_kind: "patient",
    primary_occupant_label: "Patient",
    primary_partner_type: "OTHER",
    features: {
      admit_discharge: true,
      transfer_between_locations: true,
      guest_admittance: true,
      family_on_lease: false,
      entrance_exit_checks: false,
      reservation_slots: false,
    },
  },
  ESTATE: {
    primary_occupant_kind: "tenant",
    primary_occupant_label: "Tenant",
    primary_partner_type: "TENANT",
    features: {
      admit_discharge: false,
      transfer_between_locations: true,
      guest_admittance: true,
      family_on_lease: true,
      entrance_exit_checks: true,
      reservation_slots: false,
    },
  },
  HOSPITALITY: {
    primary_occupant_kind: "guest",
    primary_occupant_label: "Guest",
    primary_partner_type: "OTHER",
    features: {
      admit_discharge: false,
      transfer_between_locations: false,
      guest_admittance: true,
      family_on_lease: false,
      entrance_exit_checks: true,
      reservation_slots: true,
    },
  },
  RESTAURANT: {
    primary_occupant_kind: "diner",
    primary_occupant_label: "Diner",
    primary_partner_type: "OTHER",
    features: {
      admit_discharge: false,
      transfer_between_locations: false,
      guest_admittance: false,
      family_on_lease: false,
      entrance_exit_checks: false,
      reservation_slots: true,
    },
  },
  GENERAL: {
    primary_occupant_kind: "occupant",
    primary_occupant_label: "Occupant",
    primary_partner_type: "OTHER",
    features: {
      admit_discharge: false,
      transfer_between_locations: false,
      guest_admittance: false,
      family_on_lease: false,
      entrance_exit_checks: false,
      reservation_slots: false,
    },
  },
};

function clonePolicy(policy: FacilityOccupancyPolicy): FacilityOccupancyPolicy {
  return {
    ...policy,
    features: { ...policy.features },
  };
}

function defaultsForMode(
  facilityMode: FacilityMode | string | null | undefined,
): FacilityOccupancyPolicy {
  const key = String(facilityMode ?? "").trim() as FacilityMode;
  return clonePolicy(DEFAULTS[key] ?? DEFAULTS.GENERAL);
}

/**
 * Branch occupancy defaults (mode + optional profile metadata_json overlay).
 * Shared by client / mobile / forms-ui — no UI or Redux.
 */
export class FacilityOccupancyPolicyHelper {
  static readonly FEATURE_KEYS: OccupancyFeatureKey[] = [
    "admit_discharge",
    "transfer_between_locations",
    "guest_admittance",
    "family_on_lease",
    "entrance_exit_checks",
    "reservation_slots",
  ];

  static defaultsForMode(
    facilityMode: FacilityMode | string | null | undefined,
  ): FacilityOccupancyPolicy {
    return defaultsForMode(facilityMode);
  }

  /** Merge branch `metadata_json.occupancy_policy` onto mode defaults. Feature flags only turn on. */
  static resolve(
    facilityMode: FacilityMode | string | null | undefined,
    profileMetadataJson?: string | null,
  ): FacilityOccupancyPolicy {
    const base = defaultsForMode(facilityMode);
    if (!profileMetadataJson?.trim()) return base;

    try {
      const parsed = JSON.parse(profileMetadataJson) as {
        occupancy_policy?: Partial<FacilityOccupancyPolicy> & {
          features?: Partial<Record<OccupancyFeatureKey, boolean>>;
        };
      };
      const patch = parsed?.occupancy_policy;
      if (!patch) return base;

      if (patch.primary_occupant_kind)
        base.primary_occupant_kind = patch.primary_occupant_kind;
      if (patch.primary_occupant_label)
        base.primary_occupant_label = patch.primary_occupant_label;
      if (patch.primary_partner_type)
        base.primary_partner_type = patch.primary_partner_type;
      if (patch.features) {
        for (const key of FacilityOccupancyPolicyHelper.FEATURE_KEYS) {
          if (patch.features[key] === true) base.features[key] = true;
        }
      }
    } catch {
      /* use defaults */
    }

    return base;
  }

  static featureLabels(policy: FacilityOccupancyPolicy): string[] {
    const labels: string[] = [];
    const f = policy.features;
    if (f.admit_discharge) labels.push("Admit & discharge");
    if (f.transfer_between_locations)
      labels.push("Move between wards / beds / rooms");
    if (f.guest_admittance) labels.push("Guest visits");
    if (f.family_on_lease) labels.push("Family on lease");
    if (f.entrance_exit_checks) labels.push("Entrance / exit checks");
    if (f.reservation_slots) labels.push("Reservations");
    return labels;
  }

  static defaultAssetRules(
    facilityMode: FacilityMode | string | null | undefined,
  ): AssetOccupancyRules {
    const mode = String(facilityMode ?? "").trim();
    if (mode === FACILITY_MODE_ENUM.HOSPITAL) {
      return {
        allows_companions: false,
        allows_registered_guests: true,
        requires_check_in: false,
      };
    }
    if (mode === FACILITY_MODE_ENUM.ESTATE) {
      return {
        allows_companions: true,
        max_companions: 4,
        allows_registered_guests: true,
        requires_check_in: true,
      };
    }
    if (mode === FACILITY_MODE_ENUM.HOSPITALITY) {
      return {
        allows_companions: true,
        max_companions: 2,
        allows_registered_guests: true,
        requires_check_in: true,
      };
    }
    if (mode === FACILITY_MODE_ENUM.RESTAURANT) {
      return {
        allows_companions: true,
        max_companions: 8,
        allows_registered_guests: false,
        requires_check_in: false,
      };
    }
    return {
      allows_companions: false,
      allows_registered_guests: false,
      requires_check_in: false,
    };
  }
}

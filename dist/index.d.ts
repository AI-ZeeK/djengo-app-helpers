export * from "./src/enums";
export interface ProtoEnums {
    ChatType: {
        DIRECT: number;
        GROUP: number;
        CHANNEL: number;
    };
    ChatStatus: {
        PENDING: number;
        ACTIVE: number;
        ARCHIVED: number;
        DELETED: number;
    };
    MessageType: {
        TEXT: number;
        IMAGE: number;
        VIDEO: number;
        AUDIO: number;
        FILE: number;
        VOICE_NOTE: number;
        SYSTEM: number;
    };
    MessageStatus: {
        PENDING: number;
        SENT: number;
        DELIVERED: number;
        READ: number;
        FAILED: number;
    };
    UserStatus: {
        ACTIVE: number;
        INACTIVE: number;
        SUSPENDED: number;
        DELETED: number;
    };
    UserPrivacy: {
        PUBLIC: number;
        FRIENDS: number;
        PRIVATE: number;
    };
    ConnectionType: {
        FRIEND: number;
        FOLLOWER: number;
        FOLLOWING: number;
        BLOCKED: number;
    };
}
export type CommunicationServiceClient = any;
export type ProfileServiceClient = any;
export declare const enums: ProtoEnums;
export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}` ? `${T}${Capitalize<SnakeToCamelCase<U>>}` : S;
export type KeysToCamelCase<T> = {
    [K in keyof T as SnakeToCamelCase<Extract<K, string>>]: T[K] extends object ? KeysToCamelCase<T[K]> : T[K];
};
export { AppHelper } from "./src/helpers";
export * from "./src/facility-enums";
export * from "./src/facility-helpers";
export * from "./src/facility-occupancy-policy";
export * from "./src/facility-types";
export * from "./src/facility-node-metadata";
export * from "./src/facility-listing-media";
export * from "./src/facility-asset-pricing";
export * from "./src/facility-spatial";
export * from "./src/facility-floor";
export * from "./src/facility-child-type-rules";
export * from "./src/facility-hierarchy-domain";
export * from "./src/facility-spatial-copy";
export * from "./src/facility-tree-utils";
export * from "./src/facilityBranchMetadata";
export * from "./src/facility-node-place";
export * from "./src/bulk-create-children";
export * from "./src/revenueStreamKinds";
export * from "./src/departmentTypeOperations";
export * from "./src/branchScopePermissions";
export * from "./src/company-service-branch-operations";
export * from "./src/admin-permissions";
export * from "./src/permissions";
//# sourceMappingURL=index.d.ts.map
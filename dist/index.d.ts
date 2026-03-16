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
export { Helpers } from "./src/helpers";
//# sourceMappingURL=index.d.ts.map
"use strict";
// 📦 DJENGO Proto Contracts - Shared gRPC definitions
// Main entry point for importing protobuf definitions
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helpers = exports.enums = void 0;
// Export all type definitions
// Export TypeScript enums for use across microservices
__exportStar(require("./src/enums"), exports);
// 🏷️ Export enums for easy access (legacy compatibility)
exports.enums = {
    ChatType: {
        DIRECT: 0,
        GROUP: 1,
        CHANNEL: 2,
    },
    ChatStatus: {
        PENDING: 0,
        ACTIVE: 1,
        ARCHIVED: 2,
        DELETED: 3,
    },
    MessageType: {
        TEXT: 0,
        IMAGE: 1,
        VIDEO: 2,
        AUDIO: 3,
        FILE: 4,
        VOICE_NOTE: 5,
        SYSTEM: 6,
    },
    MessageStatus: {
        PENDING: 0,
        SENT: 1,
        DELIVERED: 2,
        READ: 3,
        FAILED: 4,
    },
    UserStatus: {
        ACTIVE: 0,
        INACTIVE: 1,
        SUSPENDED: 2,
        DELETED: 3,
    },
    UserPrivacy: {
        PUBLIC: 0,
        FRIENDS: 1,
        PRIVATE: 2,
    },
    ConnectionType: {
        FRIEND: 0,
        FOLLOWER: 1,
        FOLLOWING: 2,
        BLOCKED: 3,
    },
};
var helpers_1 = require("./src/helpers");
Object.defineProperty(exports, "Helpers", { enumerable: true, get: function () { return helpers_1.Helpers; } });
//# sourceMappingURL=index.js.map
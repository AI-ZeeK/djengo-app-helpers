"use strict";
/**
 * Financial / ledger enums aligned with financials Constants.cs + DB models.
 * Prefer these over string literals in gateway, client, and forms-ui.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WALLET_FUNDING_STATUS_ENUM = exports.GUEST_PAYMENT_STATUS_ENUM = exports.WALLET_TRANSACTION_KIND_ENUM = exports.TRANSACTION_STATUS_ENUM = exports.TRANSACTION_TYPE_ENUM = void 0;
exports.normalizeFinancialStatus = normalizeFinancialStatus;
exports.isFinancialSuccessStatus = isFinancialSuccessStatus;
exports.isFinancialFailedStatus = isFinancialFailedStatus;
exports.isFinancialPendingStatus = isFinancialPendingStatus;
exports.isWalletDebitKind = isWalletDebitKind;
/** Matches Financials.Constants.TRANSACTION_TYPE_ENUM (ledger type names). */
var TRANSACTION_TYPE_ENUM;
(function (TRANSACTION_TYPE_ENUM) {
    TRANSACTION_TYPE_ENUM["SALARY_PAYMENT"] = "SALARY_PAYMENT";
    TRANSACTION_TYPE_ENUM["BONUS_PAYMENT"] = "BONUS_PAYMENT";
    TRANSACTION_TYPE_ENUM["FINE"] = "FINE";
    TRANSACTION_TYPE_ENUM["ALLOWANCE"] = "ALLOWANCE";
    TRANSACTION_TYPE_ENUM["TAX"] = "TAX";
    TRANSACTION_TYPE_ENUM["OVERTIME"] = "OVERTIME";
    TRANSACTION_TYPE_ENUM["ORDER_PAYMENT"] = "ORDER_PAYMENT";
    TRANSACTION_TYPE_ENUM["GUEST_INVOICE_PAYMENT"] = "GUEST_INVOICE_PAYMENT";
    TRANSACTION_TYPE_ENUM["WALLET_FUNDING"] = "WALLET_FUNDING";
})(TRANSACTION_TYPE_ENUM || (exports.TRANSACTION_TYPE_ENUM = TRANSACTION_TYPE_ENUM = {}));
/** Matches Financials.Database.Models.TRANSACTION_STATUS_ENUM. */
var TRANSACTION_STATUS_ENUM;
(function (TRANSACTION_STATUS_ENUM) {
    TRANSACTION_STATUS_ENUM["PENDING"] = "PENDING";
    TRANSACTION_STATUS_ENUM["FAILED"] = "FAILED";
    TRANSACTION_STATUS_ENUM["COMPLETED"] = "COMPLETED";
    TRANSACTION_STATUS_ENUM["REVERSED"] = "REVERSED";
})(TRANSACTION_STATUS_ENUM || (exports.TRANSACTION_STATUS_ENUM = TRANSACTION_STATUS_ENUM = {}));
/**
 * Matches Financials.Database.Models.WalletTransactionKind.
 * API may also return numeric "1"/"2" for legacy rows.
 */
var WALLET_TRANSACTION_KIND_ENUM;
(function (WALLET_TRANSACTION_KIND_ENUM) {
    WALLET_TRANSACTION_KIND_ENUM["CREDIT"] = "Credit";
    WALLET_TRANSACTION_KIND_ENUM["DEBIT"] = "Debit";
})(WALLET_TRANSACTION_KIND_ENUM || (exports.WALLET_TRANSACTION_KIND_ENUM = WALLET_TRANSACTION_KIND_ENUM = {}));
/** GuestPayment / checkout verify statuses (and common gateway aliases). */
var GUEST_PAYMENT_STATUS_ENUM;
(function (GUEST_PAYMENT_STATUS_ENUM) {
    GUEST_PAYMENT_STATUS_ENUM["PENDING"] = "PENDING";
    GUEST_PAYMENT_STATUS_ENUM["COMPLETED"] = "COMPLETED";
    GUEST_PAYMENT_STATUS_ENUM["FAILED"] = "FAILED";
    GUEST_PAYMENT_STATUS_ENUM["CANCELLED"] = "CANCELLED";
    GUEST_PAYMENT_STATUS_ENUM["EXPIRED"] = "EXPIRED";
})(GUEST_PAYMENT_STATUS_ENUM || (exports.GUEST_PAYMENT_STATUS_ENUM = GUEST_PAYMENT_STATUS_ENUM = {}));
/** Company wallet funding row statuses. */
var WALLET_FUNDING_STATUS_ENUM;
(function (WALLET_FUNDING_STATUS_ENUM) {
    WALLET_FUNDING_STATUS_ENUM["PENDING"] = "PENDING";
    WALLET_FUNDING_STATUS_ENUM["COMPLETED"] = "COMPLETED";
    WALLET_FUNDING_STATUS_ENUM["FAILED"] = "FAILED";
    WALLET_FUNDING_STATUS_ENUM["CANCELLED"] = "CANCELLED";
})(WALLET_FUNDING_STATUS_ENUM || (exports.WALLET_FUNDING_STATUS_ENUM = WALLET_FUNDING_STATUS_ENUM = {}));
function normalizeFinancialStatus(value) {
    return (value || "").trim().toUpperCase().replace(/\s+/g, "_");
}
/** Completed / successful ledger or payment outcomes (incl. SUCCESS/PAID aliases). */
function isFinancialSuccessStatus(value) {
    const s = normalizeFinancialStatus(value);
    return (s === TRANSACTION_STATUS_ENUM.COMPLETED ||
        s === "SUCCESS" ||
        s === "PAID");
}
/** Failed / cancelled / reversed / expired outcomes. */
function isFinancialFailedStatus(value) {
    const s = normalizeFinancialStatus(value);
    return (s === TRANSACTION_STATUS_ENUM.FAILED ||
        s === TRANSACTION_STATUS_ENUM.REVERSED ||
        s === GUEST_PAYMENT_STATUS_ENUM.CANCELLED ||
        s === "CANCELED" ||
        s === GUEST_PAYMENT_STATUS_ENUM.EXPIRED ||
        s === "REJECTED");
}
function isFinancialPendingStatus(value) {
    const s = normalizeFinancialStatus(value);
    return (s === TRANSACTION_STATUS_ENUM.PENDING ||
        (!!s && !isFinancialSuccessStatus(s) && !isFinancialFailedStatus(s)));
}
/** True when wallet_transaction_kind is a debit (label or legacy "2"). */
function isWalletDebitKind(kind) {
    const k = (kind || "").trim().toLowerCase();
    return (k === WALLET_TRANSACTION_KIND_ENUM.DEBIT.toLowerCase() || k === "2");
}
//# sourceMappingURL=financial-enums.js.map
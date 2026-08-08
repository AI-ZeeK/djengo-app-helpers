/**
 * Financial / ledger enums aligned with financials Constants.cs + DB models.
 * Prefer these over string literals in gateway, client, and forms-ui.
 */
/** Matches Financials.Constants.TRANSACTION_TYPE_ENUM (ledger type names). */
export declare enum TRANSACTION_TYPE_ENUM {
    SALARY_PAYMENT = "SALARY_PAYMENT",
    BONUS_PAYMENT = "BONUS_PAYMENT",
    FINE = "FINE",
    ALLOWANCE = "ALLOWANCE",
    TAX = "TAX",
    OVERTIME = "OVERTIME",
    ORDER_PAYMENT = "ORDER_PAYMENT",
    GUEST_INVOICE_PAYMENT = "GUEST_INVOICE_PAYMENT",
    WALLET_FUNDING = "WALLET_FUNDING"
}
/** Matches Financials.Database.Models.TRANSACTION_STATUS_ENUM. */
export declare enum TRANSACTION_STATUS_ENUM {
    PENDING = "PENDING",
    FAILED = "FAILED",
    COMPLETED = "COMPLETED",
    REVERSED = "REVERSED"
}
/**
 * Matches Financials.Database.Models.WalletTransactionKind.
 * API may also return numeric "1"/"2" for legacy rows.
 */
export declare enum WALLET_TRANSACTION_KIND_ENUM {
    CREDIT = "Credit",
    DEBIT = "Debit"
}
/** GuestPayment / checkout verify statuses (and common gateway aliases). */
export declare enum GUEST_PAYMENT_STATUS_ENUM {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED"
}
/** Company wallet funding row statuses. */
export declare enum WALLET_FUNDING_STATUS_ENUM {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export declare function normalizeFinancialStatus(value?: string | null): string;
/** Completed / successful ledger or payment outcomes (incl. SUCCESS/PAID aliases). */
export declare function isFinancialSuccessStatus(value?: string | null): boolean;
/** Failed / cancelled / reversed / expired outcomes. */
export declare function isFinancialFailedStatus(value?: string | null): boolean;
export declare function isFinancialPendingStatus(value?: string | null): boolean;
/** True when wallet_transaction_kind is a debit (label or legacy "2"). */
export declare function isWalletDebitKind(kind?: string | null): boolean;
//# sourceMappingURL=financial-enums.d.ts.map
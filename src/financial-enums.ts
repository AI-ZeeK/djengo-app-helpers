/**
 * Financial / ledger enums aligned with financials Constants.cs + DB models.
 * Prefer these over string literals in gateway, client, and forms-ui.
 */

/** Matches Financials.Constants.TRANSACTION_TYPE_ENUM (ledger type names). */
export enum TRANSACTION_TYPE_ENUM {
  SALARY_PAYMENT = "SALARY_PAYMENT",
  BONUS_PAYMENT = "BONUS_PAYMENT",
  FINE = "FINE",
  ALLOWANCE = "ALLOWANCE",
  TAX = "TAX",
  OVERTIME = "OVERTIME",
  ORDER_PAYMENT = "ORDER_PAYMENT",
  GUEST_INVOICE_PAYMENT = "GUEST_INVOICE_PAYMENT",
  WALLET_FUNDING = "WALLET_FUNDING",
}

/** Matches Financials.Database.Models.TRANSACTION_STATUS_ENUM. */
export enum TRANSACTION_STATUS_ENUM {
  PENDING = "PENDING",
  FAILED = "FAILED",
  COMPLETED = "COMPLETED",
  REVERSED = "REVERSED",
}

/**
 * Matches Financials.Database.Models.WalletTransactionKind.
 * API may also return numeric "1"/"2" for legacy rows.
 */
export enum WALLET_TRANSACTION_KIND_ENUM {
  CREDIT = "Credit",
  DEBIT = "Debit",
}

/** GuestPayment / checkout verify statuses (and common gateway aliases). */
export enum GUEST_PAYMENT_STATUS_ENUM {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

/** Company wallet funding row statuses. */
export enum WALLET_FUNDING_STATUS_ENUM {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export function normalizeFinancialStatus(value?: string | null): string {
  return (value || "").trim().toUpperCase().replace(/\s+/g, "_");
}

/** Completed / successful ledger or payment outcomes (incl. SUCCESS/PAID aliases). */
export function isFinancialSuccessStatus(value?: string | null): boolean {
  const s = normalizeFinancialStatus(value);
  return (
    s === TRANSACTION_STATUS_ENUM.COMPLETED ||
    s === "SUCCESS" ||
    s === "PAID"
  );
}

/** Failed / cancelled / reversed / expired outcomes. */
export function isFinancialFailedStatus(value?: string | null): boolean {
  const s = normalizeFinancialStatus(value);
  return (
    s === TRANSACTION_STATUS_ENUM.FAILED ||
    s === TRANSACTION_STATUS_ENUM.REVERSED ||
    s === GUEST_PAYMENT_STATUS_ENUM.CANCELLED ||
    s === "CANCELED" ||
    s === GUEST_PAYMENT_STATUS_ENUM.EXPIRED ||
    s === "REJECTED"
  );
}

export function isFinancialPendingStatus(value?: string | null): boolean {
  const s = normalizeFinancialStatus(value);
  return (
    s === TRANSACTION_STATUS_ENUM.PENDING ||
    (!!s && !isFinancialSuccessStatus(s) && !isFinancialFailedStatus(s))
  );
}

/** True when wallet_transaction_kind is a debit (label or legacy "2"). */
export function isWalletDebitKind(kind?: string | null): boolean {
  const k = (kind || "").trim().toLowerCase();
  return (
    k === WALLET_TRANSACTION_KIND_ENUM.DEBIT.toLowerCase() || k === "2"
  );
}

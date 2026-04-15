// src/features/reconciliation/types/reconciliation.types.ts

import type {
    CurrencyCode,
    IsoDateString,
    Nullable,
    TransactionType,
} from "../../../shared/types/common.types";
import type { ApiMessageResponse } from "../../../shared/types/api.types";
import type { TransactionStatus } from "../../transactions/types/transaction.types";

export type ReconciliationStatus = "unreconciled" | "reconciled" | "exception";
export type ReconciliationMatchMethod = "manual" | "imported" | "automatic";
export type ReconciliationEntrySide =
    | "account"
    | "destination_account"
    | "card";
export type ReconciliationDifferenceDirection = "match" | "over" | "under";

export interface ReconciliationRecord {
    id: string;
    workspaceId: string;
    accountId: string;
    accountName: Nullable<string>;
    cardId: Nullable<string>;
    cardName: Nullable<string>;
    memberId: string;
    memberDisplayName: Nullable<string>;
    transactionId: string;
    entrySide: ReconciliationEntrySide;

    transactionType: TransactionType;
    transactionStatus: TransactionStatus;
    transactionDescription: string;
    transactionDate: IsoDateString;
    transactionAmount: number;
    currency: CurrencyCode;

    expectedAmount: number;
    actualAmount: number;
    differenceAmount: number;
    differenceDirection: ReconciliationDifferenceDirection;

    statementDate: Nullable<IsoDateString>;
    statementReference: Nullable<string>;
    matchMethod: ReconciliationMatchMethod;
    status: ReconciliationStatus;
    notes: Nullable<string>;

    reconciledAt: Nullable<IsoDateString>;
    reconciledByUserId: Nullable<string>;

    isActive: boolean;
    isArchived: boolean;
    isVisible: boolean;

    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface ReconciliationSummaryByAccount {
    accountId: string;
    accountName: Nullable<string>;
    totalCount: number;
    reconciledCount: number;
    unreconciledCount: number;
    exceptionCount: number;
    expectedAmount: number;
    actualAmount: number;
    differenceAmount: number;
}

export interface ReconciliationSummary {
    totalCount: number;
    reconciledCount: number;
    unreconciledCount: number;
    exceptionCount: number;
    hiddenCount: number;
    archivedCount: number;
    inactiveCount: number;
    expectedAmount: number;
    actualAmount: number;
    differenceAmount: number;
    latestReconciledAt: Nullable<IsoDateString>;
    byAccount: ReconciliationSummaryByAccount[];
}

export interface ReconciliationListFilters {
    accountId: string;
    cardId: string;
    memberId: string;
    transactionId: string;
    status: ReconciliationStatus | "ALL";
    currency: CurrencyCode | "ALL";
    entrySide: ReconciliationEntrySide | "ALL";
    matchMethod: ReconciliationMatchMethod | "ALL";
    includeArchived: boolean;
    includeInactive: boolean;
    includeHidden: boolean;
    transactionDateFrom: string;
    transactionDateTo: string;
    reconciledFrom: string;
    reconciledTo: string;
    statementDateFrom: string;
    statementDateTo: string;
}

export interface CreateReconciliationPayload {
    accountId: string;
    cardId?: Nullable<string>;
    transactionId: string;
    expectedAmount?: number;
    actualAmount?: number;
    statementDate?: Nullable<string>;
    statementReference?: Nullable<string>;
    matchMethod?: ReconciliationMatchMethod;
    status?: ReconciliationStatus;
    notes?: Nullable<string>;
    reconciledAt?: Nullable<string>;
    isVisible?: boolean;
}

export interface UpdateReconciliationPayload {
    expectedAmount?: number;
    actualAmount?: number;
    statementDate?: Nullable<string>;
    statementReference?: Nullable<string>;
    matchMethod?: ReconciliationMatchMethod;
    status?: ReconciliationStatus;
    notes?: Nullable<string>;
    reconciledAt?: Nullable<string>;
    isActive?: boolean;
    isArchived?: boolean;
    isVisible?: boolean;
}

export interface ReconciliationListResponse extends ApiMessageResponse {
    reconciliations: ReconciliationRecord[];
}

export interface ReconciliationSummaryResponse extends ApiMessageResponse {
    summary: ReconciliationSummary;
}

export interface ReconciliationResponse extends ApiMessageResponse {
    reconciliation: ReconciliationRecord;
}
// src/features/debts/types/debt.types.ts
// Frontend debt contracts aligned with the API.
// Phase 10 adds debt payment-plan automation fields and process-due contracts.

import type {
    CurrencyCode,
    IsoDateString,
    Nullable,
} from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";

export type DebtType = "owed_by_me" | "owed_to_me";
export type DebtStatus = "active" | "paid" | "overdue" | "cancelled";

export type DebtInstallmentFrequency =
    | "weekly"
    | "biweekly"
    | "semimonthly"
    | "monthly"
    | "yearly";

export type DebtProcessDuePaymentAction =
    | "would_create"
    | "created"
    | "skipped_duplicate"
    | "skipped_missing_account"
    | "skipped_missing_member"
    | "skipped_invalid_plan"
    | "skipped_paid"
    | "skipped_inactive";

export interface DebtRecord {
    _id: string;
    workspaceId: string;
    memberId: Nullable<string>;
    relatedAccountId: Nullable<string>;
    type: DebtType;
    personName: string;
    personContact: Nullable<string>;
    originalAmount: number;
    remainingAmount: number;
    currency: CurrencyCode;
    description: string;
    startDate: IsoDateString;
    dueDate: Nullable<IsoDateString>;
    status: DebtStatus;
    paymentPlanEnabled: boolean;
    installmentAmount: Nullable<number>;
    expectedPrincipalAmount: Nullable<number>;
    expectedFeeAmount: Nullable<number>;
    installmentFrequency: Nullable<DebtInstallmentFrequency>;
    totalInstallments: Nullable<number>;
    paidInstallments: Nullable<number>;
    remainingInstallments: Nullable<number>;
    paymentDay: Nullable<number>;
    nextDueDate: Nullable<IsoDateString>;
    autoGeneratePayments: boolean;
    lastGeneratedPaymentId: Nullable<string>;
    lastGeneratedTransactionId: Nullable<string>;
    notes: Nullable<string>;
    isVisible: boolean;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface CreateDebtPayload {
    memberId?: Nullable<string>;
    relatedAccountId?: Nullable<string>;
    type: DebtType;
    personName: string;
    personContact?: Nullable<string>;
    originalAmount: number;
    remainingAmount: number;
    currency: CurrencyCode;
    description: string;
    startDate: string;
    dueDate?: Nullable<string>;
    status?: DebtStatus;
    paymentPlanEnabled?: boolean;
    installmentAmount?: Nullable<number>;
    expectedPrincipalAmount?: Nullable<number>;
    expectedFeeAmount?: Nullable<number>;
    installmentFrequency?: Nullable<DebtInstallmentFrequency>;
    totalInstallments?: Nullable<number>;
    paidInstallments?: Nullable<number>;
    paymentDay?: Nullable<number>;
    nextDueDate?: Nullable<string>;
    autoGeneratePayments?: boolean;
    notes?: Nullable<string>;
    isVisible?: boolean;
}

export interface UpdateDebtPayload {
    memberId?: Nullable<string>;
    relatedAccountId?: Nullable<string>;
    type?: DebtType;
    personName?: string;
    personContact?: Nullable<string>;
    originalAmount?: number;
    remainingAmount?: number;
    currency?: CurrencyCode;
    description?: string;
    startDate?: string;
    dueDate?: Nullable<string>;
    status?: DebtStatus;
    paymentPlanEnabled?: boolean;
    installmentAmount?: Nullable<number>;
    expectedPrincipalAmount?: Nullable<number>;
    expectedFeeAmount?: Nullable<number>;
    installmentFrequency?: Nullable<DebtInstallmentFrequency>;
    totalInstallments?: Nullable<number>;
    paidInstallments?: Nullable<number>;
    paymentDay?: Nullable<number>;
    nextDueDate?: Nullable<string>;
    autoGeneratePayments?: boolean;
    notes?: Nullable<string>;
    isVisible?: boolean;
}

export interface ProcessDueDebtPaymentsPayload {
    asOfDate?: string;
    dryRun?: boolean;
    limit?: number;
}

export interface ProcessDueDebtPaymentItem {
    debtId: string;
    debtName: string;
    scheduledPaymentDate: IsoDateString;
    nextDueDate: Nullable<IsoDateString>;
    action: DebtProcessDuePaymentAction;
    reason: Nullable<string>;
    transactionId: Nullable<string>;
    paymentId: Nullable<string>;
    amount: number;
    principalAmount: number;
    feeAmount: number;
}

export interface ProcessDueDebtPaymentsResult {
    dryRun: boolean;
    asOfDate: IsoDateString;
    scannedCount: number;
    dueCount: number;
    generatedCount: number;
    skippedCount: number;
    items: ProcessDueDebtPaymentItem[];
}

export interface ProcessDueDebtPaymentsResponse {
    message: string;
    result: ProcessDueDebtPaymentsResult;
}

export type DebtsResponse = CollectionResponse<"debts", DebtRecord>;
export type DebtResponse = EntityResponse<"debt", DebtRecord>;
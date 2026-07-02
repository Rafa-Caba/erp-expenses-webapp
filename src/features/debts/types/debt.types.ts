// src/features/debts/types/debt.types.ts
// Frontend debt contracts aligned with the API.
// Phase 8 adds optional payment plan/installment fields for debts paid or
// collected through scheduled installments.

import type {
    CurrencyCode,
    IsoDateString,
    Nullable,
} from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";

export type DebtType = "owed_by_me" | "owed_to_me";
export type DebtStatus = "active" | "paid" | "overdue" | "cancelled";
export type DebtInstallmentFrequency = "weekly" | "biweekly" | "monthly" | "yearly";

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
    installmentFrequency: Nullable<DebtInstallmentFrequency>;
    totalInstallments: Nullable<number>;
    paidInstallments: Nullable<number>;
    remainingInstallments: Nullable<number>;
    paymentDay: Nullable<number>;
    nextDueDate: Nullable<IsoDateString>;
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
    installmentFrequency?: Nullable<DebtInstallmentFrequency>;
    totalInstallments?: Nullable<number>;
    paidInstallments?: Nullable<number>;
    paymentDay?: Nullable<number>;
    nextDueDate?: Nullable<string>;
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
    installmentFrequency?: Nullable<DebtInstallmentFrequency>;
    totalInstallments?: Nullable<number>;
    paidInstallments?: Nullable<number>;
    paymentDay?: Nullable<number>;
    nextDueDate?: Nullable<string>;
    notes?: Nullable<string>;
    isVisible?: boolean;
}

export type DebtsResponse = CollectionResponse<"debts", DebtRecord>;
export type DebtResponse = EntityResponse<"debt", DebtRecord>;
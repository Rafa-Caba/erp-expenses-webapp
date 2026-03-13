// src/debts/types/debt.types.ts

import type {
    CurrencyCode,
    IsoDateString,
    Nullable,
} from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";

export type DebtType = "owed_by_me" | "owed_to_me";
export type DebtStatus = "active" | "paid" | "overdue" | "cancelled";

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
    notes?: Nullable<string>;
    isVisible?: boolean;
}

export type DebtsResponse = CollectionResponse<"debts", DebtRecord>;
export type DebtResponse = EntityResponse<"debt", DebtRecord>;
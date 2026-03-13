// src/transactions/types/transaction.types.ts

import type {
    CurrencyCode,
    IsoDateString,
    Nullable,
    TransactionType,
} from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";

export type TransactionStatus = "pending" | "posted" | "cancelled";
export type RecurrenceFrequency = "daily" | "weekly" | "bi-weekly" | "monthly" | "yearly";

export interface TransactionRecord {
    _id: string;
    workspaceId: string;
    accountId: Nullable<string>;
    destinationAccountId: Nullable<string>;
    cardId: Nullable<string>;
    memberId: string;
    categoryId: Nullable<string>;
    type: TransactionType;
    amount: number;
    currency: CurrencyCode;
    description: string;
    merchant: Nullable<string>;
    transactionDate: IsoDateString;
    status: TransactionStatus;
    reference: Nullable<string>;
    notes: Nullable<string>;
    isRecurring: boolean;
    recurrenceRule: Nullable<string>;
    isActive: boolean;
    isArchived: boolean;
    isVisible: boolean;
    createdByUserId: string;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface CreateTransactionPayload {
    accountId?: Nullable<string>;
    destinationAccountId?: Nullable<string>;
    cardId?: Nullable<string>;
    memberId: string;
    categoryId?: Nullable<string>;
    type: TransactionType;
    amount: number;
    currency: CurrencyCode;
    description: string;
    merchant?: Nullable<string>;
    transactionDate: string;
    status?: TransactionStatus;
    reference?: Nullable<string>;
    notes?: Nullable<string>;
    isRecurring?: boolean;
    recurrenceRule?: Nullable<string>;
    isVisible?: boolean;
    createdByUserId: string;
}

export interface UpdateTransactionPayload {
    accountId?: Nullable<string>;
    destinationAccountId?: Nullable<string>;
    cardId?: Nullable<string>;
    memberId?: string;
    categoryId?: Nullable<string>;
    type?: TransactionType;
    amount?: number;
    currency?: CurrencyCode;
    description?: string;
    merchant?: Nullable<string>;
    transactionDate?: string;
    status?: TransactionStatus;
    reference?: Nullable<string>;
    notes?: Nullable<string>;
    isRecurring?: boolean;
    recurrenceRule?: Nullable<string>;
    isActive?: boolean;
    isArchived?: boolean;
    isVisible?: boolean;
}

export type TransactionsResponse = CollectionResponse<"transactions", TransactionRecord>;
export type TransactionResponse = EntityResponse<"transaction", TransactionRecord>;
// src/features/payments/types/payment.types.ts
// Frontend payment contracts aligned with the API.
// amount = real cashflow moved.
// principalAmount = amount applied to reduce debt.
// feeAmount = fees, interests, commissions, or extra charges.

import type {
    CashflowDirection,
    CurrencyCode,
    IsoDateString,
    Nullable,
} from "../../../shared/types/common.types";
import type {
    CollectionResponse,
    EntityResponse,
} from "../../../shared/types/api.types";

export type PaymentStatus = "pending" | "completed" | "failed" | "cancelled";
export type PaymentMethod = "cash" | "bank_transfer" | "card" | "check" | "other";

export interface PaymentRecord {
    _id: string;
    workspaceId: string;
    debtId: string;
    accountId: Nullable<string>;
    cardId: Nullable<string>;
    memberId: Nullable<string>;
    transactionId: Nullable<string>;
    amount: number;
    principalAmount: number;
    feeAmount: number;
    cashflowDirection: Nullable<CashflowDirection>;
    currency: CurrencyCode;
    paymentDate: IsoDateString;
    method: Nullable<PaymentMethod>;
    reference: Nullable<string>;
    notes: Nullable<string>;
    status: PaymentStatus;
    isVisible: boolean;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface CreatePaymentPayload {
    debtId: string;
    accountId?: Nullable<string>;
    cardId?: Nullable<string>;
    memberId?: Nullable<string>;
    transactionId?: Nullable<string>;
    amount: number;
    principalAmount: number;
    feeAmount: number;
    cashflowDirection?: Nullable<CashflowDirection>;
    currency: CurrencyCode;
    paymentDate: string;
    method?: Nullable<PaymentMethod>;
    reference?: Nullable<string>;
    notes?: Nullable<string>;
    status?: PaymentStatus;
    isVisible?: boolean;
}

export interface UpdatePaymentPayload {
    debtId?: string;
    accountId?: Nullable<string>;
    cardId?: Nullable<string>;
    memberId?: Nullable<string>;
    transactionId?: Nullable<string>;
    amount?: number;
    principalAmount?: number;
    feeAmount?: number;
    cashflowDirection?: Nullable<CashflowDirection>;
    currency?: CurrencyCode;
    paymentDate?: string;
    method?: Nullable<PaymentMethod>;
    reference?: Nullable<string>;
    notes?: Nullable<string>;
    status?: PaymentStatus;
    isVisible?: boolean;
}

export type PaymentsResponse = CollectionResponse<"payments", PaymentRecord>;
export type PaymentResponse = EntityResponse<"payment", PaymentRecord>;
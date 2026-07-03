// src/features/subscriptions/types/subscription.types.ts
// Frontend contracts for subscriptions/recurring expenses.
// Phase 9A keeps subscriptions separate from debts and allows creating one
// reviewed expense transaction from a subscription.
// Phase 9B adds process-due contracts for previewing/generating due
// subscription transactions in a controlled way.

import type {
    CurrencyCode,
    IsoDateString,
    Nullable,
} from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";
import type { TransactionRecord, TransactionStatus } from "../../transactions/types/transaction.types";

export type SubscriptionStatus = "active" | "paused" | "cancelled";
export type SubscriptionBillingFrequency = "weekly" | "biweekly" | "monthly" | "yearly";
export type SubscriptionProcessDueAction =
    | "would_create"
    | "created"
    | "skipped_duplicate"
    | "skipped_end_date"
    | "skipped_inactive";

export interface SubscriptionRecord {
    _id: string;
    workspaceId: string;
    memberId: string;
    categoryId: string;
    accountId: Nullable<string>;
    cardId: Nullable<string>;
    name: string;
    merchant: Nullable<string>;
    amount: number;
    currency: CurrencyCode;
    billingFrequency: SubscriptionBillingFrequency;
    billingDay: Nullable<number>;
    startDate: IsoDateString;
    nextBillingDate: IsoDateString;
    endDate: Nullable<IsoDateString>;
    status: SubscriptionStatus;
    autoCreateTransaction: boolean;
    lastTransactionId: Nullable<string>;
    notes: Nullable<string>;
    isVisible: boolean;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface CreateSubscriptionPayload {
    memberId: string;
    categoryId: string;
    accountId?: Nullable<string>;
    cardId?: Nullable<string>;
    name: string;
    merchant?: Nullable<string>;
    amount: number;
    currency: CurrencyCode;
    billingFrequency: SubscriptionBillingFrequency;
    billingDay?: Nullable<number>;
    startDate: string;
    nextBillingDate: string;
    endDate?: Nullable<string>;
    status?: SubscriptionStatus;
    autoCreateTransaction?: boolean;
    notes?: Nullable<string>;
    isVisible?: boolean;
}

export interface UpdateSubscriptionPayload {
    memberId?: string;
    categoryId?: string;
    accountId?: Nullable<string>;
    cardId?: Nullable<string>;
    name?: string;
    merchant?: Nullable<string>;
    amount?: number;
    currency?: CurrencyCode;
    billingFrequency?: SubscriptionBillingFrequency;
    billingDay?: Nullable<number>;
    startDate?: string;
    nextBillingDate?: string;
    endDate?: Nullable<string>;
    status?: SubscriptionStatus;
    autoCreateTransaction?: boolean;
    lastTransactionId?: Nullable<string>;
    notes?: Nullable<string>;
    isVisible?: boolean;
}

export interface CreateSubscriptionTransactionPayload {
    transactionDate?: string;
    status?: TransactionStatus;
    reference?: Nullable<string>;
    notes?: Nullable<string>;
}

export interface ProcessDueSubscriptionsPayload {
    asOfDate?: string;
    dryRun?: boolean;
    limit?: number;
}

export interface ProcessDueSubscriptionItem {
    subscriptionId: string;
    subscriptionName: string;
    scheduledBillingDate: IsoDateString;
    nextBillingDate: IsoDateString;
    action: SubscriptionProcessDueAction;
    reason: Nullable<string>;
    transactionId: Nullable<string>;
}

export interface ProcessDueSubscriptionsResult {
    dryRun: boolean;
    asOfDate: IsoDateString;
    scannedCount: number;
    dueCount: number;
    generatedCount: number;
    skippedCount: number;
    items: ProcessDueSubscriptionItem[];
}

export interface SubscriptionTransactionResponse {
    message: string;
    subscription: SubscriptionRecord;
    transaction: TransactionRecord;
}

export interface ProcessDueSubscriptionsResponse {
    message: string;
    result: ProcessDueSubscriptionsResult;
}

export type SubscriptionsResponse = CollectionResponse<"subscriptions", SubscriptionRecord>;
export type SubscriptionResponse = EntityResponse<"subscription", SubscriptionRecord>;
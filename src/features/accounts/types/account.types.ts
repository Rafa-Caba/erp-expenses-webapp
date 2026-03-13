// src/accounts/types/account.types.ts

import type {
    CurrencyCode,
    IsoDateString,
    Nullable,
} from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";

export type AccountType = "cash" | "bank" | "wallet" | "savings" | "credit";

export interface AccountRecord {
    id: string;
    workspaceId: string;
    ownerMemberId: Nullable<string>;
    name: string;
    type: AccountType;
    bankName: Nullable<string>;
    accountNumberMasked: Nullable<string>;
    currency: CurrencyCode;
    initialBalance: number;
    currentBalance: number;
    creditLimit: Nullable<number>;
    statementClosingDay: Nullable<number>;
    paymentDueDay: Nullable<number>;
    notes: Nullable<string>;
    isActive: boolean;
    isArchived: boolean;
    isVisible: boolean;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface CreateAccountPayload {
    ownerMemberId?: string;
    name: string;
    type: AccountType;
    bankName?: string;
    accountNumberMasked?: string;
    currency: CurrencyCode;
    initialBalance: number;
    currentBalance?: number;
    creditLimit?: number;
    statementClosingDay?: number;
    paymentDueDay?: number;
    notes?: string;
    isActive?: boolean;
    isArchived?: boolean;
    isVisible?: boolean;
}

export interface UpdateAccountPayload {
    ownerMemberId?: string;
    name?: string;
    type?: AccountType;
    bankName?: string;
    accountNumberMasked?: string;
    currency?: CurrencyCode;
    initialBalance?: number;
    currentBalance?: number;
    creditLimit?: number;
    statementClosingDay?: number;
    paymentDueDay?: number;
    notes?: string;
    isActive?: boolean;
    isArchived?: boolean;
    isVisible?: boolean;
}

export type AccountsResponse = CollectionResponse<"accounts", AccountRecord>;
export type AccountResponse = EntityResponse<"account", AccountRecord>;
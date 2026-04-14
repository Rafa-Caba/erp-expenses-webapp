// src/features/ledger/types/ledger.types.ts

import type { AccountRecord } from "../../accounts/types/account.types";
import type { CategoryRecord } from "../../categories/types/category.types";
import type { TransactionStatus, TransactionRecord } from "../../transactions/types/transaction.types";
import type { WorkspaceMemberRecord } from "../../workspaces/types/workspace-member.types";
import type { CurrencyCode, IsoDateString, Nullable, TransactionType } from "../../../shared/types/common.types";

export type LedgerSortOrder =
    | "date_desc"
    | "date_asc"
    | "amount_desc"
    | "amount_asc";

export type LedgerDirectionFilter = "ALL" | "INFLOW" | "OUTFLOW";

export type LedgerEntryKind = "standard" | "transfer_in" | "transfer_out";

export interface LedgerDataset {
    transactions: TransactionRecord[];
    accounts: AccountRecord[];
    categories: CategoryRecord[];
    members: WorkspaceMemberRecord[];
}

export interface LedgerFilters {
    searchTerm: string;
    accountId: string;
    memberId: string;
    categoryId: string;
    currency: CurrencyCode | "ALL";
    typeFilter: TransactionType | "ALL";
    statusFilter: TransactionStatus | "ALL";
    directionFilter: LedgerDirectionFilter;
    sortOrder: LedgerSortOrder;
    includeHidden: boolean;
    includeArchived: boolean;
    includeInactive: boolean;
    onlyRecurring: boolean;
    dateFrom: string;
    dateTo: string;
}

export interface LedgerEntryRow {
    id: string;
    transactionId: string;
    entryKind: LedgerEntryKind;
    direction: "INFLOW" | "OUTFLOW";
    transactionDate: IsoDateString;
    type: TransactionType;
    status: TransactionStatus;
    description: string;
    merchant: Nullable<string>;
    reference: Nullable<string>;
    notes: Nullable<string>;
    currency: CurrencyCode;
    amount: number;
    debitAmount: number;
    creditAmount: number;
    signedAmount: number;
    accountId: Nullable<string>;
    accountName: string;
    counterpartyAccountId: Nullable<string>;
    counterpartyAccountName: string | null;
    categoryId: Nullable<string>;
    categoryName: string | null;
    memberId: Nullable<string>;
    memberName: string | null;
    isRecurring: boolean;
    isVisible: boolean;
    isArchived: boolean;
    isActive: boolean;
    runningBalance: number | null;
    runningBalanceMode: "ACCOUNT" | "VIEW";
}

export interface LedgerSummary {
    totalEntries: number;
    totalTransactionsRepresented: number;
    inflowAmount: number;
    outflowAmount: number;
    netAmount: number;
    hiddenCount: number;
    archivedCount: number;
    inactiveCount: number;
    recurringCount: number;
    cancelledCount: number;
    postedCount: number;
    pendingCount: number;
}

export interface LedgerView {
    allRows: LedgerEntryRow[];
    filteredRows: LedgerEntryRow[];
    summary: LedgerSummary;
    hasActiveFilters: boolean;
    singleAccountMode: boolean;
    selectedAccountName: string | null;
}
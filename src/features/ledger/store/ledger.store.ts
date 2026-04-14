// src/features/ledger/store/ledger.store.ts

import { create } from "zustand";

import type { TransactionType, CurrencyCode } from "../../../shared/types/common.types";
import type { TransactionStatus } from "../../transactions/types/transaction.types";
import type { LedgerDirectionFilter, LedgerSortOrder } from "../types/ledger.types";

type LedgerStore = {
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
    selectedEntryId: string | null;

    setSearchTerm: (value: string) => void;
    setAccountId: (value: string) => void;
    setMemberId: (value: string) => void;
    setCategoryId: (value: string) => void;
    setCurrency: (value: CurrencyCode | "ALL") => void;
    setTypeFilter: (value: TransactionType | "ALL") => void;
    setStatusFilter: (value: TransactionStatus | "ALL") => void;
    setDirectionFilter: (value: LedgerDirectionFilter) => void;
    setSortOrder: (value: LedgerSortOrder) => void;
    setIncludeHidden: (value: boolean) => void;
    setIncludeArchived: (value: boolean) => void;
    setIncludeInactive: (value: boolean) => void;
    setOnlyRecurring: (value: boolean) => void;
    setDateFrom: (value: string) => void;
    setDateTo: (value: string) => void;
    setSelectedEntryId: (value: string | null) => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    accountId: "",
    memberId: "",
    categoryId: "",
    currency: "ALL" as const,
    typeFilter: "ALL" as const,
    statusFilter: "ALL" as const,
    directionFilter: "ALL" as const,
    sortOrder: "date_desc" as const,
    includeHidden: false,
    includeArchived: false,
    includeInactive: false,
    onlyRecurring: false,
    dateFrom: "",
    dateTo: "",
    selectedEntryId: null,
};

export const useLedgerStore = create<LedgerStore>((set) => ({
    ...INITIAL_STATE,

    setSearchTerm: (value) => set({ searchTerm: value }),
    setAccountId: (value) => set({ accountId: value }),
    setMemberId: (value) => set({ memberId: value }),
    setCategoryId: (value) => set({ categoryId: value }),
    setCurrency: (value) => set({ currency: value }),
    setTypeFilter: (value) => set({ typeFilter: value }),
    setStatusFilter: (value) => set({ statusFilter: value }),
    setDirectionFilter: (value) => set({ directionFilter: value }),
    setSortOrder: (value) => set({ sortOrder: value }),
    setIncludeHidden: (value) => set({ includeHidden: value }),
    setIncludeArchived: (value) => set({ includeArchived: value }),
    setIncludeInactive: (value) => set({ includeInactive: value }),
    setOnlyRecurring: (value) => set({ onlyRecurring: value }),
    setDateFrom: (value) => set({ dateFrom: value }),
    setDateTo: (value) => set({ dateTo: value }),
    setSelectedEntryId: (value) => set({ selectedEntryId: value }),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
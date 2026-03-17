// src/features/transactions/store/transaction.store.ts

import { create } from "zustand";

import type { TransactionType } from "../../../shared/types/common.types";
import type { TransactionStatus } from "../types/transaction.types";

type TransactionStore = {
    searchTerm: string;
    typeFilter: TransactionType | "ALL";
    statusFilter: TransactionStatus | "ALL";
    includeHidden: boolean;
    selectedTransactionId: string | null;

    setSearchTerm: (value: string) => void;
    setTypeFilter: (value: TransactionType | "ALL") => void;
    setStatusFilter: (value: TransactionStatus | "ALL") => void;
    setIncludeHidden: (value: boolean) => void;
    setSelectedTransactionId: (value: string | null) => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    typeFilter: "ALL" as const,
    statusFilter: "ALL" as const,
    includeHidden: false,
    selectedTransactionId: null,
};

export const useTransactionStore = create<TransactionStore>((set) => ({
    ...INITIAL_STATE,

    setSearchTerm: (value) =>
        set({
            searchTerm: value,
        }),

    setTypeFilter: (value) =>
        set({
            typeFilter: value,
        }),

    setStatusFilter: (value) =>
        set({
            statusFilter: value,
        }),

    setIncludeHidden: (value) =>
        set({
            includeHidden: value,
        }),

    setSelectedTransactionId: (value) =>
        set({
            selectedTransactionId: value,
        }),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
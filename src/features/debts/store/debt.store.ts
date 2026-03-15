// src/features/debts/store/debt.store.ts

import { create } from "zustand";

import type { DebtStatus, DebtType } from "../types/debt.types";

type DebtStore = {
    searchTerm: string;
    typeFilter: DebtType | "ALL";
    statusFilter: DebtStatus | "ALL";
    includeHidden: boolean;
    selectedDebtId: string | null;

    setSearchTerm: (value: string) => void;
    setTypeFilter: (value: DebtType | "ALL") => void;
    setStatusFilter: (value: DebtStatus | "ALL") => void;
    setIncludeHidden: (value: boolean) => void;
    setSelectedDebtId: (value: string | null) => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    typeFilter: "ALL" as const,
    statusFilter: "ALL" as const,
    includeHidden: false,
    selectedDebtId: null,
};

export const useDebtStore = create<DebtStore>((set) => ({
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

    setSelectedDebtId: (value) =>
        set({
            selectedDebtId: value,
        }),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
// src/features/budgets/store/budget.store.ts

import { create } from "zustand";

import type { BudgetPeriodType, BudgetStatus } from "../types/budget.types";

type BudgetStore = {
    searchTerm: string;
    statusFilter: BudgetStatus | "ALL";
    periodTypeFilter: BudgetPeriodType | "ALL";
    includeArchived: boolean;
    includeInactive: boolean;
    includeHidden: boolean;
    selectedBudgetId: string | null;

    setSearchTerm: (value: string) => void;
    setStatusFilter: (value: BudgetStatus | "ALL") => void;
    setPeriodTypeFilter: (value: BudgetPeriodType | "ALL") => void;
    setIncludeArchived: (value: boolean) => void;
    setIncludeInactive: (value: boolean) => void;
    setIncludeHidden: (value: boolean) => void;
    setSelectedBudgetId: (value: string | null) => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    statusFilter: "ALL" as const,
    periodTypeFilter: "ALL" as const,
    includeArchived: false,
    includeInactive: false,
    includeHidden: false,
    selectedBudgetId: null,
};

export const useBudgetStore = create<BudgetStore>((set) => ({
    ...INITIAL_STATE,

    setSearchTerm: (value) =>
        set({
            searchTerm: value,
        }),

    setStatusFilter: (value) =>
        set({
            statusFilter: value,
        }),

    setPeriodTypeFilter: (value) =>
        set({
            periodTypeFilter: value,
        }),

    setIncludeArchived: (value) =>
        set({
            includeArchived: value,
        }),

    setIncludeInactive: (value) =>
        set({
            includeInactive: value,
        }),

    setIncludeHidden: (value) =>
        set({
            includeHidden: value,
        }),

    setSelectedBudgetId: (value) =>
        set({
            selectedBudgetId: value,
        }),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
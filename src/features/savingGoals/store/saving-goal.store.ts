// src/features/savingGoals/store/saving-goal.store.ts

import { create } from "zustand";

import type {
    SavingsGoalCategory,
    SavingsGoalStatus,
} from "../types/saving-goal.types";

type SavingGoalStore = {
    searchTerm: string;
    statusFilter: SavingsGoalStatus | "ALL";
    categoryFilter: SavingsGoalCategory | "ALL";
    includeHidden: boolean;
    selectedSavingGoalId: string | null;

    setSearchTerm: (value: string) => void;
    setStatusFilter: (value: SavingsGoalStatus | "ALL") => void;
    setCategoryFilter: (value: SavingsGoalCategory | "ALL") => void;
    setIncludeHidden: (value: boolean) => void;
    setSelectedSavingGoalId: (value: string | null) => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    statusFilter: "ALL" as const,
    categoryFilter: "ALL" as const,
    includeHidden: false,
    selectedSavingGoalId: null,
};

export const useSavingGoalStore = create<SavingGoalStore>((set) => ({
    ...INITIAL_STATE,

    setSearchTerm: (value) =>
        set({
            searchTerm: value,
        }),

    setStatusFilter: (value) =>
        set({
            statusFilter: value,
        }),

    setCategoryFilter: (value) =>
        set({
            categoryFilter: value,
        }),

    setIncludeHidden: (value) =>
        set({
            includeHidden: value,
        }),

    setSelectedSavingGoalId: (value) =>
        set({
            selectedSavingGoalId: value,
        }),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
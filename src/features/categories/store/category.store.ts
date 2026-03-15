// src/features/categories/store/category.store.ts

import { create } from "zustand";

import type { CategoryType } from "../types/category.types";

type CategorySystemFilter = "ALL" | "SYSTEM" | "CUSTOM";

type CategoryStore = {
    searchTerm: string;
    typeFilter: CategoryType | "ALL";
    systemFilter: CategorySystemFilter;
    includeInactive: boolean;
    includeHidden: boolean;
    selectedCategoryId: string | null;

    setSearchTerm: (value: string) => void;
    setTypeFilter: (value: CategoryType | "ALL") => void;
    setSystemFilter: (value: CategorySystemFilter) => void;
    setIncludeInactive: (value: boolean) => void;
    setIncludeHidden: (value: boolean) => void;
    setSelectedCategoryId: (value: string | null) => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    typeFilter: "ALL" as const,
    systemFilter: "ALL" as const,
    includeInactive: false,
    includeHidden: false,
    selectedCategoryId: null,
};

export const useCategoryStore = create<CategoryStore>((set) => ({
    ...INITIAL_STATE,

    setSearchTerm: (value) =>
        set({
            searchTerm: value,
        }),

    setTypeFilter: (value) =>
        set({
            typeFilter: value,
        }),

    setSystemFilter: (value) =>
        set({
            systemFilter: value,
        }),

    setIncludeInactive: (value) =>
        set({
            includeInactive: value,
        }),

    setIncludeHidden: (value) =>
        set({
            includeHidden: value,
        }),

    setSelectedCategoryId: (value) =>
        set({
            selectedCategoryId: value,
        }),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
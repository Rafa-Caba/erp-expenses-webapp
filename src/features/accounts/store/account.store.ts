// src/features/accounts/store/account.store.ts

import { create } from "zustand";

import type { AccountType } from "../types/account.types";

type AccountStore = {
    searchTerm: string;
    typeFilter: AccountType | "ALL";
    includeArchived: boolean;
    includeInactive: boolean;
    includeHidden: boolean;
    selectedAccountId: string | null;

    setSearchTerm: (value: string) => void;
    setTypeFilter: (value: AccountType | "ALL") => void;
    setIncludeArchived: (value: boolean) => void;
    setIncludeInactive: (value: boolean) => void;
    setIncludeHidden: (value: boolean) => void;
    setSelectedAccountId: (value: string | null) => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    typeFilter: "ALL" as const,
    includeArchived: false,
    includeInactive: false,
    includeHidden: false,
    selectedAccountId: null,
};

export const useAccountStore = create<AccountStore>((set) => ({
    ...INITIAL_STATE,

    setSearchTerm: (value) =>
        set({
            searchTerm: value,
        }),

    setTypeFilter: (value) =>
        set({
            typeFilter: value,
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

    setSelectedAccountId: (value) =>
        set({
            selectedAccountId: value,
        }),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
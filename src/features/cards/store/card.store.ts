// src/features/cards/store/card.store.ts

import { create } from "zustand";

import type { CardType } from "../types/card.types";

type CardStore = {
    searchTerm: string;
    typeFilter: CardType | "ALL";
    includeArchived: boolean;
    includeInactive: boolean;
    includeHidden: boolean;
    selectedCardId: string | null;

    setSearchTerm: (value: string) => void;
    setTypeFilter: (value: CardType | "ALL") => void;
    setIncludeArchived: (value: boolean) => void;
    setIncludeInactive: (value: boolean) => void;
    setIncludeHidden: (value: boolean) => void;
    setSelectedCardId: (value: string | null) => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    typeFilter: "ALL" as const,
    includeArchived: false,
    includeInactive: false,
    includeHidden: false,
    selectedCardId: null,
};

export const useCardStore = create<CardStore>((set) => ({
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

    setSelectedCardId: (value) =>
        set({
            selectedCardId: value,
        }),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
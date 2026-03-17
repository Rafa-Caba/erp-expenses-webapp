// src/features/receipts/store/receipt.store.ts

import { create } from "zustand";

type ReceiptStore = {
    searchTerm: string;
    includeHidden: boolean;
    selectedReceiptId: string | null;

    setSearchTerm: (value: string) => void;
    setIncludeHidden: (value: boolean) => void;
    setSelectedReceiptId: (value: string | null) => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    includeHidden: false,
    selectedReceiptId: null,
};

export const useReceiptStore = create<ReceiptStore>((set) => ({
    ...INITIAL_STATE,

    setSearchTerm: (value) =>
        set({
            searchTerm: value,
        }),

    setIncludeHidden: (value) =>
        set({
            includeHidden: value,
        }),

    setSelectedReceiptId: (value) =>
        set({
            selectedReceiptId: value,
        }),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
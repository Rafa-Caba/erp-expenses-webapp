// src/features/payments/store/payment.store.ts

import { create } from "zustand";

import type { PaymentMethod, PaymentStatus } from "../types/payment.types";

type PaymentStore = {
    searchTerm: string;
    statusFilter: PaymentStatus | "ALL";
    methodFilter: PaymentMethod | "ALL";
    includeHidden: boolean;
    selectedPaymentId: string | null;

    setSearchTerm: (value: string) => void;
    setStatusFilter: (value: PaymentStatus | "ALL") => void;
    setMethodFilter: (value: PaymentMethod | "ALL") => void;
    setIncludeHidden: (value: boolean) => void;
    setSelectedPaymentId: (value: string | null) => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    statusFilter: "ALL" as const,
    methodFilter: "ALL" as const,
    includeHidden: false,
    selectedPaymentId: null,
};

export const usePaymentStore = create<PaymentStore>((set) => ({
    ...INITIAL_STATE,

    setSearchTerm: (value) =>
        set({
            searchTerm: value,
        }),

    setStatusFilter: (value) =>
        set({
            statusFilter: value,
        }),

    setMethodFilter: (value) =>
        set({
            methodFilter: value,
        }),

    setIncludeHidden: (value) =>
        set({
            includeHidden: value,
        }),

    setSelectedPaymentId: (value) =>
        set({
            selectedPaymentId: value,
        }),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
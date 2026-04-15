// src/features/dashboard/store/dashboard.store.ts

import { create } from "zustand";

import type { CurrencyCode } from "../../../shared/types/common.types";
import type {
    DashboardFilters,
    DashboardGroupBy,
    DashboardRangePreset,
} from "../types/dashboard.types";

type DashboardStore = DashboardFilters & {
    setRangePreset: (value: DashboardRangePreset) => void;
    setCurrency: (value: CurrencyCode | "ALL") => void;
    setGroupBy: (value: DashboardGroupBy) => void;
    setMemberId: (value: string) => void;
    setCategoryId: (value: string) => void;
    setAccountId: (value: string) => void;
    setCardId: (value: string) => void;
    setIncludeArchived: (value: boolean) => void;
    setCustomDateFrom: (value: string) => void;
    setCustomDateTo: (value: string) => void;
    setFilters: (value: DashboardFilters) => void;
    reset: () => void;
};

const INITIAL_STATE: DashboardFilters = {
    rangePreset: "30d",
    currency: "ALL",
    groupBy: "auto",
    memberId: "",
    categoryId: "",
    accountId: "",
    cardId: "",
    includeArchived: false,
    customDateFrom: "",
    customDateTo: "",
};

export const useDashboardStore = create<DashboardStore>((set) => ({
    ...INITIAL_STATE,

    setRangePreset: (value) => set({ rangePreset: value }),
    setCurrency: (value) => set({ currency: value }),
    setGroupBy: (value) => set({ groupBy: value }),
    setMemberId: (value) => set({ memberId: value }),
    setCategoryId: (value) => set({ categoryId: value }),
    setAccountId: (value) => set({ accountId: value }),
    setCardId: (value) => set({ cardId: value }),
    setIncludeArchived: (value) => set({ includeArchived: value }),
    setCustomDateFrom: (value) => set({ customDateFrom: value }),
    setCustomDateTo: (value) => set({ customDateTo: value }),
    setFilters: (value) => set({ ...value }),
    reset: () => set({ ...INITIAL_STATE }),
}));
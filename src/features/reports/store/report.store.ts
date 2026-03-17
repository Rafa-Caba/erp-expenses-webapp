// src/features/reports/store/report.store.ts

import { create } from "zustand";

import type { ReportFiltersFormValues } from "../types/report-filter-form.types";
import type { ReportStatus, ReportType } from "../types/report.types";
import { DEFAULT_REPORT_FILTERS_FORM_VALUES } from "../utils/report-filters";

type ReportStore = {
    searchTerm: string;
    typeFilter: ReportType | "ALL";
    statusFilter: ReportStatus | "ALL";
    includeHidden: boolean;
    selectedReportId: string | null;
    analyticsFilters: ReportFiltersFormValues;

    setSearchTerm: (value: string) => void;
    setTypeFilter: (value: ReportType | "ALL") => void;
    setStatusFilter: (value: ReportStatus | "ALL") => void;
    setIncludeHidden: (value: boolean) => void;
    setSelectedReportId: (value: string | null) => void;
    setAnalyticsFilters: (value: ReportFiltersFormValues) => void;
    resetListFilters: () => void;
    resetAnalyticsFilters: () => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    typeFilter: "ALL" as const,
    statusFilter: "ALL" as const,
    includeHidden: false,
    selectedReportId: null,
    analyticsFilters: DEFAULT_REPORT_FILTERS_FORM_VALUES,
};

export const useReportStore = create<ReportStore>((set) => ({
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

    setSelectedReportId: (value) =>
        set({
            selectedReportId: value,
        }),

    setAnalyticsFilters: (value) =>
        set({
            analyticsFilters: value,
        }),

    resetListFilters: () =>
        set((state) => ({
            ...state,
            searchTerm: "",
            typeFilter: "ALL",
            statusFilter: "ALL",
            includeHidden: false,
        })),

    resetAnalyticsFilters: () =>
        set((state) => ({
            ...state,
            analyticsFilters: DEFAULT_REPORT_FILTERS_FORM_VALUES,
        })),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
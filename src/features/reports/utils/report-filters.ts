// src/features/reports/utils/report-filters.ts

import type { ReportFiltersFormValues } from "../types/report-filter-form.types";
import type { ReportFilters } from "../types/report.types";

export const DEFAULT_REPORT_FILTERS_FORM_VALUES: ReportFiltersFormValues = {
    dateFrom: "",
    dateTo: "",
    currency: "",
    memberId: "",
    categoryId: "",
    accountId: "",
    cardId: "",
    includeArchived: false,
    groupBy: "",
};

export function toReportFilters(
    values: ReportFiltersFormValues
): ReportFilters {
    return {
        dateFrom: values.dateFrom.trim() || null,
        dateTo: values.dateTo.trim() || null,
        currency: values.currency || null,
        memberId: values.memberId.trim() || null,
        categoryId: values.categoryId.trim() || null,
        accountId: values.accountId.trim() || null,
        cardId: values.cardId.trim() || null,
        includeArchived: values.includeArchived || null,
        groupBy: values.groupBy || null,
    };
}

export function toReportFiltersFormValues(
    filters: ReportFilters | null | undefined
): ReportFiltersFormValues {
    if (!filters) {
        return DEFAULT_REPORT_FILTERS_FORM_VALUES;
    }

    return {
        dateFrom: filters.dateFrom ?? "",
        dateTo: filters.dateTo ?? "",
        currency: filters.currency ?? "",
        memberId: filters.memberId ?? "",
        categoryId: filters.categoryId ?? "",
        accountId: filters.accountId ?? "",
        cardId: filters.cardId ?? "",
        includeArchived: Boolean(filters.includeArchived),
        groupBy: filters.groupBy ?? "",
    };
}
// src/features/reports/types/report-filter-form.types.ts

import type { CurrencyCode } from "../../../shared/types/common.types";
import type { ReportGroupBy } from "./report.types";

export type ReportFiltersFormValues = {
    dateFrom: string;
    dateTo: string;
    currency: CurrencyCode | "";
    memberId: string;
    categoryId: string;
    accountId: string;
    cardId: string;
    includeArchived: boolean;
    groupBy: ReportGroupBy | "";
};
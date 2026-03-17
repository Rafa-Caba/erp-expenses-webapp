// src/shared/utils/labels/budget-label.util.ts

import { useBudgetByIdQuery } from "../../../features/budgets/hooks/useBudgetByIdQuery";
import type { BudgetRecord } from "../../../features/budgets/types/budget.types";

import {
    buildLabelByIdResult,
    normalizeLabelValue,
    type LabelByIdResult,
} from "./label-by-id.util";

export function getBudgetLabelValue(budget: BudgetRecord | null | undefined): string | null {
    return normalizeLabelValue(budget?.name);
}

export function useBudgetLabelById(
    workspaceId: string | null,
    budgetId: string | null
): LabelByIdResult {
    const query = useBudgetByIdQuery(workspaceId, budgetId);

    return buildLabelByIdResult({
        rawId: budgetId,
        resolvedLabel: getBudgetLabelValue(query.data),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Presupuesto",
    });
}
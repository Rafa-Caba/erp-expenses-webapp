// src/shared/utils/labels/debt-label.util.ts

import { useDebtByIdQuery } from "../../../features/debts/hooks/useDebtByIdQuery";
import type { DebtRecord } from "../../../features/debts/types/debt.types";

import {
    buildLabelByIdResult,
    normalizeLabelValue,
    type LabelByIdResult,
} from "./label-by-id.util";

export function getDebtLabelValue(debt: DebtRecord | null | undefined): string | null {
    return normalizeLabelValue(debt?.description);
}

export function useDebtLabelById(
    workspaceId: string | null,
    debtId: string | null
): LabelByIdResult {
    const query = useDebtByIdQuery(workspaceId, debtId);

    return buildLabelByIdResult({
        rawId: debtId,
        resolvedLabel: getDebtLabelValue(query.data),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Deuda",
    });
}
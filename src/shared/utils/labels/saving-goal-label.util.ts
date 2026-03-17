// src/shared/utils/labels/saving-goal-label.util.ts

import { useSavingGoalByIdQuery } from "../../../features/savingGoals/hooks/useSavingGoalByIdQuery";
import type { SavingGoalRecord } from "../../../features/savingGoals/types/saving-goal.types";

import {
    buildLabelByIdResult,
    normalizeLabelValue,
    type LabelByIdResult,
} from "./label-by-id.util";

export function getSavingGoalLabelValue(
    savingGoal: SavingGoalRecord | null | undefined
): string | null {
    return normalizeLabelValue(savingGoal?.name);
}

export function useSavingGoalLabelById(
    workspaceId: string | null,
    savingGoalId: string | null
): LabelByIdResult {
    const query = useSavingGoalByIdQuery(workspaceId, savingGoalId);

    return buildLabelByIdResult({
        rawId: savingGoalId,
        resolvedLabel: getSavingGoalLabelValue(query.data),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Meta",
    });
}
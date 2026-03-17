// src/features/savingGoals/hooks/useSavingGoalByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { savingGoalQueryKeys } from "../api/saving-goal.queryKeys";
import { createSavingGoalService } from "../services/saving-goal.service";
import type { SavingGoalRecord } from "../types/saving-goal.types";

const savingGoalService = createSavingGoalService(apiClient);

export function useSavingGoalByIdQuery(
    workspaceId: string | null,
    savingGoalId: string | null
) {
    return useQuery({
        queryKey:
            workspaceId && savingGoalId
                ? savingGoalQueryKeys.detail(workspaceId, savingGoalId)
                : savingGoalQueryKeys.details(),
        queryFn: async (): Promise<SavingGoalRecord> => {
            if (!workspaceId || !savingGoalId) {
                throw new Error("Workspace ID and saving goal ID are required");
            }

            const response = await savingGoalService.getSavingGoalById(
                workspaceId,
                savingGoalId
            );

            return response.savingGoal;
        },
        enabled: workspaceId !== null && savingGoalId !== null,
        staleTime: 30_000,
    });
}
// src/features/savingGoals/hooks/useSavingGoalsQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { savingGoalQueryKeys } from "../api/saving-goal.queryKeys";
import { createSavingGoalService } from "../services/saving-goal.service";

const savingGoalService = createSavingGoalService(apiClient);

export function useSavingGoalsQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId
            ? savingGoalQueryKeys.list(workspaceId)
            : savingGoalQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return savingGoalService.getSavingGoals(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}
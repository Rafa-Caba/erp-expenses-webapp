// src/features/savingGoals/hooks/useSavingGoalMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { savingGoalQueryKeys } from "../api/saving-goal.queryKeys";
import { createSavingGoalService } from "../services/saving-goal.service";
import type {
    CreateSavingGoalPayload,
    SavingGoalResponse,
    UpdateSavingGoalPayload,
} from "../types/saving-goal.types";

const savingGoalService = createSavingGoalService(apiClient);

type CreateSavingGoalMutationPayload = {
    workspaceId: string;
    payload: CreateSavingGoalPayload;
};

type UpdateSavingGoalMutationPayload = {
    workspaceId: string;
    savingGoalId: string;
    payload: UpdateSavingGoalPayload;
};

type DeleteSavingGoalMutationPayload = {
    workspaceId: string;
    savingGoalId: string;
};

export function useCreateSavingGoalMutation() {
    const queryClient = useQueryClient();

    return useMutation<SavingGoalResponse, Error, CreateSavingGoalMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            savingGoalService.createSavingGoal(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: savingGoalQueryKeys.all,
            });

            queryClient.setQueryData(
                savingGoalQueryKeys.detail(
                    response.savingGoal.workspaceId,
                    response.savingGoal._id
                ),
                response.savingGoal
            );
        },
    });
}

export function useUpdateSavingGoalMutation() {
    const queryClient = useQueryClient();

    return useMutation<SavingGoalResponse, Error, UpdateSavingGoalMutationPayload>({
        mutationFn: ({ workspaceId, savingGoalId, payload }) =>
            savingGoalService.updateSavingGoal(workspaceId, savingGoalId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: savingGoalQueryKeys.all,
            });

            queryClient.setQueryData(
                savingGoalQueryKeys.detail(
                    response.savingGoal.workspaceId,
                    response.savingGoal._id
                ),
                response.savingGoal
            );
        },
    });
}

export function useDeleteSavingGoalMutation() {
    const queryClient = useQueryClient();

    return useMutation<SavingGoalResponse, Error, DeleteSavingGoalMutationPayload>({
        mutationFn: ({ workspaceId, savingGoalId }) =>
            savingGoalService.deleteSavingGoal(workspaceId, savingGoalId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: savingGoalQueryKeys.all,
            });

            queryClient.setQueryData(
                savingGoalQueryKeys.detail(
                    response.savingGoal.workspaceId,
                    response.savingGoal._id
                ),
                response.savingGoal
            );
        },
    });
}
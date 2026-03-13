// src/savingGoals/services/saving-goal.service.ts

import type { AxiosInstance } from "axios";

import type {
    CreateSavingGoalPayload,
    SavingGoalResponse,
    SavingGoalsResponse,
    UpdateSavingGoalPayload,
} from "../types/saving-goal.types";

export function createSavingGoalService(apiClient: AxiosInstance) {
    return {
        getSavingGoals(workspaceId: string): Promise<SavingGoalsResponse> {
            return apiClient
                .get<SavingGoalsResponse>(`/api/workspaces/${workspaceId}/saving-goals`)
                .then(({ data }) => data);
        },

        getSavingGoalById(
            workspaceId: string,
            savingGoalId: string
        ): Promise<SavingGoalResponse> {
            return apiClient
                .get<SavingGoalResponse>(
                    `/api/workspaces/${workspaceId}/saving-goals/${savingGoalId}`
                )
                .then(({ data }) => data);
        },

        createSavingGoal(
            workspaceId: string,
            payload: CreateSavingGoalPayload
        ): Promise<SavingGoalResponse> {
            return apiClient
                .post<SavingGoalResponse>(
                    `/api/workspaces/${workspaceId}/saving-goals`,
                    payload
                )
                .then(({ data }) => data);
        },

        updateSavingGoal(
            workspaceId: string,
            savingGoalId: string,
            payload: UpdateSavingGoalPayload
        ): Promise<SavingGoalResponse> {
            return apiClient
                .patch<SavingGoalResponse>(
                    `/api/workspaces/${workspaceId}/saving-goals/${savingGoalId}`,
                    payload
                )
                .then(({ data }) => data);
        },

        deleteSavingGoal(
            workspaceId: string,
            savingGoalId: string
        ): Promise<SavingGoalResponse> {
            return apiClient
                .delete<SavingGoalResponse>(
                    `/api/workspaces/${workspaceId}/saving-goals/${savingGoalId}`
                )
                .then(({ data }) => data);
        },
    };
}
// src/debts/services/debt.service.ts

import type { AxiosInstance } from "axios";

import type {
    CreateDebtPayload,
    DebtResponse,
    DebtsResponse,
    UpdateDebtPayload,
} from "../types/debt.types";

export function createDebtService(apiClient: AxiosInstance) {
    return {
        getDebts(workspaceId: string): Promise<DebtsResponse> {
            return apiClient
                .get<DebtsResponse>(`/api/workspaces/${workspaceId}/debts`)
                .then(({ data }) => data);
        },

        getDebtById(workspaceId: string, debtId: string): Promise<DebtResponse> {
            return apiClient
                .get<DebtResponse>(`/api/workspaces/${workspaceId}/debts/${debtId}`)
                .then(({ data }) => data);
        },

        createDebt(workspaceId: string, payload: CreateDebtPayload): Promise<DebtResponse> {
            return apiClient
                .post<DebtResponse>(`/api/workspaces/${workspaceId}/debts`, payload)
                .then(({ data }) => data);
        },

        updateDebt(
            workspaceId: string,
            debtId: string,
            payload: UpdateDebtPayload
        ): Promise<DebtResponse> {
            return apiClient
                .patch<DebtResponse>(`/api/workspaces/${workspaceId}/debts/${debtId}`, payload)
                .then(({ data }) => data);
        },

        deleteDebt(workspaceId: string, debtId: string): Promise<DebtResponse> {
            return apiClient
                .delete<DebtResponse>(`/api/workspaces/${workspaceId}/debts/${debtId}`)
                .then(({ data }) => data);
        },
    };
}
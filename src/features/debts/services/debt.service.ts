// src/features/debts/services/debt.service.ts
// HTTP client for debts and Phase 10 due debt payment processor.

import type { AxiosInstance } from "axios";

import type {
    CreateDebtPayload,
    DebtResponse,
    DebtsResponse,
    ProcessDueDebtPaymentsPayload,
    ProcessDueDebtPaymentsResponse,
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

        createDebt(
            workspaceId: string,
            payload: CreateDebtPayload
        ): Promise<DebtResponse> {
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
                .patch<DebtResponse>(
                    `/api/workspaces/${workspaceId}/debts/${debtId}`,
                    payload
                )
                .then(({ data }) => data);
        },

        deleteDebt(workspaceId: string, debtId: string): Promise<DebtResponse> {
            return apiClient
                .delete<DebtResponse>(`/api/workspaces/${workspaceId}/debts/${debtId}`)
                .then(({ data }) => data);
        },

        processDueDebtPayments(
            workspaceId: string,
            payload: ProcessDueDebtPaymentsPayload
        ): Promise<ProcessDueDebtPaymentsResponse> {
            return apiClient
                .post<ProcessDueDebtPaymentsResponse>(
                    `/api/workspaces/${workspaceId}/debts/process-due-payments`,
                    payload
                )
                .then(({ data }) => data);
        },
    };
}
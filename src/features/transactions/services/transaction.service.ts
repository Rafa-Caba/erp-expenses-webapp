// src/transactions/services/transaction.service.ts

import type { AxiosInstance } from "axios";

import type {
    CreateTransactionPayload,
    TransactionResponse,
    TransactionsResponse,
    UpdateTransactionPayload,
} from "../types/transaction.types";

export function createTransactionService(apiClient: AxiosInstance) {
    return {
        getTransactions(workspaceId: string): Promise<TransactionsResponse> {
            return apiClient
                .get<TransactionsResponse>(`/api/workspaces/${workspaceId}/transactions`)
                .then(({ data }) => data);
        },

        getTransactionById(
            workspaceId: string,
            transactionId: string
        ): Promise<TransactionResponse> {
            return apiClient
                .get<TransactionResponse>(
                    `/api/workspaces/${workspaceId}/transactions/${transactionId}`
                )
                .then(({ data }) => data);
        },

        createTransaction(
            workspaceId: string,
            payload: CreateTransactionPayload
        ): Promise<TransactionResponse> {
            return apiClient
                .post<TransactionResponse>(
                    `/api/workspaces/${workspaceId}/transactions`,
                    payload
                )
                .then(({ data }) => data);
        },

        updateTransaction(
            workspaceId: string,
            transactionId: string,
            payload: UpdateTransactionPayload
        ): Promise<TransactionResponse> {
            return apiClient
                .patch<TransactionResponse>(
                    `/api/workspaces/${workspaceId}/transactions/${transactionId}`,
                    payload
                )
                .then(({ data }) => data);
        },

        archiveTransaction(
            workspaceId: string,
            transactionId: string
        ): Promise<TransactionResponse> {
            return apiClient
                .delete<TransactionResponse>(
                    `/api/workspaces/${workspaceId}/transactions/${transactionId}`
                )
                .then(({ data }) => data);
        },
    };
}
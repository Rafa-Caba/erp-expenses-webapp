// src/receipts/services/receipt.service.ts

import type { AxiosInstance } from "axios";

import type {
    ReceiptResponse,
    ReceiptsResponse,
} from "../types/receipt.types";

export function createReceiptService(apiClient: AxiosInstance) {
    return {
        getReceipts(workspaceId: string): Promise<ReceiptsResponse> {
            return apiClient
                .get<ReceiptsResponse>(`/api/workspaces/${workspaceId}/receipts`)
                .then(({ data }) => data);
        },

        getReceiptsByTransaction(
            workspaceId: string,
            transactionId: string
        ): Promise<ReceiptsResponse> {
            return apiClient
                .get<ReceiptsResponse>(
                    `/api/workspaces/${workspaceId}/receipts/transaction/${transactionId}`
                )
                .then(({ data }) => data);
        },

        getReceiptById(workspaceId: string, receiptId: string): Promise<ReceiptResponse> {
            return apiClient
                .get<ReceiptResponse>(`/api/workspaces/${workspaceId}/receipts/${receiptId}`)
                .then(({ data }) => data);
        },

        createReceipt(workspaceId: string, payload: FormData): Promise<ReceiptResponse> {
            return apiClient
                .post<ReceiptResponse>(`/api/workspaces/${workspaceId}/receipts`, payload, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(({ data }) => data);
        },

        updateReceipt(
            workspaceId: string,
            receiptId: string,
            payload: FormData
        ): Promise<ReceiptResponse> {
            return apiClient
                .patch<ReceiptResponse>(
                    `/api/workspaces/${workspaceId}/receipts/${receiptId}`,
                    payload,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then(({ data }) => data);
        },

        deleteReceipt(workspaceId: string, receiptId: string): Promise<ReceiptResponse> {
            return apiClient
                .delete<ReceiptResponse>(`/api/workspaces/${workspaceId}/receipts/${receiptId}`)
                .then(({ data }) => data);
        },
    };
}
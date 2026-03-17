// src/features/transactions/hooks/useTransactionByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { transactionQueryKeys } from "../api/transaction.queryKeys";
import { createTransactionService } from "../services/transaction.service";
import type { TransactionRecord } from "../types/transaction.types";

const transactionService = createTransactionService(apiClient);

export function useTransactionByIdQuery(
    workspaceId: string | null,
    transactionId: string | null
) {
    return useQuery({
        queryKey:
            workspaceId && transactionId
                ? transactionQueryKeys.detail(workspaceId, transactionId)
                : transactionQueryKeys.details(),
        queryFn: async (): Promise<TransactionRecord> => {
            if (!workspaceId || !transactionId) {
                throw new Error("Workspace ID and transaction ID are required");
            }

            const response = await transactionService.getTransactionById(
                workspaceId,
                transactionId
            );

            return response.transaction;
        },
        enabled: workspaceId !== null && transactionId !== null,
        staleTime: 30_000,
    });
}
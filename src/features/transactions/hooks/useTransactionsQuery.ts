// src/features/transactions/hooks/useTransactionsQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { transactionQueryKeys } from "../api/transaction.queryKeys";
import { createTransactionService } from "../services/transaction.service";

const transactionService = createTransactionService(apiClient);

export function useTransactionsQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId
            ? transactionQueryKeys.list(workspaceId)
            : transactionQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return transactionService.getTransactions(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}
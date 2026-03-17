// src/features/receipts/hooks/useReceiptsByTransactionQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { receiptQueryKeys } from "../api/receipt.queryKeys";
import { createReceiptService } from "../services/receipt.service";

const receiptService = createReceiptService(apiClient);

export function useReceiptsByTransactionQuery(
    workspaceId: string | null,
    transactionId: string | null
) {
    return useQuery({
        queryKey:
            workspaceId && transactionId
                ? receiptQueryKeys.byTransaction(workspaceId, transactionId)
                : receiptQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId || !transactionId) {
                throw new Error("Workspace ID and transaction ID are required");
            }

            return receiptService.getReceiptsByTransaction(workspaceId, transactionId);
        },
        enabled: workspaceId !== null && transactionId !== null,
        staleTime: 30_000,
    });
}
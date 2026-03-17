// src/features/receipts/hooks/useReceiptsQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { receiptQueryKeys } from "../api/receipt.queryKeys";
import { createReceiptService } from "../services/receipt.service";

const receiptService = createReceiptService(apiClient);

export function useReceiptsQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId ? receiptQueryKeys.list(workspaceId) : receiptQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return receiptService.getReceipts(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}
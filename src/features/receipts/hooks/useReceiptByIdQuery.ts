// src/features/receipts/hooks/useReceiptByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { receiptQueryKeys } from "../api/receipt.queryKeys";
import { createReceiptService } from "../services/receipt.service";
import type { ReceiptRecord } from "../types/receipt.types";

const receiptService = createReceiptService(apiClient);

export function useReceiptByIdQuery(workspaceId: string | null, receiptId: string | null) {
    return useQuery({
        queryKey:
            workspaceId && receiptId
                ? receiptQueryKeys.detail(workspaceId, receiptId)
                : receiptQueryKeys.details(),
        queryFn: async (): Promise<ReceiptRecord> => {
            if (!workspaceId || !receiptId) {
                throw new Error("Workspace ID and receipt ID are required");
            }

            const response = await receiptService.getReceiptById(workspaceId, receiptId);
            return response.receipt;
        },
        enabled: workspaceId !== null && receiptId !== null,
        staleTime: 30_000,
    });
}
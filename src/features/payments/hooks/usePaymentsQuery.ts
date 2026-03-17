// src/features/payments/hooks/usePaymentsQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { paymentQueryKeys } from "../api/payment.queryKeys";
import { createPaymentService } from "../services/payment.service";

const paymentService = createPaymentService(apiClient);

export function usePaymentsQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId ? paymentQueryKeys.list(workspaceId) : paymentQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return paymentService.getPayments(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}
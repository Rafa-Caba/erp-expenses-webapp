// src/features/payments/hooks/usePaymentByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { paymentQueryKeys } from "../api/payment.queryKeys";
import { createPaymentService } from "../services/payment.service";
import type { PaymentRecord } from "../types/payment.types";

const paymentService = createPaymentService(apiClient);

export function usePaymentByIdQuery(workspaceId: string | null, paymentId: string | null) {
    return useQuery({
        queryKey:
            workspaceId && paymentId
                ? paymentQueryKeys.detail(workspaceId, paymentId)
                : paymentQueryKeys.details(),
        queryFn: async (): Promise<PaymentRecord> => {
            if (!workspaceId || !paymentId) {
                throw new Error("Workspace ID and payment ID are required");
            }

            const response = await paymentService.getPaymentById(workspaceId, paymentId);
            return response.payment;
        },
        enabled: workspaceId !== null && paymentId !== null,
        staleTime: 30_000,
    });
}
// src/features/payments/services/payment.service.ts

import type { AxiosInstance } from "axios";

import type {
    CreatePaymentPayload,
    PaymentResponse,
    PaymentsResponse,
    UpdatePaymentPayload,
} from "../types/payment.types";

export function createPaymentService(apiClient: AxiosInstance) {
    return {
        getPayments(workspaceId: string): Promise<PaymentsResponse> {
            return apiClient
                .get<PaymentsResponse>(`/api/workspaces/${workspaceId}/payments`)
                .then(({ data }) => data);
        },

        getPaymentById(workspaceId: string, paymentId: string): Promise<PaymentResponse> {
            return apiClient
                .get<PaymentResponse>(`/api/workspaces/${workspaceId}/payments/${paymentId}`)
                .then(({ data }) => data);
        },

        createPayment(
            workspaceId: string,
            payload: CreatePaymentPayload
        ): Promise<PaymentResponse> {
            return apiClient
                .post<PaymentResponse>(`/api/workspaces/${workspaceId}/payments`, payload)
                .then(({ data }) => data);
        },

        updatePayment(
            workspaceId: string,
            paymentId: string,
            payload: UpdatePaymentPayload
        ): Promise<PaymentResponse> {
            return apiClient
                .patch<PaymentResponse>(
                    `/api/workspaces/${workspaceId}/payments/${paymentId}`,
                    payload
                )
                .then(({ data }) => data);
        },

        deletePayment(workspaceId: string, paymentId: string): Promise<PaymentResponse> {
            return apiClient
                .delete<PaymentResponse>(
                    `/api/workspaces/${workspaceId}/payments/${paymentId}`
                )
                .then(({ data }) => data);
        },
    };
}
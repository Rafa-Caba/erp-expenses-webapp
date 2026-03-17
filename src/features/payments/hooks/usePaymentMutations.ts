// src/features/payments/hooks/usePaymentMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { paymentQueryKeys } from "../api/payment.queryKeys";
import { createPaymentService } from "../services/payment.service";
import type {
    CreatePaymentPayload,
    PaymentResponse,
    UpdatePaymentPayload,
} from "../types/payment.types";

const paymentService = createPaymentService(apiClient);

type CreatePaymentMutationPayload = {
    workspaceId: string;
    payload: CreatePaymentPayload;
};

type UpdatePaymentMutationPayload = {
    workspaceId: string;
    paymentId: string;
    payload: UpdatePaymentPayload;
};

type DeletePaymentMutationPayload = {
    workspaceId: string;
    paymentId: string;
};

export function useCreatePaymentMutation() {
    const queryClient = useQueryClient();

    return useMutation<PaymentResponse, Error, CreatePaymentMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            paymentService.createPayment(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: paymentQueryKeys.all,
            });

            queryClient.setQueryData(
                paymentQueryKeys.detail(
                    response.payment.workspaceId,
                    response.payment._id
                ),
                response.payment
            );
        },
    });
}

export function useUpdatePaymentMutation() {
    const queryClient = useQueryClient();

    return useMutation<PaymentResponse, Error, UpdatePaymentMutationPayload>({
        mutationFn: ({ workspaceId, paymentId, payload }) =>
            paymentService.updatePayment(workspaceId, paymentId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: paymentQueryKeys.all,
            });

            queryClient.setQueryData(
                paymentQueryKeys.detail(
                    response.payment.workspaceId,
                    response.payment._id
                ),
                response.payment
            );
        },
    });
}

export function useDeletePaymentMutation() {
    const queryClient = useQueryClient();

    return useMutation<PaymentResponse, Error, DeletePaymentMutationPayload>({
        mutationFn: ({ workspaceId, paymentId }) =>
            paymentService.deletePayment(workspaceId, paymentId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: paymentQueryKeys.all,
            });

            queryClient.removeQueries({
                queryKey: paymentQueryKeys.detail(
                    response.payment.workspaceId,
                    response.payment._id
                ),
            });
        },
    });
}
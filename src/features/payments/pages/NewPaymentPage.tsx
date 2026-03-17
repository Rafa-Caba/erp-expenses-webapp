// src/features/payments/pages/NewPaymentPage.tsx

import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { PaymentForm, type PaymentFormValues } from "../components/PaymentForm";
import { useCreatePaymentMutation } from "../hooks/usePaymentMutations";
import type { CreatePaymentPayload } from "../types/payment.types";

function getPaymentsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/payments";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/payments`;
}

function getTodayDateInputValue(): string {
    return new Date().toISOString().slice(0, 10);
}

const INITIAL_VALUES: PaymentFormValues = {
    debtId: "",
    accountId: "",
    cardId: "",
    memberId: "",
    transactionId: "",
    amount: "",
    currency: "MXN",
    paymentDate: getTodayDateInputValue(),
    method: "",
    reference: "",
    notes: "",
    status: "completed",
    isVisible: true,
};

function toCreatePaymentPayload(values: PaymentFormValues): CreatePaymentPayload {
    const amount = Number(values.amount);
    const hasAccountId = values.accountId.trim().length > 0;
    const hasCardId = values.cardId.trim().length > 0;

    return {
        debtId: values.debtId.trim(),
        accountId: hasAccountId ? values.accountId.trim() : null,
        cardId: hasCardId ? values.cardId.trim() : null,
        memberId: values.memberId.trim() || null,
        transactionId: values.transactionId.trim() || null,
        amount,
        currency: values.currency,
        paymentDate: values.paymentDate,
        method: values.method || null,
        reference: values.reference.trim() || null,
        notes: values.notes.trim() || null,
        status: values.status,
        isVisible: values.isVisible,
    };
}

function getPaymentErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

export function NewPaymentPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const createPaymentMutation = useCreatePaymentMutation();

    if (!workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const paymentsBasePath = getPaymentsBasePath(scopeType, workspaceId);

    const submitErrorMessage = createPaymentMutation.isError
        ? getPaymentErrorMessage(createPaymentMutation.error, "No se pudo crear el pago.")
        : null;

    const handleSubmit = React.useCallback(
        (values: PaymentFormValues) => {
            const payload = toCreatePaymentPayload(values);

            createPaymentMutation.mutate(
                {
                    workspaceId,
                    payload,
                },
                {
                    onSuccess: () => {
                        navigate(paymentsBasePath);
                    },
                }
            );
        },
        [createPaymentMutation, navigate, paymentsBasePath, workspaceId]
    );

    const handleCancel = React.useCallback(() => {
        navigate(paymentsBasePath);
    }, [navigate, paymentsBasePath]);

    return (
        <Page
            title="Nuevo pago"
            subtitle="Agrega un nuevo pago ligado a una deuda del workspace activo."
        >
            <PaymentForm
                workspaceId={workspaceId}
                mode="create"
                initialValues={INITIAL_VALUES}
                isSubmitting={createPaymentMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
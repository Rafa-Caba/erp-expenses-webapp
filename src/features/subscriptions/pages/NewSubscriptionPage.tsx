// src/features/subscriptions/pages/NewSubscriptionPage.tsx

import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { Page } from "../../../shared/ui/Page/Page";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import {
    SubscriptionForm,
    type SubscriptionFormValues,
} from "../components/SubscriptionForm";
import { useCreateSubscriptionMutation } from "../hooks/useSubscriptionMutations";
import type { CreateSubscriptionPayload } from "../types/subscription.types";

function getSubscriptionsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/subscriptions";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/subscriptions`;
}

function getTodayDateInputValue(): string {
    return new Date().toISOString().slice(0, 10);
}

function parseOptionalInteger(value: string): number | null {
    return value.trim().length > 0 ? Math.trunc(Number(value.trim())) : null;
}

const INITIAL_VALUES: SubscriptionFormValues = {
    memberId: "",
    categoryId: "",
    accountId: "",
    cardId: "",
    name: "",
    merchant: "",
    amount: "",
    currency: "MXN",
    billingFrequency: "monthly",
    billingDay: "",
    startDate: getTodayDateInputValue(),
    nextBillingDate: getTodayDateInputValue(),
    endDate: "",
    status: "active",
    autoCreateTransaction: false,
    notes: "",
    isVisible: true,
};

function toCreateSubscriptionPayload(values: SubscriptionFormValues): CreateSubscriptionPayload {
    const hasAccountId = values.accountId.trim().length > 0;
    const hasCardId = values.cardId.trim().length > 0;

    return {
        memberId: values.memberId.trim(),
        categoryId: values.categoryId.trim(),
        accountId: hasAccountId ? values.accountId.trim() : null,
        cardId: hasCardId ? values.cardId.trim() : null,
        name: values.name.trim(),
        merchant: values.merchant.trim() || null,
        amount: Number(values.amount),
        currency: values.currency,
        billingFrequency: values.billingFrequency,
        billingDay: parseOptionalInteger(values.billingDay),
        startDate: values.startDate,
        nextBillingDate: values.nextBillingDate,
        endDate: values.endDate.trim() || null,
        status: values.status,
        autoCreateTransaction: values.autoCreateTransaction,
        notes: values.notes.trim() || null,
        isVisible: values.isVisible,
    };
}

export function NewSubscriptionPage() {
    const navigate = useNavigate();
    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);
    const createSubscriptionMutation = useCreateSubscriptionMutation();

    if (!workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const subscriptionsBasePath = getSubscriptionsBasePath(scopeType, workspaceId);
    const submitErrorMessage = createSubscriptionMutation.isError
        ? getApiErrorMessage(
            createSubscriptionMutation.error,
            "No se pudo crear la suscripción."
        )
        : null;

    const handleSubmit = React.useCallback(
        (values: SubscriptionFormValues) => {
            createSubscriptionMutation.mutate(
                {
                    workspaceId,
                    payload: toCreateSubscriptionPayload(values),
                },
                {
                    onSuccess: () => navigate(subscriptionsBasePath),
                }
            );
        },
        [createSubscriptionMutation, navigate, subscriptionsBasePath, workspaceId]
    );

    return (
        <Page
            title="Nueva suscripción"
            subtitle="Registra un nuevo servicio recurrente dentro del workspace activo."
        >
            <SubscriptionForm
                workspaceId={workspaceId}
                mode="create"
                initialValues={INITIAL_VALUES}
                isSubmitting={createSubscriptionMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={() => navigate(subscriptionsBasePath)}
            />
        </Page>
    );
}

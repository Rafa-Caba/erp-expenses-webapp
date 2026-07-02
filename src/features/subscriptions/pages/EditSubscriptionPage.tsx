// src/features/subscriptions/pages/EditSubscriptionPage.tsx

import { Navigate, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { Page } from "../../../shared/ui/Page/Page";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import {
    SubscriptionForm,
    type SubscriptionFormValues,
} from "../components/SubscriptionForm";
import { useSubscriptionByIdQuery } from "../hooks/useSubscriptionByIdQuery";
import { useUpdateSubscriptionMutation } from "../hooks/useSubscriptionMutations";
import type { SubscriptionRecord, UpdateSubscriptionPayload } from "../types/subscription.types";

function getSubscriptionsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/subscriptions";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/subscriptions`;
}

function formatIsoDateForInput(value: string | null): string {
    if (!value) {
        return "";
    }

    return value.slice(0, 10);
}

function parseOptionalInteger(value: string): number | null {
    return value.trim().length > 0 ? Math.trunc(Number(value.trim())) : null;
}

function toSubscriptionFormValues(subscription: SubscriptionRecord): SubscriptionFormValues {
    return {
        memberId: subscription.memberId,
        categoryId: subscription.categoryId,
        accountId: subscription.accountId ?? "",
        cardId: subscription.cardId ?? "",
        name: subscription.name,
        merchant: subscription.merchant ?? "",
        amount: String(subscription.amount),
        currency: subscription.currency,
        billingFrequency: subscription.billingFrequency,
        billingDay: subscription.billingDay === null ? "" : String(subscription.billingDay),
        startDate: formatIsoDateForInput(subscription.startDate),
        nextBillingDate: formatIsoDateForInput(subscription.nextBillingDate),
        endDate: formatIsoDateForInput(subscription.endDate),
        status: subscription.status,
        autoCreateTransaction: subscription.autoCreateTransaction,
        notes: subscription.notes ?? "",
        isVisible: subscription.isVisible,
    };
}

function toUpdateSubscriptionPayload(values: SubscriptionFormValues): UpdateSubscriptionPayload {
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

export function EditSubscriptionPage() {
    const navigate = useNavigate();
    const params = useParams<{ subscriptionId: string }>();
    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);
    const subscriptionId = params.subscriptionId ?? null;

    const subscriptionQuery = useSubscriptionByIdQuery(workspaceId, subscriptionId);
    const updateSubscriptionMutation = useUpdateSubscriptionMutation();

    if (!workspaceId || !subscriptionId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const subscriptionsBasePath = getSubscriptionsBasePath(scopeType, workspaceId);

    if (subscriptionQuery.isLoading) {
        return (
            <Page title="Editar suscripción" subtitle="Cargando la información actual.">
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <CircularProgress />
                        <Typography>Cargando suscripción…</Typography>
                    </Stack>
                </Box>
            </Page>
        );
    }

    if (subscriptionQuery.isError || !subscriptionQuery.data) {
        return (
            <Page title="Editar suscripción" subtitle="No fue posible cargar la suscripción.">
                <Alert severity="error">
                    {getApiErrorMessage(
                        subscriptionQuery.error,
                        "No se pudo obtener la suscripción."
                    )}
                </Alert>
            </Page>
        );
    }

    const submitErrorMessage = updateSubscriptionMutation.isError
        ? getApiErrorMessage(
            updateSubscriptionMutation.error,
            "No se pudo actualizar la suscripción."
        )
        : null;

    const handleSubmit = (values: SubscriptionFormValues) => {
        updateSubscriptionMutation.mutate(
            {
                workspaceId,
                subscriptionId,
                payload: toUpdateSubscriptionPayload(values),
            },
            {
                onSuccess: () => navigate(subscriptionsBasePath),
            }
        );
    };

    return (
        <Page
            title="Editar suscripción"
            subtitle="Actualiza monto, fuente, categoría, frecuencia y próximo cobro."
        >
            <SubscriptionForm
                workspaceId={workspaceId}
                mode="edit"
                initialValues={toSubscriptionFormValues(subscriptionQuery.data)}
                isSubmitting={updateSubscriptionMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={() => navigate(subscriptionsBasePath)}
            />
        </Page>
    );
}

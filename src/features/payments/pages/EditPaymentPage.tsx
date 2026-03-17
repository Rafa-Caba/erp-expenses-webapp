// src/features/payments/pages/EditPaymentPage.tsx

import { Navigate, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import { Page } from "../../../shared/ui/Page/Page";
import { PaymentForm, type PaymentFormValues } from "../components/PaymentForm";
import { usePaymentByIdQuery } from "../hooks/usePaymentByIdQuery";
import { useUpdatePaymentMutation } from "../hooks/usePaymentMutations";
import type { PaymentRecord, UpdatePaymentPayload } from "../types/payment.types";

function getPaymentsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/payments";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/payments`;
}

function toDateInputValue(value: string): string {
    return value.slice(0, 10);
}

function toPaymentFormValues(payment: PaymentRecord): PaymentFormValues {
    return {
        debtId: payment.debtId,
        accountId: payment.accountId ?? "",
        cardId: payment.cardId ?? "",
        memberId: payment.memberId ?? "",
        transactionId: payment.transactionId ?? "",
        amount: String(payment.amount),
        currency: payment.currency,
        paymentDate: toDateInputValue(payment.paymentDate),
        method: payment.method ?? "",
        reference: payment.reference ?? "",
        notes: payment.notes ?? "",
        status: payment.status,
        isVisible: payment.isVisible,
    };
}

function toUpdatePaymentPayload(values: PaymentFormValues): UpdatePaymentPayload {
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

export function EditPaymentPage() {
    const navigate = useNavigate();
    const params = useParams<{ paymentId: string }>();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const paymentId = params.paymentId ?? null;

    const paymentQuery = usePaymentByIdQuery(workspaceId, paymentId);
    const updatePaymentMutation = useUpdatePaymentMutation();

    if (!workspaceId || !paymentId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const paymentsBasePath = getPaymentsBasePath(scopeType, workspaceId);

    if (paymentQuery.isLoading) {
        return (
            <Page title="Editar pago" subtitle="Cargando la información actual del pago.">
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />

                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>Cargando pago…</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo los datos actuales del pago.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (paymentQuery.isError || !paymentQuery.data) {
        return (
            <Page title="Editar pago" subtitle="No fue posible cargar el pago.">
                <Alert severity="error">
                    {getApiErrorMessage(
                        paymentQuery.error,
                        "No se pudo obtener el pago."
                    )}
                </Alert>
            </Page>
        );
    }

    const submitErrorMessage = updatePaymentMutation.isError
        ? getApiErrorMessage(
            updatePaymentMutation.error,
            "No se pudo actualizar el pago."
        )
        : null;

    const initialValues = toPaymentFormValues(paymentQuery.data);

    const handleSubmit = (values: PaymentFormValues) => {
        const payload = toUpdatePaymentPayload(values);

        updatePaymentMutation.mutate(
            {
                workspaceId,
                paymentId,
                payload,
            },
            {
                onSuccess: () => {
                    navigate(paymentsBasePath);
                },
            }
        );
    };

    const handleCancel = () => {
        navigate(paymentsBasePath);
    };

    return (
        <Page
            title="Editar pago"
            subtitle="Actualiza monto, fecha, estado y vínculos relacionados del pago."
        >
            <PaymentForm
                workspaceId={workspaceId}
                mode="edit"
                initialValues={initialValues}
                isSubmitting={updatePaymentMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
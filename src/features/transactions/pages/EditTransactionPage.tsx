// src/features/transactions/pages/EditTransactionPage.tsx

import { Navigate, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import {
    TransactionForm,
    type TransactionFormValues,
} from "../components/TransactionForm";
import { useTransactionByIdQuery } from "../hooks/useTransactionByIdQuery";
import { useUpdateTransactionMutation } from "../hooks/useTransactionMutations";
import type {
    TransactionRecord,
    UpdateTransactionPayload,
} from "../types/transaction.types";

function getTransactionsBasePath(
    scopeType: ScopeType,
    workspaceId: string | null
): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/transactions";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/transactions`;
}

function toDateInputValue(value: string): string {
    return value.slice(0, 10);
}

function toTransactionFormValues(
    transaction: TransactionRecord
): TransactionFormValues {
    return {
        accountId: transaction.accountId ?? "",
        destinationAccountId: transaction.destinationAccountId ?? "",
        cardId: transaction.cardId ?? "",
        memberId: transaction.memberId,
        categoryId: transaction.categoryId ?? "",
        type: transaction.type,
        amount: String(transaction.amount),
        currency: transaction.currency,
        description: transaction.description,
        merchant: transaction.merchant ?? "",
        transactionDate: toDateInputValue(transaction.transactionDate),
        status: transaction.status,
        reference: transaction.reference ?? "",
        notes: transaction.notes ?? "",
        isRecurring: transaction.isRecurring,
        recurrenceRule: transaction.recurrenceRule ?? "",
        isVisible: transaction.isVisible,
        createdByUserId: transaction.createdByUserId,
    };
}

function toUpdateTransactionPayload(
    values: TransactionFormValues
): UpdateTransactionPayload {
    return {
        accountId: values.accountId.trim() || null,
        destinationAccountId: values.destinationAccountId.trim() || null,
        cardId: values.cardId.trim() || null,
        memberId: values.memberId.trim(),
        categoryId: values.categoryId.trim() || null,
        type: values.type,
        amount: Number(values.amount),
        currency: values.currency,
        description: values.description.trim(),
        merchant: values.merchant.trim() || null,
        transactionDate: values.transactionDate,
        status: values.status,
        reference: values.reference.trim() || null,
        notes: values.notes.trim() || null,
        isRecurring: values.isRecurring,
        recurrenceRule: values.isRecurring
            ? values.recurrenceRule.trim() || null
            : null,
        isVisible: values.isVisible,
    };
}

function getTransactionErrorMessage(
    error: Error | null,
    fallbackMessage: string
): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

export function EditTransactionPage() {
    const navigate = useNavigate();
    const params = useParams<{ transactionId: string }>();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const transactionId = params.transactionId ?? null;

    const transactionQuery = useTransactionByIdQuery(workspaceId, transactionId);
    const updateTransactionMutation = useUpdateTransactionMutation();

    if (!workspaceId || !transactionId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const transactionsBasePath = getTransactionsBasePath(scopeType, workspaceId);

    if (transactionQuery.isLoading) {
        return (
            <Page
                title="Editar transacción"
                subtitle="Cargando la información actual de la transacción."
            >
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />

                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando transacción…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo los datos actuales de la transacción.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (transactionQuery.isError || !transactionQuery.data) {
        return (
            <Page title="Editar transacción" subtitle="No fue posible cargar la transacción.">
                <Alert severity="error">
                    {getTransactionErrorMessage(
                        transactionQuery.error,
                        "No se pudo obtener la transacción."
                    )}
                </Alert>
            </Page>
        );
    }

    const submitErrorMessage = updateTransactionMutation.isError
        ? getTransactionErrorMessage(
            updateTransactionMutation.error,
            "No se pudo actualizar la transacción."
        )
        : null;

    const initialValues = toTransactionFormValues(transactionQuery.data);

    const handleSubmit = (values: TransactionFormValues) => {
        const payload = toUpdateTransactionPayload(values);

        updateTransactionMutation.mutate(
            {
                workspaceId,
                transactionId,
                payload,
            },
            {
                onSuccess: () => {
                    navigate(transactionsBasePath);
                },
            }
        );
    };

    const handleCancel = () => {
        navigate(transactionsBasePath);
    };

    return (
        <Page
            title="Editar transacción"
            subtitle="Actualiza el tipo, fuente, categoría y datos de la transacción."
        >
            <TransactionForm
                workspaceId={workspaceId}
                mode="edit"
                initialValues={initialValues}
                isSubmitting={updateTransactionMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
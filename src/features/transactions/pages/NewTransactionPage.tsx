// src/features/transactions/pages/NewTransactionPage.tsx
// New transaction page.
// Normalizes cashflowDirection before sending the API payload.
// Recurring expenses are now handled by Subscriptions, so this page always
// sends isRecurring=false and recurrenceRule=null.

import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import {
    TransactionForm,
    type TransactionFormValues,
} from "../components/TransactionForm";
import { useCreateTransactionMutation } from "../hooks/useTransactionMutations";
import type { CreateTransactionPayload } from "../types/transaction.types";

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

function getTodayDateInputValue(): string {
    return new Date().toISOString().slice(0, 10);
}

const INITIAL_VALUES: TransactionFormValues = {
    accountId: "",
    destinationAccountId: "",
    cardId: "",
    memberId: "",
    categoryId: "",
    debtId: "",
    cashflowDirection: "",
    type: "expense",
    amount: "",
    currency: "MXN",
    description: "",
    merchant: "",
    transactionDate: getTodayDateInputValue(),
    status: "posted",
    reference: "",
    notes: "",
    isRecurring: false,
    recurrenceRule: "",
    isVisible: true,
    createdByUserId: "",
};

function resolveTransactionCashflowDirection(
    values: TransactionFormValues
): CreateTransactionPayload["cashflowDirection"] {
    if (values.type === "expense") {
        return "out";
    }

    if (values.type === "income") {
        return "in";
    }

    if (values.type === "debt_payment") {
        return values.cashflowDirection || null;
    }

    if (values.type === "transfer") {
        return null;
    }

    if (values.type === "adjustment") {
        return Number(values.amount) >= 0 ? "in" : "out";
    }

    return null;
}

function toCreateTransactionPayload(
    values: TransactionFormValues
): CreateTransactionPayload {
    const isDebtPayment = values.type === "debt_payment";

    return {
        accountId: values.accountId.trim() || null,
        destinationAccountId: isDebtPayment
            ? null
            : values.destinationAccountId.trim() || null,
        cardId: isDebtPayment ? null : values.cardId.trim() || null,
        memberId: values.memberId.trim(),
        categoryId: isDebtPayment ? null : values.categoryId.trim() || null,
        debtId: isDebtPayment ? values.debtId.trim() || null : null,
        cashflowDirection: resolveTransactionCashflowDirection(values),
        type: values.type,
        amount: Number(values.amount),
        currency: values.currency,
        description: values.description.trim(),
        merchant: values.merchant.trim() || null,
        transactionDate: values.transactionDate,
        status: values.status,
        reference: values.reference.trim() || null,
        notes: values.notes.trim() || null,
        isRecurring: false,
        recurrenceRule: null,
        isVisible: values.isVisible,
        createdByUserId: values.createdByUserId.trim(),
    };
}

export function NewTransactionPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const createTransactionMutation = useCreateTransactionMutation();

    if (!workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const transactionsBasePath = getTransactionsBasePath(scopeType, workspaceId);

    const submitErrorMessage = createTransactionMutation.isError
        ? getApiErrorMessage(
            createTransactionMutation.error,
            "No se pudo crear la transacción."
        )
        : null;

    const handleSubmit = React.useCallback(
        (values: TransactionFormValues) => {
            const payload = toCreateTransactionPayload(values);

            createTransactionMutation.mutate(
                {
                    workspaceId,
                    payload,
                },
                {
                    onSuccess: () => {
                        navigate(transactionsBasePath);
                    },
                }
            );
        },
        [createTransactionMutation, navigate, transactionsBasePath, workspaceId]
    );

    const handleCancel = React.useCallback(() => {
        navigate(transactionsBasePath);
    }, [navigate, transactionsBasePath]);

    return (
        <Page
            title="Nueva transacción"
            subtitle="Agrega un nuevo movimiento al workspace activo."
        >
            <TransactionForm
                workspaceId={workspaceId}
                mode="create"
                initialValues={INITIAL_VALUES}
                isSubmitting={createTransactionMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
// src/features/accounts/pages/NewAccountPage.tsx

import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { useCreateAccountMutation } from "../hooks/useAccountMutations";
import { AccountForm, type AccountFormValues } from "../components/AccountForm";
import type { CreateAccountPayload } from "../types/account.types";

function getAccountsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/accounts";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/accounts`;
}

const INITIAL_VALUES: AccountFormValues = {
    ownerMemberId: "",
    name: "",
    type: "cash",
    bankName: "",
    accountNumberMasked: "",
    currency: "MXN",
    initialBalance: "0",
    currentBalance: "0",
    creditLimit: "",
    statementClosingDay: "",
    paymentDueDay: "",
    notes: "",
    isActive: true,
    isArchived: false,
    isVisible: true,
};

function parseOptionalNumber(value: string): number | undefined {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return undefined;
    }

    return Number(trimmedValue);
}

function toCreateAccountPayload(values: AccountFormValues): CreateAccountPayload {
    return {
        ownerMemberId: values.ownerMemberId.trim() || undefined,
        name: values.name.trim(),
        type: values.type,
        bankName: values.bankName.trim() || undefined,
        accountNumberMasked: values.accountNumberMasked.trim() || undefined,
        currency: values.currency,
        initialBalance: Number(values.initialBalance),
        currentBalance: Number(values.currentBalance),
        creditLimit: values.type === "credit" ? parseOptionalNumber(values.creditLimit) : undefined,
        statementClosingDay:
            values.type === "credit" ? parseOptionalNumber(values.statementClosingDay) : undefined,
        paymentDueDay:
            values.type === "credit" ? parseOptionalNumber(values.paymentDueDay) : undefined,
        notes: values.notes.trim() || undefined,
        isActive: values.isActive,
        isArchived: values.isArchived,
        isVisible: values.isVisible,
    };
}

function getAccountErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

export function NewAccountPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const createAccountMutation = useCreateAccountMutation();

    if (!workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const accountsBasePath = getAccountsBasePath(scopeType, workspaceId);

    const submitErrorMessage = createAccountMutation.isError
        ? getAccountErrorMessage(createAccountMutation.error, "No se pudo crear la cuenta.")
        : null;

    const handleSubmit = React.useCallback(
        (values: AccountFormValues) => {
            const payload = toCreateAccountPayload(values);

            createAccountMutation.mutate(
                {
                    workspaceId,
                    payload,
                },
                {
                    onSuccess: () => {
                        navigate(accountsBasePath);
                    },
                }
            );
        },
        [accountsBasePath, createAccountMutation, navigate, workspaceId]
    );

    const handleCancel = React.useCallback(() => {
        navigate(accountsBasePath);
    }, [accountsBasePath, navigate]);

    return (
        <Page
            title="Nueva cuenta"
            subtitle="Agrega una nueva cuenta financiera al workspace activo."
        >
            <AccountForm
                mode="create"
                initialValues={INITIAL_VALUES}
                isSubmitting={createAccountMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
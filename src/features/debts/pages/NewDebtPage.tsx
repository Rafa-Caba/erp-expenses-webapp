// src/features/debts/pages/NewDebtPage.tsx

import React from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { CurrencyCode } from "../../../shared/types/common.types";
import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { useAccountsQuery } from "../../accounts/hooks/useAccountsQuery";
import type { AccountRecord, AccountType } from "../../accounts/types/account.types";
import {
    DebtForm,
    type DebtAccountOption,
    type DebtCurrencyOption,
    type DebtFormValues,
} from "../components/DebtForm";
import { useCreateDebtMutation } from "../hooks/useDebtMutations";
import type { CreateDebtPayload } from "../types/debt.types";

type ApiErrorResponse = {
    code?: string;
    message?: string;
};

function getScopeBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}`;
}

function getAccountTypeLabel(type: AccountType): string {
    switch (type) {
        case "cash":
            return "Efectivo";
        case "bank":
            return "Banco";
        case "wallet":
            return "Wallet";
        case "savings":
            return "Ahorro";
        case "credit":
            return "Crédito";
    }
}

function toDebtAccountOptions(accounts: AccountRecord[]): DebtAccountOption[] {
    return accounts.map((account: AccountRecord) => ({
        id: account.id,
        label: account.name,
        secondaryLabel: `${getAccountTypeLabel(account.type)} • ${account.currency}`,
        currency: account.currency,
    }));
}

function toDebtCurrencyOptions(accounts: AccountRecord[]): DebtCurrencyOption[] {
    const uniqueCurrencies = Array.from(
        new Set<CurrencyCode>(accounts.map((account: AccountRecord) => account.currency))
    );

    return uniqueCurrencies.map((currency) => ({
        value: currency,
        label: currency,
    }));
}

function parseRequiredAmount(value: string): number {
    return Number(value.trim());
}

function toRequiredCurrencyCode(value: DebtFormValues["currency"]): CurrencyCode {
    if (value === "") {
        throw new Error("Currency is required");
    }

    return value;
}

function toCreateDebtPayload(values: DebtFormValues): CreateDebtPayload {
    return {
        memberId: values.memberId.trim() || null,
        relatedAccountId: values.relatedAccountId.trim() || null,
        type: values.type,
        personName: values.personName.trim(),
        personContact: values.personContact.trim() || null,
        originalAmount: parseRequiredAmount(values.originalAmount),
        remainingAmount: parseRequiredAmount(values.remainingAmount),
        currency: toRequiredCurrencyCode(values.currency),
        description: values.description.trim(),
        startDate: values.startDate,
        dueDate: values.dueDate.trim() || null,
        status: values.status,
        notes: values.notes.trim() || null,
        isVisible: values.isVisible,
    };
}

function getDebtErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const apiMessage = error.response?.data?.message;

        if (typeof apiMessage === "string" && apiMessage.trim().length > 0) {
            return apiMessage;
        }
    }

    return error.message.trim().length > 0 ? error.message : fallbackMessage;
}

export function NewDebtPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const accountsQuery = useAccountsQuery(workspaceId);
    const createDebtMutation = useCreateDebtMutation();

    if (!workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const scopeBasePath = getScopeBasePath(scopeType, workspaceId);
    const debtsBasePath = `${scopeBasePath}/debts`;
    const accountsBasePath = `${scopeBasePath}/accounts`;

    if (accountsQuery.isLoading) {
        return (
            <Page
                title="Nueva deuda"
                subtitle="Cargando cuentas disponibles para obtener monedas del workspace."
            >
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando cuentas…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo cuentas del workspace activo.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </Page>
        );
    }

    if (accountsQuery.isError) {
        return (
            <Page
                title="Nueva deuda"
                subtitle="No fue posible cargar las cuentas disponibles."
            >
                <Alert severity="error">
                    {getDebtErrorMessage(
                        accountsQuery.error,
                        "No se pudieron obtener las cuentas."
                    )}
                </Alert>
            </Page>
        );
    }

    const accounts = accountsQuery.data?.accounts ?? [];
    const accountOptions = toDebtAccountOptions(accounts);
    const currencyOptions = toDebtCurrencyOptions(accounts);

    if (currencyOptions.length === 0) {
        return (
            <Page
                title="Nueva deuda"
                subtitle="Se necesita al menos una cuenta con moneda disponible para registrar deudas."
            >
                <Stack spacing={2}>
                    <Alert severity="info">
                        Como la deuda requiere una moneda obligatoria, primero crea una cuenta en el workspace para tomar sus monedas disponibles.
                    </Alert>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Button
                            variant="contained"
                            onClick={() => navigate(`${accountsBasePath}/new`)}
                        >
                            Crear cuenta
                        </Button>

                        <Button variant="outlined" onClick={() => navigate(debtsBasePath)}>
                            Volver a deudas
                        </Button>
                    </Stack>
                </Stack>
            </Page>
        );
    }

    const initialValues: DebtFormValues = {
        memberId: "",
        relatedAccountId: "",
        type: "owed_by_me",
        personName: "",
        personContact: "",
        originalAmount: "",
        remainingAmount: "",
        currency: currencyOptions[0].value,
        description: "",
        startDate: "",
        dueDate: "",
        status: "active",
        notes: "",
        isVisible: true,
    };

    const submitErrorMessage = createDebtMutation.isError
        ? getDebtErrorMessage(createDebtMutation.error, "No se pudo crear la deuda.")
        : null;

    const handleSubmit = React.useCallback(
        (values: DebtFormValues) => {
            const payload = toCreateDebtPayload(values);

            createDebtMutation.mutate(
                {
                    workspaceId,
                    payload,
                },
                {
                    onSuccess: () => {
                        navigate(debtsBasePath);
                    },
                }
            );
        },
        [createDebtMutation, debtsBasePath, navigate, workspaceId]
    );

    const handleCancel = React.useCallback(() => {
        navigate(debtsBasePath);
    }, [debtsBasePath, navigate]);

    return (
        <Page
            title="Nueva deuda"
            subtitle="Agrega una nueva deuda por pagar o por cobrar dentro del workspace activo."
        >
            <DebtForm
                mode="create"
                workspaceId={workspaceId}
                initialValues={initialValues}
                accountOptions={accountOptions}
                currencyOptions={currencyOptions}
                isSubmitting={createDebtMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
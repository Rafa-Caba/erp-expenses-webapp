// src/features/debts/pages/EditDebtPage.tsx

import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
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
import { useDebtByIdQuery } from "../hooks/useDebtByIdQuery";
import { useUpdateDebtMutation } from "../hooks/useDebtMutations";
import type { DebtRecord, UpdateDebtPayload } from "../types/debt.types";

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

function ensureCurrentAccountOption(
    options: DebtAccountOption[],
    debt: DebtRecord
): DebtAccountOption[] {
    if (!debt.relatedAccountId) {
        return options;
    }

    const alreadyExists = options.some((option) => option.id === debt.relatedAccountId);

    if (alreadyExists) {
        return options;
    }

    return [
        {
            id: debt.relatedAccountId,
            label: `Cuenta actual (${debt.relatedAccountId})`,
            secondaryLabel: debt.currency,
            currency: debt.currency,
        },
        ...options,
    ];
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

function ensureCurrentCurrencyOption(
    options: DebtCurrencyOption[],
    debt: DebtRecord
): DebtCurrencyOption[] {
    const alreadyExists = options.some((option) => option.value === debt.currency);

    if (alreadyExists) {
        return options;
    }

    return [
        {
            value: debt.currency,
            label: debt.currency,
        },
        ...options,
    ];
}

function formatIsoDateForInput(value: string | null): string {
    if (!value) {
        return "";
    }

    return value.slice(0, 10);
}

function toDebtFormValues(debt: DebtRecord): DebtFormValues {
    return {
        memberId: debt.memberId ?? "",
        relatedAccountId: debt.relatedAccountId ?? "",
        type: debt.type,
        personName: debt.personName,
        personContact: debt.personContact ?? "",
        originalAmount: String(debt.originalAmount),
        remainingAmount: String(debt.remainingAmount),
        currency: debt.currency,
        description: debt.description,
        startDate: formatIsoDateForInput(debt.startDate),
        dueDate: formatIsoDateForInput(debt.dueDate),
        status: debt.status,
        notes: debt.notes ?? "",
        isVisible: debt.isVisible,
    };
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

function toUpdateDebtPayload(values: DebtFormValues): UpdateDebtPayload {
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

export function EditDebtPage() {
    const navigate = useNavigate();
    const params = useParams<{ debtId: string }>();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const debtId = params.debtId ?? null;

    const debtQuery = useDebtByIdQuery(workspaceId, debtId);
    const accountsQuery = useAccountsQuery(workspaceId);
    const updateDebtMutation = useUpdateDebtMutation();

    if (!workspaceId || !debtId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const scopeBasePath = getScopeBasePath(scopeType, workspaceId);
    const debtsBasePath = `${scopeBasePath}/debts`;
    const accountsBasePath = `${scopeBasePath}/accounts`;

    if (debtQuery.isLoading || accountsQuery.isLoading) {
        return (
            <Page
                title="Editar deuda"
                subtitle="Cargando la información actual de la deuda."
            >
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando deuda…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo la deuda y las cuentas disponibles del workspace.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (debtQuery.isError || !debtQuery.data) {
        return (
            <Page title="Editar deuda" subtitle="No fue posible cargar la deuda.">
                <Alert severity="error">
                    {getDebtErrorMessage(debtQuery.error, "No se pudo obtener la deuda.")}
                </Alert>
            </Page>
        );
    }

    if (accountsQuery.isError) {
        return (
            <Page
                title="Editar deuda"
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
    const accountOptions = ensureCurrentAccountOption(
        toDebtAccountOptions(accounts),
        debtQuery.data
    );
    const currencyOptions = ensureCurrentCurrencyOption(
        toDebtCurrencyOptions(accounts),
        debtQuery.data
    );

    if (currencyOptions.length === 0) {
        return (
            <Page
                title="Editar deuda"
                subtitle="No hay monedas disponibles para editar esta deuda."
            >
                <Stack spacing={2}>
                    <Alert severity="info">
                        Primero crea una cuenta para que el workspace tenga monedas disponibles.
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

    const submitErrorMessage = updateDebtMutation.isError
        ? getDebtErrorMessage(
            updateDebtMutation.error,
            "No se pudo actualizar la deuda."
        )
        : null;

    const initialValues = toDebtFormValues(debtQuery.data);

    const handleSubmit = (values: DebtFormValues) => {
        const payload = toUpdateDebtPayload(values);

        updateDebtMutation.mutate(
            {
                workspaceId,
                debtId,
                payload,
            },
            {
                onSuccess: () => {
                    navigate(debtsBasePath);
                },
            }
        );
    };

    const handleCancel = () => {
        navigate(debtsBasePath);
    };

    return (
        <Page
            title="Editar deuda"
            subtitle="Actualiza la información, estado y visibilidad de la deuda."
        >
            <DebtForm
                mode="edit"
                workspaceId={workspaceId}
                initialValues={initialValues}
                accountOptions={accountOptions}
                currencyOptions={currencyOptions}
                isSubmitting={updateDebtMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
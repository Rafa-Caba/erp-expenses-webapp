// src/features/cards/pages/NewCardPage.tsx

import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { useAccountsQuery } from "../../accounts/hooks/useAccountsQuery";
import type { AccountRecord, AccountType } from "../../accounts/types/account.types";
import { useCreateCardMutation } from "../hooks/useCardMutations";
import {
    CardForm,
    type CardAccountOption,
    type CardFormValues,
} from "../components/CardForm";
import type { CreateCardPayload } from "../types/card.types";
import type { AxiosLikeError } from "../../../shared/types/api.types";

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

function toCardAccountOptions(accounts: AccountRecord[]): CardAccountOption[] {
    return accounts.map((account: AccountRecord) => ({
        id: account.id,
        label: account.name,
        secondaryLabel: `${getAccountTypeLabel(account.type)} • ${account.currency}`,
    }));
}

function parseOptionalNumber(value: string): number | undefined {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return undefined;
    }

    return Number(trimmedValue);
}

function toCreateCardPayload(values: CardFormValues): CreateCardPayload {
    return {
        accountId: values.accountId,
        holderMemberId: values.holderMemberId.trim() || undefined,
        name: values.name.trim(),
        type: values.type,
        brand: values.brand.trim() || undefined,
        last4: values.last4.trim(),
        creditLimit: values.type === "credit" ? parseOptionalNumber(values.creditLimit) : undefined,
        closingDay: values.type === "credit" ? parseOptionalNumber(values.closingDay) : undefined,
        dueDay: values.type === "credit" ? parseOptionalNumber(values.dueDay) : undefined,
        notes: values.notes.trim() || undefined,
        isActive: values.isActive,
        isArchived: values.isArchived,
        isVisible: values.isVisible,
    };
}

function getCardErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    const typedError = error as AxiosLikeError;
    const apiMessage = typedError.response?.data?.message;

    if (typeof apiMessage === "string" && apiMessage.trim().length > 0) {
        return apiMessage;
    }

    if (error.message.trim().length > 0) {
        return error.message;
    }

    return fallbackMessage;
}

export function NewCardPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const createCardMutation = useCreateCardMutation();
    const accountsQuery = useAccountsQuery(workspaceId);

    if (!workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const scopeBasePath = getScopeBasePath(scopeType, workspaceId);
    const cardsBasePath = `${scopeBasePath}/cards`;
    const accountsBasePath = `${scopeBasePath}/accounts`;

    if (accountsQuery.isLoading) {
        return (
            <Page
                title="Nueva tarjeta"
                subtitle="Cargando cuentas disponibles para relacionar la tarjeta."
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
                title="Nueva tarjeta"
                subtitle="No fue posible cargar las cuentas disponibles."
            >
                <Alert severity="error">
                    {getCardErrorMessage(
                        accountsQuery.error,
                        "No se pudieron obtener las cuentas."
                    )}
                </Alert>
            </Page>
        );
    }

    const accounts = accountsQuery.data?.accounts ?? [];
    const accountOptions = toCardAccountOptions(accounts);

    if (accountOptions.length === 0) {
        return (
            <Page
                title="Nueva tarjeta"
                subtitle="Necesitas al menos una cuenta para registrar una tarjeta."
            >
                <Stack spacing={2}>
                    <Alert severity="info">
                        Primero crea una cuenta y después podrás registrar tarjetas asociadas.
                    </Alert>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Button
                            variant="contained"
                            onClick={() => navigate(`${accountsBasePath}/new`)}
                        >
                            Crear cuenta
                        </Button>

                        <Button variant="outlined" onClick={() => navigate(cardsBasePath)}>
                            Volver a tarjetas
                        </Button>
                    </Stack>
                </Stack>
            </Page>
        );
    }

    const initialValues: CardFormValues = {
        accountId: accountOptions[0].id,
        holderMemberId: "",
        name: "",
        type: "debit",
        brand: "",
        last4: "",
        creditLimit: "",
        closingDay: "",
        dueDay: "",
        notes: "",
        isActive: true,
        isArchived: false,
        isVisible: true,
    };

    const submitErrorMessage = createCardMutation.isError
        ? getCardErrorMessage(createCardMutation.error, "No se pudo crear la tarjeta.")
        : null;

    const handleSubmit = React.useCallback(
        (values: CardFormValues) => {
            const payload = toCreateCardPayload(values);

            createCardMutation.mutate(
                {
                    workspaceId,
                    payload,
                },
                {
                    onSuccess: () => {
                        navigate(cardsBasePath);
                    },
                }
            );
        },
        [cardsBasePath, createCardMutation, navigate, workspaceId]
    );

    const handleCancel = React.useCallback(() => {
        navigate(cardsBasePath);
    }, [cardsBasePath, navigate]);

    return (
        <Page
            title="Nueva tarjeta"
            subtitle="Agrega una nueva tarjeta de débito o crédito al workspace activo."
        >
            <CardForm
                mode="create"
                workspaceId={workspaceId}
                initialValues={initialValues}
                accountOptions={accountOptions}
                isSubmitting={createCardMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
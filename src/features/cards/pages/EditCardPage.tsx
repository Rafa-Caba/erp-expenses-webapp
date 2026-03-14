// src/features/cards/pages/EditCardPage.tsx

import { Navigate, useNavigate, useParams } from "react-router-dom";
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
import { useCardByIdQuery } from "../hooks/useCardByIdQuery";
import { useUpdateCardMutation } from "../hooks/useCardMutations";
import {
    CardForm,
    type CardAccountOption,
    type CardFormValues,
} from "../components/CardForm";
import type { CardRecord, UpdateCardPayload } from "../types/card.types";
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

function ensureCurrentAccountOption(
    options: CardAccountOption[],
    card: CardRecord
): CardAccountOption[] {
    const alreadyExists = options.some((option: CardAccountOption) => option.id === card.accountId);

    if (alreadyExists) {
        return options;
    }

    return [
        {
            id: card.accountId,
            label: `Cuenta actual (${card.accountId})`,
            secondaryLabel: "No visible en la lista actual",
        },
        ...options,
    ];
}

function toCardFormValues(card: CardRecord): CardFormValues {
    return {
        accountId: card.accountId,
        holderMemberId: card.holderMemberId ?? "",
        name: card.name,
        type: card.type,
        brand: card.brand ?? "",
        last4: card.last4,
        creditLimit: card.creditLimit !== null ? String(card.creditLimit) : "",
        closingDay: card.closingDay !== null ? String(card.closingDay) : "",
        dueDay: card.dueDay !== null ? String(card.dueDay) : "",
        notes: card.notes ?? "",
        isActive: card.isActive,
        isArchived: card.isArchived,
        isVisible: card.isVisible,
    };
}

function parseOptionalNumber(value: string): number | undefined {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return undefined;
    }

    return Number(trimmedValue);
}

function toUpdateCardPayload(values: CardFormValues): UpdateCardPayload {
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

export function EditCardPage() {
    const navigate = useNavigate();
    const params = useParams<{ cardId: string }>();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const cardId = params.cardId ?? null;

    const cardQuery = useCardByIdQuery(workspaceId, cardId);
    const accountsQuery = useAccountsQuery(workspaceId);
    const updateCardMutation = useUpdateCardMutation();

    if (!workspaceId || !cardId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const scopeBasePath = getScopeBasePath(scopeType, workspaceId);
    const cardsBasePath = `${scopeBasePath}/cards`;
    const accountsBasePath = `${scopeBasePath}/accounts`;

    if (cardQuery.isLoading || accountsQuery.isLoading) {
        return (
            <Page
                title="Editar tarjeta"
                subtitle="Cargando la información actual de la tarjeta."
            >
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando tarjeta…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo los datos actuales de la tarjeta y las cuentas
                                disponibles.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (cardQuery.isError || !cardQuery.data) {
        return (
            <Page title="Editar tarjeta" subtitle="No fue posible cargar la tarjeta.">
                <Alert severity="error">
                    {getCardErrorMessage(cardQuery.error, "No se pudo obtener la tarjeta.")}
                </Alert>
            </Page>
        );
    }

    if (accountsQuery.isError) {
        return (
            <Page
                title="Editar tarjeta"
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
    const accountOptions = ensureCurrentAccountOption(
        toCardAccountOptions(accounts),
        cardQuery.data
    );

    if (accountOptions.length === 0) {
        return (
            <Page
                title="Editar tarjeta"
                subtitle="No hay cuentas disponibles para relacionar esta tarjeta."
            >
                <Stack spacing={2}>
                    <Alert severity="info">
                        Necesitas al menos una cuenta disponible para editar la relación de esta
                        tarjeta.
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

    const submitErrorMessage = updateCardMutation.isError
        ? getCardErrorMessage(updateCardMutation.error, "No se pudo actualizar la tarjeta.")
        : null;

    const initialValues = toCardFormValues(cardQuery.data);

    const handleSubmit = (values: CardFormValues) => {
        const payload = toUpdateCardPayload(values);

        updateCardMutation.mutate(
            {
                workspaceId,
                cardId,
                payload,
            },
            {
                onSuccess: () => {
                    navigate(cardsBasePath);
                },
            }
        );
    };

    const handleCancel = () => {
        navigate(cardsBasePath);
    };

    return (
        <Page
            title="Editar tarjeta"
            subtitle="Actualiza la configuración, relación de cuenta y estado de la tarjeta."
        >
            <CardForm
                mode="edit"
                workspaceId={workspaceId}
                initialValues={initialValues}
                accountOptions={accountOptions}
                isSubmitting={updateCardMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
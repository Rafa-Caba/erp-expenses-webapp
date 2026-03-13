// src/features/accounts/pages/EditAccountPage.tsx

import { Navigate, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { useAccountByIdQuery } from "../hooks/useAccountByIdQuery";
import { useUpdateAccountMutation } from "../hooks/useAccountMutations";
import { AccountForm, type AccountFormValues } from "../components/AccountForm";
import type { AccountRecord, UpdateAccountPayload } from "../types/account.types";

function getAccountsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/accounts";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/accounts`;
}

function toAccountFormValues(account: AccountRecord): AccountFormValues {
    return {
        ownerMemberId: account.ownerMemberId ?? "",
        name: account.name,
        type: account.type,
        bankName: account.bankName ?? "",
        accountNumberMasked: account.accountNumberMasked ?? "",
        currency: account.currency,
        initialBalance: String(account.initialBalance),
        currentBalance: String(account.currentBalance),
        creditLimit: account.creditLimit !== null ? String(account.creditLimit) : "",
        statementClosingDay:
            account.statementClosingDay !== null ? String(account.statementClosingDay) : "",
        paymentDueDay: account.paymentDueDay !== null ? String(account.paymentDueDay) : "",
        notes: account.notes ?? "",
        isActive: account.isActive,
        isArchived: account.isArchived,
        isVisible: account.isVisible,
    };
}

function parseOptionalNumber(value: string): number | undefined {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return undefined;
    }

    return Number(trimmedValue);
}

function toUpdateAccountPayload(values: AccountFormValues): UpdateAccountPayload {
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

export function EditAccountPage() {
    const navigate = useNavigate();
    const params = useParams<{ accountId: string }>();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const accountId = params.accountId ?? null;

    const accountQuery = useAccountByIdQuery(workspaceId, accountId);
    const updateAccountMutation = useUpdateAccountMutation();

    if (!workspaceId || !accountId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const accountsBasePath = getAccountsBasePath(scopeType, workspaceId);

    if (accountQuery.isLoading) {
        return (
            <Page
                title="Editar cuenta"
                subtitle="Cargando la información actual de la cuenta."
            >
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando cuenta…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo los datos actuales de la cuenta.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (accountQuery.isError || !accountQuery.data) {
        return (
            <Page
                title="Editar cuenta"
                subtitle="No fue posible cargar la cuenta."
            >
                <Alert severity="error">
                    {getAccountErrorMessage(accountQuery.error, "No se pudo obtener la cuenta.")}
                </Alert>
            </Page>
        );
    }

    const submitErrorMessage = updateAccountMutation.isError
        ? getAccountErrorMessage(updateAccountMutation.error, "No se pudo actualizar la cuenta.")
        : null;

    const initialValues = toAccountFormValues(accountQuery.data);

    const handleSubmit = (values: AccountFormValues) => {
        const payload = toUpdateAccountPayload(values);

        updateAccountMutation.mutate(
            {
                workspaceId,
                accountId,
                payload,
            },
            {
                onSuccess: () => {
                    navigate(accountsBasePath);
                },
            }
        );
    };

    const handleCancel = () => {
        navigate(accountsBasePath);
    };

    return (
        <Page
            title="Editar cuenta"
            subtitle="Actualiza la configuración, saldo y estado de la cuenta."
        >
            <AccountForm
                mode="edit"
                initialValues={initialValues}
                isSubmitting={updateAccountMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
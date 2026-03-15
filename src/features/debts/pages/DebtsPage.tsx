// src/features/debts/pages/DebtsPage.tsx

import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { useAccountsQuery } from "../../accounts/hooks/useAccountsQuery";
import type { AccountRecord } from "../../accounts/types/account.types";
import { useWorkspaceMembersQuery } from "../../workspaces/hooks/useWorkspaceMembersQuery";
import { DebtCard } from "../components/DebtCard";
import { DebtsEmptyState } from "../components/DebtsEmptyState";
import { DebtsToolbar } from "../components/DebtsToolbar";
import { useDeleteDebtMutation } from "../hooks/useDebtMutations";
import { useDebtsQuery } from "../hooks/useDebtsQuery";
import { useDebtStore } from "../store/debt.store";
import type { DebtRecord } from "../types/debt.types";

type ApiErrorResponse = {
    code?: string;
    message?: string;
};

function getDebtsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/debts";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/debts`;
}

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
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

function getSortableDateValue(value: string | null): number {
    if (!value) {
        return Number.MAX_SAFE_INTEGER;
    }

    const timestamp = new Date(value).getTime();

    if (Number.isNaN(timestamp)) {
        return Number.MAX_SAFE_INTEGER;
    }

    return timestamp;
}

export function DebtsPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const searchTerm = useDebtStore((state) => state.searchTerm);
    const typeFilter = useDebtStore((state) => state.typeFilter);
    const statusFilter = useDebtStore((state) => state.statusFilter);
    const includeHidden = useDebtStore((state) => state.includeHidden);
    const selectedDebtId = useDebtStore((state) => state.selectedDebtId);

    const setSearchTerm = useDebtStore((state) => state.setSearchTerm);
    const setTypeFilter = useDebtStore((state) => state.setTypeFilter);
    const setStatusFilter = useDebtStore((state) => state.setStatusFilter);
    const setIncludeHidden = useDebtStore((state) => state.setIncludeHidden);
    const setSelectedDebtId = useDebtStore((state) => state.setSelectedDebtId);
    const resetDebtUi = useDebtStore((state) => state.reset);

    const debtsQuery = useDebtsQuery(workspaceId);
    const accountsQuery = useAccountsQuery(workspaceId);
    const membersQuery = useWorkspaceMembersQuery(workspaceId);
    const deleteDebtMutation = useDeleteDebtMutation();

    const debtsBasePath = getDebtsBasePath(scopeType, workspaceId);

    const accountLookup = React.useMemo(() => {
        const accounts = accountsQuery.data?.accounts ?? [];

        return new Map<string, AccountRecord>(
            accounts.map((account: AccountRecord) => [account.id, account])
        );
    }, [accountsQuery.data?.accounts]);

    const memberLookup = React.useMemo(() => {
        const members = membersQuery.data?.members ?? [];

        return new Map<string, string>(
            members.map((member) => [member.id, member.displayName])
        );
    }, [membersQuery.data?.members]);

    const filteredDebts = React.useMemo(() => {
        const debts = [...(debtsQuery.data?.debts ?? [])];
        const normalizedSearchTerm = normalizeText(searchTerm);

        return debts
            .filter((debt: DebtRecord) => {
                if (!includeHidden && !debt.isVisible) {
                    return false;
                }

                if (typeFilter !== "ALL" && debt.type !== typeFilter) {
                    return false;
                }

                if (statusFilter !== "ALL" && debt.status !== statusFilter) {
                    return false;
                }

                if (!normalizedSearchTerm) {
                    return true;
                }

                const accountName = debt.relatedAccountId
                    ? accountLookup.get(debt.relatedAccountId)?.name ?? ""
                    : "";

                const memberName = debt.memberId
                    ? memberLookup.get(debt.memberId) ?? ""
                    : "";

                const searchableText = [
                    debt.personName,
                    debt.personContact ?? "",
                    debt.description,
                    debt.notes ?? "",
                    debt.currency,
                    debt.status,
                    debt.type,
                    accountName,
                    memberName,
                ]
                    .join(" ")
                    .toLocaleLowerCase();

                return searchableText.includes(normalizedSearchTerm);
            })
            .sort((leftDebt, rightDebt) => {
                const leftDueDate = getSortableDateValue(leftDebt.dueDate);
                const rightDueDate = getSortableDateValue(rightDebt.dueDate);

                if (leftDueDate !== rightDueDate) {
                    return leftDueDate - rightDueDate;
                }

                return (
                    new Date(rightDebt.startDate).getTime() -
                    new Date(leftDebt.startDate).getTime()
                );
            });
    }, [
        accountLookup,
        debtsQuery.data?.debts,
        includeHidden,
        memberLookup,
        searchTerm,
        statusFilter,
        typeFilter,
    ]);

    const hasFilters =
        searchTerm.trim().length > 0 ||
        typeFilter !== "ALL" ||
        statusFilter !== "ALL" ||
        includeHidden;

    const handleResetFilters = React.useCallback(() => {
        resetDebtUi();
    }, [resetDebtUi]);

    const handleEditDebt = React.useCallback(
        (debt: DebtRecord) => {
            setSelectedDebtId(debt._id);
            navigate(`${debtsBasePath}/${debt._id}/edit`);
        },
        [debtsBasePath, navigate, setSelectedDebtId]
    );

    const handleDeleteDebt = React.useCallback(
        (debt: DebtRecord) => {
            if (!workspaceId) {
                return;
            }

            const confirmed = window.confirm(
                `¿Seguro que deseas eliminar la deuda de "${debt.personName}"?`
            );

            if (!confirmed) {
                return;
            }

            setSelectedDebtId(debt._id);

            deleteDebtMutation.mutate({
                workspaceId,
                debtId: debt._id,
            });
        },
        [deleteDebtMutation, setSelectedDebtId, workspaceId]
    );

    if (!workspaceId) {
        return (
            <Page title="Deudas" subtitle="Resolviendo el workspace activo.">
                <Alert severity="info">
                    Aún estamos resolviendo el contexto activo del workspace.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Deudas"
            subtitle="Administra deudas por pagar y por cobrar dentro del workspace activo."
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
            >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Aquí administras compromisos pendientes, deudas liquidadas, vencidas o canceladas, con opción de asociarlas a miembros y cuentas.
                </Typography>

                <Button variant="contained" onClick={() => navigate(`${debtsBasePath}/new`)}>
                    Nueva deuda
                </Button>
            </Stack>

            <DebtsToolbar
                searchTerm={searchTerm}
                typeFilter={typeFilter}
                statusFilter={statusFilter}
                includeHidden={includeHidden}
                totalCount={filteredDebts.length}
                onSearchTermChange={setSearchTerm}
                onTypeFilterChange={setTypeFilter}
                onStatusFilterChange={setStatusFilter}
                onIncludeHiddenChange={setIncludeHidden}
                onResetFilters={handleResetFilters}
            />

            {deleteDebtMutation.isError ? (
                <Alert severity="error">
                    {getDebtErrorMessage(
                        deleteDebtMutation.error,
                        "No se pudo eliminar la deuda."
                    )}
                </Alert>
            ) : null}

            {debtsQuery.isLoading ? (
                <Box
                    sx={{
                        minHeight: 320,
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando deudas…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo deudas del workspace activo.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            ) : null}

            {!debtsQuery.isLoading && debtsQuery.isError ? (
                <Alert severity="error">
                    {getDebtErrorMessage(
                        debtsQuery.error,
                        "No se pudieron cargar las deudas."
                    )}
                </Alert>
            ) : null}

            {!debtsQuery.isLoading &&
                !debtsQuery.isError &&
                filteredDebts.length === 0 ? (
                <DebtsEmptyState
                    hasFilters={hasFilters}
                    onClearFilters={handleResetFilters}
                />
            ) : null}

            {!debtsQuery.isLoading &&
                !debtsQuery.isError &&
                filteredDebts.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredDebts.map((debt: DebtRecord) => (
                        <Grid key={debt._id} size={{ xs: 12, md: 6, xl: 4 }}>
                            <DebtCard
                                debt={debt}
                                memberName={
                                    debt.memberId ? memberLookup.get(debt.memberId) ?? null : null
                                }
                                accountName={
                                    debt.relatedAccountId
                                        ? accountLookup.get(debt.relatedAccountId)?.name ?? null
                                        : null
                                }
                                isSelected={selectedDebtId === debt._id}
                                onEdit={handleEditDebt}
                                onDelete={handleDeleteDebt}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : null}
        </Page>
    );
}
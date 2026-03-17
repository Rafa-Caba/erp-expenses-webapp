// src/features/accounts/pages/AccountsPage.tsx

import React from "react";
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
import { useArchiveAccountMutation } from "../hooks/useAccountMutations";
import { useAccountsQuery } from "../hooks/useAccountsQuery";
import { useAccountStore } from "../store/account.store";
import type { AccountRecord } from "../types/account.types";
import { AccountCard } from "../components/AccountCard";
import { AccountsEmptyState } from "../components/AccountsEmptyState";
import { AccountsToolbar } from "../components/AccountsToolbar";

function getAccountsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/accounts";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/accounts`;
}

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function getAccountErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

export function AccountsPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const searchTerm = useAccountStore((state) => state.searchTerm);
    const typeFilter = useAccountStore((state) => state.typeFilter);
    const includeArchived = useAccountStore((state) => state.includeArchived);
    const includeInactive = useAccountStore((state) => state.includeInactive);
    const includeHidden = useAccountStore((state) => state.includeHidden);
    const selectedAccountId = useAccountStore((state) => state.selectedAccountId);

    const setSearchTerm = useAccountStore((state) => state.setSearchTerm);
    const setTypeFilter = useAccountStore((state) => state.setTypeFilter);
    const setIncludeArchived = useAccountStore((state) => state.setIncludeArchived);
    const setIncludeInactive = useAccountStore((state) => state.setIncludeInactive);
    const setIncludeHidden = useAccountStore((state) => state.setIncludeHidden);
    const setSelectedAccountId = useAccountStore((state) => state.setSelectedAccountId);
    const resetAccountUi = useAccountStore((state) => state.reset);

    const accountsQuery = useAccountsQuery(workspaceId);
    const archiveAccountMutation = useArchiveAccountMutation();

    const accountsBasePath = getAccountsBasePath(scopeType, workspaceId);

    const filteredAccounts = React.useMemo(() => {
        const accounts = accountsQuery.data?.accounts ?? [];
        const normalizedSearchTerm = normalizeText(searchTerm);

        return accounts.filter((account: AccountRecord) => {
            if (!includeArchived && account.isArchived) {
                return false;
            }

            if (!includeInactive && !account.isActive) {
                return false;
            }

            if (!includeHidden && !account.isVisible) {
                return false;
            }

            if (typeFilter !== "ALL" && account.type !== typeFilter) {
                return false;
            }

            if (!normalizedSearchTerm) {
                return true;
            }

            const searchableText = [
                account.name,
                account.type,
                account.bankName ?? "",
                account.accountNumberMasked ?? "",
                account.notes ?? "",
                account.ownerMemberId ?? "",
                account.currency,
            ]
                .join(" ")
                .toLocaleLowerCase();

            return searchableText.includes(normalizedSearchTerm);
        });
    }, [
        accountsQuery.data?.accounts,
        includeArchived,
        includeHidden,
        includeInactive,
        searchTerm,
        typeFilter,
    ]);

    const hasFilters =
        searchTerm.trim().length > 0 ||
        typeFilter !== "ALL" ||
        includeArchived ||
        includeInactive ||
        includeHidden;

    const handleResetFilters = React.useCallback(() => {
        resetAccountUi();
    }, [resetAccountUi]);

    const handleEditAccount = React.useCallback(
        (account: AccountRecord) => {
            setSelectedAccountId(account.id);
            navigate(`${accountsBasePath}/${account.id}/edit`);
        },
        [accountsBasePath, navigate, setSelectedAccountId]
    );

    const handleArchiveAccount = React.useCallback(
        (account: AccountRecord) => {
            if (!workspaceId) {
                return;
            }

            const confirmed = window.confirm(
                `¿Seguro que deseas archivar la cuenta "${account.name}"?`
            );

            if (!confirmed) {
                return;
            }

            setSelectedAccountId(account.id);

            archiveAccountMutation.mutate({
                workspaceId,
                accountId: account.id,
            });
        },
        [archiveAccountMutation, setSelectedAccountId, workspaceId]
    );

    if (!workspaceId) {
        return (
            <Page
                title="Cuentas"
                subtitle="Resolviendo el workspace activo."
            >
                <Alert severity="info">
                    Aún estamos resolviendo el contexto activo del workspace.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Cuentas"
            subtitle="Administra cuentas, wallets, bancos, ahorros y crédito del workspace activo."
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
            >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Aquí administras los contenedores financieros sobre los que luego vivirán transacciones, balances y conciliación.
                </Typography>

                <Button variant="contained" onClick={() => navigate(`${accountsBasePath}/new`)}>
                    Nueva cuenta
                </Button>
            </Stack>

            <AccountsToolbar
                searchTerm={searchTerm}
                typeFilter={typeFilter}
                includeArchived={includeArchived}
                includeInactive={includeInactive}
                includeHidden={includeHidden}
                totalCount={filteredAccounts.length}
                onSearchTermChange={setSearchTerm}
                onTypeFilterChange={setTypeFilter}
                onIncludeArchivedChange={setIncludeArchived}
                onIncludeInactiveChange={setIncludeInactive}
                onIncludeHiddenChange={setIncludeHidden}
                onResetFilters={handleResetFilters}
            />

            {archiveAccountMutation.isError ? (
                <Alert severity="error">
                    {getAccountErrorMessage(
                        archiveAccountMutation.error,
                        "No se pudo archivar la cuenta."
                    )}
                </Alert>
            ) : null}

            {accountsQuery.isLoading ? (
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
                                Cargando cuentas…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo cuentas del workspace activo.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            ) : null}

            {!accountsQuery.isLoading && accountsQuery.isError ? (
                <Alert severity="error">
                    {getAccountErrorMessage(
                        accountsQuery.error,
                        "No se pudieron cargar las cuentas."
                    )}
                </Alert>
            ) : null}

            {!accountsQuery.isLoading &&
                !accountsQuery.isError &&
                filteredAccounts.length === 0 ? (
                <AccountsEmptyState
                    hasFilters={hasFilters}
                    onClearFilters={handleResetFilters}
                />
            ) : null}

            {!accountsQuery.isLoading &&
                !accountsQuery.isError &&
                filteredAccounts.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredAccounts.map((account: AccountRecord) => (
                        <Grid key={account.id} size={{ xs: 12, md: 6, xl: 4 }}>
                            <AccountCard
                                workspaceId={workspaceId}
                                account={account}
                                isSelected={selectedAccountId === account.id}
                                onEdit={handleEditAccount}
                                onArchive={handleArchiveAccount}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : null}
        </Page>
    );
}
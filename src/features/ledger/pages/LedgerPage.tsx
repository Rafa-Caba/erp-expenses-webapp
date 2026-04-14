// src/features/ledger/pages/LedgerPage.tsx

import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useScopeStore } from "../../../app/scope/scope.store";
import { Page } from "../../../shared/ui/Page/Page";
import { LedgerEmptyState } from "../components/LedgerEmptyState";
import { LedgerFilters } from "../components/LedgerFilters";
import { LedgerSummaryCards } from "../components/LedgerSummaryCards";
import { LedgerTable } from "../components/LedgerTable";
import { useLedgerQuery } from "../hooks/useLedgerQuery";
import { buildLedgerView } from "../services/ledger.service";
import { useLedgerStore } from "../store/ledger.store";
import type { LedgerFilters as LedgerFiltersType } from "../types/ledger.types";

function getLedgerErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message.trim().length > 0 ? error.message : fallbackMessage;
}

export function LedgerPage() {
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const searchTerm = useLedgerStore((state) => state.searchTerm);
    const accountId = useLedgerStore((state) => state.accountId);
    const memberId = useLedgerStore((state) => state.memberId);
    const categoryId = useLedgerStore((state) => state.categoryId);
    const currency = useLedgerStore((state) => state.currency);
    const typeFilter = useLedgerStore((state) => state.typeFilter);
    const statusFilter = useLedgerStore((state) => state.statusFilter);
    const directionFilter = useLedgerStore((state) => state.directionFilter);
    const sortOrder = useLedgerStore((state) => state.sortOrder);
    const includeHidden = useLedgerStore((state) => state.includeHidden);
    const includeArchived = useLedgerStore((state) => state.includeArchived);
    const includeInactive = useLedgerStore((state) => state.includeInactive);
    const onlyRecurring = useLedgerStore((state) => state.onlyRecurring);
    const dateFrom = useLedgerStore((state) => state.dateFrom);
    const dateTo = useLedgerStore((state) => state.dateTo);
    const selectedEntryId = useLedgerStore((state) => state.selectedEntryId);

    const setSearchTerm = useLedgerStore((state) => state.setSearchTerm);
    const setAccountId = useLedgerStore((state) => state.setAccountId);
    const setMemberId = useLedgerStore((state) => state.setMemberId);
    const setCategoryId = useLedgerStore((state) => state.setCategoryId);
    const setCurrency = useLedgerStore((state) => state.setCurrency);
    const setTypeFilter = useLedgerStore((state) => state.setTypeFilter);
    const setStatusFilter = useLedgerStore((state) => state.setStatusFilter);
    const setDirectionFilter = useLedgerStore((state) => state.setDirectionFilter);
    const setSortOrder = useLedgerStore((state) => state.setSortOrder);
    const setIncludeHidden = useLedgerStore((state) => state.setIncludeHidden);
    const setIncludeArchived = useLedgerStore((state) => state.setIncludeArchived);
    const setIncludeInactive = useLedgerStore((state) => state.setIncludeInactive);
    const setOnlyRecurring = useLedgerStore((state) => state.setOnlyRecurring);
    const setDateFrom = useLedgerStore((state) => state.setDateFrom);
    const setDateTo = useLedgerStore((state) => state.setDateTo);
    const setSelectedEntryId = useLedgerStore((state) => state.setSelectedEntryId);
    const resetLedgerUi = useLedgerStore((state) => state.reset);

    const ledgerQuery = useLedgerQuery(workspaceId);

    const filters = React.useMemo<LedgerFiltersType>(
        () => ({
            searchTerm,
            accountId,
            memberId,
            categoryId,
            currency,
            typeFilter,
            statusFilter,
            directionFilter,
            sortOrder,
            includeHidden,
            includeArchived,
            includeInactive,
            onlyRecurring,
            dateFrom,
            dateTo,
        }),
        [
            searchTerm,
            accountId,
            memberId,
            categoryId,
            currency,
            typeFilter,
            statusFilter,
            directionFilter,
            sortOrder,
            includeHidden,
            includeArchived,
            includeInactive,
            onlyRecurring,
            dateFrom,
            dateTo,
        ]
    );

    const ledgerView = React.useMemo(() => {
        if (!ledgerQuery.data) {
            return null;
        }

        return buildLedgerView(ledgerQuery.data, filters);
    }, [filters, ledgerQuery.data]);

    if (!workspaceId) {
        return (
            <Page title="Ledger" subtitle="Resolviendo el workspace activo.">
                <Alert severity="info">
                    Aún estamos resolviendo el contexto activo del workspace.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Ledger"
            subtitle="Libro mayor del workspace activo con filtros, acumulados y desglose por renglón."
        >
            <Stack
                spacing={2}
                sx={{
                    minWidth: 0,
                    width: "100%",
                    overflowX: "hidden",
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        opacity: 0.8,
                        minWidth: 0,
                        wordBreak: "break-word",
                    }}
                >
                    Esta vista se construye a partir de transacciones, cuentas,
                    categorías y miembros. Las transferencias se desdoblan en entrada
                    y salida para que el libro sea más claro.
                </Typography>

                <LedgerFilters
                    workspaceId={workspaceId}
                    searchTerm={searchTerm}
                    accountId={accountId}
                    memberId={memberId}
                    categoryId={categoryId}
                    currency={currency}
                    typeFilter={typeFilter}
                    statusFilter={statusFilter}
                    directionFilter={directionFilter}
                    sortOrder={sortOrder}
                    includeHidden={includeHidden}
                    includeArchived={includeArchived}
                    includeInactive={includeInactive}
                    onlyRecurring={onlyRecurring}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    totalCount={ledgerView?.filteredRows.length ?? 0}
                    onSearchTermChange={setSearchTerm}
                    onAccountIdChange={setAccountId}
                    onMemberIdChange={setMemberId}
                    onCategoryIdChange={setCategoryId}
                    onCurrencyChange={setCurrency}
                    onTypeFilterChange={setTypeFilter}
                    onStatusFilterChange={setStatusFilter}
                    onDirectionFilterChange={setDirectionFilter}
                    onSortOrderChange={setSortOrder}
                    onIncludeHiddenChange={setIncludeHidden}
                    onIncludeArchivedChange={setIncludeArchived}
                    onIncludeInactiveChange={setIncludeInactive}
                    onOnlyRecurringChange={setOnlyRecurring}
                    onDateFromChange={setDateFrom}
                    onDateToChange={setDateTo}
                    onResetFilters={resetLedgerUi}
                />

                {ledgerQuery.isLoading ? (
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
                                    Cargando ledger…
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Obteniendo transacciones, cuentas, categorías y miembros.
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                ) : null}

                {!ledgerQuery.isLoading && ledgerQuery.isError ? (
                    <Alert severity="error">
                        {getLedgerErrorMessage(
                            ledgerQuery.error,
                            "No se pudo construir el ledger del workspace activo."
                        )}
                    </Alert>
                ) : null}

                {!ledgerQuery.isLoading && !ledgerQuery.isError && ledgerView ? (
                    <>
                        <LedgerSummaryCards
                            summary={ledgerView.summary}
                            currency={currency}
                            balanceLabel={
                                ledgerView.singleAccountMode
                                    ? `Cambio neto · ${ledgerView.selectedAccountName ?? "Cuenta"}`
                                    : "Cambio neto de vista"
                            }
                        />

                        <Alert severity={ledgerView.singleAccountMode ? "info" : "warning"}>
                            {ledgerView.singleAccountMode
                                ? `El acumulado inicia desde el balance inicial de la cuenta ${ledgerView.selectedAccountName ?? "seleccionada"
                                } y avanza con los renglones visibles del ledger.`
                                : "Sin filtro de cuenta, el acumulado representa el neto progresivo de la vista filtrada, no el saldo real de una cuenta específica."}
                        </Alert>

                        {ledgerView.filteredRows.length === 0 ? (
                            <LedgerEmptyState
                                hasFilters={ledgerView.hasActiveFilters}
                                onClearFilters={resetLedgerUi}
                            />
                        ) : (
                            <Box
                                sx={{
                                    minWidth: 0,
                                    width: "100%",
                                    overflowX: "hidden",
                                }}
                            >
                                <LedgerTable
                                    rows={ledgerView.filteredRows}
                                    selectedEntryId={selectedEntryId}
                                    onSelectEntry={setSelectedEntryId}
                                />
                            </Box>
                        )}
                    </>
                ) : null}
            </Stack>
        </Page>
    );
}
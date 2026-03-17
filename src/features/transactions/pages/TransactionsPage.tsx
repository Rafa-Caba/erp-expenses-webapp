// src/features/transactions/pages/TransactionsPage.tsx

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
import { TransactionCard } from "../components/TransactionCard";
import { TransactionsEmptyState } from "../components/TransactionsEmptyState";
import { TransactionsToolbar } from "../components/TransactionsToolbar";
import { useArchiveTransactionMutation } from "../hooks/useTransactionMutations";
import { useTransactionsQuery } from "../hooks/useTransactionsQuery";
import { useTransactionStore } from "../store/transaction.store";
import type { TransactionRecord } from "../types/transaction.types";

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

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function getTransactionErrorMessage(
    error: Error | null,
    fallbackMessage: string
): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

function getSearchableText(transaction: TransactionRecord): string {
    return [
        transaction._id,
        transaction.description,
        transaction.merchant ?? "",
        transaction.reference ?? "",
        transaction.notes ?? "",
        transaction.memberId,
        transaction.accountId ?? "",
        transaction.destinationAccountId ?? "",
        transaction.cardId ?? "",
        transaction.categoryId ?? "",
        transaction.type,
        transaction.status,
        String(transaction.amount),
        transaction.currency,
        transaction.transactionDate,
    ]
        .join(" ")
        .toLocaleLowerCase();
}

export function TransactionsPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const searchTerm = useTransactionStore((state) => state.searchTerm);
    const typeFilter = useTransactionStore((state) => state.typeFilter);
    const statusFilter = useTransactionStore((state) => state.statusFilter);
    const includeHidden = useTransactionStore((state) => state.includeHidden);
    const selectedTransactionId = useTransactionStore(
        (state) => state.selectedTransactionId
    );

    const setSearchTerm = useTransactionStore((state) => state.setSearchTerm);
    const setTypeFilter = useTransactionStore((state) => state.setTypeFilter);
    const setStatusFilter = useTransactionStore((state) => state.setStatusFilter);
    const setIncludeHidden = useTransactionStore(
        (state) => state.setIncludeHidden
    );
    const setSelectedTransactionId = useTransactionStore(
        (state) => state.setSelectedTransactionId
    );
    const resetTransactionUi = useTransactionStore((state) => state.reset);

    const transactionsQuery = useTransactionsQuery(workspaceId);
    const archiveTransactionMutation = useArchiveTransactionMutation();

    const transactionsBasePath = getTransactionsBasePath(scopeType, workspaceId);

    const filteredTransactions = React.useMemo(() => {
        const transactions = transactionsQuery.data?.transactions ?? [];
        const normalizedSearchTerm = normalizeText(searchTerm);

        return [...transactions]
            .filter((transaction) => {
                if (!includeHidden && !transaction.isVisible) {
                    return false;
                }

                if (typeFilter !== "ALL" && transaction.type !== typeFilter) {
                    return false;
                }

                if (statusFilter !== "ALL" && transaction.status !== statusFilter) {
                    return false;
                }

                if (!normalizedSearchTerm) {
                    return true;
                }

                return getSearchableText(transaction).includes(normalizedSearchTerm);
            })
            .sort((left, right) => {
                const leftDate = new Date(left.transactionDate).getTime();
                const rightDate = new Date(right.transactionDate).getTime();

                return rightDate - leftDate;
            });
    }, [
        includeHidden,
        searchTerm,
        statusFilter,
        transactionsQuery.data?.transactions,
        typeFilter,
    ]);

    const hasFilters =
        searchTerm.trim().length > 0 ||
        typeFilter !== "ALL" ||
        statusFilter !== "ALL" ||
        includeHidden;

    const handleResetFilters = React.useCallback(() => {
        resetTransactionUi();
    }, [resetTransactionUi]);

    const handleEditTransaction = React.useCallback(
        (transaction: TransactionRecord) => {
            setSelectedTransactionId(transaction._id);
            navigate(`${transactionsBasePath}/${transaction._id}/edit`);
        },
        [navigate, setSelectedTransactionId, transactionsBasePath]
    );

    const handleArchiveTransaction = React.useCallback(
        (transaction: TransactionRecord) => {
            if (!workspaceId) {
                return;
            }

            const confirmed = window.confirm(
                `¿Seguro que deseas archivar la transacción "${transaction.description}"?`
            );

            if (!confirmed) {
                return;
            }

            setSelectedTransactionId(transaction._id);

            archiveTransactionMutation.mutate({
                workspaceId,
                transactionId: transaction._id,
            });
        },
        [archiveTransactionMutation, setSelectedTransactionId, workspaceId]
    );

    if (!workspaceId) {
        return (
            <Page title="Transacciones" subtitle="Resolviendo el workspace activo.">
                <Alert severity="info">
                    Aún estamos resolviendo el contexto activo del workspace.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Transacciones"
            subtitle="Administra movimientos de ingreso, gasto, transferencias y pagos de deuda."
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
            >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Aquí puedes registrar, editar y archivar transacciones del workspace activo.
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => navigate(`${transactionsBasePath}/new`)}
                >
                    Nueva transacción
                </Button>
            </Stack>

            <TransactionsToolbar
                searchTerm={searchTerm}
                typeFilter={typeFilter}
                statusFilter={statusFilter}
                includeHidden={includeHidden}
                totalCount={filteredTransactions.length}
                onSearchTermChange={setSearchTerm}
                onTypeFilterChange={setTypeFilter}
                onStatusFilterChange={setStatusFilter}
                onIncludeHiddenChange={setIncludeHidden}
                onResetFilters={handleResetFilters}
            />

            {archiveTransactionMutation.isError ? (
                <Alert severity="error">
                    {getTransactionErrorMessage(
                        archiveTransactionMutation.error,
                        "No se pudo archivar la transacción."
                    )}
                </Alert>
            ) : null}

            {transactionsQuery.isLoading ? (
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
                                Cargando transacciones…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo transacciones del workspace activo.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            ) : null}

            {!transactionsQuery.isLoading && transactionsQuery.isError ? (
                <Alert severity="error">
                    {getTransactionErrorMessage(
                        transactionsQuery.error,
                        "No se pudieron cargar las transacciones."
                    )}
                </Alert>
            ) : null}

            {!transactionsQuery.isLoading &&
                !transactionsQuery.isError &&
                filteredTransactions.length === 0 ? (
                <TransactionsEmptyState
                    hasFilters={hasFilters}
                    onClearFilters={handleResetFilters}
                />
            ) : null}

            {!transactionsQuery.isLoading &&
                !transactionsQuery.isError &&
                filteredTransactions.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredTransactions.map((transaction) => (
                        <Grid key={transaction._id} size={{ xs: 12, md: 6, xl: 4 }}>
                            <TransactionCard
                                transaction={transaction}
                                isSelected={selectedTransactionId === transaction._id}
                                onEdit={handleEditTransaction}
                                onArchive={handleArchiveTransaction}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : null}
        </Page>
    );
}
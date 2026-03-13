// src/features/budgets/pages/BudgetsPage.tsx

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
import { BudgetCard } from "../components/BudgetCard";
import { BudgetsEmptyState } from "../components/BudgetsEmptyState";
import { BudgetsToolbar } from "../components/BudgetsToolbar";
import { useDeleteBudgetMutation } from "../hooks/useBudgetMutations";
import { useBudgetStore } from "../store/budget.store";
import type { BudgetRecord } from "../types/budget.types";
import { useBudgetsQuery } from "../hooks/useBudgetsQuery";

function getBudgetsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/budgets";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/budgets`;
}

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function getEffectiveStatus(budget: BudgetRecord): BudgetRecord["computedStatus"] {
    return budget.computedStatus ?? budget.status;
}

function getBudgetErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

export function BudgetsPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const searchTerm = useBudgetStore((state) => state.searchTerm);
    const statusFilter = useBudgetStore((state) => state.statusFilter);
    const periodTypeFilter = useBudgetStore((state) => state.periodTypeFilter);
    const includeArchived = useBudgetStore((state) => state.includeArchived);
    const includeInactive = useBudgetStore((state) => state.includeInactive);
    const includeHidden = useBudgetStore((state) => state.includeHidden);
    const selectedBudgetId = useBudgetStore((state) => state.selectedBudgetId);

    const setSearchTerm = useBudgetStore((state) => state.setSearchTerm);
    const setStatusFilter = useBudgetStore((state) => state.setStatusFilter);
    const setPeriodTypeFilter = useBudgetStore((state) => state.setPeriodTypeFilter);
    const setIncludeArchived = useBudgetStore((state) => state.setIncludeArchived);
    const setIncludeInactive = useBudgetStore((state) => state.setIncludeInactive);
    const setIncludeHidden = useBudgetStore((state) => state.setIncludeHidden);
    const setSelectedBudgetId = useBudgetStore((state) => state.setSelectedBudgetId);
    const resetBudgetUi = useBudgetStore((state) => state.reset);

    const budgetsQuery = useBudgetsQuery(workspaceId);
    const deleteBudgetMutation = useDeleteBudgetMutation();

    const budgetsBasePath = getBudgetsBasePath(scopeType, workspaceId);

    const filteredBudgets = React.useMemo(() => {
        const budgets = budgetsQuery.data?.budgets ?? [];
        const normalizedSearchTerm = normalizeText(searchTerm);

        return budgets.filter((budget: BudgetRecord) => {
            const effectiveStatus = getEffectiveStatus(budget);

            if (!includeArchived && effectiveStatus === "archived") {
                return false;
            }

            if (!includeInactive && !budget.isActive) {
                return false;
            }

            if (!includeHidden && !budget.isVisible) {
                return false;
            }

            if (statusFilter !== "ALL" && effectiveStatus !== statusFilter) {
                return false;
            }

            if (periodTypeFilter !== "ALL" && budget.periodType !== periodTypeFilter) {
                return false;
            }

            if (!normalizedSearchTerm) {
                return true;
            }

            const searchableText = [
                budget.name,
                budget.notes ?? "",
                budget.categoryId ?? "",
                budget.memberId ?? "",
                budget.currency,
                budget.status,
                budget.computedStatus,
                budget.periodType,
            ]
                .join(" ")
                .toLocaleLowerCase();

            return searchableText.includes(normalizedSearchTerm);
        });
    }, [
        budgetsQuery.data?.budgets,
        includeArchived,
        includeHidden,
        includeInactive,
        periodTypeFilter,
        searchTerm,
        statusFilter,
    ]);

    const hasFilters =
        searchTerm.trim().length > 0 ||
        statusFilter !== "ALL" ||
        periodTypeFilter !== "ALL" ||
        includeArchived ||
        includeInactive ||
        includeHidden;

    const handleResetFilters = React.useCallback(() => {
        resetBudgetUi();
    }, [resetBudgetUi]);

    const handleEditBudget = React.useCallback(
        (budget: BudgetRecord) => {
            setSelectedBudgetId(budget._id);
            navigate(`${budgetsBasePath}/${budget._id}/edit`);
        },
        [budgetsBasePath, navigate, setSelectedBudgetId]
    );

    const handleDeleteBudget = React.useCallback(
        (budget: BudgetRecord) => {
            if (!workspaceId) {
                return;
            }

            const confirmed = window.confirm(
                `¿Seguro que deseas eliminar el presupuesto "${budget.name}"?`
            );

            if (!confirmed) {
                return;
            }

            setSelectedBudgetId(budget._id);

            deleteBudgetMutation.mutate({
                workspaceId,
                budgetId: budget._id,
            });
        },
        [deleteBudgetMutation, setSelectedBudgetId, workspaceId]
    );

    if (!workspaceId) {
        return (
            <Page title="Presupuestos" subtitle="Resolviendo el workspace activo.">
                <Alert severity="info">
                    Aún estamos resolviendo el contexto activo del workspace.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Presupuestos"
            subtitle="Administra topes, periodos, alertas y seguimiento del gasto del workspace activo."
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
            >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Aquí defines límites de gasto por periodo y luego contrastas el consumo real con las transacciones publicadas.
                </Typography>

                <Button variant="contained" onClick={() => navigate(`${budgetsBasePath}/new`)}>
                    Nuevo presupuesto
                </Button>
            </Stack>

            <BudgetsToolbar
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                periodTypeFilter={periodTypeFilter}
                includeArchived={includeArchived}
                includeInactive={includeInactive}
                includeHidden={includeHidden}
                totalCount={filteredBudgets.length}
                onSearchTermChange={setSearchTerm}
                onStatusFilterChange={setStatusFilter}
                onPeriodTypeFilterChange={setPeriodTypeFilter}
                onIncludeArchivedChange={setIncludeArchived}
                onIncludeInactiveChange={setIncludeInactive}
                onIncludeHiddenChange={setIncludeHidden}
                onResetFilters={handleResetFilters}
            />

            {deleteBudgetMutation.isError ? (
                <Alert severity="error">
                    {getBudgetErrorMessage(
                        deleteBudgetMutation.error,
                        "No se pudo eliminar el presupuesto."
                    )}
                </Alert>
            ) : null}

            {budgetsQuery.isLoading ? (
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
                                Cargando presupuestos…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo presupuestos del workspace activo.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            ) : null}

            {!budgetsQuery.isLoading && budgetsQuery.isError ? (
                <Alert severity="error">
                    {getBudgetErrorMessage(
                        budgetsQuery.error,
                        "No se pudieron cargar los presupuestos."
                    )}
                </Alert>
            ) : null}

            {!budgetsQuery.isLoading &&
                !budgetsQuery.isError &&
                filteredBudgets.length === 0 ? (
                <BudgetsEmptyState
                    hasFilters={hasFilters}
                    onClearFilters={handleResetFilters}
                />
            ) : null}

            {!budgetsQuery.isLoading &&
                !budgetsQuery.isError &&
                filteredBudgets.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredBudgets.map((budget: BudgetRecord) => (
                        <Grid key={budget._id} size={{ xs: 12, md: 6, xl: 4 }}>
                            <BudgetCard
                                budget={budget}
                                isSelected={selectedBudgetId === budget._id}
                                onEdit={handleEditBudget}
                                onDelete={handleDeleteBudget}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : null}
        </Page>
    );
}
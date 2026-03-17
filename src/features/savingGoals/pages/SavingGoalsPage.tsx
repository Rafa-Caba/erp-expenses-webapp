// src/features/savingGoals/pages/SavingGoalsPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import { Page } from "../../../shared/ui/Page/Page";
import { SavingGoalCard } from "../components/SavingGoalCard";
import { SavingGoalsEmptyState } from "../components/SavingGoalsEmptyState";
import { SavingGoalsToolbar } from "../components/SavingGoalsToolbar";
import { useDeleteSavingGoalMutation } from "../hooks/useSavingGoalMutations";
import { useSavingGoalsQuery } from "../hooks/useSavingGoalsQuery";
import { useSavingGoalStore } from "../store/saving-goal.store";
import type { SavingGoalRecord } from "../types/saving-goal.types";

function getSavingGoalsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/saving-goals";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/saving-goals`;
}

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function getSearchableText(savingGoal: SavingGoalRecord): string {
    return [
        savingGoal._id,
        savingGoal.accountId ?? "",
        savingGoal.memberId ?? "",
        savingGoal.name,
        savingGoal.description ?? "",
        savingGoal.currency,
        savingGoal.status,
        savingGoal.priority ?? "",
        savingGoal.category,
        String(savingGoal.targetAmount),
        String(savingGoal.currentAmount),
        savingGoal.targetDate ?? "",
    ]
        .join(" ")
        .toLocaleLowerCase();
}

export function SavingGoalsPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const searchTerm = useSavingGoalStore((state) => state.searchTerm);
    const statusFilter = useSavingGoalStore((state) => state.statusFilter);
    const categoryFilter = useSavingGoalStore((state) => state.categoryFilter);
    const includeHidden = useSavingGoalStore((state) => state.includeHidden);
    const selectedSavingGoalId = useSavingGoalStore(
        (state) => state.selectedSavingGoalId
    );

    const setSearchTerm = useSavingGoalStore((state) => state.setSearchTerm);
    const setStatusFilter = useSavingGoalStore((state) => state.setStatusFilter);
    const setCategoryFilter = useSavingGoalStore(
        (state) => state.setCategoryFilter
    );
    const setIncludeHidden = useSavingGoalStore(
        (state) => state.setIncludeHidden
    );
    const setSelectedSavingGoalId = useSavingGoalStore(
        (state) => state.setSelectedSavingGoalId
    );
    const resetSavingGoalUi = useSavingGoalStore((state) => state.reset);

    const savingGoalsQuery = useSavingGoalsQuery(workspaceId);
    const deleteSavingGoalMutation = useDeleteSavingGoalMutation();

    const savingGoalsBasePath = getSavingGoalsBasePath(scopeType, workspaceId);

    const filteredSavingGoals = React.useMemo(() => {
        const savingGoals = savingGoalsQuery.data?.savingGoals ?? [];
        const normalizedSearchTerm = normalizeText(searchTerm);

        return [...savingGoals]
            .filter((savingGoal: SavingGoalRecord) => {
                if (!includeHidden && !savingGoal.isVisible) {
                    return false;
                }

                if (statusFilter !== "ALL" && savingGoal.status !== statusFilter) {
                    return false;
                }

                if (
                    categoryFilter !== "ALL" &&
                    savingGoal.category !== categoryFilter
                ) {
                    return false;
                }

                if (!normalizedSearchTerm) {
                    return true;
                }

                return getSearchableText(savingGoal).includes(normalizedSearchTerm);
            })
            .sort((left, right) => {
                const leftDate = left.targetDate
                    ? new Date(left.targetDate).getTime()
                    : Number.MAX_SAFE_INTEGER;

                const rightDate = right.targetDate
                    ? new Date(right.targetDate).getTime()
                    : Number.MAX_SAFE_INTEGER;

                return leftDate - rightDate;
            });
    }, [
        categoryFilter,
        includeHidden,
        savingGoalsQuery.data?.savingGoals,
        searchTerm,
        statusFilter,
    ]);

    const hasFilters =
        searchTerm.trim().length > 0 ||
        statusFilter !== "ALL" ||
        categoryFilter !== "ALL" ||
        includeHidden;

    const handleResetFilters = React.useCallback(() => {
        resetSavingGoalUi();
    }, [resetSavingGoalUi]);

    const handleEditSavingGoal = React.useCallback(
        (savingGoal: SavingGoalRecord) => {
            setSelectedSavingGoalId(savingGoal._id);
            navigate(`${savingGoalsBasePath}/${savingGoal._id}/edit`);
        },
        [navigate, savingGoalsBasePath, setSelectedSavingGoalId]
    );

    const handleDeleteSavingGoal = React.useCallback(
        (savingGoal: SavingGoalRecord) => {
            if (!workspaceId) {
                return;
            }

            const confirmed = window.confirm(
                `¿Seguro que deseas eliminar la meta "${savingGoal.name}"?`
            );

            if (!confirmed) {
                return;
            }

            setSelectedSavingGoalId(savingGoal._id);

            deleteSavingGoalMutation.mutate({
                workspaceId,
                savingGoalId: savingGoal._id,
            });
        },
        [deleteSavingGoalMutation, setSelectedSavingGoalId, workspaceId]
    );

    if (!workspaceId) {
        return (
            <Page title="Metas de ahorro" subtitle="Resolviendo el workspace activo.">
                <Alert severity="info">
                    Aún estamos resolviendo el contexto activo del workspace.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Metas de ahorro"
            subtitle="Administra objetivos de ahorro dentro del workspace activo."
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
            >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Aquí registras metas de ahorro con monto objetivo, progreso,
                    categoría y vínculos opcionales a cuenta o miembro.
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => navigate(`${savingGoalsBasePath}/new`)}
                >
                    Nueva meta
                </Button>
            </Stack>

            <SavingGoalsToolbar
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                categoryFilter={categoryFilter}
                includeHidden={includeHidden}
                totalCount={filteredSavingGoals.length}
                onSearchTermChange={setSearchTerm}
                onStatusFilterChange={setStatusFilter}
                onCategoryFilterChange={setCategoryFilter}
                onIncludeHiddenChange={setIncludeHidden}
                onResetFilters={handleResetFilters}
            />

            {deleteSavingGoalMutation.isError ? (
                <Alert severity="error">
                    {getApiErrorMessage(
                        deleteSavingGoalMutation.error,
                        "No se pudo eliminar la meta."
                    )}
                </Alert>
            ) : null}

            {savingGoalsQuery.isLoading ? (
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando metas de ahorro…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo metas del workspace activo.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            ) : null}

            {!savingGoalsQuery.isLoading && savingGoalsQuery.isError ? (
                <Alert severity="error">
                    {getApiErrorMessage(
                        savingGoalsQuery.error,
                        "No se pudieron cargar las metas."
                    )}
                </Alert>
            ) : null}

            {!savingGoalsQuery.isLoading &&
                !savingGoalsQuery.isError &&
                filteredSavingGoals.length === 0 ? (
                <SavingGoalsEmptyState
                    hasFilters={hasFilters}
                    onClearFilters={handleResetFilters}
                />
            ) : null}

            {!savingGoalsQuery.isLoading &&
                !savingGoalsQuery.isError &&
                filteredSavingGoals.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredSavingGoals.map((savingGoal: SavingGoalRecord) => (
                        <Grid key={savingGoal._id} size={{ xs: 12, md: 6, xl: 4 }}>
                            <SavingGoalCard
                                savingGoal={savingGoal}
                                isSelected={selectedSavingGoalId === savingGoal._id}
                                onEdit={handleEditSavingGoal}
                                onDelete={handleDeleteSavingGoal}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : null}
        </Page>
    );
}
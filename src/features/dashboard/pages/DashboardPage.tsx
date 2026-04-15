// src/features/dashboard/pages/DashboardPage.tsx

import React from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useScopeStore } from "../../../app/scope/scope.store";
import { Page } from "../../../shared/ui/Page/Page";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { DashboardBudgetHealth } from "../components/DashboardBudgetHealth";
import { DashboardDebtSummary } from "../components/DashboardDebtSummary";
import { DashboardFilters } from "../components/DashboardFilters";
import { DashboardHighlights } from "../components/DashboardHighlights";
import { DashboardReconciliationSummary } from "../components/DashboardReconciliationSummary";
import { DashboardRemindersSummary } from "../components/DashboardRemindersSummary";
import { DashboardSummaryCards } from "../components/DashboardSummaryCards";
import { DashboardTopCategories } from "../components/DashboardTopCategories";
import { DashboardTrendChart } from "../components/DashboardTrendChart";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import { buildDashboardHighlights, resolveDashboardDateRange } from "../services/dashboard.service";
import { useDashboardStore } from "../store/dashboard.store";
import type { DashboardFilters as DashboardFiltersType } from "../types/dashboard.types";

function getErrorMessage(error: Error | null, fallbackMessage: string): string {
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

function DashboardSectionLoading() {
    return (
        <Box
            sx={{
                minHeight: 220,
                display: "grid",
                placeItems: "center",
            }}
        >
            <CircularProgress />
        </Box>
    );
}

export function DashboardPage() {
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const rangePreset = useDashboardStore((state) => state.rangePreset);
    const currency = useDashboardStore((state) => state.currency);
    const groupBy = useDashboardStore((state) => state.groupBy);
    const memberId = useDashboardStore((state) => state.memberId);
    const categoryId = useDashboardStore((state) => state.categoryId);
    const accountId = useDashboardStore((state) => state.accountId);
    const cardId = useDashboardStore((state) => state.cardId);
    const includeArchived = useDashboardStore((state) => state.includeArchived);
    const customDateFrom = useDashboardStore((state) => state.customDateFrom);
    const customDateTo = useDashboardStore((state) => state.customDateTo);
    const setFilters = useDashboardStore((state) => state.setFilters);
    const resetDashboardUi = useDashboardStore((state) => state.reset);

    const filters = React.useMemo<DashboardFiltersType>(
        () => ({
            rangePreset,
            currency,
            groupBy,
            memberId,
            categoryId,
            accountId,
            cardId,
            includeArchived,
            customDateFrom,
            customDateTo,
        }),
        [
            rangePreset,
            currency,
            groupBy,
            memberId,
            categoryId,
            accountId,
            cardId,
            includeArchived,
            customDateFrom,
            customDateTo,
        ]
    );

    const dashboardOverview = useDashboardOverview(workspaceId, filters);
    const dateRange = React.useMemo(() => resolveDashboardDateRange(filters), [filters]);

    const monthlySummary = dashboardOverview.monthlySummaryQuery.data;
    const categoryBreakdown = dashboardOverview.categoryBreakdownQuery.data;
    const debtSummary = dashboardOverview.debtSummaryQuery.data;
    const budgetSummary = dashboardOverview.budgetSummaryQuery.data;
    const reconciliationSummary = dashboardOverview.reconciliationSummaryQuery.data;
    const remindersSummary = dashboardOverview.remindersSummaryQuery.data;

    const hasCompleteOverview =
        monthlySummary !== undefined &&
        categoryBreakdown !== undefined &&
        debtSummary !== undefined &&
        budgetSummary !== undefined &&
        reconciliationSummary !== undefined &&
        remindersSummary !== undefined;

    const highlights = React.useMemo(() => {
        if (!hasCompleteOverview) {
            return [];
        }

        return buildDashboardHighlights({
            monthlySummary,
            categoryBreakdown,
            debtSummary,
            budgetSummary,
            reconciliationSummary,
            remindersSummary,
        });
    }, [
        hasCompleteOverview,
        monthlySummary,
        categoryBreakdown,
        debtSummary,
        budgetSummary,
        reconciliationSummary,
        remindersSummary,
    ]);

    const primaryError =
        dashboardOverview.monthlySummaryQuery.error ??
        dashboardOverview.categoryBreakdownQuery.error ??
        dashboardOverview.debtSummaryQuery.error ??
        dashboardOverview.budgetSummaryQuery.error ??
        dashboardOverview.reconciliationSummaryQuery.error ??
        dashboardOverview.remindersSummaryQuery.error;

    if (!workspaceId) {
        return (
            <Page
                title="Dashboard"
                subtitle="No fue posible resolver el workspace activo."
            >
                <Alert severity="warning">
                    No hay un workspace activo seleccionado para cargar el dashboard.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Dashboard"
            subtitle="Vista ejecutiva del contexto actual con finanzas, presupuestos, deudas, reminders y conciliación."
        >
            <Stack spacing={2.5} sx={{ minWidth: 0, width: "100%", overflowX: "hidden" }}>
                <Stack spacing={0.75}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Este dashboard consolida analytics y salud financiera del workspace activo usando reportes, reminders y conciliación ya existentes.
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        Periodo activo: {dateRange.periodLabel}
                    </Typography>
                </Stack>

                <DashboardFilters
                    workspaceId={workspaceId}
                    filters={filters}
                    periodLabel={dateRange.periodLabel}
                    onApplyFilters={setFilters}
                    onResetFilters={resetDashboardUi}
                />

                {primaryError ? (
                    <Alert severity="error">
                        {getErrorMessage(
                            primaryError,
                            "No se pudieron cargar todos los datos del dashboard."
                        )}
                    </Alert>
                ) : null}

                {dashboardOverview.monthlySummaryQuery.isLoading ||
                    dashboardOverview.reconciliationSummaryQuery.isLoading ? (
                    <DashboardSectionLoading />
                ) : monthlySummary && reconciliationSummary ? (
                    <DashboardSummaryCards
                        monthlySummary={monthlySummary}
                        reconciliationSummary={reconciliationSummary}
                        currency={filters.currency}
                    />
                ) : null}

                <DashboardHighlights highlights={highlights} />

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, xl: 8 }}>
                        {dashboardOverview.monthlySummaryQuery.isLoading ? (
                            <DashboardSectionLoading />
                        ) : monthlySummary ? (
                            <DashboardTrendChart
                                series={monthlySummary.series}
                                currency={filters.currency}
                            />
                        ) : null}
                    </Grid>

                    <Grid size={{ xs: 12, xl: 4 }}>
                        {dashboardOverview.categoryBreakdownQuery.isLoading ? (
                            <DashboardSectionLoading />
                        ) : categoryBreakdown ? (
                            <DashboardTopCategories
                                categories={categoryBreakdown.categories}
                                currency={filters.currency}
                            />
                        ) : null}
                    </Grid>

                    <Grid size={{ xs: 12, xl: 4 }}>
                        {dashboardOverview.budgetSummaryQuery.isLoading ? (
                            <DashboardSectionLoading />
                        ) : budgetSummary ? (
                            <DashboardBudgetHealth
                                summary={budgetSummary}
                                currency={filters.currency}
                            />
                        ) : null}
                    </Grid>

                    <Grid size={{ xs: 12, xl: 4 }}>
                        {dashboardOverview.debtSummaryQuery.isLoading ? (
                            <DashboardSectionLoading />
                        ) : debtSummary ? (
                            <DashboardDebtSummary
                                summary={debtSummary}
                                currency={filters.currency}
                            />
                        ) : null}
                    </Grid>

                    <Grid size={{ xs: 12, xl: 4 }}>
                        {dashboardOverview.reconciliationSummaryQuery.isLoading ? (
                            <DashboardSectionLoading />
                        ) : reconciliationSummary ? (
                            <DashboardReconciliationSummary
                                summary={reconciliationSummary}
                                currency={filters.currency}
                            />
                        ) : null}
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        {dashboardOverview.remindersSummaryQuery.isLoading ? (
                            <DashboardSectionLoading />
                        ) : remindersSummary ? (
                            <DashboardRemindersSummary summary={remindersSummary} />
                        ) : null}
                    </Grid>
                </Grid>
            </Stack>
        </Page>
    );
}
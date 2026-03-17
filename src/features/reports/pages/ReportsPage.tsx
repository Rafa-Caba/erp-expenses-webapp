// src/features/reports/pages/ReportsPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import { Page } from "../../../shared/ui/Page/Page";
import { BudgetSummarySection } from "../components/BudgetSummarySection";
import { CategoryBreakdownSection } from "../components/CategoryBreakdownSection";
import { DebtSummarySection } from "../components/DebtSummarySection";
import { MonthlySummarySection } from "../components/MonthlySummarySection";
import { ReportCard } from "../components/ReportCard";
import { ReportExportActions } from "../components/ReportExportActions";
import { ReportFiltersFields } from "../components/ReportFiltersFields";
import { ReportsEmptyState } from "../components/ReportsEmptyState";
import { ReportsToolbar } from "../components/ReportsToolbar";
import {
    useBudgetSummaryQuery,
    useCategoryBreakdownQuery,
    useDebtSummaryQuery,
    useMonthlySummaryQuery,
} from "../hooks/useReportAnalyticsQueries";
import {
    useDeleteReportMutation,
} from "../hooks/useReportMutations";
import {
    useExportBudgetSummaryMutation,
    useExportCategoryBreakdownMutation,
    useExportDebtSummaryMutation,
    useExportMonthlySummaryMutation,
} from "../hooks/useReportExportMutations";
import { useReportsQuery } from "../hooks/useReportsQuery";
import { useReportStore } from "../store/report.store";
import type { ReportExportFormat, ReportRecord } from "../types/report.types";
import { toReportFilters } from "../utils/report-filters";

function getReportsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/reports";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/reports`;
}

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function getSearchableText(report: ReportRecord): string {
    return [
        report._id,
        report.name,
        report.type,
        report.notes ?? "",
        report.status,
        report.fileUrl ?? "",
        report.fileName ?? "",
        report.fileFormat ?? "",
        report.generatedAt ?? "",
    ]
        .join(" ")
        .toLocaleLowerCase();
}

function buildExportName(prefix: string): string {
    const today = new Date().toISOString().slice(0, 10);
    return `${prefix}-${today}`;
}

function openExternalFile(fileUrl: string): void {
    const linkElement = document.createElement("a");
    linkElement.href = fileUrl;
    linkElement.target = "_blank";
    linkElement.rel = "noopener noreferrer";
    linkElement.click();
}

export function ReportsPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const searchTerm = useReportStore((state) => state.searchTerm);
    const typeFilter = useReportStore((state) => state.typeFilter);
    const statusFilter = useReportStore((state) => state.statusFilter);
    const includeHidden = useReportStore((state) => state.includeHidden);
    const selectedReportId = useReportStore((state) => state.selectedReportId);
    const analyticsFilters = useReportStore((state) => state.analyticsFilters);

    const setSearchTerm = useReportStore((state) => state.setSearchTerm);
    const setTypeFilter = useReportStore((state) => state.setTypeFilter);
    const setStatusFilter = useReportStore((state) => state.setStatusFilter);
    const setIncludeHidden = useReportStore((state) => state.setIncludeHidden);
    const setSelectedReportId = useReportStore((state) => state.setSelectedReportId);
    const setAnalyticsFilters = useReportStore((state) => state.setAnalyticsFilters);
    const resetListFilters = useReportStore((state) => state.resetListFilters);
    const resetAnalyticsFilters = useReportStore((state) => state.resetAnalyticsFilters);

    const reportFilters = React.useMemo(
        () => toReportFilters(analyticsFilters),
        [analyticsFilters]
    );

    const reportsQuery = useReportsQuery(workspaceId);
    const monthlySummaryQuery = useMonthlySummaryQuery(workspaceId, reportFilters);
    const categoryBreakdownQuery = useCategoryBreakdownQuery(workspaceId, reportFilters);
    const debtSummaryQuery = useDebtSummaryQuery(workspaceId, reportFilters);
    const budgetSummaryQuery = useBudgetSummaryQuery(workspaceId, reportFilters);

    const deleteReportMutation = useDeleteReportMutation();
    const exportMonthlySummaryMutation = useExportMonthlySummaryMutation();
    const exportCategoryBreakdownMutation = useExportCategoryBreakdownMutation();
    const exportDebtSummaryMutation = useExportDebtSummaryMutation();
    const exportBudgetSummaryMutation = useExportBudgetSummaryMutation();

    const [exportMessage, setExportMessage] = React.useState<string | null>(null);

    const reportsBasePath = getReportsBasePath(scopeType, workspaceId);

    const filteredReports = React.useMemo(() => {
        const reports = reportsQuery.data?.reports ?? [];
        const normalizedSearchTerm = normalizeText(searchTerm);

        return [...reports]
            .filter((report: ReportRecord) => {
                if (!includeHidden && !report.isVisible) {
                    return false;
                }

                if (typeFilter !== "ALL" && report.type !== typeFilter) {
                    return false;
                }

                if (statusFilter !== "ALL" && report.status !== statusFilter) {
                    return false;
                }

                if (!normalizedSearchTerm) {
                    return true;
                }

                return getSearchableText(report).includes(normalizedSearchTerm);
            })
            .sort((left, right) => {
                const leftDate = left.generatedAt
                    ? new Date(left.generatedAt).getTime()
                    : new Date(left.createdAt).getTime();

                const rightDate = right.generatedAt
                    ? new Date(right.generatedAt).getTime()
                    : new Date(right.createdAt).getTime();

                return rightDate - leftDate;
            });
    }, [includeHidden, reportsQuery.data?.reports, searchTerm, statusFilter, typeFilter]);

    const hasFilters =
        searchTerm.trim().length > 0 ||
        typeFilter !== "ALL" ||
        statusFilter !== "ALL" ||
        includeHidden;

    const exportErrorMessage =
        exportMonthlySummaryMutation.isError
            ? getApiErrorMessage(
                exportMonthlySummaryMutation.error,
                "No se pudo exportar el resumen mensual."
            )
            : exportCategoryBreakdownMutation.isError
                ? getApiErrorMessage(
                    exportCategoryBreakdownMutation.error,
                    "No se pudo exportar el desglose por categoría."
                )
                : exportDebtSummaryMutation.isError
                    ? getApiErrorMessage(
                        exportDebtSummaryMutation.error,
                        "No se pudo exportar el resumen de deudas."
                    )
                    : exportBudgetSummaryMutation.isError
                        ? getApiErrorMessage(
                            exportBudgetSummaryMutation.error,
                            "No se pudo exportar el resumen de presupuestos."
                        )
                        : null;

    const handleExportSuccess = (message: string, fileUrl: string | null, fileName: string): void => {
        setExportMessage(fileUrl ? `${message} Archivo: ${fileName}` : message);

        if (fileUrl) {
            openExternalFile(fileUrl);
        }
    };

    const handleExportMonthlySummary = (
        format: ReportExportFormat,
        persistReport: boolean
    ) => {
        if (!workspaceId) {
            return;
        }

        setExportMessage(null);

        exportMonthlySummaryMutation.mutate(
            {
                workspaceId,
                payload: {
                    name: buildExportName("monthly-summary"),
                    notes: "Export generado desde Reports.",
                    filters: reportFilters,
                    exportFormat: format,
                    persistReport,
                },
            },
            {
                onSuccess: (response) => {
                    handleExportSuccess(
                        response.message,
                        response.file.fileUrl,
                        response.file.fileName
                    );
                },
            }
        );
    };

    const handleExportCategoryBreakdown = (
        format: ReportExportFormat,
        persistReport: boolean
    ) => {
        if (!workspaceId) {
            return;
        }

        setExportMessage(null);

        exportCategoryBreakdownMutation.mutate(
            {
                workspaceId,
                payload: {
                    name: buildExportName("category-breakdown"),
                    notes: "Export generado desde Reports.",
                    filters: reportFilters,
                    exportFormat: format,
                    persistReport,
                },
            },
            {
                onSuccess: (response) => {
                    handleExportSuccess(
                        response.message,
                        response.file.fileUrl,
                        response.file.fileName
                    );
                },
            }
        );
    };

    const handleExportDebtSummary = (
        format: ReportExportFormat,
        persistReport: boolean
    ) => {
        if (!workspaceId) {
            return;
        }

        setExportMessage(null);

        exportDebtSummaryMutation.mutate(
            {
                workspaceId,
                payload: {
                    name: buildExportName("debt-summary"),
                    notes: "Export generado desde Reports.",
                    filters: reportFilters,
                    exportFormat: format,
                    persistReport,
                },
            },
            {
                onSuccess: (response) => {
                    handleExportSuccess(
                        response.message,
                        response.file.fileUrl,
                        response.file.fileName
                    );
                },
            }
        );
    };

    const handleExportBudgetSummary = (
        format: ReportExportFormat,
        persistReport: boolean
    ) => {
        if (!workspaceId) {
            return;
        }

        setExportMessage(null);

        exportBudgetSummaryMutation.mutate(
            {
                workspaceId,
                payload: {
                    name: buildExportName("budget-summary"),
                    notes: "Export generado desde Reports.",
                    filters: reportFilters,
                    exportFormat: format,
                    persistReport,
                },
            },
            {
                onSuccess: (response) => {
                    handleExportSuccess(
                        response.message,
                        response.file.fileUrl,
                        response.file.fileName
                    );
                },
            }
        );
    };

    const handleResetListFilters = React.useCallback(() => {
        resetListFilters();
    }, [resetListFilters]);

    const handleEditReport = React.useCallback(
        (report: ReportRecord) => {
            setSelectedReportId(report._id);
            navigate(`${reportsBasePath}/${report._id}/edit`);
        },
        [navigate, reportsBasePath, setSelectedReportId]
    );

    const handleDeleteReport = React.useCallback(
        (report: ReportRecord) => {
            if (!workspaceId) {
                return;
            }

            const confirmed = window.confirm(
                `¿Seguro que deseas eliminar el reporte "${report.name}"?`
            );

            if (!confirmed) {
                return;
            }

            setSelectedReportId(report._id);

            deleteReportMutation.mutate({
                workspaceId,
                reportId: report._id,
            });
        },
        [deleteReportMutation, setSelectedReportId, workspaceId]
    );

    if (!workspaceId) {
        return (
            <Page title="Reportes" subtitle="Resolviendo el workspace activo.">
                <Alert severity="info">
                    Aún estamos resolviendo el contexto activo del workspace.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Reportes"
            subtitle="Consulta analytics, exporta archivos y administra reportes guardados."
        >
            <Stack spacing={3}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                >
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Aquí puedes consultar analytics del workspace, exportarlos y
                        guardar reportes configurados.
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => navigate(`${reportsBasePath}/new`)}
                    >
                        Nuevo reporte
                    </Button>
                </Stack>

                {exportMessage ? <Alert severity="success">{exportMessage}</Alert> : null}

                {exportErrorMessage ? (
                    <Alert severity="error">{exportErrorMessage}</Alert>
                ) : null}

                {deleteReportMutation.isError ? (
                    <Alert severity="error">
                        {getApiErrorMessage(
                            deleteReportMutation.error,
                            "No se pudo eliminar el reporte."
                        )}
                    </Alert>
                ) : null}

                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                    <Stack spacing={2}>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            justifyContent="space-between"
                            spacing={2}
                            alignItems={{ xs: "stretch", md: "center" }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                Filtros de analytics
                            </Typography>

                            <Button variant="outlined" onClick={resetAnalyticsFilters}>
                                Limpiar filtros de analytics
                            </Button>
                        </Stack>

                        <ReportFiltersFields
                            workspaceId={workspaceId}
                            values={analyticsFilters}
                            onChange={setAnalyticsFilters}
                        />
                    </Stack>
                </Paper>

                <ReportExportActions
                    onExportMonthlySummary={handleExportMonthlySummary}
                    onExportCategoryBreakdown={handleExportCategoryBreakdown}
                    onExportDebtSummary={handleExportDebtSummary}
                    onExportBudgetSummary={handleExportBudgetSummary}
                    isExportingMonthlySummary={exportMonthlySummaryMutation.isPending}
                    isExportingCategoryBreakdown={
                        exportCategoryBreakdownMutation.isPending
                    }
                    isExportingDebtSummary={exportDebtSummaryMutation.isPending}
                    isExportingBudgetSummary={exportBudgetSummaryMutation.isPending}
                />

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, xl: 6 }}>
                        <MonthlySummarySection
                            summary={monthlySummaryQuery.data}
                            isLoading={monthlySummaryQuery.isLoading}
                            isError={monthlySummaryQuery.isError}
                            errorMessage={
                                monthlySummaryQuery.isError
                                    ? getApiErrorMessage(
                                        monthlySummaryQuery.error,
                                        "No se pudo cargar el resumen mensual."
                                    )
                                    : null
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, xl: 6 }}>
                        <CategoryBreakdownSection
                            breakdown={categoryBreakdownQuery.data}
                            isLoading={categoryBreakdownQuery.isLoading}
                            isError={categoryBreakdownQuery.isError}
                            errorMessage={
                                categoryBreakdownQuery.isError
                                    ? getApiErrorMessage(
                                        categoryBreakdownQuery.error,
                                        "No se pudo cargar el desglose por categoría."
                                    )
                                    : null
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, xl: 6 }}>
                        <DebtSummarySection
                            summary={debtSummaryQuery.data}
                            isLoading={debtSummaryQuery.isLoading}
                            isError={debtSummaryQuery.isError}
                            errorMessage={
                                debtSummaryQuery.isError
                                    ? getApiErrorMessage(
                                        debtSummaryQuery.error,
                                        "No se pudo cargar el resumen de deudas."
                                    )
                                    : null
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, xl: 6 }}>
                        <BudgetSummarySection
                            summary={budgetSummaryQuery.data}
                            isLoading={budgetSummaryQuery.isLoading}
                            isError={budgetSummaryQuery.isError}
                            errorMessage={
                                budgetSummaryQuery.isError
                                    ? getApiErrorMessage(
                                        budgetSummaryQuery.error,
                                        "No se pudo cargar el resumen de presupuestos."
                                    )
                                    : null
                            }
                        />
                    </Grid>
                </Grid>

                <ReportsToolbar
                    searchTerm={searchTerm}
                    typeFilter={typeFilter}
                    statusFilter={statusFilter}
                    includeHidden={includeHidden}
                    totalCount={filteredReports.length}
                    onSearchTermChange={setSearchTerm}
                    onTypeFilterChange={setTypeFilter}
                    onStatusFilterChange={setStatusFilter}
                    onIncludeHiddenChange={setIncludeHidden}
                    onResetFilters={handleResetListFilters}
                />

                {reportsQuery.isLoading ? (
                    <Box sx={{ minHeight: 220, display: "grid", placeItems: "center" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <CircularProgress />
                            <Typography>Cargando reportes...</Typography>
                        </Stack>
                    </Box>
                ) : null}

                {!reportsQuery.isLoading && reportsQuery.isError ? (
                    <Alert severity="error">
                        {getApiErrorMessage(
                            reportsQuery.error,
                            "No se pudieron cargar los reportes."
                        )}
                    </Alert>
                ) : null}

                {!reportsQuery.isLoading &&
                    !reportsQuery.isError &&
                    filteredReports.length === 0 ? (
                    <ReportsEmptyState
                        hasFilters={hasFilters}
                        onClearFilters={handleResetListFilters}
                    />
                ) : null}

                {!reportsQuery.isLoading &&
                    !reportsQuery.isError &&
                    filteredReports.length > 0 ? (
                    <Grid container spacing={2}>
                        {filteredReports.map((report: ReportRecord) => (
                            <Grid key={report._id} size={{ xs: 12, md: 6, xl: 4 }}>
                                <ReportCard
                                    report={report}
                                    isSelected={selectedReportId === report._id}
                                    onEdit={handleEditReport}
                                    onDelete={handleDeleteReport}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : null}
            </Stack>
        </Page>
    );
}
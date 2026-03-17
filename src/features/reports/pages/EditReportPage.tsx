// src/features/reports/pages/EditReportPage.tsx

import { Navigate, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import { Page } from "../../../shared/ui/Page/Page";
import { ReportForm, type ReportFormValues } from "../components/ReportForm";
import { useReportByIdQuery } from "../hooks/useReportByIdQuery";
import { useUpdateReportMutation } from "../hooks/useReportMutations";
import { toReportFilters, toReportFiltersFormValues } from "../utils/report-filters";
import type { ReportRecord, UpdateReportPayload } from "../types/report.types";

function getReportsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/reports";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/reports`;
}

function toDateInputValue(value: string | null): string {
    if (!value) {
        return "";
    }

    return value.slice(0, 10);
}

function toReportFormValues(report: ReportRecord): ReportFormValues {
    return {
        name: report.name,
        type: report.type,
        generatedByMemberId: report.generatedByMemberId ?? "",
        fileUrl: report.fileUrl ?? "",
        notes: report.notes ?? "",
        status: report.status,
        isVisible: report.isVisible,
        generatedAt: toDateInputValue(report.generatedAt),
        filters: toReportFiltersFormValues(report.filters),
    };
}

function toUpdateReportPayload(values: ReportFormValues): UpdateReportPayload {
    return {
        name: values.name.trim(),
        type: values.type,
        filters: toReportFilters(values.filters),
        generatedByMemberId: values.generatedByMemberId.trim() || null,
        fileUrl: values.fileUrl.trim() || null,
        notes: values.notes.trim() || null,
        status: values.status,
        isVisible: values.isVisible,
        generatedAt: values.generatedAt.trim() || null,
    };
}

export function EditReportPage() {
    const navigate = useNavigate();
    const params = useParams<{ reportId: string }>();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const reportId = params.reportId ?? null;

    const reportQuery = useReportByIdQuery(workspaceId, reportId);
    const updateReportMutation = useUpdateReportMutation();

    if (!workspaceId || !reportId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const reportsBasePath = getReportsBasePath(scopeType, workspaceId);

    if (reportQuery.isLoading) {
        return (
            <Page title="Editar reporte" subtitle="Cargando la información actual del reporte.">
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />

                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>Cargando reporte…</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo los datos actuales del reporte.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (reportQuery.isError || !reportQuery.data) {
        return (
            <Page title="Editar reporte" subtitle="No fue posible cargar el reporte.">
                <Alert severity="error">
                    {getApiErrorMessage(reportQuery.error, "No se pudo obtener el reporte.")}
                </Alert>
            </Page>
        );
    }

    const submitErrorMessage = updateReportMutation.isError
        ? getApiErrorMessage(updateReportMutation.error, "No se pudo actualizar el reporte.")
        : null;

    const initialValues = toReportFormValues(reportQuery.data);

    const handleSubmit = (values: ReportFormValues) => {
        const payload = toUpdateReportPayload(values);

        updateReportMutation.mutate(
            {
                workspaceId,
                reportId,
                payload,
            },
            {
                onSuccess: () => {
                    navigate(reportsBasePath);
                },
            }
        );
    };

    const handleCancel = () => {
        navigate(reportsBasePath);
    };

    return (
        <Page
            title="Editar reporte"
            subtitle="Actualiza metadatos, filtros y estatus del reporte guardado."
        >
            <ReportForm
                mode="edit"
                workspaceId={workspaceId}
                initialValues={initialValues}
                isSubmitting={updateReportMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
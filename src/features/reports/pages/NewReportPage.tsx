// src/features/reports/pages/NewReportPage.tsx

import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import { Page } from "../../../shared/ui/Page/Page";
import { ReportForm, type ReportFormValues } from "../components/ReportForm";
import { useCreateReportMutation } from "../hooks/useReportMutations";
import { DEFAULT_REPORT_FILTERS_FORM_VALUES, toReportFilters } from "../utils/report-filters";
import type { CreateReportPayload } from "../types/report.types";

function getReportsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/reports";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/reports`;
}

const INITIAL_VALUES: ReportFormValues = {
    name: "",
    type: "custom",
    generatedByMemberId: "",
    fileUrl: "",
    notes: "",
    status: "pending",
    isVisible: true,
    generatedAt: "",
    filters: DEFAULT_REPORT_FILTERS_FORM_VALUES,
};

function toCreateReportPayload(values: ReportFormValues): CreateReportPayload {
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

export function NewReportPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const createReportMutation = useCreateReportMutation();

    if (!workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const reportsBasePath = getReportsBasePath(scopeType, workspaceId);

    const submitErrorMessage = createReportMutation.isError
        ? getApiErrorMessage(createReportMutation.error, "No se pudo crear el reporte.")
        : null;

    const handleSubmit = React.useCallback(
        (values: ReportFormValues) => {
            const payload = toCreateReportPayload(values);

            createReportMutation.mutate(
                {
                    workspaceId,
                    payload,
                },
                {
                    onSuccess: () => {
                        navigate(reportsBasePath);
                    },
                }
            );
        },
        [createReportMutation, navigate, reportsBasePath, workspaceId]
    );

    const handleCancel = React.useCallback(() => {
        navigate(reportsBasePath);
    }, [navigate, reportsBasePath]);

    return (
        <Page
            title="Nuevo reporte"
            subtitle="Agrega un nuevo reporte guardado al workspace activo."
        >
            <ReportForm
                mode="create"
                workspaceId={workspaceId}
                initialValues={INITIAL_VALUES}
                isSubmitting={createReportMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
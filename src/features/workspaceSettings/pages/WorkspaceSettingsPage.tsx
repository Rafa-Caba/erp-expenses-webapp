// src/features/workspaceSettings/pages/WorkspaceSettingsPage.tsx

import React from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { Page } from "../../../shared/ui/Page/Page";
import { WorkspaceSettingsForm } from "../components/WorkspaceSettingsForm";
import { WorkspaceSettingsSummaryCard } from "../components/WorkspaceSettingsSummaryCard";
import { useUpdateWorkspaceSettingsMutation } from "../hooks/useWorkspaceSettingsMutations";
import { useWorkspaceSettingsQuery } from "../hooks/useWorkspaceSettingsQuery";
import type { UpdateWorkspaceSettingsPayload } from "../types/workspace-settings.types";

function getWorkspaceSettingsErrorMessage(
    error: Error | null,
    fallbackMessage: string
): string {
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

export function WorkspaceSettingsPage() {
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const workspaceSettingsQuery = useWorkspaceSettingsQuery(workspaceId);
    const updateWorkspaceSettingsMutation = useUpdateWorkspaceSettingsMutation();

    const handleSubmit = React.useCallback(
        (payload: UpdateWorkspaceSettingsPayload) => {
            if (!workspaceId) {
                return;
            }

            updateWorkspaceSettingsMutation.mutate({
                workspaceId,
                payload,
            });
        },
        [updateWorkspaceSettingsMutation, workspaceId]
    );

    if (!workspaceId) {
        return (
            <Page
                title="Ajustes"
                subtitle="No fue posible resolver el workspace activo."
            >
                <Alert severity="warning">
                    No hay un workspace activo seleccionado para cargar los ajustes.
                </Alert>
            </Page>
        );
    }

    if (workspaceSettingsQuery.isLoading) {
        return (
            <Page
                title="Ajustes"
                subtitle="Cargando configuración general del workspace."
            >
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando ajustes…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo la configuración del workspace activo.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (workspaceSettingsQuery.isError) {
        return (
            <Page
                title="Ajustes"
                subtitle="No fue posible cargar la configuración del workspace."
            >
                <Alert severity="error">
                    {getWorkspaceSettingsErrorMessage(
                        workspaceSettingsQuery.error,
                        "No se pudieron obtener los ajustes del workspace."
                    )}
                </Alert>
            </Page>
        );
    }

    const settings = workspaceSettingsQuery.data?.settings ?? null;

    if (!settings) {
        return (
            <Page
                title="Ajustes"
                subtitle="No encontramos settings configurados para este workspace."
            >
                <Alert severity="warning">
                    El workspace no devolvió un registro de settings.
                </Alert>
            </Page>
        );
    }

    const successMessage = updateWorkspaceSettingsMutation.isSuccess
        ? updateWorkspaceSettingsMutation.data.message
        : null;

    const errorMessage = updateWorkspaceSettingsMutation.isError
        ? getWorkspaceSettingsErrorMessage(
            updateWorkspaceSettingsMutation.error,
            "No se pudieron actualizar los ajustes."
        )
        : null;

    return (
        <Page
            title="Ajustes"
            subtitle="Administra idioma, formato, visibilidad y alertas del workspace activo."
        >
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 4 }}>
                    <WorkspaceSettingsSummaryCard settings={settings} />
                </Grid>

                <Grid size={{ xs: 12, lg: 8 }}>
                    <WorkspaceSettingsForm
                        initialValues={settings}
                        isSubmitting={updateWorkspaceSettingsMutation.isPending}
                        submitErrorMessage={errorMessage}
                        submitSuccessMessage={successMessage}
                        onSubmit={handleSubmit}
                    />
                </Grid>
            </Grid>
        </Page>
    );
}
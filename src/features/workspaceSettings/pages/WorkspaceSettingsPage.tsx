// src/features/workspaceSettings/pages/WorkspaceSettingsPage.tsx

import React from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { Page } from "../../../shared/ui/Page/Page";
import { useUpdateThemeMutation } from "../../themes/hooks/useThemeMutations";
import { useThemesQuery } from "../../themes/hooks/useThemesQuery";
import type { ThemeColors } from "../../themes/types/theme.types";
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
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

    const workspaceId = useScopeStore((state) => state.workspaceId);

    const workspaceSettingsQuery = useWorkspaceSettingsQuery(workspaceId);
    const themesQuery = useThemesQuery(workspaceId);
    const updateWorkspaceSettingsMutation = useUpdateWorkspaceSettingsMutation();
    const updateThemeMutation = useUpdateThemeMutation();

    const [summaryCollapsed, setSummaryCollapsed] = React.useState<boolean>(!isDesktop);

    React.useEffect(() => {
        setSummaryCollapsed(!isDesktop);
    }, [isDesktop]);

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

    const handleUpdateCustomTheme = React.useCallback(
        (payload: {
            name: string;
            description: string | null;
            colors: ThemeColors;
        }) => {
            if (!workspaceId) {
                return;
            }

            updateThemeMutation.mutate({
                workspaceId,
                themeKey: "customizable",
                payload,
            });
        },
        [updateThemeMutation, workspaceId]
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

    if (workspaceSettingsQuery.isLoading || themesQuery.isLoading) {
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
                                Obteniendo la configuración y temas del workspace activo.
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

    if (themesQuery.isError) {
        return (
            <Page
                title="Ajustes"
                subtitle="No fue posible cargar los temas del workspace."
            >
                <Alert severity="error">
                    {getWorkspaceSettingsErrorMessage(
                        themesQuery.error,
                        "No se pudieron obtener los temas del workspace."
                    )}
                </Alert>
            </Page>
        );
    }

    const settings = workspaceSettingsQuery.data?.settings ?? null;
    const availableThemes = themesQuery.data?.themes ?? [];

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

    const themeSuccessMessage = updateThemeMutation.isSuccess
        ? updateThemeMutation.data.message
        : null;

    const themeErrorMessage = updateThemeMutation.isError
        ? getWorkspaceSettingsErrorMessage(
            updateThemeMutation.error,
            "No se pudo actualizar el tema personalizable."
        )
        : null;

    const summaryGridSize = isDesktop
        ? summaryCollapsed
            ? 1
            : 4
        : 12;

    const formGridSize = isDesktop
        ? summaryCollapsed
            ? 11
            : 8
        : 12;

    return (
        <Page
            title="Ajustes"
            subtitle="Administra idioma, formato, visibilidad, alertas y temas del workspace activo."
        >
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: summaryGridSize }}>
                    <WorkspaceSettingsSummaryCard
                        settings={settings}
                        collapsed={summaryCollapsed}
                        onToggleCollapsed={() =>
                            setSummaryCollapsed((currentValue) => !currentValue)
                        }
                    />
                </Grid>

                <Grid size={{ xs: 12, lg: formGridSize }}>
                    <WorkspaceSettingsForm
                        workspaceId={workspaceId}
                        initialValues={settings}
                        availableThemes={availableThemes}
                        isSubmitting={updateWorkspaceSettingsMutation.isPending}
                        isUpdatingCustomTheme={updateThemeMutation.isPending}
                        submitErrorMessage={errorMessage}
                        submitSuccessMessage={successMessage}
                        themeErrorMessage={themeErrorMessage}
                        themeSuccessMessage={themeSuccessMessage}
                        onSubmit={handleSubmit}
                        onUpdateCustomTheme={handleUpdateCustomTheme}
                    />
                </Grid>
            </Grid>
        </Page>
    );
}
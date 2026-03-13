// src/features/workspaces/pages/EditWorkspacePage.tsx

import { Navigate, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { useWorkspaceByIdQuery } from "../hooks/useWorkspaceByIdQuery";
import { useUpdateWorkspaceMutation } from "../hooks/useWorkspaceMutations";
import { WorkspaceForm, type WorkspaceFormValues } from "../components/WorkspaceForm";
import type { UpdateWorkspacePayload, WorkspaceRecord } from "../types/workspace.types";

function toWorkspaceFormValues(workspace: WorkspaceRecord): WorkspaceFormValues {
    return {
        type: workspace.type,
        kind: workspace.kind,
        name: workspace.name,
        description: workspace.description ?? "",
        currency: workspace.currency,
        timezone: workspace.timezone,
        country: workspace.country ?? "",
        icon: workspace.icon ?? "",
        color: workspace.color ?? "",
        visibility: workspace.visibility,
        isVisible: workspace.isVisible,
        isActive: workspace.isActive,
        isArchived: workspace.isArchived,
    };
}

function toUpdateWorkspacePayload(values: WorkspaceFormValues): UpdateWorkspacePayload {
    return {
        type: values.type,
        kind: values.kind,
        name: values.name.trim(),
        description: values.description.trim() || undefined,
        currency: values.currency,
        timezone: values.timezone.trim(),
        country: values.country.trim() || undefined,
        icon: values.icon.trim() || undefined,
        color: values.color.trim() || undefined,
        visibility: values.visibility,
        isVisible: values.isVisible,
        isActive: values.isActive,
        isArchived: values.isArchived,
    };
}

function getWorkspaceErrorMessage(error: unknown, fallbackMessage: string): string {
    if (error instanceof Error) {
        return error.message;
    }

    return fallbackMessage;
}

export function EditWorkspacePage() {
    const navigate = useNavigate();
    const params = useParams<{ workspaceId: string }>();

    const workspaceId = params.workspaceId ?? null;

    const workspaceQuery = useWorkspaceByIdQuery(workspaceId);
    const updateWorkspaceMutation = useUpdateWorkspaceMutation();

    if (!workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    if (workspaceQuery.isLoading) {
        return (
            <Page
                title="Editar workspace"
                subtitle="Cargando la información actual del workspace."
            >
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando workspace…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo los datos actuales.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (workspaceQuery.isError || !workspaceQuery.data?.workspace) {
        return (
            <Page
                title="Editar workspace"
                subtitle="No fue posible cargar el workspace."
            >
                <Alert severity="error">
                    {getWorkspaceErrorMessage(
                        workspaceQuery.error,
                        "No se pudo obtener el workspace."
                    )}
                </Alert>
            </Page>
        );
    }

    const submitErrorMessage = updateWorkspaceMutation.isError
        ? getWorkspaceErrorMessage(
            updateWorkspaceMutation.error,
            "No se pudo actualizar el workspace."
        )
        : null;

    const initialValues = toWorkspaceFormValues(workspaceQuery.data.workspace);

    const handleSubmit = (values: WorkspaceFormValues) => {
        const payload = toUpdateWorkspacePayload(values);

        updateWorkspaceMutation.mutate(
            {
                workspaceId,
                payload,
            },
            {
                onSuccess: (response) => {
                    const updatedWorkspace = response.workspace;

                    if (updatedWorkspace.type === "PERSONAL") {
                        navigate("/app/personal/dashboard");
                        return;
                    }

                    navigate(`/app/w/${updatedWorkspace.id}/dashboard`);
                },
            }
        );
    };

    const handleCancel = () => {
        navigate("/app/workspaces");
    };

    return (
        <Page
            title="Editar workspace"
            subtitle="Actualiza la configuración general y el estado del workspace."
        >
            <WorkspaceForm
                mode="edit"
                initialValues={initialValues}
                isSubmitting={updateWorkspaceMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
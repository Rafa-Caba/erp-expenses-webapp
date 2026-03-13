// src/features/workspaces/pages/NewWorkspacePage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";

import { Page } from "../../../shared/ui/Page/Page";
import { useCreateWorkspaceMutation } from "../hooks/useWorkspaceMutations";
import { WorkspaceForm, type WorkspaceFormValues } from "../components/WorkspaceForm";
import type { CreateWorkspacePayload } from "../types/workspace.types";

const INITIAL_VALUES: WorkspaceFormValues = {
    type: "HOUSEHOLD",
    kind: "COLLABORATIVE",
    name: "",
    description: "",
    currency: "MXN",
    timezone: "America/Mexico_City",
    country: "México",
    icon: "",
    color: "",
    visibility: "PRIVATE",
    isVisible: true,
    isActive: true,
    isArchived: false,
};

function toCreateWorkspacePayload(values: WorkspaceFormValues): CreateWorkspacePayload {
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
    };
}

function getCreateWorkspaceErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return "No se pudo crear el workspace.";
}

export function NewWorkspacePage() {
    const navigate = useNavigate();
    const createWorkspaceMutation = useCreateWorkspaceMutation();

    const submitErrorMessage = createWorkspaceMutation.isError
        ? getCreateWorkspaceErrorMessage(createWorkspaceMutation.error)
        : null;

    const handleSubmit = React.useCallback(
        (values: WorkspaceFormValues) => {
            const payload = toCreateWorkspacePayload(values);

            createWorkspaceMutation.mutate(payload, {
                onSuccess: (response) => {
                    const createdWorkspace = response.workspace;

                    if (createdWorkspace.type === "PERSONAL") {
                        navigate("/app/personal/dashboard");
                        return;
                    }

                    navigate(`/app/w/${createdWorkspace.id}/dashboard`);
                },
            });
        },
        [createWorkspaceMutation, navigate]
    );

    const handleCancel = React.useCallback(() => {
        navigate("/app/workspaces");
    }, [navigate]);

    return (
        <Page
            title="Nuevo workspace"
            subtitle="Crea un nuevo espacio para casa, negocio o uso personal."
        >
            <WorkspaceForm
                mode="create"
                initialValues={INITIAL_VALUES}
                isSubmitting={createWorkspaceMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
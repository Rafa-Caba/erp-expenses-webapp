// src/features/workspaces/pages/NewWorkspaceMemberPage.tsx

import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import {
    useCreateWorkspaceMemberMutation,
} from "../hooks/useWorkspaceMemberMutations";
import {
    WorkspaceMemberForm,
    type WorkspaceMemberFormValues,
} from "../components/WorkspaceMemberForm";
import type { CreateWorkspaceMemberPayload } from "../types/workspace-member.types";

function getMembersBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/members";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/members`;
}

const INITIAL_VALUES: WorkspaceMemberFormValues = {
    userId: "",
    displayName: "",
    role: "MEMBER",
    status: "invited",
    joinedAt: "",
    notes: "",
    isVisible: true,
    permissions: [],
};

function toCreateWorkspaceMemberPayload(
    values: WorkspaceMemberFormValues
): CreateWorkspaceMemberPayload {
    return {
        userId: values.userId.trim(),
        displayName: values.displayName.trim(),
        role: values.role,
        permissions: values.permissions,
        status: values.status,
        joinedAt: values.joinedAt.trim() || undefined,
        notes: values.notes.trim() || undefined,
        isVisible: values.isVisible,
    };
}

function getWorkspaceMemberErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

export function NewWorkspaceMemberPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const createWorkspaceMemberMutation = useCreateWorkspaceMemberMutation();

    if (!workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const membersBasePath = getMembersBasePath(scopeType, workspaceId);

    const submitErrorMessage = createWorkspaceMemberMutation.isError
        ? getWorkspaceMemberErrorMessage(
            createWorkspaceMemberMutation.error,
            "No se pudo crear el miembro."
        )
        : null;

    const handleSubmit = React.useCallback(
        (values: WorkspaceMemberFormValues) => {
            const payload = toCreateWorkspaceMemberPayload(values);

            createWorkspaceMemberMutation.mutate(
                {
                    workspaceId,
                    payload,
                },
                {
                    onSuccess: () => {
                        navigate(membersBasePath);
                    },
                }
            );
        },
        [createWorkspaceMemberMutation, membersBasePath, navigate, workspaceId]
    );

    const handleCancel = React.useCallback(() => {
        navigate(membersBasePath);
    }, [membersBasePath, navigate]);

    return (
        <Page
            title="Nuevo miembro"
            subtitle="Agrega un miembro al workspace activo y define su acceso inicial."
        >
            <WorkspaceMemberForm
                mode="create"
                initialValues={INITIAL_VALUES}
                isSubmitting={createWorkspaceMemberMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
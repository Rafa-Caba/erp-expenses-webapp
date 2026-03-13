// src/features/workspaces/pages/EditWorkspaceMemberPage.tsx

import { Navigate, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import {
    useUpdateWorkspaceMemberMutation,
    useUpdateWorkspaceMemberStatusMutation,
} from "../hooks/useWorkspaceMemberMutations";
import { useWorkspaceMemberByIdQuery } from "../hooks/useWorkspaceMemberByIdQuery";
import {
    WorkspaceMemberForm,
    type WorkspaceMemberFormValues,
} from "../components/WorkspaceMemberForm";
import type {
    UpdateWorkspaceMemberPayload,
    UpdateWorkspaceMemberStatusPayload,
    WorkspaceMemberRecord,
} from "../types/workspace-member.types";

function getMembersBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/members";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/members`;
}

function toDateInputValue(isoDateString: string | null): string {
    if (!isoDateString) {
        return "";
    }

    return isoDateString.slice(0, 10);
}

function toWorkspaceMemberFormValues(
    member: WorkspaceMemberRecord
): WorkspaceMemberFormValues {
    return {
        userId: member.userId,
        displayName: member.displayName,
        role: member.role,
        status: member.status,
        joinedAt: toDateInputValue(member.joinedAt),
        notes: member.notes ?? "",
        isVisible: member.isVisible,
        permissions: member.permissions,
    };
}

function toUpdateWorkspaceMemberPayload(
    values: WorkspaceMemberFormValues
): UpdateWorkspaceMemberPayload {
    return {
        displayName: values.displayName.trim(),
        role: values.role,
        permissions: values.permissions,
        notes: values.notes.trim() || undefined,
        isVisible: values.isVisible,
    };
}

function toUpdateWorkspaceMemberStatusPayload(
    values: WorkspaceMemberFormValues
): UpdateWorkspaceMemberStatusPayload {
    return {
        status: values.status,
        joinedAt: values.joinedAt.trim() || undefined,
    };
}

function didStatusPayloadChange(
    member: WorkspaceMemberRecord,
    values: WorkspaceMemberFormValues
): boolean {
    const currentJoinedAt = toDateInputValue(member.joinedAt);
    const nextJoinedAt = values.joinedAt.trim();

    return member.status !== values.status || currentJoinedAt !== nextJoinedAt;
}

function getWorkspaceMemberErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

export function EditWorkspaceMemberPage() {
    const navigate = useNavigate();
    const params = useParams<{ memberId: string }>();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const memberId = params.memberId ?? null;

    const memberQuery = useWorkspaceMemberByIdQuery(workspaceId, memberId);
    const updateWorkspaceMemberMutation = useUpdateWorkspaceMemberMutation();
    const updateWorkspaceMemberStatusMutation = useUpdateWorkspaceMemberStatusMutation();

    if (!workspaceId || !memberId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const membersBasePath = getMembersBasePath(scopeType, workspaceId);

    if (memberQuery.isLoading) {
        return (
            <Page
                title="Editar miembro"
                subtitle="Cargando la información actual del miembro."
            >
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando miembro…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo los datos actuales del miembro.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (memberQuery.isError || !memberQuery.data) {
        return (
            <Page
                title="Editar miembro"
                subtitle="No fue posible cargar el miembro."
            >
                <Alert severity="error">
                    {getWorkspaceMemberErrorMessage(
                        memberQuery.error,
                        "No se pudo obtener el miembro."
                    )}
                </Alert>
            </Page>
        );
    }

    const submitErrorMessage =
        updateWorkspaceMemberMutation.isError
            ? getWorkspaceMemberErrorMessage(
                updateWorkspaceMemberMutation.error,
                "No se pudo actualizar el miembro."
            )
            : updateWorkspaceMemberStatusMutation.isError
                ? getWorkspaceMemberErrorMessage(
                    updateWorkspaceMemberStatusMutation.error,
                    "No se pudo actualizar el estado del miembro."
                )
                : null;

    const initialValues = toWorkspaceMemberFormValues(memberQuery.data);

    const handleSubmit = async (values: WorkspaceMemberFormValues) => {
        const updateMemberPayload = toUpdateWorkspaceMemberPayload(values);

        await updateWorkspaceMemberMutation.mutateAsync({
            workspaceId,
            memberId,
            payload: updateMemberPayload,
        });

        if (didStatusPayloadChange(memberQuery.data, values)) {
            const updateStatusPayload = toUpdateWorkspaceMemberStatusPayload(values);

            await updateWorkspaceMemberStatusMutation.mutateAsync({
                workspaceId,
                memberId,
                payload: updateStatusPayload,
            });
        }

        navigate(membersBasePath);
    };

    const handleCancel = () => {
        navigate(membersBasePath);
    };

    return (
        <Page
            title="Editar miembro"
            subtitle="Actualiza permisos, visibilidad, rol y estado del miembro."
        >
            <WorkspaceMemberForm
                mode="edit"
                initialValues={initialValues}
                isSubmitting={
                    updateWorkspaceMemberMutation.isPending ||
                    updateWorkspaceMemberStatusMutation.isPending
                }
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
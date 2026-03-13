// src/features/workspaces/pages/WorkspaceMembersPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import type { MemberStatus } from "../../../shared/types/common.types";
import {
    useDeleteWorkspaceMemberMutation,
    useUpdateWorkspaceMemberStatusMutation,
} from "../hooks/useWorkspaceMemberMutations";
import { useWorkspaceMembersQuery } from "../hooks/useWorkspaceMembersQuery";
import { useWorkspaceMemberStore } from "../store/workspace-member.store";
import type { WorkspaceMemberRecord } from "../types/workspace-member.types";
import { WorkspaceMemberCard } from "../components/WorkspaceMemberCard";
import { WorkspaceMembersEmptyState } from "../components/WorkspaceMembersEmptyState";
import { WorkspaceMembersToolbar } from "../components/WorkspaceMembersToolbar";

function getMembersBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/members";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/members`;
}

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function getWorkspaceMemberErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

export function WorkspaceMembersPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const searchTerm = useWorkspaceMemberStore((state) => state.searchTerm);
    const roleFilter = useWorkspaceMemberStore((state) => state.roleFilter);
    const statusFilter = useWorkspaceMemberStore((state) => state.statusFilter);
    const includeHidden = useWorkspaceMemberStore((state) => state.includeHidden);
    const selectedMemberId = useWorkspaceMemberStore((state) => state.selectedMemberId);

    const setSearchTerm = useWorkspaceMemberStore((state) => state.setSearchTerm);
    const setRoleFilter = useWorkspaceMemberStore((state) => state.setRoleFilter);
    const setStatusFilter = useWorkspaceMemberStore((state) => state.setStatusFilter);
    const setIncludeHidden = useWorkspaceMemberStore((state) => state.setIncludeHidden);
    const setSelectedMemberId = useWorkspaceMemberStore((state) => state.setSelectedMemberId);
    const resetWorkspaceMemberUi = useWorkspaceMemberStore((state) => state.reset);

    const membersQuery = useWorkspaceMembersQuery(workspaceId);
    const updateStatusMutation = useUpdateWorkspaceMemberStatusMutation();
    const deleteMemberMutation = useDeleteWorkspaceMemberMutation();

    const membersBasePath = getMembersBasePath(scopeType, workspaceId);

    const filteredMembers = React.useMemo(() => {
        const members = membersQuery.data?.members ?? [];
        const normalizedSearchTerm = normalizeText(searchTerm);

        return members.filter((member: WorkspaceMemberRecord) => {
            if (!includeHidden && !member.isVisible) {
                return false;
            }

            if (roleFilter !== "ALL" && member.role !== roleFilter) {
                return false;
            }

            if (statusFilter !== "ALL" && member.status !== statusFilter) {
                return false;
            }

            if (!normalizedSearchTerm) {
                return true;
            }

            const searchableText = [
                member.displayName,
                member.userId,
                member.role,
                member.status,
                member.notes ?? "",
                member.permissions.join(" "),
            ]
                .join(" ")
                .toLocaleLowerCase();

            return searchableText.includes(normalizedSearchTerm);
        });
    }, [
        includeHidden,
        membersQuery.data?.members,
        roleFilter,
        searchTerm,
        statusFilter,
    ]);

    const hasFilters =
        searchTerm.trim().length > 0 ||
        roleFilter !== "ALL" ||
        statusFilter !== "ALL" ||
        includeHidden;

    const handleResetFilters = React.useCallback(() => {
        resetWorkspaceMemberUi();
    }, [resetWorkspaceMemberUi]);

    const handleEditMember = React.useCallback(
        (member: WorkspaceMemberRecord) => {
            setSelectedMemberId(member.id);
            navigate(`${membersBasePath}/${member.id}/edit`);
        },
        [membersBasePath, navigate, setSelectedMemberId]
    );

    const handleDeleteMember = React.useCallback(
        (member: WorkspaceMemberRecord) => {
            if (!workspaceId) {
                return;
            }

            const confirmed = window.confirm(
                `¿Seguro que deseas eliminar a "${member.displayName}" del workspace?`
            );

            if (!confirmed) {
                return;
            }

            setSelectedMemberId(member.id);

            deleteMemberMutation.mutate({
                workspaceId,
                memberId: member.id,
            });
        },
        [deleteMemberMutation, setSelectedMemberId, workspaceId]
    );

    const handleChangeStatus = React.useCallback(
        (member: WorkspaceMemberRecord, nextStatus: MemberStatus) => {
            if (!workspaceId) {
                return;
            }

            setSelectedMemberId(member.id);

            const payload =
                member.joinedAt !== null
                    ? {
                        status: nextStatus,
                        joinedAt: member.joinedAt,
                    }
                    : {
                        status: nextStatus,
                    };

            updateStatusMutation.mutate({
                workspaceId,
                memberId: member.id,
                payload,
            });
        },
        [setSelectedMemberId, updateStatusMutation, workspaceId]
    );

    if (!workspaceId) {
        return (
            <Page
                title="Miembros del workspace"
                subtitle="Resolviendo el workspace activo."
            >
                <Alert severity="info">
                    Aún estamos resolviendo el contexto activo del workspace.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Miembros del workspace"
            subtitle="Administra roles, estado, visibilidad y permisos de cada miembro."
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
            >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Por ahora el alta usa un userId manual. Más adelante lo conectamos al módulo de usuarios.
                </Typography>

                <Button variant="contained" onClick={() => navigate(`${membersBasePath}/new`)}>
                    Nuevo miembro
                </Button>
            </Stack>

            <WorkspaceMembersToolbar
                searchTerm={searchTerm}
                roleFilter={roleFilter}
                statusFilter={statusFilter}
                includeHidden={includeHidden}
                totalCount={filteredMembers.length}
                onSearchTermChange={setSearchTerm}
                onRoleFilterChange={setRoleFilter}
                onStatusFilterChange={setStatusFilter}
                onIncludeHiddenChange={setIncludeHidden}
                onResetFilters={handleResetFilters}
            />

            {updateStatusMutation.isError ? (
                <Alert severity="error">
                    {getWorkspaceMemberErrorMessage(
                        updateStatusMutation.error,
                        "No se pudo actualizar el estado del miembro."
                    )}
                </Alert>
            ) : null}

            {deleteMemberMutation.isError ? (
                <Alert severity="error">
                    {getWorkspaceMemberErrorMessage(
                        deleteMemberMutation.error,
                        "No se pudo eliminar el miembro."
                    )}
                </Alert>
            ) : null}

            {membersQuery.isLoading ? (
                <Box
                    sx={{
                        minHeight: 320,
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando miembros…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo miembros del workspace activo.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            ) : null}

            {!membersQuery.isLoading && membersQuery.isError ? (
                <Alert severity="error">
                    {getWorkspaceMemberErrorMessage(
                        membersQuery.error,
                        "No se pudieron cargar los miembros."
                    )}
                </Alert>
            ) : null}

            {!membersQuery.isLoading &&
                !membersQuery.isError &&
                filteredMembers.length === 0 ? (
                <WorkspaceMembersEmptyState
                    hasFilters={hasFilters}
                    onClearFilters={handleResetFilters}
                />
            ) : null}

            {!membersQuery.isLoading &&
                !membersQuery.isError &&
                filteredMembers.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredMembers.map((member: WorkspaceMemberRecord) => (
                        <Grid key={member.id} size={{ xs: 12, md: 6, xl: 4 }}>
                            <WorkspaceMemberCard
                                member={member}
                                isSelected={selectedMemberId === member.id}
                                onEdit={handleEditMember}
                                onDelete={handleDeleteMember}
                                onChangeStatus={handleChangeStatus}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : null}
        </Page>
    );
}
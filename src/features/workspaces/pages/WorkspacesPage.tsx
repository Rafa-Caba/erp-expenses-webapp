// src/features/workspaces/pages/WorkspacesPage.tsx

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
import { useFilteredWorkspaces } from "../hooks/useFilteredWorkspaces";
import { useWorkspaceStore } from "../store/workspace.store";
import type { WorkspaceListItem } from "../types/workspace.types";
import { WorkspaceCard } from "../components/WorkspaceCard";
import { WorkspacesToolbar } from "../components/WorkspacesToolbar";
import { WorkspacesEmptyState } from "../components/WorkspacesEmptyState";

export function WorkspacesPage() {
    const navigate = useNavigate();

    const searchTerm = useWorkspaceStore((state) => state.searchTerm);
    const includeArchived = useWorkspaceStore((state) => state.includeArchived);
    const includeInactive = useWorkspaceStore((state) => state.includeInactive);
    const selectedWorkspaceId = useWorkspaceStore((state) => state.selectedWorkspaceId);

    const setSearchTerm = useWorkspaceStore((state) => state.setSearchTerm);
    const setIncludeArchived = useWorkspaceStore((state) => state.setIncludeArchived);
    const setIncludeInactive = useWorkspaceStore((state) => state.setIncludeInactive);
    const setSelectedWorkspaceId = useWorkspaceStore((state) => state.setSelectedWorkspaceId);
    const resetWorkspaceUi = useWorkspaceStore((state) => state.reset);

    const setScope = useScopeStore((state) => state.setScope);

    const { filteredWorkspaces, isLoading, isError, error } = useFilteredWorkspaces();

    const hasFilters =
        searchTerm.trim().length > 0 || includeArchived || includeInactive;

    const handleOpenWorkspace = React.useCallback(
        (workspace: WorkspaceListItem) => {
            setSelectedWorkspaceId(workspace.id);

            if (workspace.type === "PERSONAL") {
                setScope({
                    scopeType: "PERSONAL",
                    workspaceId: workspace.id,
                    workspaceType: "PERSONAL",
                });

                navigate("/app/personal/dashboard");
                return;
            }

            setScope({
                scopeType: "WORKSPACE",
                workspaceId: workspace.id,
                workspaceType: workspace.type,
            });

            navigate(`/app/w/${workspace.id}/dashboard`);
        },
        [navigate, setScope, setSelectedWorkspaceId]
    );

    const handleEditWorkspace = React.useCallback(
        (workspace: WorkspaceListItem) => {
            setSelectedWorkspaceId(workspace.id);
            navigate(`/app/workspaces/${workspace.id}/edit`);
        },
        [navigate, setSelectedWorkspaceId]
    );

    const handleResetFilters = React.useCallback(() => {
        resetWorkspaceUi();
    }, [resetWorkspaceUi]);

    return (
        <Page
            title="Workspaces"
            subtitle="Administra y cambia entre tu espacio personal, casa y negocio."
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
            >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Usa esta vista para cambiar de contexto o editar la configuración de cada workspace.
                </Typography>

                <Button variant="contained" onClick={() => navigate("/app/workspaces/new")}>
                    Nuevo workspace
                </Button>
            </Stack>

            <WorkspacesToolbar
                searchTerm={searchTerm}
                includeArchived={includeArchived}
                includeInactive={includeInactive}
                totalCount={filteredWorkspaces.length}
                onSearchTermChange={setSearchTerm}
                onIncludeArchivedChange={setIncludeArchived}
                onIncludeInactiveChange={setIncludeInactive}
                onResetFilters={handleResetFilters}
            />

            {isLoading ? (
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
                                Cargando workspaces…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo tus contextos disponibles.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            ) : null}

            {!isLoading && isError ? (
                <Alert severity="error">
                    {error instanceof Error
                        ? error.message
                        : "Ocurrió un error al cargar los workspaces."}
                </Alert>
            ) : null}

            {!isLoading && !isError && filteredWorkspaces.length === 0 ? (
                <WorkspacesEmptyState
                    hasFilters={hasFilters}
                    onClearFilters={handleResetFilters}
                />
            ) : null}

            {!isLoading && !isError && filteredWorkspaces.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredWorkspaces.map((workspace: WorkspaceListItem) => (
                        <Grid
                            key={workspace.id}
                            size={{ xs: 12, md: 6, xl: 4 }}
                        >
                            <WorkspaceCard
                                workspace={workspace}
                                isSelected={selectedWorkspaceId === workspace.id}
                                onOpen={handleOpenWorkspace}
                                onEdit={handleEditWorkspace}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : null}
        </Page>
    );
}
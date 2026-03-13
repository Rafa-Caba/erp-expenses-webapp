// src/app/layouts/ScopeLayout.tsx

import React from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import type { ScopeType } from "../scope/scope.types";
import { useScopeStore } from "../scope/scope.store";
import type { WorkspaceListItem } from "../../features/workspaces/types/workspace.types";
import { useMyWorkspacesQuery } from "../../features/workspaces/hooks/useWorkspacesQuery";

type ScopeLayoutProps = {
    scopeType: ScopeType;
};

export function ScopeLayout({ scopeType }: ScopeLayoutProps) {
    const params = useParams<{ workspaceId: string }>();
    const setScope = useScopeStore((state) => state.setScope);

    const { data, isLoading } = useMyWorkspacesQuery();

    const workspaces: WorkspaceListItem[] = data?.workspaces ?? [];

    const resolvedWorkspace = React.useMemo(() => {
        if (scopeType === "PERSONAL") {
            return workspaces.find((workspace: WorkspaceListItem) => workspace.type === "PERSONAL") ?? null;
        }

        const routeWorkspaceId = params.workspaceId ?? null;

        if (routeWorkspaceId === null) {
            return null;
        }

        return (
            workspaces.find((workspace: WorkspaceListItem) => workspace.id === routeWorkspaceId) ?? null
        );
    }, [params.workspaceId, scopeType, workspaces]);

    React.useEffect(() => {
        if (!resolvedWorkspace) {
            return;
        }

        if (scopeType === "PERSONAL" && resolvedWorkspace.type !== "PERSONAL") {
            return;
        }

        if (scopeType === "WORKSPACE" && resolvedWorkspace.type === "PERSONAL") {
            return;
        }

        setScope({
            scopeType,
            workspaceId: resolvedWorkspace.id,
            workspaceType: resolvedWorkspace.type,
        });
    }, [resolvedWorkspace, scopeType, setScope]);

    if (isLoading) {
        return (
            <Box sx={{ minHeight: "50vh", display: "grid", placeItems: "center", p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CircularProgress />
                    <Box>
                        <Typography sx={{ fontWeight: 700 }}>Cargando contexto…</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Resolviendo el workspace activo.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    if (scopeType === "PERSONAL") {
        if (!resolvedWorkspace) {
            return <Navigate to="/app/workspaces" replace />;
        }

        return <Outlet />;
    }

    if (!params.workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    if (!resolvedWorkspace) {
        return <Navigate to="/app/workspaces" replace />;
    }

    if (resolvedWorkspace.type === "PERSONAL") {
        return <Navigate to="/app/personal/dashboard" replace />;
    }

    return <Outlet />;
}
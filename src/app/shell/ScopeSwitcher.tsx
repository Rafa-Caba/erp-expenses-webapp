// src/app/shell/ScopeSwitcher.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import { useScopeStore } from "../scope/scope.store";
import type { WorkspaceListItem } from "../../features/workspaces/types/workspace.types";
import { useMyWorkspacesQuery } from "../../features/workspaces/hooks/useWorkspacesQuery";

function getWorkspaceTypeLabel(workspaceType: "PERSONAL" | "HOUSEHOLD" | "BUSINESS"): string {
    switch (workspaceType) {
        case "PERSONAL":
            return "Personal";
        case "HOUSEHOLD":
            return "Casa";
        case "BUSINESS":
            return "Negocio";
    }
}

export function ScopeSwitcher() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);
    const setScope = useScopeStore((state) => state.setScope);

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const { data, isLoading } = useMyWorkspacesQuery();

    const workspaces: WorkspaceListItem[] = data?.workspaces ?? [];

    const personalWorkspace: WorkspaceListItem | null =
        workspaces.find((workspace: WorkspaceListItem) => workspace.type === "PERSONAL") ?? null;

    const currentWorkspace: WorkspaceListItem | null =
        scopeType === "PERSONAL"
            ? personalWorkspace
            : workspaces.find((workspace: WorkspaceListItem) => workspace.id === workspaceId) ?? null;

    const nonPersonalWorkspaces: WorkspaceListItem[] = workspaces.filter(
        (workspace: WorkspaceListItem) => workspace.type !== "PERSONAL"
    );

    const currentLabel =
        scopeType === "PERSONAL"
            ? "Personal"
            : currentWorkspace?.name ?? "Workspace";

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const goPersonal = () => {
        if (!personalWorkspace) {
            closeMenu();
            return;
        }

        setScope({
            scopeType: "PERSONAL",
            workspaceId: personalWorkspace.id,
            workspaceType: "PERSONAL",
        });

        navigate("/app/personal/dashboard");
        closeMenu();
    };

    const goWorkspace = (nextWorkspaceId: string) => {
        const nextWorkspace: WorkspaceListItem | null =
            workspaces.find((workspace: WorkspaceListItem) => workspace.id === nextWorkspaceId) ?? null;

        if (!nextWorkspace) {
            closeMenu();
            return;
        }

        if (nextWorkspace.type === "PERSONAL") {
            goPersonal();
            return;
        }

        setScope({
            scopeType: "WORKSPACE",
            workspaceId: nextWorkspace.id,
            workspaceType: nextWorkspace.type,
        });

        navigate(`/app/w/${nextWorkspace.id}/dashboard`);
        closeMenu();
    };

    return (
        <>
            <Button
                color="inherit"
                variant="outlined"
                size="small"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                sx={{ textTransform: "none" }}
            >
                {currentLabel}
            </Button>

            <Menu anchorEl={anchorEl} open={open} onClose={closeMenu}>
                <MenuItem onClick={goPersonal} disabled={!personalWorkspace}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Personal
                    </Typography>
                </MenuItem>

                <Divider />

                <MenuItem disabled>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Workspaces
                    </Typography>
                </MenuItem>

                {isLoading ? (
                    <MenuItem disabled>Cargando…</MenuItem>
                ) : nonPersonalWorkspaces.length > 0 ? (
                    nonPersonalWorkspaces.map((workspace: WorkspaceListItem) => (
                        <MenuItem
                            key={workspace.id}
                            onClick={() => goWorkspace(workspace.id)}
                        >
                            {getWorkspaceTypeLabel(workspace.type)}: {workspace.name}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>No tienes workspaces aún</MenuItem>
                )}
            </Menu>
        </>
    );
}
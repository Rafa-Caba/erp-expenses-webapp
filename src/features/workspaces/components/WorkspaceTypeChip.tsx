// src/features/workspaces/components/WorkspaceTypeChip.tsx

import Chip from "@mui/material/Chip";

import type { WorkspaceType } from "../../../shared/types/common.types";

type WorkspaceTypeChipProps = {
    workspaceType: WorkspaceType;
};

function getWorkspaceTypeLabel(workspaceType: WorkspaceType): string {
    switch (workspaceType) {
        case "PERSONAL":
            return "Personal";
        case "HOUSEHOLD":
            return "Casa";
        case "BUSINESS":
            return "Negocio";
    }
}

function getWorkspaceTypeColor(
    workspaceType: WorkspaceType
): "default" | "primary" | "secondary" | "success" {
    switch (workspaceType) {
        case "PERSONAL":
            return "primary";
        case "HOUSEHOLD":
            return "success";
        case "BUSINESS":
            return "secondary";
    }
}

export function WorkspaceTypeChip({ workspaceType }: WorkspaceTypeChipProps) {
    return (
        <Chip
            size="small"
            color={getWorkspaceTypeColor(workspaceType)}
            label={getWorkspaceTypeLabel(workspaceType)}
        />
    );
}
// src/features/workspaces/components/WorkspaceMemberStatusChip.tsx

import Chip from "@mui/material/Chip";

import type { MemberStatus } from "../../../shared/types/common.types";

type WorkspaceMemberStatusChipProps = {
    status: MemberStatus;
};

function getStatusLabel(status: MemberStatus): string {
    switch (status) {
        case "active":
            return "Activo";
        case "invited":
            return "Invitado";
        case "disabled":
            return "Deshabilitado";
    }
}

function getStatusColor(
    status: MemberStatus
): "default" | "success" | "warning" | "error" {
    switch (status) {
        case "active":
            return "success";
        case "invited":
            return "warning";
        case "disabled":
            return "error";
    }
}

export function WorkspaceMemberStatusChip({ status }: WorkspaceMemberStatusChipProps) {
    return <Chip size="small" color={getStatusColor(status)} label={getStatusLabel(status)} />;
}
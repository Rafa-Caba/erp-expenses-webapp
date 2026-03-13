// src/features/workspaces/components/WorkspaceMemberRoleChip.tsx

import Chip from "@mui/material/Chip";

import type { MemberRole } from "../../../shared/types/common.types";

type WorkspaceMemberRoleChipProps = {
    role: MemberRole;
};

function getRoleLabel(role: MemberRole): string {
    switch (role) {
        case "OWNER":
            return "Owner";
        case "ADMIN":
            return "Admin";
        case "MEMBER":
            return "Miembro";
        case "VIEWER":
            return "Viewer";
    }
}

function getRoleColor(
    role: MemberRole
): "default" | "primary" | "secondary" | "success" | "warning" {
    switch (role) {
        case "OWNER":
            return "warning";
        case "ADMIN":
            return "secondary";
        case "MEMBER":
            return "primary";
        case "VIEWER":
            return "default";
    }
}

export function WorkspaceMemberRoleChip({ role }: WorkspaceMemberRoleChipProps) {
    return <Chip size="small" color={getRoleColor(role)} label={getRoleLabel(role)} />;
}
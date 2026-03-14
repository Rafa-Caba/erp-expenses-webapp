// src/features/adminUsers/components/UserRoleChip.tsx

import Chip from "@mui/material/Chip";

import type { UserRole } from "../../../shared/types/common.types";

type UserRoleChipProps = {
    role: UserRole;
};

function getRoleLabel(role: UserRole): string {
    switch (role) {
        case "ADMIN":
            return "Admin";
        case "USER":
            return "Usuario";
    }
}

function getRoleColor(role: UserRole): "default" | "primary" {
    switch (role) {
        case "ADMIN":
            return "primary";
        case "USER":
            return "default";
    }
}

export function UserRoleChip({ role }: UserRoleChipProps) {
    return (
        <Chip
            label={getRoleLabel(role)}
            color={getRoleColor(role)}
            size="small"
            variant={role === "ADMIN" ? "filled" : "outlined"}
        />
    );
}
// src/features/adminUsers/components/UserStatusChip.tsx

import Chip from "@mui/material/Chip";

type UserStatusChipProps = {
    isActive: boolean;
};

export function UserStatusChip({ isActive }: UserStatusChipProps) {
    return (
        <Chip
            label={isActive ? "Activo" : "Inactivo"}
            color={isActive ? "success" : "default"}
            size="small"
            variant={isActive ? "filled" : "outlined"}
        />
    );
}
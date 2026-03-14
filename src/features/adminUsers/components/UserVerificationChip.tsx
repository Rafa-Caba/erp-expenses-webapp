// src/features/adminUsers/components/UserVerificationChip.tsx

import Chip from "@mui/material/Chip";

type UserVerificationChipProps = {
    isEmailVerified: boolean;
};

export function UserVerificationChip({ isEmailVerified }: UserVerificationChipProps) {
    return (
        <Chip
            label={isEmailVerified ? "Email verificado" : "Email no verificado"}
            color={isEmailVerified ? "info" : "warning"}
            size="small"
            variant="outlined"
        />
    );
}
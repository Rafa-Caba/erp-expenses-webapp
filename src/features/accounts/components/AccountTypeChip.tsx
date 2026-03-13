// src/features/accounts/components/AccountTypeChip.tsx

import Chip from "@mui/material/Chip";

import type { AccountType } from "../types/account.types";

type AccountTypeChipProps = {
    type: AccountType;
};

function getAccountTypeLabel(type: AccountType): string {
    switch (type) {
        case "cash":
            return "Efectivo";
        case "bank":
            return "Banco";
        case "wallet":
            return "Wallet";
        case "savings":
            return "Ahorro";
        case "credit":
            return "Crédito";
    }
}

function getAccountTypeColor(
    type: AccountType
): "default" | "primary" | "secondary" | "success" | "warning" {
    switch (type) {
        case "cash":
            return "default";
        case "bank":
            return "primary";
        case "wallet":
            return "secondary";
        case "savings":
            return "success";
        case "credit":
            return "warning";
    }
}

export function AccountTypeChip({ type }: AccountTypeChipProps) {
    return <Chip size="small" color={getAccountTypeColor(type)} label={getAccountTypeLabel(type)} />;
}
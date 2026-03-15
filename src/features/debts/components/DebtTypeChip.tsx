// src/features/debts/components/DebtTypeChip.tsx

import Chip from "@mui/material/Chip";

import type { DebtType } from "../types/debt.types";

type DebtTypeChipProps = {
    type: DebtType;
};

function getDebtTypeLabel(type: DebtType): string {
    switch (type) {
        case "owed_by_me":
            return "Debo";
        case "owed_to_me":
            return "Me deben";
    }
}

function getDebtTypeColor(
    type: DebtType
): "default" | "primary" | "secondary" | "success" | "warning" {
    switch (type) {
        case "owed_by_me":
            return "warning";
        case "owed_to_me":
            return "success";
    }
}

export function DebtTypeChip({ type }: DebtTypeChipProps) {
    return (
        <Chip
            size="small"
            color={getDebtTypeColor(type)}
            label={getDebtTypeLabel(type)}
        />
    );
}
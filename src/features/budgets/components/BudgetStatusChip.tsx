// src/features/budgets/components/BudgetStatusChip.tsx

import Chip from "@mui/material/Chip";

import type { BudgetStatus } from "../types/budget.types";

type BudgetStatusChipProps = {
    status: BudgetStatus;
};

function getBudgetStatusLabel(status: BudgetStatus): string {
    switch (status) {
        case "draft":
            return "Borrador";
        case "active":
            return "Activo";
        case "completed":
            return "Completado";
        case "exceeded":
            return "Excedido";
        case "archived":
            return "Archivado";
        default:
            return "Activo";
    }
}

function getBudgetStatusColor(
    status: BudgetStatus
): "default" | "success" | "info" | "warning" | "error" {
    switch (status) {
        case "draft":
            return "warning";
        case "active":
            return "success";
        case "completed":
            return "info";
        case "exceeded":
            return "error";
        case "archived":
            return "default";
        default:
            return "default";
    }
}

export function BudgetStatusChip({ status }: BudgetStatusChipProps) {
    return (
        <Chip
            label={getBudgetStatusLabel(status)}
            color={getBudgetStatusColor(status)}
            size="small"
            variant={status === "archived" ? "outlined" : "filled"}
        />
    );
}
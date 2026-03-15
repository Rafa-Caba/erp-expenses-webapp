// src/features/debts/components/DebtStatusChip.tsx

import Chip from "@mui/material/Chip";

import type { DebtStatus } from "../types/debt.types";

type DebtStatusChipProps = {
    status: DebtStatus;
};

function getDebtStatusLabel(status: DebtStatus): string {
    switch (status) {
        case "active":
            return "Activa";
        case "paid":
            return "Pagada";
        case "overdue":
            return "Vencida";
        case "cancelled":
            return "Cancelada";
    }
}

function getDebtStatusColor(
    status: DebtStatus
): "default" | "primary" | "secondary" | "success" | "warning" | "error" {
    switch (status) {
        case "active":
            return "primary";
        case "paid":
            return "success";
        case "overdue":
            return "error";
        case "cancelled":
            return "default";
    }
}

export function DebtStatusChip({ status }: DebtStatusChipProps) {
    return (
        <Chip
            size="small"
            color={getDebtStatusColor(status)}
            label={getDebtStatusLabel(status)}
        />
    );
}
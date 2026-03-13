// src/features/budgets/components/BudgetPeriodChip.tsx

import Chip from "@mui/material/Chip";

import type { BudgetPeriodType } from "../types/budget.types";

type BudgetPeriodChipProps = {
    periodType: BudgetPeriodType;
};

function getBudgetPeriodLabel(periodType: BudgetPeriodType): string {
    switch (periodType) {
        case "weekly":
            return "Semanal";
        case "monthly":
            return "Mensual";
        case "yearly":
            return "Anual";
        case "custom":
            return "Personalizado";
        default:
            return "Personalizado";
    }
}

export function BudgetPeriodChip({ periodType }: BudgetPeriodChipProps) {
    return <Chip label={getBudgetPeriodLabel(periodType)} size="small" variant="outlined" />;
}
// src/features/transactions/components/TransactionTypeChip.tsx

import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";

import type { TransactionType } from "../../../shared/types/common.types";

type TransactionTypeChipProps = {
    type: TransactionType;
};

function getTransactionTypeLabel(type: TransactionType): string {
    switch (type) {
        case "expense":
            return "Gasto";
        case "income":
            return "Ingreso";
        case "debt_payment":
            return "Pago de deuda";
        case "transfer":
            return "Transferencia";
        case "adjustment":
            return "Ajuste";
    }
}

function getTransactionTypeColor(type: TransactionType): ChipProps["color"] {
    switch (type) {
        case "expense":
            return "error";
        case "income":
            return "success";
        case "debt_payment":
            return "warning";
        case "transfer":
            return "info";
        case "adjustment":
            return "default";
    }
}

export function TransactionTypeChip({ type }: TransactionTypeChipProps) {
    return (
        <Chip
            size="small"
            color={getTransactionTypeColor(type)}
            label={getTransactionTypeLabel(type)}
        />
    );
}
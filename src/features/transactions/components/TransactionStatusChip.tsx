// src/features/transactions/components/TransactionStatusChip.tsx

import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";

import type { TransactionStatus } from "../types/transaction.types";

type TransactionStatusChipProps = {
    status: TransactionStatus;
};

function getTransactionStatusLabel(status: TransactionStatus): string {
    switch (status) {
        case "pending":
            return "Pendiente";
        case "posted":
            return "Aplicada";
        case "cancelled":
            return "Cancelada";
    }
}

function getTransactionStatusColor(status: TransactionStatus): ChipProps["color"] {
    switch (status) {
        case "pending":
            return "warning";
        case "posted":
            return "success";
        case "cancelled":
            return "default";
    }
}

export function TransactionStatusChip({ status }: TransactionStatusChipProps) {
    return (
        <Chip
            size="small"
            variant="outlined"
            color={getTransactionStatusColor(status)}
            label={getTransactionStatusLabel(status)}
        />
    );
}
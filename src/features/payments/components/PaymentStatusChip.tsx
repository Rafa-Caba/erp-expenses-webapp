// src/features/payments/components/PaymentStatusChip.tsx

import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";

import type { PaymentStatus } from "../types/payment.types";

type PaymentStatusChipProps = {
    status: PaymentStatus;
};

function getStatusLabel(status: PaymentStatus): string {
    switch (status) {
        case "pending":
            return "Pendiente";
        case "completed":
            return "Completado";
        case "failed":
            return "Fallido";
        case "cancelled":
            return "Cancelado";
    }
}

function getStatusColor(status: PaymentStatus): ChipProps["color"] {
    switch (status) {
        case "pending":
            return "warning";
        case "completed":
            return "success";
        case "failed":
            return "error";
        case "cancelled":
            return "default";
    }
}

export function PaymentStatusChip({ status }: PaymentStatusChipProps) {
    return (
        <Chip
            size="small"
            color={getStatusColor(status)}
            label={getStatusLabel(status)}
        />
    );
}
// src/features/payments/components/PaymentMethodChip.tsx

import Chip from "@mui/material/Chip";

import type { PaymentMethod } from "../types/payment.types";

type PaymentMethodChipProps = {
    method: PaymentMethod | null;
};

function getMethodLabel(method: PaymentMethod | null): string {
    switch (method) {
        case "cash":
            return "Efectivo";
        case "bank_transfer":
            return "Transferencia";
        case "card":
            return "Tarjeta";
        case "check":
            return "Cheque";
        case "other":
            return "Otro";
        case null:
            return "Sin método";
    }
}

export function PaymentMethodChip({ method }: PaymentMethodChipProps) {
    return (
        <Chip
            size="small"
            variant="outlined"
            label={getMethodLabel(method)}
        />
    );
}
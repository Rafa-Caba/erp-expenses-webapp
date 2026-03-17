// src/features/components/WorkspacePaymentSelect.tsx

import { useId } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { usePaymentsQuery } from "../payments/hooks/usePaymentsQuery";
import type {
    PaymentRecord,
    PaymentStatus,
} from "../payments/types/payment.types";

type WorkspacePaymentSelectProps = {
    workspaceId: string | null;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    error?: boolean;
    allowEmpty?: boolean;
    emptyOptionLabel?: string;
    statusFilter?: PaymentStatus | "ALL";
    includeHidden?: boolean;
};

function formatMoney(amount: number, currency: string): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(new Date(value));
}

function getPaymentOptionLabel(payment: PaymentRecord): string {
    return [
        payment.reference ?? "Sin referencia",
        formatMoney(payment.amount, payment.currency),
        formatDate(payment.paymentDate),
    ].join(" • ");
}

function matchesFilters(
    payment: PaymentRecord,
    statusFilter: PaymentStatus | "ALL",
    includeHidden: boolean
): boolean {
    if (!includeHidden && !payment.isVisible) {
        return false;
    }

    if (statusFilter !== "ALL" && payment.status !== statusFilter) {
        return false;
    }

    return true;
}

function buildSortedPayments(
    payments: PaymentRecord[],
    statusFilter: PaymentStatus | "ALL",
    includeHidden: boolean
): PaymentRecord[] {
    return [...payments]
        .filter((payment) => matchesFilters(payment, statusFilter, includeHidden))
        .sort((left, right) => {
            const leftDate = new Date(left.paymentDate).getTime();
            const rightDate = new Date(right.paymentDate).getTime();

            return rightDate - leftDate;
        });
}

function PaymentOptionContent({
    payment,
}: {
    payment: PaymentRecord;
}) {
    return (
        <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                {getPaymentOptionLabel(payment)}
            </Typography>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 0.25 }}>
                <Typography variant="caption" sx={{ opacity: 0.72 }}>
                    {payment.status}
                </Typography>
            </Stack>
        </Box>
    );
}

export function WorkspacePaymentSelect({
    workspaceId,
    value,
    onChange,
    label = "Pago",
    helperText,
    disabled = false,
    error = false,
    allowEmpty = true,
    emptyOptionLabel = "Sin pago específico",
    statusFilter = "ALL",
    includeHidden = true,
}: WorkspacePaymentSelectProps) {
    const selectId = useId();
    const labelId = `${selectId}-label`;

    const paymentsQuery = usePaymentsQuery(workspaceId);
    const allPayments = paymentsQuery.data?.payments ?? [];

    const payments = buildSortedPayments(allPayments, statusFilter, includeHidden);

    const selectedPayment =
        allPayments.find((payment) => payment._id === value) ?? null;

    const selectedIsInVisibleCollection = payments.some(
        (payment) => payment._id === value
    );

    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    const isDisabled = disabled || workspaceId === null || paymentsQuery.isLoading;

    const resolvedHelperText = (() => {
        if (workspaceId === null) {
            return "Primero debe existir un workspace activo.";
        }

        if (paymentsQuery.isError) {
            return "No se pudieron cargar los pagos del workspace.";
        }

        if (paymentsQuery.isLoading) {
            return "Cargando pagos...";
        }

        if (payments.length === 0) {
            return "No hay pagos disponibles con los filtros actuales.";
        }

        return helperText;
    })();

    return (
        <FormControl fullWidth error={error} disabled={isDisabled}>
            <InputLabel id={labelId}>{label}</InputLabel>

            <Select
                labelId={labelId}
                label={label}
                value={value}
                onChange={handleChange}
                renderValue={(selectedValue) => {
                    if (!selectedValue) {
                        return emptyOptionLabel;
                    }

                    const currentPayment =
                        allPayments.find((payment) => payment._id === selectedValue) ??
                        selectedPayment;

                    if (!currentPayment) {
                        return selectedValue;
                    }

                    return <PaymentOptionContent payment={currentPayment} />;
                }}
            >
                {allowEmpty ? <MenuItem value="">{emptyOptionLabel}</MenuItem> : null}

                {!selectedIsInVisibleCollection && selectedPayment ? (
                    <MenuItem value={selectedPayment._id}>
                        <PaymentOptionContent payment={selectedPayment} />
                    </MenuItem>
                ) : null}

                {payments.map((payment) => (
                    <MenuItem key={payment._id} value={payment._id}>
                        <PaymentOptionContent payment={payment} />
                    </MenuItem>
                ))}
            </Select>

            {resolvedHelperText ? <FormHelperText>{resolvedHelperText}</FormHelperText> : null}
        </FormControl>
    );
}
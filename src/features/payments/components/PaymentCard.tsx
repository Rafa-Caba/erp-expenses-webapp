// src/features/payments/components/PaymentCard.tsx
// Payment card with cashflow and debt breakdown visibility.
// Fase 5 note: amount is total cashflow; principalAmount reduces debt;
// feeAmount is debt cost and does not reduce the debt balance.

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { CashflowDirection } from "../../../shared/types/common.types";
import { useAccountLabelById } from "../../../shared/utils/labels/account-label.util";
import { useCardLabelById } from "../../../shared/utils/labels/card-label.util";
import { useDebtLabelById } from "../../../shared/utils/labels/debt-label.util";
import { useTransactionLabelById } from "../../../shared/utils/labels/transaction-label.util";
import { useWorkspaceMemberLabelById } from "../../../shared/utils/labels/workspace-member-label.util";
import type { PaymentRecord } from "../types/payment.types";
import { PaymentMethodChip } from "./PaymentMethodChip";
import { PaymentStatusChip } from "./PaymentStatusChip";

type PaymentCardProps = {
    payment: PaymentRecord;
    isSelected: boolean;
    onEdit: (payment: PaymentRecord) => void;
    onDelete: (payment: PaymentRecord) => void;
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

function getVisibilityLabel(isVisible: boolean): string {
    return isVisible ? "Visible" : "Oculto";
}

function getCashflowDirectionLabel(direction: CashflowDirection | null): string {
    if (direction === "in") {
        return "Entrada";
    }

    if (direction === "out") {
        return "Salida";
    }

    return "Sin dirección";
}

function getCashflowChipColor(
    direction: CashflowDirection | null
): "success" | "warning" | "default" {
    if (direction === "in") {
        return "success";
    }

    if (direction === "out") {
        return "warning";
    }

    return "default";
}

function getSourceLabel(args: {
    accountLabel: string | null;
    cardLabel: string | null;
    payment: PaymentRecord;
}): string {
    const { accountLabel, cardLabel, payment } = args;

    if (payment.accountId) {
        return `Cuenta: ${accountLabel ?? payment.accountId}`;
    }

    if (payment.cardId) {
        return `Tarjeta: ${cardLabel ?? payment.cardId}`;
    }

    return "Sin fuente vinculada";
}

export function PaymentCard({
    payment,
    isSelected,
    onEdit,
    onDelete,
}: PaymentCardProps) {
    const memberLabel = useWorkspaceMemberLabelById(
        payment.workspaceId,
        payment.memberId
    ).label;

    const debtLabel = useDebtLabelById(
        payment.workspaceId,
        payment.debtId
    ).label;

    const transactionLabel = useTransactionLabelById(
        payment.workspaceId,
        payment.transactionId
    ).label;

    const accountLabel = useAccountLabelById(
        payment.workspaceId,
        payment.accountId
    ).label;

    const cardLabel = useCardLabelById(
        payment.workspaceId,
        payment.cardId
    ).label;

    const principalAmount = payment.principalAmount ?? payment.amount;
    const feeAmount = payment.feeAmount ?? 0;

    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                borderRadius: 3,
                borderColor: isSelected ? "primary.main" : "divider",
                boxShadow: isSelected ? 3 : 0,
            }}
        >
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <PaymentStatusChip status={payment.status} />
                    <PaymentMethodChip method={payment.method} />
                    <Chip
                        size="small"
                        color={getCashflowChipColor(payment.cashflowDirection)}
                        variant="outlined"
                        label={getCashflowDirectionLabel(payment.cashflowDirection)}
                    />
                    <Chip
                        size="small"
                        variant="outlined"
                        label={getVisibilityLabel(payment.isVisible)}
                    />
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {formatMoney(payment.amount, payment.currency)}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Fecha:</strong> {formatDate(payment.paymentDate)}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Fuente/recepción:</strong>{" "}
                        {getSourceLabel({ accountLabel, cardLabel, payment })}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Monto total movido:</strong>{" "}
                        {formatMoney(payment.amount, payment.currency)}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Reduce deuda:</strong>{" "}
                        {formatMoney(principalAmount, payment.currency)}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Cargos/intereses/comisiones:</strong>{" "}
                        {formatMoney(feeAmount, payment.currency)}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Deuda:</strong> {debtLabel}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Miembro:</strong> {memberLabel ?? "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Transacción:</strong> {transactionLabel ?? "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Referencia:</strong> {payment.reference ?? "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Notas:</strong> {payment.notes ?? "—"}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                <Button variant="outlined" fullWidth onClick={() => onEdit(payment)}>
                    Editar
                </Button>

                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => onDelete(payment)}
                >
                    Eliminar
                </Button>
            </CardActions>
        </Card>
    );
}
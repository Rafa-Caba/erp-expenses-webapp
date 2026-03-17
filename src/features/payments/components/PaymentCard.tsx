// src/features/payments/components/PaymentCard.tsx

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { PaymentRecord } from "../types/payment.types";
import { PaymentMethodChip } from "./PaymentMethodChip";
import { PaymentStatusChip } from "./PaymentStatusChip";
import { useWorkspaceMemberLabelById } from "../../../shared/utils/labels/workspace-member-label.util";
import { useDebtLabelById } from "../../../shared/utils/labels/debt-label.util";
import { useTransactionLabelById } from "../../../shared/utils/labels/transaction-label.util";

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

function getSourceLabel(payment: PaymentRecord): string {
    if (payment.accountId) {
        return `Cuenta: ${payment.accountId}`;
    }

    if (payment.cardId) {
        return `Tarjeta: ${payment.cardId}`;
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
                        <strong>Fuente:</strong> {getSourceLabel(payment)}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Debt ID:</strong> {debtLabel}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Member ID:</strong> {memberLabel ?? "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Transaction ID:</strong> {transactionLabel ?? "—"}
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
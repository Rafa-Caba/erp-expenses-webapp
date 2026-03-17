// src/features/transactions/components/TransactionCard.tsx

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { TransactionRecord } from "../types/transaction.types";
import { TransactionStatusChip } from "./TransactionStatusChip";
import { TransactionTypeChip } from "./TransactionTypeChip";

type TransactionCardProps = {
    transaction: TransactionRecord;
    isSelected: boolean;
    onEdit: (transaction: TransactionRecord) => void;
    onArchive: (transaction: TransactionRecord) => void;
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
    return isVisible ? "Visible" : "Oculta";
}

function getSourceSummary(transaction: TransactionRecord): string {
    if (transaction.type === "transfer") {
        return `Origen: ${transaction.accountId ?? "—"} → Destino: ${transaction.destinationAccountId ?? "—"}`;
    }

    if (transaction.type === "debt_payment") {
        return `Cuenta: ${transaction.accountId ?? "—"} • Tarjeta: ${transaction.cardId ?? "—"}`;
    }

    if (transaction.cardId) {
        return `Tarjeta: ${transaction.cardId}`;
    }

    if (transaction.accountId) {
        return `Cuenta: ${transaction.accountId}`;
    }

    return "Sin fuente";
}

export function TransactionCard({
    transaction,
    isSelected,
    onEdit,
    onArchive,
}: TransactionCardProps) {
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
                    <TransactionTypeChip type={transaction.type} />
                    <TransactionStatusChip status={transaction.status} />
                    <Chip
                        size="small"
                        variant="outlined"
                        label={getVisibilityLabel(transaction.isVisible)}
                    />
                    {transaction.isRecurring ? (
                        <Chip size="small" variant="outlined" label="Recurrente" />
                    ) : null}
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {formatMoney(transaction.amount, transaction.currency)}
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {transaction.description}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Fecha:</strong> {formatDate(transaction.transactionDate)}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Fuente:</strong> {getSourceSummary(transaction)}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Miembro:</strong> {transaction.memberId}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Categoría:</strong> {transaction.categoryId ?? "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Merchant:</strong> {transaction.merchant ?? "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Referencia:</strong> {transaction.reference ?? "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Notas:</strong> {transaction.notes ?? "—"}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                <Button variant="outlined" fullWidth onClick={() => onEdit(transaction)}>
                    Editar
                </Button>

                <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    onClick={() => onArchive(transaction)}
                >
                    Archivar
                </Button>
            </CardActions>
        </Card>
    );
}
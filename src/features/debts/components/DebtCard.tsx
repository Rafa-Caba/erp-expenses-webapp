// src/features/debts/components/DebtCard.tsx

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { DebtRecord } from "../types/debt.types";
import { DebtStatusChip } from "./DebtStatusChip";
import { DebtTypeChip } from "./DebtTypeChip";

type DebtCardProps = {
    debt: DebtRecord;
    memberName: string | null;
    accountName: string | null;
    isSelected: boolean;
    onEdit: (debt: DebtRecord) => void;
    onDelete: (debt: DebtRecord) => void;
};

function formatCurrencyAmount(amount: number, currency: string): string {
    try {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${amount.toFixed(2)} ${currency}`;
    }
}

function formatDateValue(value: string | null): string {
    if (!value) {
        return "—";
    }

    try {
        return new Intl.DateTimeFormat("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(new Date(value));
    } catch {
        return value.slice(0, 10);
    }
}

export function DebtCard({
    debt,
    memberName,
    accountName,
    isSelected,
    onEdit,
    onDelete,
}: DebtCardProps) {
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
                    <DebtTypeChip type={debt.type} />
                    <DebtStatusChip status={debt.status} />
                    <Chip
                        size="small"
                        variant="outlined"
                        label={debt.isVisible ? "Visible" : "Oculta"}
                    />
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {debt.personName}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Descripción:</strong> {debt.description}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Original:</strong>{" "}
                        {formatCurrencyAmount(debt.originalAmount, debt.currency)}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Restante:</strong>{" "}
                        {formatCurrencyAmount(debt.remainingAmount, debt.currency)}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Moneda:</strong> {debt.currency}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Miembro:</strong> {memberName ?? "Sin miembro específico"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Cuenta relacionada:</strong>{" "}
                        {accountName ?? "Sin cuenta relacionada"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Contacto:</strong>{" "}
                        {debt.personContact?.trim() ? debt.personContact : "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Inicio:</strong> {formatDateValue(debt.startDate)}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Vencimiento:</strong> {formatDateValue(debt.dueDate)}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Notas:</strong> {debt.notes?.trim() ? debt.notes : "—"}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                <Button variant="outlined" fullWidth onClick={() => onEdit(debt)}>
                    Editar
                </Button>

                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => onDelete(debt)}
                >
                    Eliminar
                </Button>
            </CardActions>
        </Card>
    );
}
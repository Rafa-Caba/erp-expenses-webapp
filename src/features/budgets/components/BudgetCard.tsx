// src/features/budgets/components/BudgetCard.tsx

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { BudgetRecord } from "../types/budget.types";
import { BudgetPeriodChip } from "./BudgetPeriodChip";
import { BudgetStatusChip } from "./BudgetStatusChip";

type BudgetCardProps = {
    budget: BudgetRecord;
    isSelected: boolean;
    onEdit: (budget: BudgetRecord) => void;
    onDelete: (budget: BudgetRecord) => void;
};

function formatMoney(value: number, currency: BudgetRecord["currency"]): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

function formatDateRange(startDate: string, endDate: string): string {
    const formatter = new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return `${formatter.format(new Date(startDate))} — ${formatter.format(new Date(endDate))}`;
}

function getProgressColor(
    budget: BudgetRecord
): "primary" | "success" | "warning" | "error" {
    if (budget.isExceeded) {
        return "error";
    }

    if (budget.hasReachedAlert) {
        return "warning";
    }

    if (budget.usagePercent <= 35) {
        return "success";
    }

    return "primary";
}

export function BudgetCard({ budget, isSelected, onEdit, onDelete }: BudgetCardProps) {
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
            <CardContent sx={{ display: "grid", gap: 2 }}>
                <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    alignItems="flex-start"
                    flexWrap="wrap"
                >
                    <Stack spacing={0.75}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            {budget.name}
                        </Typography>

                        <Typography variant="body2" sx={{ opacity: 0.75 }}>
                            {formatDateRange(budget.startDate, budget.endDate)}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <BudgetPeriodChip periodType={budget.periodType} />
                        <BudgetStatusChip status={budget.computedStatus} />
                    </Stack>
                </Stack>

                <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                        <Typography variant="body2">
                            <strong>Límite:</strong>{" "}
                            {formatMoney(budget.limitAmount, budget.currency)}
                        </Typography>

                        <Typography variant="body2">
                            <strong>Uso:</strong> {budget.usagePercent.toFixed(2)}%
                        </Typography>
                    </Stack>

                    <LinearProgress
                        variant="determinate"
                        value={Math.max(0, Math.min(100, budget.usagePercent))}
                        color={getProgressColor(budget)}
                        sx={{ height: 10, borderRadius: 999 }}
                    />

                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                        <Typography variant="body2">
                            <strong>Gastado:</strong>{" "}
                            {formatMoney(budget.spentAmount, budget.currency)}
                        </Typography>

                        <Typography variant="body2">
                            <strong>Restante:</strong>{" "}
                            {formatMoney(budget.remainingAmount, budget.currency)}
                        </Typography>
                    </Stack>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Moneda:</strong> {budget.currency}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Categoría:</strong> {budget.categoryId ?? "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Miembro:</strong> {budget.memberId ?? "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Alerta:</strong>{" "}
                        {budget.alertPercent !== null ? `${budget.alertPercent}%` : "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Transacciones ligadas:</strong> {budget.matchedTransactionCount}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Activo:</strong> {budget.isActive ? "Sí" : "No"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Visible:</strong> {budget.isVisible ? "Sí" : "No"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Notas:</strong> {budget.notes?.trim() ? budget.notes : "—"}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                <Button variant="outlined" fullWidth onClick={() => onEdit(budget)}>
                    Editar
                </Button>

                <Button variant="outlined" color="error" fullWidth onClick={() => onDelete(budget)}>
                    Eliminar
                </Button>
            </CardActions>
        </Card>
    );
}
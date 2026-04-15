// src/features/dashboard/components/DashboardBudgetHealth.tsx

import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { formatDashboardAmount } from "../services/dashboard.service";
import type { BudgetSummaryItem, BudgetSummaryReport } from "../../reports/types/report.types";

type DashboardBudgetHealthProps = {
    summary: BudgetSummaryReport;
    currency: "ALL" | "MXN" | "USD";
};

function getBudgetStatusLabel(item: BudgetSummaryItem): string {
    if (item.isExceeded) {
        return "Excedido";
    }

    if (item.hasReachedAlert) {
        return "En alerta";
    }

    return "Saludable";
}

function getBudgetStatusColor(
    item: BudgetSummaryItem
): "error" | "warning" | "success" {
    if (item.isExceeded) {
        return "error";
    }

    if (item.hasReachedAlert) {
        return "warning";
    }

    return "success";
}

export function DashboardBudgetHealth({
    summary,
    currency,
}: DashboardBudgetHealthProps) {
    const prioritizedBudgets = [...summary.budgets]
        .sort((left, right) => {
            if (left.isExceeded !== right.isExceeded) {
                return Number(right.isExceeded) - Number(left.isExceeded);
            }

            if (left.hasReachedAlert !== right.hasReachedAlert) {
                return Number(right.hasReachedAlert) - Number(left.hasReachedAlert);
            }

            return right.usagePercent - left.usagePercent;
        })
        .slice(0, 5);

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2.5,
                borderRadius: 3,
                height: "100%",
            }}
        >
            <Stack spacing={2}>
                <Stack spacing={0.5}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        Salud de presupuestos
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        Estado actual de tus presupuestos más críticos.
                    </Typography>
                </Stack>

                <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                Presupuestos
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {summary.totals.budgetCount}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                Excedidos
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {summary.totals.exceededCount}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                En alerta
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {summary.totals.alertReachedCount}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {prioritizedBudgets.length === 0 ? (
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        No hay presupuestos para mostrar con los filtros actuales.
                    </Typography>
                ) : (
                    <Stack spacing={1.25}>
                        {prioritizedBudgets.map((budget) => (
                            <Paper
                                key={budget.budgetId}
                                variant="outlined"
                                sx={{ p: 1.5, borderRadius: 2 }}
                            >
                                <Stack spacing={0.75}>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        spacing={1}
                                    >
                                        <Typography sx={{ fontWeight: 700 }}>
                                            {budget.name}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            color={getBudgetStatusColor(budget)}
                                            label={getBudgetStatusLabel(budget)}
                                        />
                                    </Stack>

                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        {budget.usagePercent.toFixed(1)}% usado •{" "}
                                        {budget.matchedTransactionCount} movimiento(s)
                                    </Typography>

                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                        Límite: {formatDashboardAmount(budget.limitAmount, currency)} •
                                        Gastado: {formatDashboardAmount(budget.spentAmount, currency)} •
                                        Restante: {formatDashboardAmount(budget.remainingAmount, currency)}
                                    </Typography>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
}
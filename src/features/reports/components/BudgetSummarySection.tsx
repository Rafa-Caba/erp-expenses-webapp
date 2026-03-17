// src/features/reports/components/BudgetSummarySection.tsx

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { BudgetSummaryReport } from "../types/report.types";
import { formatReportMoney } from "../utils/report-labels";

type BudgetSummarySectionProps = {
    summary: BudgetSummaryReport | undefined;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string | null;
};

function MetricCard({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                {label}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
                {value}
            </Typography>
        </Paper>
    );
}

export function BudgetSummarySection({
    summary,
    isLoading,
    isError,
    errorMessage,
}: BudgetSummarySectionProps) {
    if (isLoading) {
        return (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <CircularProgress size={24} />
                    <Typography>Cargando resumen de presupuestos...</Typography>
                </Stack>
            </Paper>
        );
    }

    if (isError || !summary) {
        return (
            <Alert severity="error">
                {errorMessage ?? "No se pudo cargar el resumen de presupuestos."}
            </Alert>
        );
    }

    const firstBudgetCurrency = summary.budgets[0]?.currency ?? "MXN";

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Resumen de presupuestos
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MetricCard label="Presupuestos" value={String(summary.totals.budgetCount)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MetricCard
                            label="Límite total"
                            value={formatReportMoney(
                                summary.totals.totalLimitAmount,
                                firstBudgetCurrency
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MetricCard
                            label="Gastado total"
                            value={formatReportMoney(
                                summary.totals.totalSpentAmount,
                                firstBudgetCurrency
                            )}
                        />
                    </Grid>
                </Grid>

                <Divider />

                <Stack spacing={1}>
                    {summary.budgets.length === 0 ? (
                        <Typography variant="body2" sx={{ opacity: 0.75 }}>
                            No hay presupuestos para mostrar.
                        </Typography>
                    ) : (
                        summary.budgets.map((budget) => (
                            <Paper
                                key={budget.budgetId}
                                variant="outlined"
                                sx={{ p: 1.5, borderRadius: 2 }}
                            >
                                <Stack spacing={0.5}>
                                    <Typography sx={{ fontWeight: 600 }}>
                                        {budget.name}
                                    </Typography>

                                    <Typography variant="body2">
                                        Límite:{" "}
                                        {formatReportMoney(
                                            budget.limitAmount,
                                            budget.currency
                                        )}{" "}
                                        • Gastado:{" "}
                                        {formatReportMoney(
                                            budget.spentAmount,
                                            budget.currency
                                        )}{" "}
                                        • Restante:{" "}
                                        {formatReportMoney(
                                            budget.remainingAmount,
                                            budget.currency
                                        )}
                                    </Typography>

                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Uso: {budget.usagePercent.toFixed(2)}% • Estado:{" "}
                                        {budget.computedStatus} • Movimientos:{" "}
                                        {budget.matchedTransactionCount}
                                    </Typography>
                                </Stack>
                            </Paper>
                        ))
                    )}
                </Stack>
            </Stack>
        </Paper>
    );
}
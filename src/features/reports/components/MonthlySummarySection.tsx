// src/features/reports/components/MonthlySummarySection.tsx

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { MonthlySummaryReport } from "../types/report.types";
import { formatReportMoney } from "../utils/report-labels";

type MonthlySummarySectionProps = {
    summary: MonthlySummaryReport | undefined;
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

export function MonthlySummarySection({
    summary,
    isLoading,
    isError,
    errorMessage,
}: MonthlySummarySectionProps) {
    if (isLoading) {
        return (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <CircularProgress size={24} />
                    <Typography>Cargando resumen mensual...</Typography>
                </Stack>
            </Paper>
        );
    }

    if (isError || !summary) {
        return (
            <Alert severity="error">
                {errorMessage ?? "No se pudo cargar el resumen mensual."}
            </Alert>
        );
    }

    const currency = summary.filters.currency ?? "MXN";

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Resumen mensual
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MetricCard
                            label="Ingresos"
                            value={formatReportMoney(summary.totals.income, currency)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MetricCard
                            label="Gastos"
                            value={formatReportMoney(summary.totals.expenses, currency)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MetricCard
                            label="Balance neto"
                            value={formatReportMoney(summary.totals.netBalance, currency)}
                        />
                    </Grid>
                </Grid>

                <Divider />

                <Stack spacing={1}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Top categorías de gasto
                    </Typography>

                    {summary.topExpenseCategories.length === 0 ? (
                        <Typography variant="body2" sx={{ opacity: 0.75 }}>
                            No hay categorías para mostrar.
                        </Typography>
                    ) : (
                        summary.topExpenseCategories.map((item) => (
                            <Paper
                                key={`${item.categoryId ?? "no-category"}-${item.categoryName}`}
                                variant="outlined"
                                sx={{ p: 1.5, borderRadius: 2 }}
                            >
                                <Stack
                                    direction={{ xs: "column", md: "row" }}
                                    justifyContent="space-between"
                                    spacing={1}
                                >
                                    <Typography sx={{ fontWeight: 600 }}>
                                        {item.categoryName}
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatReportMoney(item.totalAmount, currency)} •{" "}
                                        {item.transactionCount} mov.
                                    </Typography>
                                </Stack>
                            </Paper>
                        ))
                    )}
                </Stack>

                <Divider />

                <Stack spacing={1}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Serie
                    </Typography>

                    {summary.series.length === 0 ? (
                        <Typography variant="body2" sx={{ opacity: 0.75 }}>
                            No hay serie para mostrar.
                        </Typography>
                    ) : (
                        summary.series.map((item) => (
                            <Paper
                                key={item.label}
                                variant="outlined"
                                sx={{ p: 1.5, borderRadius: 2 }}
                            >
                                <Stack
                                    direction={{ xs: "column", lg: "row" }}
                                    justifyContent="space-between"
                                    spacing={1}
                                >
                                    <Typography sx={{ fontWeight: 600 }}>{item.label}</Typography>
                                    <Typography variant="body2">
                                        Ingreso: {formatReportMoney(item.income, currency)} •
                                        Gasto: {formatReportMoney(item.expenses, currency)} •
                                        Balance: {formatReportMoney(item.netBalance, currency)}
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
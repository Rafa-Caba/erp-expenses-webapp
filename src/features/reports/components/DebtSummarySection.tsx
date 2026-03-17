// src/features/reports/components/DebtSummarySection.tsx

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { DebtSummaryReport } from "../types/report.types";
import { formatReportMoney } from "../utils/report-labels";

type DebtSummarySectionProps = {
    summary: DebtSummaryReport | undefined;
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

export function DebtSummarySection({
    summary,
    isLoading,
    isError,
    errorMessage,
}: DebtSummarySectionProps) {
    if (isLoading) {
        return (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <CircularProgress size={24} />
                    <Typography>Cargando resumen de deudas...</Typography>
                </Stack>
            </Paper>
        );
    }

    if (isError || !summary) {
        return (
            <Alert severity="error">
                {errorMessage ?? "No se pudo cargar el resumen de deudas."}
            </Alert>
        );
    }

    const currency = summary.filters.currency ?? "MXN";

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Resumen de deudas
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MetricCard label="Total deudas" value={String(summary.counts.total)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MetricCard
                            label="Monto original total"
                            value={formatReportMoney(summary.totalOriginalAmount, currency)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MetricCard
                            label="Monto restante total"
                            value={formatReportMoney(summary.totalRemainingAmount, currency)}
                        />
                    </Grid>
                </Grid>

                <Divider />

                <Stack spacing={1}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Dirección
                    </Typography>

                    <Typography variant="body2">
                        <strong>Yo debo:</strong>{" "}
                        {formatReportMoney(
                            summary.direction.owedByMeRemainingAmount,
                            currency
                        )}{" "}
                        ({summary.direction.owedByMeCount})
                    </Typography>

                    <Typography variant="body2">
                        <strong>Me deben:</strong>{" "}
                        {formatReportMoney(
                            summary.direction.owedToMeRemainingAmount,
                            currency
                        )}{" "}
                        ({summary.direction.owedToMeCount})
                    </Typography>
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
                            <Paper key={item.label} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                                <Stack
                                    direction={{ xs: "column", lg: "row" }}
                                    justifyContent="space-between"
                                    spacing={1}
                                >
                                    <Typography sx={{ fontWeight: 600 }}>{item.label}</Typography>
                                    <Typography variant="body2">
                                        Creado:{" "}
                                        {formatReportMoney(item.createdDebtAmount, currency)} •
                                        Pagado: {formatReportMoney(item.paidAmount, currency)} •
                                        Restante:{" "}
                                        {formatReportMoney(item.remainingAmount, currency)}
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
// src/features/dashboard/components/DashboardDebtSummary.tsx
// Dashboard debt summary.
// Fase 4 note: the UI now separates the current outstanding snapshot from
// period activity. Old debts that are still active remain visible in the current
// snapshot, while payments/collections stay scoped to the selected period.

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { formatDashboardAmount } from "../services/dashboard.service";
import type { DebtSummaryReport } from "../../reports/types/report.types";

type DashboardDebtSummaryProps = {
    summary: DebtSummaryReport;
    currency: "ALL" | "MXN" | "USD";
};

function MiniMetric({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {label}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {value}
            </Typography>
        </Paper>
    );
}

export function DashboardDebtSummary({
    summary,
    currency,
}: DashboardDebtSummaryProps) {
    const snapshot = summary.currentOutstandingSnapshot;
    const activity = summary.periodActivity;

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
                        Resumen de deudas
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        Saldo actual de deudas activas y actividad del periodo.
                    </Typography>
                </Stack>

                <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <MiniMetric
                            label="Debo actual"
                            value={formatDashboardAmount(
                                snapshot.direction.owedByMeRemainingAmount,
                                currency
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <MiniMetric
                            label="Me deben actual"
                            value={formatDashboardAmount(
                                snapshot.direction.owedToMeRemainingAmount,
                                currency
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <MiniMetric
                            label="Pagos del periodo"
                            value={formatDashboardAmount(activity.debtPayments, currency)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <MiniMetric
                            label="Cobros del periodo"
                            value={formatDashboardAmount(activity.debtCollections, currency)}
                        />
                    </Grid>
                </Grid>

                <Stack spacing={1}>
                    <Typography variant="body2">
                        <strong>Activas:</strong> {snapshot.counts.active}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Vencidas:</strong> {snapshot.counts.overdue}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Pagadas:</strong> {snapshot.counts.paid}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Cargos del periodo:</strong>{" "}
                        {formatDashboardAmount(activity.debtFees, currency)}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Cashflow neto de deuda:</strong>{" "}
                        {formatDashboardAmount(activity.netCashflow, currency)}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
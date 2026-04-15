// src/features/dashboard/components/DashboardSummaryCards.tsx

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { formatDashboardAmount } from "../services/dashboard.service";
import type { MonthlySummaryReport } from "../../reports/types/report.types";
import type { ReconciliationSummary } from "../../reconciliation/types/reconciliation.types";

type DashboardSummaryCardsProps = {
    monthlySummary: MonthlySummaryReport;
    reconciliationSummary: ReconciliationSummary;
    currency: "ALL" | "MXN" | "USD";
};

type SummaryCardProps = {
    label: string;
    value: string;
    caption: string;
};

function SummaryCard({ label, value, caption }: SummaryCardProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                borderRadius: 3,
                height: "100%",
            }}
        >
            <Stack spacing={0.75}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.75 }}>
                    {caption}
                </Typography>
            </Stack>
        </Paper>
    );
}

export function DashboardSummaryCards({
    monthlySummary,
    reconciliationSummary,
    currency,
}: DashboardSummaryCardsProps) {
    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
                <SummaryCard
                    label="Balance neto"
                    value={formatDashboardAmount(monthlySummary.totals.netBalance, currency)}
                    caption={`${monthlySummary.counts.total} movimientos en el periodo`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
                <SummaryCard
                    label="Ingresos"
                    value={formatDashboardAmount(monthlySummary.totals.income, currency)}
                    caption={`${monthlySummary.counts.income} movimiento(s) de ingreso`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
                <SummaryCard
                    label="Gastos"
                    value={formatDashboardAmount(monthlySummary.totals.expenses, currency)}
                    caption={`${monthlySummary.counts.expenses} gasto(s) en el periodo`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
                <SummaryCard
                    label="Pagos de deuda"
                    value={formatDashboardAmount(monthlySummary.totals.debtPayments, currency)}
                    caption={`${monthlySummary.counts.debtPayments} pago(s) detectados`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
                <SummaryCard
                    label="Conciliadas"
                    value={String(reconciliationSummary.reconciledCount)}
                    caption={`${reconciliationSummary.exceptionCount} con excepción`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
                <SummaryCard
                    label="Diferencia conciliación"
                    value={formatDashboardAmount(reconciliationSummary.differenceAmount, currency)}
                    caption={`${reconciliationSummary.totalCount} registro(s) evaluados`}
                />
            </Grid>
        </Grid>
    );
}
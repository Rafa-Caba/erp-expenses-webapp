// src/features/dashboard/components/DashboardSummaryCards.tsx
// Financial summary cards for the dashboard.
// Fase 4 note: cards now expose debt payments and debt collections separately
// so collections from "Me deben" are shown as money coming in, not as expenses.

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { formatDashboardAmount } from "../services/dashboard.service";
import type { MonthlySummaryReport } from "../../reports/types/report.types";

type DashboardSummaryCardsProps = {
    monthlySummary: MonthlySummaryReport;
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
    currency,
}: DashboardSummaryCardsProps) {
    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, xl: 2.4 }}>
                <SummaryCard
                    label="Ingresos"
                    value={formatDashboardAmount(monthlySummary.totals.income, currency)}
                    caption={`${monthlySummary.counts.income} movimiento(s) de ingreso`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 2.4 }}>
                <SummaryCard
                    label="Gastos"
                    value={formatDashboardAmount(monthlySummary.totals.expenses, currency)}
                    caption={`${monthlySummary.counts.expenses} gasto(s) en el periodo`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 2.4 }}>
                <SummaryCard
                    label="Pagos de deuda"
                    value={formatDashboardAmount(monthlySummary.totals.debtPayments, currency)}
                    caption={`${monthlySummary.counts.debtPayments} salida(s) por deudas propias`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 2.4 }}>
                <SummaryCard
                    label="Cobros de deuda"
                    value={formatDashboardAmount(monthlySummary.totals.debtCollections, currency)}
                    caption={`${monthlySummary.counts.debtCollections} entrada(s) de deudas por cobrar`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 2.4 }}>
                <SummaryCard
                    label="Balance neto"
                    value={formatDashboardAmount(monthlySummary.totals.netBalance, currency)}
                    caption={`${monthlySummary.counts.total} movimientos en el periodo`}
                />
            </Grid>
        </Grid>
    );
}
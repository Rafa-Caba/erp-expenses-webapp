// src/features/reconciliation/components/ReconciliationSummaryCards.tsx

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { ReconciliationSummary } from "../types/reconciliation.types";

type ReconciliationSummaryCardsProps = {
    summary: ReconciliationSummary;
    currency: "ALL" | "MXN" | "USD";
};

function formatNumber(value: number, currency: "ALL" | "MXN" | "USD"): string {
    if (currency === "ALL") {
        return new Intl.NumberFormat("es-MX", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    }

    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

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

export function ReconciliationSummaryCards({
    summary,
    currency,
}: ReconciliationSummaryCardsProps) {
    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                <SummaryCard
                    label="Reconciliadas"
                    value={String(summary.reconciledCount)}
                    caption={`${summary.totalCount} registros totales`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                <SummaryCard
                    label="Con excepción"
                    value={String(summary.exceptionCount)}
                    caption={`${summary.unreconciledCount} sin conciliar`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                <SummaryCard
                    label="Monto esperado"
                    value={formatNumber(summary.expectedAmount, currency)}
                    caption={`Monto real: ${formatNumber(summary.actualAmount, currency)}`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                <SummaryCard
                    label="Diferencia"
                    value={formatNumber(summary.differenceAmount, currency)}
                    caption={`${summary.hiddenCount}/${summary.archivedCount}/${summary.inactiveCount} ocultos/archivados/inactivos`}
                />
            </Grid>
        </Grid>
    );
}
// src/features/ledger/components/LedgerSummaryCards.tsx

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { LedgerSummary } from "../types/ledger.types";

type LedgerSummaryCardsProps = {
    summary: LedgerSummary;
    currency: "ALL" | "MXN" | "USD";
    balanceLabel: string;
};

function formatCurrency(value: number, currency: "ALL" | "MXN" | "USD"): string {
    if (currency === "ALL") {
        return new Intl.NumberFormat("es-MX", {
            style: "decimal",
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
    title: string;
    value: string;
    caption: string;
};

function SummaryCard({ title, value, caption }: SummaryCardProps) {
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
                    {title}
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

export function LedgerSummaryCards({
    summary,
    currency,
    balanceLabel,
}: LedgerSummaryCardsProps) {
    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                <SummaryCard
                    title="Entradas"
                    value={formatCurrency(summary.inflowAmount, currency)}
                    caption={`${summary.postedCount} aplicadas / ${summary.pendingCount} pendientes`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                <SummaryCard
                    title="Salidas"
                    value={formatCurrency(summary.outflowAmount, currency)}
                    caption={`${summary.cancelledCount} canceladas / ${summary.recurringCount} recurrentes`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                <SummaryCard
                    title={balanceLabel}
                    value={formatCurrency(summary.netAmount, currency)}
                    caption={`${summary.totalEntries} renglones / ${summary.totalTransactionsRepresented} transacciones`}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                <SummaryCard
                    title="Flags"
                    value={`${summary.hiddenCount}/${summary.archivedCount}/${summary.inactiveCount}`}
                    caption="Ocultas / Archivadas / Inactivas"
                />
            </Grid>
        </Grid>
    );
}
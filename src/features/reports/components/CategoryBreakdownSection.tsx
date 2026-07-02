// src/features/reports/components/CategoryBreakdownSection.tsx
// Category breakdown analytics section.
// Fase 4 note: this section reads breakdown.type from the API so the UI can
// clearly say whether it is showing expenses, income, adjustments, or all types.

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { CategoryBreakdownReport, CategoryBreakdownType } from "../types/report.types";
import { formatReportMoney } from "../utils/report-labels";

type CategoryBreakdownSectionProps = {
    breakdown: CategoryBreakdownReport | undefined;
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

function getBreakdownTitle(type: CategoryBreakdownType): string {
    if (type === "income") {
        return "Desglose por categoría de ingreso";
    }

    if (type === "adjustment") {
        return "Desglose por categoría de ajuste";
    }

    if (type === "all") {
        return "Desglose por categoría";
    }

    return "Desglose por categoría de gasto";
}

function getBreakdownEmptyMessage(type: CategoryBreakdownType): string {
    if (type === "income") {
        return "No hay categorías de ingreso para mostrar.";
    }

    if (type === "adjustment") {
        return "No hay categorías de ajuste para mostrar.";
    }

    if (type === "all") {
        return "No hay categorías para mostrar.";
    }

    return "No hay categorías de gasto para mostrar.";
}

export function CategoryBreakdownSection({
    breakdown,
    isLoading,
    isError,
    errorMessage,
}: CategoryBreakdownSectionProps) {
    if (isLoading) {
        return (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <CircularProgress size={24} />
                    <Typography>Cargando desglose por categoría...</Typography>
                </Stack>
            </Paper>
        );
    }

    if (isError || !breakdown) {
        return (
            <Alert severity="error">
                {errorMessage ?? "No se pudo cargar el desglose por categoría."}
            </Alert>
        );
    }

    const currency = breakdown.filters.currency ?? "MXN";

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={2}>
                <Stack spacing={0.5}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {getBreakdownTitle(breakdown.type)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        Tipo analizado: {breakdown.type}
                    </Typography>
                </Stack>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MetricCard
                            label="Monto total"
                            value={formatReportMoney(breakdown.totalAmount, currency)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <MetricCard
                            label="Transacciones"
                            value={String(breakdown.totalTransactions)}
                        />
                    </Grid>
                </Grid>

                <Divider />

                <Stack spacing={1}>
                    {breakdown.categories.length === 0 ? (
                        <Typography variant="body2" sx={{ opacity: 0.75 }}>
                            {getBreakdownEmptyMessage(breakdown.type)}
                        </Typography>
                    ) : (
                        breakdown.categories.map((item) => (
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
                                        {item.transactionCount} mov. •{" "}
                                        {item.percentageOfTotal.toFixed(2)}%
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
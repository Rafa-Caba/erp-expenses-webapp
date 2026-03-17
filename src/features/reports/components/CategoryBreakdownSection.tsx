// src/features/reports/components/CategoryBreakdownSection.tsx

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { CategoryBreakdownReport } from "../types/report.types";
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
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Desglose por categoría
                </Typography>

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
                            No hay categorías para mostrar.
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
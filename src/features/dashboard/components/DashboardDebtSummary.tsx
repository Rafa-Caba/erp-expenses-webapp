// src/features/dashboard/components/DashboardDebtSummary.tsx

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

export function DashboardDebtSummary({
    summary,
    currency,
}: DashboardDebtSummaryProps) {
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
                        Estado agregado de deudas y pagos dentro del periodo.
                    </Typography>
                </Stack>

                <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                Restante total
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {formatDashboardAmount(summary.totalRemainingAmount, currency)}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                Pagado en periodo
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {formatDashboardAmount(summary.completedPaymentsTotal, currency)}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Stack spacing={1}>
                    <Typography variant="body2">
                        <strong>Activas:</strong> {summary.counts.active}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Vencidas:</strong> {summary.counts.overdue}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Pagadas:</strong> {summary.counts.paid}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Me deben:</strong>{" "}
                        {formatDashboardAmount(
                            summary.direction.owedToMeRemainingAmount,
                            currency
                        )}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Debo:</strong>{" "}
                        {formatDashboardAmount(
                            summary.direction.owedByMeRemainingAmount,
                            currency
                        )}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
// src/features/dashboard/components/DashboardReconciliationSummary.tsx

import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { formatDashboardAmount } from "../services/dashboard.service";
import type { ReconciliationSummary } from "../../reconciliation/types/reconciliation.types";

type DashboardReconciliationSummaryProps = {
    summary: ReconciliationSummary;
    currency: "ALL" | "MXN" | "USD";
};

export function DashboardReconciliationSummary({
    summary,
    currency,
}: DashboardReconciliationSummaryProps) {
    const topAccounts = [...summary.byAccount]
        .sort((left, right) => Math.abs(right.differenceAmount) - Math.abs(left.differenceAmount))
        .slice(0, 5);

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
                        Conciliación
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        Resumen de conciliación del periodo filtrado.
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip color="success" label={`Conciliadas: ${summary.reconciledCount}`} />
                    <Chip variant="outlined" label={`Sin conciliar: ${summary.unreconciledCount}`} />
                    <Chip color="warning" label={`Excepción: ${summary.exceptionCount}`} />
                </Stack>

                <Typography variant="body2">
                    <strong>Diferencia total:</strong>{" "}
                    {formatDashboardAmount(summary.differenceAmount, currency)}
                </Typography>

                <Typography variant="body2">
                    <strong>Última conciliación:</strong>{" "}
                    {summary.latestReconciledAt
                        ? new Intl.DateTimeFormat("es-MX", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        }).format(new Date(summary.latestReconciledAt))
                        : "—"}
                </Typography>

                {topAccounts.length === 0 ? (
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        No hay cuentas conciliadas o con diferencia en este filtro.
                    </Typography>
                ) : (
                    <Stack spacing={1}>
                        {topAccounts.map((account) => (
                            <Paper
                                key={account.accountId}
                                variant="outlined"
                                sx={{ p: 1.25, borderRadius: 2 }}
                            >
                                <Stack spacing={0.5}>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {account.accountName ?? account.accountId}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        {account.reconciledCount} conciliadas •{" "}
                                        {account.exceptionCount} excepción(es)
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                        Diferencia:{" "}
                                        {formatDashboardAmount(account.differenceAmount, currency)}
                                    </Typography>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
}
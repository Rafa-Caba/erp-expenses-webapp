// src/features/dashboard/components/DashboardTrendChart.tsx

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { formatDashboardAmount } from "../services/dashboard.service";
import type { MonthlySummarySeriesItem } from "../../reports/types/report.types";

type DashboardTrendChartProps = {
    series: MonthlySummarySeriesItem[];
    currency: "ALL" | "MXN" | "USD";
};

function formatTooltipValue(
    value: number | string | readonly (string | number)[] | undefined,
    currency: "ALL" | "MXN" | "USD"
): string {
    if (typeof value === "number") {
        return formatDashboardAmount(value, currency);
    }

    if (typeof value === "string") {
        const numericValue = Number(value);

        if (Number.isFinite(numericValue)) {
            return formatDashboardAmount(numericValue, currency);
        }

        return value;
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === "number") {
                    return formatDashboardAmount(item, currency);
                }

                const numericValue = Number(item);

                if (Number.isFinite(numericValue)) {
                    return formatDashboardAmount(numericValue, currency);
                }

                return String(item);
            })
            .join(", ");
    }

    return "—";
}

export function DashboardTrendChart({
    series,
    currency,
}: DashboardTrendChartProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2.5,
                borderRadius: 3,
                height: 420,
            }}
        >
            <Stack spacing={2} sx={{ height: "100%" }}>
                <Stack spacing={0.5}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        Tendencia del periodo
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        Evolución de ingresos, gastos y balance neto.
                    </Typography>
                </Stack>

                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={series}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip
                            formatter={(value) => formatTooltipValue(value, currency)}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="income"
                            name="Ingresos"
                            stroke="#2e7d32"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="expenses"
                            name="Gastos"
                            stroke="#d32f2f"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="netBalance"
                            name="Balance neto"
                            stroke="#1976d2"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Stack>
        </Paper>
    );
}
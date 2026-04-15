// src/features/dashboard/components/DashboardTopCategories.tsx

import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { formatDashboardAmount } from "../services/dashboard.service";
import type { CategoryBreakdownItem } from "../../reports/types/report.types";

type DashboardTopCategoriesProps = {
    categories: CategoryBreakdownItem[];
    currency: "ALL" | "MXN" | "USD";
};

export function DashboardTopCategories({
    categories,
    currency,
}: DashboardTopCategoriesProps) {
    const topCategories = categories.slice(0, 5);

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
                        Top categorías
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        Principales categorías por monto dentro del filtro actual.
                    </Typography>
                </Stack>

                {topCategories.length === 0 ? (
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        No hay categorías con actividad en el periodo seleccionado.
                    </Typography>
                ) : (
                    <Stack spacing={1.5}>
                        {topCategories.map((category) => (
                            <Stack key={category.categoryId ?? category.categoryName} spacing={0.75}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={1}
                                >
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {category.categoryName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                        {formatDashboardAmount(category.totalAmount, currency)}
                                    </Typography>
                                </Stack>

                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(category.percentageOfTotal, 100)}
                                />

                                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                    {category.transactionCount} movimiento(s) •{" "}
                                    {category.percentageOfTotal.toFixed(1)}%
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
}
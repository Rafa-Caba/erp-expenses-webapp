// src/features/dashboard/components/DashboardHighlights.tsx

import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { DashboardHighlight } from "../types/dashboard.types";

type DashboardHighlightsProps = {
    highlights: DashboardHighlight[];
};

export function DashboardHighlights({ highlights }: DashboardHighlightsProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2.5,
                borderRadius: 3,
            }}
        >
            <Stack spacing={1.5}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Highlights automáticos
                </Typography>

                {highlights.length === 0 ? (
                    <Alert severity="info">
                        No detectamos highlights relevantes con los filtros actuales.
                    </Alert>
                ) : (
                    <Stack spacing={1}>
                        {highlights.map((highlight) => (
                            <Alert key={highlight.id} severity={highlight.severity}>
                                <strong>{highlight.title}:</strong> {highlight.description}
                            </Alert>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
}
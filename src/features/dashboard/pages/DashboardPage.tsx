import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";

export function DashboardPage() {
    return (
        <Page title="Dashboard" subtitle="Resumen rápido del contexto actual.">
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Paper sx={{ p: 2, flex: 1 }}>
                    <Typography sx={{ fontWeight: 700 }}>Balance</Typography>
                    <Typography sx={{ opacity: 0.8 }}>Listo para conectar al endpoint agregado.</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1 }}>
                    <Typography sx={{ fontWeight: 700 }}>Actividad reciente</Typography>
                    <Typography sx={{ opacity: 0.8 }}>Listo para conectar al endpoint de actividad.</Typography>
                </Paper>
            </Stack>
        </Page>
    );
}
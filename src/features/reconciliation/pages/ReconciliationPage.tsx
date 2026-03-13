// src/features/reconciliation/pages/ReconciliationPage.tsx

import { Page } from "../../../shared/ui/Page/Page";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export function ReconciliationPage() {
    return (
        <Page
            title="Conciliación"
            subtitle="Aquí irá el flujo para conciliar movimientos contra cuentas, tarjetas y recibos."
        >
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Typography>
                    Vista base de conciliación pendiente de implementación.
                </Typography>
            </Paper>
        </Page>
    );
}
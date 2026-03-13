// src/features/ledger/pages/LedgerPage.tsx

import { Page } from "../../../shared/ui/Page/Page";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export function LedgerPage() {
    return (
        <Page
            title="Ledger"
            subtitle="Aquí vivirán las transacciones, movimientos y filtros del libro mayor."
        >
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Typography>
                    Vista base de Ledger pendiente de conectar al módulo de transactions.
                </Typography>
            </Paper>
        </Page>
    );
}
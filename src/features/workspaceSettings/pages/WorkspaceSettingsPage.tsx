// src/features/workspaceSettings/pages/WorkspaceSettingsPage.tsx

import { Page } from "../../../shared/ui/Page/Page";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export function WorkspaceSettingsPage() {
    return (
        <Page
            title="Ajustes del workspace"
            subtitle="Aquí vivirán los ajustes generales del workspace activo."
        >
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Typography>
                    Vista base de ajustes del workspace pendiente de conectar al módulo workspaceSettings.
                </Typography>
            </Paper>
        </Page>
    );
}
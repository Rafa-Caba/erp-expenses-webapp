// src/features/workspaceSettings/components/WorkspaceSettingsSummaryCard.tsx

import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { WorkspaceSettingsRecord } from "../types/workspace-settings.types";

type WorkspaceSettingsSummaryCardProps = {
    settings: WorkspaceSettingsRecord;
};

function getWeekStartsOnLabel(value: WorkspaceSettingsRecord["weekStartsOn"]): string {
    switch (value) {
        case 0:
            return "Domingo";
        case 1:
            return "Lunes";
        case 2:
            return "Martes";
        case 3:
            return "Miércoles";
        case 4:
            return "Jueves";
        case 5:
            return "Viernes";
        case 6:
            return "Sábado";
        default:
            return "No definido";
    }
}

function formatDateTime(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

type SummaryItemProps = {
    label: string;
    value: string;
};

function SummaryItem({ label, value }: SummaryItemProps) {
    return (
        <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {label}
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
        </Stack>
    );
}

export function WorkspaceSettingsSummaryCard({
    settings,
}: WorkspaceSettingsSummaryCardProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
            }}
        >
            <Stack spacing={2.5}>
                <Stack spacing={1}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        Resumen actual
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Vista rápida de la configuración activa del workspace.
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip
                        label={settings.isVisible ? "Visible" : "Oculto"}
                        color={settings.isVisible ? "success" : "default"}
                        variant={settings.isVisible ? "filled" : "outlined"}
                    />
                    <Chip label={`Moneda: ${settings.defaultCurrency}`} variant="outlined" />
                    <Chip label={`Idioma: ${settings.language}`} variant="outlined" />
                    <Chip label={`Hora: ${settings.timeFormat}`} variant="outlined" />
                </Stack>

                <Divider />

                <Stack spacing={1.5}>
                    <SummaryItem label="Zona horaria" value={settings.timezone} />
                    <SummaryItem label="Formato de fecha" value={settings.dateFormat} />
                    <SummaryItem
                        label="Inicio de semana"
                        value={getWeekStartsOnLabel(settings.weekStartsOn)}
                    />
                    <SummaryItem
                        label="Separador decimal"
                        value={settings.decimalSeparator ?? "No definido"}
                    />
                    <SummaryItem
                        label="Separador de miles"
                        value={settings.thousandSeparator ?? "No definido"}
                    />
                    <SummaryItem label="Tema" value={settings.theme ?? "Sin tema"} />
                </Stack>

                <Divider />

                <Stack spacing={1}>
                    <SummaryItem
                        label="Última actualización"
                        value={formatDateTime(settings.updatedAt)}
                    />
                    <SummaryItem
                        label="Creado"
                        value={formatDateTime(settings.createdAt)}
                    />
                </Stack>
            </Stack>
        </Paper>
    );
}
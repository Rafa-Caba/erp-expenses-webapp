// src/features/workspaceSettings/components/WorkspaceSettingsSummaryCard.tsx

import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import type { WorkspaceSettingsRecord } from "../types/workspace-settings.types";

type WorkspaceSettingsSummaryCardProps = {
    settings: WorkspaceSettingsRecord;
    collapsed: boolean;
    onToggleCollapsed: () => void;
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

function getThemeLabel(value: WorkspaceSettingsRecord["theme"]): string {
    switch (value) {
        case "dark":
            return "Dark";
        case "light":
            return "Light";
        case "customizable":
            return "Personalizable";
        default:
            return "Sin tema";
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
    collapsed,
    onToggleCollapsed,
}: WorkspaceSettingsSummaryCardProps) {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

    if (isDesktop && collapsed) {
        return (
            <Paper
                variant="outlined"
                sx={{
                    p: 1.25,
                    borderRadius: 3,
                    height: "100%",
                    minHeight: 420,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Stack
                    spacing={2}
                    alignItems="center"
                    sx={{
                        flex: 1,
                        justifyContent: "center",
                    }}
                >
                    <Tooltip title="Expandir resumen" placement="right">
                        <IconButton onClick={onToggleCollapsed} color="primary">
                            <KeyboardDoubleArrowRightIcon />
                        </IconButton>
                    </Tooltip>

                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 800,
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                            letterSpacing: 0.5,
                            textAlign: "center",
                        }}
                    >
                        Resumen actual
                    </Typography>

                    <Chip
                        size="small"
                        label={settings.isVisible ? "Visible" : "Oculto"}
                        color={settings.isVisible ? "success" : "default"}
                        variant={settings.isVisible ? "filled" : "outlined"}
                    />
                </Stack>
            </Paper>
        );
    }

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
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    justifyContent="space-between"
                >
                    <Stack spacing={1} sx={{ minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Resumen actual
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Vista rápida de la configuración activa del workspace.
                        </Typography>
                    </Stack>

                    <Tooltip
                        title={
                            collapsed
                                ? isDesktop
                                    ? "Expandir resumen"
                                    : "Mostrar resumen"
                                : isDesktop
                                    ? "Colapsar resumen"
                                    : "Ocultar resumen"
                        }
                    >
                        <IconButton onClick={onToggleCollapsed} color="primary">
                            {collapsed ? (
                                isDesktop ? (
                                    <KeyboardDoubleArrowRightIcon />
                                ) : (
                                    <ExpandMoreIcon />
                                )
                            ) : isDesktop ? (
                                <KeyboardDoubleArrowLeftIcon />
                            ) : (
                                <ExpandLessIcon />
                            )}
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Collapse in={!collapsed} timeout="auto" unmountOnExit>
                    <Stack spacing={2.5}>
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
                            <SummaryItem label="Tema" value={getThemeLabel(settings.theme)} />
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
                </Collapse>
            </Stack>
        </Paper>
    );
}
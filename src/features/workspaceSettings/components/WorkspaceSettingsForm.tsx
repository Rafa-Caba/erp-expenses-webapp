// src/features/workspaceSettings/components/WorkspaceSettingsForm.tsx

import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type {
    UpdateWorkspaceSettingsPayload,
    WorkspaceDateFormat,
    WorkspaceDecimalSeparator,
    WorkspaceLanguage,
    WorkspaceSettingsRecord,
    WorkspaceThousandSeparator,
    WorkspaceTimeFormat,
    WorkspaceWeekStartsOn,
} from "../types/workspace-settings.types";

type WorkspaceSettingsFormValues = {
    defaultCurrency: WorkspaceSettingsRecord["defaultCurrency"];
    language: WorkspaceLanguage;
    timezone: string;
    dateFormat: WorkspaceDateFormat;
    timeFormat: WorkspaceTimeFormat;
    theme: string;
    notificationsEnabled: boolean;
    budgetAlertsEnabled: boolean;
    debtAlertsEnabled: boolean;
    allowMemberEdits: boolean;
    weekStartsOn: WorkspaceWeekStartsOn;
    decimalSeparator: WorkspaceDecimalSeparator;
    thousandSeparator: WorkspaceThousandSeparator;
    isVisible: boolean;
};

type WorkspaceSettingsFormProps = {
    initialValues: WorkspaceSettingsRecord;
    isSubmitting: boolean;
    submitErrorMessage: string | null;
    submitSuccessMessage: string | null;
    onSubmit: (values: UpdateWorkspaceSettingsPayload) => void;
};

const WEEK_OPTIONS: Array<{
    value: WorkspaceWeekStartsOn;
    label: string;
}> = [
        { value: 0, label: "Domingo" },
        { value: 1, label: "Lunes" },
        { value: 2, label: "Martes" },
        { value: 3, label: "Miércoles" },
        { value: 4, label: "Jueves" },
        { value: 5, label: "Viernes" },
        { value: 6, label: "Sábado" },
    ];

function toFormValues(settings: WorkspaceSettingsRecord): WorkspaceSettingsFormValues {
    return {
        defaultCurrency: settings.defaultCurrency,
        language: settings.language,
        timezone: settings.timezone,
        dateFormat: settings.dateFormat,
        timeFormat: settings.timeFormat,
        theme: settings.theme ?? "",
        notificationsEnabled: settings.notificationsEnabled,
        budgetAlertsEnabled: settings.budgetAlertsEnabled,
        debtAlertsEnabled: settings.debtAlertsEnabled,
        allowMemberEdits: settings.allowMemberEdits,
        weekStartsOn: settings.weekStartsOn ?? 1,
        decimalSeparator: settings.decimalSeparator ?? ".",
        thousandSeparator: settings.thousandSeparator ?? ",",
        isVisible: settings.isVisible,
    };
}

export function WorkspaceSettingsForm({
    initialValues,
    isSubmitting,
    submitErrorMessage,
    submitSuccessMessage,
    onSubmit,
}: WorkspaceSettingsFormProps) {
    const [values, setValues] = React.useState<WorkspaceSettingsFormValues>(
        toFormValues(initialValues)
    );
    const [timezoneError, setTimezoneError] = React.useState<string | null>(null);

    React.useEffect(() => {
        setValues(toFormValues(initialValues));
        setTimezoneError(null);
    }, [initialValues]);

    const handleTextChange = React.useCallback(
        (
            field: "timezone" | "theme",
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const nextValue = event.target.value;

            setValues((currentValues) => ({
                ...currentValues,
                [field]: nextValue,
            }));

            if (field === "timezone" && nextValue.trim().length > 0) {
                setTimezoneError(null);
            }
        },
        []
    );

    const handleSelectChange = React.useCallback(
        <
            TField extends
            | "defaultCurrency"
            | "language"
            | "dateFormat"
            | "timeFormat"
            | "weekStartsOn"
            | "decimalSeparator"
            | "thousandSeparator",
        >(
            field: TField,
            value: WorkspaceSettingsFormValues[TField]
        ) => {
            setValues((currentValues) => ({
                ...currentValues,
                [field]: value,
            }));
        },
        []
    );

    const handleSwitchChange = React.useCallback(
        (
            field:
                | "notificationsEnabled"
                | "budgetAlertsEnabled"
                | "debtAlertsEnabled"
                | "allowMemberEdits"
                | "isVisible",
            checked: boolean
        ) => {
            setValues((currentValues) => ({
                ...currentValues,
                [field]: checked,
            }));
        },
        []
    );

    const handleReset = React.useCallback(() => {
        setValues(toFormValues(initialValues));
        setTimezoneError(null);
    }, [initialValues]);

    const handleSubmit = React.useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            const trimmedTimezone = values.timezone.trim();

            if (trimmedTimezone.length === 0) {
                setTimezoneError("La zona horaria es obligatoria.");
                return;
            }

            setTimezoneError(null);

            onSubmit({
                defaultCurrency: values.defaultCurrency,
                language: values.language,
                timezone: trimmedTimezone,
                dateFormat: values.dateFormat,
                timeFormat: values.timeFormat,
                theme: values.theme.trim(),
                notificationsEnabled: values.notificationsEnabled,
                budgetAlertsEnabled: values.budgetAlertsEnabled,
                debtAlertsEnabled: values.debtAlertsEnabled,
                allowMemberEdits: values.allowMemberEdits,
                weekStartsOn: values.weekStartsOn,
                decimalSeparator: values.decimalSeparator,
                thousandSeparator: values.thousandSeparator,
                isVisible: values.isVisible,
            });
        },
        [onSubmit, values]
    );

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 3,
                borderRadius: 3,
            }}
        >
            <Stack
                component="form"
                spacing={2.5}
                onSubmit={handleSubmit}
            >
                <Stack spacing={0.75}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        Configuración del workspace
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Ajusta idioma, formato, alertas y comportamiento general del
                        workspace activo.
                    </Typography>
                </Stack>

                {submitErrorMessage ? (
                    <Alert severity="error">{submitErrorMessage}</Alert>
                ) : null}

                {submitSuccessMessage ? (
                    <Alert severity="success">{submitSuccessMessage}</Alert>
                ) : null}

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            select
                            fullWidth
                            label="Moneda por defecto"
                            value={values.defaultCurrency}
                            onChange={(event) =>
                                handleSelectChange(
                                    "defaultCurrency",
                                    event.target.value as WorkspaceSettingsRecord["defaultCurrency"]
                                )
                            }
                        >
                            <MenuItem value="MXN">MXN</MenuItem>
                            <MenuItem value="USD">USD</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            select
                            fullWidth
                            label="Idioma"
                            value={values.language}
                            onChange={(event) =>
                                handleSelectChange(
                                    "language",
                                    event.target.value as WorkspaceLanguage
                                )
                            }
                        >
                            <MenuItem value="es-MX">Español (México)</MenuItem>
                            <MenuItem value="en-US">English (US)</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Zona horaria"
                            value={values.timezone}
                            onChange={(event) => handleTextChange("timezone", event)}
                            error={timezoneError !== null}
                            helperText={timezoneError ?? "Ejemplo: America/Mexico_City"}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Tema"
                            value={values.theme}
                            onChange={(event) => handleTextChange("theme", event)}
                            helperText="Opcional. Si lo dejas vacío, el backend lo normaliza."
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            select
                            fullWidth
                            label="Formato de fecha"
                            value={values.dateFormat}
                            onChange={(event) =>
                                handleSelectChange(
                                    "dateFormat",
                                    event.target.value as WorkspaceDateFormat
                                )
                            }
                        >
                            <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                            <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                            <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            select
                            fullWidth
                            label="Formato de hora"
                            value={values.timeFormat}
                            onChange={(event) =>
                                handleSelectChange(
                                    "timeFormat",
                                    event.target.value as WorkspaceTimeFormat
                                )
                            }
                        >
                            <MenuItem value="12h">12 horas</MenuItem>
                            <MenuItem value="24h">24 horas</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            select
                            fullWidth
                            label="Inicio de semana"
                            value={values.weekStartsOn}
                            onChange={(event) =>
                                handleSelectChange(
                                    "weekStartsOn",
                                    Number(event.target.value) as WorkspaceWeekStartsOn
                                )
                            }
                        >
                            {WEEK_OPTIONS.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            select
                            fullWidth
                            label="Separador decimal"
                            value={values.decimalSeparator}
                            onChange={(event) =>
                                handleSelectChange(
                                    "decimalSeparator",
                                    event.target.value as WorkspaceDecimalSeparator
                                )
                            }
                        >
                            <MenuItem value=".">Punto (.)</MenuItem>
                            <MenuItem value=",">Coma (,)</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            select
                            fullWidth
                            label="Separador de miles"
                            value={values.thousandSeparator}
                            onChange={(event) =>
                                handleSelectChange(
                                    "thousandSeparator",
                                    event.target.value as WorkspaceThousandSeparator
                                )
                            }
                        >
                            <MenuItem value=",">Coma (,)</MenuItem>
                            <MenuItem value=".">Punto (.)</MenuItem>
                            <MenuItem value=" ">Espacio</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>

                <Divider />

                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                        Alertas y permisos
                    </Typography>

                    <Grid container spacing={1}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={values.notificationsEnabled}
                                        onChange={(event) =>
                                            handleSwitchChange(
                                                "notificationsEnabled",
                                                event.target.checked
                                            )
                                        }
                                    />
                                }
                                label="Notificaciones generales"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={values.budgetAlertsEnabled}
                                        onChange={(event) =>
                                            handleSwitchChange(
                                                "budgetAlertsEnabled",
                                                event.target.checked
                                            )
                                        }
                                    />
                                }
                                label="Alertas de presupuesto"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={values.debtAlertsEnabled}
                                        onChange={(event) =>
                                            handleSwitchChange(
                                                "debtAlertsEnabled",
                                                event.target.checked
                                            )
                                        }
                                    />
                                }
                                label="Alertas de deuda"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={values.allowMemberEdits}
                                        onChange={(event) =>
                                            handleSwitchChange(
                                                "allowMemberEdits",
                                                event.target.checked
                                            )
                                        }
                                    />
                                }
                                label="Permitir edición por miembros"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={values.isVisible}
                                        onChange={(event) =>
                                            handleSwitchChange(
                                                "isVisible",
                                                event.target.checked
                                            )
                                        }
                                    />
                                }
                                label="Settings visibles"
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    justifyContent="flex-end"
                >
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={handleReset}
                        disabled={isSubmitting}
                    >
                        Restablecer
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Guardando..." : "Guardar ajustes"}
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}
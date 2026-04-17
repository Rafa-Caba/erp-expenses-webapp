// src/features/workspaceSettings/components/WorkspaceSettingsForm.tsx

import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { AdvancedColorPickerField } from "../../components/AdvancedColorPickerField";
import { ThemePreviewCard } from "../../themes/components/ThemePreviewCard";
import type { ThemeColors, ThemeKey, ThemeRecord } from "../../themes/types/theme.types";
import type { CurrencyCode } from "../../../shared/types/common.types";
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
    theme: ThemeKey;
    notificationsEnabled: boolean;
    budgetAlertsEnabled: boolean;
    debtAlertsEnabled: boolean;
    allowMemberEdits: boolean;
    weekStartsOn: WorkspaceWeekStartsOn;
    decimalSeparator: WorkspaceDecimalSeparator;
    thousandSeparator: WorkspaceThousandSeparator;
    isVisible: boolean;
};

type CustomThemeEditorValues = {
    name: string;
    description: string;
    colors: ThemeColors;
};

type WorkspaceSettingsFormProps = {
    workspaceId: string;
    initialValues: WorkspaceSettingsRecord;
    availableThemes: ThemeRecord[];
    isSubmitting: boolean;
    isUpdatingCustomTheme: boolean;
    submitErrorMessage: string | null;
    submitSuccessMessage: string | null;
    themeErrorMessage: string | null;
    themeSuccessMessage: string | null;
    onSubmit: (values: UpdateWorkspaceSettingsPayload) => void;
    onUpdateCustomTheme: (payload: {
        name: string;
        description: string | null;
        colors: ThemeColors;
    }) => void;
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
        theme: settings.theme ?? "dark",
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

function getCustomizableTheme(themes: ThemeRecord[]): ThemeRecord | null {
    return themes.find((theme) => theme.key === "customizable") ?? null;
}

function toCustomThemeEditorValues(theme: ThemeRecord | null): CustomThemeEditorValues | null {
    if (!theme) {
        return null;
    }

    return {
        name: theme.name,
        description: theme.description ?? "",
        colors: {
            background: theme.colors.background,
            surface: theme.colors.surface,
            surfaceAlt: theme.colors.surfaceAlt,
            textPrimary: theme.colors.textPrimary,
            textSecondary: theme.colors.textSecondary,
            primary: theme.colors.primary,
            secondary: theme.colors.secondary,
            success: theme.colors.success,
            warning: theme.colors.warning,
            error: theme.colors.error,
            info: theme.colors.info,
            divider: theme.colors.divider,
        },
    };
}

export function WorkspaceSettingsForm({
    workspaceId,
    initialValues,
    availableThemes,
    isSubmitting,
    isUpdatingCustomTheme,
    submitErrorMessage,
    submitSuccessMessage,
    themeErrorMessage,
    themeSuccessMessage,
    onSubmit,
    onUpdateCustomTheme,
}: WorkspaceSettingsFormProps) {
    const [values, setValues] = React.useState<WorkspaceSettingsFormValues>(
        toFormValues(initialValues)
    );
    const [timezoneError, setTimezoneError] = React.useState<string | null>(null);
    const [customThemeDialogOpen, setCustomThemeDialogOpen] = React.useState(false);

    const customizableTheme = React.useMemo(() => {
        return getCustomizableTheme(availableThemes);
    }, [availableThemes]);

    const [customThemeValues, setCustomThemeValues] =
        React.useState<CustomThemeEditorValues | null>(
            toCustomThemeEditorValues(customizableTheme)
        );

    React.useEffect(() => {
        setValues(toFormValues(initialValues));
        setTimezoneError(null);
    }, [initialValues]);

    React.useEffect(() => {
        setCustomThemeValues(toCustomThemeEditorValues(customizableTheme));
    }, [customizableTheme]);

    const handleTextChange = React.useCallback(
        (
            field: "timezone",
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
            | "thousandSeparator"
            | "theme",
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

    const handleOpenCustomThemeDialog = React.useCallback(() => {
        setCustomThemeValues(toCustomThemeEditorValues(customizableTheme));
        setCustomThemeDialogOpen(true);
    }, [customizableTheme]);

    const handleCloseCustomThemeDialog = React.useCallback(() => {
        setCustomThemeDialogOpen(false);
    }, []);

    const handleCustomThemeTextChange = React.useCallback(
        (field: "name" | "description", nextValue: string) => {
            setCustomThemeValues((currentValues) => {
                if (!currentValues) {
                    return currentValues;
                }

                return {
                    ...currentValues,
                    [field]: nextValue,
                };
            });
        },
        []
    );

    const handleCustomThemeColorChange = React.useCallback(
        (field: keyof ThemeColors, nextValue: string) => {
            setCustomThemeValues((currentValues) => {
                if (!currentValues) {
                    return currentValues;
                }

                return {
                    ...currentValues,
                    colors: {
                        ...currentValues.colors,
                        [field]: nextValue,
                    },
                };
            });
        },
        []
    );

    const handleSubmitCustomTheme = React.useCallback(() => {
        if (!customThemeValues) {
            return;
        }

        onUpdateCustomTheme({
            name: customThemeValues.name.trim(),
            description:
                customThemeValues.description.trim().length > 0
                    ? customThemeValues.description.trim()
                    : null,
            colors: customThemeValues.colors,
        });
    }, [customThemeValues, onUpdateCustomTheme]);

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
                theme: values.theme,
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
        <>
            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    borderRadius: 3,
                }}
            >
                <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
                    <Stack spacing={0.75}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Configuración del workspace
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Ajusta idioma, formato, alertas, comportamiento general y temas del
                            workspace activo.
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.65 }}>
                            Workspace ID: {workspaceId}
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
                                        event.target.value as CurrencyCode
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

                        <Grid size={{ xs: 12, md: 6 }}>
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
                            Temas
                        </Typography>

                        {themeErrorMessage ? (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {themeErrorMessage}
                            </Alert>
                        ) : null}

                        {themeSuccessMessage ? (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {themeSuccessMessage}
                            </Alert>
                        ) : null}

                        <Grid container spacing={2}>
                            {availableThemes.length > 0 ? (
                                availableThemes.map((theme) => (
                                    <Grid key={theme.id} size={{ xs: 12, md: 4 }}>
                                        <ThemePreviewCard
                                            theme={theme}
                                            selected={values.theme === theme.key}
                                            onSelect={(themeKey) =>
                                                handleSelectChange("theme", themeKey)
                                            }
                                            onEditCustomTheme={
                                                theme.key === "customizable"
                                                    ? handleOpenCustomThemeDialog
                                                    : null
                                            }
                                        />
                                    </Grid>
                                ))
                            ) : (
                                <Grid size={{ xs: 12 }}>
                                    <Alert severity="info">
                                        No se encontraron temas configurados para este workspace.
                                    </Alert>
                                </Grid>
                            )}
                        </Grid>
                    </Box>

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
                        direction={{ xs: "column-reverse", sm: "row" }}
                        spacing={1.5}
                        justifyContent="flex-end"
                    >
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleReset}
                            disabled={isSubmitting}
                        >
                            Restaurar cambios
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

            <Dialog
                open={customThemeDialogOpen}
                onClose={handleCloseCustomThemeDialog}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>Editar tema personalizable</DialogTitle>

                <DialogContent dividers>
                    {customThemeValues ? (
                        <Stack spacing={2.5} sx={{ pt: 1 }}>
                            <TextField
                                fullWidth
                                label="Nombre del tema"
                                value={customThemeValues.name}
                                onChange={(event) =>
                                    handleCustomThemeTextChange("name", event.target.value)
                                }
                                disabled={isUpdatingCustomTheme}
                            />

                            <TextField
                                fullWidth
                                label="Descripción"
                                value={customThemeValues.description}
                                onChange={(event) =>
                                    handleCustomThemeTextChange("description", event.target.value)
                                }
                                disabled={isUpdatingCustomTheme}
                                multiline
                                minRows={2}
                            />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <AdvancedColorPickerField
                                        label="Background"
                                        value={customThemeValues.colors.background}
                                        onChange={(value) =>
                                            handleCustomThemeColorChange("background", value)
                                        }
                                        disabled={isUpdatingCustomTheme}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <AdvancedColorPickerField
                                        label="Surface"
                                        value={customThemeValues.colors.surface}
                                        onChange={(value) =>
                                            handleCustomThemeColorChange("surface", value)
                                        }
                                        disabled={isUpdatingCustomTheme}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <AdvancedColorPickerField
                                        label="Surface Alt"
                                        value={customThemeValues.colors.surfaceAlt}
                                        onChange={(value) =>
                                            handleCustomThemeColorChange("surfaceAlt", value)
                                        }
                                        disabled={isUpdatingCustomTheme}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <AdvancedColorPickerField
                                        label="Text Primary"
                                        value={customThemeValues.colors.textPrimary}
                                        onChange={(value) =>
                                            handleCustomThemeColorChange("textPrimary", value)
                                        }
                                        disabled={isUpdatingCustomTheme}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <AdvancedColorPickerField
                                        label="Text Secondary"
                                        value={customThemeValues.colors.textSecondary}
                                        onChange={(value) =>
                                            handleCustomThemeColorChange("textSecondary", value)
                                        }
                                        disabled={isUpdatingCustomTheme}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <AdvancedColorPickerField
                                        label="Primary"
                                        value={customThemeValues.colors.primary}
                                        onChange={(value) =>
                                            handleCustomThemeColorChange("primary", value)
                                        }
                                        disabled={isUpdatingCustomTheme}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <AdvancedColorPickerField
                                        label="Secondary"
                                        value={customThemeValues.colors.secondary}
                                        onChange={(value) =>
                                            handleCustomThemeColorChange("secondary", value)
                                        }
                                        disabled={isUpdatingCustomTheme}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <AdvancedColorPickerField
                                        label="Success"
                                        value={customThemeValues.colors.success}
                                        onChange={(value) =>
                                            handleCustomThemeColorChange("success", value)
                                        }
                                        disabled={isUpdatingCustomTheme}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <AdvancedColorPickerField
                                        label="Warning"
                                        value={customThemeValues.colors.warning}
                                        onChange={(value) =>
                                            handleCustomThemeColorChange("warning", value)
                                        }
                                        disabled={isUpdatingCustomTheme}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <AdvancedColorPickerField
                                        label="Error"
                                        value={customThemeValues.colors.error}
                                        onChange={(value) =>
                                            handleCustomThemeColorChange("error", value)
                                        }
                                        disabled={isUpdatingCustomTheme}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <AdvancedColorPickerField
                                        label="Info"
                                        value={customThemeValues.colors.info}
                                        onChange={(value) =>
                                            handleCustomThemeColorChange("info", value)
                                        }
                                        disabled={isUpdatingCustomTheme}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <AdvancedColorPickerField
                                        label="Divider"
                                        value={customThemeValues.colors.divider}
                                        onChange={(value) =>
                                            handleCustomThemeColorChange("divider", value)
                                        }
                                        disabled={isUpdatingCustomTheme}
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                    ) : (
                        <Alert severity="warning">
                            No encontramos el tema personalizable para este workspace.
                        </Alert>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1,
                    }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleCloseCustomThemeDialog}
                        disabled={isUpdatingCustomTheme}
                    >
                        Cerrar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSubmitCustomTheme}
                        disabled={isUpdatingCustomTheme || customThemeValues === null}
                    >
                        {isUpdatingCustomTheme ? "Guardando..." : "Guardar tema"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
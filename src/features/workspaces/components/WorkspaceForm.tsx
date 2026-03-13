// src/features/workspaces/components/WorkspaceForm.tsx

import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type {
    CurrencyCode,
    WorkspaceKind,
    WorkspaceType,
    WorkspaceVisibility,
} from "../../../shared/types/common.types";

export type WorkspaceFormValues = {
    type: WorkspaceType;
    kind: WorkspaceKind;
    name: string;
    description: string;
    currency: CurrencyCode;
    timezone: string;
    country: string;
    icon: string;
    color: string;
    visibility: WorkspaceVisibility;
    isVisible: boolean;
    isActive: boolean;
    isArchived: boolean;
};

type WorkspaceFormField =
    | "type"
    | "kind"
    | "name"
    | "currency"
    | "timezone"
    | "visibility";

type WorkspaceFormErrors = Partial<Record<WorkspaceFormField, string>>;

type WorkspaceFormProps = {
    mode: "create" | "edit";
    initialValues: WorkspaceFormValues;
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: WorkspaceFormValues) => void;
    onCancel: () => void;
};

function validateWorkspaceForm(values: WorkspaceFormValues): WorkspaceFormErrors {
    const errors: WorkspaceFormErrors = {};

    if (!values.name.trim()) {
        errors.name = "El nombre es obligatorio.";
    }

    if (!values.timezone.trim()) {
        errors.timezone = "La zona horaria es obligatoria.";
    }

    if (!values.type) {
        errors.type = "El tipo es obligatorio.";
    }

    if (!values.kind) {
        errors.kind = "El modo del workspace es obligatorio.";
    }

    if (!values.currency) {
        errors.currency = "La moneda es obligatoria.";
    }

    if (!values.visibility) {
        errors.visibility = "La visibilidad es obligatoria.";
    }

    return errors;
}

export function WorkspaceForm({
    mode,
    initialValues,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: WorkspaceFormProps) {
    const [values, setValues] = React.useState<WorkspaceFormValues>(initialValues);
    const [errors, setErrors] = React.useState<WorkspaceFormErrors>({});

    React.useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const handleTextChange =
        (field: keyof WorkspaceFormValues) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const nextValue = event.target.value;

                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: nextValue,
                }));
            };

    const handleSelectChange =
        (field: keyof WorkspaceFormValues) =>
            (event: SelectChangeEvent<string>) => {
                const nextValue = event.target.value;

                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: nextValue,
                }) as WorkspaceFormValues);
            };

    const handleCheckboxChange =
        (field: keyof WorkspaceFormValues) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const nextValue = event.target.checked;

                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: nextValue,
                }));
            };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateWorkspaceForm(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        onSubmit(values);
    };

    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {mode === "create" ? "Nuevo workspace" : "Editar workspace"}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Define el tipo de espacio, sus datos generales y su configuración base.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? (
                            <Alert severity="error">{submitErrorMessage}</Alert>
                        ) : null}

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth error={Boolean(errors.type)}>
                                    <InputLabel id="workspace-type-label">Tipo</InputLabel>
                                    <Select
                                        labelId="workspace-type-label"
                                        label="Tipo"
                                        value={values.type}
                                        onChange={handleSelectChange("type")}
                                    >
                                        <MenuItem value="PERSONAL">Personal</MenuItem>
                                        <MenuItem value="HOUSEHOLD">Casa</MenuItem>
                                        <MenuItem value="BUSINESS">Negocio</MenuItem>
                                    </Select>
                                    {errors.type ? (
                                        <FormHelperText>{errors.type}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth error={Boolean(errors.kind)}>
                                    <InputLabel id="workspace-kind-label">Modo</InputLabel>
                                    <Select
                                        labelId="workspace-kind-label"
                                        label="Modo"
                                        value={values.kind}
                                        onChange={handleSelectChange("kind")}
                                    >
                                        <MenuItem value="INDIVIDUAL">Individual</MenuItem>
                                        <MenuItem value="COLLABORATIVE">Colaborativo</MenuItem>
                                    </Select>
                                    {errors.kind ? (
                                        <FormHelperText>{errors.kind}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Nombre"
                                    value={values.name}
                                    onChange={handleTextChange("name")}
                                    error={Boolean(errors.name)}
                                    helperText={errors.name}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Descripción"
                                    value={values.description}
                                    onChange={handleTextChange("description")}
                                    multiline
                                    minRows={3}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth error={Boolean(errors.currency)}>
                                    <InputLabel id="workspace-currency-label">Moneda</InputLabel>
                                    <Select
                                        labelId="workspace-currency-label"
                                        label="Moneda"
                                        value={values.currency}
                                        onChange={handleSelectChange("currency")}
                                    >
                                        <MenuItem value="MXN">MXN</MenuItem>
                                        <MenuItem value="USD">USD</MenuItem>
                                    </Select>
                                    {errors.currency ? (
                                        <FormHelperText>{errors.currency}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Zona horaria"
                                    value={values.timezone}
                                    onChange={handleTextChange("timezone")}
                                    error={Boolean(errors.timezone)}
                                    helperText={errors.timezone}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="País"
                                    value={values.country}
                                    onChange={handleTextChange("country")}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Ícono"
                                    value={values.icon}
                                    onChange={handleTextChange("icon")}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Color"
                                    value={values.color}
                                    onChange={handleTextChange("color")}
                                    placeholder="#1976d2"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth error={Boolean(errors.visibility)}>
                                    <InputLabel id="workspace-visibility-label">Visibilidad</InputLabel>
                                    <Select
                                        labelId="workspace-visibility-label"
                                        label="Visibilidad"
                                        value={values.visibility}
                                        onChange={handleSelectChange("visibility")}
                                    >
                                        <MenuItem value="PRIVATE">Privado</MenuItem>
                                        <MenuItem value="SHARED">Compartido</MenuItem>
                                    </Select>
                                    {errors.visibility ? (
                                        <FormHelperText>{errors.visibility}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} flexWrap="wrap">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={values.isVisible}
                                        onChange={handleCheckboxChange("isVisible")}
                                    />
                                }
                                label="Visible"
                            />

                            {mode === "edit" ? (
                                <>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.isActive}
                                                onChange={handleCheckboxChange("isActive")}
                                            />
                                        }
                                        label="Activo"
                                    />

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.isArchived}
                                                onChange={handleCheckboxChange("isArchived")}
                                            />
                                        }
                                        label="Archivado"
                                    />
                                </>
                            ) : null}
                        </Stack>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                                Cancelar
                            </Button>

                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {mode === "create" ? "Crear workspace" : "Guardar cambios"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
// src/features/adminUsers/components/AdminUserForm.tsx

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

import type { UserRole } from "../../../shared/types/common.types";

export type AdminUserFormValues = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    avatarUrl: string;
    role: UserRole;
    isActive: boolean;
    isEmailVerified: boolean;
};

type AdminUserFormField =
    | "fullName"
    | "email"
    | "password"
    | "phone"
    | "avatarUrl"
    | "role";

type AdminUserFormErrors = Partial<Record<AdminUserFormField, string>>;

type AdminUserFormProps = {
    mode: "create" | "edit";
    initialValues: AdminUserFormValues;
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: AdminUserFormValues) => void;
    onCancel: () => void;
};

function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUrl(value: string): boolean {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function validateAdminUserForm(
    values: AdminUserFormValues,
    mode: "create" | "edit"
): AdminUserFormErrors {
    const errors: AdminUserFormErrors = {};

    if (!values.fullName.trim()) {
        errors.fullName = "El nombre completo es obligatorio.";
    }

    if (!values.email.trim()) {
        errors.email = "El email es obligatorio.";
    } else if (!isValidEmail(values.email.trim())) {
        errors.email = "El email no tiene un formato válido.";
    }

    if (mode === "create") {
        if (!values.password.trim()) {
            errors.password = "La contraseña es obligatoria.";
        } else if (values.password.trim().length < 8) {
            errors.password = "La contraseña debe tener al menos 8 caracteres.";
        }
    }

    if (values.phone.trim() && values.phone.trim().length < 7) {
        errors.phone = "El teléfono parece demasiado corto.";
    }

    if (values.avatarUrl.trim() && !isValidUrl(values.avatarUrl.trim())) {
        errors.avatarUrl = "El avatar debe ser una URL válida.";
    }

    if (!values.role) {
        errors.role = "El rol es obligatorio.";
    }

    return errors;
}

export function AdminUserForm({
    mode,
    initialValues,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: AdminUserFormProps) {
    const [values, setValues] = React.useState<AdminUserFormValues>(initialValues);
    const [errors, setErrors] = React.useState<AdminUserFormErrors>({});

    React.useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const handleTextChange =
        (field: keyof AdminUserFormValues) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
            };

    const handleRoleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "USER" || value === "ADMIN") {
            setValues((currentValues) => ({
                ...currentValues,
                role: value,
            }));
        }
    };

    const handleCheckboxChange =
        (field: "isActive" | "isEmailVerified") =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.checked,
                }));
            };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateAdminUserForm(values, mode);
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
                                {mode === "create" ? "Nuevo usuario" : "Editar usuario"}
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Administra usuarios globales del sistema desde la vista de administración.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? (
                            <Alert severity="error">{submitErrorMessage}</Alert>
                        ) : null}

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Nombre completo"
                                    value={values.fullName}
                                    onChange={handleTextChange("fullName")}
                                    error={Boolean(errors.fullName)}
                                    helperText={errors.fullName}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={values.email}
                                    onChange={handleTextChange("email")}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email}
                                    fullWidth
                                />
                            </Grid>

                            {mode === "create" ? (
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Contraseña"
                                        type="password"
                                        value={values.password}
                                        onChange={handleTextChange("password")}
                                        error={Boolean(errors.password)}
                                        helperText={
                                            errors.password ?? "Mínimo 8 caracteres."
                                        }
                                        fullWidth
                                    />
                                </Grid>
                            ) : null}

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Teléfono"
                                    value={values.phone}
                                    onChange={handleTextChange("phone")}
                                    error={Boolean(errors.phone)}
                                    helperText={errors.phone ?? "Opcional."}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Avatar URL"
                                    value={values.avatarUrl}
                                    onChange={handleTextChange("avatarUrl")}
                                    error={Boolean(errors.avatarUrl)}
                                    helperText={errors.avatarUrl ?? "Opcional."}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth error={Boolean(errors.role)}>
                                    <InputLabel id="admin-user-role-label">Rol</InputLabel>
                                    <Select
                                        labelId="admin-user-role-label"
                                        label="Rol"
                                        value={values.role}
                                        onChange={handleRoleChange}
                                    >
                                        <MenuItem value="USER">Usuario</MenuItem>
                                        <MenuItem value="ADMIN">Admin</MenuItem>
                                    </Select>

                                    {errors.role ? (
                                        <FormHelperText>{errors.role}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={2}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", md: "center" }}
                        >
                            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
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
                                            checked={values.isEmailVerified}
                                            onChange={handleCheckboxChange("isEmailVerified")}
                                        />
                                    }
                                    label="Email verificado"
                                />
                            </Stack>

                            <Stack direction="row" spacing={1.5}>
                                <Button
                                    variant="outlined"
                                    onClick={onCancel}
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? mode === "create"
                                            ? "Creando..."
                                            : "Guardando..."
                                        : mode === "create"
                                            ? "Crear usuario"
                                            : "Guardar cambios"}
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
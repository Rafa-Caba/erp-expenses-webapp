// src/features/profile/components/ProfilePasswordForm.tsx

import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

type ProfilePasswordFormValues = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

type ProfilePasswordFormField =
    | "currentPassword"
    | "newPassword"
    | "confirmNewPassword";

type ProfilePasswordFormErrors = Partial<Record<ProfilePasswordFormField, string>>;

type ProfilePasswordFormProps = {
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    submitSuccessMessage?: string | null;
    onSubmit: (values: ProfilePasswordFormValues) => void;
};

function validateProfilePasswordForm(
    values: ProfilePasswordFormValues
): ProfilePasswordFormErrors {
    const errors: ProfilePasswordFormErrors = {};

    if (!values.currentPassword.trim()) {
        errors.currentPassword = "La contraseña actual es obligatoria.";
    }

    if (!values.newPassword.trim()) {
        errors.newPassword = "La nueva contraseña es obligatoria.";
    } else if (values.newPassword.trim().length < 8) {
        errors.newPassword = "La nueva contraseña debe tener al menos 8 caracteres.";
    }

    if (!values.confirmNewPassword.trim()) {
        errors.confirmNewPassword = "Confirma la nueva contraseña.";
    } else if (values.newPassword !== values.confirmNewPassword) {
        errors.confirmNewPassword = "La confirmación no coincide con la nueva contraseña.";
    }

    if (
        values.currentPassword.trim() &&
        values.newPassword.trim() &&
        values.currentPassword === values.newPassword
    ) {
        errors.newPassword = "La nueva contraseña debe ser diferente a la actual.";
    }

    return errors;
}

const INITIAL_VALUES: ProfilePasswordFormValues = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
};

export function ProfilePasswordForm({
    isSubmitting,
    submitErrorMessage = null,
    submitSuccessMessage = null,
    onSubmit,
}: ProfilePasswordFormProps) {
    const [values, setValues] = React.useState<ProfilePasswordFormValues>(INITIAL_VALUES);
    const [errors, setErrors] = React.useState<ProfilePasswordFormErrors>({});

    const handleTextChange =
        (field: keyof ProfilePasswordFormValues) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
            };

    const handleReset = () => {
        setValues(INITIAL_VALUES);
        setErrors({});
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateProfilePasswordForm(values);
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
                                Seguridad
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Cambia tu contraseña actual por una nueva contraseña segura.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? (
                            <Alert severity="error">{submitErrorMessage}</Alert>
                        ) : null}

                        {submitSuccessMessage ? (
                            <Alert severity="success">{submitSuccessMessage}</Alert>
                        ) : null}

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Contraseña actual"
                                    type="password"
                                    value={values.currentPassword}
                                    onChange={handleTextChange("currentPassword")}
                                    error={Boolean(errors.currentPassword)}
                                    helperText={errors.currentPassword}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Nueva contraseña"
                                    type="password"
                                    value={values.newPassword}
                                    onChange={handleTextChange("newPassword")}
                                    error={Boolean(errors.newPassword)}
                                    helperText={errors.newPassword}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Confirmar nueva contraseña"
                                    type="password"
                                    value={values.confirmNewPassword}
                                    onChange={handleTextChange("confirmNewPassword")}
                                    error={Boolean(errors.confirmNewPassword)}
                                    helperText={errors.confirmNewPassword}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button
                                variant="outlined"
                                onClick={handleReset}
                                disabled={isSubmitting}
                            >
                                Limpiar
                            </Button>

                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {isSubmitting ? "Actualizando..." : "Cambiar contraseña"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
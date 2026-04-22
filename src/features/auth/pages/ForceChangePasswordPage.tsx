// src/features/auth/pages/ForceChangePasswordPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { AuthPageCard } from "../components/AuthPageCard";
import { useChangePasswordMutation, useLogoutMutation } from "../hooks/useAuthMutations";

const forceChangePasswordSchema = z
    .object({
        currentPassword: z.string().min(8, "La contraseña temporal es obligatoria."),
        newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres."),
        confirmPassword: z
            .string()
            .min(8, "La confirmación debe tener al menos 8 caracteres."),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
        message: "Las contraseñas no coinciden.",
        path: ["confirmPassword"],
    });

type ForceChangePasswordFormValues = z.infer<typeof forceChangePasswordSchema>;

function getSubmitErrorMessage(error: Error | null): string {
    if (!error) {
        return "";
    }

    return error.message || "No se pudo actualizar la contraseña.";
}

export function ForceChangePasswordPage() {
    const navigate = useNavigate();

    const changePasswordMutation = useChangePasswordMutation();
    const logoutMutation = useLogoutMutation();

    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const form = useForm<ForceChangePasswordFormValues>({
        resolver: zodResolver(forceChangePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const response = await changePasswordMutation.mutateAsync({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
        });

        if (response.user.mustChangePassword) {
            return;
        }

        navigate("/app/personal/dashboard", { replace: true });
    });

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                navigate("/auth/login", { replace: true });
            },
            onError: () => {
                navigate("/auth/login", { replace: true });
            },
        });
    };

    return (
        <AuthPageCard
            title="Actualiza tu contraseña"
            subtitle="Tu cuenta tiene una contraseña temporal. Debes cambiarla antes de continuar."
            errorMessage={
                changePasswordMutation.isError
                    ? getSubmitErrorMessage(changePasswordMutation.error)
                    : null
            }
            footer={
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Usa tu contraseña temporal como contraseña actual y define una nueva
                    contraseña personal para continuar.
                </Typography>
            }
        >
            <Stack spacing={2.5}>
                <Alert severity="warning">
                    Por seguridad, debes cambiar tu contraseña antes de usar la aplicación.
                </Alert>

                {changePasswordMutation.isSuccess ? (
                    <Alert severity="success">
                        {changePasswordMutation.data.message}
                    </Alert>
                ) : null}

                <Box
                    component="form"
                    onSubmit={onSubmit}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <TextField
                        label="Contraseña actual / temporal"
                        type={showCurrentPassword ? "text" : "password"}
                        autoComplete="current-password"
                        {...form.register("currentPassword")}
                        error={Boolean(form.formState.errors.currentPassword)}
                        helperText={form.formState.errors.currentPassword?.message}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    (currentValue) => !currentValue
                                                )
                                            }
                                            aria-label={
                                                showCurrentPassword
                                                    ? "Ocultar contraseña actual"
                                                    : "Mostrar contraseña actual"
                                            }
                                        >
                                            {showCurrentPassword ? (
                                                <VisibilityOffIcon />
                                            ) : (
                                                <VisibilityIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        label="Nueva contraseña"
                        type={showNewPassword ? "text" : "password"}
                        autoComplete="new-password"
                        {...form.register("newPassword")}
                        error={Boolean(form.formState.errors.newPassword)}
                        helperText={form.formState.errors.newPassword?.message}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    (currentValue) => !currentValue
                                                )
                                            }
                                            aria-label={
                                                showNewPassword
                                                    ? "Ocultar nueva contraseña"
                                                    : "Mostrar nueva contraseña"
                                            }
                                        >
                                            {showNewPassword ? (
                                                <VisibilityOffIcon />
                                            ) : (
                                                <VisibilityIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        label="Confirmar nueva contraseña"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        {...form.register("confirmPassword")}
                        error={Boolean(form.formState.errors.confirmPassword)}
                        helperText={form.formState.errors.confirmPassword?.message}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (currentValue) => !currentValue
                                                )
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Ocultar confirmación de contraseña"
                                                    : "Mostrar confirmación de contraseña"
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <VisibilityOffIcon />
                                            ) : (
                                                <VisibilityIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={changePasswordMutation.isPending}
                        >
                            {changePasswordMutation.isPending
                                ? "Actualizando..."
                                : "Actualizar contraseña"}
                        </Button>

                        <Button
                            variant="outlined"
                            color="inherit"
                            disabled={logoutMutation.isPending}
                            onClick={handleLogout}
                        >
                            {logoutMutation.isPending ? "Cerrando..." : "Cerrar sesión"}
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </AuthPageCard>
    );
}
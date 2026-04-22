// src/features/auth/pages/ResetPasswordPage.tsx

import React from "react";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { useResetPasswordMutation } from "../hooks/useAuthMutations";

const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(6, "Mínimo 6 caracteres"),
        confirmPassword: z.string().min(6, "Mínimo 6 caracteres"),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function getResetPasswordErrorMessage(error: Error | null): string {
    if (!error) {
        return "";
    }

    return error.message || "No se pudo restablecer la contraseña.";
}

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const resetPasswordMutation = useResetPasswordMutation();

    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        if (!token) {
            return;
        }

        await resetPasswordMutation.mutateAsync({
            token,
            newPassword: values.newPassword,
        });
    });

    const isMissingToken = token.length === 0;

    return (
        <AuthPageCard
            title="Nueva contraseña"
            subtitle="Ingresa la nueva contraseña para tu cuenta."
            errorMessage={
                resetPasswordMutation.isError
                    ? getResetPasswordErrorMessage(resetPasswordMutation.error)
                    : null
            }
            footer={
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Cuando termines, podrás iniciar sesión con tu nueva contraseña.
                </Typography>
            }
        >
            <Stack spacing={2.5}>
                {isMissingToken ? (
                    <Alert severity="error">
                        El enlace de restablecimiento no contiene un token válido.
                    </Alert>
                ) : null}

                {resetPasswordMutation.isSuccess ? (
                    <Alert severity="success">
                        {resetPasswordMutation.data.message}
                    </Alert>
                ) : null}

                {!resetPasswordMutation.isSuccess ? (
                    <Box
                        component="form"
                        onSubmit={onSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        <TextField
                            label="Nueva contraseña"
                            type={showNewPassword ? "text" : "password"}
                            autoComplete="new-password"
                            {...form.register("newPassword")}
                            error={Boolean(form.formState.errors.newPassword)}
                            helperText={form.formState.errors.newPassword?.message}
                            disabled={isMissingToken}
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
                            label="Confirmar contraseña"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            {...form.register("confirmPassword")}
                            error={Boolean(form.formState.errors.confirmPassword)}
                            helperText={form.formState.errors.confirmPassword?.message}
                            disabled={isMissingToken}
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
                                disabled={resetPasswordMutation.isPending || isMissingToken}
                            >
                                {resetPasswordMutation.isPending
                                    ? "Guardando..."
                                    : "Actualizar contraseña"}
                            </Button>

                            <Button variant="outlined" onClick={() => navigate("/auth/login")}>
                                Cancelar
                            </Button>
                        </Stack>
                    </Box>
                ) : (
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                        <Button variant="contained" onClick={() => navigate("/auth/login")}>
                            Ir a login
                        </Button>
                    </Stack>
                )}
            </Stack>
        </AuthPageCard>
    );
}
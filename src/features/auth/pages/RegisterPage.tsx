// src/features/auth/pages/RegisterPage.tsx
// Register page.
// Aligns validation with backend auth rules, adds password confirmation,
// normalizes email, and shows friendly Spanish API errors.

import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import type {
    ApiErrorResponse,
    ApiValidationErrorResponse,
} from "../../../shared/types/api.types";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import { AuthPageCard } from "../components/AuthPageCard";
import { useRegisterMutation } from "../hooks/useAuthMutations";
import type { RegisterPayload } from "../types/auth.types";

const registerSchema = z
    .object({
        fullName: z
            .string()
            .trim()
            .min(2, "El nombre debe tener al menos 2 caracteres.")
            .max(120, "El nombre no puede exceder 120 caracteres."),
        email: z
            .string()
            .trim()
            .min(1, "El correo es obligatorio.")
            .email("Ingresa un correo válido."),
        password: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres.")
            .max(255, "La contraseña no puede exceder 255 caracteres."),
        confirmPassword: z.string().min(1, "Confirma tu contraseña."),
        phone: z.string().trim().max(30, "El teléfono no puede exceder 30 caracteres."),
    })
    .refine((value) => value.password === value.confirmPassword, {
        path: ["confirmPassword"],
        message: "Las contraseñas no coinciden.",
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

function toRegisterPayload(values: RegisterFormValues): RegisterPayload {
    return {
        fullName: values.fullName.trim(),
        email: values.email.trim().toLocaleLowerCase(),
        password: values.password,
        phone: values.phone.trim() || undefined,
    };
}

function getRegisterErrorMessage(error: Error | null): string {
    if (!error) {
        return "No se pudo crear la cuenta.";
    }

    if (axios.isAxiosError<ApiErrorResponse | ApiValidationErrorResponse>(error)) {
        const statusCode = error.response?.status;
        const responseData = error.response?.data;
        const responseCode =
            responseData && "code" in responseData ? responseData.code : undefined;

        if (statusCode === 409 || responseCode === "EMAIL_ALREADY_IN_USE") {
            return "Ese correo ya está registrado. Intenta iniciar sesión o restablecer tu contraseña.";
        }
    }

    return getApiErrorMessage(
        error,
        "No se pudo crear la cuenta. Revisa tus datos e intenta de nuevo."
    );
}

function buildVerificationSentPath(email: string): string {
    const searchParams = new URLSearchParams({
        email,
    });

    return `/auth/verify-email-sent?${searchParams.toString()}`;
}

export function RegisterPage() {
    const navigate = useNavigate();
    const registerMutation = useRegisterMutation();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
        },
        mode: "onBlur",
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const payload = toRegisterPayload(values);
        const response = await registerMutation.mutateAsync(payload);

        navigate(buildVerificationSentPath(response.user.email), { replace: true });
    });

    return (
        <AuthPageCard
            title="Crear cuenta"
            subtitle="Regístrate para administrar tu espacio personal y tus workspaces."
            errorMessage={
                registerMutation.isError ? getRegisterErrorMessage(registerMutation.error) : null
            }
            footer={
                <Stack spacing={1}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        ¿Ya tienes cuenta?{" "}
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => navigate("/auth/login")}
                            sx={{
                                minWidth: 0,
                                p: 0,
                                textTransform: "none",
                                verticalAlign: "baseline",
                            }}
                        >
                            Iniciar sesión
                        </Button>
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        ¿No te llegó el correo de verificación?{" "}
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => navigate("/auth/resend-verification")}
                            sx={{
                                minWidth: 0,
                                p: 0,
                                textTransform: "none",
                                verticalAlign: "baseline",
                            }}
                        >
                            Reenviarlo
                        </Button>
                    </Typography>
                </Stack>
            }
        >
            <Box
                component="form"
                onSubmit={onSubmit}
                noValidate
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="Nombre completo"
                    autoComplete="name"
                    fullWidth
                    disabled={registerMutation.isPending}
                    {...form.register("fullName")}
                    error={Boolean(form.formState.errors.fullName)}
                    helperText={form.formState.errors.fullName?.message}
                />

                <TextField
                    label="Correo"
                    type="email"
                    autoComplete="email"
                    fullWidth
                    disabled={registerMutation.isPending}
                    {...form.register("email")}
                    error={Boolean(form.formState.errors.email)}
                    helperText={form.formState.errors.email?.message}
                />

                <TextField
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    fullWidth
                    disabled={registerMutation.isPending}
                    {...form.register("password")}
                    error={Boolean(form.formState.errors.password)}
                    helperText={
                        form.formState.errors.password?.message ??
                        "Mínimo 8 caracteres."
                    }
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        onClick={() =>
                                            setShowPassword((currentValue) => !currentValue)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Ocultar contraseña"
                                                : "Mostrar contraseña"
                                        }
                                        disabled={registerMutation.isPending}
                                    >
                                        {showPassword ? (
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
                    fullWidth
                    disabled={registerMutation.isPending}
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
                                                ? "Ocultar confirmación"
                                                : "Mostrar confirmación"
                                        }
                                        disabled={registerMutation.isPending}
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

                <TextField
                    label="Teléfono (opcional)"
                    autoComplete="tel"
                    fullWidth
                    disabled={registerMutation.isPending}
                    {...form.register("phone")}
                    error={Boolean(form.formState.errors.phone)}
                    helperText={form.formState.errors.phone?.message}
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={registerMutation.isPending}
                    sx={{ mt: 0.5 }}
                >
                    {registerMutation.isPending ? "Creando cuenta…" : "Crear cuenta"}
                </Button>
            </Box>
        </AuthPageCard>
    );
}
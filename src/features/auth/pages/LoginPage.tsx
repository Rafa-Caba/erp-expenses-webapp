// src/features/auth/pages/LoginPage.tsx
// Login page.
// Aligns frontend validation with the API, normalizes email, shows friendly
// Spanish API errors, and avoids raw Axios messages such as
// "Request failed with status code 401".

import React from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
import { useLoginMutation } from "../hooks/useAuthMutations";
import type { AuthSuccessResponse, LoginPayload } from "../types/auth.types";

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "El correo es obligatorio.")
        .email("Ingresa un correo válido."),
    password: z.string().min(1, "La contraseña es obligatoria."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function readRedirectPath(state: unknown): string | null {
    if (!state || typeof state !== "object" || !("from" in state)) {
        return null;
    }

    const candidate = state.from;

    if (typeof candidate !== "string") {
        return null;
    }

    if (!candidate.startsWith("/app")) {
        return null;
    }

    return candidate;
}

function toLoginPayload(values: LoginFormValues): LoginPayload {
    return {
        email: values.email.trim().toLocaleLowerCase(),
        password: values.password,
    };
}

function getLoginErrorMessage(error: Error | null): string {
    if (!error) {
        return "No se pudo iniciar sesión.";
    }

    if (axios.isAxiosError<ApiErrorResponse | ApiValidationErrorResponse>(error)) {
        const statusCode = error.response?.status;
        const responseData = error.response?.data;
        const responseCode =
            responseData && "code" in responseData ? responseData.code : undefined;

        if (statusCode === 401 || responseCode === "INVALID_CREDENTIALS") {
            return "Correo o contraseña incorrectos.";
        }

        if (statusCode === 403 || responseCode === "USER_INACTIVE") {
            return "Tu usuario está inactivo. Contacta al administrador del workspace.";
        }
    }

    return getApiErrorMessage(
        error,
        "No se pudo iniciar sesión. Revisa tus datos e intenta de nuevo."
    );
}

function buildVerificationSentPath(email: string): string {
    const searchParams = new URLSearchParams({
        email,
    });

    return `/auth/verify-email-sent?${searchParams.toString()}`;
}

function resolvePostLoginRoute(response: AuthSuccessResponse, redirectTo: string): string {
    if (!response.user.isEmailVerified) {
        return buildVerificationSentPath(response.user.email);
    }

    if (response.user.mustChangePassword) {
        return "/auth/force-change-password";
    }

    return redirectTo;
}

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const loginMutation = useLoginMutation();
    const [showPassword, setShowPassword] = React.useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onBlur",
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const response = await loginMutation.mutateAsync(toLoginPayload(values));
        const redirectTo = readRedirectPath(location.state) ?? "/app/personal/dashboard";
        const nextRoute = resolvePostLoginRoute(response, redirectTo);

        navigate(nextRoute, { replace: true });
    });

    return (
        <AuthPageCard
            title="Iniciar sesión"
            subtitle="Accede a tu panel personal y a tus workspaces de casa o negocio."
            errorMessage={loginMutation.isError ? getLoginErrorMessage(loginMutation.error) : null}
            footer={
                <Stack spacing={1}>
                    {/* <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        ¿Aún no tienes cuenta?{" "}
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => navigate("/auth/register")}
                            sx={{
                                minWidth: 0,
                                p: 0,
                                textTransform: "none",
                                verticalAlign: "baseline",
                            }}
                        >
                            Crear cuenta
                        </Button>
                    </Typography> */}

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        ¿Olvidaste tu contraseña?{" "}
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => navigate("/auth/forgot-password")}
                            sx={{
                                minWidth: 0,
                                p: 0,
                                textTransform: "none",
                                verticalAlign: "baseline",
                            }}
                        >
                            Restablecer
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
                    label="Correo"
                    type="email"
                    autoComplete="email"
                    fullWidth
                    disabled={loginMutation.isPending}
                    {...form.register("email")}
                    error={Boolean(form.formState.errors.email)}
                    helperText={form.formState.errors.email?.message}
                />

                <TextField
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    fullWidth
                    disabled={loginMutation.isPending}
                    {...form.register("password")}
                    error={Boolean(form.formState.errors.password)}
                    helperText={form.formState.errors.password?.message}
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
                                        disabled={loginMutation.isPending}
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

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loginMutation.isPending}
                    sx={{ mt: 0.5 }}
                >
                    {loginMutation.isPending ? "Entrando…" : "Entrar"}
                </Button>
            </Box>
        </AuthPageCard>
    );
}
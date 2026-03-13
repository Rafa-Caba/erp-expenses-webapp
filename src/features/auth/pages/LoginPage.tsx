// src/features/auth/pages/LoginPage.tsx

import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useLoginMutation } from "../hooks/useAuthMutations";
import { AuthPageCard } from "../components/AuthPageCard";

const loginSchema = z.object({
    email: z.string().trim().email("Correo inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function readRedirectPath(state: object | null): string | null {
    if (!state || !("from" in state)) {
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

function getLoginErrorMessage(error: Error | null): string {
    if (!error) {
        return "";
    }

    return error.message || "No se pudo iniciar sesión. Revisa tus credenciales.";
}

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const loginMutation = useLoginMutation();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        await loginMutation.mutateAsync(values);

        const locationState =
            typeof location.state === "object" && location.state !== null
                ? location.state
                : null;

        const redirectTo = readRedirectPath(locationState) ?? "/app/personal/dashboard";

        navigate(redirectTo, { replace: true });
    });

    return (
        <AuthPageCard
            title="Iniciar sesión"
            subtitle="Accede a tu panel personal y a tus workspaces de casa o negocio."
            errorMessage={loginMutation.isError ? getLoginErrorMessage(loginMutation.error) : null}
            footer={
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    ¿Aún no tienes cuenta?{" "}
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate("/auth/register")}
                        sx={{ minWidth: 0, p: 0, textTransform: "none", verticalAlign: "baseline" }}
                    >
                        Crear cuenta
                    </Button>
                </Typography>
            }
        >
            <Box
                component="form"
                onSubmit={onSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="Correo"
                    type="email"
                    autoComplete="email"
                    {...form.register("email")}
                    error={Boolean(form.formState.errors.email)}
                    helperText={form.formState.errors.email?.message}
                />

                <TextField
                    label="Contraseña"
                    type="password"
                    autoComplete="current-password"
                    {...form.register("password")}
                    error={Boolean(form.formState.errors.password)}
                    helperText={form.formState.errors.password?.message}
                />

                <Stack direction="column" spacing={1}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? "Entrando..." : "Entrar"}
                    </Button>
                </Stack>
            </Box>
        </AuthPageCard>
    );
}
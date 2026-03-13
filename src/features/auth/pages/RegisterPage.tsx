// src/features/auth/pages/RegisterPage.tsx

import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useRegisterMutation } from "../hooks/useAuthMutations";
import { AuthPageCard } from "../components/AuthPageCard";
import type { RegisterPayload } from "../types/auth.types";

const registerSchema = z.object({
    fullName: z.string().trim().min(3, "Mínimo 3 caracteres"),
    email: z.string().trim().email("Correo inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    phone: z
        .string()
        .trim()
        .max(30, "Máximo 30 caracteres")
        .or(z.literal("")),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function toRegisterPayload(values: RegisterFormValues): RegisterPayload {
    return {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        phone: values.phone.trim() || undefined,
    };
}

function getRegisterErrorMessage(error: Error | null): string {
    if (!error) {
        return "";
    }

    return error.message || "No se pudo crear la cuenta.";
}

export function RegisterPage() {
    const navigate = useNavigate();
    const registerMutation = useRegisterMutation();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            phone: "",
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const payload = toRegisterPayload(values);

        await registerMutation.mutateAsync(payload);
        navigate("/app/personal/dashboard", { replace: true });
    });

    return (
        <AuthPageCard
            title="Crear cuenta"
            subtitle="Regístrate para administrar tu espacio personal y tus workspaces."
            errorMessage={
                registerMutation.isError ? getRegisterErrorMessage(registerMutation.error) : null
            }
            footer={
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    ¿Ya tienes cuenta?{" "}
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate("/auth/login")}
                        sx={{ minWidth: 0, p: 0, textTransform: "none", verticalAlign: "baseline" }}
                    >
                        Iniciar sesión
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
                    label="Nombre completo"
                    autoComplete="name"
                    {...form.register("fullName")}
                    error={Boolean(form.formState.errors.fullName)}
                    helperText={form.formState.errors.fullName?.message}
                />

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
                    autoComplete="new-password"
                    {...form.register("password")}
                    error={Boolean(form.formState.errors.password)}
                    helperText={form.formState.errors.password?.message}
                />

                <TextField
                    label="Teléfono (opcional)"
                    autoComplete="tel"
                    {...form.register("phone")}
                    error={Boolean(form.formState.errors.phone)}
                    helperText={form.formState.errors.phone?.message}
                />

                <Stack direction="column" spacing={1}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={registerMutation.isPending}
                    >
                        {registerMutation.isPending ? "Creando cuenta..." : "Crear cuenta"}
                    </Button>
                </Stack>
            </Box>
        </AuthPageCard>
    );
}
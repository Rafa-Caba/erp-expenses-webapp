// src/features/auth/pages/ForgotPasswordPage.tsx

import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { AuthPageCard } from "../components/AuthPageCard";
import { useForgotPasswordMutation } from "../hooks/useAuthMutations";

const forgotPasswordSchema = z.object({
    email: z.string().trim().email("Correo inválido"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

function getForgotPasswordErrorMessage(error: Error | null): string {
    if (!error) {
        return "";
    }

    return error.message || "No se pudo solicitar el restablecimiento.";
}

export function ForgotPasswordPage() {
    const navigate = useNavigate();
    const forgotPasswordMutation = useForgotPasswordMutation();

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        await forgotPasswordMutation.mutateAsync({
            email: values.email.trim(),
        });
    });

    return (
        <AuthPageCard
            title="Restablecer contraseña"
            subtitle="Te enviaremos un enlace para cambiar tu contraseña."
            errorMessage={
                forgotPasswordMutation.isError
                    ? getForgotPasswordErrorMessage(forgotPasswordMutation.error)
                    : null
            }
            footer={
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    ¿Ya recuerdas tu contraseña?{" "}
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
                        Ir a login
                    </Button>
                </Typography>
            }
        >
            <Stack spacing={2.5}>
                {forgotPasswordMutation.isSuccess ? (
                    <Alert severity="success">
                        {forgotPasswordMutation.data.message}
                    </Alert>
                ) : null}

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

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={forgotPasswordMutation.isPending}
                        >
                            {forgotPasswordMutation.isPending
                                ? "Enviando..."
                                : "Enviar enlace"}
                        </Button>

                        <Button variant="outlined" onClick={() => navigate("/auth/login")}>
                            Cancelar
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </AuthPageCard>
    );
}
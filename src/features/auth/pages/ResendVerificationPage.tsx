// src/features/auth/pages/ResendVerificationPage.tsx

import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { useResendVerificationMutation } from "../hooks/useAuthMutations";

const resendVerificationSchema = z.object({
    email: z.string().trim().email("Correo inválido"),
});

type ResendVerificationFormValues = z.infer<typeof resendVerificationSchema>;

function getSubmitErrorMessage(error: Error | null): string {
    if (!error) {
        return "";
    }

    return error.message || "No se pudo reenviar el correo de verificación.";
}

export function ResendVerificationPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const defaultEmail = useMemo(() => {
        const rawValue = searchParams.get("email");

        if (!rawValue) {
            return "";
        }

        return rawValue.trim();
    }, [searchParams]);

    const resendVerificationMutation = useResendVerificationMutation();

    const form = useForm<ResendVerificationFormValues>({
        resolver: zodResolver(resendVerificationSchema),
        defaultValues: {
            email: defaultEmail,
        },
        values: {
            email: defaultEmail,
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        await resendVerificationMutation.mutateAsync({
            email: values.email.trim(),
        });
    });

    return (
        <AuthPageCard
            title="Reenviar verificación"
            subtitle="Solicita un nuevo correo para verificar tu cuenta."
            errorMessage={
                resendVerificationMutation.isError
                    ? getSubmitErrorMessage(resendVerificationMutation.error)
                    : null
            }
            footer={
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    ¿Ya verificaste tu correo?{" "}
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
                        Volver a login
                    </Button>
                </Typography>
            }
        >
            <Stack spacing={2.5}>
                {resendVerificationMutation.isSuccess ? (
                    <Alert severity="success">
                        {resendVerificationMutation.data.message}
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
                            disabled={resendVerificationMutation.isPending}
                        >
                            {resendVerificationMutation.isPending
                                ? "Reenviando..."
                                : "Reenviar correo"}
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
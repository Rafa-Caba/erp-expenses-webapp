// src/features/auth/pages/VerificationEmailSentPage.tsx

import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AuthPageCard } from "../components/AuthPageCard";

export function VerificationEmailSentPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const email = useMemo(() => {
        const rawValue = searchParams.get("email");

        if (!rawValue) {
            return null;
        }

        const normalizedValue = rawValue.trim();
        return normalizedValue.length > 0 ? normalizedValue : null;
    }, [searchParams]);

    const resendPath = email
        ? `/auth/resend-verification?email=${encodeURIComponent(email)}`
        : "/auth/resend-verification";

    return (
        <AuthPageCard
            title="Verifica tu correo"
            subtitle="Te enviamos un enlace para confirmar tu cuenta."
            footer={
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Cuando termines la verificación, ya puedes volver a iniciar sesión o continuar
                    al panel si tu sesión sigue activa.
                </Typography>
            }
        >
            <Stack spacing={2.5}>
                <Alert severity="info">
                    {email
                        ? `Revisa la bandeja de entrada de ${email}. Si no aparece, revisa spam o promociones.`
                        : "Revisa tu bandeja de entrada. Si no aparece, revisa spam o promociones."}
                </Alert>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button variant="contained" onClick={() => navigate(resendPath)}>
                        Reenviar correo
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => navigate("/app/personal/dashboard")}
                    >
                        Ir al panel
                    </Button>

                    <Button variant="text" onClick={() => navigate("/auth/login")}>
                        Ir a login
                    </Button>
                </Stack>
            </Stack>
        </AuthPageCard>
    );
}
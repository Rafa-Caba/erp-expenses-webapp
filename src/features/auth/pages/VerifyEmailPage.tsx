// src/features/auth/pages/VerifyEmailPage.tsx

import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AuthPageCard } from "../components/AuthPageCard";
import { useVerifyEmailMutation } from "../hooks/useAuthMutations";

export function VerifyEmailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const verifyEmailMutation = useVerifyEmailMutation();

    const token = searchParams.get("token")?.trim() ?? "";
    const requestedRef = React.useRef(false);

    React.useEffect(() => {
        if (!token || requestedRef.current) {
            return;
        }

        requestedRef.current = true;
        verifyEmailMutation.mutate({
            token,
        });
    }, [token, verifyEmailMutation]);

    const isMissingToken = token.length === 0;

    return (
        <AuthPageCard
            title="Verificación de correo"
            subtitle="Estamos validando tu enlace de confirmación."
        >
            <Stack spacing={2.5}>
                {isMissingToken ? (
                    <Alert severity="error">
                        El enlace de verificación no contiene un token válido.
                    </Alert>
                ) : null}

                {!isMissingToken && verifyEmailMutation.isPending ? (
                    <Box sx={{ minHeight: 180, display: "grid", placeItems: "center" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <CircularProgress />
                            <Box>
                                <Typography sx={{ fontWeight: 700 }}>
                                    Verificando correo…
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Esto solo tomará un momento.
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                ) : null}

                {!isMissingToken && verifyEmailMutation.isSuccess ? (
                    <Alert severity="success">
                        {verifyEmailMutation.data.message}
                    </Alert>
                ) : null}

                {!isMissingToken && verifyEmailMutation.isError ? (
                    <Alert severity="error">
                        {verifyEmailMutation.error.message ||
                            "No se pudo verificar el correo."}
                    </Alert>
                ) : null}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button variant="contained" onClick={() => navigate("/auth/login")}>
                        Ir a login
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => navigate("/auth/resend-verification")}
                    >
                        Reenviar verificación
                    </Button>

                    <Button
                        variant="text"
                        onClick={() => navigate("/app/personal/dashboard")}
                    >
                        Ir al panel
                    </Button>
                </Stack>
            </Stack>
        </AuthPageCard>
    );
}
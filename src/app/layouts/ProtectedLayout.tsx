// src/app/layouts/ProtectedLayout.tsx

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { ensureSession } from "../../features/auth/lib/auth.session";
import { useAuthStore } from "../../features/auth/store/auth.store";

export function ProtectedLayout() {
    const location = useLocation();

    const accessToken = useAuthStore((state) => state.accessToken);
    const refreshToken = useAuthStore((state) => state.refreshToken);
    const user = useAuthStore((state) => state.user);
    const hasHydrated = useAuthStore((state) => state.hasHydrated);

    const [hasFinishedBootstrap, setHasFinishedBootstrap] = React.useState(false);
    const attemptedBootstrapRef = React.useRef(false);

    const hasAuthenticatedSession = Boolean(accessToken && user);
    const hasRefreshToken = Boolean(refreshToken);

    React.useEffect(() => {
        if (!hasHydrated) {
            return;
        }

        if (hasAuthenticatedSession) {
            setHasFinishedBootstrap(true);
            return;
        }

        if (!hasRefreshToken) {
            setHasFinishedBootstrap(true);
            return;
        }

        if (attemptedBootstrapRef.current) {
            return;
        }

        attemptedBootstrapRef.current = true;

        let isMounted = true;

        void (async () => {
            try {
                await ensureSession();
            } finally {
                if (isMounted) {
                    setHasFinishedBootstrap(true);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [hasAuthenticatedSession, hasHydrated, hasRefreshToken]);

    const shouldShowLoading =
        !hasHydrated || (!hasFinishedBootstrap && !hasAuthenticatedSession && hasRefreshToken);

    if (shouldShowLoading) {
        return (
            <Box sx={{ minHeight: "80vh", display: "grid", placeItems: "center", p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CircularProgress />
                    <Box>
                        <Typography sx={{ fontWeight: 700 }}>Cargando sesión…</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Verificando acceso y perfil.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    if (hasAuthenticatedSession) {
        return <Outlet />;
    }

    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
}
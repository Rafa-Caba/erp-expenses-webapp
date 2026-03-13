// src/features/auth/components/AuthPageCard.tsx

import type { ReactNode } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type AuthPageCardProps = {
    title: string;
    subtitle: string;
    errorMessage?: string | null;
    children: ReactNode;
    footer?: ReactNode;
};

export function AuthPageCard({
    title,
    subtitle,
    errorMessage = null,
    children,
    footer,
}: AuthPageCardProps) {
    return (
        <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", p: 2 }}>
            <Paper sx={{ width: "100%", maxWidth: 440, p: 3, borderRadius: 3 }}>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {title}
                        </Typography>

                        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                            {subtitle}
                        </Typography>
                    </Box>

                    {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

                    {children}

                    {footer ? <Box>{footer}</Box> : null}
                </Stack>
            </Paper>
        </Box>
    );
}
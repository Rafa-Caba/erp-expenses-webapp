// src/features/auth/components/AuthPageCard.tsx
// Shared auth page shell/card.
// Keeps login/register/verification flows visually consistent and responsive.

import type { ReactNode } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { SxProps, Theme } from "@mui/material/styles";

type AuthPageCardProps = {
    title: string;
    subtitle: string;
    errorMessage?: string | null;
    successMessage?: string | null;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: number;
};

const pageSx: SxProps<Theme> = {
    minHeight: "100dvh",
    display: "grid",
    placeItems: "center",
    p: {
        xs: 2,
        sm: 3,
    },
    background:
        "radial-gradient(circle at top, rgba(37, 99, 235, 0.16), transparent 34%), linear-gradient(135deg, rgba(15, 23, 42, 0.06), rgba(15, 23, 42, 0.02))",
};

export function AuthPageCard({
    title,
    subtitle,
    errorMessage = null,
    successMessage = null,
    children,
    footer,
    maxWidth = 440,
}: AuthPageCardProps) {
    return (
        <Box sx={pageSx}>
            <Paper
                elevation={8}
                sx={{
                    width: "100%",
                    maxWidth,
                    p: {
                        xs: 2.5,
                        sm: 3,
                    },
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                }}
            >
                <Stack spacing={2.25}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 850 }}>
                            {title}
                        </Typography>

                        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                            {subtitle}
                        </Typography>
                    </Box>

                    {errorMessage ? (
                        <Alert severity="error" variant="outlined">
                            {errorMessage}
                        </Alert>
                    ) : null}

                    {successMessage ? (
                        <Alert severity="success" variant="outlined">
                            {successMessage}
                        </Alert>
                    ) : null}

                    {children}

                    {footer ? <Box>{footer}</Box> : null}
                </Stack>
            </Paper>
        </Box>
    );
}
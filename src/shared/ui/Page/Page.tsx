// src/shared/ui/Page/Page.tsx

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Props = {
    title: string;
    subtitle?: string | null;
    children: React.ReactNode;
};

export function Page({ title, subtitle = null, children }: Props) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: 0,
                width: "100%",
            }}
        >
            <Box sx={{ minWidth: 0 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 800,
                        minWidth: 0,
                        wordBreak: "break-word",
                    }}
                >
                    {title}
                </Typography>

                {subtitle ? (
                    <Typography
                        variant="body2"
                        sx={{
                            opacity: 0.8,
                            mt: 0.5,
                            minWidth: 0,
                            wordBreak: "break-word",
                        }}
                    >
                        {subtitle}
                    </Typography>
                ) : null}
            </Box>

            {children}
        </Box>
    );
}
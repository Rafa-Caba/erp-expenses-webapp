import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Props = {
    title: string; // Spanish UI
    subtitle?: string | null;
    children: React.ReactNode;
};

export function Page({ title, subtitle = null, children }: Props) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {title}
                </Typography>
                {subtitle ? (
                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                        {subtitle}
                    </Typography>
                ) : null}
            </Box>
            {children}
        </Box>
    );
}
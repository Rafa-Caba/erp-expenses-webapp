// src/features/themes/components/ThemePreviewCard.tsx

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";

import type { ThemeKey, ThemeRecord } from "../types/theme.types";

type ThemePreviewCardProps = {
    theme: ThemeRecord;
    selected: boolean;
    onSelect: (themeKey: ThemeKey) => void;
    onEditCustomTheme?: (() => void) | null;
    selectedLabel?: string;
    idleLabel?: string;
};

export function ThemePreviewCard({
    theme,
    selected,
    onSelect,
    onEditCustomTheme = null,
    selectedLabel = "Tema activo",
    idleLabel = "Usar este tema",
}: ThemePreviewCardProps) {
    const canEditCustomTheme =
        theme.key === "customizable" && typeof onEditCustomTheme === "function";

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                borderRadius: 3,
                borderColor: selected ? "primary.main" : "divider",
                boxShadow: selected ? 3 : 0,
                height: "100%",
            }}
        >
            <Stack spacing={1.5} height="100%">
                <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    alignItems="flex-start"
                >
                    <Box>
                        <Typography sx={{ fontWeight: 800 }}>{theme.name}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {theme.description ?? "Sin descripción"}
                        </Typography>
                    </Box>

                    {canEditCustomTheme ? (
                        <IconButton
                            color="primary"
                            onClick={onEditCustomTheme}
                            aria-label="Editar tema personalizable"
                        >
                            <EditRoundedIcon />
                        </IconButton>
                    ) : null}
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {Object.values(theme.colors)
                        .slice(0, 6)
                        .map((colorValue, index) => (
                            <Box
                                key={`${theme.key}-${index}`}
                                sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    bgcolor: colorValue,
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            />
                        ))}
                </Stack>

                <Box sx={{ mt: "auto" }}>
                    <Button
                        fullWidth
                        variant={selected ? "contained" : "outlined"}
                        onClick={() => onSelect(theme.key)}
                        startIcon={<PaletteRoundedIcon />}
                    >
                        {selected ? selectedLabel : idleLabel}
                    </Button>
                </Box>
            </Stack>
        </Paper>
    );
}
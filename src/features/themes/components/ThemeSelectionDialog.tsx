// src/features/themes/components/ThemeSelectionDialog.tsx

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ThemePreviewCard } from "./ThemePreviewCard";
import type { ThemeKey, ThemeRecord } from "../types/theme.types";

type ThemeSelectionDialogProps = {
    open: boolean;
    title?: string;
    availableThemes: ThemeRecord[];
    selectedThemeKey: ThemeKey;
    currentThemeKey: ThemeKey;
    isLoading: boolean;
    isSaving: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    onClose: () => void;
    onSelect: (themeKey: ThemeKey) => void;
    onSave: () => void;
};

export function ThemeSelectionDialog({
    open,
    title = "Seleccionar tema",
    availableThemes,
    selectedThemeKey,
    currentThemeKey,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    onClose,
    onSelect,
    onSave,
}: ThemeSelectionDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{title}</DialogTitle>

            <DialogContent dividers>
                <Stack spacing={2}>
                    {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

                    {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

                    {isLoading ? (
                        <Box sx={{ minHeight: 180, display: "grid", placeItems: "center" }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <CircularProgress size={24} />
                                <Typography>Cargando temas…</Typography>
                            </Stack>
                        </Box>
                    ) : availableThemes.length > 0 ? (
                        <Grid container spacing={2}>
                            {availableThemes.map((theme) => (
                                <Grid key={theme.id} size={{ xs: 12, md: 4 }}>
                                    <ThemePreviewCard
                                        theme={theme}
                                        selected={selectedThemeKey === theme.key}
                                        onSelect={onSelect}
                                        selectedLabel="Seleccionado"
                                        idleLabel="Elegir"
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Alert severity="info">
                            No se encontraron temas disponibles para este workspace.
                        </Alert>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                    disabled={isSaving}
                >
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    onClick={onSave}
                    disabled={isSaving || selectedThemeKey === currentThemeKey}
                >
                    {isSaving ? "Guardando..." : "Guardar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
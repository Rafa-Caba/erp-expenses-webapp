// src/features/workspaces/components/WorkspacesEmptyState.tsx

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

type WorkspacesEmptyStateProps = {
    hasFilters: boolean;
    onClearFilters: () => void;
};

export function WorkspacesEmptyState({
    hasFilters,
    onClearFilters,
}: WorkspacesEmptyStateProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 4,
                borderRadius: 3,
            }}
        >
            <Stack spacing={1.5} alignItems="flex-start">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    No hay workspaces para mostrar
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: 680 }}>
                    {hasFilters
                        ? "No encontramos resultados con los filtros actuales."
                        : "Aún no tienes workspaces adicionales disponibles en tu cuenta."}
                </Typography>

                {hasFilters ? (
                    <Button variant="outlined" onClick={onClearFilters}>
                        Limpiar filtros
                    </Button>
                ) : null}
            </Stack>
        </Paper>
    );
}
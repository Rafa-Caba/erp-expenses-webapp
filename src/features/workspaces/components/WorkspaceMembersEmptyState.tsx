// src/features/workspaces/components/WorkspaceMembersEmptyState.tsx

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type WorkspaceMembersEmptyStateProps = {
    hasFilters: boolean;
    onClearFilters: () => void;
};

export function WorkspaceMembersEmptyState({
    hasFilters,
    onClearFilters,
}: WorkspaceMembersEmptyStateProps) {
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
                    No hay miembros para mostrar
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: 680 }}>
                    {hasFilters
                        ? "No encontramos miembros con los filtros actuales."
                        : "Aún no hay miembros adicionales registrados en este workspace."}
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
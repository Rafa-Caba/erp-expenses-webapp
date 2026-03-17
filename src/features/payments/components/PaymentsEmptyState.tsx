// src/features/payments/components/PaymentsEmptyState.tsx

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type PaymentsEmptyStateProps = {
    hasFilters: boolean;
    onClearFilters: () => void;
};

export function PaymentsEmptyState({
    hasFilters,
    onClearFilters,
}: PaymentsEmptyStateProps) {
    return (
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
            <Stack spacing={1.5} alignItems="flex-start">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    No hay pagos para mostrar
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: 680 }}>
                    {hasFilters
                        ? "No encontramos pagos con los filtros actuales."
                        : "Aún no hay pagos registrados en este workspace."}
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
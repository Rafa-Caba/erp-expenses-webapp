// src/features/ledger/components/LedgerEmptyState.tsx

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type LedgerEmptyStateProps = {
    hasFilters: boolean;
    onClearFilters: () => void;
};

export function LedgerEmptyState({
    hasFilters,
    onClearFilters,
}: LedgerEmptyStateProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 4,
                borderRadius: 3,
                textAlign: "center",
            }}
        >
            <Stack spacing={1.5} alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    No hay movimientos para mostrar
                </Typography>

                <Typography variant="body2" sx={{ maxWidth: 560, opacity: 0.8 }}>
                    {hasFilters
                        ? "No encontramos renglones que coincidan con los filtros activos del ledger."
                        : "Todavía no hay transacciones suficientes para construir el libro mayor del workspace activo."}
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
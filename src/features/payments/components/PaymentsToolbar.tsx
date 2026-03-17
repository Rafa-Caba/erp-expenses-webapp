// src/features/payments/components/PaymentsToolbar.tsx

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import type { PaymentMethod, PaymentStatus } from "../types/payment.types";

type PaymentsToolbarProps = {
    searchTerm: string;
    statusFilter: PaymentStatus | "ALL";
    methodFilter: PaymentMethod | "ALL";
    includeHidden: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onStatusFilterChange: (value: PaymentStatus | "ALL") => void;
    onMethodFilterChange: (value: PaymentMethod | "ALL") => void;
    onIncludeHiddenChange: (value: boolean) => void;
    onResetFilters: () => void;
};

export function PaymentsToolbar({
    searchTerm,
    statusFilter,
    methodFilter,
    includeHidden,
    totalCount,
    onSearchTermChange,
    onStatusFilterChange,
    onMethodFilterChange,
    onIncludeHiddenChange,
    onResetFilters,
}: PaymentsToolbarProps) {
    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "ALL" ||
            value === "pending" ||
            value === "completed" ||
            value === "failed" ||
            value === "cancelled"
        ) {
            onStatusFilterChange(value);
        }
    };

    const handleMethodChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "ALL" ||
            value === "cash" ||
            value === "bank_transfer" ||
            value === "card" ||
            value === "check" ||
            value === "other"
        ) {
            onMethodFilterChange(value);
        }
    };

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2.5,
                borderRadius: 3,
            }}
        >
            <Stack spacing={2}>
                <Stack
                    direction={{ xs: "column", lg: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", lg: "center" }}
                >
                    <TextField
                        label="Buscar"
                        placeholder="Buscar por referencia, notas, IDs..."
                        value={searchTerm}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                        fullWidth
                    />

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="payments-status-filter-label">Estatus</InputLabel>
                        <Select
                            labelId="payments-status-filter-label"
                            label="Estatus"
                            value={statusFilter}
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="pending">Pendiente</MenuItem>
                            <MenuItem value="completed">Completado</MenuItem>
                            <MenuItem value="failed">Fallido</MenuItem>
                            <MenuItem value="cancelled">Cancelado</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="payments-method-filter-label">Método</InputLabel>
                        <Select
                            labelId="payments-method-filter-label"
                            label="Método"
                            value={methodFilter}
                            onChange={handleMethodChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="cash">Efectivo</MenuItem>
                            <MenuItem value="bank_transfer">Transferencia</MenuItem>
                            <MenuItem value="card">Tarjeta</MenuItem>
                            <MenuItem value="check">Cheque</MenuItem>
                            <MenuItem value="other">Otro</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="outlined" onClick={onResetFilters}>
                        Limpiar
                    </Button>
                </Stack>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", md: "center" }}
                >
                    <FormControlLabel
                        control={
                            <Switch
                                checked={includeHidden}
                                onChange={(event) =>
                                    onIncludeHiddenChange(event.target.checked)
                                }
                            />
                        }
                        label="Mostrar ocultos"
                    />

                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        {totalCount} pago{totalCount === 1 ? "" : "s"}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
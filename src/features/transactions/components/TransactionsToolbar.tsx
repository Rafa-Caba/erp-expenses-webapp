// src/features/transactions/components/TransactionsToolbar.tsx

import Button from "@mui/material/Button";
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

import type { TransactionType } from "../../../shared/types/common.types";
import type { TransactionStatus } from "../types/transaction.types";

type TransactionsToolbarProps = {
    searchTerm: string;
    typeFilter: TransactionType | "ALL";
    statusFilter: TransactionStatus | "ALL";
    includeHidden: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onTypeFilterChange: (value: TransactionType | "ALL") => void;
    onStatusFilterChange: (value: TransactionStatus | "ALL") => void;
    onIncludeHiddenChange: (value: boolean) => void;
    onResetFilters: () => void;
};

export function TransactionsToolbar({
    searchTerm,
    typeFilter,
    statusFilter,
    includeHidden,
    totalCount,
    onSearchTermChange,
    onTypeFilterChange,
    onStatusFilterChange,
    onIncludeHiddenChange,
    onResetFilters,
}: TransactionsToolbarProps) {
    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "ALL" ||
            value === "expense" ||
            value === "income" ||
            value === "debt_payment" ||
            value === "transfer" ||
            value === "adjustment"
        ) {
            onTypeFilterChange(value);
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "ALL" ||
            value === "pending" ||
            value === "posted" ||
            value === "cancelled"
        ) {
            onStatusFilterChange(value);
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
                        placeholder="Buscar por descripción, merchant, referencia..."
                        value={searchTerm}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                        fullWidth
                    />

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="transactions-type-filter-label">Tipo</InputLabel>
                        <Select
                            labelId="transactions-type-filter-label"
                            label="Tipo"
                            value={typeFilter}
                            onChange={handleTypeChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="expense">Gasto</MenuItem>
                            <MenuItem value="income">Ingreso</MenuItem>
                            <MenuItem value="debt_payment">Pago de deuda</MenuItem>
                            <MenuItem value="transfer">Transferencia</MenuItem>
                            <MenuItem value="adjustment">Ajuste</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="transactions-status-filter-label">Estatus</InputLabel>
                        <Select
                            labelId="transactions-status-filter-label"
                            label="Estatus"
                            value={statusFilter}
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="pending">Pendiente</MenuItem>
                            <MenuItem value="posted">Aplicada</MenuItem>
                            <MenuItem value="cancelled">Cancelada</MenuItem>
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
                        label="Mostrar ocultas"
                    />

                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        {totalCount} transacción{totalCount === 1 ? "" : "es"}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
// src/features/debts/components/DebtsToolbar.tsx

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

import type { DebtStatus, DebtType } from "../types/debt.types";

type DebtsToolbarProps = {
    searchTerm: string;
    typeFilter: DebtType | "ALL";
    statusFilter: DebtStatus | "ALL";
    includeHidden: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onTypeFilterChange: (value: DebtType | "ALL") => void;
    onStatusFilterChange: (value: DebtStatus | "ALL") => void;
    onIncludeHiddenChange: (value: boolean) => void;
    onResetFilters: () => void;
};

export function DebtsToolbar({
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
}: DebtsToolbarProps) {
    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL") {
            onTypeFilterChange("ALL");
            return;
        }

        if (value === "owed_by_me" || value === "owed_to_me") {
            onTypeFilterChange(value);
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL") {
            onStatusFilterChange("ALL");
            return;
        }

        if (
            value === "active" ||
            value === "paid" ||
            value === "overdue" ||
            value === "cancelled"
        ) {
            onStatusFilterChange(value);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Stack spacing={2}>
                <Stack
                    direction={{ xs: "column", lg: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", lg: "center" }}
                >
                    <TextField
                        label="Buscar deuda"
                        placeholder="Persona, contacto, descripción, cuenta, miembro..."
                        value={searchTerm}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                        fullWidth
                    />

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="debts-type-filter-label">Tipo</InputLabel>
                        <Select
                            labelId="debts-type-filter-label"
                            label="Tipo"
                            value={typeFilter}
                            onChange={handleTypeChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="owed_by_me">Debo</MenuItem>
                            <MenuItem value="owed_to_me">Me deben</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="debts-status-filter-label">Estado</InputLabel>
                        <Select
                            labelId="debts-status-filter-label"
                            label="Estado"
                            value={statusFilter}
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="active">Activa</MenuItem>
                            <MenuItem value="paid">Pagada</MenuItem>
                            <MenuItem value="overdue">Vencida</MenuItem>
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
                        {totalCount} deuda{totalCount === 1 ? "" : "s"}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
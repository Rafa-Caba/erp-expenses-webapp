// src/features/budgets/components/BudgetsToolbar.tsx

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

import type { BudgetPeriodType, BudgetStatus } from "../types/budget.types";

type BudgetsToolbarProps = {
    searchTerm: string;
    statusFilter: BudgetStatus | "ALL";
    periodTypeFilter: BudgetPeriodType | "ALL";
    includeArchived: boolean;
    includeInactive: boolean;
    includeHidden: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onStatusFilterChange: (value: BudgetStatus | "ALL") => void;
    onPeriodTypeFilterChange: (value: BudgetPeriodType | "ALL") => void;
    onIncludeArchivedChange: (value: boolean) => void;
    onIncludeInactiveChange: (value: boolean) => void;
    onIncludeHiddenChange: (value: boolean) => void;
    onResetFilters: () => void;
};

export function BudgetsToolbar({
    searchTerm,
    statusFilter,
    periodTypeFilter,
    includeArchived,
    includeInactive,
    includeHidden,
    totalCount,
    onSearchTermChange,
    onStatusFilterChange,
    onPeriodTypeFilterChange,
    onIncludeArchivedChange,
    onIncludeInactiveChange,
    onIncludeHiddenChange,
    onResetFilters,
}: BudgetsToolbarProps) {
    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "ALL" ||
            value === "draft" ||
            value === "active" ||
            value === "completed" ||
            value === "exceeded" ||
            value === "archived"
        ) {
            onStatusFilterChange(value);
        }
    };

    const handlePeriodTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "ALL" ||
            value === "weekly" ||
            value === "monthly" ||
            value === "yearly" ||
            value === "custom"
        ) {
            onPeriodTypeFilterChange(value);
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
                        label="Buscar presupuesto"
                        placeholder="Nombre, notas, categoría, miembro, moneda..."
                        value={searchTerm}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                        fullWidth
                    />

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="budgets-status-filter-label">Estado</InputLabel>
                        <Select
                            labelId="budgets-status-filter-label"
                            label="Estado"
                            value={statusFilter}
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="draft">Borrador</MenuItem>
                            <MenuItem value="active">Activo</MenuItem>
                            <MenuItem value="completed">Completado</MenuItem>
                            <MenuItem value="exceeded">Excedido</MenuItem>
                            <MenuItem value="archived">Archivado</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="budgets-period-filter-label">Periodo</InputLabel>
                        <Select
                            labelId="budgets-period-filter-label"
                            label="Periodo"
                            value={periodTypeFilter}
                            onChange={handlePeriodTypeChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="weekly">Semanal</MenuItem>
                            <MenuItem value="monthly">Mensual</MenuItem>
                            <MenuItem value="yearly">Anual</MenuItem>
                            <MenuItem value="custom">Personalizado</MenuItem>
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
                    <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={includeArchived}
                                    onChange={(event) =>
                                        onIncludeArchivedChange(event.target.checked)
                                    }
                                />
                            }
                            label="Mostrar archivados"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={includeInactive}
                                    onChange={(event) =>
                                        onIncludeInactiveChange(event.target.checked)
                                    }
                                />
                            }
                            label="Mostrar inactivos"
                        />

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
                    </Stack>

                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        {totalCount} presupuesto{totalCount === 1 ? "" : "s"}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
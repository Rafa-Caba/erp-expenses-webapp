// src/features/categories/components/CategoriesToolbar.tsx

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

import type { CategoryType } from "../types/category.types";

type CategorySystemFilter = "ALL" | "SYSTEM" | "CUSTOM";

type CategoriesToolbarProps = {
    searchTerm: string;
    typeFilter: CategoryType | "ALL";
    systemFilter: CategorySystemFilter;
    includeInactive: boolean;
    includeHidden: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onTypeFilterChange: (value: CategoryType | "ALL") => void;
    onSystemFilterChange: (value: CategorySystemFilter) => void;
    onIncludeInactiveChange: (value: boolean) => void;
    onIncludeHiddenChange: (value: boolean) => void;
    onResetFilters: () => void;
};

export function CategoriesToolbar({
    searchTerm,
    typeFilter,
    systemFilter,
    includeInactive,
    includeHidden,
    totalCount,
    onSearchTermChange,
    onTypeFilterChange,
    onSystemFilterChange,
    onIncludeInactiveChange,
    onIncludeHiddenChange,
    onResetFilters,
}: CategoriesToolbarProps) {
    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL") {
            onTypeFilterChange("ALL");
            return;
        }

        if (value === "EXPENSE" || value === "INCOME" || value === "BOTH") {
            onTypeFilterChange(value);
        }
    };

    const handleSystemFilterChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL" || value === "SYSTEM" || value === "CUSTOM") {
            onSystemFilterChange(value);
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
                        label="Buscar categoría"
                        placeholder="Nombre, descripción, icono, color..."
                        value={searchTerm}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                        fullWidth
                    />

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="categories-type-filter-label">Tipo</InputLabel>
                        <Select
                            labelId="categories-type-filter-label"
                            label="Tipo"
                            value={typeFilter}
                            onChange={handleTypeChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="EXPENSE">Gasto</MenuItem>
                            <MenuItem value="INCOME">Ingreso</MenuItem>
                            <MenuItem value="BOTH">Ambas</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="categories-system-filter-label">Origen</InputLabel>
                        <Select
                            labelId="categories-system-filter-label"
                            label="Origen"
                            value={systemFilter}
                            onChange={handleSystemFilterChange}
                        >
                            <MenuItem value="ALL">Todas</MenuItem>
                            <MenuItem value="SYSTEM">Solo sistema</MenuItem>
                            <MenuItem value="CUSTOM">Solo personalizadas</MenuItem>
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
                                    checked={includeInactive}
                                    onChange={(event) =>
                                        onIncludeInactiveChange(event.target.checked)
                                    }
                                />
                            }
                            label="Mostrar inactivas"
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
                            label="Mostrar ocultas"
                        />
                    </Stack>

                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        {totalCount} categoría{totalCount === 1 ? "" : "s"}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
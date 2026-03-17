// src/features/savingGoals/components/SavingGoalsToolbar.tsx

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

import type {
    SavingsGoalCategory,
    SavingsGoalStatus,
} from "../types/saving-goal.types";
import { getSavingsGoalCategoryLabel, getSavingsGoalStatusLabel } from "../utils/saving-goal-labels";

type SavingGoalsToolbarProps = {
    searchTerm: string;
    statusFilter: SavingsGoalStatus | "ALL";
    categoryFilter: SavingsGoalCategory | "ALL";
    includeHidden: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onStatusFilterChange: (value: SavingsGoalStatus | "ALL") => void;
    onCategoryFilterChange: (value: SavingsGoalCategory | "ALL") => void;
    onIncludeHiddenChange: (value: boolean) => void;
    onResetFilters: () => void;
};

export function SavingGoalsToolbar({
    searchTerm,
    statusFilter,
    categoryFilter,
    includeHidden,
    totalCount,
    onSearchTermChange,
    onStatusFilterChange,
    onCategoryFilterChange,
    onIncludeHiddenChange,
    onResetFilters,
}: SavingGoalsToolbarProps) {
    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL") {
            onStatusFilterChange("ALL");
            return;
        }

        if (
            value === "active" ||
            value === "completed" ||
            value === "paused" ||
            value === "cancelled"
        ) {
            onStatusFilterChange(value);
        }
    };

    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL") {
            onCategoryFilterChange("ALL");
            return;
        }

        if (
            value === "emergency_fund" ||
            value === "vacation" ||
            value === "education" ||
            value === "home" ||
            value === "car" ||
            value === "business" ||
            value === "retirement" ||
            value === "custom"
        ) {
            onCategoryFilterChange(value);
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
                        label="Buscar meta"
                        placeholder="Nombre, descripción, categoría, estado..."
                        value={searchTerm}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                        fullWidth
                    />

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="saving-goals-status-filter-label">
                            Estado
                        </InputLabel>
                        <Select
                            labelId="saving-goals-status-filter-label"
                            label="Estado"
                            value={statusFilter}
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="active">
                                {getSavingsGoalStatusLabel("active")}
                            </MenuItem>
                            <MenuItem value="completed">
                                {getSavingsGoalStatusLabel("completed")}
                            </MenuItem>
                            <MenuItem value="paused">
                                {getSavingsGoalStatusLabel("paused")}
                            </MenuItem>
                            <MenuItem value="cancelled">
                                {getSavingsGoalStatusLabel("cancelled")}
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 220 }}>
                        <InputLabel id="saving-goals-category-filter-label">
                            Categoría
                        </InputLabel>
                        <Select
                            labelId="saving-goals-category-filter-label"
                            label="Categoría"
                            value={categoryFilter}
                            onChange={handleCategoryChange}
                        >
                            <MenuItem value="ALL">Todas</MenuItem>
                            <MenuItem value="emergency_fund">
                                {getSavingsGoalCategoryLabel("emergency_fund")}
                            </MenuItem>
                            <MenuItem value="vacation">
                                {getSavingsGoalCategoryLabel("vacation")}
                            </MenuItem>
                            <MenuItem value="education">
                                {getSavingsGoalCategoryLabel("education")}
                            </MenuItem>
                            <MenuItem value="home">
                                {getSavingsGoalCategoryLabel("home")}
                            </MenuItem>
                            <MenuItem value="car">
                                {getSavingsGoalCategoryLabel("car")}
                            </MenuItem>
                            <MenuItem value="business">
                                {getSavingsGoalCategoryLabel("business")}
                            </MenuItem>
                            <MenuItem value="retirement">
                                {getSavingsGoalCategoryLabel("retirement")}
                            </MenuItem>
                            <MenuItem value="custom">
                                {getSavingsGoalCategoryLabel("custom")}
                            </MenuItem>
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
                        {totalCount} meta{totalCount === 1 ? "" : "s"}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
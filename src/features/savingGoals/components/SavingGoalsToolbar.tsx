// src/features/savingGoals/components/SavingGoalsToolbar.tsx

import React from "react";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
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
import TuneIcon from "@mui/icons-material/Tune";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import type {
    SavingsGoalCategory,
    SavingsGoalStatus,
} from "../types/saving-goal.types";
import {
    getSavingsGoalCategoryLabel,
    getSavingsGoalStatusLabel,
} from "../utils/saving-goal-labels";

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

type DraftFilters = {
    searchTerm: string;
    statusFilter: SavingsGoalStatus | "ALL";
    categoryFilter: SavingsGoalCategory | "ALL";
    includeHidden: boolean;
};

function countActiveFilters(filters: DraftFilters): number {
    let count = 0;

    if (filters.searchTerm.trim()) count += 1;
    if (filters.statusFilter !== "ALL") count += 1;
    if (filters.categoryFilter !== "ALL") count += 1;
    if (filters.includeHidden) count += 1;

    return count;
}

function buildEmptyFilters(): DraftFilters {
    return {
        searchTerm: "",
        statusFilter: "ALL",
        categoryFilter: "ALL",
        includeHidden: false,
    };
}

function SavingGoalsToolbarFields({
    filters,
    onChange,
}: {
    filters: DraftFilters;
    onChange: (next: DraftFilters) => void;
}) {
    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "ALL" ||
            value === "active" ||
            value === "completed" ||
            value === "paused" ||
            value === "cancelled"
        ) {
            onChange({
                ...filters,
                statusFilter: value,
            });
        }
    };

    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "ALL" ||
            value === "emergency_fund" ||
            value === "vacation" ||
            value === "education" ||
            value === "home" ||
            value === "car" ||
            value === "business" ||
            value === "retirement" ||
            value === "custom"
        ) {
            onChange({
                ...filters,
                categoryFilter: value,
            });
        }
    };

    return (
        <Stack spacing={2}>
            <TextField
                label="Buscar meta"
                placeholder="Nombre, descripción, categoría, estado..."
                value={filters.searchTerm}
                onChange={(event) =>
                    onChange({
                        ...filters,
                        searchTerm: event.target.value,
                    })
                }
                fullWidth
            />

            <FormControl fullWidth>
                <InputLabel id="saving-goals-status-filter-label">Estado</InputLabel>
                <Select
                    labelId="saving-goals-status-filter-label"
                    label="Estado"
                    value={filters.statusFilter}
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

            <FormControl fullWidth>
                <InputLabel id="saving-goals-category-filter-label">
                    Categoría
                </InputLabel>
                <Select
                    labelId="saving-goals-category-filter-label"
                    label="Categoría"
                    value={filters.categoryFilter}
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

            <FormControlLabel
                control={
                    <Switch
                        checked={filters.includeHidden}
                        onChange={(event) =>
                            onChange({
                                ...filters,
                                includeHidden: event.target.checked,
                            })
                        }
                    />
                }
                label="Mostrar ocultas"
            />
        </Stack>
    );
}

export function SavingGoalsToolbar(props: SavingGoalsToolbarProps) {
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down("sm"));

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const currentFilters = React.useMemo<DraftFilters>(
        () => ({
            searchTerm: props.searchTerm,
            statusFilter: props.statusFilter,
            categoryFilter: props.categoryFilter,
            includeHidden: props.includeHidden,
        }),
        [props.searchTerm, props.statusFilter, props.categoryFilter, props.includeHidden]
    );

    const [draftFilters, setDraftFilters] = React.useState<DraftFilters>(currentFilters);

    React.useEffect(() => {
        setDraftFilters(currentFilters);
    }, [currentFilters]);

    const activeFiltersCount = countActiveFilters(currentFilters);

    const applyDraftFilters = React.useCallback(() => {
        props.onSearchTermChange(draftFilters.searchTerm);
        props.onStatusFilterChange(draftFilters.statusFilter);
        props.onCategoryFilterChange(draftFilters.categoryFilter);
        props.onIncludeHiddenChange(draftFilters.includeHidden);
        setDialogOpen(false);
    }, [draftFilters, props]);

    return (
        <>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                <Stack spacing={2}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        justifyContent="space-between"
                        alignItems={{ xs: "stretch", sm: "center" }}
                    >
                        <Stack spacing={0.5}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                Filtros de metas de ahorro
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                {props.totalCount} meta{props.totalCount === 1 ? "" : "s"} visibles con los filtros actuales.
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" onClick={props.onResetFilters}>
                                Limpiar
                            </Button>

                            <Badge
                                color="primary"
                                badgeContent={activeFiltersCount}
                                invisible={activeFiltersCount === 0}
                            >
                                <Button
                                    variant="contained"
                                    startIcon={<TuneIcon />}
                                    onClick={() => setDialogOpen(true)}
                                >
                                    Filtros
                                </Button>
                            </Badge>
                        </Stack>
                    </Stack>

                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        Los filtros se gestionan desde un modal para mantener la vista de metas de ahorro más limpia.
                    </Typography>
                </Stack>
            </Paper>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                fullWidth
                maxWidth="sm"
                fullScreen={fullScreenDialog}
            >
                <DialogTitle>Filtros de metas de ahorro</DialogTitle>

                <DialogContent dividers>
                    <SavingGoalsToolbarFields
                        filters={draftFilters}
                        onChange={setDraftFilters}
                    />
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1,
                    }}
                >
                    <Button onClick={() => setDraftFilters(buildEmptyFilters())}>
                        Limpiar draft
                    </Button>

                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="contained" onClick={applyDraftFilters}>
                            Aplicar
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
}
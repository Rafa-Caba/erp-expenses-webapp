// src/features/budgets/components/BudgetsToolbar.tsx

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

type DraftFilters = {
    searchTerm: string;
    statusFilter: BudgetStatus | "ALL";
    periodTypeFilter: BudgetPeriodType | "ALL";
    includeArchived: boolean;
    includeInactive: boolean;
    includeHidden: boolean;
};

function countActiveFilters(filters: DraftFilters): number {
    let count = 0;

    if (filters.searchTerm.trim()) count += 1;
    if (filters.statusFilter !== "ALL") count += 1;
    if (filters.periodTypeFilter !== "ALL") count += 1;
    if (filters.includeArchived) count += 1;
    if (filters.includeInactive) count += 1;
    if (filters.includeHidden) count += 1;

    return count;
}

function buildEmptyFilters(): DraftFilters {
    return {
        searchTerm: "",
        statusFilter: "ALL",
        periodTypeFilter: "ALL",
        includeArchived: false,
        includeInactive: false,
        includeHidden: false,
    };
}

function BudgetsToolbarFields({
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
            value === "draft" ||
            value === "active" ||
            value === "completed" ||
            value === "exceeded" ||
            value === "archived"
        ) {
            onChange({
                ...filters,
                statusFilter: value,
            });
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
            onChange({
                ...filters,
                periodTypeFilter: value,
            });
        }
    };

    return (
        <Stack spacing={2}>
            <TextField
                label="Buscar presupuesto"
                placeholder="Nombre, notas, categoría, miembro, moneda..."
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
                <InputLabel id="budgets-status-filter-label">Estado</InputLabel>
                <Select
                    labelId="budgets-status-filter-label"
                    label="Estado"
                    value={filters.statusFilter}
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

            <FormControl fullWidth>
                <InputLabel id="budgets-period-filter-label">Periodo</InputLabel>
                <Select
                    labelId="budgets-period-filter-label"
                    label="Periodo"
                    value={filters.periodTypeFilter}
                    onChange={handlePeriodTypeChange}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="weekly">Semanal</MenuItem>
                    <MenuItem value="monthly">Mensual</MenuItem>
                    <MenuItem value="yearly">Anual</MenuItem>
                    <MenuItem value="custom">Personalizado</MenuItem>
                </Select>
            </FormControl>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} useFlexGap flexWrap="wrap">
                <FormControlLabel
                    control={
                        <Switch
                            checked={filters.includeArchived}
                            onChange={(event) =>
                                onChange({
                                    ...filters,
                                    includeArchived: event.target.checked,
                                })
                            }
                        />
                    }
                    label="Mostrar archivados"
                />

                <FormControlLabel
                    control={
                        <Switch
                            checked={filters.includeInactive}
                            onChange={(event) =>
                                onChange({
                                    ...filters,
                                    includeInactive: event.target.checked,
                                })
                            }
                        />
                    }
                    label="Mostrar inactivos"
                />

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
                    label="Mostrar ocultos"
                />
            </Stack>
        </Stack>
    );
}

export function BudgetsToolbar(props: BudgetsToolbarProps) {
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down("sm"));

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const currentFilters = React.useMemo<DraftFilters>(
        () => ({
            searchTerm: props.searchTerm,
            statusFilter: props.statusFilter,
            periodTypeFilter: props.periodTypeFilter,
            includeArchived: props.includeArchived,
            includeInactive: props.includeInactive,
            includeHidden: props.includeHidden,
        }),
        [
            props.searchTerm,
            props.statusFilter,
            props.periodTypeFilter,
            props.includeArchived,
            props.includeInactive,
            props.includeHidden,
        ]
    );

    const [draftFilters, setDraftFilters] = React.useState<DraftFilters>(currentFilters);

    React.useEffect(() => {
        setDraftFilters(currentFilters);
    }, [currentFilters]);

    const activeFiltersCount = countActiveFilters(currentFilters);

    const applyDraftFilters = React.useCallback(() => {
        props.onSearchTermChange(draftFilters.searchTerm);
        props.onStatusFilterChange(draftFilters.statusFilter);
        props.onPeriodTypeFilterChange(draftFilters.periodTypeFilter);
        props.onIncludeArchivedChange(draftFilters.includeArchived);
        props.onIncludeInactiveChange(draftFilters.includeInactive);
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
                                Filtros de presupuestos
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                {props.totalCount} presupuesto{props.totalCount === 1 ? "" : "s"} visibles con los filtros actuales.
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
                        Los filtros se gestionan desde un modal para mantener la vista de presupuestos más limpia.
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
                <DialogTitle>Filtros de presupuestos</DialogTitle>

                <DialogContent dividers>
                    <BudgetsToolbarFields filters={draftFilters} onChange={setDraftFilters} />
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
// src/features/debts/components/DebtsToolbar.tsx

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

type DraftFilters = {
    searchTerm: string;
    typeFilter: DebtType | "ALL";
    statusFilter: DebtStatus | "ALL";
    includeHidden: boolean;
};

function countActiveFilters(filters: DraftFilters): number {
    let count = 0;

    if (filters.searchTerm.trim()) count += 1;
    if (filters.typeFilter !== "ALL") count += 1;
    if (filters.statusFilter !== "ALL") count += 1;
    if (filters.includeHidden) count += 1;

    return count;
}

function buildEmptyFilters(): DraftFilters {
    return {
        searchTerm: "",
        typeFilter: "ALL",
        statusFilter: "ALL",
        includeHidden: false,
    };
}

function DebtsToolbarFields({
    filters,
    onChange,
}: {
    filters: DraftFilters;
    onChange: (next: DraftFilters) => void;
}) {
    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL" || value === "owed_by_me" || value === "owed_to_me") {
            onChange({
                ...filters,
                typeFilter: value,
            });
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "ALL" ||
            value === "active" ||
            value === "paid" ||
            value === "overdue" ||
            value === "cancelled"
        ) {
            onChange({
                ...filters,
                statusFilter: value,
            });
        }
    };

    return (
        <Stack spacing={2}>
            <TextField
                label="Buscar deuda"
                placeholder="Persona, contacto, descripción, cuenta, miembro..."
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
                <InputLabel id="debts-type-filter-label">Tipo</InputLabel>
                <Select
                    labelId="debts-type-filter-label"
                    label="Tipo"
                    value={filters.typeFilter}
                    onChange={handleTypeChange}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="owed_by_me">Debo</MenuItem>
                    <MenuItem value="owed_to_me">Me deben</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id="debts-status-filter-label">Estado</InputLabel>
                <Select
                    labelId="debts-status-filter-label"
                    label="Estado"
                    value={filters.statusFilter}
                    onChange={handleStatusChange}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="active">Activa</MenuItem>
                    <MenuItem value="paid">Pagada</MenuItem>
                    <MenuItem value="overdue">Vencida</MenuItem>
                    <MenuItem value="cancelled">Cancelada</MenuItem>
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

export function DebtsToolbar(props: DebtsToolbarProps) {
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down("sm"));

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const currentFilters = React.useMemo<DraftFilters>(
        () => ({
            searchTerm: props.searchTerm,
            typeFilter: props.typeFilter,
            statusFilter: props.statusFilter,
            includeHidden: props.includeHidden,
        }),
        [props.searchTerm, props.typeFilter, props.statusFilter, props.includeHidden]
    );

    const [draftFilters, setDraftFilters] = React.useState<DraftFilters>(currentFilters);

    React.useEffect(() => {
        setDraftFilters(currentFilters);
    }, [currentFilters]);

    const activeFiltersCount = countActiveFilters(currentFilters);

    const applyDraftFilters = React.useCallback(() => {
        props.onSearchTermChange(draftFilters.searchTerm);
        props.onTypeFilterChange(draftFilters.typeFilter);
        props.onStatusFilterChange(draftFilters.statusFilter);
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
                                Filtros de deudas
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                {props.totalCount} deuda{props.totalCount === 1 ? "" : "s"} visibles con los filtros actuales.
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
                        Los filtros se gestionan desde un modal para mantener la vista de deudas más limpia.
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
                <DialogTitle>Filtros de deudas</DialogTitle>

                <DialogContent dividers>
                    <DebtsToolbarFields filters={draftFilters} onChange={setDraftFilters} />
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
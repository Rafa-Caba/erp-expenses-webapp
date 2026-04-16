// src/features/categories/components/CategoriesToolbar.tsx

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

type DraftFilters = {
    searchTerm: string;
    typeFilter: CategoryType | "ALL";
    systemFilter: CategorySystemFilter;
    includeInactive: boolean;
    includeHidden: boolean;
};

function countActiveFilters(filters: DraftFilters): number {
    let count = 0;

    if (filters.searchTerm.trim()) count += 1;
    if (filters.typeFilter !== "ALL") count += 1;
    if (filters.systemFilter !== "ALL") count += 1;
    if (filters.includeInactive) count += 1;
    if (filters.includeHidden) count += 1;

    return count;
}

function buildEmptyFilters(): DraftFilters {
    return {
        searchTerm: "",
        typeFilter: "ALL",
        systemFilter: "ALL",
        includeInactive: false,
        includeHidden: false,
    };
}

function CategoriesToolbarFields({
    filters,
    onChange,
}: {
    filters: DraftFilters;
    onChange: (next: DraftFilters) => void;
}) {
    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL" || value === "EXPENSE" || value === "INCOME" || value === "BOTH") {
            onChange({
                ...filters,
                typeFilter: value,
            });
        }
    };

    const handleSystemFilterChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL" || value === "SYSTEM" || value === "CUSTOM") {
            onChange({
                ...filters,
                systemFilter: value,
            });
        }
    };

    return (
        <Stack spacing={2}>
            <TextField
                label="Buscar categoría"
                placeholder="Nombre, descripción, icono, color..."
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
                <InputLabel id="categories-type-filter-label">Tipo</InputLabel>
                <Select
                    labelId="categories-type-filter-label"
                    label="Tipo"
                    value={filters.typeFilter}
                    onChange={handleTypeChange}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="EXPENSE">Gasto</MenuItem>
                    <MenuItem value="INCOME">Ingreso</MenuItem>
                    <MenuItem value="BOTH">Ambas</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id="categories-system-filter-label">Origen</InputLabel>
                <Select
                    labelId="categories-system-filter-label"
                    label="Origen"
                    value={filters.systemFilter}
                    onChange={handleSystemFilterChange}
                >
                    <MenuItem value="ALL">Todas</MenuItem>
                    <MenuItem value="SYSTEM">Solo sistema</MenuItem>
                    <MenuItem value="CUSTOM">Solo personalizadas</MenuItem>
                </Select>
            </FormControl>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} useFlexGap flexWrap="wrap">
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
                    label="Mostrar inactivas"
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
                    label="Mostrar ocultas"
                />
            </Stack>
        </Stack>
    );
}

export function CategoriesToolbar(props: CategoriesToolbarProps) {
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down("sm"));

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const currentFilters = React.useMemo<DraftFilters>(
        () => ({
            searchTerm: props.searchTerm,
            typeFilter: props.typeFilter,
            systemFilter: props.systemFilter,
            includeInactive: props.includeInactive,
            includeHidden: props.includeHidden,
        }),
        [
            props.searchTerm,
            props.typeFilter,
            props.systemFilter,
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
        props.onTypeFilterChange(draftFilters.typeFilter);
        props.onSystemFilterChange(draftFilters.systemFilter);
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
                                Filtros de categorías
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                {props.totalCount} categoría{props.totalCount === 1 ? "" : "s"} visibles con los filtros actuales.
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
                        Los filtros se gestionan desde un modal para mantener la vista de categorías más limpia.
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
                <DialogTitle>Filtros de categorías</DialogTitle>

                <DialogContent dividers>
                    <CategoriesToolbarFields filters={draftFilters} onChange={setDraftFilters} />
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
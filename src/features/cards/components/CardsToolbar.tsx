// src/features/cards/components/CardsToolbar.tsx

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

import type { CardType } from "../types/card.types";

type CardsToolbarProps = {
    searchTerm: string;
    typeFilter: CardType | "ALL";
    includeArchived: boolean;
    includeInactive: boolean;
    includeHidden: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onTypeFilterChange: (value: CardType | "ALL") => void;
    onIncludeArchivedChange: (value: boolean) => void;
    onIncludeInactiveChange: (value: boolean) => void;
    onIncludeHiddenChange: (value: boolean) => void;
    onResetFilters: () => void;
};

type DraftFilters = {
    searchTerm: string;
    typeFilter: CardType | "ALL";
    includeArchived: boolean;
    includeInactive: boolean;
    includeHidden: boolean;
};

function countActiveFilters(filters: DraftFilters): number {
    let count = 0;

    if (filters.searchTerm.trim()) count += 1;
    if (filters.typeFilter !== "ALL") count += 1;
    if (filters.includeArchived) count += 1;
    if (filters.includeInactive) count += 1;
    if (filters.includeHidden) count += 1;

    return count;
}

function buildEmptyFilters(): DraftFilters {
    return {
        searchTerm: "",
        typeFilter: "ALL",
        includeArchived: false,
        includeInactive: false,
        includeHidden: false,
    };
}

function CardsToolbarFields({
    filters,
    onChange,
}: {
    filters: DraftFilters;
    onChange: (next: DraftFilters) => void;
}) {
    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL" || value === "debit" || value === "credit") {
            onChange({
                ...filters,
                typeFilter: value,
            });
        }
    };

    return (
        <Stack spacing={2}>
            <TextField
                label="Buscar tarjeta"
                placeholder="Nombre, marca, últimos 4, notas, cuenta..."
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
                <InputLabel id="cards-type-filter-label">Tipo</InputLabel>
                <Select
                    labelId="cards-type-filter-label"
                    label="Tipo"
                    value={filters.typeFilter}
                    onChange={handleTypeChange}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="debit">Débito</MenuItem>
                    <MenuItem value="credit">Crédito</MenuItem>
                </Select>
            </FormControl>

            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                useFlexGap
                flexWrap="wrap"
            >
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
                    label="Mostrar archivadas"
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

export function CardsToolbar(props: CardsToolbarProps) {
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down("sm"));

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const currentFilters = React.useMemo<DraftFilters>(
        () => ({
            searchTerm: props.searchTerm,
            typeFilter: props.typeFilter,
            includeArchived: props.includeArchived,
            includeInactive: props.includeInactive,
            includeHidden: props.includeHidden,
        }),
        [
            props.searchTerm,
            props.typeFilter,
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
        props.onTypeFilterChange(draftFilters.typeFilter);
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
                                Filtros de tarjetas
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                {props.totalCount} tarjeta{props.totalCount === 1 ? "" : "s"} visibles con los filtros actuales.
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
                        Los filtros se gestionan desde un modal para mantener la vista de tarjetas más limpia.
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
                <DialogTitle>Filtros de tarjetas</DialogTitle>

                <DialogContent dividers>
                    <CardsToolbarFields filters={draftFilters} onChange={setDraftFilters} />
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
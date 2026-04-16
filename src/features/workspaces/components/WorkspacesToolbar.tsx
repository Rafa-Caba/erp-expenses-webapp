// src/features/workspaces/components/WorkspacesToolbar.tsx

import React from "react";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import TuneIcon from "@mui/icons-material/Tune";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

type WorkspacesToolbarProps = {
    searchTerm: string;
    includeArchived: boolean;
    includeInactive: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onIncludeArchivedChange: (value: boolean) => void;
    onIncludeInactiveChange: (value: boolean) => void;
    onResetFilters: () => void;
};

type DraftFilters = {
    searchTerm: string;
    includeArchived: boolean;
    includeInactive: boolean;
};

function countActiveFilters(filters: DraftFilters): number {
    let count = 0;

    if (filters.searchTerm.trim()) count += 1;
    if (filters.includeArchived) count += 1;
    if (filters.includeInactive) count += 1;

    return count;
}

function buildEmptyFilters(): DraftFilters {
    return {
        searchTerm: "",
        includeArchived: false,
        includeInactive: false,
    };
}

function WorkspacesToolbarFields({
    filters,
    onChange,
}: {
    filters: DraftFilters;
    onChange: (next: DraftFilters) => void;
}) {
    return (
        <Stack spacing={2}>
            <TextField
                label="Buscar workspace"
                placeholder="Ej: Casa, Negocio, Familiar..."
                value={filters.searchTerm}
                onChange={(event) =>
                    onChange({
                        ...filters,
                        searchTerm: event.target.value,
                    })
                }
                fullWidth
            />

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
            </Stack>
        </Stack>
    );
}

export function WorkspacesToolbar(props: WorkspacesToolbarProps) {
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down("sm"));

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const currentFilters = React.useMemo<DraftFilters>(
        () => ({
            searchTerm: props.searchTerm,
            includeArchived: props.includeArchived,
            includeInactive: props.includeInactive,
        }),
        [props.searchTerm, props.includeArchived, props.includeInactive]
    );

    const [draftFilters, setDraftFilters] = React.useState<DraftFilters>(currentFilters);

    React.useEffect(() => {
        setDraftFilters(currentFilters);
    }, [currentFilters]);

    const activeFiltersCount = countActiveFilters(currentFilters);

    const applyDraftFilters = React.useCallback(() => {
        props.onSearchTermChange(draftFilters.searchTerm);
        props.onIncludeArchivedChange(draftFilters.includeArchived);
        props.onIncludeInactiveChange(draftFilters.includeInactive);
        setDialogOpen(false);
    }, [draftFilters, props]);

    return (
        <>
            <Paper
                variant="outlined"
                sx={{
                    p: 2.5,
                    borderRadius: 3,
                }}
            >
                <Stack spacing={2}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        justifyContent="space-between"
                        alignItems={{ xs: "stretch", sm: "center" }}
                    >
                        <Stack spacing={0.5}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                Filtros de workspaces
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                {props.totalCount} workspace{props.totalCount === 1 ? "" : "s"} visibles con los filtros actuales.
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
                        Los filtros se gestionan desde un modal para mantener la vista de workspaces más limpia.
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
                <DialogTitle>Filtros de workspaces</DialogTitle>

                <DialogContent dividers>
                    <WorkspacesToolbarFields filters={draftFilters} onChange={setDraftFilters} />
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
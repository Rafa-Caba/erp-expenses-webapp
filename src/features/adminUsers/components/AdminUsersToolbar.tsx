// src/features/adminUsers/components/AdminUsersToolbar.tsx

import React from "react";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import TuneIcon from "@mui/icons-material/Tune";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import type { UserRole } from "../../../shared/types/common.types";
import type { AdminUsersActiveFilter } from "../store/adminUsers.store";

type AdminUsersToolbarProps = {
    searchTerm: string;
    roleFilter: UserRole | "ALL";
    activeFilter: AdminUsersActiveFilter;
    limit: number;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onRoleFilterChange: (value: UserRole | "ALL") => void;
    onActiveFilterChange: (value: AdminUsersActiveFilter) => void;
    onLimitChange: (value: number) => void;
    onResetFilters: () => void;
};

type DraftFilters = {
    searchTerm: string;
    roleFilter: UserRole | "ALL";
    activeFilter: AdminUsersActiveFilter;
    limit: number;
};

function countActiveFilters(filters: DraftFilters): number {
    let count = 0;

    if (filters.searchTerm.trim()) count += 1;
    if (filters.roleFilter !== "ALL") count += 1;
    if (filters.activeFilter !== "ALL") count += 1;
    if (filters.limit !== 25) count += 1;

    return count;
}

function buildEmptyFilters(): DraftFilters {
    return {
        searchTerm: "",
        roleFilter: "ALL",
        activeFilter: "ALL",
        limit: 25,
    };
}

function AdminUsersToolbarFields({
    filters,
    onChange,
}: {
    filters: DraftFilters;
    onChange: (next: DraftFilters) => void;
}) {
    const handleRoleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL" || value === "USER" || value === "ADMIN") {
            onChange({
                ...filters,
                roleFilter: value,
            });
        }
    };

    const handleActiveChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL" || value === "ACTIVE" || value === "INACTIVE") {
            onChange({
                ...filters,
                activeFilter: value,
            });
        }
    };

    const handleLimitChange = (event: SelectChangeEvent<string>) => {
        const nextValue = Number(event.target.value);

        if ([10, 25, 50, 100].includes(nextValue)) {
            onChange({
                ...filters,
                limit: nextValue,
            });
        }
    };

    return (
        <Stack spacing={2}>
            <TextField
                label="Buscar usuario"
                placeholder="Nombre, email o teléfono..."
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
                <InputLabel id="admin-users-role-filter-label">Rol</InputLabel>
                <Select
                    labelId="admin-users-role-filter-label"
                    label="Rol"
                    value={filters.roleFilter}
                    onChange={handleRoleChange}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="USER">Usuario</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id="admin-users-active-filter-label">Estado</InputLabel>
                <Select
                    labelId="admin-users-active-filter-label"
                    label="Estado"
                    value={filters.activeFilter}
                    onChange={handleActiveChange}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="ACTIVE">Activos</MenuItem>
                    <MenuItem value="INACTIVE">Inactivos</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id="admin-users-limit-label">Límite</InputLabel>
                <Select
                    labelId="admin-users-limit-label"
                    label="Límite"
                    value={String(filters.limit)}
                    onChange={handleLimitChange}
                >
                    <MenuItem value="10">10</MenuItem>
                    <MenuItem value="25">25</MenuItem>
                    <MenuItem value="50">50</MenuItem>
                    <MenuItem value="100">100</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    );
}

export function AdminUsersToolbar(props: AdminUsersToolbarProps) {
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down("sm"));

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const currentFilters = React.useMemo<DraftFilters>(
        () => ({
            searchTerm: props.searchTerm,
            roleFilter: props.roleFilter,
            activeFilter: props.activeFilter,
            limit: props.limit,
        }),
        [props.searchTerm, props.roleFilter, props.activeFilter, props.limit]
    );

    const [draftFilters, setDraftFilters] = React.useState<DraftFilters>(currentFilters);

    React.useEffect(() => {
        setDraftFilters(currentFilters);
    }, [currentFilters]);

    const activeFiltersCount = countActiveFilters(currentFilters);

    const applyDraftFilters = React.useCallback(() => {
        props.onSearchTermChange(draftFilters.searchTerm);
        props.onRoleFilterChange(draftFilters.roleFilter);
        props.onActiveFilterChange(draftFilters.activeFilter);
        props.onLimitChange(draftFilters.limit);
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
                                Filtros de usuarios
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                {props.totalCount} usuario{props.totalCount === 1 ? "" : "s"} visibles con los filtros actuales.
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
                        Los filtros se gestionan desde un modal para mantener la vista de usuarios más limpia.
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
                <DialogTitle>Filtros de usuarios</DialogTitle>

                <DialogContent dividers>
                    <AdminUsersToolbarFields filters={draftFilters} onChange={setDraftFilters} />
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
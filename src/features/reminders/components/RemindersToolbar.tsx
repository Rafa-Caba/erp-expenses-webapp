// src/features/reminders/components/RemindersToolbar.tsx

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
    ReminderChannel,
    ReminderStatus,
    ReminderType,
} from "../types/reminder.types";
import {
    getReminderChannelLabel,
    getReminderStatusLabel,
    getReminderTypeLabel,
} from "../utils/reminder-labels";

type RemindersToolbarProps = {
    searchTerm: string;
    statusFilter: ReminderStatus | "ALL";
    typeFilter: ReminderType | "ALL";
    channelFilter: ReminderChannel | "ALL";
    includeHidden: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onStatusFilterChange: (value: ReminderStatus | "ALL") => void;
    onTypeFilterChange: (value: ReminderType | "ALL") => void;
    onChannelFilterChange: (value: ReminderChannel | "ALL") => void;
    onIncludeHiddenChange: (value: boolean) => void;
    onResetFilters: () => void;
};

type DraftFilters = {
    searchTerm: string;
    statusFilter: ReminderStatus | "ALL";
    typeFilter: ReminderType | "ALL";
    channelFilter: ReminderChannel | "ALL";
    includeHidden: boolean;
};

function countActiveFilters(filters: DraftFilters): number {
    let count = 0;

    if (filters.searchTerm.trim()) count += 1;
    if (filters.statusFilter !== "ALL") count += 1;
    if (filters.typeFilter !== "ALL") count += 1;
    if (filters.channelFilter !== "ALL") count += 1;
    if (filters.includeHidden) count += 1;

    return count;
}

function buildEmptyFilters(): DraftFilters {
    return {
        searchTerm: "",
        statusFilter: "ALL",
        typeFilter: "ALL",
        channelFilter: "ALL",
        includeHidden: false,
    };
}

function RemindersToolbarFields({
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
            value === "pending" ||
            value === "in_progress" ||
            value === "resolved"
        ) {
            onChange({
                ...filters,
                statusFilter: value,
            });
        }
    };

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "ALL" ||
            value === "bill" ||
            value === "debt" ||
            value === "subscription" ||
            value === "custom"
        ) {
            onChange({
                ...filters,
                typeFilter: value,
            });
        }
    };

    const handleChannelChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL" || value === "in_app" || value === "email" || value === "both") {
            onChange({
                ...filters,
                channelFilter: value,
            });
        }
    };

    return (
        <Stack spacing={2}>
            <TextField
                label="Buscar reminder"
                placeholder="Título, descripción, tipo, canal, fecha..."
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
                <InputLabel id="reminders-status-filter-label">Estado</InputLabel>
                <Select
                    labelId="reminders-status-filter-label"
                    label="Estado"
                    value={filters.statusFilter}
                    onChange={handleStatusChange}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="pending">
                        {getReminderStatusLabel("pending")}
                    </MenuItem>
                    <MenuItem value="in_progress">
                        {getReminderStatusLabel("in_progress")}
                    </MenuItem>
                    <MenuItem value="resolved">
                        {getReminderStatusLabel("resolved")}
                    </MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id="reminders-type-filter-label">Tipo</InputLabel>
                <Select
                    labelId="reminders-type-filter-label"
                    label="Tipo"
                    value={filters.typeFilter}
                    onChange={handleTypeChange}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="bill">{getReminderTypeLabel("bill")}</MenuItem>
                    <MenuItem value="debt">{getReminderTypeLabel("debt")}</MenuItem>
                    <MenuItem value="subscription">
                        {getReminderTypeLabel("subscription")}
                    </MenuItem>
                    <MenuItem value="custom">
                        {getReminderTypeLabel("custom")}
                    </MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id="reminders-channel-filter-label">Canal</InputLabel>
                <Select
                    labelId="reminders-channel-filter-label"
                    label="Canal"
                    value={filters.channelFilter}
                    onChange={handleChannelChange}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="in_app">
                        {getReminderChannelLabel("in_app")}
                    </MenuItem>
                    <MenuItem value="email">
                        {getReminderChannelLabel("email")}
                    </MenuItem>
                    <MenuItem value="both">
                        {getReminderChannelLabel("both")}
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
                label="Mostrar ocultos"
            />
        </Stack>
    );
}

export function RemindersToolbar(props: RemindersToolbarProps) {
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down("sm"));

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const currentFilters = React.useMemo<DraftFilters>(
        () => ({
            searchTerm: props.searchTerm,
            statusFilter: props.statusFilter,
            typeFilter: props.typeFilter,
            channelFilter: props.channelFilter,
            includeHidden: props.includeHidden,
        }),
        [
            props.searchTerm,
            props.statusFilter,
            props.typeFilter,
            props.channelFilter,
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
        props.onTypeFilterChange(draftFilters.typeFilter);
        props.onChannelFilterChange(draftFilters.channelFilter);
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
                                Filtros de reminders
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                {props.totalCount} reminder{props.totalCount === 1 ? "" : "s"} visibles con los filtros actuales.
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
                        Los filtros se gestionan desde un modal para mantener la vista de reminders más limpia.
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
                <DialogTitle>Filtros de reminders</DialogTitle>

                <DialogContent dividers>
                    <RemindersToolbarFields filters={draftFilters} onChange={setDraftFilters} />
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
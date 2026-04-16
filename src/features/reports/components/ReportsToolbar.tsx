// src/features/reports/components/ReportsToolbar.tsx

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

import type { ReportStatus, ReportType } from "../types/report.types";
import { getReportStatusLabel, getReportTypeLabel } from "../utils/report-labels";

type ReportsToolbarProps = {
    searchTerm: string;
    typeFilter: ReportType | "ALL";
    statusFilter: ReportStatus | "ALL";
    includeHidden: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onTypeFilterChange: (value: ReportType | "ALL") => void;
    onStatusFilterChange: (value: ReportStatus | "ALL") => void;
    onIncludeHiddenChange: (value: boolean) => void;
    onResetFilters: () => void;
};

type DraftFilters = {
    searchTerm: string;
    typeFilter: ReportType | "ALL";
    statusFilter: ReportStatus | "ALL";
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

function ReportsToolbarFields({
    filters,
    onChange,
}: {
    filters: DraftFilters;
    onChange: (next: DraftFilters) => void;
}) {
    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "ALL" ||
            value === "monthly_summary" ||
            value === "category_breakdown" ||
            value === "debt_report" ||
            value === "budget_report" ||
            value === "custom"
        ) {
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
            value === "pending" ||
            value === "generated" ||
            value === "failed" ||
            value === "archived"
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
                label="Buscar reporte"
                placeholder="Nombre, notas, tipo, estatus..."
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
                <InputLabel id="reports-type-filter-label">Tipo</InputLabel>
                <Select
                    labelId="reports-type-filter-label"
                    label="Tipo"
                    value={filters.typeFilter}
                    onChange={handleTypeChange}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="monthly_summary">
                        {getReportTypeLabel("monthly_summary")}
                    </MenuItem>
                    <MenuItem value="category_breakdown">
                        {getReportTypeLabel("category_breakdown")}
                    </MenuItem>
                    <MenuItem value="debt_report">
                        {getReportTypeLabel("debt_report")}
                    </MenuItem>
                    <MenuItem value="budget_report">
                        {getReportTypeLabel("budget_report")}
                    </MenuItem>
                    <MenuItem value="custom">
                        {getReportTypeLabel("custom")}
                    </MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id="reports-status-filter-label">Estatus</InputLabel>
                <Select
                    labelId="reports-status-filter-label"
                    label="Estatus"
                    value={filters.statusFilter}
                    onChange={handleStatusChange}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="pending">
                        {getReportStatusLabel("pending")}
                    </MenuItem>
                    <MenuItem value="generated">
                        {getReportStatusLabel("generated")}
                    </MenuItem>
                    <MenuItem value="failed">
                        {getReportStatusLabel("failed")}
                    </MenuItem>
                    <MenuItem value="archived">
                        {getReportStatusLabel("archived")}
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

export function ReportsToolbar(props: ReportsToolbarProps) {
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
                                Filtros de reportes
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                {props.totalCount} reporte{props.totalCount === 1 ? "" : "s"} visibles con los filtros actuales.
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
                        Los filtros se gestionan desde un modal para mantener la vista de reportes más limpia.
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
                <DialogTitle>Filtros de reportes</DialogTitle>

                <DialogContent dividers>
                    <ReportsToolbarFields filters={draftFilters} onChange={setDraftFilters} />
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
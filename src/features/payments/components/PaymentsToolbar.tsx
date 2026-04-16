// src/features/payments/components/PaymentsToolbar.tsx

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

import type { PaymentMethod, PaymentStatus } from "../types/payment.types";

type PaymentsToolbarProps = {
    searchTerm: string;
    statusFilter: PaymentStatus | "ALL";
    methodFilter: PaymentMethod | "ALL";
    includeHidden: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onStatusFilterChange: (value: PaymentStatus | "ALL") => void;
    onMethodFilterChange: (value: PaymentMethod | "ALL") => void;
    onIncludeHiddenChange: (value: boolean) => void;
    onResetFilters: () => void;
};

type DraftFilters = {
    searchTerm: string;
    statusFilter: PaymentStatus | "ALL";
    methodFilter: PaymentMethod | "ALL";
    includeHidden: boolean;
};

function countActiveFilters(filters: DraftFilters): number {
    let count = 0;

    if (filters.searchTerm.trim()) count += 1;
    if (filters.statusFilter !== "ALL") count += 1;
    if (filters.methodFilter !== "ALL") count += 1;
    if (filters.includeHidden) count += 1;

    return count;
}

function buildEmptyFilters(): DraftFilters {
    return {
        searchTerm: "",
        statusFilter: "ALL",
        methodFilter: "ALL",
        includeHidden: false,
    };
}

function PaymentsToolbarFields({
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
            value === "completed" ||
            value === "failed" ||
            value === "cancelled"
        ) {
            onChange({
                ...filters,
                statusFilter: value,
            });
        }
    };

    const handleMethodChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "ALL" ||
            value === "cash" ||
            value === "bank_transfer" ||
            value === "card" ||
            value === "check" ||
            value === "other"
        ) {
            onChange({
                ...filters,
                methodFilter: value,
            });
        }
    };

    return (
        <Stack spacing={2}>
            <TextField
                label="Buscar"
                placeholder="Buscar por referencia, notas, IDs..."
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
                <InputLabel id="payments-status-filter-label">Estatus</InputLabel>
                <Select
                    labelId="payments-status-filter-label"
                    label="Estatus"
                    value={filters.statusFilter}
                    onChange={handleStatusChange}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="pending">Pendiente</MenuItem>
                    <MenuItem value="completed">Completado</MenuItem>
                    <MenuItem value="failed">Fallido</MenuItem>
                    <MenuItem value="cancelled">Cancelado</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id="payments-method-filter-label">Método</InputLabel>
                <Select
                    labelId="payments-method-filter-label"
                    label="Método"
                    value={filters.methodFilter}
                    onChange={handleMethodChange}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="cash">Efectivo</MenuItem>
                    <MenuItem value="bank_transfer">Transferencia</MenuItem>
                    <MenuItem value="card">Tarjeta</MenuItem>
                    <MenuItem value="check">Cheque</MenuItem>
                    <MenuItem value="other">Otro</MenuItem>
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

export function PaymentsToolbar(props: PaymentsToolbarProps) {
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down("sm"));

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const currentFilters = React.useMemo<DraftFilters>(
        () => ({
            searchTerm: props.searchTerm,
            statusFilter: props.statusFilter,
            methodFilter: props.methodFilter,
            includeHidden: props.includeHidden,
        }),
        [props.searchTerm, props.statusFilter, props.methodFilter, props.includeHidden]
    );

    const [draftFilters, setDraftFilters] = React.useState<DraftFilters>(currentFilters);

    React.useEffect(() => {
        setDraftFilters(currentFilters);
    }, [currentFilters]);

    const activeFiltersCount = countActiveFilters(currentFilters);

    const applyDraftFilters = React.useCallback(() => {
        props.onSearchTermChange(draftFilters.searchTerm);
        props.onStatusFilterChange(draftFilters.statusFilter);
        props.onMethodFilterChange(draftFilters.methodFilter);
        props.onIncludeHiddenChange(draftFilters.includeHidden);
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
                                Filtros de pagos
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                {props.totalCount} pago{props.totalCount === 1 ? "" : "s"} visibles con los filtros actuales.
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
                        Los filtros se gestionan desde un modal para mantener la vista de pagos más limpia.
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
                <DialogTitle>Filtros de pagos</DialogTitle>

                <DialogContent dividers>
                    <PaymentsToolbarFields filters={draftFilters} onChange={setDraftFilters} />
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
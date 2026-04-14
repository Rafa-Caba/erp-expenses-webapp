// src/features/ledger/components/LedgerFilters.tsx

import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TuneIcon from "@mui/icons-material/Tune";

import { WorkspaceAccountSelect } from "../../components/WorkspaceAccountSelect";
import { WorkspaceCategorySelect } from "../../components/WorkspaceCategorySelect";
import { WorkspaceMemberSelect } from "../../components/WorkspaceMemberSelect";
import type { CurrencyCode, TransactionType } from "../../../shared/types/common.types";
import type { TransactionStatus } from "../../transactions/types/transaction.types";
import type { LedgerDirectionFilter, LedgerSortOrder } from "../types/ledger.types";

type LedgerFiltersProps = {
    workspaceId: string | null;
    searchTerm: string;
    accountId: string;
    memberId: string;
    categoryId: string;
    currency: CurrencyCode | "ALL";
    typeFilter: TransactionType | "ALL";
    statusFilter: TransactionStatus | "ALL";
    directionFilter: LedgerDirectionFilter;
    sortOrder: LedgerSortOrder;
    includeHidden: boolean;
    includeArchived: boolean;
    includeInactive: boolean;
    onlyRecurring: boolean;
    dateFrom: string;
    dateTo: string;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onAccountIdChange: (value: string) => void;
    onMemberIdChange: (value: string) => void;
    onCategoryIdChange: (value: string) => void;
    onCurrencyChange: (value: CurrencyCode | "ALL") => void;
    onTypeFilterChange: (value: TransactionType | "ALL") => void;
    onStatusFilterChange: (value: TransactionStatus | "ALL") => void;
    onDirectionFilterChange: (value: LedgerDirectionFilter) => void;
    onSortOrderChange: (value: LedgerSortOrder) => void;
    onIncludeHiddenChange: (value: boolean) => void;
    onIncludeArchivedChange: (value: boolean) => void;
    onIncludeInactiveChange: (value: boolean) => void;
    onOnlyRecurringChange: (value: boolean) => void;
    onDateFromChange: (value: string) => void;
    onDateToChange: (value: string) => void;
    onResetFilters: () => void;
};

type DraftFilters = {
    searchTerm: string;
    accountId: string;
    memberId: string;
    categoryId: string;
    currency: CurrencyCode | "ALL";
    typeFilter: TransactionType | "ALL";
    statusFilter: TransactionStatus | "ALL";
    directionFilter: LedgerDirectionFilter;
    sortOrder: LedgerSortOrder;
    includeHidden: boolean;
    includeArchived: boolean;
    includeInactive: boolean;
    onlyRecurring: boolean;
    dateFrom: string;
    dateTo: string;
};

function countActiveFilters(filters: DraftFilters): number {
    let count = 0;

    if (filters.searchTerm.trim()) count += 1;
    if (filters.accountId.trim()) count += 1;
    if (filters.memberId.trim()) count += 1;
    if (filters.categoryId.trim()) count += 1;
    if (filters.currency !== "ALL") count += 1;
    if (filters.typeFilter !== "ALL") count += 1;
    if (filters.statusFilter !== "ALL") count += 1;
    if (filters.directionFilter !== "ALL") count += 1;
    if (filters.sortOrder !== "date_desc") count += 1;
    if (filters.includeHidden) count += 1;
    if (filters.includeArchived) count += 1;
    if (filters.includeInactive) count += 1;
    if (filters.onlyRecurring) count += 1;
    if (filters.dateFrom.trim()) count += 1;
    if (filters.dateTo.trim()) count += 1;

    return count;
}

function LedgerFiltersFields({
    workspaceId,
    filters,
    onChange,
}: {
    workspaceId: string | null;
    filters: DraftFilters;
    onChange: (next: DraftFilters) => void;
}) {
    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Buscar"
                    value={filters.searchTerm}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            searchTerm: event.target.value,
                        })
                    }
                    placeholder="Descripción, referencia, comercio, miembro..."
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <WorkspaceAccountSelect
                    workspaceId={workspaceId}
                    value={filters.accountId}
                    onChange={(value) =>
                        onChange({
                            ...filters,
                            accountId: value,
                        })
                    }
                    label="Cuenta"
                    allowEmpty
                    emptyOptionLabel="Todas las cuentas"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <WorkspaceMemberSelect
                    workspaceId={workspaceId}
                    value={filters.memberId}
                    onChange={(value) =>
                        onChange({
                            ...filters,
                            memberId: value,
                        })
                    }
                    label="Miembro"
                    allowEmpty
                    emptyOptionLabel="Todos los miembros"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <WorkspaceCategorySelect
                    workspaceId={workspaceId}
                    value={filters.categoryId}
                    onChange={(value) =>
                        onChange({
                            ...filters,
                            categoryId: value,
                        })
                    }
                    label="Categoría"
                    allowEmpty
                    emptyOptionLabel="Todas las categorías"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                    select
                    fullWidth
                    label="Moneda"
                    value={filters.currency}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            currency: event.target.value as CurrencyCode | "ALL",
                        })
                    }
                >
                    <MenuItem value="ALL">Todas</MenuItem>
                    <MenuItem value="MXN">MXN</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                    select
                    fullWidth
                    label="Tipo"
                    value={filters.typeFilter}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            typeFilter: event.target.value as TransactionType | "ALL",
                        })
                    }
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="income">Ingreso</MenuItem>
                    <MenuItem value="expense">Gasto</MenuItem>
                    <MenuItem value="debt_payment">Pago de deuda</MenuItem>
                    <MenuItem value="transfer">Transferencia</MenuItem>
                    <MenuItem value="adjustment">Ajuste</MenuItem>
                </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                    select
                    fullWidth
                    label="Estado"
                    value={filters.statusFilter}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            statusFilter: event.target.value as TransactionStatus | "ALL",
                        })
                    }
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="posted">Aplicada</MenuItem>
                    <MenuItem value="pending">Pendiente</MenuItem>
                    <MenuItem value="cancelled">Cancelada</MenuItem>
                </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                    select
                    fullWidth
                    label="Dirección"
                    value={filters.directionFilter}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            directionFilter: event.target.value as LedgerDirectionFilter,
                        })
                    }
                >
                    <MenuItem value="ALL">Todas</MenuItem>
                    <MenuItem value="INFLOW">Entradas</MenuItem>
                    <MenuItem value="OUTFLOW">Salidas</MenuItem>
                </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                    select
                    fullWidth
                    label="Orden"
                    value={filters.sortOrder}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            sortOrder: event.target.value as LedgerSortOrder,
                        })
                    }
                >
                    <MenuItem value="date_desc">Fecha ↓</MenuItem>
                    <MenuItem value="date_asc">Fecha ↑</MenuItem>
                    <MenuItem value="amount_desc">Monto ↓</MenuItem>
                    <MenuItem value="amount_asc">Monto ↑</MenuItem>
                </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                    fullWidth
                    type="date"
                    label="Desde"
                    value={filters.dateFrom}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            dateFrom: event.target.value,
                        })
                    }
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                    fullWidth
                    type="date"
                    label="Hasta"
                    value={filters.dateTo}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            dateTo: event.target.value,
                        })
                    }
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    useFlexGap
                    flexWrap="wrap"
                >
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
                        label="Incluir ocultas"
                    />

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
                        label="Incluir archivadas"
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
                        label="Incluir inactivas"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={filters.onlyRecurring}
                                onChange={(event) =>
                                    onChange({
                                        ...filters,
                                        onlyRecurring: event.target.checked,
                                    })
                                }
                            />
                        }
                        label="Solo recurrentes"
                    />
                </Stack>
            </Grid>
        </Grid>
    );
}

export function LedgerFilters(props: LedgerFiltersProps) {
    const theme = useTheme();
    const useDialogFilters = useMediaQuery(theme.breakpoints.down("lg"));

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const currentFilters = React.useMemo<DraftFilters>(
        () => ({
            searchTerm: props.searchTerm,
            accountId: props.accountId,
            memberId: props.memberId,
            categoryId: props.categoryId,
            currency: props.currency,
            typeFilter: props.typeFilter,
            statusFilter: props.statusFilter,
            directionFilter: props.directionFilter,
            sortOrder: props.sortOrder,
            includeHidden: props.includeHidden,
            includeArchived: props.includeArchived,
            includeInactive: props.includeInactive,
            onlyRecurring: props.onlyRecurring,
            dateFrom: props.dateFrom,
            dateTo: props.dateTo,
        }),
        [
            props.searchTerm,
            props.accountId,
            props.memberId,
            props.categoryId,
            props.currency,
            props.typeFilter,
            props.statusFilter,
            props.directionFilter,
            props.sortOrder,
            props.includeHidden,
            props.includeArchived,
            props.includeInactive,
            props.onlyRecurring,
            props.dateFrom,
            props.dateTo,
        ]
    );

    const [draftFilters, setDraftFilters] = React.useState<DraftFilters>(currentFilters);

    React.useEffect(() => {
        setDraftFilters(currentFilters);
    }, [currentFilters]);

    const activeFiltersCount = countActiveFilters(currentFilters);

    const applyDraftFilters = React.useCallback(() => {
        props.onSearchTermChange(draftFilters.searchTerm);
        props.onAccountIdChange(draftFilters.accountId);
        props.onMemberIdChange(draftFilters.memberId);
        props.onCategoryIdChange(draftFilters.categoryId);
        props.onCurrencyChange(draftFilters.currency);
        props.onTypeFilterChange(draftFilters.typeFilter);
        props.onStatusFilterChange(draftFilters.statusFilter);
        props.onDirectionFilterChange(draftFilters.directionFilter);
        props.onSortOrderChange(draftFilters.sortOrder);
        props.onIncludeHiddenChange(draftFilters.includeHidden);
        props.onIncludeArchivedChange(draftFilters.includeArchived);
        props.onIncludeInactiveChange(draftFilters.includeInactive);
        props.onOnlyRecurringChange(draftFilters.onlyRecurring);
        props.onDateFromChange(draftFilters.dateFrom);
        props.onDateToChange(draftFilters.dateTo);
        setDialogOpen(false);
    }, [draftFilters, props]);

    const handleClearFromDialog = React.useCallback(() => {
        const clearedFilters: DraftFilters = {
            searchTerm: "",
            accountId: "",
            memberId: "",
            categoryId: "",
            currency: "ALL",
            typeFilter: "ALL",
            statusFilter: "ALL",
            directionFilter: "ALL",
            sortOrder: "date_desc",
            includeHidden: false,
            includeArchived: false,
            includeInactive: false,
            onlyRecurring: false,
            dateFrom: "",
            dateTo: "",
        };

        setDraftFilters(clearedFilters);
    }, []);

    if (useDialogFilters) {
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
                                    Filtros del Ledger
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                    {props.totalCount} renglones visibles con los filtros actuales.
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
                            En pantallas medianas y móviles, los filtros se muestran en un modal
                            para mantener la vista del ledger más limpia.
                        </Typography>
                    </Stack>
                </Paper>

                <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    fullWidth
                    maxWidth="md"
                    fullScreen={useMediaQuery(theme.breakpoints.down("sm"))}
                >
                    <DialogTitle>Filtros del Ledger</DialogTitle>

                    <DialogContent dividers>
                        <LedgerFiltersFields
                            workspaceId={props.workspaceId}
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
                        <Button onClick={handleClearFromDialog}>Limpiar draft</Button>

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

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2.5,
                borderRadius: 3,
            }}
        >
            <Stack spacing={2}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1.5}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", md: "center" }}
                >
                    <Stack spacing={0.5}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Filtros del Ledger
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.75 }}>
                            {props.totalCount} renglones visibles con los filtros actuales.
                        </Typography>
                    </Stack>

                    <Button variant="outlined" onClick={props.onResetFilters}>
                        Limpiar filtros
                    </Button>
                </Stack>

                <LedgerFiltersFields
                    workspaceId={props.workspaceId}
                    filters={currentFilters}
                    onChange={(nextFilters) => {
                        props.onSearchTermChange(nextFilters.searchTerm);
                        props.onAccountIdChange(nextFilters.accountId);
                        props.onMemberIdChange(nextFilters.memberId);
                        props.onCategoryIdChange(nextFilters.categoryId);
                        props.onCurrencyChange(nextFilters.currency);
                        props.onTypeFilterChange(nextFilters.typeFilter);
                        props.onStatusFilterChange(nextFilters.statusFilter);
                        props.onDirectionFilterChange(nextFilters.directionFilter);
                        props.onSortOrderChange(nextFilters.sortOrder);
                        props.onIncludeHiddenChange(nextFilters.includeHidden);
                        props.onIncludeArchivedChange(nextFilters.includeArchived);
                        props.onIncludeInactiveChange(nextFilters.includeInactive);
                        props.onOnlyRecurringChange(nextFilters.onlyRecurring);
                        props.onDateFromChange(nextFilters.dateFrom);
                        props.onDateToChange(nextFilters.dateTo);
                    }}
                />
            </Stack>
        </Paper>
    );
}
// src/features/reconciliation/components/ReconciliationFilters.tsx

import React from "react";
import Badge from "@mui/material/Badge";
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
import TuneIcon from "@mui/icons-material/Tune";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { WorkspaceAccountSelect } from "../../components/WorkspaceAccountSelect";
import { WorkspaceCardSelect } from "../../components/WorkspaceCardSelect";
import { WorkspaceMemberSelect } from "../../components/WorkspaceMemberSelect";
import { WorkspaceTransactionSelect } from "../../components/WorkspaceTransactionSelect";
import type {
    ReconciliationEntrySide,
    ReconciliationListFilters,
    ReconciliationMatchMethod,
    ReconciliationStatus,
} from "../types/reconciliation.types";
import type { CurrencyCode } from "../../../shared/types/common.types";

type ReconciliationFiltersProps = {
    workspaceId: string | null;
    filters: ReconciliationListFilters;
    totalCount: number;
    onApplyFilters: (filters: ReconciliationListFilters) => void;
    onResetFilters: () => void;
};

function countActiveFilters(filters: ReconciliationListFilters): number {
    let count = 0;

    if (filters.accountId.trim()) count += 1;
    if (filters.cardId.trim()) count += 1;
    if (filters.memberId.trim()) count += 1;
    if (filters.transactionId.trim()) count += 1;
    if (filters.status !== "ALL") count += 1;
    if (filters.currency !== "ALL") count += 1;
    if (filters.entrySide !== "ALL") count += 1;
    if (filters.matchMethod !== "ALL") count += 1;
    if (filters.includeArchived) count += 1;
    if (filters.includeInactive) count += 1;
    if (filters.includeHidden) count += 1;
    if (filters.transactionDateFrom.trim()) count += 1;
    if (filters.transactionDateTo.trim()) count += 1;
    if (filters.reconciledFrom.trim()) count += 1;
    if (filters.reconciledTo.trim()) count += 1;
    if (filters.statementDateFrom.trim()) count += 1;
    if (filters.statementDateTo.trim()) count += 1;

    return count;
}

function buildEmptyFilters(): ReconciliationListFilters {
    return {
        accountId: "",
        cardId: "",
        memberId: "",
        transactionId: "",
        status: "ALL",
        currency: "ALL",
        entrySide: "ALL",
        matchMethod: "ALL",
        includeArchived: false,
        includeInactive: false,
        includeHidden: false,
        transactionDateFrom: "",
        transactionDateTo: "",
        reconciledFrom: "",
        reconciledTo: "",
        statementDateFrom: "",
        statementDateTo: "",
    };
}

function FilterFields({
    workspaceId,
    filters,
    onChange,
}: {
    workspaceId: string | null;
    filters: ReconciliationListFilters;
    onChange: (nextFilters: ReconciliationListFilters) => void;
}) {
    return (
        <Grid container spacing={2}>
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
                <WorkspaceCardSelect
                    workspaceId={workspaceId}
                    value={filters.cardId}
                    onChange={(value) =>
                        onChange({
                            ...filters,
                            cardId: value,
                        })
                    }
                    label="Tarjeta"
                    allowEmpty
                    emptyOptionLabel="Todas las tarjetas"
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
                <WorkspaceTransactionSelect
                    workspaceId={workspaceId}
                    value={filters.transactionId}
                    onChange={(value) =>
                        onChange({
                            ...filters,
                            transactionId: value,
                        })
                    }
                    label="Transacción"
                    allowEmpty
                    emptyOptionLabel="Todas las transacciones"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                    select
                    fullWidth
                    label="Estado"
                    value={filters.status}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            status: event.target.value as ReconciliationStatus | "ALL",
                        })
                    }
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="unreconciled">Sin conciliar</MenuItem>
                    <MenuItem value="reconciled">Conciliada</MenuItem>
                    <MenuItem value="exception">Con excepción</MenuItem>
                </TextField>
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
                    label="Lado"
                    value={filters.entrySide}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            entrySide: event.target.value as ReconciliationEntrySide | "ALL",
                        })
                    }
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="account">Cuenta</MenuItem>
                    <MenuItem value="destination_account">Cuenta destino</MenuItem>
                    <MenuItem value="card">Tarjeta</MenuItem>
                </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                    select
                    fullWidth
                    label="Método"
                    value={filters.matchMethod}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            matchMethod: event.target.value as ReconciliationMatchMethod | "ALL",
                        })
                    }
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="manual">Manual</MenuItem>
                    <MenuItem value="imported">Importado</MenuItem>
                    <MenuItem value="automatic">Automático</MenuItem>
                </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                    fullWidth
                    type="date"
                    label="Transacción desde"
                    value={filters.transactionDateFrom}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            transactionDateFrom: event.target.value,
                        })
                    }
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                    fullWidth
                    type="date"
                    label="Transacción hasta"
                    value={filters.transactionDateTo}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            transactionDateTo: event.target.value,
                        })
                    }
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                    fullWidth
                    type="date"
                    label="Estado de cuenta desde"
                    value={filters.statementDateFrom}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            statementDateFrom: event.target.value,
                        })
                    }
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <TextField
                    fullWidth
                    type="date"
                    label="Estado de cuenta hasta"
                    value={filters.statementDateTo}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            statementDateTo: event.target.value,
                        })
                    }
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <TextField
                    fullWidth
                    type="date"
                    label="Conciliada desde"
                    value={filters.reconciledFrom}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            reconciledFrom: event.target.value,
                        })
                    }
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <TextField
                    fullWidth
                    type="date"
                    label="Conciliada hasta"
                    value={filters.reconciledTo}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            reconciledTo: event.target.value,
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
                </Stack>
            </Grid>
        </Grid>
    );
}

export function ReconciliationFilters({
    workspaceId,
    filters,
    totalCount,
    onApplyFilters,
    onResetFilters,
}: ReconciliationFiltersProps) {
    const theme = useTheme();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [draftFilters, setDraftFilters] = React.useState<ReconciliationListFilters>(filters);

    React.useEffect(() => {
        setDraftFilters(filters);
    }, [filters]);

    const activeFiltersCount = countActiveFilters(filters);

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
                                Filtros de conciliación
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                {totalCount} registros visibles con los filtros actuales.
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" onClick={onResetFilters}>
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
                        Los filtros se gestionan desde un modal para mantener la vista de conciliación más limpia.
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
                <DialogTitle>Filtros de conciliación</DialogTitle>

                <DialogContent dividers>
                    <FilterFields
                        workspaceId={workspaceId}
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
                    <Button onClick={() => setDraftFilters(buildEmptyFilters())}>
                        Limpiar draft
                    </Button>

                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() => {
                                onApplyFilters(draftFilters);
                                setDialogOpen(false);
                            }}
                        >
                            Aplicar
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
}
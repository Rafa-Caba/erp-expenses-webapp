// src/features/dashboard/components/DashboardFilters.tsx

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
import { WorkspaceCategorySelect } from "../../components/WorkspaceCategorySelect";
import { WorkspaceMemberSelect } from "../../components/WorkspaceMemberSelect";
import type {
    DashboardFilters as DashboardFiltersType,
    DashboardGroupBy,
    DashboardRangePreset,
} from "../types/dashboard.types";
import type { CurrencyCode } from "../../../shared/types/common.types";

type DashboardFiltersProps = {
    workspaceId: string | null;
    filters: DashboardFiltersType;
    periodLabel: string;
    onApplyFilters: (filters: DashboardFiltersType) => void;
    onResetFilters: () => void;
};

function countActiveFilters(filters: DashboardFiltersType): number {
    let count = 0;

    if (filters.rangePreset !== "month") count += 1;
    if (filters.currency !== "ALL") count += 1;
    if (filters.groupBy !== "auto") count += 1;
    if (filters.memberId.trim()) count += 1;
    if (filters.categoryId.trim()) count += 1;
    if (filters.accountId.trim()) count += 1;
    if (filters.cardId.trim()) count += 1;
    if (filters.includeArchived) count += 1;
    if (filters.rangePreset === "custom" && filters.customDateFrom.trim()) count += 1;
    if (filters.rangePreset === "custom" && filters.customDateTo.trim()) count += 1;

    return count;
}

function buildEmptyFilters(): DashboardFiltersType {
    return {
        rangePreset: "month",
        currency: "ALL",
        groupBy: "auto",
        memberId: "",
        categoryId: "",
        accountId: "",
        cardId: "",
        includeArchived: false,
        customDateFrom: "",
        customDateTo: "",
    };
}

function FilterFields({
    workspaceId,
    filters,
    onChange,
}: {
    workspaceId: string | null;
    filters: DashboardFiltersType;
    onChange: (nextFilters: DashboardFiltersType) => void;
}) {
    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                    select
                    fullWidth
                    label="Periodo"
                    value={filters.rangePreset}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            rangePreset: event.target.value as DashboardRangePreset,
                        })
                    }
                >
                    <MenuItem value="7d">Últimos 7 días</MenuItem>
                    <MenuItem value="30d">Últimos 30 días</MenuItem>
                    <MenuItem value="month">Mes actual</MenuItem>
                    <MenuItem value="quarter">Trimestre actual</MenuItem>
                    <MenuItem value="year">Año actual</MenuItem>
                    <MenuItem value="custom">Personalizado</MenuItem>
                </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                    select
                    fullWidth
                    label="Agrupar"
                    value={filters.groupBy}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            groupBy: event.target.value as DashboardGroupBy,
                        })
                    }
                >
                    <MenuItem value="auto">Auto</MenuItem>
                    <MenuItem value="day">Día</MenuItem>
                    <MenuItem value="week">Semana</MenuItem>
                    <MenuItem value="month">Mes</MenuItem>
                </TextField>
            </Grid>

            {filters.rangePreset === "custom" ? (
                <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Desde"
                            value={filters.customDateFrom}
                            onChange={(event) =>
                                onChange({
                                    ...filters,
                                    customDateFrom: event.target.value,
                                })
                            }
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Hasta"
                            value={filters.customDateTo}
                            onChange={(event) =>
                                onChange({
                                    ...filters,
                                    customDateTo: event.target.value,
                                })
                            }
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </>
            ) : null}

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

            <Grid size={{ xs: 12 }}>
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
                    label="Incluir archivados"
                />
            </Grid>
        </Grid>
    );
}

export function DashboardFilters({
    workspaceId,
    filters,
    periodLabel,
    onApplyFilters,
    onResetFilters,
}: DashboardFiltersProps) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [draftFilters, setDraftFilters] = React.useState<DashboardFiltersType>(filters);

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
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1.5}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", md: "center" }}
                >
                    <Stack spacing={0.5}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Filtros del dashboard
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.75 }}>
                            {periodLabel}
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
            </Paper>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                fullWidth
                maxWidth="md"
                fullScreen={isSmallScreen}
            >
                <DialogTitle>Filtros del dashboard</DialogTitle>

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
// src/features/reports/components/ReportFiltersFields.tsx

import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import { WorkspaceAccountSelect } from "../../components/WorkspaceAccountSelect";
import { WorkspaceCardSelect } from "../../components/WorkspaceCardSelect";
import { WorkspaceCategorySelect } from "../../components/WorkspaceCategorySelect";
import { WorkspaceMemberSelect } from "../../components/WorkspaceMemberSelect";
import type { ReportFiltersFormValues } from "../types/report-filter-form.types";
import { getReportGroupByLabel } from "../utils/report-labels";

type ReportFiltersFieldsProps = {
    workspaceId: string | null;
    values: ReportFiltersFormValues;
    disabled?: boolean;
    onChange: (nextValues: ReportFiltersFormValues) => void;
};

export function ReportFiltersFields({
    workspaceId,
    values,
    disabled = false,
    onChange,
}: ReportFiltersFieldsProps) {
    const handleTextFieldChange =
        (field: "dateFrom" | "dateTo") =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                onChange({
                    ...values,
                    [field]: event.target.value,
                });
            };

    const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "" || value === "MXN" || value === "USD") {
            onChange({
                ...values,
                currency: value,
            });
        }
    };

    const handleGroupByChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "" ||
            value === "day" ||
            value === "week" ||
            value === "month" ||
            value === "category" ||
            value === "member"
        ) {
            onChange({
                ...values,
                groupBy: value,
            });
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                    label="Fecha desde"
                    type="date"
                    value={values.dateFrom}
                    onChange={handleTextFieldChange("dateFrom")}
                    fullWidth
                    disabled={disabled}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                    label="Fecha hasta"
                    type="date"
                    value={values.dateTo}
                    onChange={handleTextFieldChange("dateTo")}
                    fullWidth
                    disabled={disabled}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth disabled={disabled}>
                    <InputLabel id="report-filters-currency-label">Moneda</InputLabel>
                    <Select
                        labelId="report-filters-currency-label"
                        label="Moneda"
                        value={values.currency}
                        onChange={handleCurrencyChange}
                    >
                        <MenuItem value="">
                            <em>Todas</em>
                        </MenuItem>
                        <MenuItem value="MXN">MXN</MenuItem>
                        <MenuItem value="USD">USD</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth disabled={disabled}>
                    <InputLabel id="report-filters-group-by-label">Agrupar por</InputLabel>
                    <Select
                        labelId="report-filters-group-by-label"
                        label="Agrupar por"
                        value={values.groupBy}
                        onChange={handleGroupByChange}
                    >
                        <MenuItem value="">
                            <em>Sin agrupación</em>
                        </MenuItem>
                        <MenuItem value="day">{getReportGroupByLabel("day")}</MenuItem>
                        <MenuItem value="week">{getReportGroupByLabel("week")}</MenuItem>
                        <MenuItem value="month">{getReportGroupByLabel("month")}</MenuItem>
                        <MenuItem value="category">
                            {getReportGroupByLabel("category")}
                        </MenuItem>
                        <MenuItem value="member">
                            {getReportGroupByLabel("member")}
                        </MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <WorkspaceMemberSelect
                    workspaceId={workspaceId}
                    value={values.memberId}
                    onChange={(value) =>
                        onChange({
                            ...values,
                            memberId: value,
                        })
                    }
                    label="Miembro"
                    helperText="Opcional. Filtra por miembro."
                    allowEmpty
                    emptyOptionLabel="Todos los miembros"
                    disabled={disabled}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <WorkspaceCategorySelect
                    workspaceId={workspaceId}
                    value={values.categoryId}
                    onChange={(value) =>
                        onChange({
                            ...values,
                            categoryId: value,
                        })
                    }
                    label="Categoría"
                    helperText="Opcional. Filtra por categoría."
                    allowEmpty
                    emptyOptionLabel="Todas las categorías"
                    disabled={disabled}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <WorkspaceAccountSelect
                    workspaceId={workspaceId}
                    value={values.accountId}
                    onChange={(value) =>
                        onChange({
                            ...values,
                            accountId: value,
                        })
                    }
                    label="Cuenta"
                    helperText="Opcional. Filtra por cuenta."
                    allowEmpty
                    emptyOptionLabel="Todas las cuentas"
                    disabled={disabled}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <WorkspaceCardSelect
                    workspaceId={workspaceId}
                    value={values.cardId}
                    onChange={(value) =>
                        onChange({
                            ...values,
                            cardId: value,
                        })
                    }
                    label="Tarjeta"
                    helperText="Opcional. Filtra por tarjeta."
                    allowEmpty
                    emptyOptionLabel="Todas las tarjetas"
                    disabled={disabled}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={values.includeArchived}
                            onChange={(event) =>
                                onChange({
                                    ...values,
                                    includeArchived: event.target.checked,
                                })
                            }
                            disabled={disabled}
                        />
                    }
                    label="Incluir archivados"
                />
            </Grid>
        </Grid>
    );
}
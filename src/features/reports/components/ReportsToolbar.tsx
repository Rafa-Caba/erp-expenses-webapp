// src/features/reports/components/ReportsToolbar.tsx

import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

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

export function ReportsToolbar({
    searchTerm,
    typeFilter,
    statusFilter,
    includeHidden,
    totalCount,
    onSearchTermChange,
    onTypeFilterChange,
    onStatusFilterChange,
    onIncludeHiddenChange,
    onResetFilters,
}: ReportsToolbarProps) {
    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL") {
            onTypeFilterChange("ALL");
            return;
        }

        if (
            value === "monthly_summary" ||
            value === "category_breakdown" ||
            value === "debt_report" ||
            value === "budget_report" ||
            value === "custom"
        ) {
            onTypeFilterChange(value);
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL") {
            onStatusFilterChange("ALL");
            return;
        }

        if (
            value === "pending" ||
            value === "generated" ||
            value === "failed" ||
            value === "archived"
        ) {
            onStatusFilterChange(value);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Stack spacing={2}>
                <Stack
                    direction={{ xs: "column", lg: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", lg: "center" }}
                >
                    <TextField
                        label="Buscar reporte"
                        placeholder="Nombre, notas, tipo, estatus..."
                        value={searchTerm}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                        fullWidth
                    />

                    <FormControl sx={{ minWidth: 220 }}>
                        <InputLabel id="reports-type-filter-label">Tipo</InputLabel>
                        <Select
                            labelId="reports-type-filter-label"
                            label="Tipo"
                            value={typeFilter}
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

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="reports-status-filter-label">Estatus</InputLabel>
                        <Select
                            labelId="reports-status-filter-label"
                            label="Estatus"
                            value={statusFilter}
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

                    <Button variant="outlined" onClick={onResetFilters}>
                        Limpiar
                    </Button>
                </Stack>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", md: "center" }}
                >
                    <FormControlLabel
                        control={
                            <Switch
                                checked={includeHidden}
                                onChange={(event) =>
                                    onIncludeHiddenChange(event.target.checked)
                                }
                            />
                        }
                        label="Mostrar ocultos"
                    />

                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        {totalCount} reporte{totalCount === 1 ? "" : "s"}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
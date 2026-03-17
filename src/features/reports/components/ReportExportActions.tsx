// src/features/reports/components/ReportExportActions.tsx

import React from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { ReportExportFormat } from "../types/report.types";
import { getReportExportFormatLabel } from "../utils/report-labels";

type ReportExportActionsProps = {
    onExportMonthlySummary: (format: ReportExportFormat, persistReport: boolean) => void;
    onExportCategoryBreakdown: (
        format: ReportExportFormat,
        persistReport: boolean
    ) => void;
    onExportDebtSummary: (format: ReportExportFormat, persistReport: boolean) => void;
    onExportBudgetSummary: (format: ReportExportFormat, persistReport: boolean) => void;
    isExportingMonthlySummary: boolean;
    isExportingCategoryBreakdown: boolean;
    isExportingDebtSummary: boolean;
    isExportingBudgetSummary: boolean;
};

export function ReportExportActions({
    onExportMonthlySummary,
    onExportCategoryBreakdown,
    onExportDebtSummary,
    onExportBudgetSummary,
    isExportingMonthlySummary,
    isExportingCategoryBreakdown,
    isExportingDebtSummary,
    isExportingBudgetSummary,
}: ReportExportActionsProps) {
    const [format, setFormat] = React.useState<ReportExportFormat>("csv");
    const [persistReport, setPersistReport] = React.useState(false);

    const handleFormatChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "csv" || value === "xlsx") {
            setFormat(value);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Exportaciones
                </Typography>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", md: "center" }}
                >
                    <FormControl sx={{ minWidth: 160 }}>
                        <InputLabel id="report-export-format-label">Formato</InputLabel>
                        <Select
                            labelId="report-export-format-label"
                            label="Formato"
                            value={format}
                            onChange={handleFormatChange}
                        >
                            <MenuItem value="csv">
                                {getReportExportFormatLabel("csv")}
                            </MenuItem>
                            <MenuItem value="xlsx">
                                {getReportExportFormatLabel("xlsx")}
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={persistReport}
                                onChange={(event) => setPersistReport(event.target.checked)}
                            />
                        }
                        label="Persistir como reporte"
                    />
                </Stack>

                <Stack
                    direction={{ xs: "column", lg: "row" }}
                    spacing={1.5}
                    useFlexGap
                    flexWrap="wrap"
                >
                    <Button
                        variant="outlined"
                        disabled={isExportingMonthlySummary}
                        onClick={() => onExportMonthlySummary(format, persistReport)}
                    >
                        Exportar resumen mensual
                    </Button>

                    <Button
                        variant="outlined"
                        disabled={isExportingCategoryBreakdown}
                        onClick={() => onExportCategoryBreakdown(format, persistReport)}
                    >
                        Exportar desglose por categoría
                    </Button>

                    <Button
                        variant="outlined"
                        disabled={isExportingDebtSummary}
                        onClick={() => onExportDebtSummary(format, persistReport)}
                    >
                        Exportar resumen de deudas
                    </Button>

                    <Button
                        variant="outlined"
                        disabled={isExportingBudgetSummary}
                        onClick={() => onExportBudgetSummary(format, persistReport)}
                    >
                        Exportar resumen de presupuestos
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}
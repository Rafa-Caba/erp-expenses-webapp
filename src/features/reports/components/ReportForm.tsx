// src/features/reports/components/ReportForm.tsx

import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { WorkspaceMemberSelect } from "../../components/WorkspaceMemberSelect";
import type { ReportFiltersFormValues } from "../types/report-filter-form.types";
import type { ReportStatus, ReportType } from "../types/report.types";
import {
    getReportStatusLabel,
    getReportTypeLabel,
} from "../utils/report-labels";
import { ReportFiltersFields } from "./ReportFiltersFields";

export type ReportFormValues = {
    name: string;
    type: ReportType;
    generatedByMemberId: string;
    fileUrl: string;
    notes: string;
    status: ReportStatus;
    isVisible: boolean;
    generatedAt: string;
    filters: ReportFiltersFormValues;
};

type ReportFormField = "name";

type ReportFormErrors = Partial<Record<ReportFormField, string>>;

type ReportFormTextField = "name" | "fileUrl" | "notes" | "generatedAt";

type ReportFormProps = {
    mode: "create" | "edit";
    workspaceId: string | null;
    initialValues: ReportFormValues;
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: ReportFormValues) => void;
    onCancel: () => void;
};

function validateReportForm(values: ReportFormValues): ReportFormErrors {
    const errors: ReportFormErrors = {};

    if (!values.name.trim()) {
        errors.name = "El nombre es obligatorio.";
    }

    return errors;
}

export function ReportForm({
    mode,
    workspaceId,
    initialValues,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: ReportFormProps) {
    const [values, setValues] = React.useState<ReportFormValues>(initialValues);
    const [errors, setErrors] = React.useState<ReportFormErrors>({});

    React.useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const handleTextChange =
        (field: ReportFormTextField) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
            };

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "monthly_summary" ||
            value === "category_breakdown" ||
            value === "debt_report" ||
            value === "budget_report" ||
            value === "custom"
        ) {
            setValues((currentValues) => ({
                ...currentValues,
                type: value,
            }));
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "pending" ||
            value === "generated" ||
            value === "failed" ||
            value === "archived"
        ) {
            setValues((currentValues) => ({
                ...currentValues,
                status: value,
            }));
        }
    };

    const handleMemberChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            generatedByMemberId: value,
        }));
    };

    const handleVisibleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues((currentValues) => ({
            ...currentValues,
            isVisible: event.target.checked,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateReportForm(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        onSubmit(values);
    };

    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {mode === "create" ? "Nuevo reporte" : "Editar reporte"}
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Configura metadatos y filtros del reporte guardado.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? (
                            <Alert severity="error">{submitErrorMessage}</Alert>
                        ) : null}

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Nombre"
                                    value={values.name}
                                    onChange={handleTextChange("name")}
                                    error={Boolean(errors.name)}
                                    helperText={errors.name}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="report-type-label">Tipo</InputLabel>
                                    <Select
                                        labelId="report-type-label"
                                        label="Tipo"
                                        value={values.type}
                                        onChange={handleTypeChange}
                                    >
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
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="report-status-label">Estatus</InputLabel>
                                    <Select
                                        labelId="report-status-label"
                                        label="Estatus"
                                        value={values.status}
                                        onChange={handleStatusChange}
                                    >
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
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceMemberSelect
                                    workspaceId={workspaceId}
                                    value={values.generatedByMemberId}
                                    onChange={handleMemberChange}
                                    label="Generado por"
                                    helperText="Opcional. Miembro que generó el reporte."
                                    allowEmpty
                                    emptyOptionLabel="Sin miembro específico"
                                    disabled={isSubmitting}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Fecha de generación"
                                    type="date"
                                    value={values.generatedAt}
                                    onChange={handleTextChange("generatedAt")}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="URL del archivo"
                                    value={values.fileUrl}
                                    onChange={handleTextChange("fileUrl")}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Notas"
                                    value={values.notes}
                                    onChange={handleTextChange("notes")}
                                    fullWidth
                                    multiline
                                    minRows={2}
                                />
                            </Grid>
                        </Grid>

                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                            <Stack spacing={2}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    Filtros del reporte
                                </Typography>

                                <ReportFiltersFields
                                    workspaceId={workspaceId}
                                    values={values.filters}
                                    disabled={isSubmitting}
                                    onChange={(nextFilters) =>
                                        setValues((currentValues) => ({
                                            ...currentValues,
                                            filters: nextFilters,
                                        }))
                                    }
                                />
                            </Stack>
                        </Paper>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={values.isVisible}
                                    onChange={handleVisibleChange}
                                />
                            }
                            label="Visible"
                        />

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                                Cancelar
                            </Button>

                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {mode === "create" ? "Crear reporte" : "Guardar cambios"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
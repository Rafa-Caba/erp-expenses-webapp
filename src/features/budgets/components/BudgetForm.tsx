// src/features/budgets/components/BudgetForm.tsx

import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { WorkspaceCategorySelect } from "../../components/WorkspaceCategorySelect";
import { WorkspaceMemberSelect } from "../../components/WorkspaceMemberSelect";
import type { CurrencyCode } from "../../../shared/types/common.types";
import type { BudgetPeriodType, BudgetStatus } from "../types/budget.types";

export type BudgetFormValues = {
    name: string;
    periodType: BudgetPeriodType;
    startDate: string;
    endDate: string;
    limitAmount: string;
    currency: CurrencyCode;
    categoryId: string;
    memberId: string;
    alertPercent: string;
    notes: string;
    isActive: boolean;
    status: BudgetStatus;
    isVisible: boolean;
};

type BudgetFormField =
    | "name"
    | "periodType"
    | "startDate"
    | "endDate"
    | "limitAmount"
    | "currency"
    | "alertPercent"
    | "status";

type BudgetFormErrors = Partial<Record<BudgetFormField, string>>;

type BudgetFormProps = {
    workspaceId: string | null;
    mode: "create" | "edit";
    initialValues: BudgetFormValues;
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: BudgetFormValues) => void;
    onCancel: () => void;
};

function validatePositiveNumberField(value: string, label: string): string | null {
    if (!value.trim()) {
        return `${label} es obligatorio.`;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return `${label} debe ser un número válido.`;
    }

    if (numericValue <= 0) {
        return `${label} debe ser mayor a 0.`;
    }

    return null;
}

function validateBudgetForm(values: BudgetFormValues): BudgetFormErrors {
    const errors: BudgetFormErrors = {};

    if (!values.name.trim()) {
        errors.name = "El nombre es obligatorio.";
    }

    if (!values.periodType) {
        errors.periodType = "El periodo es obligatorio.";
    }

    if (!values.startDate.trim()) {
        errors.startDate = "La fecha de inicio es obligatoria.";
    }

    if (!values.endDate.trim()) {
        errors.endDate = "La fecha de fin es obligatoria.";
    }

    if (values.startDate.trim() && values.endDate.trim()) {
        const startDate = new Date(values.startDate);
        const endDate = new Date(values.endDate);

        if (Number.isNaN(startDate.getTime())) {
            errors.startDate = "La fecha de inicio no es válida.";
        }

        if (Number.isNaN(endDate.getTime())) {
            errors.endDate = "La fecha de fin no es válida.";
        }

        if (
            !Number.isNaN(startDate.getTime()) &&
            !Number.isNaN(endDate.getTime()) &&
            endDate.getTime() < startDate.getTime()
        ) {
            errors.endDate = "La fecha de fin no puede ser anterior a la fecha de inicio.";
        }
    }

    const limitAmountError = validatePositiveNumberField(values.limitAmount, "El límite");
    if (limitAmountError) {
        errors.limitAmount = limitAmountError;
    }

    if (!values.currency) {
        errors.currency = "La moneda es obligatoria.";
    }

    if (values.alertPercent.trim()) {
        const alertPercent = Number(values.alertPercent);

        if (Number.isNaN(alertPercent)) {
            errors.alertPercent = "La alerta debe ser un número válido.";
        } else if (alertPercent < 1 || alertPercent > 100) {
            errors.alertPercent = "La alerta debe estar entre 1 y 100.";
        }
    }

    if (!values.status) {
        errors.status = "El estado es obligatorio.";
    }

    return errors;
}

export function BudgetForm({
    workspaceId,
    mode,
    initialValues,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: BudgetFormProps) {
    const [values, setValues] = React.useState<BudgetFormValues>(initialValues);
    const [errors, setErrors] = React.useState<BudgetFormErrors>({});

    React.useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const handleTextChange =
        (field: keyof BudgetFormValues) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
            };

    const handlePeriodTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "weekly" ||
            value === "monthly" ||
            value === "yearly" ||
            value === "custom"
        ) {
            setValues((currentValues) => ({
                ...currentValues,
                periodType: value,
            }));
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "draft" ||
            value === "active" ||
            value === "completed" ||
            value === "exceeded" ||
            value === "archived"
        ) {
            setValues((currentValues) => ({
                ...currentValues,
                status: value,
            }));
        }
    };

    const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "MXN" || value === "USD") {
            setValues((currentValues) => ({
                ...currentValues,
                currency: value,
            }));
        }
    };

    const handleCheckboxChange =
        (field: "isActive" | "isVisible") =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.checked,
                }));
            };

    const handleCategoryChange = (categoryId: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            categoryId,
        }));
    };

    const handleMemberChange = (memberId: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            memberId,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateBudgetForm(values);
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
                                {mode === "create" ? "Nuevo presupuesto" : "Editar presupuesto"}
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Define el periodo, límite, estado y metadatos del presupuesto dentro del workspace activo.
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
                                <FormControl fullWidth error={Boolean(errors.periodType)}>
                                    <InputLabel id="budget-period-type-label">Periodo</InputLabel>
                                    <Select
                                        labelId="budget-period-type-label"
                                        label="Periodo"
                                        value={values.periodType}
                                        onChange={handlePeriodTypeChange}
                                    >
                                        <MenuItem value="weekly">Semanal</MenuItem>
                                        <MenuItem value="monthly">Mensual</MenuItem>
                                        <MenuItem value="yearly">Anual</MenuItem>
                                        <MenuItem value="custom">Personalizado</MenuItem>
                                    </Select>
                                    {errors.periodType ? (
                                        <FormHelperText>{errors.periodType}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth error={Boolean(errors.status)}>
                                    <InputLabel id="budget-status-label">Estado</InputLabel>
                                    <Select
                                        labelId="budget-status-label"
                                        label="Estado"
                                        value={values.status}
                                        onChange={handleStatusChange}
                                    >
                                        <MenuItem value="draft">Borrador</MenuItem>
                                        <MenuItem value="active">Activo</MenuItem>
                                        <MenuItem value="completed">Completado</MenuItem>
                                        <MenuItem value="exceeded">Excedido</MenuItem>
                                        <MenuItem value="archived">Archivado</MenuItem>
                                    </Select>
                                    {errors.status ? (
                                        <FormHelperText>{errors.status}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Fecha de inicio"
                                    type="date"
                                    value={values.startDate}
                                    onChange={handleTextChange("startDate")}
                                    error={Boolean(errors.startDate)}
                                    helperText={errors.startDate}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Fecha de fin"
                                    type="date"
                                    value={values.endDate}
                                    onChange={handleTextChange("endDate")}
                                    error={Boolean(errors.endDate)}
                                    helperText={errors.endDate}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Límite"
                                    type="number"
                                    value={values.limitAmount}
                                    onChange={handleTextChange("limitAmount")}
                                    error={Boolean(errors.limitAmount)}
                                    helperText={errors.limitAmount}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth error={Boolean(errors.currency)}>
                                    <InputLabel id="budget-currency-label">Moneda</InputLabel>
                                    <Select
                                        labelId="budget-currency-label"
                                        label="Moneda"
                                        value={values.currency}
                                        onChange={handleCurrencyChange}
                                    >
                                        <MenuItem value="MXN">MXN</MenuItem>
                                        <MenuItem value="USD">USD</MenuItem>
                                    </Select>
                                    {errors.currency ? (
                                        <FormHelperText>{errors.currency}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceCategorySelect
                                    workspaceId={workspaceId}
                                    value={values.categoryId}
                                    onChange={handleCategoryChange}
                                    label="Categoría"
                                    helperText="Opcional. Déjala vacía si el presupuesto aplica a todas las categorías."
                                    disabled={isSubmitting}
                                    allowEmpty
                                    emptyOptionLabel="Sin categoría específica"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceMemberSelect
                                    workspaceId={workspaceId}
                                    value={values.memberId}
                                    onChange={handleMemberChange}
                                    label="Miembro"
                                    helperText="Opcional. Déjalo vacío si el presupuesto aplica a todos los miembros."
                                    disabled={isSubmitting}
                                    allowEmpty
                                    emptyOptionLabel="Sin miembro específico"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Alerta (%)"
                                    type="number"
                                    value={values.alertPercent}
                                    onChange={handleTextChange("alertPercent")}
                                    error={Boolean(errors.alertPercent)}
                                    helperText={errors.alertPercent ?? "Opcional. Entre 1 y 100."}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Notas"
                                    value={values.notes}
                                    onChange={handleTextChange("notes")}
                                    multiline
                                    minRows={4}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={2}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", md: "center" }}
                        >
                            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.isActive}
                                            onChange={handleCheckboxChange("isActive")}
                                        />
                                    }
                                    label="Activo"
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.isVisible}
                                            onChange={handleCheckboxChange("isVisible")}
                                        />
                                    }
                                    label="Visible"
                                />
                            </Stack>

                            <Stack direction="row" spacing={1.5}>
                                <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                                    Cancelar
                                </Button>

                                <Button type="submit" variant="contained" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? mode === "create"
                                            ? "Creando..."
                                            : "Guardando..."
                                        : mode === "create"
                                            ? "Crear presupuesto"
                                            : "Guardar cambios"}
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
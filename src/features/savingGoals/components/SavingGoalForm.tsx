// src/features/savingGoals/components/SavingGoalForm.tsx

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

import { WorkspaceAccountSelect } from "../../components/WorkspaceAccountSelect";
import { WorkspaceMemberSelect } from "../../components/WorkspaceMemberSelect";
import type { CurrencyCode } from "../../../shared/types/common.types";
import type {
    SavingsGoalCategory,
    SavingsGoalPriority,
    SavingsGoalStatus,
} from "../types/saving-goal.types";
import {
    getSavingsGoalCategoryLabel,
    getSavingsGoalPriorityLabel,
    getSavingsGoalStatusLabel,
} from "../utils/saving-goal-labels";

export type SavingGoalFormValues = {
    accountId: string;
    memberId: string;
    name: string;
    description: string;
    targetAmount: string;
    currentAmount: string;
    currency: CurrencyCode;
    targetDate: string;
    status: SavingsGoalStatus;
    priority: SavingsGoalPriority | "";
    category: SavingsGoalCategory;
    isVisible: boolean;
};

type SavingGoalFormField =
    | "name"
    | "targetAmount"
    | "currentAmount"
    | "currency"
    | "status"
    | "category";

type SavingGoalFormErrors = Partial<Record<SavingGoalFormField, string>>;

type SavingGoalFormTextField =
    | "name"
    | "description"
    | "targetAmount"
    | "currentAmount"
    | "targetDate";

type SavingGoalFormProps = {
    mode: "create" | "edit";
    workspaceId: string | null;
    initialValues: SavingGoalFormValues;
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: SavingGoalFormValues) => void;
    onCancel: () => void;
};

function validateRequiredNumber(value: string, label: string): string | null {
    if (!value.trim()) {
        return `${label} es obligatorio.`;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return `${label} debe ser numérico.`;
    }

    return null;
}

function validateSavingGoalForm(
    values: SavingGoalFormValues
): SavingGoalFormErrors {
    const errors: SavingGoalFormErrors = {};

    if (!values.name.trim()) {
        errors.name = "El nombre es obligatorio.";
    }

    if (!values.currency) {
        errors.currency = "La moneda es obligatoria.";
    }

    if (!values.status) {
        errors.status = "El estado es obligatorio.";
    }

    if (!values.category) {
        errors.category = "La categoría es obligatoria.";
    }

    const targetAmountError = validateRequiredNumber(
        values.targetAmount,
        "El monto meta"
    );

    if (targetAmountError) {
        errors.targetAmount = targetAmountError;
    } else if (Number(values.targetAmount) <= 0) {
        errors.targetAmount = "El monto meta debe ser mayor a 0.";
    }

    const currentAmountError = validateRequiredNumber(
        values.currentAmount,
        "El monto actual"
    );

    if (currentAmountError) {
        errors.currentAmount = currentAmountError;
    } else if (Number(values.currentAmount) < 0) {
        errors.currentAmount = "El monto actual no puede ser negativo.";
    }

    return errors;
}

export function SavingGoalForm({
    mode,
    workspaceId,
    initialValues,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: SavingGoalFormProps) {
    const [values, setValues] = React.useState<SavingGoalFormValues>(initialValues);
    const [errors, setErrors] = React.useState<SavingGoalFormErrors>({});

    React.useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const handleTextChange =
        (field: SavingGoalFormTextField) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
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

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "active" ||
            value === "completed" ||
            value === "paused" ||
            value === "cancelled"
        ) {
            setValues((currentValues) => ({
                ...currentValues,
                status: value,
            }));
        }
    };

    const handlePriorityChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "" ||
            value === "low" ||
            value === "medium" ||
            value === "high"
        ) {
            setValues((currentValues) => ({
                ...currentValues,
                priority: value,
            }));
        }
    };

    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "emergency_fund" ||
            value === "vacation" ||
            value === "education" ||
            value === "home" ||
            value === "car" ||
            value === "business" ||
            value === "retirement" ||
            value === "custom"
        ) {
            setValues((currentValues) => ({
                ...currentValues,
                category: value,
            }));
        }
    };

    const handleAccountChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            accountId: value,
        }));
    };

    const handleMemberChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            memberId: value,
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

        const nextErrors = validateSavingGoalForm(values);
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
                                {mode === "create"
                                    ? "Nueva meta de ahorro"
                                    : "Editar meta de ahorro"}
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Define objetivo, monto, categoría y visibilidad de la meta.
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

                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth error={Boolean(errors.category)}>
                                    <InputLabel id="saving-goal-category-label">
                                        Categoría
                                    </InputLabel>
                                    <Select
                                        labelId="saving-goal-category-label"
                                        label="Categoría"
                                        value={values.category}
                                        onChange={handleCategoryChange}
                                    >
                                        <MenuItem value="emergency_fund">
                                            {getSavingsGoalCategoryLabel("emergency_fund")}
                                        </MenuItem>
                                        <MenuItem value="vacation">
                                            {getSavingsGoalCategoryLabel("vacation")}
                                        </MenuItem>
                                        <MenuItem value="education">
                                            {getSavingsGoalCategoryLabel("education")}
                                        </MenuItem>
                                        <MenuItem value="home">
                                            {getSavingsGoalCategoryLabel("home")}
                                        </MenuItem>
                                        <MenuItem value="car">
                                            {getSavingsGoalCategoryLabel("car")}
                                        </MenuItem>
                                        <MenuItem value="business">
                                            {getSavingsGoalCategoryLabel("business")}
                                        </MenuItem>
                                        <MenuItem value="retirement">
                                            {getSavingsGoalCategoryLabel("retirement")}
                                        </MenuItem>
                                        <MenuItem value="custom">
                                            {getSavingsGoalCategoryLabel("custom")}
                                        </MenuItem>
                                    </Select>

                                    {errors.category ? (
                                        <FormHelperText>{errors.category}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Descripción"
                                    value={values.description}
                                    onChange={handleTextChange("description")}
                                    multiline
                                    minRows={2}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Monto meta"
                                    value={values.targetAmount}
                                    onChange={handleTextChange("targetAmount")}
                                    error={Boolean(errors.targetAmount)}
                                    helperText={errors.targetAmount}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Monto actual"
                                    value={values.currentAmount}
                                    onChange={handleTextChange("currentAmount")}
                                    error={Boolean(errors.currentAmount)}
                                    helperText={errors.currentAmount}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth error={Boolean(errors.currency)}>
                                    <InputLabel id="saving-goal-currency-label">
                                        Moneda
                                    </InputLabel>
                                    <Select
                                        labelId="saving-goal-currency-label"
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

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Fecha meta"
                                    type="date"
                                    value={values.targetDate}
                                    onChange={handleTextChange("targetDate")}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth error={Boolean(errors.status)}>
                                    <InputLabel id="saving-goal-status-label">
                                        Estado
                                    </InputLabel>
                                    <Select
                                        labelId="saving-goal-status-label"
                                        label="Estado"
                                        value={values.status}
                                        onChange={handleStatusChange}
                                    >
                                        <MenuItem value="active">
                                            {getSavingsGoalStatusLabel("active")}
                                        </MenuItem>
                                        <MenuItem value="completed">
                                            {getSavingsGoalStatusLabel("completed")}
                                        </MenuItem>
                                        <MenuItem value="paused">
                                            {getSavingsGoalStatusLabel("paused")}
                                        </MenuItem>
                                        <MenuItem value="cancelled">
                                            {getSavingsGoalStatusLabel("cancelled")}
                                        </MenuItem>
                                    </Select>

                                    {errors.status ? (
                                        <FormHelperText>{errors.status}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="saving-goal-priority-label">
                                        Prioridad
                                    </InputLabel>
                                    <Select
                                        labelId="saving-goal-priority-label"
                                        label="Prioridad"
                                        value={values.priority}
                                        onChange={handlePriorityChange}
                                    >
                                        <MenuItem value="">
                                            <em>Sin prioridad</em>
                                        </MenuItem>
                                        <MenuItem value="low">
                                            {getSavingsGoalPriorityLabel("low")}
                                        </MenuItem>
                                        <MenuItem value="medium">
                                            {getSavingsGoalPriorityLabel("medium")}
                                        </MenuItem>
                                        <MenuItem value="high">
                                            {getSavingsGoalPriorityLabel("high")}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceAccountSelect
                                    workspaceId={workspaceId}
                                    value={values.accountId}
                                    onChange={handleAccountChange}
                                    label="Cuenta"
                                    helperText="Opcional. Cuenta vinculada a la meta."
                                    allowEmpty
                                    emptyOptionLabel="Sin cuenta específica"
                                    disabled={isSubmitting}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceMemberSelect
                                    workspaceId={workspaceId}
                                    value={values.memberId}
                                    onChange={handleMemberChange}
                                    label="Miembro"
                                    helperText="Opcional. Miembro relacionado con la meta."
                                    allowEmpty
                                    emptyOptionLabel="Sin miembro específico"
                                    disabled={isSubmitting}
                                />
                            </Grid>
                        </Grid>

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
                                {mode === "create"
                                    ? "Crear meta"
                                    : "Guardar cambios"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
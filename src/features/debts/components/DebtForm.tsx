// src/features/debts/components/DebtForm.tsx

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

import type { CurrencyCode } from "../../../shared/types/common.types";
import { WorkspaceMemberSelect } from "../../components/WorkspaceMemberSelect";
import type { DebtStatus, DebtType } from "../types/debt.types";

export type DebtAccountOption = {
    id: string;
    label: string;
    secondaryLabel: string;
    currency: CurrencyCode;
};

export type DebtCurrencyOption = {
    value: CurrencyCode;
    label: string;
};

type DebtFormCurrency = CurrencyCode | "";

export type DebtFormValues = {
    memberId: string;
    relatedAccountId: string;
    type: DebtType;
    personName: string;
    personContact: string;
    originalAmount: string;
    remainingAmount: string;
    currency: DebtFormCurrency;
    description: string;
    startDate: string;
    dueDate: string;
    status: DebtStatus;
    notes: string;
    isVisible: boolean;
};

type DebtFormField =
    | "type"
    | "personName"
    | "originalAmount"
    | "remainingAmount"
    | "currency"
    | "description"
    | "startDate"
    | "dueDate";

type DebtFormErrors = Partial<Record<DebtFormField, string>>;

type DebtFormTextField =
    | "personName"
    | "personContact"
    | "originalAmount"
    | "remainingAmount"
    | "description"
    | "startDate"
    | "dueDate"
    | "notes";

type DebtFormProps = {
    mode: "create" | "edit";
    workspaceId: string | null;
    initialValues: DebtFormValues;
    accountOptions: DebtAccountOption[];
    currencyOptions: DebtCurrencyOption[];
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: DebtFormValues) => void;
    onCancel: () => void;
};

function validateRequiredAmount(
    value: string,
    label: string,
    allowZero: boolean
): string | null {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return `${label} es obligatorio.`;
    }

    const numericValue = Number(trimmedValue);

    if (Number.isNaN(numericValue)) {
        return `${label} debe ser un número válido.`;
    }

    if (allowZero) {
        if (numericValue < 0) {
            return `${label} no puede ser negativo.`;
        }
    } else if (numericValue <= 0) {
        return `${label} debe ser mayor a cero.`;
    }

    return null;
}

function validateDebtForm(values: DebtFormValues): DebtFormErrors {
    const errors: DebtFormErrors = {};

    if (!values.type) {
        errors.type = "El tipo es obligatorio.";
    }

    if (!values.personName.trim()) {
        errors.personName = "El nombre de la persona es obligatorio.";
    }

    const originalAmountError = validateRequiredAmount(
        values.originalAmount,
        "El monto original",
        false
    );
    if (originalAmountError) {
        errors.originalAmount = originalAmountError;
    }

    const remainingAmountError = validateRequiredAmount(
        values.remainingAmount,
        "El monto restante",
        true
    );
    if (remainingAmountError) {
        errors.remainingAmount = remainingAmountError;
    }

    if (!originalAmountError && !remainingAmountError) {
        const originalAmount = Number(values.originalAmount);
        const remainingAmount = Number(values.remainingAmount);

        if (remainingAmount > originalAmount) {
            errors.remainingAmount =
                "El monto restante no puede ser mayor al monto original.";
        }
    }

    if (values.currency === "") {
        errors.currency = "La moneda es obligatoria.";
    }

    if (!values.description.trim()) {
        errors.description = "La descripción es obligatoria.";
    }

    if (!values.startDate.trim()) {
        errors.startDate = "La fecha de inicio es obligatoria.";
    }

    if (values.dueDate.trim() && values.startDate.trim()) {
        const startDate = new Date(values.startDate);
        const dueDate = new Date(values.dueDate);

        if (dueDate.getTime() < startDate.getTime()) {
            errors.dueDate =
                "La fecha de vencimiento no puede ser anterior a la fecha de inicio.";
        }
    }

    return errors;
}

export function DebtForm({
    mode,
    workspaceId,
    initialValues,
    accountOptions,
    currencyOptions,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: DebtFormProps) {
    const [values, setValues] = React.useState<DebtFormValues>(initialValues);
    const [errors, setErrors] = React.useState<DebtFormErrors>({});

    React.useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const handleTextChange =
        (field: DebtFormTextField) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
            };

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "owed_by_me" || value === "owed_to_me") {
            setValues((currentValues) => ({
                ...currentValues,
                type: value,
            }));
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "active" ||
            value === "paid" ||
            value === "overdue" ||
            value === "cancelled"
        ) {
            setValues((currentValues) => ({
                ...currentValues,
                status: value,
            }));
        }
    };

    const handleCurrencyChange = (event: SelectChangeEvent<DebtFormCurrency>) => {
        setValues((currentValues) => ({
            ...currentValues,
            currency: event.target.value,
        }));
    };

    const handleRelatedAccountChange = (event: SelectChangeEvent<string>) => {
        const nextAccountId = event.target.value;
        const selectedAccount =
            accountOptions.find((account) => account.id === nextAccountId) ?? null;

        setValues((currentValues) => ({
            ...currentValues,
            relatedAccountId: nextAccountId,
            currency: selectedAccount ? selectedAccount.currency : currentValues.currency,
        }));
    };

    const handleMemberChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            memberId: value,
        }));
    };

    const handleVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues((currentValues) => ({
            ...currentValues,
            isVisible: event.target.checked,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateDebtForm(values);
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
                                {mode === "create" ? "Nueva deuda" : "Editar deuda"}
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Registra deudas por pagar o por cobrar, vinculándolas
                                opcionalmente a un miembro y una cuenta del workspace.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? (
                            <Alert severity="error">{submitErrorMessage}</Alert>
                        ) : null}

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth error={Boolean(errors.type)}>
                                    <InputLabel id="debt-type-label">Tipo</InputLabel>
                                    <Select
                                        labelId="debt-type-label"
                                        label="Tipo"
                                        value={values.type}
                                        onChange={handleTypeChange}
                                    >
                                        <MenuItem value="owed_by_me">Debo</MenuItem>
                                        <MenuItem value="owed_to_me">Me deben</MenuItem>
                                    </Select>

                                    {errors.type ? (
                                        <FormHelperText>{errors.type}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="debt-status-label">Estado</InputLabel>
                                    <Select
                                        labelId="debt-status-label"
                                        label="Estado"
                                        value={values.status}
                                        onChange={handleStatusChange}
                                    >
                                        <MenuItem value="active">Activa</MenuItem>
                                        <MenuItem value="paid">Pagada</MenuItem>
                                        <MenuItem value="overdue">Vencida</MenuItem>
                                        <MenuItem value="cancelled">Cancelada</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceMemberSelect
                                    workspaceId={workspaceId}
                                    value={values.memberId}
                                    onChange={handleMemberChange}
                                    label="Miembro"
                                    helperText="Opcional. Déjalo vacío si no aplica a un miembro específico."
                                    disabled={isSubmitting}
                                    allowEmpty
                                    emptyOptionLabel="Sin miembro específico"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth disabled={isSubmitting}>
                                    <InputLabel id="debt-account-label">
                                        Cuenta relacionada
                                    </InputLabel>
                                    <Select
                                        labelId="debt-account-label"
                                        label="Cuenta relacionada"
                                        value={values.relatedAccountId}
                                        onChange={handleRelatedAccountChange}
                                    >
                                        <MenuItem value="">Sin cuenta relacionada</MenuItem>

                                        {accountOptions.map((option) => (
                                            <MenuItem key={option.id} value={option.id}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    <FormHelperText>
                                        Opcional. Si eliges una cuenta, la moneda se rellena con su moneda.
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Nombre de la persona"
                                    value={values.personName}
                                    onChange={handleTextChange("personName")}
                                    error={Boolean(errors.personName)}
                                    helperText={errors.personName}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Contacto"
                                    value={values.personContact}
                                    onChange={handleTextChange("personContact")}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Monto original"
                                    value={values.originalAmount}
                                    onChange={handleTextChange("originalAmount")}
                                    error={Boolean(errors.originalAmount)}
                                    helperText={errors.originalAmount}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Monto restante"
                                    value={values.remainingAmount}
                                    onChange={handleTextChange("remainingAmount")}
                                    error={Boolean(errors.remainingAmount)}
                                    helperText={errors.remainingAmount}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth error={Boolean(errors.currency)}>
                                    <InputLabel id="debt-currency-label">Moneda</InputLabel>
                                    <Select
                                        labelId="debt-currency-label"
                                        label="Moneda"
                                        value={values.currency}
                                        onChange={handleCurrencyChange}
                                    >
                                        {currencyOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    <FormHelperText>
                                        {errors.currency ??
                                            "Se toma de las monedas disponibles en las cuentas del workspace."}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Nombre de la Deuda"
                                    value={values.description}
                                    onChange={handleTextChange("description")}
                                    error={Boolean(errors.description)}
                                    helperText={errors.description}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Fecha de inicio"
                                    type="date"
                                    value={values.startDate}
                                    onChange={handleTextChange("startDate")}
                                    error={Boolean(errors.startDate)}
                                    helperText={errors.startDate}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Fecha de vencimiento"
                                    type="date"
                                    value={values.dueDate}
                                    onChange={handleTextChange("dueDate")}
                                    error={Boolean(errors.dueDate)}
                                    helperText={
                                        errors.dueDate ??
                                        "Opcional. Déjala vacía si no hay vencimiento."
                                    }
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Notas"
                                    value={values.notes}
                                    onChange={handleTextChange("notes")}
                                    multiline
                                    minRows={3}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={values.isVisible}
                                    onChange={handleVisibilityChange}
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
                                {mode === "create" ? "Crear deuda" : "Guardar cambios"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
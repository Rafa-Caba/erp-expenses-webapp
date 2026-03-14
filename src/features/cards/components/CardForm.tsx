// src/features/cards/components/CardForm.tsx

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

import { WorkspaceMemberSelect } from "../../components/WorkspaceMemberSelect";
import type { CardType } from "../types/card.types";

export type CardAccountOption = {
    id: string;
    label: string;
    secondaryLabel: string;
};

export type CardFormValues = {
    accountId: string;
    holderMemberId: string;
    name: string;
    type: CardType;
    brand: string;
    last4: string;
    creditLimit: string;
    closingDay: string;
    dueDay: string;
    notes: string;
    isActive: boolean;
    isArchived: boolean;
    isVisible: boolean;
};

type CardFormField =
    | "accountId"
    | "name"
    | "type"
    | "last4"
    | "creditLimit"
    | "closingDay"
    | "dueDay";

type CardFormErrors = Partial<Record<CardFormField, string>>;

type CardFormTextField =
    | "name"
    | "brand"
    | "last4"
    | "creditLimit"
    | "closingDay"
    | "dueDay"
    | "notes";

type CardFormProps = {
    mode: "create" | "edit";
    workspaceId: string | null;
    initialValues: CardFormValues;
    accountOptions: CardAccountOption[];
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: CardFormValues) => void;
    onCancel: () => void;
};

function validateLast4(value: string): string | null {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return "Los últimos 4 son obligatorios.";
    }

    if (!/^\d{4}$/.test(trimmedValue)) {
        return "Los últimos 4 deben ser exactamente 4 dígitos.";
    }

    return null;
}

function validateOptionalNumberField(value: string, label: string): string | null {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return null;
    }

    const numericValue = Number(trimmedValue);

    if (Number.isNaN(numericValue)) {
        return `${label} debe ser un número válido.`;
    }

    if (numericValue < 0) {
        return `${label} no puede ser negativo.`;
    }

    return null;
}

function validateOptionalDayField(value: string, label: string): string | null {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return null;
    }

    const numericValue = Number(trimmedValue);

    if (!Number.isInteger(numericValue)) {
        return `${label} debe ser un número entero.`;
    }

    if (numericValue < 1 || numericValue > 31) {
        return `${label} debe estar entre 1 y 31.`;
    }

    return null;
}

function validateCardForm(values: CardFormValues): CardFormErrors {
    const errors: CardFormErrors = {};

    if (!values.accountId.trim()) {
        errors.accountId = "La cuenta es obligatoria.";
    }

    if (!values.name.trim()) {
        errors.name = "El nombre es obligatorio.";
    }

    if (!values.type) {
        errors.type = "El tipo es obligatorio.";
    }

    const last4Error = validateLast4(values.last4);
    if (last4Error) {
        errors.last4 = last4Error;
    }

    if (values.type === "credit") {
        const creditLimitError = validateOptionalNumberField(values.creditLimit, "El límite");
        if (creditLimitError) {
            errors.creditLimit = creditLimitError;
        }

        const closingDayError = validateOptionalDayField(values.closingDay, "El día de corte");
        if (closingDayError) {
            errors.closingDay = closingDayError;
        }

        const dueDayError = validateOptionalDayField(values.dueDay, "El día de pago");
        if (dueDayError) {
            errors.dueDay = dueDayError;
        }
    }

    return errors;
}

export function CardForm({
    mode,
    workspaceId,
    initialValues,
    accountOptions,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: CardFormProps) {
    const [values, setValues] = React.useState<CardFormValues>(initialValues);
    const [errors, setErrors] = React.useState<CardFormErrors>({});

    React.useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const handleTextChange =
        (field: CardFormTextField) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
            };

    const handleAccountChange = (event: SelectChangeEvent<string>) => {
        setValues((currentValues) => ({
            ...currentValues,
            accountId: event.target.value,
        }));
    };

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "debit" || value === "credit") {
            setValues((currentValues) => ({
                ...currentValues,
                type: value,
            }));
        }
    };

    const handleHolderMemberChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            holderMemberId: value,
        }));
    };

    const handleCheckboxChange =
        (field: "isActive" | "isArchived" | "isVisible") =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.checked,
                }));
            };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateCardForm(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        onSubmit(values);
    };

    const showCreditFields = values.type === "credit";

    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {mode === "create" ? "Nueva tarjeta" : "Editar tarjeta"}
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Define la cuenta asociada, datos básicos y configuración de la
                                tarjeta dentro del workspace.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? (
                            <Alert severity="error">{submitErrorMessage}</Alert>
                        ) : null}

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth error={Boolean(errors.accountId)}>
                                    <InputLabel id="card-account-label">Cuenta</InputLabel>
                                    <Select
                                        labelId="card-account-label"
                                        label="Cuenta"
                                        value={values.accountId}
                                        onChange={handleAccountChange}
                                    >
                                        {accountOptions.map((option) => (
                                            <MenuItem key={option.id} value={option.id}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>
                                        {errors.accountId ??
                                            "Selecciona la cuenta a la que pertenece esta tarjeta."}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth error={Boolean(errors.type)}>
                                    <InputLabel id="card-type-label">Tipo</InputLabel>
                                    <Select
                                        labelId="card-type-label"
                                        label="Tipo"
                                        value={values.type}
                                        onChange={handleTypeChange}
                                    >
                                        <MenuItem value="debit">Débito</MenuItem>
                                        <MenuItem value="credit">Crédito</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors.type}</FormHelperText>
                                </FormControl>
                            </Grid>

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
                                <TextField
                                    label="Marca"
                                    value={values.brand}
                                    onChange={handleTextChange("brand")}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Últimos 4"
                                    value={values.last4}
                                    onChange={handleTextChange("last4")}
                                    error={Boolean(errors.last4)}
                                    helperText={errors.last4 ?? "Ejemplo: 1234"}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceMemberSelect
                                    workspaceId={workspaceId}
                                    value={values.holderMemberId}
                                    onChange={handleHolderMemberChange}
                                    label="Miembro titular (opcional)"
                                    helperText="Opcional. Déjalo vacío si la tarjeta no está asociada a un miembro específico."
                                    disabled={isSubmitting}
                                    allowEmpty
                                    emptyOptionLabel="Sin miembro específico"
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Notas"
                                    value={values.notes}
                                    onChange={handleTextChange("notes")}
                                    fullWidth
                                />
                            </Grid>

                            {showCreditFields ? (
                                <>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Límite de crédito"
                                            value={values.creditLimit}
                                            onChange={handleTextChange("creditLimit")}
                                            error={Boolean(errors.creditLimit)}
                                            helperText={errors.creditLimit}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Día de corte"
                                            value={values.closingDay}
                                            onChange={handleTextChange("closingDay")}
                                            error={Boolean(errors.closingDay)}
                                            helperText={errors.closingDay}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Día de pago"
                                            value={values.dueDay}
                                            onChange={handleTextChange("dueDay")}
                                            error={Boolean(errors.dueDay)}
                                            helperText={errors.dueDay}
                                            fullWidth
                                        />
                                    </Grid>
                                </>
                            ) : null}
                        </Grid>

                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} flexWrap="wrap">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={values.isVisible}
                                        onChange={handleCheckboxChange("isVisible")}
                                    />
                                }
                                label="Visible"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={values.isActive}
                                        onChange={handleCheckboxChange("isActive")}
                                    />
                                }
                                label="Activa"
                            />

                            {mode === "edit" ? (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.isArchived}
                                            onChange={handleCheckboxChange("isArchived")}
                                        />
                                    }
                                    label="Archivada"
                                />
                            ) : null}
                        </Stack>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                                Cancelar
                            </Button>

                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {mode === "create" ? "Crear tarjeta" : "Guardar cambios"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
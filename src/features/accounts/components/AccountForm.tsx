// src/features/accounts/components/AccountForm.tsx

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
import type { CurrencyCode } from "../../../shared/types/common.types";
import type { AccountType } from "../types/account.types";

export type AccountFormValues = {
    ownerMemberId: string;
    name: string;
    type: AccountType;
    bankName: string;
    accountNumberMasked: string;
    currency: CurrencyCode;
    initialBalance: string;
    currentBalance: string;
    creditLimit: string;
    statementClosingDay: string;
    paymentDueDay: string;
    notes: string;
    isActive: boolean;
    isArchived: boolean;
    isVisible: boolean;
};

type AccountFormField =
    | "name"
    | "type"
    | "currency"
    | "initialBalance"
    | "currentBalance";

type AccountFormErrors = Partial<Record<AccountFormField, string>>;

type AccountFormTextField =
    | "name"
    | "bankName"
    | "accountNumberMasked"
    | "initialBalance"
    | "currentBalance"
    | "creditLimit"
    | "statementClosingDay"
    | "paymentDueDay"
    | "notes";

type AccountFormProps = {
    mode: "create" | "edit";
    workspaceId: string | null;
    initialValues: AccountFormValues;
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: AccountFormValues) => void;
    onCancel: () => void;
};

function validateNumberField(value: string, label: string): string | null {
    if (!value.trim()) {
        return `${label} es obligatorio.`;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return `${label} debe ser un número válido.`;
    }

    return null;
}

function validateAccountForm(values: AccountFormValues): AccountFormErrors {
    const errors: AccountFormErrors = {};

    if (!values.name.trim()) {
        errors.name = "El nombre es obligatorio.";
    }

    if (!values.type) {
        errors.type = "El tipo es obligatorio.";
    }

    if (!values.currency) {
        errors.currency = "La moneda es obligatoria.";
    }

    const initialBalanceError = validateNumberField(values.initialBalance, "El saldo inicial");
    if (initialBalanceError) {
        errors.initialBalance = initialBalanceError;
    }

    const currentBalanceError = validateNumberField(values.currentBalance, "El saldo actual");
    if (currentBalanceError) {
        errors.currentBalance = currentBalanceError;
    }

    return errors;
}

export function AccountForm({
    mode,
    workspaceId,
    initialValues,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: AccountFormProps) {
    const [values, setValues] = React.useState<AccountFormValues>(initialValues);
    const [errors, setErrors] = React.useState<AccountFormErrors>({});

    React.useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const handleTextChange =
        (field: AccountFormTextField) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
            };

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "cash" ||
            value === "bank" ||
            value === "wallet" ||
            value === "savings" ||
            value === "credit"
        ) {
            setValues((currentValues) => ({
                ...currentValues,
                type: value,
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

    const handleOwnerMemberChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            ownerMemberId: value,
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

        const nextErrors = validateAccountForm(values);
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
                                {mode === "create" ? "Nueva cuenta" : "Editar cuenta"}
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Define el tipo de cuenta, saldo, datos bancarios y comportamiento dentro del workspace.
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
                                <FormControl fullWidth error={Boolean(errors.type)}>
                                    <InputLabel id="account-type-label">Tipo</InputLabel>
                                    <Select
                                        labelId="account-type-label"
                                        label="Tipo"
                                        value={values.type}
                                        onChange={handleTypeChange}
                                    >
                                        <MenuItem value="cash">Efectivo</MenuItem>
                                        <MenuItem value="bank">Banco</MenuItem>
                                        <MenuItem value="wallet">Wallet</MenuItem>
                                        <MenuItem value="savings">Ahorro</MenuItem>
                                        <MenuItem value="credit">Crédito</MenuItem>
                                    </Select>
                                    {errors.type ? (
                                        <FormHelperText>{errors.type}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Banco"
                                    value={values.bankName}
                                    onChange={handleTextChange("bankName")}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Número enmascarado / últimos dígitos"
                                    value={values.accountNumberMasked}
                                    onChange={handleTextChange("accountNumberMasked")}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth error={Boolean(errors.currency)}>
                                    <InputLabel id="account-currency-label">Moneda</InputLabel>
                                    <Select
                                        labelId="account-currency-label"
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
                                    label="Saldo inicial"
                                    value={values.initialBalance}
                                    onChange={handleTextChange("initialBalance")}
                                    error={Boolean(errors.initialBalance)}
                                    helperText={errors.initialBalance}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Saldo actual"
                                    value={values.currentBalance}
                                    onChange={handleTextChange("currentBalance")}
                                    error={Boolean(errors.currentBalance)}
                                    helperText={errors.currentBalance}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceMemberSelect
                                    workspaceId={workspaceId}
                                    value={values.ownerMemberId}
                                    onChange={handleOwnerMemberChange}
                                    label="Miembro titular (opcional)"
                                    helperText="Opcional. Déjalo vacío si la cuenta no pertenece a un miembro específico."
                                    disabled={isSubmitting}
                                    allowEmpty
                                    emptyOptionLabel="Sin miembro específico"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
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
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Día de corte"
                                            value={values.statementClosingDay}
                                            onChange={handleTextChange("statementClosingDay")}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Día de pago"
                                            value={values.paymentDueDay}
                                            onChange={handleTextChange("paymentDueDay")}
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
                                {mode === "create" ? "Crear cuenta" : "Guardar cambios"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
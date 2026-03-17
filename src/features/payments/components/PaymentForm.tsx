// src/features/payments/components/PaymentForm.tsx

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
import { WorkspaceCardSelect } from "../../components/WorkspaceCardSelect";
import { WorkspaceDebtSelect } from "../../components/WorkspaceDebtSelect";
import { WorkspaceMemberSelect } from "../../components/WorkspaceMemberSelect";
import type { CurrencyCode } from "../../../shared/types/common.types";
import type { PaymentMethod, PaymentStatus } from "../types/payment.types";

type PaymentSourceType = "none" | "account" | "card";

export type PaymentFormValues = {
    debtId: string;
    accountId: string;
    cardId: string;
    memberId: string;
    transactionId: string;
    amount: string;
    currency: CurrencyCode;
    paymentDate: string;
    method: PaymentMethod | "";
    reference: string;
    notes: string;
    status: PaymentStatus;
    isVisible: boolean;
};

type PaymentFormField =
    | "debtId"
    | "accountId"
    | "cardId"
    | "amount"
    | "currency"
    | "paymentDate";

type PaymentFormErrors = Partial<Record<PaymentFormField, string>>;

type PaymentFormTextField =
    | "transactionId"
    | "amount"
    | "paymentDate"
    | "reference"
    | "notes";

type PaymentFormProps = {
    workspaceId: string | null;
    mode: "create" | "edit";
    initialValues: PaymentFormValues;
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: PaymentFormValues) => void;
    onCancel: () => void;
};

function resolvePaymentSourceType(values: PaymentFormValues): PaymentSourceType {
    if (values.accountId.trim()) {
        return "account";
    }

    if (values.cardId.trim()) {
        return "card";
    }

    return "none";
}

function validateAmount(value: string): string | null {
    if (!value.trim()) {
        return "El monto es obligatorio.";
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return "El monto debe ser numérico.";
    }

    if (numericValue <= 0) {
        return "El monto debe ser mayor a 0.";
    }

    return null;
}

function validatePaymentForm(
    values: PaymentFormValues,
    sourceType: PaymentSourceType
): PaymentFormErrors {
    const errors: PaymentFormErrors = {};

    if (!values.debtId.trim()) {
        errors.debtId = "La deuda es obligatoria.";
    }

    const amountError = validateAmount(values.amount);
    if (amountError) {
        errors.amount = amountError;
    }

    if (!values.currency) {
        errors.currency = "La moneda es obligatoria.";
    }

    if (!values.paymentDate.trim()) {
        errors.paymentDate = "La fecha de pago es obligatoria.";
    }

    if (sourceType === "account" && !values.accountId.trim()) {
        errors.accountId = "La cuenta es obligatoria cuando eliges cuenta.";
    }

    if (sourceType === "card" && !values.cardId.trim()) {
        errors.cardId = "La tarjeta es obligatoria cuando eliges tarjeta.";
    }

    return errors;
}

export function PaymentForm({
    workspaceId,
    mode,
    initialValues,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: PaymentFormProps) {
    const [values, setValues] = React.useState<PaymentFormValues>(initialValues);
    const [errors, setErrors] = React.useState<PaymentFormErrors>({});
    const [sourceType, setSourceType] = React.useState<PaymentSourceType>(
        resolvePaymentSourceType(initialValues)
    );

    React.useEffect(() => {
        setValues(initialValues);
        setSourceType(resolvePaymentSourceType(initialValues));
    }, [initialValues]);

    const handleTextChange =
        (field: PaymentFormTextField) =>
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

    const handleMethodChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "" ||
            value === "cash" ||
            value === "bank_transfer" ||
            value === "card" ||
            value === "check" ||
            value === "other"
        ) {
            setValues((currentValues) => ({
                ...currentValues,
                method: value,
            }));
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "pending" ||
            value === "completed" ||
            value === "failed" ||
            value === "cancelled"
        ) {
            setValues((currentValues) => ({
                ...currentValues,
                status: value,
            }));
        }
    };

    const handleSourceTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "none" || value === "account" || value === "card") {
            setSourceType(value);

            setValues((currentValues) => ({
                ...currentValues,
                accountId: value === "account" ? currentValues.accountId : "",
                cardId: value === "card" ? currentValues.cardId : "",
            }));
        }
    };

    const handleVisibleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues((currentValues) => ({
            ...currentValues,
            isVisible: event.target.checked,
        }));
    };

    const handleDebtChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            debtId: value,
        }));
    };

    const handleMemberChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            memberId: value,
        }));
    };

    const handleAccountChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            accountId: value,
        }));
    };

    const handleCardChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            cardId: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validatePaymentForm(values, sourceType);
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
                                {mode === "create" ? "Nuevo pago" : "Editar pago"}
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Registra pagos asociados a deudas. El backend no permite enviar
                                cuenta y tarjeta al mismo tiempo, por eso aquí eliges una sola
                                fuente de pago.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? (
                            <Alert severity="error">{submitErrorMessage}</Alert>
                        ) : null}

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceDebtSelect
                                    workspaceId={workspaceId}
                                    value={values.debtId}
                                    onChange={handleDebtChange}
                                    label="Deuda"
                                    helperText="Selecciona la deuda relacionada con este pago."
                                    error={Boolean(errors.debtId)}
                                    allowEmpty={false}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Monto"
                                    value={values.amount}
                                    onChange={handleTextChange("amount")}
                                    error={Boolean(errors.amount)}
                                    helperText={errors.amount}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth error={Boolean(errors.currency)}>
                                    <InputLabel id="payment-currency-label">Moneda</InputLabel>
                                    <Select
                                        labelId="payment-currency-label"
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
                                    label="Fecha de pago"
                                    type="date"
                                    value={values.paymentDate}
                                    onChange={handleTextChange("paymentDate")}
                                    error={Boolean(errors.paymentDate)}
                                    helperText={errors.paymentDate}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="payment-method-label">Método</InputLabel>
                                    <Select
                                        labelId="payment-method-label"
                                        label="Método"
                                        value={values.method}
                                        onChange={handleMethodChange}
                                    >
                                        <MenuItem value="">
                                            <em>Sin método</em>
                                        </MenuItem>
                                        <MenuItem value="cash">Efectivo</MenuItem>
                                        <MenuItem value="bank_transfer">Transferencia</MenuItem>
                                        <MenuItem value="card">Tarjeta</MenuItem>
                                        <MenuItem value="check">Cheque</MenuItem>
                                        <MenuItem value="other">Otro</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="payment-status-label">Estatus</InputLabel>
                                    <Select
                                        labelId="payment-status-label"
                                        label="Estatus"
                                        value={values.status}
                                        onChange={handleStatusChange}
                                    >
                                        <MenuItem value="pending">Pendiente</MenuItem>
                                        <MenuItem value="completed">Completado</MenuItem>
                                        <MenuItem value="failed">Fallido</MenuItem>
                                        <MenuItem value="cancelled">Cancelado</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="payment-source-type-label">
                                        Fuente del pago
                                    </InputLabel>
                                    <Select
                                        labelId="payment-source-type-label"
                                        label="Fuente del pago"
                                        value={sourceType}
                                        onChange={handleSourceTypeChange}
                                    >
                                        <MenuItem value="none">Sin cuenta/tarjeta</MenuItem>
                                        <MenuItem value="account">Cuenta</MenuItem>
                                        <MenuItem value="card">Tarjeta</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {sourceType === "account" ? (
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <WorkspaceAccountSelect
                                        workspaceId={workspaceId}
                                        value={values.accountId}
                                        onChange={handleAccountChange}
                                        label="Cuenta"
                                        helperText="Selecciona la cuenta desde donde salió el pago."
                                        error={Boolean(errors.accountId)}
                                        allowEmpty={false}
                                    />
                                </Grid>
                            ) : null}

                            {sourceType === "card" ? (
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <WorkspaceCardSelect
                                        workspaceId={workspaceId}
                                        value={values.cardId}
                                        onChange={handleCardChange}
                                        label="Tarjeta"
                                        helperText="Selecciona la tarjeta usada para este pago."
                                        error={Boolean(errors.cardId)}
                                        allowEmpty={false}
                                    />
                                </Grid>
                            ) : null}

                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceMemberSelect
                                    workspaceId={workspaceId}
                                    value={values.memberId}
                                    onChange={handleMemberChange}
                                    label="Miembro"
                                    helperText="Opcional. Miembro relacionado con el pago."
                                    allowEmpty
                                    emptyOptionLabel="Sin miembro específico"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Transaction ID"
                                    value={values.transactionId}
                                    onChange={handleTextChange("transactionId")}
                                    helperText="Opcional. Se queda como texto mientras Transactions aún no tenga select."
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Referencia"
                                    value={values.reference}
                                    onChange={handleTextChange("reference")}
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
                                    minRows={1}
                                />
                            </Grid>
                        </Grid>

                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} flexWrap="wrap">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={values.isVisible}
                                        onChange={handleVisibleChange}
                                    />
                                }
                                label="Visible"
                            />
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
                                {mode === "create" ? "Crear pago" : "Guardar cambios"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
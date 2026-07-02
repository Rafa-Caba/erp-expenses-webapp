// src/features/payments/components/PaymentForm.tsx
// Payment form for debt payments/collections.
// Fase 5 rules:
// - The selected debt determines cashflowDirection.
// - owed_by_me => out: account where money went out.
// - owed_to_me => in: account where money was received.
// - amount is the real cashflow moved.
// - principalAmount is the amount applied to reduce debt.
// - feeAmount is fees/interests/commissions and does not reduce debt.

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
import { WorkspaceTransactionSelect } from "../../components/WorkspaceTransactionSelect";
import type { DebtRecord } from "../../debts/types/debt.types";
import type {
    CashflowDirection,
    CurrencyCode,
} from "../../../shared/types/common.types";
import type { PaymentMethod, PaymentStatus } from "../types/payment.types";

type PaymentSourceType = "none" | "account" | "card";

export type PaymentFormValues = {
    debtId: string;
    accountId: string;
    cardId: string;
    memberId: string;
    transactionId: string;
    amount: string;
    principalAmount: string;
    feeAmount: string;
    cashflowDirection: CashflowDirection | "";
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
    | "principalAmount"
    | "feeAmount"
    | "currency"
    | "paymentDate";

type PaymentFormErrors = Partial<Record<PaymentFormField, string>>;

type PaymentFormTextField =
    | "amount"
    | "principalAmount"
    | "feeAmount"
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

function getDebtCashflowDirection(debt: DebtRecord | null): CashflowDirection | "" {
    if (!debt) {
        return "";
    }

    return debt.type === "owed_by_me" ? "out" : "in";
}

function getCashflowSummary(direction: CashflowDirection | ""): string {
    if (direction === "out") {
        return "Esta deuda es de tipo Debo, por eso el pago será salida de dinero.";
    }

    if (direction === "in") {
        return "Esta deuda es de tipo Me deben, por eso el pago será entrada de dinero.";
    }

    return "Selecciona una deuda para que la app determine si el movimiento es entrada o salida.";
}

function getAccountLabel(direction: CashflowDirection | ""): string {
    if (direction === "in") {
        return "Cuenta donde recibiste el dinero";
    }

    return "Cuenta desde donde salió el dinero";
}

function getAccountHelperText(direction: CashflowDirection | ""): string {
    if (direction === "in") {
        return "Cuenta donde cayó el cobro de una deuda que te debían.";
    }

    return "Cuenta desde donde pagaste una deuda propia.";
}

function roundMoney(value: number): number {
    return Number(value.toFixed(2));
}

function parseMoney(value: string): number | null {
    if (!value.trim()) {
        return null;
    }

    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : null;
}

function validatePositiveAmount(value: string, label: string): string | null {
    if (!value.trim()) {
        return `${label} es obligatorio.`;
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return `${label} debe ser numérico.`;
    }

    if (numericValue <= 0) {
        return `${label} debe ser mayor a 0.`;
    }

    return null;
}

function validateNonNegativeAmount(value: string, label: string): string | null {
    if (!value.trim()) {
        return `${label} es obligatorio.`;
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return `${label} debe ser numérico.`;
    }

    if (numericValue < 0) {
        return `${label} no puede ser menor a 0.`;
    }

    return null;
}

function validatePaymentBreakdown(values: PaymentFormValues): PaymentFormErrors {
    const errors: PaymentFormErrors = {};
    const amount = parseMoney(values.amount);
    const principalAmount = parseMoney(values.principalAmount);
    const feeAmount = parseMoney(values.feeAmount);

    const amountError = validatePositiveAmount(values.amount, "El monto total movido");
    if (amountError) {
        errors.amount = amountError;
    }

    const principalError = validateNonNegativeAmount(
        values.principalAmount,
        "El monto que reduce deuda"
    );
    if (principalError) {
        errors.principalAmount = principalError;
    }

    const feeError = validateNonNegativeAmount(
        values.feeAmount,
        "Los cargos/intereses/comisiones"
    );
    if (feeError) {
        errors.feeAmount = feeError;
    }

    if (
        amount !== null &&
        principalAmount !== null &&
        feeAmount !== null &&
        roundMoney(principalAmount + feeAmount) !== roundMoney(amount)
    ) {
        errors.principalAmount =
            "Monto que reduce deuda + cargos/intereses/comisiones debe coincidir con el monto total movido.";
        errors.feeAmount = "Revisa el desglose contra el monto total movido.";
    }

    return errors;
}

function validatePaymentForm(
    values: PaymentFormValues,
    sourceType: PaymentSourceType
): PaymentFormErrors {
    const errors: PaymentFormErrors = {
        ...validatePaymentBreakdown(values),
    };

    if (!values.debtId.trim()) {
        errors.debtId = "La deuda es obligatoria.";
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
    const [selectedDebt, setSelectedDebt] = React.useState<DebtRecord | null>(null);

    React.useEffect(() => {
        setValues(initialValues);
        setSourceType(resolvePaymentSourceType(initialValues));
    }, [initialValues]);

    const resolvedCashflowDirection =
        getDebtCashflowDirection(selectedDebt) || values.cashflowDirection;

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextAmount = event.target.value;

        setValues((currentValues) => {
            const currentPrincipalMatchesAmount =
                currentValues.principalAmount.trim().length === 0 ||
                Number(currentValues.principalAmount) === Number(currentValues.amount);

            return {
                ...currentValues,
                amount: nextAmount,
                principalAmount: currentPrincipalMatchesAmount
                    ? nextAmount
                    : currentValues.principalAmount,
                feeAmount:
                    currentValues.feeAmount.trim().length === 0
                        ? "0"
                        : currentValues.feeAmount,
            };
        });
    };

    const handleTextChange =
        (field: Exclude<PaymentFormTextField, "amount">) =>
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
            transactionId: currentValues.debtId === value ? currentValues.transactionId : "",
        }));
    };

    const handleSelectedDebtChange = React.useCallback((debt: DebtRecord | null) => {
        setSelectedDebt(debt);

        if (!debt) {
            return;
        }

        setValues((currentValues) => ({
            ...currentValues,
            cashflowDirection: getDebtCashflowDirection(debt),
        }));
    }, []);

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

    const handleTransactionChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            transactionId: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validatePaymentForm(values, sourceType);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        onSubmit({
            ...values,
            cashflowDirection: resolvedCashflowDirection,
        });
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
                                Registra pagos o cobros ligados a deudas. La deuda seleccionada
                                define si el movimiento es entrada o salida; el monto total es
                                cashflow real y solo el principal reduce la deuda.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? (
                            <Alert severity="error">{submitErrorMessage}</Alert>
                        ) : null}

                        <Alert severity="info">
                            {getCashflowSummary(resolvedCashflowDirection)}
                        </Alert>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceDebtSelect
                                    workspaceId={workspaceId}
                                    value={values.debtId}
                                    onChange={handleDebtChange}
                                    onSelectedDebtChange={handleSelectedDebtChange}
                                    label="Deuda"
                                    helperText="Selecciona la deuda relacionada con este pago o cobro."
                                    error={Boolean(errors.debtId)}
                                    allowEmpty={false}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Monto total movido"
                                    value={values.amount}
                                    onChange={handleAmountChange}
                                    error={Boolean(errors.amount)}
                                    helperText={
                                        errors.amount ??
                                        "Dinero real que salió o entró."
                                    }
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

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Monto que reduce deuda"
                                    value={values.principalAmount}
                                    onChange={handleTextChange("principalAmount")}
                                    error={Boolean(errors.principalAmount)}
                                    helperText={
                                        errors.principalAmount ??
                                        "Principal aplicado al saldo pendiente."
                                    }
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Cargos/intereses/comisiones"
                                    value={values.feeAmount}
                                    onChange={handleTextChange("feeAmount")}
                                    error={Boolean(errors.feeAmount)}
                                    helperText={
                                        errors.feeAmount ??
                                        "No reducen la deuda; ya vienen dentro del monto total."
                                    }
                                    fullWidth
                                />
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
                                        Fuente/recepción
                                    </InputLabel>
                                    <Select
                                        labelId="payment-source-type-label"
                                        label="Fuente/recepción"
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
                                        label={getAccountLabel(resolvedCashflowDirection)}
                                        helperText={getAccountHelperText(
                                            resolvedCashflowDirection
                                        )}
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
                                        label="Tarjeta usada como medio"
                                        helperText="Opcionalmente vincula la tarjeta usada como medio del pago/cobro."
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
                                <WorkspaceTransactionSelect
                                    workspaceId={workspaceId}
                                    value={values.transactionId}
                                    onChange={handleTransactionChange}
                                    label="Transacción debt_payment"
                                    helperText="Opcional. Vincula este pago con una transacción de deuda existente para la misma deuda."
                                    allowEmpty
                                    emptyOptionLabel="Sin transacción específica"
                                    typeFilter="debt_payment"
                                    debtIdFilter={values.debtId.trim() || "ALL"}
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
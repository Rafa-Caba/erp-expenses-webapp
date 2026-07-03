// src/features/transactions/components/TransactionForm.tsx
// Transaction form.
// Fase 5 rule for debt_payment:
// - Select a debt.
// - The selected debt determines cashflowDirection.
// - owed_by_me => out, account where money went out.
// - owed_to_me => in, account where money was received.
// - cardId is not required for debt_payment; the debt is the destination.
// Fase 9C:
// - Transaction-level recurrence is deprecated in the UI.
// - Recurring expenses should be handled by the Subscriptions module.

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
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { WorkspaceAccountSelect } from "../../components/WorkspaceAccountSelect";
import { WorkspaceCardSelect } from "../../components/WorkspaceCardSelect";
import { WorkspaceCategorySelect } from "../../components/WorkspaceCategorySelect";
import { WorkspaceDebtSelect } from "../../components/WorkspaceDebtSelect";
import { WorkspaceMemberSelect } from "../../components/WorkspaceMemberSelect";
import type { DebtRecord } from "../../debts/types/debt.types";
import type {
    CashflowDirection,
    CurrencyCode,
    TransactionType,
} from "../../../shared/types/common.types";
import type { TransactionStatus } from "../types/transaction.types";

type StandardSourceType = "account" | "card";

export type TransactionFormValues = {
    accountId: string;
    destinationAccountId: string;
    cardId: string;
    memberId: string;
    categoryId: string;
    debtId: string;
    cashflowDirection: CashflowDirection | "";
    type: TransactionType;
    amount: string;
    currency: CurrencyCode;
    description: string;
    merchant: string;
    transactionDate: string;
    status: TransactionStatus;
    reference: string;
    notes: string;
    isRecurring: boolean;
    recurrenceRule: string;
    isVisible: boolean;
    createdByUserId: string;
};

type TransactionFormField =
    | "accountId"
    | "destinationAccountId"
    | "cardId"
    | "memberId"
    | "categoryId"
    | "debtId"
    | "amount"
    | "description"
    | "transactionDate"
    | "createdByUserId";

type TransactionFormErrors = Partial<Record<TransactionFormField, string>>;

type TransactionFormTextField =
    | "amount"
    | "description"
    | "merchant"
    | "transactionDate"
    | "reference"
    | "notes";

type TransactionFormProps = {
    workspaceId: string | null;
    mode: "create" | "edit";
    initialValues: TransactionFormValues;
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: TransactionFormValues) => void;
    onCancel: () => void;
};

function resolveStandardSourceType(values: TransactionFormValues): StandardSourceType {
    if (values.cardId.trim()) {
        return "card";
    }

    return "account";
}

function requiresCategory(type: TransactionType): boolean {
    return type === "expense" || type === "income" || type === "adjustment";
}

function getDebtCashflowDirection(debt: DebtRecord | null): CashflowDirection | "" {
    if (!debt) {
        return "";
    }

    return debt.type === "owed_by_me" ? "out" : "in";
}

function getDebtPaymentSummary(direction: CashflowDirection | ""): string {
    if (direction === "out") {
        return "Esta transacción será salida porque la deuda seleccionada es de tipo Debo.";
    }

    if (direction === "in") {
        return "Esta transacción será entrada porque la deuda seleccionada es de tipo Me deben.";
    }

    return "Selecciona una deuda para que la app determine si el movimiento es entrada o salida.";
}

function getDebtPaymentAccountLabel(direction: CashflowDirection | ""): string {
    if (direction === "in") {
        return "Cuenta donde recibiste el dinero";
    }

    return "Cuenta desde donde salió el dinero";
}

function getDebtPaymentAccountHelperText(direction: CashflowDirection | ""): string {
    if (direction === "in") {
        return "Cuenta donde cayó el cobro de una deuda que te debían.";
    }

    return "Cuenta desde donde pagaste una deuda propia.";
}

function validateAmount(value: string): string | null {
    if (!value.trim()) {
        return "El monto es obligatorio.";
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return "El monto debe ser numérico.";
    }

    if (numericValue <= 0) {
        return "El monto debe ser mayor a 0.";
    }

    return null;
}

function validateTransactionForm(
    values: TransactionFormValues,
    sourceType: StandardSourceType,
    mode: "create" | "edit"
): TransactionFormErrors {
    const errors: TransactionFormErrors = {};

    if (!values.memberId.trim()) {
        errors.memberId = "El miembro es obligatorio.";
    }

    if (!values.description.trim()) {
        errors.description = "La descripción es obligatoria.";
    }

    const amountError = validateAmount(values.amount);
    if (amountError) {
        errors.amount = amountError;
    }

    if (!values.transactionDate.trim()) {
        errors.transactionDate = "La fecha es obligatoria.";
    }

    if (mode === "create" && !values.createdByUserId.trim()) {
        errors.createdByUserId = "El creador es obligatorio.";
    }

    if (values.type === "transfer") {
        if (!values.accountId.trim()) {
            errors.accountId = "La cuenta origen es obligatoria.";
        }

        if (!values.destinationAccountId.trim()) {
            errors.destinationAccountId = "La cuenta destino es obligatoria.";
        }

        if (
            values.accountId.trim() &&
            values.destinationAccountId.trim() &&
            values.accountId.trim() === values.destinationAccountId.trim()
        ) {
            errors.destinationAccountId =
                "La cuenta destino debe ser distinta a la cuenta origen.";
        }
    }

    if (values.type === "debt_payment") {
        if (!values.debtId.trim()) {
            errors.debtId = "La deuda es obligatoria para pagos/cobros de deuda.";
        }

        if (!values.accountId.trim()) {
            errors.accountId = "La cuenta es obligatoria para pagos/cobros de deuda.";
        }
    }

    if (
        values.type === "expense" ||
        values.type === "income" ||
        values.type === "adjustment"
    ) {
        if (sourceType === "account" && !values.accountId.trim()) {
            errors.accountId = "La cuenta es obligatoria.";
        }

        if (sourceType === "card" && !values.cardId.trim()) {
            errors.cardId = "La tarjeta es obligatoria.";
        }

        if (requiresCategory(values.type) && !values.categoryId.trim()) {
            errors.categoryId = "La categoría es obligatoria para este tipo.";
        }
    }

    return errors;
}

function clearFieldsForType(
    values: TransactionFormValues,
    type: TransactionType,
    sourceType: StandardSourceType
): TransactionFormValues {
    if (type === "transfer") {
        return {
            ...values,
            cardId: "",
            categoryId: "",
            debtId: "",
            cashflowDirection: "",
        };
    }

    if (type === "debt_payment") {
        return {
            ...values,
            destinationAccountId: "",
            cardId: "",
            categoryId: "",
        };
    }

    return {
        ...values,
        destinationAccountId: "",
        debtId: "",
        cashflowDirection: "",
        accountId: sourceType === "account" ? values.accountId : "",
        cardId: sourceType === "card" ? values.cardId : "",
    };
}

export function TransactionForm({
    workspaceId,
    mode,
    initialValues,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: TransactionFormProps) {
    const [values, setValues] = React.useState<TransactionFormValues>(initialValues);
    const [errors, setErrors] = React.useState<TransactionFormErrors>({});
    const [standardSourceType, setStandardSourceType] =
        React.useState<StandardSourceType>(resolveStandardSourceType(initialValues));
    const [selectedDebt, setSelectedDebt] = React.useState<DebtRecord | null>(null);

    React.useEffect(() => {
        setValues(initialValues);
        setStandardSourceType(resolveStandardSourceType(initialValues));
    }, [initialValues]);

    const resolvedDebtPaymentDirection =
        getDebtCashflowDirection(selectedDebt) || values.cashflowDirection;

    const handleTextChange =
        (field: TransactionFormTextField) =>
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

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "expense" ||
            value === "income" ||
            value === "debt_payment" ||
            value === "transfer" ||
            value === "adjustment"
        ) {
            const nextValues = clearFieldsForType(values, value, standardSourceType);

            setValues({
                ...nextValues,
                type: value,
            });
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "pending" || value === "posted" || value === "cancelled") {
            setValues((currentValues) => ({
                ...currentValues,
                status: value,
            }));
        }
    };

    const handleStandardSourceTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "account" || value === "card") {
            setStandardSourceType(value);

            setValues((currentValues) => ({
                ...currentValues,
                accountId: value === "account" ? currentValues.accountId : "",
                cardId: value === "card" ? currentValues.cardId : "",
            }));
        }
    };

    const handleMemberChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            memberId: value,
        }));
    };

    const handleCreatedByMemberChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            createdByUserId: value,
        }));
    };

    const handleCategoryChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            categoryId: value,
        }));
    };

    const handleDebtChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            debtId: value,
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

    const handleAccountChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            accountId: value,
        }));
    };

    const handleDestinationAccountChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            destinationAccountId: value,
        }));
    };

    const handleCardChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            cardId: value,
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

        const nextValues: TransactionFormValues = {
            ...values,
            cashflowDirection:
                values.type === "debt_payment" ? resolvedDebtPaymentDirection : "",
            isRecurring: false,
            recurrenceRule: "",
        };
        const nextErrors = validateTransactionForm(
            nextValues,
            standardSourceType,
            mode
        );

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        onSubmit(nextValues);
    };

    const showsStandardSourceSelector =
        values.type === "expense" ||
        values.type === "income" ||
        values.type === "adjustment";

    const showsCategorySelect = requiresCategory(values.type);

    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {mode === "create"
                                    ? "Nueva transacción"
                                    : "Editar transacción"}
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                El formulario ajusta fuentes y campos visibles según el tipo.
                                En pagos/cobros de deuda, la deuda seleccionada define si el
                                cashflow es entrada o salida.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? (
                            <Alert severity="error">{submitErrorMessage}</Alert>
                        ) : null}

                        {values.type === "debt_payment" ? (
                            <Alert severity="info">
                                {getDebtPaymentSummary(resolvedDebtPaymentDirection)}
                            </Alert>
                        ) : null}

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="transaction-type-label">Tipo</InputLabel>
                                    <Select
                                        labelId="transaction-type-label"
                                        label="Tipo"
                                        value={values.type}
                                        onChange={handleTypeChange}
                                    >
                                        <MenuItem value="expense">Gasto</MenuItem>
                                        <MenuItem value="income">Ingreso</MenuItem>
                                        <MenuItem value="debt_payment">Pago/cobro de deuda</MenuItem>
                                        <MenuItem value="transfer">Transferencia</MenuItem>
                                        <MenuItem value="adjustment">Ajuste</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <WorkspaceMemberSelect
                                    workspaceId={workspaceId}
                                    value={values.memberId}
                                    onChange={handleMemberChange}
                                    label="Miembro"
                                    helperText="Selecciona el miembro relacionado."
                                    allowEmpty={false}
                                    error={Boolean(errors.memberId)}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="transaction-status-label">
                                        Estatus
                                    </InputLabel>
                                    <Select
                                        labelId="transaction-status-label"
                                        label="Estatus"
                                        value={values.status}
                                        onChange={handleStatusChange}
                                    >
                                        <MenuItem value="pending">Pendiente</MenuItem>
                                        <MenuItem value="posted">Aplicada</MenuItem>
                                        <MenuItem value="cancelled">Cancelada</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Monto total movido"
                                    value={values.amount}
                                    onChange={handleTextChange("amount")}
                                    error={Boolean(errors.amount)}
                                    helperText={errors.amount}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="transaction-currency-label">
                                        Moneda
                                    </InputLabel>
                                    <Select
                                        labelId="transaction-currency-label"
                                        label="Moneda"
                                        value={values.currency}
                                        onChange={handleCurrencyChange}
                                    >
                                        <MenuItem value="MXN">MXN</MenuItem>
                                        <MenuItem value="USD">USD</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Fecha"
                                    type="date"
                                    value={values.transactionDate}
                                    onChange={handleTextChange("transactionDate")}
                                    error={Boolean(errors.transactionDate)}
                                    helperText={errors.transactionDate}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Descripción"
                                    value={values.description}
                                    onChange={handleTextChange("description")}
                                    error={Boolean(errors.description)}
                                    helperText={errors.description}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Merchant"
                                    value={values.merchant}
                                    onChange={handleTextChange("merchant")}
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

                            {showsStandardSourceSelector ? (
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="standard-source-type-label">
                                            Fuente
                                        </InputLabel>
                                        <Select
                                            labelId="standard-source-type-label"
                                            label="Fuente"
                                            value={standardSourceType}
                                            onChange={handleStandardSourceTypeChange}
                                        >
                                            <MenuItem value="account">Cuenta</MenuItem>
                                            <MenuItem value="card">Tarjeta</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            ) : null}

                            {showsStandardSourceSelector && standardSourceType === "account" ? (
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <WorkspaceAccountSelect
                                        workspaceId={workspaceId}
                                        value={values.accountId}
                                        onChange={handleAccountChange}
                                        label="Cuenta"
                                        helperText="Selecciona la cuenta origen."
                                        allowEmpty={false}
                                        error={Boolean(errors.accountId)}
                                    />
                                </Grid>
                            ) : null}

                            {showsStandardSourceSelector && standardSourceType === "card" ? (
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <WorkspaceCardSelect
                                        workspaceId={workspaceId}
                                        value={values.cardId}
                                        onChange={handleCardChange}
                                        label="Tarjeta"
                                        helperText="Selecciona la tarjeta origen."
                                        allowEmpty={false}
                                        error={Boolean(errors.cardId)}
                                    />
                                </Grid>
                            ) : null}

                            {values.type === "transfer" ? (
                                <>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <WorkspaceAccountSelect
                                            workspaceId={workspaceId}
                                            value={values.accountId}
                                            onChange={handleAccountChange}
                                            label="Cuenta origen"
                                            helperText="Cuenta desde donde sale el movimiento."
                                            allowEmpty={false}
                                            error={Boolean(errors.accountId)}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <WorkspaceAccountSelect
                                            workspaceId={workspaceId}
                                            value={values.destinationAccountId}
                                            onChange={handleDestinationAccountChange}
                                            label="Cuenta destino"
                                            helperText="Cuenta hacia donde entra el movimiento."
                                            allowEmpty={false}
                                            error={Boolean(errors.destinationAccountId)}
                                        />
                                    </Grid>
                                </>
                            ) : null}

                            {values.type === "debt_payment" ? (
                                <>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <WorkspaceDebtSelect
                                            workspaceId={workspaceId}
                                            value={values.debtId}
                                            onChange={handleDebtChange}
                                            onSelectedDebtChange={handleSelectedDebtChange}
                                            label="Deuda"
                                            helperText="Selecciona la deuda que se está pagando o cobrando."
                                            allowEmpty={false}
                                            error={Boolean(errors.debtId)}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <WorkspaceAccountSelect
                                            workspaceId={workspaceId}
                                            value={values.accountId}
                                            onChange={handleAccountChange}
                                            label={getDebtPaymentAccountLabel(
                                                resolvedDebtPaymentDirection
                                            )}
                                            helperText={getDebtPaymentAccountHelperText(
                                                resolvedDebtPaymentDirection
                                            )}
                                            allowEmpty={false}
                                            error={Boolean(errors.accountId)}
                                        />
                                    </Grid>
                                </>
                            ) : null}

                            {showsCategorySelect ? (
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <WorkspaceCategorySelect
                                        workspaceId={workspaceId}
                                        value={values.categoryId}
                                        onChange={handleCategoryChange}
                                        transactionType={values.type}
                                        label="Categoría"
                                        helperText="Selecciona la categoría de la transacción."
                                        allowEmpty={false}
                                        error={Boolean(errors.categoryId)}
                                    />
                                </Grid>
                            ) : null}

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Notas"
                                    value={values.notes}
                                    onChange={handleTextChange("notes")}
                                    multiline
                                    minRows={2}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Alert severity="info">
                                    Las recurrencias de gastos ahora se gestionan desde Suscripciones. Usa Transacciones para movimientos únicos y Suscripciones para servicios como iCloud, internet, gym o streaming.
                                </Alert>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.isVisible}
                                            onChange={handleVisibleChange}
                                        />
                                    }
                                    label="Visible"
                                />
                            </Grid>

                            {mode === "create" ? (
                                <Grid size={{ xs: 12 }}>
                                    <WorkspaceMemberSelect
                                        workspaceId={workspaceId}
                                        value={values.createdByUserId}
                                        onChange={handleCreatedByMemberChange}
                                        label="Creado por"
                                        helperText="En tu flujo actual este campo se envía como memberId creador."
                                        allowEmpty={false}
                                        error={Boolean(errors.createdByUserId)}
                                    />
                                </Grid>
                            ) : null}
                        </Grid>

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
                                    ? "Crear transacción"
                                    : "Guardar cambios"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
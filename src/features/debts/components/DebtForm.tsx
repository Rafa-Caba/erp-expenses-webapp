// src/features/debts/components/DebtForm.tsx
// Debt create/edit form.
// Phase 10 adds debt payment-plan automation fields:
// total payment amount, expected principal, expected fees, auto-generation flag.

import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
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
import type {
    DebtInstallmentFrequency,
    DebtStatus,
    DebtType,
} from "../types/debt.types";

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
type DebtFormInstallmentFrequency = DebtInstallmentFrequency | "";

const DEBT_FREQUENCY_OPTIONS: DebtInstallmentFrequency[] = [
    "weekly",
    "biweekly",
    "semimonthly",
    "monthly",
    "yearly",
];

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
    paymentPlanEnabled: boolean;
    installmentAmount: string;
    expectedPrincipalAmount: string;
    expectedFeeAmount: string;
    installmentFrequency: DebtFormInstallmentFrequency;
    totalInstallments: string;
    paidInstallments: string;
    paymentDay: string;
    nextDueDate: string;
    autoGeneratePayments: boolean;
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
    | "dueDate"
    | "installmentAmount"
    | "expectedPrincipalAmount"
    | "expectedFeeAmount"
    | "installmentFrequency"
    | "totalInstallments"
    | "paidInstallments"
    | "paymentDay"
    | "nextDueDate"
    | "autoGeneratePayments";

type DebtFormErrors = Partial<Record<DebtFormField, string>>;

type DebtFormTextField =
    | "personName"
    | "personContact"
    | "originalAmount"
    | "remainingAmount"
    | "description"
    | "startDate"
    | "dueDate"
    | "installmentAmount"
    | "expectedPrincipalAmount"
    | "expectedFeeAmount"
    | "totalInstallments"
    | "paidInstallments"
    | "paymentDay"
    | "nextDueDate"
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

function validateOptionalNonNegativeAmount(value: string, label: string): string | null {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return null;
    }

    const numericValue = Number(trimmedValue);

    if (!Number.isFinite(numericValue)) {
        return `${label} debe ser un número válido.`;
    }

    if (numericValue < 0) {
        return `${label} no puede ser negativo.`;
    }

    return null;
}

function validateRequiredInteger(value: string, label: string): string | null {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return `${label} es obligatorio.`;
    }

    const numericValue = Number(trimmedValue);

    if (!Number.isInteger(numericValue)) {
        return `${label} debe ser un número entero.`;
    }

    if (numericValue < 0) {
        return `${label} no puede ser negativo.`;
    }

    return null;
}

function validateOptionalPaymentDay(value: string): string | null {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return null;
    }

    const numericValue = Number(trimmedValue);

    if (!Number.isInteger(numericValue)) {
        return "El día de pago debe ser un número entero.";
    }

    if (numericValue < 1 || numericValue > 31) {
        return "El día de pago debe estar entre 1 y 31.";
    }

    return null;
}

function getRemainingInstallments(values: DebtFormValues): number | null {
    const totalInstallments = Number(values.totalInstallments);
    const paidInstallments = Number(values.paidInstallments);

    if (!Number.isInteger(totalInstallments) || !Number.isInteger(paidInstallments)) {
        return null;
    }

    return Math.max(0, totalInstallments - paidInstallments);
}

function getExpectedPrincipalPreview(values: DebtFormValues): string {
    const installmentAmount = Number(values.installmentAmount);
    const expectedFeeAmount = Number(values.expectedFeeAmount || "0");

    if (!Number.isFinite(installmentAmount) || !Number.isFinite(expectedFeeAmount)) {
        return "";
    }

    return Math.max(0, installmentAmount - expectedFeeAmount).toFixed(2);
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

    if (values.paymentPlanEnabled) {
        const installmentAmountError = validateRequiredAmount(
            values.installmentAmount,
            "El monto total por pago",
            false
        );
        if (installmentAmountError) {
            errors.installmentAmount = installmentAmountError;
        }

        const principalError = validateOptionalNonNegativeAmount(
            values.expectedPrincipalAmount,
            "El principal esperado"
        );
        if (principalError) {
            errors.expectedPrincipalAmount = principalError;
        }

        const feeError = validateOptionalNonNegativeAmount(
            values.expectedFeeAmount,
            "Los cargos esperados"
        );
        if (feeError) {
            errors.expectedFeeAmount = feeError;
        }

        if (!installmentAmountError && !principalError && !feeError) {
            const installmentAmount = Number(values.installmentAmount);
            const expectedPrincipalAmount = values.expectedPrincipalAmount.trim()
                ? Number(values.expectedPrincipalAmount)
                : Number(getExpectedPrincipalPreview(values));
            const expectedFeeAmount = values.expectedFeeAmount.trim()
                ? Number(values.expectedFeeAmount)
                : 0;

            if (
                Number((expectedPrincipalAmount + expectedFeeAmount).toFixed(2)) !==
                Number(installmentAmount.toFixed(2))
            ) {
                errors.expectedPrincipalAmount =
                    "Principal esperado + cargos esperados debe coincidir con el monto total por pago.";
            }
        }

        if (!values.installmentFrequency) {
            errors.installmentFrequency = "La frecuencia es obligatoria.";
        }

        const totalInstallmentsError = validateRequiredInteger(
            values.totalInstallments,
            "El total de pagos"
        );
        if (totalInstallmentsError) {
            errors.totalInstallments = totalInstallmentsError;
        } else if (Number(values.totalInstallments) <= 0) {
            errors.totalInstallments = "El total de pagos debe ser mayor a 0.";
        }

        const paidInstallmentsError = validateRequiredInteger(
            values.paidInstallments,
            "Los pagos realizados"
        );
        if (paidInstallmentsError) {
            errors.paidInstallments = paidInstallmentsError;
        }

        if (!totalInstallmentsError && !paidInstallmentsError) {
            const totalInstallments = Number(values.totalInstallments);
            const paidInstallments = Number(values.paidInstallments);

            if (paidInstallments > totalInstallments) {
                errors.paidInstallments =
                    "Los pagos realizados no pueden exceder el total.";
            }
        }

        const paymentDayError = validateOptionalPaymentDay(values.paymentDay);
        if (paymentDayError) {
            errors.paymentDay = paymentDayError;
        }

        if (values.autoGeneratePayments && !values.nextDueDate.trim()) {
            errors.nextDueDate =
                "Para incluirla en el motor, define la fecha del siguiente pago.";
        }
    } else if (values.autoGeneratePayments) {
        errors.autoGeneratePayments =
            "Para activar el motor de pagos vencidos, primero activa el plan de pagos.";
    }

    if (values.nextDueDate.trim() && values.startDate.trim()) {
        const startDate = new Date(values.startDate);
        const nextDueDate = new Date(values.nextDueDate);

        if (nextDueDate.getTime() < startDate.getTime()) {
            errors.nextDueDate =
                "El siguiente pago no puede ser anterior a la fecha de inicio.";
        }
    }

    return errors;
}

function getInstallmentFrequencyLabel(value: DebtInstallmentFrequency): string {
    switch (value) {
        case "weekly":
            return "Semanal";
        case "biweekly":
            return "Cada 2 semanas";
        case "semimonthly":
            return "Quincenal";
        case "monthly":
            return "Mensual";
        case "yearly":
            return "Anual";
    }
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

    const remainingInstallments = getRemainingInstallments(values);
    const expectedPrincipalPreview = getExpectedPrincipalPreview(values);

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

    const handleInstallmentFrequencyChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "" ||
            value === "weekly" ||
            value === "biweekly" ||
            value === "semimonthly" ||
            value === "monthly" ||
            value === "yearly"
        ) {
            setValues((currentValues) => ({
                ...currentValues,
                installmentFrequency: value,
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

    const handlePaymentPlanEnabledChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = event.target.checked;

        setValues((currentValues) => ({
            ...currentValues,
            paymentPlanEnabled: checked,
            installmentFrequency: checked ? currentValues.installmentFrequency || "monthly" : "",
            paidInstallments: checked ? currentValues.paidInstallments || "0" : "",
            expectedFeeAmount: checked ? currentValues.expectedFeeAmount || "0" : "",
            autoGeneratePayments: checked ? currentValues.autoGeneratePayments : false,
        }));
    };

    const handleAutoGeneratePaymentsChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            autoGeneratePayments: event.target.checked,
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
                                Registra deudas por pagar o por cobrar. Si la deuda se paga en abonos, activa el plan de pagos para llevar control de pagos totales, realizados, restantes, siguiente vencimiento y generación controlada.
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
                                    helperText="Necesario si quieres generar pagos vencidos desde el motor."
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
                                        Necesaria si quieres generar pagos vencidos desde el motor.
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
                                    label="Nombre de la deuda"
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
                        </Grid>

                        <Divider />

                        <Stack spacing={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={values.paymentPlanEnabled}
                                        onChange={handlePaymentPlanEnabledChange}
                                    />
                                }
                                label="Activar plan de pagos / abonos"
                            />

                            {values.paymentPlanEnabled ? (
                                <Alert severity="info">
                                    Plan activo: {remainingInstallments ?? "—"} pago(s) restantes. El motor puede simular o generar pagos vencidos de forma controlada, creando Transaction + Payment y actualizando el saldo de la deuda.
                                </Alert>
                            ) : null}

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label="Monto total por pago"
                                        value={values.installmentAmount}
                                        onChange={handleTextChange("installmentAmount")}
                                        error={Boolean(errors.installmentAmount)}
                                        helperText={
                                            errors.installmentAmount ??
                                            "Cashflow real. Ejemplo: 8309.93 del carro."
                                        }
                                        disabled={!values.paymentPlanEnabled}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label="Principal esperado"
                                        value={values.expectedPrincipalAmount}
                                        onChange={handleTextChange("expectedPrincipalAmount")}
                                        error={Boolean(errors.expectedPrincipalAmount)}
                                        helperText={
                                            errors.expectedPrincipalAmount ??
                                            `Reduce deuda. Sugerido: ${expectedPrincipalPreview || "—"}`
                                        }
                                        disabled={!values.paymentPlanEnabled}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label="Cargos esperados"
                                        value={values.expectedFeeAmount}
                                        onChange={handleTextChange("expectedFeeAmount")}
                                        error={Boolean(errors.expectedFeeAmount)}
                                        helperText={
                                            errors.expectedFeeAmount ??
                                            "Intereses/comisiones. Usa 0 si no aplica."
                                        }
                                        disabled={!values.paymentPlanEnabled}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <FormControl
                                        fullWidth
                                        error={Boolean(errors.installmentFrequency)}
                                        disabled={!values.paymentPlanEnabled}
                                    >
                                        <InputLabel id="installment-frequency-label">
                                            Frecuencia
                                        </InputLabel>
                                        <Select
                                            labelId="installment-frequency-label"
                                            label="Frecuencia"
                                            value={values.installmentFrequency}
                                            onChange={handleInstallmentFrequencyChange}
                                        >
                                            <MenuItem value="">
                                                <em>Sin frecuencia</em>
                                            </MenuItem>

                                            {DEBT_FREQUENCY_OPTIONS.map((frequency) => (
                                                <MenuItem key={frequency} value={frequency}>
                                                    {getInstallmentFrequencyLabel(frequency)}
                                                </MenuItem>
                                            ))}
                                        </Select>

                                        {errors.installmentFrequency ? (
                                            <FormHelperText>{errors.installmentFrequency}</FormHelperText>
                                        ) : (
                                            <FormHelperText>
                                                Quincenal usa 15 y fin de mes. Cada 2 semanas usa intervalos de 14 días.
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label="Día de pago"
                                        value={values.paymentDay}
                                        onChange={handleTextChange("paymentDay")}
                                        error={Boolean(errors.paymentDay)}
                                        helperText={errors.paymentDay ?? "Opcional. 1 a 31."}
                                        disabled={!values.paymentPlanEnabled}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label="Siguiente pago"
                                        type="date"
                                        value={values.nextDueDate}
                                        onChange={handleTextChange("nextDueDate")}
                                        error={Boolean(errors.nextDueDate)}
                                        helperText={errors.nextDueDate ?? "Próxima fecha esperada."}
                                        disabled={!values.paymentPlanEnabled}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label="Pagos totales"
                                        value={values.totalInstallments}
                                        onChange={handleTextChange("totalInstallments")}
                                        error={Boolean(errors.totalInstallments)}
                                        helperText={errors.totalInstallments}
                                        disabled={!values.paymentPlanEnabled}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label="Pagos realizados"
                                        value={values.paidInstallments}
                                        onChange={handleTextChange("paidInstallments")}
                                        error={Boolean(errors.paidInstallments)}
                                        helperText={errors.paidInstallments}
                                        disabled={!values.paymentPlanEnabled}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label="Pagos restantes"
                                        value={remainingInstallments === null ? "—" : String(remainingInstallments)}
                                        helperText="Calculado: pagos totales - pagos realizados."
                                        disabled
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.autoGeneratePayments}
                                                onChange={handleAutoGeneratePaymentsChange}
                                                disabled={!values.paymentPlanEnabled}
                                            />
                                        }
                                        label="Incluir en motor de pagos vencidos"
                                    />

                                    {errors.autoGeneratePayments ? (
                                        <FormHelperText error>{errors.autoGeneratePayments}</FormHelperText>
                                    ) : (
                                        <FormHelperText>
                                            El motor no corre en silencio: desde la página de Deudas podrás simular o generar los pagos vencidos.
                                        </FormHelperText>
                                    )}
                                </Grid>
                            </Grid>
                        </Stack>

                        <Divider />

                        <Grid container spacing={2}>
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
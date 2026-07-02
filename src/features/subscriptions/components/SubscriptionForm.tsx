// src/features/subscriptions/components/SubscriptionForm.tsx
// Subscription create/edit form.
// Phase 9A records recurring expenses separately from debt payment plans.

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

import type { CurrencyCode } from "../../../shared/types/common.types";
import { WorkspaceAccountSelect } from "../../components/WorkspaceAccountSelect";
import { WorkspaceCardSelect } from "../../components/WorkspaceCardSelect";
import { WorkspaceCategorySelect } from "../../components/WorkspaceCategorySelect";
import { WorkspaceMemberSelect } from "../../components/WorkspaceMemberSelect";
import type {
    SubscriptionBillingFrequency,
    SubscriptionStatus,
} from "../types/subscription.types";

type SubscriptionSourceType = "account" | "card";

export type SubscriptionFormValues = {
    memberId: string;
    categoryId: string;
    accountId: string;
    cardId: string;
    name: string;
    merchant: string;
    amount: string;
    currency: CurrencyCode;
    billingFrequency: SubscriptionBillingFrequency;
    billingDay: string;
    startDate: string;
    nextBillingDate: string;
    endDate: string;
    status: SubscriptionStatus;
    autoCreateTransaction: boolean;
    notes: string;
    isVisible: boolean;
};

type SubscriptionFormField =
    | "memberId"
    | "categoryId"
    | "accountId"
    | "cardId"
    | "name"
    | "amount"
    | "billingDay"
    | "startDate"
    | "nextBillingDate"
    | "endDate";

type SubscriptionFormErrors = Partial<Record<SubscriptionFormField, string>>;

type SubscriptionFormTextField =
    | "name"
    | "merchant"
    | "amount"
    | "billingDay"
    | "startDate"
    | "nextBillingDate"
    | "endDate"
    | "notes";

type SubscriptionFormProps = {
    workspaceId: string | null;
    mode: "create" | "edit";
    initialValues: SubscriptionFormValues;
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: SubscriptionFormValues) => void;
    onCancel: () => void;
};

function resolveSourceType(values: SubscriptionFormValues): SubscriptionSourceType {
    return values.cardId.trim() ? "card" : "account";
}

function validateSubscriptionForm(
    values: SubscriptionFormValues,
    sourceType: SubscriptionSourceType
): SubscriptionFormErrors {
    const errors: SubscriptionFormErrors = {};

    if (!values.memberId.trim()) {
        errors.memberId = "El miembro es obligatorio.";
    }

    if (!values.categoryId.trim()) {
        errors.categoryId = "La categoría de gasto es obligatoria.";
    }

    if (sourceType === "account" && !values.accountId.trim()) {
        errors.accountId = "La cuenta es obligatoria.";
    }

    if (sourceType === "card" && !values.cardId.trim()) {
        errors.cardId = "La tarjeta es obligatoria.";
    }

    if (!values.name.trim()) {
        errors.name = "El nombre de la suscripción es obligatorio.";
    }

    const amount = Number(values.amount);
    if (!values.amount.trim()) {
        errors.amount = "El monto es obligatorio.";
    } else if (!Number.isFinite(amount) || amount <= 0) {
        errors.amount = "El monto debe ser mayor a 0.";
    }

    if (values.billingDay.trim()) {
        const billingDay = Number(values.billingDay);

        if (!Number.isInteger(billingDay) || billingDay < 1 || billingDay > 31) {
            errors.billingDay = "El día de cobro debe estar entre 1 y 31.";
        }
    }

    if (!values.startDate.trim()) {
        errors.startDate = "La fecha de inicio es obligatoria.";
    }

    if (!values.nextBillingDate.trim()) {
        errors.nextBillingDate = "La próxima fecha de cobro es obligatoria.";
    }

    if (values.startDate.trim() && values.nextBillingDate.trim()) {
        const startDate = new Date(values.startDate);
        const nextBillingDate = new Date(values.nextBillingDate);

        if (nextBillingDate.getTime() < startDate.getTime()) {
            errors.nextBillingDate = "El próximo cobro no puede ser anterior al inicio.";
        }
    }

    if (values.endDate.trim() && values.startDate.trim()) {
        const startDate = new Date(values.startDate);
        const endDate = new Date(values.endDate);

        if (endDate.getTime() < startDate.getTime()) {
            errors.endDate = "La fecha final no puede ser anterior al inicio.";
        }
    }

    return errors;
}

function getBillingFrequencyLabel(value: SubscriptionBillingFrequency): string {
    switch (value) {
        case "weekly":
            return "Semanal";
        case "biweekly":
            return "Quincenal";
        case "monthly":
            return "Mensual";
        case "yearly":
            return "Anual";
    }
}

export function SubscriptionForm({
    workspaceId,
    mode,
    initialValues,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: SubscriptionFormProps) {
    const [values, setValues] = React.useState<SubscriptionFormValues>(initialValues);
    const [errors, setErrors] = React.useState<SubscriptionFormErrors>({});
    const [sourceType, setSourceType] = React.useState<SubscriptionSourceType>(
        resolveSourceType(initialValues)
    );

    React.useEffect(() => {
        setValues(initialValues);
        setSourceType(resolveSourceType(initialValues));
    }, [initialValues]);

    const handleTextChange =
        (field: SubscriptionFormTextField) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
            };

    const handleSourceTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "account" || value === "card") {
            setSourceType(value);
            setValues((currentValues) => ({
                ...currentValues,
                accountId: value === "account" ? currentValues.accountId : "",
                cardId: value === "card" ? currentValues.cardId : "",
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

    const handleBillingFrequencyChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "weekly" || value === "biweekly" || value === "monthly" || value === "yearly") {
            setValues((currentValues) => ({
                ...currentValues,
                billingFrequency: value,
            }));
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "active" || value === "paused" || value === "cancelled") {
            setValues((currentValues) => ({
                ...currentValues,
                status: value,
            }));
        }
    };

    const handleBooleanChange =
        (field: "autoCreateTransaction" | "isVisible") =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.checked,
                }));
            };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateSubscriptionForm(values, sourceType);
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
                                {mode === "create" ? "Nueva suscripción" : "Editar suscripción"}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Registra servicios recurrentes como internet, gym, iCloud, Google, Netflix, Railway o similares. Esto no es deuda; es control de próximos cobros y gastos recurrentes.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? <Alert severity="error">{submitErrorMessage}</Alert> : null}

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Nombre"
                                    value={values.name}
                                    onChange={handleTextChange("name")}
                                    error={Boolean(errors.name)}
                                    helperText={errors.name ?? "Ejemplo: iCloud, Telmex, Gym, Google One."}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Merchant"
                                    value={values.merchant}
                                    onChange={handleTextChange("merchant")}
                                    helperText="Opcional. Proveedor o comercio del cargo."
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Monto esperado"
                                    value={values.amount}
                                    onChange={handleTextChange("amount")}
                                    error={Boolean(errors.amount)}
                                    helperText={errors.amount ?? "Monto que normalmente se cobra."}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="subscription-currency-label">Moneda</InputLabel>
                                    <Select
                                        labelId="subscription-currency-label"
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
                                <FormControl fullWidth>
                                    <InputLabel id="subscription-status-label">Estado</InputLabel>
                                    <Select
                                        labelId="subscription-status-label"
                                        label="Estado"
                                        value={values.status}
                                        onChange={handleStatusChange}
                                    >
                                        <MenuItem value="active">Activa</MenuItem>
                                        <MenuItem value="paused">Pausada</MenuItem>
                                        <MenuItem value="cancelled">Cancelada</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceMemberSelect
                                    workspaceId={workspaceId}
                                    value={values.memberId}
                                    onChange={(memberId) => setValues((currentValues) => ({ ...currentValues, memberId }))}
                                    label="Miembro"
                                    helperText="Miembro responsable o relacionado con esta suscripción."
                                    allowEmpty={false}
                                    error={Boolean(errors.memberId)}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceCategorySelect
                                    workspaceId={workspaceId}
                                    value={values.categoryId}
                                    onChange={(categoryId) => setValues((currentValues) => ({ ...currentValues, categoryId }))}
                                    transactionType="expense"
                                    label="Categoría de gasto"
                                    helperText="Se usa al crear la transacción del cobro."
                                    allowEmpty={false}
                                    error={Boolean(errors.categoryId)}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="subscription-source-type-label">Fuente</InputLabel>
                                    <Select
                                        labelId="subscription-source-type-label"
                                        label="Fuente"
                                        value={sourceType}
                                        onChange={handleSourceTypeChange}
                                    >
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
                                        onChange={(accountId) => setValues((currentValues) => ({ ...currentValues, accountId }))}
                                        label="Cuenta de cobro"
                                        helperText="Cuenta de donde normalmente sale el cargo."
                                        allowEmpty={false}
                                        error={Boolean(errors.accountId)}
                                    />
                                </Grid>
                            ) : null}

                            {sourceType === "card" ? (
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <WorkspaceCardSelect
                                        workspaceId={workspaceId}
                                        value={values.cardId}
                                        onChange={(cardId) => setValues((currentValues) => ({ ...currentValues, cardId }))}
                                        label="Tarjeta de cobro"
                                        helperText="Tarjeta donde normalmente cae el cargo."
                                        allowEmpty={false}
                                        error={Boolean(errors.cardId)}
                                    />
                                </Grid>
                            ) : null}

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="subscription-frequency-label">Frecuencia</InputLabel>
                                    <Select
                                        labelId="subscription-frequency-label"
                                        label="Frecuencia"
                                        value={values.billingFrequency}
                                        onChange={handleBillingFrequencyChange}
                                    >
                                        {(["weekly", "biweekly", "monthly", "yearly"] as SubscriptionBillingFrequency[]).map((frequency) => (
                                            <MenuItem key={frequency} value={frequency}>
                                                {getBillingFrequencyLabel(frequency)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Día de cobro"
                                    value={values.billingDay}
                                    onChange={handleTextChange("billingDay")}
                                    error={Boolean(errors.billingDay)}
                                    helperText={errors.billingDay ?? "Opcional. 1 a 31."}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Inicio"
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
                                    label="Próximo cobro"
                                    type="date"
                                    value={values.nextBillingDate}
                                    onChange={handleTextChange("nextBillingDate")}
                                    error={Boolean(errors.nextBillingDate)}
                                    helperText={errors.nextBillingDate ?? "Fecha esperada del siguiente cargo."}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Fecha final"
                                    type="date"
                                    value={values.endDate}
                                    onChange={handleTextChange("endDate")}
                                    error={Boolean(errors.endDate)}
                                    helperText={errors.endDate ?? "Opcional. Para suscripciones canceladas o con fin definido."}
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

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={values.autoCreateTransaction}
                                        onChange={handleBooleanChange("autoCreateTransaction")}
                                    />
                                }
                                label="Marcar para auto-generación futura"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={values.isVisible}
                                        onChange={handleBooleanChange("isVisible")}
                                    />
                                }
                                label="Visible"
                            />
                        </Stack>

                        <Alert severity="info">
                            En esta fase, el cobro se crea desde el botón “Crear transacción”. La auto-generación silenciosa queda preparada para una fase posterior.
                        </Alert>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                                Cancelar
                            </Button>

                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {mode === "create" ? "Crear suscripción" : "Guardar cambios"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}

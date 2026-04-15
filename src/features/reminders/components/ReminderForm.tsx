// src/features/reminders/components/ReminderForm.tsx

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

import { AppDateField } from "../../components/AppDateField";
import { WorkspaceMemberSelect } from "../../components/WorkspaceMemberSelect";
import type {
    ReminderChannel,
    ReminderPriority,
    ReminderRelatedEntityType,
    ReminderStatus,
    ReminderType,
} from "../types/reminder.types";
import {
    getReminderChannelLabel,
    getReminderPriorityLabel,
    getReminderStatusLabel,
    getReminderTypeLabel,
} from "../utils/reminder-labels";
import { ReminderRelatedEntityField } from "./ReminderRelatedEntityField";

export type ReminderFormValues = {
    memberId: string;
    title: string;
    description: string;
    type: ReminderType;
    relatedEntityType: ReminderRelatedEntityType | "";
    relatedEntityId: string;
    dueDate: string;
    isRecurring: boolean;
    recurrenceRule: string;
    status: ReminderStatus;
    priority: ReminderPriority | "";
    channel: ReminderChannel;
    isVisible: boolean;
};

type ReminderFormField =
    | "title"
    | "dueDate"
    | "recurrenceRule"
    | "relatedEntityId";

type ReminderFormErrors = Partial<Record<ReminderFormField, string>>;

type ReminderFormTextField =
    | "title"
    | "description"
    | "dueDate"
    | "recurrenceRule";

type ReminderFormProps = {
    mode: "create" | "edit";
    workspaceId: string | null;
    initialValues: ReminderFormValues;
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: ReminderFormValues) => void;
    onCancel: () => void;
};

function validateReminderForm(values: ReminderFormValues): ReminderFormErrors {
    const errors: ReminderFormErrors = {};

    if (!values.title.trim()) {
        errors.title = "El título es obligatorio.";
    }

    if (!values.dueDate.trim()) {
        errors.dueDate = "La fecha límite es obligatoria.";
    }

    if (values.isRecurring && !values.recurrenceRule.trim()) {
        errors.recurrenceRule = "La regla de recurrencia es obligatoria.";
    }

    if (values.relatedEntityType && !values.relatedEntityId.trim()) {
        errors.relatedEntityId = "Debes seleccionar o capturar la entidad relacionada.";
    }

    return errors;
}

export function ReminderForm({
    mode,
    workspaceId,
    initialValues,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: ReminderFormProps) {
    const [values, setValues] = React.useState<ReminderFormValues>(initialValues);
    const [errors, setErrors] = React.useState<ReminderFormErrors>({});

    React.useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const handleTextChange =
        (field: ReminderFormTextField) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
            };

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "bill" ||
            value === "debt" ||
            value === "subscription" ||
            value === "custom"
        ) {
            setValues((currentValues) => ({
                ...currentValues,
                type: value,
            }));
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "pending" || value === "done" || value === "dismissed") {
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

    const handleChannelChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "in_app" || value === "email" || value === "both") {
            setValues((currentValues) => ({
                ...currentValues,
                channel: value,
            }));
        }
    };

    const handleMemberChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            memberId: value,
        }));
    };

    const handleRelatedEntityTypeChange = (
        value: ReminderRelatedEntityType | ""
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            relatedEntityType: value,
            relatedEntityId: "",
        }));
    };

    const handleRelatedEntityIdChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            relatedEntityId: value,
        }));
    };

    const handleRecurringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isRecurring = event.target.checked;

        setValues((currentValues) => ({
            ...currentValues,
            isRecurring,
            recurrenceRule: isRecurring ? currentValues.recurrenceRule : "",
        }));
    };

    const handleVisibleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues((currentValues) => ({
            ...currentValues,
            isVisible: event.target.checked,
        }));
    };

    const handleDueDateChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            dueDate: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateReminderForm(values);
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
                                {mode === "create" ? "Nuevo reminder" : "Editar reminder"}
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Define recordatorio, fecha límite, recurrencia y vínculo
                                opcional con otra entidad del workspace.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? (
                            <Alert severity="error">{submitErrorMessage}</Alert>
                        ) : null}

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Título"
                                    value={values.title}
                                    onChange={handleTextChange("title")}
                                    error={Boolean(errors.title)}
                                    helperText={errors.title}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="reminder-type-label">Tipo</InputLabel>
                                    <Select
                                        labelId="reminder-type-label"
                                        label="Tipo"
                                        value={values.type}
                                        onChange={handleTypeChange}
                                    >
                                        <MenuItem value="bill">
                                            {getReminderTypeLabel("bill")}
                                        </MenuItem>
                                        <MenuItem value="debt">
                                            {getReminderTypeLabel("debt")}
                                        </MenuItem>
                                        <MenuItem value="subscription">
                                            {getReminderTypeLabel("subscription")}
                                        </MenuItem>
                                        <MenuItem value="custom">
                                            {getReminderTypeLabel("custom")}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <AppDateField
                                    label="Fecha límite"
                                    value={values.dueDate}
                                    onChange={handleDueDateChange}
                                    error={Boolean(errors.dueDate)}
                                    helperText={errors.dueDate}
                                    disabled={isSubmitting}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Descripción"
                                    value={values.description}
                                    onChange={handleTextChange("description")}
                                    fullWidth
                                    multiline
                                    minRows={2}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="reminder-status-label">Estado</InputLabel>
                                    <Select
                                        labelId="reminder-status-label"
                                        label="Estado"
                                        value={values.status}
                                        onChange={handleStatusChange}
                                    >
                                        <MenuItem value="pending">
                                            {getReminderStatusLabel("pending")}
                                        </MenuItem>
                                        <MenuItem value="done">
                                            {getReminderStatusLabel("done")}
                                        </MenuItem>
                                        <MenuItem value="dismissed">
                                            {getReminderStatusLabel("dismissed")}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="reminder-priority-label">
                                        Prioridad
                                    </InputLabel>
                                    <Select
                                        labelId="reminder-priority-label"
                                        label="Prioridad"
                                        value={values.priority}
                                        onChange={handlePriorityChange}
                                    >
                                        <MenuItem value="">
                                            <em>Sin prioridad</em>
                                        </MenuItem>
                                        <MenuItem value="low">
                                            {getReminderPriorityLabel("low")}
                                        </MenuItem>
                                        <MenuItem value="medium">
                                            {getReminderPriorityLabel("medium")}
                                        </MenuItem>
                                        <MenuItem value="high">
                                            {getReminderPriorityLabel("high")}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="reminder-channel-label">Canal</InputLabel>
                                    <Select
                                        labelId="reminder-channel-label"
                                        label="Canal"
                                        value={values.channel}
                                        onChange={handleChannelChange}
                                    >
                                        <MenuItem value="in_app">
                                            {getReminderChannelLabel("in_app")}
                                        </MenuItem>
                                        <MenuItem value="email">
                                            {getReminderChannelLabel("email")}
                                        </MenuItem>
                                        <MenuItem value="both">
                                            {getReminderChannelLabel("both")}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceMemberSelect
                                    workspaceId={workspaceId}
                                    value={values.memberId}
                                    onChange={handleMemberChange}
                                    label="Miembro"
                                    helperText="Opcional. Miembro relacionado con el reminder."
                                    allowEmpty
                                    emptyOptionLabel="Sin miembro específico"
                                    disabled={isSubmitting}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <ReminderRelatedEntityField
                                    workspaceId={workspaceId}
                                    relatedEntityType={values.relatedEntityType}
                                    relatedEntityId={values.relatedEntityId}
                                    relatedEntityIdError={errors.relatedEntityId}
                                    disabled={isSubmitting}
                                    onRelatedEntityTypeChange={handleRelatedEntityTypeChange}
                                    onRelatedEntityIdChange={handleRelatedEntityIdChange}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.isRecurring}
                                            onChange={handleRecurringChange}
                                        />
                                    }
                                    label="Recurrente"
                                />
                            </Grid>

                            {values.isRecurring ? (
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        label="Regla de recurrencia"
                                        value={values.recurrenceRule}
                                        onChange={handleTextChange("recurrenceRule")}
                                        error={Boolean(errors.recurrenceRule)}
                                        helperText={
                                            errors.recurrenceRule ??
                                            "Ejemplo: FREQ=MONTHLY;INTERVAL=1"
                                        }
                                        fullWidth
                                    />
                                </Grid>
                            ) : null}
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
                                {mode === "create" ? "Crear reminder" : "Guardar cambios"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
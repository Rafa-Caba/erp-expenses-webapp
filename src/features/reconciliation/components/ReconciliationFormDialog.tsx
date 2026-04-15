// src/features/reconciliation/components/ReconciliationFormDialog.tsx

import React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import { WorkspaceAccountSelect } from "../../components/WorkspaceAccountSelect";
import { WorkspaceCardSelect } from "../../components/WorkspaceCardSelect";
import { WorkspaceTransactionSelect } from "../../components/WorkspaceTransactionSelect";
import type {
    CreateReconciliationPayload,
    ReconciliationMatchMethod,
    ReconciliationRecord,
    ReconciliationStatus,
    UpdateReconciliationPayload,
} from "../types/reconciliation.types";

type ReconciliationFormDialogProps = {
    workspaceId: string | null;
    open: boolean;
    mode: "create" | "edit";
    initialValues: ReconciliationRecord | null;
    isSubmitting: boolean;
    submitErrorMessage: string | null;
    onClose: () => void;
    onCreate: (payload: CreateReconciliationPayload) => void;
    onUpdate: (reconciliationId: string, payload: UpdateReconciliationPayload) => void;
};

type FormValues = {
    accountId: string;
    cardId: string;
    transactionId: string;
    expectedAmount: string;
    actualAmount: string;
    statementDate: string;
    statementReference: string;
    matchMethod: ReconciliationMatchMethod;
    status: ReconciliationStatus;
    notes: string;
    reconciledAt: string;
    isVisible: boolean;
    isActive: boolean;
    isArchived: boolean;
};

function toCreateInitialValues(): FormValues {
    return {
        accountId: "",
        cardId: "",
        transactionId: "",
        expectedAmount: "",
        actualAmount: "",
        statementDate: "",
        statementReference: "",
        matchMethod: "manual",
        status: "reconciled",
        notes: "",
        reconciledAt: "",
        isVisible: true,
        isActive: true,
        isArchived: false,
    };
}

function toEditInitialValues(record: ReconciliationRecord): FormValues {
    return {
        accountId: record.accountId,
        cardId: record.cardId ?? "",
        transactionId: record.transactionId,
        expectedAmount: String(record.expectedAmount),
        actualAmount: String(record.actualAmount),
        statementDate: record.statementDate ? record.statementDate.slice(0, 10) : "",
        statementReference: record.statementReference ?? "",
        matchMethod: record.matchMethod,
        status: record.status,
        notes: record.notes ?? "",
        reconciledAt: record.reconciledAt ? record.reconciledAt.slice(0, 10) : "",
        isVisible: record.isVisible,
        isActive: record.isActive,
        isArchived: record.isArchived,
    };
}

function parseOptionalNumber(value: string): number | undefined {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return undefined;
    }

    const parsedValue = Number(trimmedValue);

    return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

export function ReconciliationFormDialog({
    workspaceId,
    open,
    mode,
    initialValues,
    isSubmitting,
    submitErrorMessage,
    onClose,
    onCreate,
    onUpdate,
}: ReconciliationFormDialogProps) {
    const [values, setValues] = React.useState<FormValues>(toCreateInitialValues());

    React.useEffect(() => {
        if (!open) {
            return;
        }

        if (mode === "edit" && initialValues) {
            setValues(toEditInitialValues(initialValues));
            return;
        }

        setValues(toCreateInitialValues());
    }, [initialValues, mode, open]);

    const handleSubmit = React.useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            if (mode === "create") {
                if (!values.accountId.trim() || !values.transactionId.trim()) {
                    return;
                }

                onCreate({
                    accountId: values.accountId,
                    cardId: values.cardId.trim() ? values.cardId : null,
                    transactionId: values.transactionId.trim(),
                    expectedAmount: parseOptionalNumber(values.expectedAmount),
                    actualAmount: parseOptionalNumber(values.actualAmount),
                    statementDate: values.statementDate.trim() ? values.statementDate : null,
                    statementReference: values.statementReference.trim()
                        ? values.statementReference.trim()
                        : null,
                    matchMethod: values.matchMethod,
                    status: values.status,
                    notes: values.notes.trim() ? values.notes.trim() : null,
                    reconciledAt: values.reconciledAt.trim() ? values.reconciledAt : null,
                    isVisible: values.isVisible,
                });

                return;
            }

            if (!initialValues) {
                return;
            }

            onUpdate(initialValues.id, {
                expectedAmount: parseOptionalNumber(values.expectedAmount),
                actualAmount: parseOptionalNumber(values.actualAmount),
                statementDate: values.statementDate.trim() ? values.statementDate : null,
                statementReference: values.statementReference.trim()
                    ? values.statementReference.trim()
                    : null,
                matchMethod: values.matchMethod,
                status: values.status,
                notes: values.notes.trim() ? values.notes.trim() : null,
                reconciledAt: values.reconciledAt.trim() ? values.reconciledAt : null,
                isVisible: values.isVisible,
                isActive: values.isActive,
                isArchived: values.isArchived,
            });
        },
        [initialValues, mode, onCreate, onUpdate, values]
    );

    return (
        <Dialog
            open={open}
            onClose={isSubmitting ? undefined : onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                {mode === "create" ? "Nueva conciliación" : "Editar conciliación"}
            </DialogTitle>

            <DialogContent dividers>
                <Stack component="form" spacing={2} onSubmit={handleSubmit}>
                    {submitErrorMessage ? (
                        <Alert severity="error">{submitErrorMessage}</Alert>
                    ) : null}

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <WorkspaceAccountSelect
                                workspaceId={workspaceId}
                                value={values.accountId}
                                onChange={(value) =>
                                    setValues((currentValues) => ({
                                        ...currentValues,
                                        accountId: value,
                                    }))
                                }
                                label="Cuenta"
                                disabled={mode === "edit"}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <WorkspaceCardSelect
                                workspaceId={workspaceId}
                                value={values.cardId}
                                onChange={(value) =>
                                    setValues((currentValues) => ({
                                        ...currentValues,
                                        cardId: value,
                                    }))
                                }
                                label="Tarjeta"
                                disabled={mode === "edit"}
                                allowEmpty
                                emptyOptionLabel="Sin tarjeta específica"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <WorkspaceTransactionSelect
                                workspaceId={workspaceId}
                                value={values.transactionId}
                                onChange={(value) =>
                                    setValues((currentValues) => ({
                                        ...currentValues,
                                        transactionId: value,
                                    }))
                                }
                                label="Transacción"
                                disabled={mode === "edit"}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Monto esperado"
                                value={values.expectedAmount}
                                onChange={(event) =>
                                    setValues((currentValues) => ({
                                        ...currentValues,
                                        expectedAmount: event.target.value,
                                    }))
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Monto real"
                                value={values.actualAmount}
                                onChange={(event) =>
                                    setValues((currentValues) => ({
                                        ...currentValues,
                                        actualAmount: event.target.value,
                                    }))
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Fecha estado de cuenta"
                                value={values.statementDate}
                                onChange={(event) =>
                                    setValues((currentValues) => ({
                                        ...currentValues,
                                        statementDate: event.target.value,
                                    }))
                                }
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Fecha conciliación"
                                value={values.reconciledAt}
                                onChange={(event) =>
                                    setValues((currentValues) => ({
                                        ...currentValues,
                                        reconciledAt: event.target.value,
                                    }))
                                }
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Método"
                                value={values.matchMethod}
                                onChange={(event) =>
                                    setValues((currentValues) => ({
                                        ...currentValues,
                                        matchMethod: event.target.value as ReconciliationMatchMethod,
                                    }))
                                }
                            >
                                <MenuItem value="manual">Manual</MenuItem>
                                <MenuItem value="imported">Importado</MenuItem>
                                <MenuItem value="automatic">Automático</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Estado"
                                value={values.status}
                                onChange={(event) =>
                                    setValues((currentValues) => ({
                                        ...currentValues,
                                        status: event.target.value as ReconciliationStatus,
                                    }))
                                }
                            >
                                <MenuItem value="unreconciled">Sin conciliar</MenuItem>
                                <MenuItem value="reconciled">Conciliada</MenuItem>
                                <MenuItem value="exception">Con excepción</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Referencia del estado de cuenta"
                                value={values.statementReference}
                                onChange={(event) =>
                                    setValues((currentValues) => ({
                                        ...currentValues,
                                        statementReference: event.target.value,
                                    }))
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Notas"
                                value={values.notes}
                                onChange={(event) =>
                                    setValues((currentValues) => ({
                                        ...currentValues,
                                        notes: event.target.value,
                                    }))
                                }
                                multiline
                                minRows={3}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} useFlexGap flexWrap="wrap">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={values.isVisible}
                                            onChange={(event) =>
                                                setValues((currentValues) => ({
                                                    ...currentValues,
                                                    isVisible: event.target.checked,
                                                }))
                                            }
                                        />
                                    }
                                    label="Visible"
                                />

                                {mode === "edit" ? (
                                    <>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={values.isActive}
                                                    onChange={(event) =>
                                                        setValues((currentValues) => ({
                                                            ...currentValues,
                                                            isActive: event.target.checked,
                                                        }))
                                                    }
                                                />
                                            }
                                            label="Activa"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={values.isArchived}
                                                    onChange={(event) =>
                                                        setValues((currentValues) => ({
                                                            ...currentValues,
                                                            isArchived: event.target.checked,
                                                        }))
                                                    }
                                                />
                                            }
                                            label="Archivada"
                                        />
                                    </>
                                ) : null}
                            </Stack>
                        </Grid>
                    </Grid>

                    <DialogActions
                        sx={{
                            px: 0,
                            display: "flex",
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                            justifyContent: {
                                xs: "stretch",
                                sm: "flex-end",
                            },
                            alignItems: {
                                xs: "stretch",
                                sm: "center",
                            },
                            gap: 1,
                            "& > button": {
                                width: {
                                    xs: "100%",
                                    sm: "auto",
                                },
                            },
                        }}
                    >
                        <Button
                            sx={{
                                order: {
                                    xs: 1,
                                    sm: 2,
                                },
                            }}
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Guardando..."
                                : mode === "create"
                                    ? "Crear conciliación"
                                    : "Guardar cambios"}
                        </Button>
                        <Button
                            sx={{
                                order: {
                                    xs: 2,
                                    sm: 1,
                                },
                            }}
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                    </DialogActions>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
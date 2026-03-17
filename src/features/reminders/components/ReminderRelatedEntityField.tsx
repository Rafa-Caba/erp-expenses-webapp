// src/features/reminders/components/ReminderRelatedEntityField.tsx

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import { WorkspaceAccountSelect } from "../../components/WorkspaceAccountSelect";
import { WorkspaceBudgetSelect } from "../../components/WorkspaceBudgetSelect";
import { WorkspaceCardSelect } from "../../components/WorkspaceCardSelect";
import { WorkspaceDebtSelect } from "../../components/WorkspaceDebtSelect";
import { WorkspacePaymentSelect } from "../../components/WorkspacePaymentSelect";
import { WorkspaceReceiptSelect } from "../../components/WorkspaceReceiptSelect";
import { WorkspaceSavingGoalSelect } from "../../components/WorkspaceSavingGoalSelect";
import { WorkspaceTransactionSelect } from "../../components/WorkspaceTransactionSelect";
import type { ReminderRelatedEntityType } from "../types/reminder.types";
import { getReminderRelatedEntityTypeLabel } from "../utils/reminder-labels";

type ReminderRelatedEntityFieldProps = {
    workspaceId: string | null;
    relatedEntityType: ReminderRelatedEntityType | "";
    relatedEntityId: string;
    relatedEntityIdError?: string;
    disabled?: boolean;
    onRelatedEntityTypeChange: (value: ReminderRelatedEntityType | "") => void;
    onRelatedEntityIdChange: (value: string) => void;
};

export function ReminderRelatedEntityField({
    workspaceId,
    relatedEntityType,
    relatedEntityId,
    relatedEntityIdError,
    disabled = false,
    onRelatedEntityTypeChange,
    onRelatedEntityIdChange,
}: ReminderRelatedEntityFieldProps) {
    const handleRelatedEntityTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "" ||
            value === "transaction" ||
            value === "receipt" ||
            value === "debt" ||
            value === "payment" ||
            value === "budget" ||
            value === "saving_goal" ||
            value === "account" ||
            value === "card" ||
            value === "custom"
        ) {
            onRelatedEntityTypeChange(value);
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 5 }}>
                <FormControl fullWidth disabled={disabled}>
                    <InputLabel id="reminder-related-entity-type-label">
                        Entidad relacionada
                    </InputLabel>

                    <Select
                        labelId="reminder-related-entity-type-label"
                        label="Entidad relacionada"
                        value={relatedEntityType}
                        onChange={handleRelatedEntityTypeChange}
                    >
                        <MenuItem value="">
                            <em>Sin entidad relacionada</em>
                        </MenuItem>
                        <MenuItem value="transaction">
                            {getReminderRelatedEntityTypeLabel("transaction")}
                        </MenuItem>
                        <MenuItem value="receipt">
                            {getReminderRelatedEntityTypeLabel("receipt")}
                        </MenuItem>
                        <MenuItem value="debt">
                            {getReminderRelatedEntityTypeLabel("debt")}
                        </MenuItem>
                        <MenuItem value="payment">
                            {getReminderRelatedEntityTypeLabel("payment")}
                        </MenuItem>
                        <MenuItem value="budget">
                            {getReminderRelatedEntityTypeLabel("budget")}
                        </MenuItem>
                        <MenuItem value="saving_goal">
                            {getReminderRelatedEntityTypeLabel("saving_goal")}
                        </MenuItem>
                        <MenuItem value="account">
                            {getReminderRelatedEntityTypeLabel("account")}
                        </MenuItem>
                        <MenuItem value="card">
                            {getReminderRelatedEntityTypeLabel("card")}
                        </MenuItem>
                        <MenuItem value="custom">
                            {getReminderRelatedEntityTypeLabel("custom")}
                        </MenuItem>
                    </Select>

                    <FormHelperText>
                        Selecciona qué entidad quieres vincular al reminder.
                    </FormHelperText>
                </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
                {relatedEntityType === "" ? (
                    <Box />
                ) : null}

                {relatedEntityType === "transaction" ? (
                    <WorkspaceTransactionSelect
                        workspaceId={workspaceId}
                        value={relatedEntityId}
                        onChange={onRelatedEntityIdChange}
                        label="Transacción relacionada"
                        helperText="Selecciona la transacción relacionada."
                        disabled={disabled}
                        error={Boolean(relatedEntityIdError)}
                        allowEmpty={false}
                    />
                ) : null}

                {relatedEntityType === "receipt" ? (
                    <WorkspaceReceiptSelect
                        workspaceId={workspaceId}
                        value={relatedEntityId}
                        onChange={onRelatedEntityIdChange}
                        label="Recibo relacionado"
                        helperText="Selecciona el recibo relacionado."
                        disabled={disabled}
                        error={Boolean(relatedEntityIdError)}
                        allowEmpty={false}
                    />
                ) : null}

                {relatedEntityType === "debt" ? (
                    <WorkspaceDebtSelect
                        workspaceId={workspaceId}
                        value={relatedEntityId}
                        onChange={onRelatedEntityIdChange}
                        label="Deuda relacionada"
                        helperText="Selecciona la deuda relacionada."
                        disabled={disabled}
                        error={Boolean(relatedEntityIdError)}
                        allowEmpty={false}
                    />
                ) : null}

                {relatedEntityType === "payment" ? (
                    <WorkspacePaymentSelect
                        workspaceId={workspaceId}
                        value={relatedEntityId}
                        onChange={onRelatedEntityIdChange}
                        label="Pago relacionado"
                        helperText="Selecciona el pago relacionado."
                        disabled={disabled}
                        error={Boolean(relatedEntityIdError)}
                        allowEmpty={false}
                    />
                ) : null}

                {relatedEntityType === "budget" ? (
                    <WorkspaceBudgetSelect
                        workspaceId={workspaceId}
                        value={relatedEntityId}
                        onChange={onRelatedEntityIdChange}
                        label="Presupuesto relacionado"
                        helperText="Selecciona el presupuesto relacionado."
                        disabled={disabled}
                        error={Boolean(relatedEntityIdError)}
                        allowEmpty={false}
                    />
                ) : null}

                {relatedEntityType === "saving_goal" ? (
                    <WorkspaceSavingGoalSelect
                        workspaceId={workspaceId}
                        value={relatedEntityId}
                        onChange={onRelatedEntityIdChange}
                        label="Meta de ahorro relacionada"
                        helperText="Selecciona la meta de ahorro relacionada."
                        disabled={disabled}
                        error={Boolean(relatedEntityIdError)}
                        allowEmpty={false}
                    />
                ) : null}

                {relatedEntityType === "account" ? (
                    <WorkspaceAccountSelect
                        workspaceId={workspaceId}
                        value={relatedEntityId}
                        onChange={onRelatedEntityIdChange}
                        label="Cuenta relacionada"
                        helperText="Selecciona la cuenta relacionada."
                        disabled={disabled}
                        error={Boolean(relatedEntityIdError)}
                        allowEmpty={false}
                    />
                ) : null}

                {relatedEntityType === "card" ? (
                    <WorkspaceCardSelect
                        workspaceId={workspaceId}
                        value={relatedEntityId}
                        onChange={onRelatedEntityIdChange}
                        label="Tarjeta relacionada"
                        helperText="Selecciona la tarjeta relacionada."
                        disabled={disabled}
                        error={Boolean(relatedEntityIdError)}
                        allowEmpty={false}
                    />
                ) : null}

                {relatedEntityType === "custom" ? (
                    <TextField
                        label="Referencia personalizada"
                        value={relatedEntityId}
                        onChange={(event) => onRelatedEntityIdChange(event.target.value)}
                        error={Boolean(relatedEntityIdError)}
                        helperText={
                            relatedEntityIdError ??
                            "Escribe una referencia o identificador libre."
                        }
                        disabled={disabled}
                        fullWidth
                    />
                ) : null}

                {!relatedEntityIdError || relatedEntityType === "custom" ? null : (
                    <FormHelperText error>{relatedEntityIdError}</FormHelperText>
                )}
            </Grid>
        </Grid>
    );
}
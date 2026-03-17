// src/features/components/WorkspaceAccountSelect.tsx

import { useId } from "react";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

import { useAccountsQuery } from "../accounts/hooks/useAccountsQuery";

type WorkspaceAccountSelectProps = {
    workspaceId: string | null;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    error?: boolean;
    allowEmpty?: boolean;
    emptyOptionLabel?: string;
};

function getAccountTypeLabel(type: string): string {
    switch (type) {
        case "cash":
            return "Efectivo";
        case "bank":
            return "Banco";
        case "wallet":
            return "Wallet";
        case "savings":
            return "Ahorro";
        case "credit":
            return "Crédito";
        default:
            return type;
    }
}

function buildAccountOptionLabel(account: {
    name: string;
    bankName: string | null;
    type: string;
    currency: string;
}): string {
    const parts: string[] = [account.name];

    if (account.bankName) {
        parts.push(account.bankName);
    }

    parts.push(getAccountTypeLabel(account.type));
    parts.push(account.currency);

    return parts.join(" • ");
}

export function WorkspaceAccountSelect({
    workspaceId,
    value,
    onChange,
    label = "Cuenta",
    helperText,
    disabled = false,
    error = false,
    allowEmpty = false,
    emptyOptionLabel = "Sin cuenta específica",
}: WorkspaceAccountSelectProps) {
    const selectId = useId();
    const labelId = `${selectId}-label`;

    const accountsQuery = useAccountsQuery(workspaceId);
    const accounts = accountsQuery.data?.accounts ?? [];

    const hasSelectedAccount = accounts.some((account) => account.id === value);

    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    const isDisabled = disabled || workspaceId === null || accountsQuery.isLoading;

    const resolvedHelperText = (() => {
        if (workspaceId === null) {
            return "Primero debe existir un workspace activo.";
        }

        if (accountsQuery.isError) {
            return "No se pudieron cargar las cuentas del workspace.";
        }

        if (accountsQuery.isLoading) {
            return "Cargando cuentas...";
        }

        if (accounts.length === 0) {
            return "No hay cuentas disponibles en este workspace.";
        }

        return helperText;
    })();

    return (
        <FormControl fullWidth error={error} disabled={isDisabled}>
            <InputLabel id={labelId}>{label}</InputLabel>

            <Select
                labelId={labelId}
                label={label}
                value={value}
                onChange={handleChange}
            >
                {allowEmpty ? <MenuItem value="">{emptyOptionLabel}</MenuItem> : null}

                {!hasSelectedAccount && value ? (
                    <MenuItem value={value}>{`Cuenta actual (${value})`}</MenuItem>
                ) : null}

                {accounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                        {buildAccountOptionLabel(account)}
                    </MenuItem>
                ))}
            </Select>

            {resolvedHelperText ? <FormHelperText>{resolvedHelperText}</FormHelperText> : null}
        </FormControl>
    );
}
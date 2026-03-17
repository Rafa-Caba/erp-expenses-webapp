// src/features/components/WorkspaceDebtSelect.tsx

import { useId } from "react";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

import { useDebtsQuery } from "../debts/hooks/useDebtsQuery";

type WorkspaceDebtSelectProps = {
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

export function WorkspaceDebtSelect({
    workspaceId,
    value,
    onChange,
    label = "Deuda",
    helperText,
    disabled = false,
    error = false,
    allowEmpty = false,
    emptyOptionLabel = "Sin deuda específica",
}: WorkspaceDebtSelectProps) {
    const selectId = useId();
    const labelId = `${selectId}-label`;

    const debtsQuery = useDebtsQuery(workspaceId);
    const debts = debtsQuery.data?.debts ?? [];

    const hasSelectedDebt = debts.some((debt) => debt._id === value);

    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    const isDisabled = disabled || workspaceId === null || debtsQuery.isLoading;

    const resolvedHelperText = (() => {
        if (workspaceId === null) {
            return "Primero debe existir un workspace activo.";
        }

        if (debtsQuery.isError) {
            return "No se pudieron cargar las deudas del workspace.";
        }

        if (debtsQuery.isLoading) {
            return "Cargando deudas...";
        }

        if (debts.length === 0) {
            return "No hay deudas disponibles en este workspace.";
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

                {!hasSelectedDebt && value ? (
                    <MenuItem value={value}>{`Deuda actual (${value})`}</MenuItem>
                ) : null}

                {debts.map((debt) => (
                    <MenuItem key={debt._id} value={debt._id}>
                        {debt.description}
                    </MenuItem>
                ))}
            </Select>

            {resolvedHelperText ? <FormHelperText>{resolvedHelperText}</FormHelperText> : null}
        </FormControl>
    );
}
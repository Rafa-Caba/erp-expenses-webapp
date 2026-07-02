// src/features/components/WorkspaceDebtSelect.tsx
// Workspace-aware debt selector.
// Besides returning the selected id, this component can return the full selected
// debt so forms can infer cashflowDirection from debt.type.

import { useEffect, useId } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useDebtsQuery } from "../debts/hooks/useDebtsQuery";
import type { DebtRecord, DebtType } from "../debts/types/debt.types";

export type WorkspaceDebtSelectProps = {
    workspaceId: string | null;
    value: string;
    onChange: (value: string) => void;
    onSelectedDebtChange?: (debt: DebtRecord | null) => void;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    error?: boolean;
    allowEmpty?: boolean;
    emptyOptionLabel?: string;
    statusFilter?: DebtRecord["status"] | "ALL";
    includeHidden?: boolean;
};

function formatMoney(amount: number, currency: string): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}

function getDebtTypeLabel(type: DebtType): string {
    return type === "owed_by_me" ? "Debo" : "Me deben";
}

function getDebtOptionLabel(debt: DebtRecord): string {
    return [
        debt.description,
        getDebtTypeLabel(debt.type),
        `Restante: ${formatMoney(debt.remainingAmount, debt.currency)}`,
    ].join(" • ");
}

function matchesDebtFilters(
    debt: DebtRecord,
    statusFilter: DebtRecord["status"] | "ALL",
    includeHidden: boolean
): boolean {
    if (!includeHidden && !debt.isVisible) {
        return false;
    }

    if (statusFilter !== "ALL" && debt.status !== statusFilter) {
        return false;
    }

    return true;
}

function DebtOptionContent({ debt }: { debt: DebtRecord }) {
    return (
        <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                {getDebtOptionLabel(debt)}
            </Typography>

            <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
                sx={{ mt: 0.25 }}
            >
                <Typography variant="caption" sx={{ opacity: 0.72 }}>
                    {debt.personName}
                </Typography>

                <Typography variant="caption" sx={{ opacity: 0.55 }}>
                    {debt.status}
                </Typography>
            </Stack>
        </Box>
    );
}

export function WorkspaceDebtSelect({
    workspaceId,
    value,
    onChange,
    onSelectedDebtChange,
    label = "Deuda",
    helperText,
    disabled = false,
    error = false,
    allowEmpty = false,
    emptyOptionLabel = "Sin deuda específica",
    statusFilter = "ALL",
    includeHidden = true,
}: WorkspaceDebtSelectProps) {
    const selectId = useId();
    const labelId = `${selectId}-label`;

    const debtsQuery = useDebtsQuery(workspaceId);
    const allDebts = debtsQuery.data?.debts ?? [];
    const debts = allDebts.filter((debt) =>
        matchesDebtFilters(debt, statusFilter, includeHidden)
    );

    const selectedDebt = allDebts.find((debt) => debt._id === value) ?? null;
    const selectedIsInVisibleCollection = debts.some((debt) => debt._id === value);

    useEffect(() => {
        onSelectedDebtChange?.(selectedDebt);
    }, [onSelectedDebtChange, selectedDebt]);

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
            return "No hay deudas disponibles con los filtros actuales.";
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
                renderValue={(selectedValue) => {
                    if (!selectedValue) {
                        return emptyOptionLabel;
                    }

                    const currentDebt =
                        allDebts.find((debt) => debt._id === selectedValue) ?? selectedDebt;

                    if (!currentDebt) {
                        return selectedValue;
                    }

                    return <DebtOptionContent debt={currentDebt} />;
                }}
            >
                {allowEmpty ? <MenuItem value="">{emptyOptionLabel}</MenuItem> : null}

                {!selectedIsInVisibleCollection && selectedDebt ? (
                    <MenuItem value={selectedDebt._id}>
                        <DebtOptionContent debt={selectedDebt} />
                    </MenuItem>
                ) : null}

                {debts.map((debt) => (
                    <MenuItem key={debt._id} value={debt._id}>
                        <DebtOptionContent debt={debt} />
                    </MenuItem>
                ))}
            </Select>

            {resolvedHelperText ? <FormHelperText>{resolvedHelperText}</FormHelperText> : null}
        </FormControl>
    );
}
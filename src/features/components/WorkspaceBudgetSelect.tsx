// src/features/components/WorkspaceBudgetSelect.tsx

import { useId } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useBudgetsQuery } from "../budgets/hooks/useBudgetsQuery";
import type { BudgetRecord, BudgetStatus } from "../budgets/types/budget.types";

type WorkspaceBudgetSelectProps = {
    workspaceId: string | null;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    error?: boolean;
    allowEmpty?: boolean;
    emptyOptionLabel?: string;
    statusFilter?: BudgetStatus | "ALL";
    includeHidden?: boolean;
};

function formatMoney(amount: number, currency: string): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}

function getBudgetOptionLabel(budget: BudgetRecord): string {
    return [budget.name, formatMoney(budget.limitAmount, budget.currency)].join(" • ");
}

function matchesFilters(
    budget: BudgetRecord,
    statusFilter: BudgetStatus | "ALL",
    includeHidden: boolean
): boolean {
    if (!includeHidden && !budget.isVisible) {
        return false;
    }

    if (statusFilter !== "ALL" && budget.status !== statusFilter) {
        return false;
    }

    return true;
}

function buildSortedBudgets(
    budgets: BudgetRecord[],
    statusFilter: BudgetStatus | "ALL",
    includeHidden: boolean
): BudgetRecord[] {
    return [...budgets]
        .filter((budget) => matchesFilters(budget, statusFilter, includeHidden))
        .sort((left, right) => left.name.localeCompare(right.name, "es-MX"));
}

function BudgetOptionContent({
    budget,
}: {
    budget: BudgetRecord;
}) {
    return (
        <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                {getBudgetOptionLabel(budget)}
            </Typography>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 0.25 }}>
                <Typography variant="caption" sx={{ opacity: 0.72 }}>
                    {budget.computedStatus}
                </Typography>
            </Stack>
        </Box>
    );
}

export function WorkspaceBudgetSelect({
    workspaceId,
    value,
    onChange,
    label = "Presupuesto",
    helperText,
    disabled = false,
    error = false,
    allowEmpty = true,
    emptyOptionLabel = "Sin presupuesto específico",
    statusFilter = "ALL",
    includeHidden = true,
}: WorkspaceBudgetSelectProps) {
    const selectId = useId();
    const labelId = `${selectId}-label`;

    const budgetsQuery = useBudgetsQuery(workspaceId);
    const allBudgets = budgetsQuery.data?.budgets ?? [];

    const budgets = buildSortedBudgets(allBudgets, statusFilter, includeHidden);

    const selectedBudget =
        allBudgets.find((budget) => budget._id === value) ?? null;

    const selectedIsInVisibleCollection = budgets.some(
        (budget) => budget._id === value
    );

    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    const isDisabled = disabled || workspaceId === null || budgetsQuery.isLoading;

    const resolvedHelperText = (() => {
        if (workspaceId === null) {
            return "Primero debe existir un workspace activo.";
        }

        if (budgetsQuery.isError) {
            return "No se pudieron cargar los presupuestos del workspace.";
        }

        if (budgetsQuery.isLoading) {
            return "Cargando presupuestos...";
        }

        if (budgets.length === 0) {
            return "No hay presupuestos disponibles con los filtros actuales.";
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

                    const currentBudget =
                        allBudgets.find((budget) => budget._id === selectedValue) ??
                        selectedBudget;

                    if (!currentBudget) {
                        return selectedValue;
                    }

                    return <BudgetOptionContent budget={currentBudget} />;
                }}
            >
                {allowEmpty ? <MenuItem value="">{emptyOptionLabel}</MenuItem> : null}

                {!selectedIsInVisibleCollection && selectedBudget ? (
                    <MenuItem value={selectedBudget._id}>
                        <BudgetOptionContent budget={selectedBudget} />
                    </MenuItem>
                ) : null}

                {budgets.map((budget) => (
                    <MenuItem key={budget._id} value={budget._id}>
                        <BudgetOptionContent budget={budget} />
                    </MenuItem>
                ))}
            </Select>

            {resolvedHelperText ? <FormHelperText>{resolvedHelperText}</FormHelperText> : null}
        </FormControl>
    );
}
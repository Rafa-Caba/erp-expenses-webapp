// src/features/components/WorkspaceSavingGoalSelect.tsx

import { useId } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useSavingGoalsQuery } from "../savingGoals/hooks/useSavingGoalsQuery";
import type {
    SavingGoalRecord,
    SavingsGoalStatus,
} from "../savingGoals/types/saving-goal.types";
import { getSavingsGoalCategoryLabel, getSavingsGoalStatusLabel } from "../savingGoals/utils/saving-goal-labels";


type WorkspaceSavingGoalSelectProps = {
    workspaceId: string | null;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    error?: boolean;
    allowEmpty?: boolean;
    emptyOptionLabel?: string;
    statusFilter?: SavingsGoalStatus | "ALL";
    includeHidden?: boolean;
};

function formatMoney(amount: number, currency: string): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}

function getSavingGoalOptionLabel(savingGoal: SavingGoalRecord): string {
    return [
        savingGoal.name,
        `${formatMoney(savingGoal.currentAmount, savingGoal.currency)} / ${formatMoney(
            savingGoal.targetAmount,
            savingGoal.currency
        )}`,
    ].join(" • ");
}

function matchesFilters(
    savingGoal: SavingGoalRecord,
    statusFilter: SavingsGoalStatus | "ALL",
    includeHidden: boolean
): boolean {
    if (!includeHidden && !savingGoal.isVisible) {
        return false;
    }

    if (statusFilter !== "ALL" && savingGoal.status !== statusFilter) {
        return false;
    }

    return true;
}

function buildSortedSavingGoals(
    savingGoals: SavingGoalRecord[],
    statusFilter: SavingsGoalStatus | "ALL",
    includeHidden: boolean
): SavingGoalRecord[] {
    return [...savingGoals]
        .filter((savingGoal) =>
            matchesFilters(savingGoal, statusFilter, includeHidden)
        )
        .sort((left, right) => left.name.localeCompare(right.name, "es-MX"));
}

function SavingGoalOptionContent({
    savingGoal,
}: {
    savingGoal: SavingGoalRecord;
}) {
    return (
        <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                {getSavingGoalOptionLabel(savingGoal)}
            </Typography>

            <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
                sx={{ mt: 0.25 }}
            >
                <Typography variant="caption" sx={{ opacity: 0.72 }}>
                    {getSavingsGoalStatusLabel(savingGoal.status)}
                </Typography>

                <Typography variant="caption" sx={{ opacity: 0.55 }}>
                    {getSavingsGoalCategoryLabel(savingGoal.category)}
                </Typography>
            </Stack>
        </Box>
    );
}

export function WorkspaceSavingGoalSelect({
    workspaceId,
    value,
    onChange,
    label = "Meta de ahorro",
    helperText,
    disabled = false,
    error = false,
    allowEmpty = true,
    emptyOptionLabel = "Sin meta específica",
    statusFilter = "ALL",
    includeHidden = true,
}: WorkspaceSavingGoalSelectProps) {
    const selectId = useId();
    const labelId = `${selectId}-label`;

    const savingGoalsQuery = useSavingGoalsQuery(workspaceId);
    const allSavingGoals = savingGoalsQuery.data?.savingGoals ?? [];

    const savingGoals = buildSortedSavingGoals(
        allSavingGoals,
        statusFilter,
        includeHidden
    );

    const selectedSavingGoal =
        allSavingGoals.find((savingGoal) => savingGoal._id === value) ?? null;

    const selectedIsInVisibleCollection = savingGoals.some(
        (savingGoal) => savingGoal._id === value
    );

    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    const isDisabled = disabled || workspaceId === null || savingGoalsQuery.isLoading;

    const resolvedHelperText = (() => {
        if (workspaceId === null) {
            return "Primero debe existir un workspace activo.";
        }

        if (savingGoalsQuery.isError) {
            return "No se pudieron cargar las metas del workspace.";
        }

        if (savingGoalsQuery.isLoading) {
            return "Cargando metas de ahorro...";
        }

        if (savingGoals.length === 0) {
            return "No hay metas disponibles con los filtros actuales.";
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

                    const currentSavingGoal =
                        allSavingGoals.find(
                            (savingGoal) => savingGoal._id === selectedValue
                        ) ?? selectedSavingGoal;

                    if (!currentSavingGoal) {
                        return selectedValue;
                    }

                    return (
                        <SavingGoalOptionContent savingGoal={currentSavingGoal} />
                    );
                }}
            >
                {allowEmpty ? <MenuItem value="">{emptyOptionLabel}</MenuItem> : null}

                {!selectedIsInVisibleCollection && selectedSavingGoal ? (
                    <MenuItem value={selectedSavingGoal._id}>
                        <SavingGoalOptionContent savingGoal={selectedSavingGoal} />
                    </MenuItem>
                ) : null}

                {savingGoals.map((savingGoal) => (
                    <MenuItem key={savingGoal._id} value={savingGoal._id}>
                        <SavingGoalOptionContent savingGoal={savingGoal} />
                    </MenuItem>
                ))}
            </Select>

            {resolvedHelperText ? <FormHelperText>{resolvedHelperText}</FormHelperText> : null}
        </FormControl>
    );
}
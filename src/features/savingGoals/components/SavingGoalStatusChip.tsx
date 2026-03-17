// src/features/savingGoals/components/SavingGoalStatusChip.tsx

import Chip from "@mui/material/Chip";

import type { SavingsGoalStatus } from "../types/saving-goal.types";
import { getSavingsGoalStatusLabel } from "../utils/saving-goal-labels";

type SavingGoalStatusChipProps = {
    status: SavingsGoalStatus;
};

export function SavingGoalStatusChip({
    status,
}: SavingGoalStatusChipProps) {
    const color =
        status === "active"
            ? "success"
            : status === "completed"
                ? "info"
                : status === "paused"
                    ? "warning"
                    : "default";

    return (
        <Chip
            size="small"
            color={color}
            label={getSavingsGoalStatusLabel(status)}
        />
    );
}
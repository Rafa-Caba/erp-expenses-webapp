// src/features/savingGoals/components/SavingGoalPriorityChip.tsx

import Chip from "@mui/material/Chip";

import type { SavingsGoalPriority } from "../types/saving-goal.types";
import { getSavingsGoalPriorityLabel } from "../utils/saving-goal-labels";

type SavingGoalPriorityChipProps = {
    priority: SavingsGoalPriority | null;
};

export function SavingGoalPriorityChip({
    priority,
}: SavingGoalPriorityChipProps) {
    if (!priority) {
        return null;
    }

    const color =
        priority === "high"
            ? "error"
            : priority === "medium"
                ? "warning"
                : "default";

    return (
        <Chip
            size="small"
            variant="outlined"
            color={color}
            label={getSavingsGoalPriorityLabel(priority)}
        />
    );
}
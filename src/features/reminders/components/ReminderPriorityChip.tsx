// src/features/reminders/components/ReminderPriorityChip.tsx

import Chip from "@mui/material/Chip";

import type { ReminderPriority } from "../types/reminder.types";
import { getReminderPriorityLabel } from "../utils/reminder-labels";

type ReminderPriorityChipProps = {
    priority: ReminderPriority | null;
};

export function ReminderPriorityChip({
    priority,
}: ReminderPriorityChipProps) {
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
            label={getReminderPriorityLabel(priority)}
        />
    );
}
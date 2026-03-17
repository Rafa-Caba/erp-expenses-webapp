// src/features/reminders/components/ReminderStatusChip.tsx

import Chip from "@mui/material/Chip";

import type { ReminderStatus } from "../types/reminder.types";
import { getReminderStatusLabel } from "../utils/reminder-labels";

type ReminderStatusChipProps = {
    status: ReminderStatus;
};

export function ReminderStatusChip({
    status,
}: ReminderStatusChipProps) {
    const color =
        status === "pending"
            ? "warning"
            : status === "done"
                ? "success"
                : "default";

    return (
        <Chip
            size="small"
            color={color}
            label={getReminderStatusLabel(status)}
        />
    );
}
// src/features/reminders/components/ReminderTypeChip.tsx

import Chip from "@mui/material/Chip";

import type { ReminderType } from "../types/reminder.types";
import { getReminderTypeLabel } from "../utils/reminder-labels";

type ReminderTypeChipProps = {
    type: ReminderType;
};

export function ReminderTypeChip({
    type,
}: ReminderTypeChipProps) {
    return (
        <Chip
            size="small"
            variant="outlined"
            label={getReminderTypeLabel(type)}
        />
    );
}
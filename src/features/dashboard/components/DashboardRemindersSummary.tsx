// src/features/dashboard/components/DashboardRemindersSummary.tsx

import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { getReminderTypeLabel } from "../../reminders/utils/reminder-labels";
import type { DashboardRemindersSummary } from "../types/dashboard.types";

type DashboardRemindersSummaryProps = {
    summary: DashboardRemindersSummary;
};

function formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export function DashboardRemindersSummary({
    summary,
}: DashboardRemindersSummaryProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2.5,
                borderRadius: 3,
                height: "100%",
            }}
        >
            <Stack spacing={2}>
                <Stack spacing={0.5}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        Reminders
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        Seguimiento de recordatorios del periodo y próximos vencimientos.
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip color="primary" label={`Pendientes: ${summary.pendingCount}`} />
                    <Chip color="warning" label={`Vencidos: ${summary.overdueCount}`} />
                    <Chip color="success" label={`Hechos: ${summary.doneCount}`} />
                    <Chip variant="outlined" label={`Descartados: ${summary.dismissedCount}`} />
                </Stack>

                <Typography variant="body2">
                    <strong>En periodo:</strong> {summary.scopedTotalCount}
                </Typography>

                {summary.nextReminders.length === 0 ? (
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        No hay reminders próximos para mostrar.
                    </Typography>
                ) : (
                    <Stack spacing={1}>
                        {summary.nextReminders.map((reminder) => (
                            <Paper
                                key={reminder._id}
                                variant="outlined"
                                sx={{ p: 1.25, borderRadius: 2 }}
                            >
                                <Stack spacing={0.5}>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {reminder.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        {getReminderTypeLabel(reminder.type)} • {formatDate(reminder.dueDate)}
                                    </Typography>
                                    {reminder.description ? (
                                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                            {reminder.description}
                                        </Typography>
                                    ) : null}
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
}
// src/features/reminders/components/ReminderDetailDialog.tsx

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import type { ReminderRecord } from "../types/reminder.types";

type ReminderDetailDialogProps = {
    reminder: ReminderRecord | null;
    open: boolean;
    isSubmitting: boolean;
    onClose: () => void;
    onMarkDone: (reminder: ReminderRecord) => void;
    onDismiss: (reminder: ReminderRecord) => void;
    onOpenReminders: () => void;
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

function getReminderTypeLabel(type: string): string {
    switch (type) {
        case "payment_due":
            return "Pago";
        case "debt_due":
            return "Deuda";
        case "budget_alert":
            return "Presupuesto";
        case "saving_goal":
            return "Meta de ahorro";
        case "custom":
            return "Custom";
        default:
            return type;
    }
}

function getReminderPriorityLabel(priority: string): string {
    switch (priority) {
        case "high":
            return "Alta";
        case "medium":
            return "Media";
        case "low":
            return "Baja";
        default:
            return priority;
    }
}

function getReminderPriorityColor(
    priority: string
): "error" | "warning" | "default" {
    if (priority === "high") {
        return "error";
    }

    if (priority === "medium") {
        return "warning";
    }

    return "default";
}

function getReminderStatusLabel(status: string): string {
    switch (status) {
        case "pending":
            return "Pendiente";
        case "done":
            return "Hecho";
        case "dismissed":
            return "Descartado";
        default:
            return status;
    }
}

export function ReminderDetailDialog({
    reminder,
    open,
    isSubmitting,
    onClose,
    onMarkDone,
    onDismiss,
    onOpenReminders,
}: ReminderDetailDialogProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    if (!reminder) {
        return null;
    }

    const canResolve = reminder.status === "pending";

    return (
        <Dialog
            open={open}
            onClose={isSubmitting ? undefined : onClose}
            fullWidth
            maxWidth="sm"
            fullScreen={isMobile}
        >
            <DialogTitle>Detalle del reminder</DialogTitle>

            <DialogContent dividers>
                <Stack spacing={2}>
                    {reminder.isOverdue && reminder.status === "pending" ? (
                        <Alert severity="warning">
                            Este reminder está vencido y sigue pendiente.
                        </Alert>
                    ) : null}

                    <Stack spacing={0.75}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            {reminder.title}
                        </Typography>

                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            <Chip
                                size="small"
                                label={getReminderTypeLabel(reminder.type)}
                                variant="outlined"
                            />
                            <Chip
                                size="small"
                                label={getReminderStatusLabel(reminder.status)}
                                color={
                                    reminder.status === "done"
                                        ? "success"
                                        : reminder.status === "dismissed"
                                            ? "default"
                                            : "primary"
                                }
                                variant={
                                    reminder.status === "pending"
                                        ? "filled"
                                        : "outlined"
                                }
                            />
                            <Chip
                                size="small"
                                label={getReminderPriorityLabel(reminder.priority ?? "")}
                                color={getReminderPriorityColor(reminder.priority ?? "")}
                                variant="outlined"
                            />
                            <Chip
                                size="small"
                                label={reminder.channel}
                                variant="outlined"
                            />
                        </Stack>
                    </Stack>

                    <Divider />

                    <Stack spacing={1}>
                        <Typography variant="body2">
                            <strong>Fecha:</strong> {formatDate(reminder.dueDate)}
                        </Typography>

                        {reminder.relatedEntityType ? (
                            <Typography variant="body2">
                                <strong>Entidad relacionada:</strong>{" "}
                                {reminder.relatedEntityType}
                            </Typography>
                        ) : null}

                        {reminder.relatedEntityId ? (
                            <Typography
                                variant="body2"
                                sx={{
                                    wordBreak: "break-word",
                                }}
                            >
                                <strong>ID relacionado:</strong>{" "}
                                {reminder.relatedEntityId}
                            </Typography>
                        ) : null}
                    </Stack>

                    {reminder.description ? (
                        <>
                            <Divider />
                            <Stack spacing={0.5}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                    Descripción
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {reminder.description}
                                </Typography>
                            </Stack>
                        </>
                    ) : null}
                </Stack>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "stretch",
                        sm: "center",
                    },
                    gap: 1,
                    "& > button": {
                        width: {
                            xs: "100%",
                            sm: "auto",
                        },
                    },
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onOpenReminders}
                    disabled={isSubmitting}
                >
                    Ir a reminders
                </Button>

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={1}
                    sx={{
                        width: {
                            xs: "100%",
                            sm: "auto",
                        },
                        "& > button": {
                            width: {
                                xs: "100%",
                                sm: "auto",
                            },
                        },
                    }}
                >
                    {canResolve ? (
                        <>
                            <Button
                                color="inherit"
                                onClick={() => onDismiss(reminder)}
                                disabled={isSubmitting}
                            >
                                Descartar
                            </Button>

                            <Button
                                variant="contained"
                                onClick={() => onMarkDone(reminder)}
                                disabled={isSubmitting}
                            >
                                Marcar como hecho
                            </Button>
                        </>
                    ) : null}

                    <Button onClick={onClose} disabled={isSubmitting}>
                        Cerrar
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}
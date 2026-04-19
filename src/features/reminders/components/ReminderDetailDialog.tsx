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

import { useWorkspaceMemberLabelById } from "../../../shared/utils/labels/workspace-member-label.util";
import type {
    ReminderMemberResponseRecord,
    ReminderRecord,
} from "../types/reminder.types";
import {
    getReminderChannelLabel,
    getReminderMemberResponseStatusLabel,
    getReminderPriorityLabel,
    getReminderStatusLabel,
    getReminderTypeLabel,
} from "../utils/reminder-labels";

type ReminderDetailDialogProps = {
    reminder: ReminderRecord | null;
    open: boolean;
    isSubmitting: boolean;
    canManage: boolean;
    canRespond: boolean;
    onClose: () => void;
    onEdit: (reminder: ReminderRecord) => void;
    onDelete: (reminder: ReminderRecord) => void;
    onMarkDone: (reminder: ReminderRecord) => void;
    onDismiss: (reminder: ReminderRecord) => void;
    onOpenReminders: () => void;
};

function formatDateTime(value: string | null): string {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function getReminderPriorityColor(
    priority: string | null
): "error" | "warning" | "default" {
    if (priority === "high") {
        return "error";
    }

    if (priority === "medium") {
        return "warning";
    }

    return "default";
}

function getReminderStatusColor(
    status: ReminderRecord["status"]
): "warning" | "info" | "success" {
    if (status === "pending") {
        return "warning";
    }

    if (status === "in_progress") {
        return "info";
    }

    return "success";
}

function getResponseChipColor(
    status: ReminderMemberResponseRecord["status"]
): "warning" | "success" | "default" {
    if (status === "pending") {
        return "warning";
    }

    if (status === "done") {
        return "success";
    }

    return "default";
}

function ReminderResponseRow({
    workspaceId,
    response,
}: {
    workspaceId: string;
    response: ReminderMemberResponseRecord;
}) {
    const memberLabel = useWorkspaceMemberLabelById(
        workspaceId,
        response.memberId
    ).label;

    return (
        <Stack
            spacing={0.75}
            sx={{
                p: 1.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {memberLabel}
                </Typography>

                <Chip
                    size="small"
                    color={getResponseChipColor(response.status)}
                    label={getReminderMemberResponseStatusLabel(response.status)}
                />
            </Stack>

            <Typography variant="caption" sx={{ opacity: 0.75 }}>
                <strong>Visto:</strong> {formatDateTime(response.viewedAt)}
            </Typography>

            <Typography variant="caption" sx={{ opacity: 0.75 }}>
                <strong>Respondió:</strong> {formatDateTime(response.respondedAt)}
            </Typography>
        </Stack>
    );
}

export function ReminderDetailDialog({
    reminder,
    open,
    isSubmitting,
    canManage,
    canRespond,
    onClose,
    onEdit,
    onDelete,
    onMarkDone,
    onDismiss,
    onOpenReminders,
}: ReminderDetailDialogProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const creatorLabel = useWorkspaceMemberLabelById(
        reminder?.workspaceId ?? "",
        reminder?.createdByMemberId ?? null
    ).label;

    if (!reminder) {
        return null;
    }

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
                    {reminder.isOverdue && reminder.status !== "resolved" ? (
                        <Alert severity="warning">
                            Este reminder está vencido y aún no ha sido resuelto por todos.
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
                                color={getReminderStatusColor(reminder.status)}
                                variant={reminder.status === "resolved" ? "outlined" : "filled"}
                            />
                            <Chip
                                size="small"
                                label={getReminderPriorityLabel(reminder.priority)}
                                color={getReminderPriorityColor(reminder.priority)}
                                variant="outlined"
                            />
                            <Chip
                                size="small"
                                label={getReminderChannelLabel(reminder.channel)}
                                variant="outlined"
                            />
                        </Stack>
                    </Stack>

                    <Divider />

                    <Stack spacing={1}>
                        <Typography variant="body2">
                            <strong>Creado por:</strong> {creatorLabel}
                        </Typography>

                        <Typography variant="body2">
                            <strong>Fecha:</strong> {formatDateTime(reminder.dueDate)}
                        </Typography>

                        <Typography variant="body2">
                            <strong>Destinatarios:</strong>{" "}
                            {reminder.responseSummary.totalRecipients}
                        </Typography>

                        <Typography variant="body2">
                            <strong>Progreso:</strong>{" "}
                            {reminder.responseSummary.totalResponded} respondieron,{" "}
                            {reminder.responseSummary.totalPending} pendientes,{" "}
                            {reminder.responseSummary.totalViewed} vistos
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

                    <Divider />

                    <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            Respuestas de miembros
                        </Typography>

                        {reminder.responses.map((response) => (
                            <ReminderResponseRow
                                key={response.memberId}
                                workspaceId={reminder.workspaceId}
                                response={response}
                            />
                        ))}
                    </Stack>
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
                    {canManage ? (
                        <>
                            <Button
                                variant="outlined"
                                onClick={() => onEdit(reminder)}
                                disabled={isSubmitting}
                            >
                                Editar
                            </Button>

                            <Button
                                color="warning"
                                variant="outlined"
                                onClick={() => onDelete(reminder)}
                                disabled={isSubmitting}
                            >
                                Eliminar
                            </Button>
                        </>
                    ) : null}

                    {!canManage && canRespond ? (
                        <>
                            <Button
                                color="inherit"
                                onClick={() => onDismiss(reminder)}
                                disabled={isSubmitting}
                            >
                                Descartar para mí
                            </Button>

                            <Button
                                variant="contained"
                                onClick={() => onMarkDone(reminder)}
                                disabled={isSubmitting}
                            >
                                Marcar hecho para mí
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
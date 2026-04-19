// src/features/reminders/components/ReminderCard.tsx

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useWorkspaceMemberLabelById } from "../../../shared/utils/labels/workspace-member-label.util";
import type { ReminderRecord } from "../types/reminder.types";
import {
    getReminderAudienceLabel,
    getReminderChannelLabel,
    getReminderPriorityLabel,
    getReminderRelatedEntityTypeLabel,
} from "../utils/reminder-labels";
import { ReminderPriorityChip } from "./ReminderPriorityChip";
import { ReminderRelatedEntityLabel } from "./ReminderRelatedEntityLabel";
import { ReminderStatusChip } from "./ReminderStatusChip";
import { ReminderTypeChip } from "./ReminderTypeChip";

type ReminderCardProps = {
    reminder: ReminderRecord;
    isSelected: boolean;
    canManage: boolean;
    canRespond: boolean;
    isResponding: boolean;
    onEdit: (reminder: ReminderRecord) => void;
    onDelete: (reminder: ReminderRecord) => void;
    onMarkDone: (reminder: ReminderRecord) => void;
    onDismiss: (reminder: ReminderRecord) => void;
};

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(new Date(value));
}

function getVisibilityLabel(isVisible: boolean): string {
    return isVisible ? "Visible" : "Oculto";
}

export function ReminderCard({
    reminder,
    isSelected,
    canManage,
    canRespond,
    isResponding,
    onEdit,
    onDelete,
    onMarkDone,
    onDismiss,
}: ReminderCardProps) {
    const singleRecipientId =
        reminder.recipientMemberIds.length === 1
            ? reminder.recipientMemberIds[0]
            : null;

    const singleRecipientLabel = useWorkspaceMemberLabelById(
        reminder.workspaceId,
        singleRecipientId
    ).label;

    const creatorLabel = useWorkspaceMemberLabelById(
        reminder.workspaceId,
        reminder.createdByMemberId
    ).label;

    const audienceLabel =
        reminder.recipientMemberIds.length === 1
            ? singleRecipientLabel
            : `${getReminderAudienceLabel(reminder.recipientMemberIds.length)} (${reminder.responseSummary.totalRecipients})`;

    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                borderRadius: 3,
                borderColor: isSelected ? "primary.main" : "divider",
                boxShadow: isSelected ? 3 : 0,
            }}
        >
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <ReminderTypeChip type={reminder.type} />
                    <ReminderStatusChip status={reminder.status} />
                    <ReminderPriorityChip priority={reminder.priority} />
                    <Chip
                        size="small"
                        variant="outlined"
                        label={getVisibilityLabel(reminder.isVisible)}
                    />
                    {reminder.isRecurring ? (
                        <Chip size="small" variant="outlined" label="Recurrente" />
                    ) : null}
                    {reminder.isOverdue && reminder.status !== "resolved" ? (
                        <Chip size="small" color="error" label="Vencido" />
                    ) : null}
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {reminder.title}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        {reminder.description ?? "Sin descripción"}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Fecha límite:</strong> {formatDate(reminder.dueDate)}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Canal:</strong> {getReminderChannelLabel(reminder.channel)}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Creado por:</strong> {creatorLabel}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Dirigido a:</strong> {audienceLabel}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Progreso:</strong>{" "}
                        {reminder.responseSummary.totalResponded} de{" "}
                        {reminder.responseSummary.totalRecipients} respondieron
                    </Typography>

                    <Typography variant="body2">
                        <strong>Vistos:</strong>{" "}
                        {reminder.responseSummary.totalViewed} de{" "}
                        {reminder.responseSummary.totalRecipients}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Entidad:</strong>{" "}
                        {reminder.relatedEntityType
                            ? getReminderRelatedEntityTypeLabel(reminder.relatedEntityType)
                            : "Sin entidad relacionada"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Relacionado con:</strong>{" "}
                        <ReminderRelatedEntityLabel
                            workspaceId={reminder.workspaceId}
                            relatedEntityType={reminder.relatedEntityType}
                            relatedEntityId={reminder.relatedEntityId}
                        />
                    </Typography>

                    <Typography variant="body2">
                        <strong>Prioridad:</strong>{" "}
                        {getReminderPriorityLabel(reminder.priority)}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Recurrencia:</strong>{" "}
                        {reminder.isRecurring
                            ? reminder.recurrenceRule ?? "Recurrente sin regla"
                            : "No recurrente"}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                {canManage ? (
                    <>
                        <Button variant="outlined" fullWidth onClick={() => onEdit(reminder)}>
                            Editar
                        </Button>

                        <Button
                            variant="outlined"
                            color="warning"
                            fullWidth
                            onClick={() => onDelete(reminder)}
                        >
                            Eliminar
                        </Button>
                    </>
                ) : null}

                {!canManage && canRespond ? (
                    <>
                        <Button
                            variant="outlined"
                            color="inherit"
                            fullWidth
                            disabled={isResponding}
                            onClick={() => onDismiss(reminder)}
                        >
                            Descartar
                        </Button>

                        <Button
                            variant="contained"
                            fullWidth
                            disabled={isResponding}
                            onClick={() => onMarkDone(reminder)}
                        >
                            Marcar hecho
                        </Button>
                    </>
                ) : null}
            </CardActions>
        </Card>
    );
}
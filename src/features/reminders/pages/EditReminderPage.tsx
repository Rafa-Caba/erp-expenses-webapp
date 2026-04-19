// src/features/reminders/pages/EditReminderPage.tsx

import { Navigate, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import { useWorkspaceMemberLabelById } from "../../../shared/utils/labels/workspace-member-label.util";
import { Page } from "../../../shared/ui/Page/Page";
import { ReminderForm, type ReminderFormValues } from "../components/ReminderForm";
import { useReminderByIdQuery } from "../hooks/useReminderByIdQuery";
import { useUpdateReminderMutation } from "../hooks/useReminderMutations";
import type { ReminderRecord, UpdateReminderPayload } from "../types/reminder.types";

function getRemindersBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/reminders";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/reminders`;
}

function toDateInputValue(value: string): string {
    return value.slice(0, 10);
}

function EditReminderFormBridge({
    reminder,
    workspaceId,
    isSubmitting,
    submitErrorMessage,
    onSubmit,
    onCancel,
}: {
    reminder: ReminderRecord;
    workspaceId: string;
    isSubmitting: boolean;
    submitErrorMessage: string | null;
    onSubmit: (values: ReminderFormValues) => void;
    onCancel: () => void;
}) {
    const singleRecipientId =
        reminder.recipientMemberIds.length === 1
            ? reminder.recipientMemberIds[0]
            : null;

    const singleRecipientLabel = useWorkspaceMemberLabelById(
        workspaceId,
        singleRecipientId
    ).label;

    const initialValues: ReminderFormValues = {
        targetMemberId: singleRecipientId ?? "",
        title: reminder.title,
        description: reminder.description ?? "",
        type: reminder.type,
        relatedEntityType: reminder.relatedEntityType ?? "",
        relatedEntityId: reminder.relatedEntityId ?? "",
        dueDate: toDateInputValue(reminder.dueDate),
        isRecurring: reminder.isRecurring,
        recurrenceRule: reminder.recurrenceRule ?? "",
        priority: reminder.priority ?? "",
        channel: reminder.channel,
        isVisible: reminder.isVisible,
    };

    const subtitle =
        reminder.recipientMemberIds.length === 1
            ? `Actualmente dirigido a ${singleRecipientLabel}.`
            : `Actualmente dirigido a ${reminder.responseSummary.totalRecipients} miembros.`;

    return (
        <>
            <Alert severity="info" sx={{ mb: 3 }}>
                {subtitle} Si seleccionas un miembro, el reminder quedará individual.
                Si lo dejas vacío, quedará para todos los miembros activos.
            </Alert>

            <ReminderForm
                mode="edit"
                workspaceId={workspaceId}
                initialValues={initialValues}
                isSubmitting={isSubmitting}
                submitErrorMessage={submitErrorMessage}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        </>
    );
}

function toUpdateReminderPayload(values: ReminderFormValues): UpdateReminderPayload {
    return {
        targetMemberId: values.targetMemberId.trim() || null,
        title: values.title.trim(),
        description: values.description.trim() || null,
        type: values.type,
        relatedEntityType: values.relatedEntityType || null,
        relatedEntityId: values.relatedEntityType
            ? values.relatedEntityId.trim() || null
            : null,
        dueDate: values.dueDate,
        isRecurring: values.isRecurring,
        recurrenceRule: values.isRecurring ? values.recurrenceRule.trim() || null : null,
        priority: values.priority || null,
        channel: values.channel,
        isVisible: values.isVisible,
    };
}

export function EditReminderPage() {
    const navigate = useNavigate();
    const params = useParams<{ reminderId: string }>();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const reminderId = params.reminderId ?? null;

    const reminderQuery = useReminderByIdQuery(workspaceId, reminderId);
    const updateReminderMutation = useUpdateReminderMutation();

    if (!workspaceId || !reminderId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const remindersBasePath = getRemindersBasePath(scopeType, workspaceId);

    if (reminderQuery.isLoading) {
        return (
            <Page
                title="Editar reminder"
                subtitle="Cargando la información actual del reminder."
            >
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />

                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando reminder…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo los datos actuales del reminder.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (reminderQuery.isError || !reminderQuery.data) {
        return (
            <Page
                title="Editar reminder"
                subtitle="No fue posible cargar el reminder."
            >
                <Alert severity="error">
                    {getApiErrorMessage(
                        reminderQuery.error,
                        "No se pudo obtener el reminder."
                    )}
                </Alert>
            </Page>
        );
    }

    const submitErrorMessage = updateReminderMutation.isError
        ? getApiErrorMessage(
            updateReminderMutation.error,
            "No se pudo actualizar el reminder."
        )
        : null;

    const handleSubmit = (values: ReminderFormValues) => {
        const payload = toUpdateReminderPayload(values);

        updateReminderMutation.mutate(
            {
                workspaceId,
                reminderId,
                payload,
            },
            {
                onSuccess: () => {
                    navigate(remindersBasePath);
                },
            }
        );
    };

    const handleCancel = () => {
        navigate(remindersBasePath);
    };

    return (
        <Page
            title="Editar reminder"
            subtitle="Actualiza recordatorio, fecha, recurrencia y audiencia."
        >
            <EditReminderFormBridge
                reminder={reminderQuery.data}
                workspaceId={workspaceId}
                isSubmitting={updateReminderMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
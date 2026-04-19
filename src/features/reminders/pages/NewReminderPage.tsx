// src/features/reminders/pages/NewReminderPage.tsx

import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import { Page } from "../../../shared/ui/Page/Page";
import { ReminderForm, type ReminderFormValues } from "../components/ReminderForm";
import { useCreateReminderMutation } from "../hooks/useReminderMutations";
import type { CreateReminderPayload } from "../types/reminder.types";

function getRemindersBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/reminders";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/reminders`;
}

function getTodayDateInputValue(): string {
    return new Date().toISOString().slice(0, 10);
}

const INITIAL_VALUES: ReminderFormValues = {
    targetMemberId: "",
    title: "",
    description: "",
    type: "custom",
    relatedEntityType: "",
    relatedEntityId: "",
    dueDate: getTodayDateInputValue(),
    isRecurring: false,
    recurrenceRule: "",
    priority: "",
    channel: "in_app",
    isVisible: true,
};

function toCreateReminderPayload(values: ReminderFormValues): CreateReminderPayload {
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

export function NewReminderPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const createReminderMutation = useCreateReminderMutation();

    if (!workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const remindersBasePath = getRemindersBasePath(scopeType, workspaceId);

    const submitErrorMessage = createReminderMutation.isError
        ? getApiErrorMessage(
            createReminderMutation.error,
            "No se pudo crear el reminder."
        )
        : null;

    const handleSubmit = React.useCallback(
        (values: ReminderFormValues) => {
            const payload = toCreateReminderPayload(values);

            createReminderMutation.mutate(
                {
                    workspaceId,
                    payload,
                },
                {
                    onSuccess: () => {
                        navigate(remindersBasePath);
                    },
                }
            );
        },
        [createReminderMutation, navigate, remindersBasePath, workspaceId]
    );

    const handleCancel = React.useCallback(() => {
        navigate(remindersBasePath);
    }, [navigate, remindersBasePath]);

    return (
        <Page
            title="Nuevo reminder"
            subtitle="Agrega un nuevo recordatorio al workspace activo."
        >
            <ReminderForm
                mode="create"
                workspaceId={workspaceId}
                initialValues={INITIAL_VALUES}
                isSubmitting={createReminderMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
// src/features/reminders/hooks/useReminderMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { dashboardQueryKeys } from "../../dashboard/api/dashboard.queryKeys";
import { reminderQueryKeys } from "../api/reminder.queryKeys";
import { createReminderService } from "../services/reminder.service";
import type {
    CreateReminderPayload,
    ReminderResponse,
    RespondToReminderPayload,
    UpdateReminderPayload,
} from "../types/reminder.types";

const reminderService = createReminderService(apiClient);

type CreateReminderMutationPayload = {
    workspaceId: string;
    payload: CreateReminderPayload;
};

type UpdateReminderMutationPayload = {
    workspaceId: string;
    reminderId: string;
    payload: UpdateReminderPayload;
};

type DeleteReminderMutationPayload = {
    workspaceId: string;
    reminderId: string;
};

type MarkReminderViewedMutationPayload = {
    workspaceId: string;
    reminderId: string;
};

type RespondToReminderMutationPayload = {
    workspaceId: string;
    reminderId: string;
    payload: RespondToReminderPayload;
};

function invalidateReminderQueries(
    queryClient: ReturnType<typeof useQueryClient>,
    response: ReminderResponse
): void {
    queryClient.invalidateQueries({
        queryKey: reminderQueryKeys.all,
    });

    queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.all,
    });

    queryClient.setQueryData(
        reminderQueryKeys.detail(
            response.reminder.workspaceId,
            response.reminder._id
        ),
        response.reminder
    );
}

export function useCreateReminderMutation() {
    const queryClient = useQueryClient();

    return useMutation<ReminderResponse, Error, CreateReminderMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            reminderService.createReminder(workspaceId, payload),
        onSuccess: (response) => {
            invalidateReminderQueries(queryClient, response);
        },
    });
}

export function useUpdateReminderMutation() {
    const queryClient = useQueryClient();

    return useMutation<ReminderResponse, Error, UpdateReminderMutationPayload>({
        mutationFn: ({ workspaceId, reminderId, payload }) =>
            reminderService.updateReminder(workspaceId, reminderId, payload),
        onSuccess: (response) => {
            invalidateReminderQueries(queryClient, response);
        },
    });
}

export function useMarkReminderViewedMutation() {
    const queryClient = useQueryClient();

    return useMutation<ReminderResponse, Error, MarkReminderViewedMutationPayload>({
        mutationFn: ({ workspaceId, reminderId }) =>
            reminderService.markReminderAsViewed(workspaceId, reminderId),
        onSuccess: (response) => {
            invalidateReminderQueries(queryClient, response);
        },
    });
}

export function useRespondToReminderMutation() {
    const queryClient = useQueryClient();

    return useMutation<ReminderResponse, Error, RespondToReminderMutationPayload>({
        mutationFn: ({ workspaceId, reminderId, payload }) =>
            reminderService.respondToReminder(workspaceId, reminderId, payload),
        onSuccess: (response) => {
            invalidateReminderQueries(queryClient, response);
        },
    });
}

export function useDeleteReminderMutation() {
    const queryClient = useQueryClient();

    return useMutation<ReminderResponse, Error, DeleteReminderMutationPayload>({
        mutationFn: ({ workspaceId, reminderId }) =>
            reminderService.deleteReminder(workspaceId, reminderId),
        onSuccess: (response) => {
            invalidateReminderQueries(queryClient, response);
        },
    });
}
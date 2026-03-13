// src/reminders/services/reminder.service.ts

import type { AxiosInstance } from "axios";

import type {
    CreateReminderPayload,
    ReminderResponse,
    RemindersResponse,
    UpdateReminderPayload,
} from "../types/reminder.types";

export function createReminderService(apiClient: AxiosInstance) {
    return {
        getReminders(workspaceId: string): Promise<RemindersResponse> {
            return apiClient
                .get<RemindersResponse>(`/api/workspaces/${workspaceId}/reminders`)
                .then(({ data }) => data);
        },

        getReminderById(
            workspaceId: string,
            reminderId: string
        ): Promise<ReminderResponse> {
            return apiClient
                .get<ReminderResponse>(
                    `/api/workspaces/${workspaceId}/reminders/${reminderId}`
                )
                .then(({ data }) => data);
        },

        createReminder(
            workspaceId: string,
            payload: CreateReminderPayload
        ): Promise<ReminderResponse> {
            return apiClient
                .post<ReminderResponse>(`/api/workspaces/${workspaceId}/reminders`, payload)
                .then(({ data }) => data);
        },

        updateReminder(
            workspaceId: string,
            reminderId: string,
            payload: UpdateReminderPayload
        ): Promise<ReminderResponse> {
            return apiClient
                .patch<ReminderResponse>(
                    `/api/workspaces/${workspaceId}/reminders/${reminderId}`,
                    payload
                )
                .then(({ data }) => data);
        },

        deleteReminder(
            workspaceId: string,
            reminderId: string
        ): Promise<ReminderResponse> {
            return apiClient
                .delete<ReminderResponse>(
                    `/api/workspaces/${workspaceId}/reminders/${reminderId}`
                )
                .then(({ data }) => data);
        },
    };
}
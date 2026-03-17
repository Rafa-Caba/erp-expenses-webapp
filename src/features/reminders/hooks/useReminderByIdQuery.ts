// src/features/reminders/hooks/useReminderByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { reminderQueryKeys } from "../api/reminder.queryKeys";
import { createReminderService } from "../services/reminder.service";
import type { ReminderRecord } from "../types/reminder.types";

const reminderService = createReminderService(apiClient);

export function useReminderByIdQuery(
    workspaceId: string | null,
    reminderId: string | null
) {
    return useQuery({
        queryKey:
            workspaceId && reminderId
                ? reminderQueryKeys.detail(workspaceId, reminderId)
                : reminderQueryKeys.details(),
        queryFn: async (): Promise<ReminderRecord> => {
            if (!workspaceId || !reminderId) {
                throw new Error("Workspace ID and reminder ID are required");
            }

            const response = await reminderService.getReminderById(
                workspaceId,
                reminderId
            );

            return response.reminder;
        },
        enabled: workspaceId !== null && reminderId !== null,
        staleTime: 30_000,
    });
}
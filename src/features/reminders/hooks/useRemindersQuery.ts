// src/features/reminders/hooks/useRemindersQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { reminderQueryKeys } from "../api/reminder.queryKeys";
import { createReminderService } from "../services/reminder.service";

const reminderService = createReminderService(apiClient);

export function useRemindersQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId
            ? reminderQueryKeys.list(workspaceId)
            : reminderQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return reminderService.getReminders(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}
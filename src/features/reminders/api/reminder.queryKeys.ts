// src/features/reminders/api/reminder.queryKeys.ts

export const reminderQueryKeys = {
    all: ["reminders"] as const,

    lists: () => ["reminders", "list"] as const,

    list: (workspaceId: string) => ["reminders", "list", workspaceId] as const,

    details: () => ["reminders", "detail"] as const,

    detail: (workspaceId: string, reminderId: string) =>
        ["reminders", "detail", workspaceId, reminderId] as const,
};
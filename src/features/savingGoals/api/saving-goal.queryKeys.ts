// src/features/savingGoals/api/saving-goal.queryKeys.ts

export const savingGoalQueryKeys = {
    all: ["savingGoals"] as const,

    lists: () => ["savingGoals", "list"] as const,

    list: (workspaceId: string) => ["savingGoals", "list", workspaceId] as const,

    details: () => ["savingGoals", "detail"] as const,

    detail: (workspaceId: string, savingGoalId: string) =>
        ["savingGoals", "detail", workspaceId, savingGoalId] as const,
};
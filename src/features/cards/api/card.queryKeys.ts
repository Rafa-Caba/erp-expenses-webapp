// src/features/cards/api/card.queryKeys.ts

export const cardQueryKeys = {
    all: ["cards"] as const,

    lists: () => ["cards", "list"] as const,

    list: (workspaceId: string) => ["cards", "list", workspaceId] as const,

    details: () => ["cards", "detail"] as const,

    detail: (workspaceId: string, cardId: string) =>
        ["cards", "detail", workspaceId, cardId] as const,
};
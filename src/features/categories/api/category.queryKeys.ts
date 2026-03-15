// src/features/categories/api/category.queryKeys.ts

export const categoryQueryKeys = {
    all: ["categories"] as const,

    lists: () => ["categories", "list"] as const,

    list: (workspaceId: string) => ["categories", "list", workspaceId] as const,

    details: () => ["categories", "detail"] as const,

    detail: (workspaceId: string, categoryId: string) =>
        ["categories", "detail", workspaceId, categoryId] as const,
};
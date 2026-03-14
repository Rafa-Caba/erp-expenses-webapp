// src/features/adminUsers/api/user.queryKeys.ts

import type { ListUsersQuery } from "../types/user.types";

export const userQueryKeys = {
    all: ["admin-users"] as const,

    lists: () => ["admin-users", "list"] as const,

    list: (query: ListUsersQuery) =>
        [
            "admin-users",
            "list",
            query.page ?? 1,
            query.limit ?? 25,
            query.search ?? "",
            query.isActive === undefined ? "ALL" : query.isActive ? "ACTIVE" : "INACTIVE",
            query.role ?? "ALL",
        ] as const,

    details: () => ["admin-users", "detail"] as const,

    detail: (userId: string) => ["admin-users", "detail", userId] as const,
};
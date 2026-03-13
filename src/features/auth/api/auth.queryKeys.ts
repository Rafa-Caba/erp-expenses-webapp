// src/features/auth/api/auth.queryKeys.ts

export const authQueryKeys = {
    all: ["auth"] as const,
    me: () => ["auth", "me"] as const,
};
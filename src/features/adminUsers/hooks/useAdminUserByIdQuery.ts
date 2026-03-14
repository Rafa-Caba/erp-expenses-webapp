// src/features/adminUsers/hooks/useAdminUserByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { createUserService } from "../services/user.service";
import { userQueryKeys } from "../api/user.queryKeys";
import type { UserRecord } from "../types/user.types";

const userService = createUserService(apiClient);

export function useAdminUserByIdQuery(userId: string | null) {
    return useQuery<UserRecord>({
        queryKey: userId ? userQueryKeys.detail(userId) : userQueryKeys.details(),
        queryFn: async () => {
            if (!userId) {
                throw new Error("User ID is required");
            }

            return userService.getUserById(userId);
        },
        enabled: userId !== null,
        staleTime: 30_000,
    });
}
// src/features/adminUsers/hooks/useAdminUsersQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { createUserService } from "../services/user.service";
import { userQueryKeys } from "../api/user.queryKeys";
import type { ListUsersQuery, UserListResponse } from "../types/user.types";

const userService = createUserService(apiClient);

export function useAdminUsersQuery(query: ListUsersQuery) {
    return useQuery<UserListResponse>({
        queryKey: userQueryKeys.list(query),
        queryFn: () => userService.listUsers(query),
        staleTime: 30_000,
    });
}
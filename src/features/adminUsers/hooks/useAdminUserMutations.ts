// src/features/adminUsers/hooks/useAdminUserMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { createUserService } from "../services/user.service";
import { userQueryKeys } from "../api/user.queryKeys";
import type {
    CreateUserPayload,
    DeleteUserResponse,
    UpdateUserPayload,
    UserRecord,
} from "../types/user.types";

const userService = createUserService(apiClient);

type UpdateAdminUserMutationPayload = {
    userId: string;
    payload: UpdateUserPayload;
};

export function useCreateAdminUserMutation() {
    const queryClient = useQueryClient();

    return useMutation<UserRecord, Error, CreateUserPayload>({
        mutationFn: (payload) => userService.createUser(payload),
        onSuccess: (user) => {
            queryClient.invalidateQueries({
                queryKey: userQueryKeys.all,
            });

            queryClient.setQueryData<UserRecord>(userQueryKeys.detail(user.id), user);
        },
    });
}

export function useUpdateAdminUserMutation() {
    const queryClient = useQueryClient();

    return useMutation<UserRecord, Error, UpdateAdminUserMutationPayload>({
        mutationFn: ({ userId, payload }) => userService.updateUser(userId, payload),
        onSuccess: (user) => {
            queryClient.invalidateQueries({
                queryKey: userQueryKeys.all,
            });

            queryClient.setQueryData<UserRecord>(userQueryKeys.detail(user.id), user);
        },
    });
}

export function useDeleteAdminUserMutation() {
    const queryClient = useQueryClient();

    return useMutation<DeleteUserResponse, Error, string>({
        mutationFn: (userId) => userService.deleteUser(userId),
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({
                queryKey: userQueryKeys.all,
            });

            queryClient.removeQueries({
                queryKey: userQueryKeys.detail(userId),
            });
        },
    });
}
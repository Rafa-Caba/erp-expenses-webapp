// src/features/adminUsers/hooks/useAdminUserMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { createAuthService } from "../../auth/services/auth.service";
import type { ResendVerificationResponse } from "../../auth/types/auth.types";
import { createUserService } from "../services/user.service";
import { userQueryKeys } from "../api/user.queryKeys";
import type {
    AdminResetUserPasswordPayload,
    AdminResetUserPasswordResponse,
    CreateUserPayload,
    DeleteUserResponse,
    UpdateUserPayload,
    UserRecord,
} from "../types/user.types";

const userService = createUserService(apiClient);
const authService = createAuthService(apiClient);

type UpdateAdminUserMutationPayload = {
    userId: string;
    payload: UpdateUserPayload;
};

type ResendAdminUserVerificationPayload = {
    email: string;
};

type AdminResetUserPasswordMutationPayload = {
    userId: string;
    payload: AdminResetUserPasswordPayload;
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

export function useAdminResetUserPasswordMutation() {
    const queryClient = useQueryClient();

    return useMutation<
        AdminResetUserPasswordResponse,
        Error,
        AdminResetUserPasswordMutationPayload
    >({
        mutationFn: ({ userId, payload }) => userService.resetUserPassword(userId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: userQueryKeys.all,
            });

            queryClient.setQueryData<UserRecord>(
                userQueryKeys.detail(response.user.id),
                response.user
            );
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

export function useResendAdminUserVerificationMutation() {
    return useMutation<ResendVerificationResponse, Error, ResendAdminUserVerificationPayload>({
        mutationFn: ({ email }) =>
            authService.resendVerificationEmail({
                email,
            }),
    });
}
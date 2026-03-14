// src/features/profile/hooks/useProfileMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { authQueryKeys } from "../../auth/api/auth.queryKeys";
import { createAuthService } from "../../auth/services/auth.service";
import { useAuthStore } from "../../auth/store/auth.store";
import type {
    AuthUser,
    ChangePasswordPayload,
    ChangePasswordResponse,
} from "../../auth/types/auth.types";

const authService = createAuthService(apiClient);

export function useUpdateProfileMutation() {
    const queryClient = useQueryClient();

    return useMutation<AuthUser, Error, FormData>({
        mutationFn: (payload) => authService.updateMe(payload),
        onSuccess: (user) => {
            useAuthStore.getState().setUser(user);

            queryClient.setQueryData(["admin-users", "detail", user.id], user);
        },
    });
}

export function useChangeProfilePasswordMutation() {
    const queryClient = useQueryClient();

    return useMutation<ChangePasswordResponse, Error, ChangePasswordPayload>({
        mutationFn: (payload) => authService.changePassword(payload),
        onSuccess: (response) => {
            useAuthStore.getState().setUser(response.user);

            queryClient.setQueryData(authQueryKeys.me(), response.user);
        },
    });
}
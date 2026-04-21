// src/features/auth/hooks/useAuthMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { authQueryKeys } from "../api/auth.queryKeys";
import { useAuthStore } from "../store/auth.store";
import type {
    AuthSuccessResponse,
    ForgotPasswordPayload,
    ForgotPasswordResponse,
    LoginPayload,
    LogoutResponse,
    RegisterPayload,
    ResendVerificationPayload,
    ResendVerificationResponse,
    ResetPasswordPayload,
    VerifyEmailPayload,
    VerifyEmailResponse,
} from "../types/auth.types";
import { createAuthService } from "../services/auth.service";

const authService = createAuthService(apiClient);

const LOCAL_LOGOUT_RESPONSE: LogoutResponse = {
    message: "Sesión cerrada localmente",
};

export function useLoginMutation() {
    const queryClient = useQueryClient();

    return useMutation<AuthSuccessResponse, Error, LoginPayload>({
        mutationFn: (payload) => authService.login(payload),
        onSuccess: (response) => {
            useAuthStore.getState().setTokens(response.tokens);
            useAuthStore.getState().setUser(response.user);
            useAuthStore.getState().setStatus("AUTHENTICATED");

            queryClient.setQueryData(authQueryKeys.me(), response.user);
        },
    });
}

export function useRegisterMutation() {
    const queryClient = useQueryClient();

    return useMutation<AuthSuccessResponse, Error, RegisterPayload>({
        mutationFn: (payload) => authService.register(payload),
        onSuccess: (response) => {
            useAuthStore.getState().setTokens(response.tokens);
            useAuthStore.getState().setUser(response.user);
            useAuthStore.getState().setStatus("AUTHENTICATED");

            queryClient.setQueryData(authQueryKeys.me(), response.user);
        },
    });
}

export function useVerifyEmailMutation() {
    const queryClient = useQueryClient();

    return useMutation<VerifyEmailResponse, Error, VerifyEmailPayload>({
        mutationFn: (payload) => authService.verifyEmail(payload),
        onSuccess: (response) => {
            const currentUser = useAuthStore.getState().user;

            if (currentUser && currentUser.id === response.user.id) {
                useAuthStore.getState().setUser(response.user);
            }

            queryClient.setQueryData(authQueryKeys.me(), response.user);
        },
    });
}

export function useResendVerificationMutation() {
    return useMutation<ResendVerificationResponse, Error, ResendVerificationPayload>({
        mutationFn: (payload) => authService.resendVerificationEmail(payload),
    });
}

export function useForgotPasswordMutation() {
    return useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
        mutationFn: (payload) => authService.forgotPassword(payload),
    });
}

export function useResetPasswordMutation() {
    return useMutation<LogoutResponse, Error, ResetPasswordPayload>({
        mutationFn: (payload) => authService.resetPassword(payload),
    });
}

export function useLogoutMutation() {
    const queryClient = useQueryClient();

    return useMutation<LogoutResponse, Error, void>({
        mutationFn: async (): Promise<LogoutResponse> => {
            const refreshToken = useAuthStore.getState().refreshToken;

            if (!refreshToken) {
                return LOCAL_LOGOUT_RESPONSE;
            }

            return authService.logout({
                refreshToken,
            });
        },
        onSuccess: () => {
            useAuthStore.getState().reset();
            queryClient.removeQueries({ queryKey: authQueryKeys.all });
        },
        onError: () => {
            useAuthStore.getState().reset();
            queryClient.removeQueries({ queryKey: authQueryKeys.all });
        },
    });
}
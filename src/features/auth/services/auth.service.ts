// src/auth/auth.service.ts

import type { AxiosInstance } from "axios";

import type {
    AdminCheckResponse,
    AuthSuccessResponse,
    AuthUser,
    ChangePasswordPayload,
    ChangePasswordResponse,
    ForgotPasswordPayload,
    ForgotPasswordResponse,
    LoginPayload,
    LogoutAllResponse,
    LogoutPayload,
    LogoutResponse,
    RefreshTokenPayload,
    RegisterPayload,
    ResendVerificationPayload,
    ResendVerificationResponse,
    ResetPasswordPayload,
    VerifyEmailPayload,
    VerifyEmailResponse,
} from "../types/auth.types";

export function createAuthService(apiClient: AxiosInstance) {
    return {
        register(payload: RegisterPayload): Promise<AuthSuccessResponse> {
            return apiClient
                .post<AuthSuccessResponse>("/api/auth/register", payload)
                .then(({ data }) => data);
        },

        login(payload: LoginPayload): Promise<AuthSuccessResponse> {
            return apiClient
                .post<AuthSuccessResponse>("/api/auth/login", payload)
                .then(({ data }) => data);
        },

        refresh(payload: RefreshTokenPayload): Promise<AuthSuccessResponse> {
            return apiClient
                .post<AuthSuccessResponse>("/api/auth/refresh", payload)
                .then(({ data }) => data);
        },

        logout(payload: LogoutPayload): Promise<LogoutResponse> {
            return apiClient
                .post<LogoutResponse>("/api/auth/logout", payload)
                .then(({ data }) => data);
        },

        me(): Promise<AuthUser> {
            return apiClient.get<AuthUser>("/api/auth/me").then(({ data }) => data);
        },

        updateMe(payload: FormData): Promise<AuthUser> {
            return apiClient
                .patch<AuthUser>("/api/auth/me", payload, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(({ data }) => data);
        },

        changePassword(payload: ChangePasswordPayload): Promise<ChangePasswordResponse> {
            return apiClient
                .patch<ChangePasswordResponse>("/api/auth/change-password", payload)
                .then(({ data }) => data);
        },

        logoutAll(): Promise<LogoutAllResponse> {
            return apiClient
                .post<LogoutAllResponse>("/api/auth/logout-all")
                .then(({ data }) => data);
        },

        forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
            return apiClient
                .post<ForgotPasswordResponse>("/api/auth/forgot-password", payload)
                .then(({ data }) => data);
        },

        resetPassword(payload: ResetPasswordPayload): Promise<LogoutResponse> {
            return apiClient
                .post<LogoutResponse>("/api/auth/reset-password", payload)
                .then(({ data }) => data);
        },

        verifyEmail(payload: VerifyEmailPayload): Promise<VerifyEmailResponse> {
            return apiClient
                .post<VerifyEmailResponse>("/api/auth/verify-email", payload)
                .then(({ data }) => data);
        },

        resendVerificationEmail(
            payload: ResendVerificationPayload
        ): Promise<ResendVerificationResponse> {
            return apiClient
                .post<ResendVerificationResponse>(
                    "/api/auth/resend-verification-email",
                    payload
                )
                .then(({ data }) => data);
        },

        adminCheck(): Promise<AdminCheckResponse> {
            return apiClient
                .get<AdminCheckResponse>("/api/auth/admin-check")
                .then(({ data }) => data);
        },
    };
}
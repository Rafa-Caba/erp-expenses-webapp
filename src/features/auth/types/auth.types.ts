// src/auth/auth.types.ts

import type { IsoDateString, Nullable, UserRole } from "../types/common.types";
import type { ApiMessageResponse } from "../types/api.types";

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthUser {
    id: string;
    fullName: string;
    email: string;
    phone: Nullable<string>;
    avatarUrl: Nullable<string>;
    role: UserRole;
    isActive: boolean;
    isEmailVerified: boolean;
    lastLoginAt: Nullable<IsoDateString>;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface AuthDebugResponse {
    emailVerificationToken?: string;
    passwordResetToken?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    phone?: Nullable<string>;
    avatarUrl?: Nullable<string>;
    avatarPublicId?: Nullable<string>;
}

export interface RefreshTokenPayload {
    refreshToken: string;
}

export interface LogoutPayload {
    refreshToken: string;
}

export interface UpdateMePayload {
    fullName?: string;
    phone?: Nullable<string>;
    avatarUrl?: Nullable<string>;
    avatarPublicId?: Nullable<string>;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    token: string;
    newPassword: string;
}

export interface VerifyEmailPayload {
    token: string;
}

export interface ResendVerificationPayload {
    email: string;
}

export interface AuthSuccessResponse {
    user: AuthUser;
    tokens: AuthTokens;
    debug?: AuthDebugResponse;
}

export interface ForgotPasswordResponse extends ApiMessageResponse {
    debug?: AuthDebugResponse;
}

export interface VerifyEmailResponse extends ApiMessageResponse {
    user: AuthUser;
}

export interface ChangePasswordResponse extends ApiMessageResponse {
    user: AuthUser;
}

export interface ResendVerificationResponse extends ApiMessageResponse {
    debug?: AuthDebugResponse;
}

export type LogoutResponse = ApiMessageResponse;
export type LogoutAllResponse = ApiMessageResponse;
export type AdminCheckResponse = ApiMessageResponse;
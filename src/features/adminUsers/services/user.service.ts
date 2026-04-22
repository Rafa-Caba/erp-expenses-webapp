// src/features/adminUsers/services/user.service.ts

import type { AxiosInstance } from "axios";

import type {
    AdminResetUserPasswordPayload,
    AdminResetUserPasswordResponse,
    CreateUserPayload,
    DeleteUserResponse,
    ListUsersQuery,
    UpdateUserPayload,
    UserListResponse,
    UserRecord,
} from "../types/user.types";

export function createUserService(apiClient: AxiosInstance) {
    return {
        listUsers(query?: ListUsersQuery): Promise<UserListResponse> {
            return apiClient
                .get<UserListResponse>("/api/users", {
                    params: query,
                })
                .then(({ data }) => data);
        },

        getUserById(userId: string): Promise<UserRecord> {
            return apiClient
                .get<UserRecord>(`/api/users/${userId}`)
                .then(({ data }) => data);
        },

        createUser(payload: CreateUserPayload): Promise<UserRecord> {
            return apiClient
                .post<UserRecord>("/api/users", payload)
                .then(({ data }) => data);
        },

        updateUser(userId: string, payload: UpdateUserPayload): Promise<UserRecord> {
            return apiClient
                .patch<UserRecord>(`/api/users/${userId}`, payload)
                .then(({ data }) => data);
        },

        resetUserPassword(
            userId: string,
            payload: AdminResetUserPasswordPayload
        ): Promise<AdminResetUserPasswordResponse> {
            return apiClient
                .patch<AdminResetUserPasswordResponse>(
                    `/api/users/${userId}/reset-password`,
                    payload
                )
                .then(({ data }) => data);
        },

        deleteUser(userId: string): Promise<DeleteUserResponse> {
            return apiClient
                .delete<DeleteUserResponse>(`/api/users/${userId}`)
                .then(({ data }) => data);
        },
    };
}
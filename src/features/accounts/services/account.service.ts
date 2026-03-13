// src/accounts/services/account.service.ts

import type { AxiosInstance } from "axios";

import type {
    AccountResponse,
    AccountsResponse,
    CreateAccountPayload,
    UpdateAccountPayload,
} from "../types/account.types";

export function createAccountService(apiClient: AxiosInstance) {
    return {
        getAccounts(workspaceId: string): Promise<AccountsResponse> {
            return apiClient
                .get<AccountsResponse>(`/api/workspaces/${workspaceId}/accounts`)
                .then(({ data }) => data);
        },

        getAccountById(workspaceId: string, accountId: string): Promise<AccountResponse> {
            return apiClient
                .get<AccountResponse>(`/api/workspaces/${workspaceId}/accounts/${accountId}`)
                .then(({ data }) => data);
        },

        createAccount(
            workspaceId: string,
            payload: CreateAccountPayload
        ): Promise<AccountResponse> {
            return apiClient
                .post<AccountResponse>(`/api/workspaces/${workspaceId}/accounts`, payload)
                .then(({ data }) => data);
        },

        updateAccount(
            workspaceId: string,
            accountId: string,
            payload: UpdateAccountPayload
        ): Promise<AccountResponse> {
            return apiClient
                .patch<AccountResponse>(
                    `/api/workspaces/${workspaceId}/accounts/${accountId}`,
                    payload
                )
                .then(({ data }) => data);
        },

        archiveAccount(workspaceId: string, accountId: string): Promise<AccountResponse> {
            return apiClient
                .delete<AccountResponse>(`/api/workspaces/${workspaceId}/accounts/${accountId}`)
                .then(({ data }) => data);
        },
    };
}
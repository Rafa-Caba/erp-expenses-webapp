// src/features/accounts/hooks/useAccountMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { createAccountService } from "../services/account.service";
import { accountQueryKeys } from "../api/account.queryKeys";
import type {
    AccountResponse,
    CreateAccountPayload,
    UpdateAccountPayload,
} from "../types/account.types";

const accountService = createAccountService(apiClient);

type CreateAccountMutationPayload = {
    workspaceId: string;
    payload: CreateAccountPayload;
};

type UpdateAccountMutationPayload = {
    workspaceId: string;
    accountId: string;
    payload: UpdateAccountPayload;
};

type ArchiveAccountMutationPayload = {
    workspaceId: string;
    accountId: string;
};

export function useCreateAccountMutation() {
    const queryClient = useQueryClient();

    return useMutation<AccountResponse, Error, CreateAccountMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            accountService.createAccount(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: accountQueryKeys.all,
            });

            queryClient.setQueryData(
                accountQueryKeys.detail(response.account.workspaceId, response.account.id),
                response.account
            );
        },
    });
}

export function useUpdateAccountMutation() {
    const queryClient = useQueryClient();

    return useMutation<AccountResponse, Error, UpdateAccountMutationPayload>({
        mutationFn: ({ workspaceId, accountId, payload }) =>
            accountService.updateAccount(workspaceId, accountId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: accountQueryKeys.all,
            });

            queryClient.setQueryData(
                accountQueryKeys.detail(response.account.workspaceId, response.account.id),
                response.account
            );
        },
    });
}

export function useArchiveAccountMutation() {
    const queryClient = useQueryClient();

    return useMutation<AccountResponse, Error, ArchiveAccountMutationPayload>({
        mutationFn: ({ workspaceId, accountId }) =>
            accountService.archiveAccount(workspaceId, accountId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: accountQueryKeys.all,
            });

            queryClient.setQueryData(
                accountQueryKeys.detail(response.account.workspaceId, response.account.id),
                response.account
            );
        },
    });
}
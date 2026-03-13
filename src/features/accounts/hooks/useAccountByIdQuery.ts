// src/features/accounts/hooks/useAccountByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { createAccountService } from "../services/account.service";
import { accountQueryKeys } from "../api/account.queryKeys";
import type { AccountRecord } from "../types/account.types";

const accountService = createAccountService(apiClient);

export function useAccountByIdQuery(workspaceId: string | null, accountId: string | null) {
    return useQuery({
        queryKey:
            workspaceId && accountId
                ? accountQueryKeys.detail(workspaceId, accountId)
                : accountQueryKeys.details(),
        queryFn: async (): Promise<AccountRecord> => {
            if (!workspaceId || !accountId) {
                throw new Error("Workspace ID and account ID are required");
            }

            const response = await accountService.getAccountById(workspaceId, accountId);
            return response.account;
        },
        enabled: workspaceId !== null && accountId !== null,
        staleTime: 30_000,
    });
}
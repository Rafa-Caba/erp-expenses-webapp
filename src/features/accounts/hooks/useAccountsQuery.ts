// src/features/accounts/hooks/useAccountsQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { createAccountService } from "../services/account.service";
import { accountQueryKeys } from "../api/account.queryKeys";

const accountService = createAccountService(apiClient);

export function useAccountsQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId ? accountQueryKeys.list(workspaceId) : accountQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return accountService.getAccounts(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}
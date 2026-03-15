// src/features/debts/hooks/useDebtsQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { debtQueryKeys } from "../api/debt.queryKeys";
import { createDebtService } from "../services/debt.service";

const debtService = createDebtService(apiClient);

export function useDebtsQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId ? debtQueryKeys.list(workspaceId) : debtQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return debtService.getDebts(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}
// src/features/debts/hooks/useDebtByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { debtQueryKeys } from "../api/debt.queryKeys";
import { createDebtService } from "../services/debt.service";
import type { DebtRecord } from "../types/debt.types";

const debtService = createDebtService(apiClient);

export function useDebtByIdQuery(workspaceId: string | null, debtId: string | null) {
    return useQuery({
        queryKey:
            workspaceId && debtId
                ? debtQueryKeys.detail(workspaceId, debtId)
                : debtQueryKeys.details(),
        queryFn: async (): Promise<DebtRecord> => {
            if (!workspaceId || !debtId) {
                throw new Error("Workspace ID and debt ID are required");
            }

            const response = await debtService.getDebtById(workspaceId, debtId);
            return response.debt;
        },
        enabled: workspaceId !== null && debtId !== null,
        staleTime: 30_000,
    });
}
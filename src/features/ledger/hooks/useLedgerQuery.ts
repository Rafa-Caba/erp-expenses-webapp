// src/features/ledger/hooks/useLedgerQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { ledgerQueryKeys } from "../api/ledger.queryKeys";
import { createLedgerApiService } from "../services/ledger-api.service";

const ledgerApiService = createLedgerApiService(apiClient);

export function useLedgerQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId
            ? ledgerQueryKeys.detail(workspaceId)
            : ledgerQueryKeys.details(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return ledgerApiService.getLedgerDataset(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}
// src/features/reconciliation/hooks/useReconciliationQuery.ts

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { reconciliationQueryKeys } from "../api/reconciliation.queryKeys";
import { createReconciliationService } from "../services/reconciliation.service";
import type { ReconciliationListFilters } from "../types/reconciliation.types";

const reconciliationService = createReconciliationService(apiClient);

function buildFiltersKey(filters: ReconciliationListFilters): string {
    return JSON.stringify(filters);
}

export function useReconciliationQuery(
    workspaceId: string | null,
    filters: ReconciliationListFilters
) {
    const filtersKey = useMemo(() => buildFiltersKey(filters), [filters]);

    return useQuery({
        queryKey: workspaceId
            ? reconciliationQueryKeys.list(workspaceId, filtersKey)
            : reconciliationQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return reconciliationService.getReconciliations(workspaceId, filters);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}

export function useReconciliationSummaryQuery(
    workspaceId: string | null,
    filters: ReconciliationListFilters
) {
    const filtersKey = useMemo(() => buildFiltersKey(filters), [filters]);

    return useQuery({
        queryKey: workspaceId
            ? reconciliationQueryKeys.summary(workspaceId, filtersKey)
            : reconciliationQueryKeys.summaries(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return reconciliationService.getReconciliationSummary(workspaceId, filters);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}
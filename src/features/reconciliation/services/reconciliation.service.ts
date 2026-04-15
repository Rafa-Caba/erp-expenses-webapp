// src/features/reconciliation/services/reconciliation.service.ts

import type { AxiosInstance } from "axios";

import type {
    CreateReconciliationPayload,
    ReconciliationListFilters,
    ReconciliationListResponse,
    ReconciliationResponse,
    ReconciliationSummaryResponse,
    UpdateReconciliationPayload,
} from "../types/reconciliation.types";

function buildReconciliationQueryParams(
    filters: ReconciliationListFilters
): URLSearchParams {
    const searchParams = new URLSearchParams();

    if (filters.accountId.trim()) {
        searchParams.set("accountId", filters.accountId.trim());
    }

    if (filters.cardId.trim()) {
        searchParams.set("cardId", filters.cardId.trim());
    }

    if (filters.memberId.trim()) {
        searchParams.set("memberId", filters.memberId.trim());
    }

    if (filters.transactionId.trim()) {
        searchParams.set("transactionId", filters.transactionId.trim());
    }

    if (filters.status !== "ALL") {
        searchParams.set("status", filters.status);
    }

    if (filters.currency !== "ALL") {
        searchParams.set("currency", filters.currency);
    }

    if (filters.entrySide !== "ALL") {
        searchParams.set("entrySide", filters.entrySide);
    }

    if (filters.matchMethod !== "ALL") {
        searchParams.set("matchMethod", filters.matchMethod);
    }

    if (filters.includeArchived) {
        searchParams.set("includeArchived", "true");
    }

    if (filters.includeInactive) {
        searchParams.set("includeInactive", "true");
    }

    if (filters.includeHidden) {
        searchParams.set("includeHidden", "true");
    }

    if (filters.transactionDateFrom.trim()) {
        searchParams.set("transactionDateFrom", filters.transactionDateFrom.trim());
    }

    if (filters.transactionDateTo.trim()) {
        searchParams.set("transactionDateTo", filters.transactionDateTo.trim());
    }

    if (filters.reconciledFrom.trim()) {
        searchParams.set("reconciledFrom", filters.reconciledFrom.trim());
    }

    if (filters.reconciledTo.trim()) {
        searchParams.set("reconciledTo", filters.reconciledTo.trim());
    }

    if (filters.statementDateFrom.trim()) {
        searchParams.set("statementDateFrom", filters.statementDateFrom.trim());
    }

    if (filters.statementDateTo.trim()) {
        searchParams.set("statementDateTo", filters.statementDateTo.trim());
    }

    return searchParams;
}

export function createReconciliationService(apiClient: AxiosInstance) {
    return {
        getReconciliations(
            workspaceId: string,
            filters: ReconciliationListFilters
        ): Promise<ReconciliationListResponse> {
            const queryString = buildReconciliationQueryParams(filters).toString();
            const suffix = queryString ? `?${queryString}` : "";

            return apiClient
                .get<ReconciliationListResponse>(
                    `/api/workspaces/${workspaceId}/reconciliation${suffix}`
                )
                .then(({ data }) => data);
        },

        getReconciliationSummary(
            workspaceId: string,
            filters: ReconciliationListFilters
        ): Promise<ReconciliationSummaryResponse> {
            const queryString = buildReconciliationQueryParams(filters).toString();
            const suffix = queryString ? `?${queryString}` : "";

            return apiClient
                .get<ReconciliationSummaryResponse>(
                    `/api/workspaces/${workspaceId}/reconciliation/summary${suffix}`
                )
                .then(({ data }) => data);
        },

        getReconciliationById(
            workspaceId: string,
            reconciliationId: string
        ): Promise<ReconciliationResponse> {
            return apiClient
                .get<ReconciliationResponse>(
                    `/api/workspaces/${workspaceId}/reconciliation/${reconciliationId}`
                )
                .then(({ data }) => data);
        },

        createReconciliation(
            workspaceId: string,
            payload: CreateReconciliationPayload
        ): Promise<ReconciliationResponse> {
            return apiClient
                .post<ReconciliationResponse>(
                    `/api/workspaces/${workspaceId}/reconciliation`,
                    payload
                )
                .then(({ data }) => data);
        },

        updateReconciliation(
            workspaceId: string,
            reconciliationId: string,
            payload: UpdateReconciliationPayload
        ): Promise<ReconciliationResponse> {
            return apiClient
                .patch<ReconciliationResponse>(
                    `/api/workspaces/${workspaceId}/reconciliation/${reconciliationId}`,
                    payload
                )
                .then(({ data }) => data);
        },

        deleteReconciliation(
            workspaceId: string,
            reconciliationId: string
        ): Promise<ReconciliationResponse> {
            return apiClient
                .delete<ReconciliationResponse>(
                    `/api/workspaces/${workspaceId}/reconciliation/${reconciliationId}`
                )
                .then(({ data }) => data);
        },
    };
}
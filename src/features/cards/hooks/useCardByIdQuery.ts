// src/features/cards/hooks/useCardByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { createCardService } from "../services/card.service";
import { cardQueryKeys } from "../api/card.queryKeys";
import type { CardRecord } from "../types/card.types";

const cardService = createCardService(apiClient);

export function useCardByIdQuery(workspaceId: string | null, cardId: string | null) {
    return useQuery({
        queryKey:
            workspaceId && cardId
                ? cardQueryKeys.detail(workspaceId, cardId)
                : cardQueryKeys.details(),
        queryFn: async (): Promise<CardRecord> => {
            if (!workspaceId || !cardId) {
                throw new Error("Workspace ID and card ID are required");
            }

            const response = await cardService.getCardById(workspaceId, cardId);
            return response.card;
        },
        enabled: workspaceId !== null && cardId !== null,
        staleTime: 30_000,
    });
}
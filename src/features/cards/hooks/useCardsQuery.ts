// src/features/cards/hooks/useCardsQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { createCardService } from "../services/card.service";
import { cardQueryKeys } from "../api/card.queryKeys";

const cardService = createCardService(apiClient);

export function useCardsQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId ? cardQueryKeys.list(workspaceId) : cardQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return cardService.getCards(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}
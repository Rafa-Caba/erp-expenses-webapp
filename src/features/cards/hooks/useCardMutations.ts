// src/features/cards/hooks/useCardMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { createCardService } from "../services/card.service";
import { cardQueryKeys } from "../api/card.queryKeys";
import type {
    CardResponse,
    CreateCardPayload,
    UpdateCardPayload,
} from "../types/card.types";

const cardService = createCardService(apiClient);

type CreateCardMutationPayload = {
    workspaceId: string;
    payload: CreateCardPayload;
};

type UpdateCardMutationPayload = {
    workspaceId: string;
    cardId: string;
    payload: UpdateCardPayload;
};

type ArchiveCardMutationPayload = {
    workspaceId: string;
    cardId: string;
};

export function useCreateCardMutation() {
    const queryClient = useQueryClient();

    return useMutation<CardResponse, Error, CreateCardMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            cardService.createCard(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: cardQueryKeys.all,
            });

            queryClient.setQueryData(
                cardQueryKeys.detail(response.card.workspaceId, response.card.id),
                response.card
            );
        },
    });
}

export function useUpdateCardMutation() {
    const queryClient = useQueryClient();

    return useMutation<CardResponse, Error, UpdateCardMutationPayload>({
        mutationFn: ({ workspaceId, cardId, payload }) =>
            cardService.updateCard(workspaceId, cardId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: cardQueryKeys.all,
            });

            queryClient.setQueryData(
                cardQueryKeys.detail(response.card.workspaceId, response.card.id),
                response.card
            );
        },
    });
}

export function useArchiveCardMutation() {
    const queryClient = useQueryClient();

    return useMutation<CardResponse, Error, ArchiveCardMutationPayload>({
        mutationFn: ({ workspaceId, cardId }) =>
            cardService.archiveCard(workspaceId, cardId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: cardQueryKeys.all,
            });

            queryClient.setQueryData(
                cardQueryKeys.detail(response.card.workspaceId, response.card.id),
                response.card
            );
        },
    });
}
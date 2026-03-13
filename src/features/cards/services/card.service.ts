// src/cards/services/card.service.ts

import type { AxiosInstance } from "axios";

import type {
    CardResponse,
    CardsResponse,
    CreateCardPayload,
    UpdateCardPayload,
} from "../types/card.types";

export function createCardService(apiClient: AxiosInstance) {
    return {
        getCards(workspaceId: string): Promise<CardsResponse> {
            return apiClient
                .get<CardsResponse>(`/api/workspaces/${workspaceId}/cards`)
                .then(({ data }) => data);
        },

        getCardById(workspaceId: string, cardId: string): Promise<CardResponse> {
            return apiClient
                .get<CardResponse>(`/api/workspaces/${workspaceId}/cards/${cardId}`)
                .then(({ data }) => data);
        },

        createCard(workspaceId: string, payload: CreateCardPayload): Promise<CardResponse> {
            return apiClient
                .post<CardResponse>(`/api/workspaces/${workspaceId}/cards`, payload)
                .then(({ data }) => data);
        },

        updateCard(
            workspaceId: string,
            cardId: string,
            payload: UpdateCardPayload
        ): Promise<CardResponse> {
            return apiClient
                .patch<CardResponse>(
                    `/api/workspaces/${workspaceId}/cards/${cardId}`,
                    payload
                )
                .then(({ data }) => data);
        },

        archiveCard(workspaceId: string, cardId: string): Promise<CardResponse> {
            return apiClient
                .delete<CardResponse>(`/api/workspaces/${workspaceId}/cards/${cardId}`)
                .then(({ data }) => data);
        },
    };
}
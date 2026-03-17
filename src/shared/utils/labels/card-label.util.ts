// src/shared/utils/labels/card-label.util.ts

import { useCardByIdQuery } from "../../../features/cards/hooks/useCardByIdQuery";
import type { CardRecord } from "../../../features/cards/types/card.types";

import {
    buildLabelByIdResult,
    normalizeLabelValue,
    type LabelByIdResult,
} from "./label-by-id.util";

export function getCardLabelValue(card: CardRecord | null | undefined): string | null {
    return normalizeLabelValue(card?.name);
}

export function useCardLabelById(
    workspaceId: string | null,
    cardId: string | null
): LabelByIdResult {
    const query = useCardByIdQuery(workspaceId, cardId);

    return buildLabelByIdResult({
        rawId: cardId,
        resolvedLabel: getCardLabelValue(query.data),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Tarjeta",
    });
}
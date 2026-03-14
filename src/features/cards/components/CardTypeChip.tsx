// src/features/cards/components/CardTypeChip.tsx

import Chip from "@mui/material/Chip";

import type { CardType } from "../types/card.types";

type CardTypeChipProps = {
    type: CardType;
};

function getCardTypeLabel(type: CardType): string {
    switch (type) {
        case "debit":
            return "Débito";
        case "credit":
            return "Crédito";
    }
}

function getCardTypeColor(
    type: CardType
): "default" | "primary" | "secondary" | "success" | "warning" {
    switch (type) {
        case "debit":
            return "success";
        case "credit":
            return "warning";
    }
}

export function CardTypeChip({ type }: CardTypeChipProps) {
    return <Chip size="small" color={getCardTypeColor(type)} label={getCardTypeLabel(type)} />;
}
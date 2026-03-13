// src/cards/types/card.types.ts

import type { IsoDateString, Nullable } from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";

export type CardType = "debit" | "credit";

export interface CardRecord {
    id: string;
    workspaceId: string;
    accountId: string;
    holderMemberId: Nullable<string>;
    name: string;
    type: CardType;
    brand: Nullable<string>;
    last4: string;
    creditLimit: Nullable<number>;
    closingDay: Nullable<number>;
    dueDay: Nullable<number>;
    notes: Nullable<string>;
    isActive: boolean;
    isArchived: boolean;
    isVisible: boolean;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface CreateCardPayload {
    accountId: string;
    holderMemberId?: string;
    name: string;
    type: CardType;
    brand?: string;
    last4: string;
    creditLimit?: number;
    closingDay?: number;
    dueDay?: number;
    notes?: string;
    isActive?: boolean;
    isArchived?: boolean;
    isVisible?: boolean;
}

export interface UpdateCardPayload {
    accountId?: string;
    holderMemberId?: string;
    name?: string;
    type?: CardType;
    brand?: string;
    last4?: string;
    creditLimit?: number;
    closingDay?: number;
    dueDay?: number;
    notes?: string;
    isActive?: boolean;
    isArchived?: boolean;
    isVisible?: boolean;
}

export type CardsResponse = CollectionResponse<"cards", CardRecord>;
export type CardResponse = EntityResponse<"card", CardRecord>;
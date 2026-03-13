// src/reminders/types/reminder.types.ts

import type {
    IsoDateString,
    Nullable,
} from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";

export type ReminderType = "bill" | "debt" | "subscription" | "custom";
export type ReminderStatus = "pending" | "done" | "dismissed";
export type ReminderPriority = "low" | "medium" | "high";
export type ReminderChannel = "in_app" | "email" | "both";
export type ReminderRelatedEntityType =
    | "transaction"
    | "receipt"
    | "debt"
    | "payment"
    | "budget"
    | "saving_goal"
    | "account"
    | "card"
    | "custom";

export interface ReminderRecord {
    _id: string;
    workspaceId: string;
    memberId: Nullable<string>;
    title: string;
    description: Nullable<string>;
    type: ReminderType;
    relatedEntityType: Nullable<ReminderRelatedEntityType>;
    relatedEntityId: Nullable<string>;
    dueDate: IsoDateString;
    isRecurring: boolean;
    recurrenceRule: Nullable<string>;
    status: ReminderStatus;
    priority: Nullable<ReminderPriority>;
    channel: ReminderChannel;
    isVisible: boolean;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
    isOverdue: boolean;
}

export interface CreateReminderPayload {
    memberId?: Nullable<string>;
    title: string;
    description?: Nullable<string>;
    type: ReminderType;
    relatedEntityType?: Nullable<ReminderRelatedEntityType>;
    relatedEntityId?: Nullable<string>;
    dueDate: string;
    isRecurring: boolean;
    recurrenceRule?: Nullable<string>;
    status?: ReminderStatus;
    priority?: Nullable<ReminderPriority>;
    channel?: ReminderChannel;
    isVisible?: boolean;
}

export interface UpdateReminderPayload {
    memberId?: Nullable<string>;
    title?: string;
    description?: Nullable<string>;
    type?: ReminderType;
    relatedEntityType?: Nullable<ReminderRelatedEntityType>;
    relatedEntityId?: Nullable<string>;
    dueDate?: string;
    isRecurring?: boolean;
    recurrenceRule?: Nullable<string>;
    status?: ReminderStatus;
    priority?: Nullable<ReminderPriority>;
    channel?: ReminderChannel;
    isVisible?: boolean;
}

export type RemindersResponse = CollectionResponse<"reminders", ReminderRecord>;
export type ReminderResponse = EntityResponse<"reminder", ReminderRecord>;
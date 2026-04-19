// src/features/reminders/types/reminder.types.ts

import type {
    IsoDateString,
    Nullable,
} from "../../../shared/types/common.types";
import type {
    CollectionResponse,
    EntityResponse,
} from "../../../shared/types/api.types";

export type ReminderType = "bill" | "debt" | "subscription" | "custom";
export type ReminderStatus = "pending" | "in_progress" | "resolved";
export type ReminderMemberResponseStatus = "pending" | "done" | "dismissed";
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

export interface ReminderMemberResponseRecord {
    memberId: string;
    status: ReminderMemberResponseStatus;
    viewedAt: Nullable<IsoDateString>;
    respondedAt: Nullable<IsoDateString>;
}

export interface ReminderResponseSummary {
    totalRecipients: number;
    totalViewed: number;
    totalPending: number;
    totalDone: number;
    totalDismissed: number;
    totalResponded: number;
}

export interface ReminderRecord {
    _id: string;
    workspaceId: string;
    createdByMemberId: string;
    recipientMemberIds: string[];
    title: string;
    description: Nullable<string>;
    type: ReminderType;
    relatedEntityType: Nullable<ReminderRelatedEntityType>;
    relatedEntityId: Nullable<string>;
    dueDate: IsoDateString;
    isRecurring: boolean;
    recurrenceRule: Nullable<string>;
    status: ReminderStatus;
    responses: ReminderMemberResponseRecord[];
    priority: Nullable<ReminderPriority>;
    channel: ReminderChannel;
    isVisible: boolean;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
    isOverdue: boolean;
    responseSummary: ReminderResponseSummary;
}

export interface CreateReminderPayload {
    targetMemberId?: Nullable<string>;
    title: string;
    description?: Nullable<string>;
    type: ReminderType;
    relatedEntityType?: Nullable<ReminderRelatedEntityType>;
    relatedEntityId?: Nullable<string>;
    dueDate: string;
    isRecurring: boolean;
    recurrenceRule?: Nullable<string>;
    priority?: Nullable<ReminderPriority>;
    channel?: ReminderChannel;
    isVisible?: boolean;
}

export interface UpdateReminderPayload {
    targetMemberId?: Nullable<string>;
    title?: string;
    description?: Nullable<string>;
    type?: ReminderType;
    relatedEntityType?: Nullable<ReminderRelatedEntityType>;
    relatedEntityId?: Nullable<string>;
    dueDate?: string;
    isRecurring?: boolean;
    recurrenceRule?: Nullable<string>;
    priority?: Nullable<ReminderPriority>;
    channel?: ReminderChannel;
    isVisible?: boolean;
}

export interface RespondToReminderPayload {
    status: Extract<ReminderMemberResponseStatus, "done" | "dismissed">;
}

export type RemindersResponse = CollectionResponse<"reminders", ReminderRecord>;
export type ReminderResponse = EntityResponse<"reminder", ReminderRecord>;
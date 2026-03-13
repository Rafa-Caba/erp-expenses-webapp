// src/savingGoals/types/saving-goal.types.ts

import type {
    CurrencyCode,
    IsoDateString,
    Nullable,
} from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";

export type SavingsGoalStatus = "active" | "completed" | "paused" | "cancelled";
export type SavingsGoalPriority = "low" | "medium" | "high";
export type SavingsGoalCategory =
    | "emergency_fund"
    | "vacation"
    | "education"
    | "home"
    | "car"
    | "business"
    | "retirement"
    | "custom";

export interface SavingGoalRecord {
    _id: string;
    workspaceId: string;
    accountId: Nullable<string>;
    memberId: Nullable<string>;
    name: string;
    description: Nullable<string>;
    targetAmount: number;
    currentAmount: number;
    currency: CurrencyCode;
    targetDate: Nullable<IsoDateString>;
    status: SavingsGoalStatus;
    priority: Nullable<SavingsGoalPriority>;
    category: SavingsGoalCategory;
    isVisible: boolean;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
    remainingAmount: number;
    progressPercent: number;
}

export interface CreateSavingGoalPayload {
    accountId?: Nullable<string>;
    memberId?: Nullable<string>;
    name: string;
    description?: Nullable<string>;
    targetAmount: number;
    currentAmount: number;
    currency: CurrencyCode;
    targetDate?: Nullable<string>;
    status?: SavingsGoalStatus;
    priority?: Nullable<SavingsGoalPriority>;
    category?: SavingsGoalCategory;
    isVisible?: boolean;
}

export interface UpdateSavingGoalPayload {
    accountId?: Nullable<string>;
    memberId?: Nullable<string>;
    name?: string;
    description?: Nullable<string>;
    targetAmount?: number;
    currentAmount?: number;
    currency?: CurrencyCode;
    targetDate?: Nullable<string>;
    status?: SavingsGoalStatus;
    priority?: Nullable<SavingsGoalPriority>;
    category?: SavingsGoalCategory;
    isVisible?: boolean;
}

export type SavingGoalsResponse = CollectionResponse<"savingGoals", SavingGoalRecord>;
export type SavingGoalResponse = EntityResponse<"savingGoal", SavingGoalRecord>;
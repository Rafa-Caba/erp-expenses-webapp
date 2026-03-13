// src/budgets/types/budget.types.ts

import type {
    CurrencyCode,
    IsoDateString,
    Nullable,
} from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";

export type BudgetPeriodType = "weekly" | "monthly" | "yearly" | "custom";
export type BudgetStatus = "draft" | "active" | "completed" | "exceeded" | "archived";

export interface BudgetRecord {
    _id: string;
    workspaceId: string;
    name: string;
    periodType: BudgetPeriodType;
    startDate: IsoDateString;
    endDate: IsoDateString;
    limitAmount: number;
    currency: CurrencyCode;
    categoryId: Nullable<string>;
    memberId: Nullable<string>;
    alertPercent: Nullable<number>;
    notes: Nullable<string>;
    isActive: boolean;
    status: BudgetStatus;
    isVisible: boolean;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
    spentAmount: number;
    remainingAmount: number;
    usagePercent: number;
    hasReachedAlert: boolean;
    isExceeded: boolean;
    matchedTransactionCount: number;
    computedStatus: BudgetStatus;
}

export interface CreateBudgetPayload {
    name: string;
    periodType: BudgetPeriodType;
    startDate: string;
    endDate: string;
    limitAmount: number;
    currency: CurrencyCode;
    categoryId?: Nullable<string>;
    memberId?: Nullable<string>;
    alertPercent?: Nullable<number>;
    notes?: Nullable<string>;
    isActive?: boolean;
    status?: BudgetStatus;
    isVisible?: boolean;
}

export interface UpdateBudgetPayload {
    name?: string;
    periodType?: BudgetPeriodType;
    startDate?: string;
    endDate?: string;
    limitAmount?: number;
    currency?: CurrencyCode;
    categoryId?: Nullable<string>;
    memberId?: Nullable<string>;
    alertPercent?: Nullable<number>;
    notes?: Nullable<string>;
    isActive?: boolean;
    status?: BudgetStatus;
    isVisible?: boolean;
}

export type BudgetsResponse = CollectionResponse<"budgets", BudgetRecord>;
export type BudgetResponse = EntityResponse<"budget", BudgetRecord>;
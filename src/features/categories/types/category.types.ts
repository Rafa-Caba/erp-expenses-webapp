// src/categories/types/category.types.ts

import type { IsoDateString, Nullable } from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";

export type CategoryType = "EXPENSE" | "INCOME" | "BOTH";

export interface CategoryRecord {
    _id: string;
    workspaceId: string;
    name: string;
    type: CategoryType;
    parentCategoryId: Nullable<string>;
    color: Nullable<string>;
    icon: Nullable<string>;
    description: Nullable<string>;
    sortOrder: number;
    isSystem: boolean;
    isActive: boolean;
    isVisible: boolean;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface CreateCategoryPayload {
    name: string;
    type: CategoryType;
    parentCategoryId?: Nullable<string>;
    color?: Nullable<string>;
    icon?: Nullable<string>;
    description?: Nullable<string>;
    sortOrder?: number;
    isSystem?: boolean;
    isActive?: boolean;
    isVisible?: boolean;
}

export interface UpdateCategoryPayload {
    name?: string;
    type?: CategoryType;
    parentCategoryId?: Nullable<string>;
    color?: Nullable<string>;
    icon?: Nullable<string>;
    description?: Nullable<string>;
    sortOrder?: number;
    isActive?: boolean;
    isVisible?: boolean;
}

export type CategoriesResponse = CollectionResponse<"categories", CategoryRecord>;
export type CategoryResponse = EntityResponse<"category", CategoryRecord>;
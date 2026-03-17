// src/shared/utils/labels/category-label.util.ts

import { useCategoryByIdQuery } from "../../../features/categories/hooks/useCategoryByIdQuery";
import type { CategoryRecord } from "../../../features/categories/types/category.types";

import {
    buildLabelByIdResult,
    normalizeLabelValue,
    type LabelByIdResult,
} from "./label-by-id.util";

export function getCategoryLabelValue(
    category: CategoryRecord | null | undefined
): string | null {
    return normalizeLabelValue(category?.name);
}

export function useCategoryLabelById(
    workspaceId: string | null,
    categoryId: string | null
): LabelByIdResult {
    const query = useCategoryByIdQuery(workspaceId, categoryId);

    return buildLabelByIdResult({
        rawId: categoryId,
        resolvedLabel: getCategoryLabelValue(query.data),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Categoría",
    });
}
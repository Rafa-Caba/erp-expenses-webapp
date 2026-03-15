// src/features/categories/pages/EditCategoryPage.tsx

import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import {
    CategoryForm,
    type CategoryFormValues,
    type CategoryParentOption,
} from "../components/CategoryForm";
import { useCategoryByIdQuery } from "../hooks/useCategoryByIdQuery";
import { useUpdateCategoryMutation } from "../hooks/useCategoryMutations";
import { useCategoriesQuery } from "../hooks/useCategoriesQuery";
import type {
    CategoryRecord,
    CategoryType,
    UpdateCategoryPayload,
} from "../types/category.types";

type ApiErrorResponse = {
    code?: string;
    message?: string;
};

function getScopeBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}`;
}

function getCategoryTypeLabel(type: CategoryType): string {
    switch (type) {
        case "EXPENSE":
            return "Gasto";
        case "INCOME":
            return "Ingreso";
        case "BOTH":
            return "Ambas";
    }
}

function buildCategoryPathLabel(
    category: CategoryRecord,
    categoryLookup: Map<string, CategoryRecord>
): string {
    const segments: string[] = [category.name];
    const visitedIds = new Set<string>();

    let currentParentId = category.parentCategoryId;

    while (currentParentId) {
        if (visitedIds.has(currentParentId)) {
            break;
        }

        visitedIds.add(currentParentId);

        const parentCategory = categoryLookup.get(currentParentId);

        if (!parentCategory) {
            break;
        }

        segments.unshift(parentCategory.name);
        currentParentId = parentCategory.parentCategoryId;
    }

    return segments.join(" / ");
}

function collectExcludedCategoryIds(
    categories: CategoryRecord[],
    currentCategoryId: string
): Set<string> {
    const excludedIds = new Set<string>([currentCategoryId]);

    let foundNewChild = true;

    while (foundNewChild) {
        foundNewChild = false;

        for (const category of categories) {
            if (
                category.parentCategoryId &&
                excludedIds.has(category.parentCategoryId) &&
                !excludedIds.has(category._id)
            ) {
                excludedIds.add(category._id);
                foundNewChild = true;
            }
        }
    }

    return excludedIds;
}

function toCategoryParentOptions(
    categories: CategoryRecord[],
    currentCategoryId: string
): CategoryParentOption[] {
    const excludedIds = collectExcludedCategoryIds(categories, currentCategoryId);
    const categoryLookup = new Map<string, CategoryRecord>(
        categories.map((category: CategoryRecord) => [category._id, category])
    );

    return [...categories]
        .filter((category: CategoryRecord) => !excludedIds.has(category._id))
        .sort((leftCategory, rightCategory) => {
            if (leftCategory.sortOrder !== rightCategory.sortOrder) {
                return leftCategory.sortOrder - rightCategory.sortOrder;
            }

            return leftCategory.name.localeCompare(rightCategory.name, "es-MX");
        })
        .map((category: CategoryRecord) => ({
            value: category._id,
            label: `${buildCategoryPathLabel(category, categoryLookup)} • ${getCategoryTypeLabel(category.type)}`,
        }));
}

function toCategoryFormValues(category: CategoryRecord): CategoryFormValues {
    return {
        name: category.name,
        type: category.type,
        parentCategoryId: category.parentCategoryId ?? "",
        color: category.color ?? "",
        icon: category.icon ?? "",
        description: category.description ?? "",
        sortOrder: String(category.sortOrder),
        isSystem: category.isSystem,
        isActive: category.isActive,
        isVisible: category.isVisible,
    };
}

function parseOptionalInteger(value: string): number | undefined {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return undefined;
    }

    return Number(trimmedValue);
}

function toUpdateCategoryPayload(values: CategoryFormValues): UpdateCategoryPayload {
    return {
        name: values.name.trim(),
        type: values.type,
        parentCategoryId: values.parentCategoryId.trim() || null,
        color: values.color.trim() || null,
        icon: values.icon.trim() || null,
        description: values.description.trim() || null,
        sortOrder: parseOptionalInteger(values.sortOrder),
        isActive: values.isActive,
        isVisible: values.isVisible,
    };
}

function getCategoryErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const apiMessage = error.response?.data?.message;

        if (typeof apiMessage === "string" && apiMessage.trim().length > 0) {
            return apiMessage;
        }
    }

    return error.message.trim().length > 0 ? error.message : fallbackMessage;
}

export function EditCategoryPage() {
    const navigate = useNavigate();
    const params = useParams<{ categoryId: string }>();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const categoryId = params.categoryId ?? null;

    const categoryQuery = useCategoryByIdQuery(workspaceId, categoryId);
    const categoriesQuery = useCategoriesQuery(workspaceId);
    const updateCategoryMutation = useUpdateCategoryMutation();

    if (!workspaceId || !categoryId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const scopeBasePath = getScopeBasePath(scopeType, workspaceId);
    const categoriesBasePath = `${scopeBasePath}/categories`;

    if (categoryQuery.isLoading || categoriesQuery.isLoading) {
        return (
            <Page
                title="Editar categoría"
                subtitle="Cargando la información actual de la categoría."
            >
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando categoría…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo la categoría y la jerarquía disponible del workspace.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (categoryQuery.isError || !categoryQuery.data) {
        return (
            <Page
                title="Editar categoría"
                subtitle="No fue posible cargar la categoría."
            >
                <Alert severity="error">
                    {getCategoryErrorMessage(
                        categoryQuery.error,
                        "No se pudo obtener la categoría."
                    )}
                </Alert>
            </Page>
        );
    }

    if (categoriesQuery.isError) {
        return (
            <Page
                title="Editar categoría"
                subtitle="No fue posible cargar la jerarquía de categorías."
            >
                <Alert severity="error">
                    {getCategoryErrorMessage(
                        categoriesQuery.error,
                        "No se pudieron obtener las categorías."
                    )}
                </Alert>
            </Page>
        );
    }

    const categories = categoriesQuery.data?.categories ?? [];
    const parentCategoryOptions = toCategoryParentOptions(categories, categoryId);
    const initialValues = toCategoryFormValues(categoryQuery.data);

    const submitErrorMessage = updateCategoryMutation.isError
        ? getCategoryErrorMessage(
            updateCategoryMutation.error,
            "No se pudo actualizar la categoría."
        )
        : null;

    const handleSubmit = (values: CategoryFormValues) => {
        const payload = toUpdateCategoryPayload(values);

        updateCategoryMutation.mutate(
            {
                workspaceId,
                categoryId,
                payload,
            },
            {
                onSuccess: () => {
                    navigate(categoriesBasePath);
                },
            }
        );
    };

    const handleCancel = () => {
        navigate(categoriesBasePath);
    };

    return (
        <Page
            title="Editar categoría"
            subtitle="Actualiza la configuración, jerarquía y visibilidad de la categoría."
        >
            <CategoryForm
                mode="edit"
                initialValues={initialValues}
                parentCategoryOptions={parentCategoryOptions}
                isSubmitting={updateCategoryMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
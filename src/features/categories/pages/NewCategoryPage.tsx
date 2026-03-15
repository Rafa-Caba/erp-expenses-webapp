// src/features/categories/pages/NewCategoryPage.tsx

import React from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import {
    CategoryForm,
    type CategoryFormValues,
    type CategoryParentOption,
} from "../components/CategoryForm";
import { useCreateCategoryMutation } from "../hooks/useCategoryMutations";
import { useCategoriesQuery } from "../hooks/useCategoriesQuery";
import type {
    CategoryRecord,
    CategoryType,
    CreateCategoryPayload,
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

function toCategoryParentOptions(categories: CategoryRecord[]): CategoryParentOption[] {
    const categoryLookup = new Map<string, CategoryRecord>(
        categories.map((category: CategoryRecord) => [category._id, category])
    );

    return [...categories]
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

function parseOptionalInteger(value: string): number | undefined {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return undefined;
    }

    return Number(trimmedValue);
}

function toCreateCategoryPayload(values: CategoryFormValues): CreateCategoryPayload {
    return {
        name: values.name.trim(),
        type: values.type,
        parentCategoryId: values.parentCategoryId.trim() || null,
        color: values.color.trim() || null,
        icon: values.icon.trim() || null,
        description: values.description.trim() || null,
        sortOrder: parseOptionalInteger(values.sortOrder),
        isSystem: values.isSystem,
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

export function NewCategoryPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const categoriesQuery = useCategoriesQuery(workspaceId);
    const createCategoryMutation = useCreateCategoryMutation();

    if (!workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const scopeBasePath = getScopeBasePath(scopeType, workspaceId);
    const categoriesBasePath = `${scopeBasePath}/categories`;

    if (categoriesQuery.isLoading) {
        return (
            <Page
                title="Nueva categoría"
                subtitle="Cargando categorías disponibles para construir la jerarquía."
            >
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando categorías…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo categorías existentes del workspace activo.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </Page>
        );
    }

    if (categoriesQuery.isError) {
        return (
            <Page
                title="Nueva categoría"
                subtitle="No fue posible cargar las categorías disponibles."
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
    const parentCategoryOptions = toCategoryParentOptions(categories);

    const initialValues: CategoryFormValues = {
        name: "",
        type: "EXPENSE",
        parentCategoryId: "",
        color: "",
        icon: "",
        description: "",
        sortOrder: "",
        isSystem: false,
        isActive: true,
        isVisible: true,
    };

    const submitErrorMessage = createCategoryMutation.isError
        ? getCategoryErrorMessage(
            createCategoryMutation.error,
            "No se pudo crear la categoría."
        )
        : null;

    const handleSubmit = React.useCallback(
        (values: CategoryFormValues) => {
            const payload = toCreateCategoryPayload(values);

            createCategoryMutation.mutate(
                {
                    workspaceId,
                    payload,
                },
                {
                    onSuccess: () => {
                        navigate(categoriesBasePath);
                    },
                }
            );
        },
        [categoriesBasePath, createCategoryMutation, navigate, workspaceId]
    );

    const handleCancel = React.useCallback(() => {
        navigate(categoriesBasePath);
    }, [categoriesBasePath, navigate]);

    return (
        <Page
            title="Nueva categoría"
            subtitle="Agrega una nueva categoría para clasificar ingresos, gastos o ambos."
        >
            <CategoryForm
                mode="create"
                initialValues={initialValues}
                parentCategoryOptions={parentCategoryOptions}
                isSubmitting={createCategoryMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
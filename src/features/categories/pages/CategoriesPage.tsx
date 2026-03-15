// src/features/categories/pages/CategoriesPage.tsx

import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { CategoriesEmptyState } from "../components/CategoriesEmptyState";
import { CategoryCard } from "../components/CategoryCard";
import { CategoriesToolbar } from "../components/CategoriesToolbar";
import { useArchiveCategoryMutation } from "../hooks/useCategoryMutations";
import { useCategoriesQuery } from "../hooks/useCategoriesQuery";
import { useCategoryStore } from "../store/category.store";
import type { CategoryRecord } from "../types/category.types";

type ApiErrorResponse = {
    code?: string;
    message?: string;
};

function getCategoriesBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/categories";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/categories`;
}

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
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

export function CategoriesPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const searchTerm = useCategoryStore((state) => state.searchTerm);
    const typeFilter = useCategoryStore((state) => state.typeFilter);
    const systemFilter = useCategoryStore((state) => state.systemFilter);
    const includeInactive = useCategoryStore((state) => state.includeInactive);
    const includeHidden = useCategoryStore((state) => state.includeHidden);
    const selectedCategoryId = useCategoryStore((state) => state.selectedCategoryId);

    const setSearchTerm = useCategoryStore((state) => state.setSearchTerm);
    const setTypeFilter = useCategoryStore((state) => state.setTypeFilter);
    const setSystemFilter = useCategoryStore((state) => state.setSystemFilter);
    const setIncludeInactive = useCategoryStore((state) => state.setIncludeInactive);
    const setIncludeHidden = useCategoryStore((state) => state.setIncludeHidden);
    const setSelectedCategoryId = useCategoryStore((state) => state.setSelectedCategoryId);
    const resetCategoryUi = useCategoryStore((state) => state.reset);

    const categoriesQuery = useCategoriesQuery(workspaceId);
    const archiveCategoryMutation = useArchiveCategoryMutation();

    const categoriesBasePath = getCategoriesBasePath(scopeType, workspaceId);

    const categoryLookup = React.useMemo(() => {
        const categories = categoriesQuery.data?.categories ?? [];

        return new Map<string, CategoryRecord>(
            categories.map((category: CategoryRecord) => [category._id, category])
        );
    }, [categoriesQuery.data?.categories]);

    const filteredCategories = React.useMemo(() => {
        const categories = [...(categoriesQuery.data?.categories ?? [])];
        const normalizedSearchTerm = normalizeText(searchTerm);

        return categories
            .filter((category: CategoryRecord) => {
                if (!includeInactive && !category.isActive) {
                    return false;
                }

                if (!includeHidden && !category.isVisible) {
                    return false;
                }

                if (typeFilter !== "ALL" && category.type !== typeFilter) {
                    return false;
                }

                if (systemFilter === "SYSTEM" && !category.isSystem) {
                    return false;
                }

                if (systemFilter === "CUSTOM" && category.isSystem) {
                    return false;
                }

                if (!normalizedSearchTerm) {
                    return true;
                }

                const parentCategory = category.parentCategoryId
                    ? categoryLookup.get(category.parentCategoryId)
                    : null;

                const searchableText = [
                    category.name,
                    category.type,
                    category.description ?? "",
                    category.color ?? "",
                    category.icon ?? "",
                    parentCategory?.name ?? "",
                ]
                    .join(" ")
                    .toLocaleLowerCase();

                return searchableText.includes(normalizedSearchTerm);
            })
            .sort((leftCategory, rightCategory) => {
                if (leftCategory.sortOrder !== rightCategory.sortOrder) {
                    return leftCategory.sortOrder - rightCategory.sortOrder;
                }

                return leftCategory.name.localeCompare(rightCategory.name, "es-MX");
            });
    }, [
        categoriesQuery.data?.categories,
        categoryLookup,
        includeHidden,
        includeInactive,
        searchTerm,
        systemFilter,
        typeFilter,
    ]);

    const hasFilters =
        searchTerm.trim().length > 0 ||
        typeFilter !== "ALL" ||
        systemFilter !== "ALL" ||
        includeInactive ||
        includeHidden;

    const handleResetFilters = React.useCallback(() => {
        resetCategoryUi();
    }, [resetCategoryUi]);

    const handleEditCategory = React.useCallback(
        (category: CategoryRecord) => {
            setSelectedCategoryId(category._id);
            navigate(`${categoriesBasePath}/${category._id}/edit`);
        },
        [categoriesBasePath, navigate, setSelectedCategoryId]
    );

    const handleArchiveCategory = React.useCallback(
        (category: CategoryRecord) => {
            if (!workspaceId) {
                return;
            }

            const confirmed = window.confirm(
                `¿Seguro que deseas archivar la categoría "${category.name}"?`
            );

            if (!confirmed) {
                return;
            }

            setSelectedCategoryId(category._id);

            archiveCategoryMutation.mutate({
                workspaceId,
                categoryId: category._id,
            });
        },
        [archiveCategoryMutation, setSelectedCategoryId, workspaceId]
    );

    if (!workspaceId) {
        return (
            <Page title="Categorías" subtitle="Resolviendo el workspace activo.">
                <Alert severity="info">
                    Aún estamos resolviendo el contexto activo del workspace.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Categorías"
            subtitle="Administra las categorías que luego usarán transacciones, reportes, presupuestos y otras vistas del workspace."
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
            >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Aquí administras la taxonomía financiera de ingresos y gastos, incluyendo
                    categorías padre e hijas.
                </Typography>

                <Button variant="contained" onClick={() => navigate(`${categoriesBasePath}/new`)}>
                    Nueva categoría
                </Button>
            </Stack>

            <CategoriesToolbar
                searchTerm={searchTerm}
                typeFilter={typeFilter}
                systemFilter={systemFilter}
                includeInactive={includeInactive}
                includeHidden={includeHidden}
                totalCount={filteredCategories.length}
                onSearchTermChange={setSearchTerm}
                onTypeFilterChange={setTypeFilter}
                onSystemFilterChange={setSystemFilter}
                onIncludeInactiveChange={setIncludeInactive}
                onIncludeHiddenChange={setIncludeHidden}
                onResetFilters={handleResetFilters}
            />

            {archiveCategoryMutation.isError ? (
                <Alert severity="error">
                    {getCategoryErrorMessage(
                        archiveCategoryMutation.error,
                        "No se pudo archivar la categoría."
                    )}
                </Alert>
            ) : null}

            {categoriesQuery.isLoading ? (
                <Box
                    sx={{
                        minHeight: 320,
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando categorías…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo categorías del workspace activo.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            ) : null}

            {!categoriesQuery.isLoading && categoriesQuery.isError ? (
                <Alert severity="error">
                    {getCategoryErrorMessage(
                        categoriesQuery.error,
                        "No se pudieron cargar las categorías."
                    )}
                </Alert>
            ) : null}

            {!categoriesQuery.isLoading &&
                !categoriesQuery.isError &&
                filteredCategories.length === 0 ? (
                <CategoriesEmptyState
                    hasFilters={hasFilters}
                    onClearFilters={handleResetFilters}
                />
            ) : null}

            {!categoriesQuery.isLoading &&
                !categoriesQuery.isError &&
                filteredCategories.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredCategories.map((category: CategoryRecord) => {
                        const parentCategoryName = category.parentCategoryId
                            ? categoryLookup.get(category.parentCategoryId)?.name ?? null
                            : null;

                        return (
                            <Grid key={category._id} size={{ xs: 12, md: 6, xl: 4 }}>
                                <CategoryCard
                                    category={category}
                                    parentCategoryName={parentCategoryName}
                                    isSelected={selectedCategoryId === category._id}
                                    onEdit={handleEditCategory}
                                    onArchive={handleArchiveCategory}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            ) : null}
        </Page>
    );
}
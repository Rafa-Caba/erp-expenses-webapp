// src/features/budgets/pages/EditBudgetPage.tsx

import { Navigate, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { BudgetForm, type BudgetFormValues } from "../components/BudgetForm";
import { useBudgetByIdQuery } from "../hooks/useBudgetByIdQuery";
import { useUpdateBudgetMutation } from "../hooks/useBudgetMutations";
import type { BudgetRecord, UpdateBudgetPayload } from "../types/budget.types";

function getBudgetsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/budgets";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/budgets`;
}

function toNullableTextFieldValue(value: string | null): string {
    return value ?? "";
}

function toDateInputValue(value: string): string {
    return value.slice(0, 10);
}

function toBudgetFormValues(budget: BudgetRecord): BudgetFormValues {
    return {
        name: budget.name,
        periodType: budget.periodType,
        startDate: toDateInputValue(budget.startDate),
        endDate: toDateInputValue(budget.endDate),
        limitAmount: String(budget.limitAmount),
        currency: budget.currency,
        categoryId: toNullableTextFieldValue(budget.categoryId),
        memberId: toNullableTextFieldValue(budget.memberId),
        alertPercent: budget.alertPercent !== null ? String(budget.alertPercent) : "",
        notes: toNullableTextFieldValue(budget.notes),
        isActive: budget.isActive,
        status: budget.status,
        isVisible: budget.isVisible,
    };
}

function toNullableTrimmedString(value: string): string | null {
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : null;
}

function toNullableNumber(value: string): number | null {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return null;
    }

    return Number(trimmedValue);
}

function toUpdateBudgetPayload(values: BudgetFormValues): UpdateBudgetPayload {
    return {
        name: values.name.trim(),
        periodType: values.periodType,
        startDate: values.startDate,
        endDate: values.endDate,
        limitAmount: Number(values.limitAmount),
        currency: values.currency,
        categoryId: toNullableTrimmedString(values.categoryId),
        memberId: toNullableTrimmedString(values.memberId),
        alertPercent: toNullableNumber(values.alertPercent),
        notes: toNullableTrimmedString(values.notes),
        isActive: values.isActive,
        status: values.status,
        isVisible: values.isVisible,
    };
}

function getBudgetErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

export function EditBudgetPage() {
    const navigate = useNavigate();
    const params = useParams<{ budgetId: string }>();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const budgetId = params.budgetId ?? null;

    const budgetQuery = useBudgetByIdQuery(workspaceId, budgetId);
    const updateBudgetMutation = useUpdateBudgetMutation();

    if (!workspaceId || !budgetId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const budgetsBasePath = getBudgetsBasePath(scopeType, workspaceId);

    if (budgetQuery.isLoading) {
        return (
            <Page
                title="Editar presupuesto"
                subtitle="Cargando la información actual del presupuesto."
            >
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando presupuesto…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo los datos actuales del presupuesto.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (budgetQuery.isError || !budgetQuery.data) {
        return (
            <Page
                title="Editar presupuesto"
                subtitle="No fue posible cargar el presupuesto."
            >
                <Alert severity="error">
                    {getBudgetErrorMessage(budgetQuery.error, "No se pudo obtener el presupuesto.")}
                </Alert>
            </Page>
        );
    }

    const submitErrorMessage = updateBudgetMutation.isError
        ? getBudgetErrorMessage(
            updateBudgetMutation.error,
            "No se pudo actualizar el presupuesto."
        )
        : null;

    const initialValues = toBudgetFormValues(budgetQuery.data);

    const handleSubmit = (values: BudgetFormValues) => {
        const payload = toUpdateBudgetPayload(values);

        updateBudgetMutation.mutate(
            {
                workspaceId,
                budgetId,
                payload,
            },
            {
                onSuccess: () => {
                    navigate(budgetsBasePath);
                },
            }
        );
    };

    const handleCancel = () => {
        navigate(budgetsBasePath);
    };

    return (
        <Page
            title="Editar presupuesto"
            subtitle="Actualiza el periodo, límite, estado y visibilidad del presupuesto."
        >
            <BudgetForm
                workspaceId={workspaceId}
                mode="edit"
                initialValues={initialValues}
                isSubmitting={updateBudgetMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
// src/features/budgets/pages/NewBudgetPage.tsx

import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { BudgetForm, type BudgetFormValues } from "../components/BudgetForm";
import { useCreateBudgetMutation } from "../hooks/useBudgetMutations";
import type { CreateBudgetPayload } from "../types/budget.types";

function getBudgetsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/budgets";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/budgets`;
}

function getTodayDateInputValue(): string {
    return new Date().toISOString().slice(0, 10);
}

function getInitialValues(): BudgetFormValues {
    const today = getTodayDateInputValue();

    return {
        name: "",
        periodType: "monthly",
        startDate: today,
        endDate: today,
        limitAmount: "",
        currency: "MXN",
        categoryId: "",
        memberId: "",
        alertPercent: "",
        notes: "",
        isActive: true,
        status: "active",
        isVisible: true,
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

function toCreateBudgetPayload(values: BudgetFormValues): CreateBudgetPayload {
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

export function NewBudgetPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const createBudgetMutation = useCreateBudgetMutation();

    if (!workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const budgetsBasePath = getBudgetsBasePath(scopeType, workspaceId);

    const submitErrorMessage = createBudgetMutation.isError
        ? getBudgetErrorMessage(createBudgetMutation.error, "No se pudo crear el presupuesto.")
        : null;

    const handleSubmit = React.useCallback(
        (values: BudgetFormValues) => {
            const payload = toCreateBudgetPayload(values);

            createBudgetMutation.mutate(
                {
                    workspaceId,
                    payload,
                },
                {
                    onSuccess: () => {
                        navigate(budgetsBasePath);
                    },
                }
            );
        },
        [budgetsBasePath, createBudgetMutation, navigate, workspaceId]
    );

    const handleCancel = React.useCallback(() => {
        navigate(budgetsBasePath);
    }, [budgetsBasePath, navigate]);

    return (
        <Page
            title="Nuevo presupuesto"
            subtitle="Agrega un nuevo presupuesto al workspace activo."
        >
            <BudgetForm
                workspaceId={workspaceId}
                mode="create"
                initialValues={getInitialValues()}
                isSubmitting={createBudgetMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
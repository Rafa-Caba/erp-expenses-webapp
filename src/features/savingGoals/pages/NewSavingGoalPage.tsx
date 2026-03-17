// src/features/savingGoals/pages/NewSavingGoalPage.tsx

import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import { Page } from "../../../shared/ui/Page/Page";
import { SavingGoalForm, type SavingGoalFormValues } from "../components/SavingGoalForm";
import { useCreateSavingGoalMutation } from "../hooks/useSavingGoalMutations";
import type { CreateSavingGoalPayload } from "../types/saving-goal.types";

function getSavingGoalsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/saving-goals";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/saving-goals`;
}

const INITIAL_VALUES: SavingGoalFormValues = {
    accountId: "",
    memberId: "",
    name: "",
    description: "",
    targetAmount: "",
    currentAmount: "0",
    currency: "MXN",
    targetDate: "",
    status: "active",
    priority: "",
    category: "custom",
    isVisible: true,
};

function toCreateSavingGoalPayload(
    values: SavingGoalFormValues
): CreateSavingGoalPayload {
    return {
        accountId: values.accountId.trim() || null,
        memberId: values.memberId.trim() || null,
        name: values.name.trim(),
        description: values.description.trim() || null,
        targetAmount: Number(values.targetAmount),
        currentAmount: Number(values.currentAmount),
        currency: values.currency,
        targetDate: values.targetDate.trim() || null,
        status: values.status,
        priority: values.priority || null,
        category: values.category,
        isVisible: values.isVisible,
    };
}

export function NewSavingGoalPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const createSavingGoalMutation = useCreateSavingGoalMutation();

    if (!workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const savingGoalsBasePath = getSavingGoalsBasePath(scopeType, workspaceId);

    const submitErrorMessage = createSavingGoalMutation.isError
        ? getApiErrorMessage(
            createSavingGoalMutation.error,
            "No se pudo crear la meta."
        )
        : null;

    const handleSubmit = React.useCallback(
        (values: SavingGoalFormValues) => {
            const payload = toCreateSavingGoalPayload(values);

            createSavingGoalMutation.mutate(
                {
                    workspaceId,
                    payload,
                },
                {
                    onSuccess: () => {
                        navigate(savingGoalsBasePath);
                    },
                }
            );
        },
        [createSavingGoalMutation, navigate, savingGoalsBasePath, workspaceId]
    );

    const handleCancel = React.useCallback(() => {
        navigate(savingGoalsBasePath);
    }, [navigate, savingGoalsBasePath]);

    return (
        <Page
            title="Nueva meta de ahorro"
            subtitle="Agrega un nuevo objetivo de ahorro al workspace activo."
        >
            <SavingGoalForm
                mode="create"
                workspaceId={workspaceId}
                initialValues={INITIAL_VALUES}
                isSubmitting={createSavingGoalMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
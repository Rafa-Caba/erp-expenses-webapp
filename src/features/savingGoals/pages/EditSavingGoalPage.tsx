// src/features/savingGoals/pages/EditSavingGoalPage.tsx

import { Navigate, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import { Page } from "../../../shared/ui/Page/Page";
import { SavingGoalForm, type SavingGoalFormValues } from "../components/SavingGoalForm";
import { useSavingGoalByIdQuery } from "../hooks/useSavingGoalByIdQuery";
import { useUpdateSavingGoalMutation } from "../hooks/useSavingGoalMutations";
import type {
    SavingGoalRecord,
    UpdateSavingGoalPayload,
} from "../types/saving-goal.types";

function getSavingGoalsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/saving-goals";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/saving-goals`;
}

function toDateInputValue(value: string | null): string {
    if (!value) {
        return "";
    }

    return value.slice(0, 10);
}

function toSavingGoalFormValues(
    savingGoal: SavingGoalRecord
): SavingGoalFormValues {
    return {
        accountId: savingGoal.accountId ?? "",
        memberId: savingGoal.memberId ?? "",
        name: savingGoal.name,
        description: savingGoal.description ?? "",
        targetAmount: String(savingGoal.targetAmount),
        currentAmount: String(savingGoal.currentAmount),
        currency: savingGoal.currency,
        targetDate: toDateInputValue(savingGoal.targetDate),
        status: savingGoal.status,
        priority: savingGoal.priority ?? "",
        category: savingGoal.category,
        isVisible: savingGoal.isVisible,
    };
}

function toUpdateSavingGoalPayload(
    values: SavingGoalFormValues
): UpdateSavingGoalPayload {
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

export function EditSavingGoalPage() {
    const navigate = useNavigate();
    const params = useParams<{ savingGoalId: string }>();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const savingGoalId = params.savingGoalId ?? null;

    const savingGoalQuery = useSavingGoalByIdQuery(workspaceId, savingGoalId);
    const updateSavingGoalMutation = useUpdateSavingGoalMutation();

    if (!workspaceId || !savingGoalId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const savingGoalsBasePath = getSavingGoalsBasePath(scopeType, workspaceId);

    if (savingGoalQuery.isLoading) {
        return (
            <Page
                title="Editar meta de ahorro"
                subtitle="Cargando la información actual de la meta."
            >
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />

                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando meta…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo los datos actuales de la meta.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (savingGoalQuery.isError || !savingGoalQuery.data) {
        return (
            <Page
                title="Editar meta de ahorro"
                subtitle="No fue posible cargar la meta."
            >
                <Alert severity="error">
                    {getApiErrorMessage(
                        savingGoalQuery.error,
                        "No se pudo obtener la meta."
                    )}
                </Alert>
            </Page>
        );
    }

    const submitErrorMessage = updateSavingGoalMutation.isError
        ? getApiErrorMessage(
            updateSavingGoalMutation.error,
            "No se pudo actualizar la meta."
        )
        : null;

    const initialValues = toSavingGoalFormValues(savingGoalQuery.data);

    const handleSubmit = (values: SavingGoalFormValues) => {
        const payload = toUpdateSavingGoalPayload(values);

        updateSavingGoalMutation.mutate(
            {
                workspaceId,
                savingGoalId,
                payload,
            },
            {
                onSuccess: () => {
                    navigate(savingGoalsBasePath);
                },
            }
        );
    };

    const handleCancel = () => {
        navigate(savingGoalsBasePath);
    };

    return (
        <Page
            title="Editar meta de ahorro"
            subtitle="Actualiza objetivo, monto, estado y vínculos relacionados."
        >
            <SavingGoalForm
                mode="edit"
                workspaceId={workspaceId}
                initialValues={initialValues}
                isSubmitting={updateSavingGoalMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
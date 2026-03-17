// src/features/savingGoals/components/SavingGoalCard.tsx

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAccountLabelById } from "../../../shared/utils/labels/account-label.util";
import { useWorkspaceMemberLabelById } from "../../../shared/utils/labels/workspace-member-label.util";
import type { SavingGoalRecord } from "../types/saving-goal.types";
import {
    getSavingsGoalCategoryLabel,
    getSavingsGoalPriorityLabel,
} from "../utils/saving-goal-labels";
import { SavingGoalPriorityChip } from "./SavingGoalPriorityChip";
import { SavingGoalStatusChip } from "./SavingGoalStatusChip";

type SavingGoalCardProps = {
    savingGoal: SavingGoalRecord;
    isSelected: boolean;
    onEdit: (savingGoal: SavingGoalRecord) => void;
    onDelete: (savingGoal: SavingGoalRecord) => void;
};

function formatMoney(amount: number, currency: string): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatDate(value: string | null): string {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(new Date(value));
}

function getVisibilityLabel(isVisible: boolean): string {
    return isVisible ? "Visible" : "Oculta";
}

function clampProgress(value: number): number {
    if (value < 0) {
        return 0;
    }

    if (value > 100) {
        return 100;
    }

    return value;
}

export function SavingGoalCard({
    savingGoal,
    isSelected,
    onEdit,
    onDelete,
}: SavingGoalCardProps) {
    const accountLabel = useAccountLabelById(
        savingGoal.workspaceId,
        savingGoal.accountId
    ).label;

    const memberLabel = useWorkspaceMemberLabelById(
        savingGoal.workspaceId,
        savingGoal.memberId
    ).label;

    const progressPercent = clampProgress(savingGoal.progressPercent);

    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                borderRadius: 3,
                borderColor: isSelected ? "primary.main" : "divider",
                boxShadow: isSelected ? 3 : 0,
            }}
        >
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <SavingGoalStatusChip status={savingGoal.status} />
                    <SavingGoalPriorityChip priority={savingGoal.priority} />
                    <Chip
                        size="small"
                        variant="outlined"
                        label={getVisibilityLabel(savingGoal.isVisible)}
                    />
                    <Chip
                        size="small"
                        variant="outlined"
                        label={getSavingsGoalCategoryLabel(savingGoal.category)}
                    />
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {savingGoal.name}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        {savingGoal.description ?? "Sin descripción"}
                    </Typography>

                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatMoney(savingGoal.currentAmount, savingGoal.currency)} de{" "}
                        {formatMoney(savingGoal.targetAmount, savingGoal.currency)}
                    </Typography>

                    <Stack spacing={0.75}>
                        <LinearProgress
                            variant="determinate"
                            value={progressPercent}
                            sx={{ height: 10, borderRadius: 999 }}
                        />

                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            Progreso: {progressPercent.toFixed(2)}% • Restante:{" "}
                            {formatMoney(
                                savingGoal.remainingAmount,
                                savingGoal.currency
                            )}
                        </Typography>
                    </Stack>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Cuenta:</strong> {accountLabel}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Miembro:</strong> {memberLabel}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Fecha meta:</strong> {formatDate(savingGoal.targetDate)}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Prioridad:</strong>{" "}
                        {getSavingsGoalPriorityLabel(savingGoal.priority)}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                <Button variant="outlined" fullWidth onClick={() => onEdit(savingGoal)}>
                    Editar
                </Button>

                <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    onClick={() => onDelete(savingGoal)}
                >
                    Eliminar
                </Button>
            </CardActions>
        </Card>
    );
}
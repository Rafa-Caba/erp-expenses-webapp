// src/features/reminders/components/ReminderRelatedEntityLabel.tsx

import { useAccountLabelById } from "../../../shared/utils/labels/account-label.util";
import { useBudgetLabelById } from "../../../shared/utils/labels/budget-label.util";
import { useCardLabelById } from "../../../shared/utils/labels/card-label.util";
import { useDebtLabelById } from "../../../shared/utils/labels/debt-label.util";
import { usePaymentLabelById } from "../../../shared/utils/labels/payment-label.util";
import { useReceiptLabelById } from "../../../shared/utils/labels/receipt-label.util";
import { useSavingGoalLabelById } from "../../../shared/utils/labels/saving-goal-label.util";
import { useTransactionLabelById } from "../../../shared/utils/labels/transaction-label.util";
import type { ReminderRelatedEntityType } from "../types/reminder.types";

type ReminderRelatedEntityLabelProps = {
    workspaceId: string;
    relatedEntityType: ReminderRelatedEntityType | null;
    relatedEntityId: string | null;
};

type ReminderRelatedEntityItemProps = {
    workspaceId: string;
    relatedEntityId: string | null;
};

function ReminderTransactionEntityLabel({
    workspaceId,
    relatedEntityId,
}: ReminderRelatedEntityItemProps) {
    const label = useTransactionLabelById(workspaceId, relatedEntityId).label;

    return <>{label}</>;
}

function ReminderReceiptEntityLabel({
    workspaceId,
    relatedEntityId,
}: ReminderRelatedEntityItemProps) {
    const label = useReceiptLabelById(workspaceId, relatedEntityId).label;

    return <>{label}</>;
}

function ReminderDebtEntityLabel({
    workspaceId,
    relatedEntityId,
}: ReminderRelatedEntityItemProps) {
    const label = useDebtLabelById(workspaceId, relatedEntityId).label;

    return <>{label}</>;
}

function ReminderPaymentEntityLabel({
    workspaceId,
    relatedEntityId,
}: ReminderRelatedEntityItemProps) {
    const label = usePaymentLabelById(workspaceId, relatedEntityId).label;

    return <>{label}</>;
}

function ReminderBudgetEntityLabel({
    workspaceId,
    relatedEntityId,
}: ReminderRelatedEntityItemProps) {
    const label = useBudgetLabelById(workspaceId, relatedEntityId).label;

    return <>{label}</>;
}

function ReminderSavingGoalEntityLabel({
    workspaceId,
    relatedEntityId,
}: ReminderRelatedEntityItemProps) {
    const label = useSavingGoalLabelById(workspaceId, relatedEntityId).label;

    return <>{label}</>;
}

function ReminderAccountEntityLabel({
    workspaceId,
    relatedEntityId,
}: ReminderRelatedEntityItemProps) {
    const label = useAccountLabelById(workspaceId, relatedEntityId).label;

    return <>{label}</>;
}

function ReminderCardEntityLabel({
    workspaceId,
    relatedEntityId,
}: ReminderRelatedEntityItemProps) {
    const label = useCardLabelById(workspaceId, relatedEntityId).label;

    return <>{label}</>;
}

export function ReminderRelatedEntityLabel({
    workspaceId,
    relatedEntityType,
    relatedEntityId,
}: ReminderRelatedEntityLabelProps) {
    if (!relatedEntityType) {
        return <>Sin entidad relacionada</>;
    }

    if (relatedEntityType === "custom") {
        return <>{relatedEntityId ?? "—"}</>;
    }

    switch (relatedEntityType) {
        case "transaction":
            return (
                <ReminderTransactionEntityLabel
                    workspaceId={workspaceId}
                    relatedEntityId={relatedEntityId}
                />
            );

        case "receipt":
            return (
                <ReminderReceiptEntityLabel
                    workspaceId={workspaceId}
                    relatedEntityId={relatedEntityId}
                />
            );

        case "debt":
            return (
                <ReminderDebtEntityLabel
                    workspaceId={workspaceId}
                    relatedEntityId={relatedEntityId}
                />
            );

        case "payment":
            return (
                <ReminderPaymentEntityLabel
                    workspaceId={workspaceId}
                    relatedEntityId={relatedEntityId}
                />
            );

        case "budget":
            return (
                <ReminderBudgetEntityLabel
                    workspaceId={workspaceId}
                    relatedEntityId={relatedEntityId}
                />
            );

        case "saving_goal":
            return (
                <ReminderSavingGoalEntityLabel
                    workspaceId={workspaceId}
                    relatedEntityId={relatedEntityId}
                />
            );

        case "account":
            return (
                <ReminderAccountEntityLabel
                    workspaceId={workspaceId}
                    relatedEntityId={relatedEntityId}
                />
            );

        case "card":
            return (
                <ReminderCardEntityLabel
                    workspaceId={workspaceId}
                    relatedEntityId={relatedEntityId}
                />
            );
    }
}
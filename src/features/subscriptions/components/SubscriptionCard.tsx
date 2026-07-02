// src/features/subscriptions/components/SubscriptionCard.tsx
// Subscription card with quick action to create a reviewed expense transaction.

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAccountLabelById } from "../../../shared/utils/labels/account-label.util";
import { useCardLabelById } from "../../../shared/utils/labels/card-label.util";
import { useCategoryLabelById } from "../../../shared/utils/labels/category-label.util";
import { useWorkspaceMemberLabelById } from "../../../shared/utils/labels/workspace-member-label.util";
import type {
    SubscriptionBillingFrequency,
    SubscriptionRecord,
    SubscriptionStatus,
} from "../types/subscription.types";

type SubscriptionCardProps = {
    subscription: SubscriptionRecord;
    isSelected: boolean;
    isCreatingTransaction: boolean;
    onEdit: (subscription: SubscriptionRecord) => void;
    onDelete: (subscription: SubscriptionRecord) => void;
    onCreateTransaction: (subscription: SubscriptionRecord) => void;
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

function getFrequencyLabel(value: SubscriptionBillingFrequency): string {
    switch (value) {
        case "weekly":
            return "Semanal";
        case "biweekly":
            return "Quincenal";
        case "monthly":
            return "Mensual";
        case "yearly":
            return "Anual";
    }
}

function getStatusLabel(status: SubscriptionStatus): string {
    switch (status) {
        case "active":
            return "Activa";
        case "paused":
            return "Pausada";
        case "cancelled":
            return "Cancelada";
    }
}

function getStatusColor(status: SubscriptionStatus): "success" | "warning" | "default" {
    if (status === "active") {
        return "success";
    }

    if (status === "paused") {
        return "warning";
    }

    return "default";
}

function getSourceLabel(args: {
    subscription: SubscriptionRecord;
    accountLabel: string | null;
    cardLabel: string | null;
}): string {
    const { subscription, accountLabel, cardLabel } = args;

    if (subscription.accountId) {
        return `Cuenta: ${accountLabel ?? subscription.accountId}`;
    }

    if (subscription.cardId) {
        return `Tarjeta: ${cardLabel ?? subscription.cardId}`;
    }

    return "Sin fuente";
}

export function SubscriptionCard({
    subscription,
    isSelected,
    isCreatingTransaction,
    onEdit,
    onDelete,
    onCreateTransaction,
}: SubscriptionCardProps) {
    const memberLabel = useWorkspaceMemberLabelById(
        subscription.workspaceId,
        subscription.memberId
    ).label;
    const categoryLabel = useCategoryLabelById(
        subscription.workspaceId,
        subscription.categoryId
    ).label;
    const accountLabel = useAccountLabelById(
        subscription.workspaceId,
        subscription.accountId
    ).label;
    const cardLabel = useCardLabelById(
        subscription.workspaceId,
        subscription.cardId
    ).label;

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
                    <Chip
                        size="small"
                        color={getStatusColor(subscription.status)}
                        label={getStatusLabel(subscription.status)}
                    />
                    <Chip size="small" variant="outlined" label={getFrequencyLabel(subscription.billingFrequency)} />
                    {subscription.autoCreateTransaction ? (
                        <Chip size="small" color="info" variant="outlined" label="Auto futuro" />
                    ) : null}
                    <Chip
                        size="small"
                        variant="outlined"
                        label={subscription.isVisible ? "Visible" : "Oculta"}
                    />
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {subscription.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Merchant:</strong> {subscription.merchant ?? "—"}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Monto esperado:</strong> {formatMoney(subscription.amount, subscription.currency)}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Próximo cobro:</strong> {formatDate(subscription.nextBillingDate)}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Día de cobro:</strong> {subscription.billingDay ?? "—"}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Inicio:</strong> {formatDate(subscription.startDate)}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Fin:</strong> {formatDate(subscription.endDate)}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Fuente:</strong> {getSourceLabel({ subscription, accountLabel, cardLabel })}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Categoría:</strong> {categoryLabel ?? subscription.categoryId}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Miembro:</strong> {memberLabel ?? subscription.memberId}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Última transacción:</strong> {subscription.lastTransactionId ?? "—"}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Notas:</strong> {subscription.notes ?? "—"}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1, flexWrap: "wrap" }}>
                <Button
                    variant="contained"
                    fullWidth
                    disabled={subscription.status !== "active" || isCreatingTransaction}
                    onClick={() => onCreateTransaction(subscription)}
                >
                    Crear transacción
                </Button>
                <Button variant="outlined" fullWidth onClick={() => onEdit(subscription)}>
                    Editar
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => onDelete(subscription)}
                >
                    Eliminar
                </Button>
            </CardActions>
        </Card>
    );
}

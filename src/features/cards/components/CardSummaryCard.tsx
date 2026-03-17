// src/features/cards/components/CardSummaryCard.tsx

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { CardRecord } from "../types/card.types";
import { CardTypeChip } from "./CardTypeChip";
import { useWorkspaceMemberLabelById } from "../../../shared/utils/labels/workspace-member-label.util";

type CardSummaryCardProps = {
    card: CardRecord;
    isSelected: boolean;
    accountName: string;
    accountCurrency: string | null;
    onEdit: (card: CardRecord) => void;
    onArchive: (card: CardRecord) => void;
};

function formatAmount(amount: number, currency: string | null): string {
    if (currency) {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }).format(amount);
    }

    return new Intl.NumberFormat("es-MX", {
        maximumFractionDigits: 2,
    }).format(amount);
}

function getVisibilityLabel(isVisible: boolean): string {
    return isVisible ? "Visible" : "Oculta";
}

export function CardSummaryCard({
    card,
    isSelected,
    accountName,
    accountCurrency,
    onEdit,
    onArchive,
}: CardSummaryCardProps) {

    const memberLabel = useWorkspaceMemberLabelById(
        card.workspaceId,
        card.holderMemberId
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
                    <CardTypeChip type={card.type} />
                    <Chip size="small" variant="outlined" label={getVisibilityLabel(card.isVisible)} />

                    {!card.isActive ? (
                        <Chip size="small" color="warning" label="Inactiva" />
                    ) : null}

                    {card.isArchived ? (
                        <Chip size="small" color="default" label="Archivada" />
                    ) : null}
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {card.name}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Cuenta:</strong> {accountName}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Marca:</strong> {card.brand?.trim() ? card.brand : "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Últimos 4:</strong> {card.last4}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Holder member:</strong>{" "}
                        {memberLabel.trim() ? memberLabel : "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Notas:</strong> {card.notes?.trim() ? card.notes : "—"}
                    </Typography>
                </Stack>

                {card.type === "credit" ? (
                    <>
                        <Divider />

                        <Stack spacing={0.75}>
                            <Typography variant="body2">
                                <strong>Límite:</strong>{" "}
                                {card.creditLimit !== null
                                    ? formatAmount(card.creditLimit, accountCurrency)
                                    : "—"}
                            </Typography>

                            <Typography variant="body2">
                                <strong>Corte:</strong> {card.closingDay ?? "—"}
                            </Typography>

                            <Typography variant="body2">
                                <strong>Pago:</strong> {card.dueDay ?? "—"}
                            </Typography>
                        </Stack>
                    </>
                ) : null}
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                <Button variant="outlined" fullWidth onClick={() => onEdit(card)}>
                    Editar
                </Button>

                <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    onClick={() => onArchive(card)}
                >
                    Archivar
                </Button>
            </CardActions>
        </Card>
    );
}
// src/features/accounts/components/AccountCard.tsx

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { AccountRecord } from "../types/account.types";
import { AccountTypeChip } from "./AccountTypeChip";
import { useWorkspaceMemberLabelById } from "../../../shared/utils/labels/workspace-member-label.util";

type AccountCardProps = {
    account: AccountRecord;
    isSelected: boolean;
    workspaceId: string;
    onEdit: (account: AccountRecord) => void;
    onArchive: (account: AccountRecord) => void;
};

function formatMoney(amount: number, currency: string): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}

function getVisibilityLabel(isVisible: boolean): string {
    return isVisible ? "Visible" : "Oculta";
}

export function AccountCard({
    account,
    isSelected,
    workspaceId,
    onEdit,
    onArchive,
}: AccountCardProps) {

    const memberLabel = useWorkspaceMemberLabelById(
        workspaceId,
        account.ownerMemberId
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
                    <AccountTypeChip type={account.type} />
                    <Chip size="small" variant="outlined" label={getVisibilityLabel(account.isVisible)} />
                    {!account.isActive ? (
                        <Chip size="small" color="warning" label="Inactiva" />
                    ) : null}
                    {account.isArchived ? (
                        <Chip size="small" color="default" label="Archivada" />
                    ) : null}
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {account.name}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Banco:</strong> {account.bankName?.trim() ? account.bankName : "—"}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Saldo actual:</strong>{" "}
                        {formatMoney(account.currentBalance, account.currency)}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Saldo inicial:</strong>{" "}
                        {formatMoney(account.initialBalance, account.currency)}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Moneda:</strong> {account.currency}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Últimos dígitos:</strong>{" "}
                        {account.accountNumberMasked?.trim()
                            ? account.accountNumberMasked
                            : "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Owner member:</strong>{" "}
                        {memberLabel.trim() ? memberLabel : "—"}
                    </Typography>
                </Stack>

                {account.type === "credit" ? (
                    <>
                        <Divider />

                        <Stack spacing={0.75}>
                            <Typography variant="body2">
                                <strong>Límite:</strong>{" "}
                                {account.creditLimit !== null
                                    ? formatMoney(account.creditLimit, account.currency)
                                    : "—"}
                            </Typography>

                            <Typography variant="body2">
                                <strong>Corte:</strong>{" "}
                                {account.statementClosingDay ?? "—"}
                            </Typography>

                            <Typography variant="body2">
                                <strong>Pago:</strong>{" "}
                                {account.paymentDueDay ?? "—"}
                            </Typography>
                        </Stack>
                    </>
                ) : null}
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                <Button variant="outlined" fullWidth onClick={() => onEdit(account)}>
                    Editar
                </Button>

                <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    onClick={() => onArchive(account)}
                >
                    Archivar
                </Button>
            </CardActions>
        </Card>
    );
}
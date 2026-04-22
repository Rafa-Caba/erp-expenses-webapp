// src/features/adminUsers/components/AdminUserCard.tsx

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { UserRecord } from "../types/user.types";
import { UserRoleChip } from "./UserRoleChip";
import { UserStatusChip } from "./UserStatusChip";
import { UserVerificationChip } from "./UserVerificationChip";

type AdminUserCardProps = {
    user: UserRecord;
    isSelected: boolean;
    isResendingVerification: boolean;
    isResettingPassword: boolean;
    onEdit: (user: UserRecord) => void;
    onDelete: (user: UserRecord) => void;
    onResendVerification: (user: UserRecord) => void;
    onResetPassword: (user: UserRecord) => void;
};

function formatDate(value: string | null): string {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function getInitials(fullName: string): string {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return "?";
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 1).toUpperCase();
    }

    return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

export function AdminUserCard({
    user,
    isSelected,
    isResendingVerification,
    isResettingPassword,
    onEdit,
    onDelete,
    onResendVerification,
    onResetPassword,
}: AdminUserCardProps) {
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
            <CardContent sx={{ display: "grid", gap: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                        src={user.avatarUrl ?? undefined}
                        alt={user.fullName}
                        sx={{ width: 52, height: 52 }}
                    >
                        {getInitials(user.fullName)}
                    </Avatar>

                    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            {user.fullName}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                opacity: 0.78,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {user.email}
                        </Typography>
                    </Stack>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <UserRoleChip role={user.role} />
                    <UserStatusChip isActive={user.isActive} />
                    <UserVerificationChip isEmailVerified={user.isEmailVerified} />
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Teléfono:</strong> {user.phone?.trim() ? user.phone : "—"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Debe cambiar contraseña:</strong>{" "}
                        {user.mustChangePassword ? "Sí" : "No"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Último acceso:</strong> {formatDate(user.lastLoginAt)}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Creado:</strong> {formatDate(user.createdAt)}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Actualizado:</strong> {formatDate(user.updatedAt)}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions
                sx={{
                    px: 2,
                    pb: 2,
                    pt: 0,
                    gap: 1,
                    flexWrap: "wrap",
                }}
            >
                {!user.isEmailVerified ? (
                    <Button
                        variant="outlined"
                        color="warning"
                        fullWidth
                        disabled={isResendingVerification}
                        onClick={() => onResendVerification(user)}
                    >
                        {isResendingVerification
                            ? "Reenviando verificación..."
                            : "Reenviar verificación"}
                    </Button>
                ) : null}

                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    disabled={isResettingPassword}
                    onClick={() => onResetPassword(user)}
                >
                    {isResettingPassword
                        ? "Reseteando contraseña..."
                        : "Reset contraseña"}
                </Button>

                <Button variant="outlined" fullWidth onClick={() => onEdit(user)}>
                    Editar
                </Button>

                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => onDelete(user)}
                >
                    Eliminar
                </Button>
            </CardActions>
        </Card>
    );
}
// src/features/profile/components/ProfileSummaryCard.tsx

import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { AuthUser } from "../../auth/types/auth.types";

type ProfileSummaryCardProps = {
    user: AuthUser;
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

function getRoleLabel(role: AuthUser["role"]): string | undefined {
    switch (role) {
        case "ADMIN":
            return "Admin";
        case "USER":
            return "Usuario";
    }
}

export function ProfileSummaryCard({ user }: ProfileSummaryCardProps) {
    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                            src={user.avatarUrl ?? undefined}
                            alt={user.fullName}
                            sx={{ width: 64, height: 64 }}
                        >
                            {getInitials(user.fullName)}
                        </Avatar>

                        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {user.fullName}
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.78 }}>
                                {user.email}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip
                            label={getRoleLabel(user.role)}
                            color={user.role === "ADMIN" ? "primary" : "default"}
                            size="small"
                            variant={user.role === "ADMIN" ? "filled" : "outlined"}
                        />

                        <Chip
                            label={user.isActive ? "Activo" : "Inactivo"}
                            color={user.isActive ? "success" : "default"}
                            size="small"
                            variant={user.isActive ? "filled" : "outlined"}
                        />

                        <Chip
                            label={user.isEmailVerified ? "Email verificado" : "Email no verificado"}
                            color={user.isEmailVerified ? "info" : "warning"}
                            size="small"
                            variant="outlined"
                        />
                    </Stack>

                    <Stack spacing={0.75}>
                        <Typography variant="body2">
                            <strong>Teléfono:</strong> {user.phone?.trim() ? user.phone : "—"}
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
                </Stack>
            </CardContent>
        </Card>
    );
}
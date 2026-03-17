// src/features/workspaces/components/WorkspaceMemberCard.tsx

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { MemberStatus } from "../../../shared/types/common.types";
import type { WorkspaceMemberRecord } from "../types/workspace-member.types";
import { WorkspaceMemberPermissionsPreview } from "./WorkspaceMemberPermissionsPreview";
import { WorkspaceMemberRoleChip } from "./WorkspaceMemberRoleChip";
import { WorkspaceMemberStatusChip } from "./WorkspaceMemberStatusChip";
import { useWorkspaceLabelById } from "../../../shared/utils/labels/workspace-label.util";
import { useWorkspaceMemberLabelById } from "../../../shared/utils/labels/workspace-member-label.util";

type WorkspaceMemberCardProps = {
    member: WorkspaceMemberRecord;
    isSelected: boolean;
    onEdit: (member: WorkspaceMemberRecord) => void;
    onDelete: (member: WorkspaceMemberRecord) => void;
    onChangeStatus: (
        member: WorkspaceMemberRecord,
        nextStatus: MemberStatus
    ) => void;
};

function formatJoinedAt(value: string | null): string {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleDateString("es-MX");
}

function getNextStatus(currentStatus: MemberStatus): MemberStatus {
    switch (currentStatus) {
        case "invited":
            return "active";
        case "active":
            return "disabled";
        case "disabled":
            return "invited";
    }
}

function getNextStatusLabel(currentStatus: MemberStatus): string {
    switch (currentStatus) {
        case "invited":
            return "Marcar activo";
        case "active":
            return "Deshabilitar";
        case "disabled":
            return "Reinvitar";
    }
}

function getVisibilityLabel(isVisible: boolean): string {
    return isVisible ? "Visible" : "Oculto";
}

export function WorkspaceMemberCard({
    member,
    isSelected,
    onEdit,
    onDelete,
    onChangeStatus,
}: WorkspaceMemberCardProps) {
    const nextStatus = getNextStatus(member.status);

    const workspaceLabel = useWorkspaceLabelById(
        member.workspaceId,
    ).label;

    const memberLabel = useWorkspaceMemberLabelById(
        member.workspaceId,
        member.invitedByUserId
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
                    <WorkspaceMemberRoleChip role={member.role} />
                    <WorkspaceMemberStatusChip status={member.status} />
                    <Chip size="small" variant="outlined" label={getVisibilityLabel(member.isVisible)} />
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {member.displayName}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>User ID:</strong> {member.userId}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Workspace:</strong> {workspaceLabel}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Ingreso:</strong> {formatJoinedAt(member.joinedAt)}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Invitado por:</strong> {memberLabel ?? "—"}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Notas:</strong> {member.notes?.trim() ? member.notes : "—"}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={1}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Permisos ({member.permissions.length})
                    </Typography>

                    <WorkspaceMemberPermissionsPreview permissions={member.permissions} />
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
                <Button variant="outlined" onClick={() => onEdit(member)}>
                    Editar
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => onChangeStatus(member, nextStatus)}
                >
                    {getNextStatusLabel(member.status)}
                </Button>

                <Button variant="outlined" color="error" onClick={() => onDelete(member)}>
                    Eliminar
                </Button>
            </CardActions>
        </Card>
    );
}
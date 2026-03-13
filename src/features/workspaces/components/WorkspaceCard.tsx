// src/features/workspaces/components/WorkspaceCard.tsx

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import type { WorkspaceListItem } from "../types/workspace.types";
import { WorkspaceTypeChip } from "./WorkspaceTypeChip";

type WorkspaceCardProps = {
    workspace: WorkspaceListItem;
    isSelected: boolean;
    onOpen: (workspace: WorkspaceListItem) => void;
    onEdit: (workspace: WorkspaceListItem) => void;
};

function getVisibilityLabel(visibility: WorkspaceListItem["visibility"]): string {
    switch (visibility) {
        case "PRIVATE":
            return "Privado";
        case "SHARED":
            return "Compartido";
    }
}

function getKindLabel(kind: WorkspaceListItem["kind"]): string {
    switch (kind) {
        case "INDIVIDUAL":
            return "Individual";
        case "COLLABORATIVE":
            return "Colaborativo";
    }
}

export function WorkspaceCard({
    workspace,
    isSelected,
    onOpen,
    onEdit,
}: WorkspaceCardProps) {
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
                    <WorkspaceTypeChip workspaceType={workspace.type} />
                    <Chip size="small" variant="outlined" label={getVisibilityLabel(workspace.visibility)} />
                    <Chip size="small" variant="outlined" label={getKindLabel(workspace.kind)} />
                    {!workspace.isActive ? (
                        <Chip size="small" color="warning" label="Inactivo" />
                    ) : null}
                    {workspace.isArchived ? (
                        <Chip size="small" color="default" label="Archivado" />
                    ) : null}
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {workspace.name}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8, minHeight: 40 }}>
                        {workspace.description?.trim()
                            ? workspace.description
                            : "Sin descripción por ahora."}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Moneda:</strong> {workspace.currency}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Zona horaria:</strong> {workspace.timezone}
                    </Typography>
                    <Typography variant="body2">
                        <strong>País:</strong> {workspace.country?.trim() ? workspace.country : "—"}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Miembros:</strong> {workspace.memberCount ?? "—"}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                <Button variant="outlined" fullWidth onClick={() => onEdit(workspace)}>
                    Editar
                </Button>

                <Button variant="contained" fullWidth onClick={() => onOpen(workspace)}>
                    {workspace.type === "PERSONAL" ? "Abrir panel personal" : "Abrir workspace"}
                </Button>
            </CardActions>
        </Card>
    );
}
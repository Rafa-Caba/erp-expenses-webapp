// src/features/workspaces/components/WorkspaceMemberPermissionsPreview.tsx

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { WorkspacePermission } from "../../../shared/types/common.types";

type WorkspaceMemberPermissionsPreviewProps = {
    permissions: WorkspacePermission[];
};

export function WorkspaceMemberPermissionsPreview({
    permissions,
}: WorkspaceMemberPermissionsPreviewProps) {
    if (permissions.length === 0) {
        return (
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                Sin permisos explícitos.
            </Typography>
        );
    }

    const preview = permissions.slice(0, 3);
    const remaining = permissions.length - preview.length;

    return (
        <Stack spacing={0.5}>
            {preview.map((permission) => (
                <Typography key={permission} variant="body2" sx={{ opacity: 0.8 }}>
                    • {permission}
                </Typography>
            ))}

            {remaining > 0 ? (
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    +{remaining} permiso{remaining === 1 ? "" : "s"} más
                </Typography>
            ) : null}
        </Stack>
    );
}
// src/features/workspaces/components/WorkspacePermissionsDialog.tsx

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import type {
    MemberRole,
    WorkspacePermission,
} from "../../../shared/types/common.types";

export const ALL_WORKSPACE_PERMISSIONS: WorkspacePermission[] = [
    "workspace.read",
    "workspace.update",
    "workspace.archive",

    "workspace.settings.read",
    "workspace.settings.update",

    "themes.read",
    "themes.update",

    "workspace.members.read",
    "workspace.members.create",
    "workspace.members.update",
    "workspace.members.delete",
    "workspace.members.status.update",

    "accounts.read",
    "accounts.create",
    "accounts.update",
    "accounts.delete",

    "categories.read",
    "categories.create",
    "categories.update",
    "categories.delete",

    "transactions.read",
    "transactions.create",
    "transactions.update",
    "transactions.delete",

    "budgets.read",
    "budgets.create",
    "budgets.update",
    "budgets.delete",

    "debts.read",
    "debts.create",
    "debts.update",
    "debts.delete",
    "debts.pay",

    "payments.read",
    "payments.create",
    "payments.update",
    "payments.delete",

    "reconciliation.read",
    "reconciliation.create",
    "reconciliation.update",
    "reconciliation.delete",

    "savingGoals.read",
    "savingGoals.create",
    "savingGoals.update",
    "savingGoals.delete",

    "reminders.read",
    "reminders.create",
    "reminders.update",
    "reminders.delete",

    "reports.read",
    "reports.create",
    "reports.update",
    "reports.delete",
];

export const READ_ONLY_WORKSPACE_PERMISSIONS: WorkspacePermission[] = [
    "workspace.read",
    "workspace.settings.read",
    "themes.read",
    "workspace.members.read",
    "accounts.read",
    "categories.read",
    "transactions.read",
    "budgets.read",
    "debts.read",
    "payments.read",
    "reconciliation.read",
    "savingGoals.read",
    "reminders.read",
    "reports.read",
];

export const ADMIN_WORKSPACE_PERMISSIONS: WorkspacePermission[] =
    ALL_WORKSPACE_PERMISSIONS.filter(
        (permission) => permission !== "workspace.archive"
    );

type WorkspacePermissionsDialogProps = {
    open: boolean;
    role: MemberRole;
    permissions: WorkspacePermission[];
    isSubmitting: boolean;
    onClose: () => void;
    onTogglePermission: (permission: WorkspacePermission) => void;
    onSetPermissions: (permissions: WorkspacePermission[]) => void;
    onToggleAllPermissions: () => void;
};

function areAllPermissionsSelected(
    permissions: WorkspacePermission[]
): boolean {
    return ALL_WORKSPACE_PERMISSIONS.every((permission) =>
        permissions.includes(permission)
    );
}

function getSelectedPermissionsCount(
    permissions: WorkspacePermission[]
): number {
    return permissions.length;
}

export function WorkspacePermissionsDialog({
    open,
    role,
    permissions,
    isSubmitting,
    onClose,
    onTogglePermission,
    onSetPermissions,
    onToggleAllPermissions,
}: WorkspacePermissionsDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const allSelected = areAllPermissionsSelected(permissions);
    const selectedPermissionsCount = getSelectedPermissionsCount(permissions);

    return (
        <Dialog
            open={open}
            onClose={isSubmitting ? undefined : onClose}
            fullWidth
            maxWidth="lg"
            fullScreen={fullScreen}
        >
            <DialogTitle sx={{ pb: 1.5 }}>
                <Stack spacing={1}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Permisos del miembro
                        </Typography>

                        <Typography variant="body2" sx={{ opacity: 0.78, mt: 0.5 }}>
                            {selectedPermissionsCount} de {ALL_WORKSPACE_PERMISSIONS.length} permisos seleccionados.
                        </Typography>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                    >
                        <Chip
                            size="small"
                            label={allSelected ? "Todos seleccionados" : "Selección manual"}
                            color={allSelected ? "primary" : "default"}
                            variant={allSelected ? "filled" : "outlined"}
                        />
                        <Chip
                            size="small"
                            label={`Rol actual: ${role}`}
                            variant="outlined"
                        />
                    </Stack>
                </Stack>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={2.5}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                        justifyContent="flex-end"
                    >
                        <Button
                            variant={allSelected ? "contained" : "outlined"}
                            onClick={onToggleAllPermissions}
                            disabled={isSubmitting}
                        >
                            {allSelected ? "Quitar todos" : "Seleccionar todos"}
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => onSetPermissions(ADMIN_WORKSPACE_PERMISSIONS)}
                            disabled={isSubmitting}
                        >
                            Preset admin
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => onSetPermissions(READ_ONLY_WORKSPACE_PERMISSIONS)}
                            disabled={isSubmitting}
                        >
                            Solo lectura
                        </Button>

                        <Button
                            variant="text"
                            color="inherit"
                            onClick={() => onSetPermissions([])}
                            disabled={isSubmitting}
                        >
                            Limpiar
                        </Button>
                    </Stack>

                    <Grid container spacing={1.5}>
                        {ALL_WORKSPACE_PERMISSIONS.map((permission) => (
                            <Grid key={permission} size={{ xs: 12, md: 6, xl: 4 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={permissions.includes(permission)}
                                            onChange={() => onTogglePermission(permission)}
                                            disabled={isSubmitting}
                                        />
                                    }
                                    label={permission}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={isSubmitting}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
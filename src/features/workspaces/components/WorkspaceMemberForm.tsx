// src/features/workspaces/components/WorkspaceMemberForm.tsx

import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { UserSelect } from "../../components/UserSelect";
import type {
    MemberRole,
    MemberStatus,
    WorkspacePermission,
} from "../../../shared/types/common.types";

export type WorkspaceMemberFormValues = {
    userId: string;
    displayName: string;
    role: MemberRole;
    status: MemberStatus;
    joinedAt: string;
    notes: string;
    isVisible: boolean;
    permissions: WorkspacePermission[];
};

type WorkspaceMemberFormField =
    | "userId"
    | "displayName"
    | "role"
    | "status";

type WorkspaceMemberFormErrors = Partial<Record<WorkspaceMemberFormField, string>>;

type WorkspaceMemberFormProps = {
    mode: "create" | "edit";
    initialValues: WorkspaceMemberFormValues;
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: WorkspaceMemberFormValues) => void;
    onCancel: () => void;
};

const ALL_WORKSPACE_PERMISSIONS: WorkspacePermission[] = [
    "workspace.read",
    "workspace.update",
    "workspace.archive",
    "workspace.settings.read",
    "workspace.settings.update",
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

function validateWorkspaceMemberForm(
    values: WorkspaceMemberFormValues,
    mode: "create" | "edit"
): WorkspaceMemberFormErrors {
    const errors: WorkspaceMemberFormErrors = {};

    if (mode === "create" && !values.userId.trim()) {
        errors.userId = "El usuario es obligatorio.";
    }

    if (!values.displayName.trim()) {
        errors.displayName = "El nombre visible es obligatorio.";
    }

    if (!values.role) {
        errors.role = "El rol es obligatorio.";
    }

    if (!values.status) {
        errors.status = "El estado es obligatorio.";
    }

    return errors;
}

export function WorkspaceMemberForm({
    mode,
    initialValues,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: WorkspaceMemberFormProps) {
    const [values, setValues] = React.useState<WorkspaceMemberFormValues>(initialValues);
    const [errors, setErrors] = React.useState<WorkspaceMemberFormErrors>({});

    React.useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const handleTextChange =
        (field: keyof WorkspaceMemberFormValues) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
            };

    const handleUserIdChange = (userId: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            userId,
        }));
    };

    const handleRoleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (
            value === "OWNER" ||
            value === "ADMIN" ||
            value === "MEMBER" ||
            value === "VIEWER"
        ) {
            setValues((currentValues) => ({
                ...currentValues,
                role: value,
            }));
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "active" || value === "invited" || value === "disabled") {
            setValues((currentValues) => ({
                ...currentValues,
                status: value,
            }));
        }
    };

    const handleVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues((currentValues) => ({
            ...currentValues,
            isVisible: event.target.checked,
        }));
    };

    const handlePermissionToggle = (permission: WorkspacePermission) => {
        setValues((currentValues) => {
            const exists = currentValues.permissions.includes(permission);

            if (exists) {
                return {
                    ...currentValues,
                    permissions: currentValues.permissions.filter(
                        (currentPermission) => currentPermission !== permission
                    ),
                };
            }

            return {
                ...currentValues,
                permissions: [...currentValues.permissions, permission],
            };
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateWorkspaceMemberForm(values, mode);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        onSubmit(values);
    };

    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {mode === "create" ? "Nuevo miembro" : "Editar miembro"}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Configura el acceso, visibilidad, permisos y estado del miembro dentro del workspace.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? (
                            <Alert severity="error">{submitErrorMessage}</Alert>
                        ) : null}

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <UserSelect
                                    value={values.userId}
                                    onChange={handleUserIdChange}
                                    label="Usuario"
                                    error={Boolean(errors.userId)}
                                    helperText={
                                        mode === "edit"
                                            ? "El usuario asociado no se edita desde aquí."
                                            : errors.userId ?? "Selecciona un usuario existente para asociarlo al miembro."
                                    }
                                    disabled={isSubmitting || mode === "edit"}
                                    allowEmpty={false}
                                    activeFilter="ACTIVE"
                                    emptyOptionLabel="Selecciona un usuario"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Nombre visible"
                                    value={values.displayName}
                                    onChange={handleTextChange("displayName")}
                                    error={Boolean(errors.displayName)}
                                    helperText={errors.displayName}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth error={Boolean(errors.role)}>
                                    <InputLabel id="workspace-member-role-label">Rol</InputLabel>
                                    <Select
                                        labelId="workspace-member-role-label"
                                        label="Rol"
                                        value={values.role}
                                        onChange={handleRoleChange}
                                    >
                                        <MenuItem value="OWNER">Owner</MenuItem>
                                        <MenuItem value="ADMIN">Admin</MenuItem>
                                        <MenuItem value="MEMBER">Miembro</MenuItem>
                                        <MenuItem value="VIEWER">Viewer</MenuItem>
                                    </Select>
                                    {errors.role ? (
                                        <FormHelperText>{errors.role}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth error={Boolean(errors.status)}>
                                    <InputLabel id="workspace-member-status-label">Estado</InputLabel>
                                    <Select
                                        labelId="workspace-member-status-label"
                                        label="Estado"
                                        value={values.status}
                                        onChange={handleStatusChange}
                                    >
                                        <MenuItem value="active">Activo</MenuItem>
                                        <MenuItem value="invited">Invitado</MenuItem>
                                        <MenuItem value="disabled">Deshabilitado</MenuItem>
                                    </Select>
                                    {errors.status ? (
                                        <FormHelperText>{errors.status}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Fecha de ingreso"
                                    type="date"
                                    value={values.joinedAt}
                                    onChange={handleTextChange("joinedAt")}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Notas"
                                    value={values.notes}
                                    onChange={handleTextChange("notes")}
                                    multiline
                                    minRows={3}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={values.isVisible}
                                    onChange={handleVisibilityChange}
                                />
                            }
                            label="Visible"
                        />

                        <Divider />

                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                                Permisos
                            </Typography>

                            <Grid container spacing={1.5}>
                                {ALL_WORKSPACE_PERMISSIONS.map((permission) => (
                                    <Grid key={permission} size={{ xs: 12, md: 6, xl: 4 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={values.permissions.includes(permission)}
                                                    onChange={() => handlePermissionToggle(permission)}
                                                />
                                            }
                                            label={permission}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                                Cancelar
                            </Button>

                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {mode === "create" ? "Crear miembro" : "Guardar cambios"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
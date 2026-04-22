// src/features/adminUsers/components/AdminResetUserPasswordDialog.tsx

import React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import type { UserRecord } from "../types/user.types";

export type AdminResetUserPasswordValues = {
    newPassword: string;
    confirmPassword: string;
    mustChangePassword: boolean;
};

type AdminResetUserPasswordDialogProps = {
    open: boolean;
    user: UserRecord | null;
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onClose: () => void;
    onSubmit: (values: AdminResetUserPasswordValues) => void;
};

type AdminResetUserPasswordErrors = Partial<
    Record<keyof AdminResetUserPasswordValues, string>
>;

const INITIAL_VALUES: AdminResetUserPasswordValues = {
    newPassword: "",
    confirmPassword: "",
    mustChangePassword: true,
};

function validateValues(
    values: AdminResetUserPasswordValues
): AdminResetUserPasswordErrors {
    const errors: AdminResetUserPasswordErrors = {};

    if (!values.newPassword.trim()) {
        errors.newPassword = "La nueva contraseña es obligatoria.";
    } else if (values.newPassword.trim().length < 8) {
        errors.newPassword = "La contraseña debe tener al menos 8 caracteres.";
    }

    if (!values.confirmPassword.trim()) {
        errors.confirmPassword = "La confirmación es obligatoria.";
    } else if (values.confirmPassword !== values.newPassword) {
        errors.confirmPassword = "Las contraseñas no coinciden.";
    }

    return errors;
}

export function AdminResetUserPasswordDialog({
    open,
    user,
    isSubmitting,
    submitErrorMessage = null,
    onClose,
    onSubmit,
}: AdminResetUserPasswordDialogProps) {
    const [values, setValues] =
        React.useState<AdminResetUserPasswordValues>(INITIAL_VALUES);
    const [errors, setErrors] = React.useState<AdminResetUserPasswordErrors>({});
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    React.useEffect(() => {
        if (!open) {
            setValues(INITIAL_VALUES);
            setErrors({});
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        }
    }, [open]);

    const handleTextChange =
        (field: "newPassword" | "confirmPassword") =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
            };

    const handleMustChangePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            mustChangePassword: event.target.checked,
        }));
    };

    const handleSubmit = () => {
        const nextErrors = validateValues(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        onSubmit(values);
    };

    return (
        <Dialog
            open={open}
            onClose={isSubmitting ? undefined : onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    border: (theme) =>
                        `1px solid ${theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.2)"
                            : "rgba(0,0,0,0.08)"
                        }`,
                    boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                            ? "0 20px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.2)"
                            : "0 18px 40px rgba(0,0,0,0.14)",
                    backgroundImage: "none",
                    backgroundColor: "background.paper",
                    overflow: "hidden",
                },
            }}
        >
            <DialogTitle
                sx={{
                    pb: 1.5,
                    fontWeight: 800,
                    borderBottom: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                    backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(0,0,0,0.015)",
                }}
            >
                Resetear contraseña
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    borderTop: "none",
                    borderBottom: "none",
                    backgroundColor: "background.paper",
                }}
            >
                <Stack spacing={2.5}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {user
                            ? `Define una nueva contraseña temporal para ${user.fullName}.`
                            : "Define una nueva contraseña temporal para el usuario."}
                    </Typography>

                    {submitErrorMessage ? (
                        <Alert severity="error">{submitErrorMessage}</Alert>
                    ) : null}

                    <TextField
                        label="Nueva contraseña temporal"
                        type={showNewPassword ? "text" : "password"}
                        value={values.newPassword}
                        onChange={handleTextChange("newPassword")}
                        error={Boolean(errors.newPassword)}
                        helperText={errors.newPassword ?? "Mínimo 8 caracteres."}
                        fullWidth
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            onClick={() =>
                                                setShowNewPassword((currentValue) => !currentValue)
                                            }
                                            aria-label={
                                                showNewPassword
                                                    ? "Ocultar contraseña"
                                                    : "Mostrar contraseña"
                                            }
                                        >
                                            {showNewPassword ? (
                                                <VisibilityOffIcon />
                                            ) : (
                                                <VisibilityIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        label="Confirmar contraseña"
                        type={showConfirmPassword ? "text" : "password"}
                        value={values.confirmPassword}
                        onChange={handleTextChange("confirmPassword")}
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword}
                        fullWidth
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (currentValue) => !currentValue
                                                )
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Ocultar confirmación de contraseña"
                                                    : "Mostrar confirmación de contraseña"
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <VisibilityOffIcon />
                                            ) : (
                                                <VisibilityIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={values.mustChangePassword}
                                onChange={handleMustChangePasswordChange}
                            />
                        }
                        label="Obligar al usuario a cambiar su contraseña al iniciar sesión"
                    />
                </Stack>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(0,0,0,0.015)",
                }}
            >
                <Button onClick={onClose} disabled={isSubmitting} variant="outlined">
                    Cancelar
                </Button>

                <Button onClick={handleSubmit} disabled={isSubmitting} variant="contained">
                    {isSubmitting ? "Guardando..." : "Guardar contraseña"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
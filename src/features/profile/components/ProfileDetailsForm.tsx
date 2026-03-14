// src/features/profile/components/ProfileDetailsForm.tsx

import React from "react";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export type ProfileDetailsFormValues = {
    fullName: string;
    phone: string;
    avatarFile: File | null;
};

type ProfileDetailsFormInitialValues = {
    fullName: string;
    phone: string;
    avatarUrl: string;
};

type ProfileDetailsFormField = "fullName" | "phone" | "avatarFile";

type ProfileDetailsFormErrors = Partial<Record<ProfileDetailsFormField, string>>;

type ProfileDetailsFormProps = {
    email: string;
    initialValues: ProfileDetailsFormInitialValues;
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    submitSuccessMessage?: string | null;
    onSubmit: (values: ProfileDetailsFormValues) => void;
};

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

function validateProfileDetailsForm(
    values: ProfileDetailsFormValues
): ProfileDetailsFormErrors {
    const errors: ProfileDetailsFormErrors = {};

    if (!values.fullName.trim()) {
        errors.fullName = "El nombre completo es obligatorio.";
    }

    if (values.phone.trim() && values.phone.trim().length < 7) {
        errors.phone = "El teléfono parece demasiado corto.";
    }

    if (values.avatarFile && !values.avatarFile.type.startsWith("image/")) {
        errors.avatarFile = "El archivo seleccionado debe ser una imagen.";
    }

    return errors;
}

export function ProfileDetailsForm({
    email,
    initialValues,
    isSubmitting,
    submitErrorMessage = null,
    submitSuccessMessage = null,
    onSubmit,
}: ProfileDetailsFormProps) {
    const [values, setValues] = React.useState<ProfileDetailsFormValues>({
        fullName: initialValues.fullName,
        phone: initialValues.phone,
        avatarFile: null,
    });

    const [errors, setErrors] = React.useState<ProfileDetailsFormErrors>({});
    const [avatarPreviewUrl, setAvatarPreviewUrl] = React.useState<string>(
        initialValues.avatarUrl
    );

    const previewObjectUrlRef = React.useRef<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        if (previewObjectUrlRef.current) {
            URL.revokeObjectURL(previewObjectUrlRef.current);
            previewObjectUrlRef.current = null;
        }

        setValues({
            fullName: initialValues.fullName,
            phone: initialValues.phone,
            avatarFile: null,
        });
        setErrors({});
        setAvatarPreviewUrl(initialValues.avatarUrl);
    }, [initialValues]);

    React.useEffect(() => {
        return () => {
            if (previewObjectUrlRef.current) {
                URL.revokeObjectURL(previewObjectUrlRef.current);
                previewObjectUrlRef.current = null;
            }
        };
    }, []);

    const handleTextChange =
        (field: "fullName" | "phone") =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
            };

    const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        if (!file) {
            return;
        }

        if (previewObjectUrlRef.current) {
            URL.revokeObjectURL(previewObjectUrlRef.current);
            previewObjectUrlRef.current = null;
        }

        const nextPreviewUrl = URL.createObjectURL(file);
        previewObjectUrlRef.current = nextPreviewUrl;

        setValues((currentValues) => ({
            ...currentValues,
            avatarFile: file,
        }));

        setAvatarPreviewUrl(nextPreviewUrl);
    };

    const handleClearSelectedAvatar = () => {
        if (previewObjectUrlRef.current) {
            URL.revokeObjectURL(previewObjectUrlRef.current);
            previewObjectUrlRef.current = null;
        }

        setValues((currentValues) => ({
            ...currentValues,
            avatarFile: null,
        }));

        setAvatarPreviewUrl(initialValues.avatarUrl);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleReset = () => {
        if (previewObjectUrlRef.current) {
            URL.revokeObjectURL(previewObjectUrlRef.current);
            previewObjectUrlRef.current = null;
        }

        setValues({
            fullName: initialValues.fullName,
            phone: initialValues.phone,
            avatarFile: null,
        });
        setErrors({});
        setAvatarPreviewUrl(initialValues.avatarUrl);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateProfileDetailsForm(values);
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
                                Datos del perfil
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Actualiza tu información general visible dentro de la cuenta.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? (
                            <Alert severity="error">{submitErrorMessage}</Alert>
                        ) : null}

                        {submitSuccessMessage ? (
                            <Alert severity="success">{submitSuccessMessage}</Alert>
                        ) : null}

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={3}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                        >
                            <Avatar
                                src={avatarPreviewUrl || undefined}
                                alt={values.fullName}
                                sx={{ width: 150, height: 150 }}
                            >
                                {getInitials(values.fullName)}
                            </Avatar>

                            <Stack spacing={1.25}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    disabled={isSubmitting}
                                >
                                    Seleccionar imagen
                                    <input
                                        ref={fileInputRef}
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarFileChange}
                                    />
                                </Button>

                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    {values.avatarFile
                                        ? `Archivo seleccionado: ${values.avatarFile.name}`
                                        : "Puedes subir una nueva foto de perfil."}
                                </Typography>

                                {values.avatarFile ? (
                                    <Button
                                        variant="text"
                                        color="inherit"
                                        onClick={handleClearSelectedAvatar}
                                        disabled={isSubmitting}
                                        sx={{ alignSelf: "flex-start", px: 0 }}
                                    >
                                        Quitar selección
                                    </Button>
                                ) : null}

                                {errors.avatarFile ? (
                                    <Typography variant="caption" color="error">
                                        {errors.avatarFile}
                                    </Typography>
                                ) : null}
                            </Stack>
                        </Stack>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Nombre completo"
                                    value={values.fullName}
                                    onChange={handleTextChange("fullName")}
                                    error={Boolean(errors.fullName)}
                                    helperText={errors.fullName}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Email"
                                    value={email}
                                    disabled
                                    helperText="El email no se edita desde esta vista."
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Teléfono"
                                    value={values.phone}
                                    onChange={handleTextChange("phone")}
                                    error={Boolean(errors.phone)}
                                    helperText={errors.phone ?? "Opcional."}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button
                                variant="outlined"
                                onClick={handleReset}
                                disabled={isSubmitting}
                            >
                                Restaurar
                            </Button>

                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {isSubmitting ? "Guardando..." : "Guardar perfil"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
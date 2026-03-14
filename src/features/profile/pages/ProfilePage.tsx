// src/features/profile/pages/ProfilePage.tsx

import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { useAuthMe } from "../../auth/hooks/useAuthMe";
import { useAuthStore } from "../../auth/store/auth.store";
import { ProfileDetailsForm, type ProfileDetailsFormValues } from "../components/ProfileDetailsForm";
import { ProfilePasswordForm } from "../components/ProfilePasswordForm";
import { ProfileSummaryCard } from "../components/ProfileSummaryCard";
import {
    useChangeProfilePasswordMutation,
    useUpdateProfileMutation,
} from "../hooks/useProfileMutations";

type ProfilePasswordFormValues = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

function getNullableStringValue(value: string | null): string {
    return value ?? "";
}

function getProfileErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

export function ProfilePage() {
    const storedUser = useAuthStore((state) => state.user);

    const authMeQuery = useAuthMe();
    const updateProfileMutation = useUpdateProfileMutation();
    const changePasswordMutation = useChangeProfilePasswordMutation();

    const user = authMeQuery.data ?? storedUser;

    const handleSubmitProfile = React.useCallback(
        (values: ProfileDetailsFormValues) => {
            const formData = new FormData();

            formData.append("fullName", values.fullName.trim());
            formData.append("phone", values.phone.trim());

            if (values.avatarFile) {
                formData.append("avatar", values.avatarFile);
            }

            updateProfileMutation.mutate(formData);
        },
        [updateProfileMutation]
    );

    const handleSubmitPassword = React.useCallback(
        (values: ProfilePasswordFormValues) => {
            changePasswordMutation.mutate({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
        },
        [changePasswordMutation]
    );

    if (authMeQuery.isLoading && !user) {
        return (
            <Page title="Perfil" subtitle="Cargando información de la cuenta.">
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando perfil…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo los datos de tu cuenta.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (authMeQuery.isError && !user) {
        return (
            <Page title="Perfil" subtitle="No fue posible cargar tu cuenta.">
                <Alert severity="error">
                    {getProfileErrorMessage(
                        authMeQuery.error,
                        "No se pudo obtener la información del perfil."
                    )}
                </Alert>
            </Page>
        );
    }

    if (!user) {
        return (
            <Page title="Perfil" subtitle="No encontramos datos de sesión.">
                <Alert severity="warning">
                    No hay información de usuario disponible en este momento.
                </Alert>
            </Page>
        );
    }

    const profileInitialValues = {
        fullName: user.fullName,
        phone: getNullableStringValue(user.phone),
        avatarUrl: getNullableStringValue(user.avatarUrl),
    };

    const profileSuccessMessage = updateProfileMutation.isSuccess
        ? "Perfil actualizado correctamente."
        : null;

    const passwordSuccessMessage = changePasswordMutation.isSuccess
        ? changePasswordMutation.data.message
        : null;

    return (
        <Page
            title="Perfil"
            subtitle="Administra tu información personal y la seguridad de tu cuenta."
        >
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 4 }}>
                    <ProfileSummaryCard user={user} />
                </Grid>

                <Grid size={{ xs: 12, lg: 8 }}>
                    <Stack spacing={2}>
                        <ProfileDetailsForm
                            email={user.email}
                            initialValues={profileInitialValues}
                            isSubmitting={updateProfileMutation.isPending}
                            submitErrorMessage={
                                updateProfileMutation.isError
                                    ? getProfileErrorMessage(
                                        updateProfileMutation.error,
                                        "No se pudo actualizar el perfil."
                                    )
                                    : null
                            }
                            submitSuccessMessage={profileSuccessMessage}
                            onSubmit={handleSubmitProfile}
                        />

                        <ProfilePasswordForm
                            isSubmitting={changePasswordMutation.isPending}
                            submitErrorMessage={
                                changePasswordMutation.isError
                                    ? getProfileErrorMessage(
                                        changePasswordMutation.error,
                                        "No se pudo cambiar la contraseña."
                                    )
                                    : null
                            }
                            submitSuccessMessage={passwordSuccessMessage}
                            onSubmit={handleSubmitPassword}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </Page>
    );
}
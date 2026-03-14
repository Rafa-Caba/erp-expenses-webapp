// src/features/adminUsers/pages/EditAdminUserPage.tsx

import { useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { AdminUserForm, type AdminUserFormValues } from "../components/AdminUserForm";
import { useAdminUserByIdQuery } from "../hooks/useAdminUserByIdQuery";
import { useUpdateAdminUserMutation } from "../hooks/useAdminUserMutations";
import type { UpdateUserPayload, UserRecord } from "../types/user.types";

function toNullableTextFieldValue(value: string | null): string {
    return value ?? "";
}

function toAdminUserFormValues(user: UserRecord): AdminUserFormValues {
    return {
        fullName: user.fullName,
        email: user.email,
        password: "",
        phone: toNullableTextFieldValue(user.phone),
        avatarUrl: toNullableTextFieldValue(user.avatarUrl),
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
    };
}

function toNullableTrimmedString(value: string): string | null {
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : null;
}

function toUpdateUserPayload(values: AdminUserFormValues): UpdateUserPayload {
    return {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: toNullableTrimmedString(values.phone),
        avatarUrl: toNullableTrimmedString(values.avatarUrl),
        role: values.role,
        isActive: values.isActive,
        isEmailVerified: values.isEmailVerified,
    };
}

function getUserErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

export function EditAdminUserPage() {
    const navigate = useNavigate();
    const params = useParams<{ userId: string }>();

    const userId = params.userId ?? null;

    const adminUserQuery = useAdminUserByIdQuery(userId);
    const updateAdminUserMutation = useUpdateAdminUserMutation();

    if (!userId) {
        return null;
    }

    if (adminUserQuery.isLoading) {
        return (
            <Page
                title="Editar usuario"
                subtitle="Cargando la información actual del usuario."
            >
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando usuario…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo los datos actuales del usuario.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (adminUserQuery.isError || !adminUserQuery.data) {
        return (
            <Page
                title="Editar usuario"
                subtitle="No fue posible cargar el usuario."
            >
                <Alert severity="error">
                    {getUserErrorMessage(adminUserQuery.error, "No se pudo obtener el usuario.")}
                </Alert>
            </Page>
        );
    }

    const submitErrorMessage = updateAdminUserMutation.isError
        ? getUserErrorMessage(
            updateAdminUserMutation.error,
            "No se pudo actualizar el usuario."
        )
        : null;

    const initialValues = toAdminUserFormValues(adminUserQuery.data);

    const handleSubmit = (values: AdminUserFormValues) => {
        const payload = toUpdateUserPayload(values);

        updateAdminUserMutation.mutate(
            {
                userId,
                payload,
            },
            {
                onSuccess: () => {
                    navigate("/app/admin/users");
                },
            }
        );
    };

    const handleCancel = () => {
        navigate("/app/admin/users");
    };

    return (
        <Page
            title="Editar usuario"
            subtitle="Actualiza datos generales, rol, estado y verificación del usuario."
        >
            <AdminUserForm
                mode="edit"
                initialValues={initialValues}
                isSubmitting={updateAdminUserMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
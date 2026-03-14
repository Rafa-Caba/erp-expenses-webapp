// src/features/adminUsers/pages/NewAdminUserPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";

import { Page } from "../../../shared/ui/Page/Page";
import { AdminUserForm, type AdminUserFormValues } from "../components/AdminUserForm";
import { useCreateAdminUserMutation } from "../hooks/useAdminUserMutations";
import type { CreateUserPayload } from "../types/user.types";

function getInitialValues(): AdminUserFormValues {
    return {
        fullName: "",
        email: "",
        password: "",
        phone: "",
        avatarUrl: "",
        role: "USER",
        isActive: true,
        isEmailVerified: false,
    };
}

function toNullableTrimmedString(value: string): string | null {
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : null;
}

function toCreateUserPayload(values: AdminUserFormValues): CreateUserPayload {
    return {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
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

export function NewAdminUserPage() {
    const navigate = useNavigate();

    const createAdminUserMutation = useCreateAdminUserMutation();

    const submitErrorMessage = createAdminUserMutation.isError
        ? getUserErrorMessage(createAdminUserMutation.error, "No se pudo crear el usuario.")
        : null;

    const handleSubmit = React.useCallback(
        (values: AdminUserFormValues) => {
            const payload = toCreateUserPayload(values);

            createAdminUserMutation.mutate(payload, {
                onSuccess: () => {
                    navigate("/app/admin/users");
                },
            });
        },
        [createAdminUserMutation, navigate]
    );

    const handleCancel = React.useCallback(() => {
        navigate("/app/admin/users");
    }, [navigate]);

    return (
        <Page
            title="Nuevo usuario"
            subtitle="Agrega un nuevo usuario global al sistema."
        >
            <AdminUserForm
                mode="create"
                initialValues={getInitialValues()}
                isSubmitting={createAdminUserMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
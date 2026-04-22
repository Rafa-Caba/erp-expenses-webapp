// src/features/adminUsers/pages/AdminUsersPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import type { PaginationMeta } from "../../../shared/types/api.types";
import { AdminResetUserPasswordDialog } from "../components/AdminResetUserPasswordDialog";
import type { AdminResetUserPasswordValues } from "../components/AdminResetUserPasswordDialog";
import { AdminUserCard } from "../components/AdminUserCard";
import { AdminUsersEmptyState } from "../components/AdminUsersEmptyState";
import { AdminUsersPagination } from "../components/AdminUsersPagination";
import { AdminUsersToolbar } from "../components/AdminUsersToolbar";
import {
    useAdminResetUserPasswordMutation,
    useDeleteAdminUserMutation,
    useResendAdminUserVerificationMutation,
} from "../hooks/useAdminUserMutations";
import { useAdminUsersQuery } from "../hooks/useAdminUsersQuery";
import { useAdminUsersStore } from "../store/adminUsers.store";
import type { ListUsersQuery, UserRecord } from "../types/user.types";

function getAdminUsersQueryParams(
    searchTerm: string,
    roleFilter: "ALL" | "USER" | "ADMIN",
    activeFilter: "ALL" | "ACTIVE" | "INACTIVE",
    page: number,
    limit: number
): ListUsersQuery {
    return {
        page,
        limit,
        search: searchTerm.trim() ? searchTerm.trim() : undefined,
        role: roleFilter === "ALL" ? undefined : roleFilter,
        isActive:
            activeFilter === "ALL"
                ? undefined
                : activeFilter === "ACTIVE"
                    ? true
                    : false,
    };
}

function getUserErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

function getFallbackPagination(page: number, limit: number, totalItems: number): PaginationMeta {
    return {
        page,
        limit,
        totalItems,
        totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    };
}

export function AdminUsersPage() {
    const navigate = useNavigate();

    const searchTerm = useAdminUsersStore((state) => state.searchTerm);
    const roleFilter = useAdminUsersStore((state) => state.roleFilter);
    const activeFilter = useAdminUsersStore((state) => state.activeFilter);
    const page = useAdminUsersStore((state) => state.page);
    const limit = useAdminUsersStore((state) => state.limit);
    const selectedUserId = useAdminUsersStore((state) => state.selectedUserId);

    const setSearchTerm = useAdminUsersStore((state) => state.setSearchTerm);
    const setRoleFilter = useAdminUsersStore((state) => state.setRoleFilter);
    const setActiveFilter = useAdminUsersStore((state) => state.setActiveFilter);
    const setPage = useAdminUsersStore((state) => state.setPage);
    const setLimit = useAdminUsersStore((state) => state.setLimit);
    const setSelectedUserId = useAdminUsersStore((state) => state.setSelectedUserId);
    const resetAdminUsersUi = useAdminUsersStore((state) => state.reset);

    const queryParams = React.useMemo(
        () => getAdminUsersQueryParams(searchTerm, roleFilter, activeFilter, page, limit),
        [activeFilter, limit, page, roleFilter, searchTerm]
    );

    const adminUsersQuery = useAdminUsersQuery(queryParams);
    const deleteAdminUserMutation = useDeleteAdminUserMutation();
    const resendVerificationMutation = useResendAdminUserVerificationMutation();
    const resetUserPasswordMutation = useAdminResetUserPasswordMutation();

    const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);
    const [resetPasswordTargetUser, setResetPasswordTargetUser] =
        React.useState<UserRecord | null>(null);

    const users = adminUsersQuery.data?.items ?? [];
    const pagination =
        adminUsersQuery.data?.pagination ?? getFallbackPagination(page, limit, users.length);

    const hasFilters =
        searchTerm.trim().length > 0 || roleFilter !== "ALL" || activeFilter !== "ALL";

    const handleResetFilters = React.useCallback(() => {
        resetAdminUsersUi();
        setFeedbackMessage(null);
    }, [resetAdminUsersUi]);

    const handleEditUser = React.useCallback(
        (user: UserRecord) => {
            setSelectedUserId(user.id);
            navigate(`/app/admin/users/${user.id}/edit`);
        },
        [navigate, setSelectedUserId]
    );

    const handleDeleteUser = React.useCallback(
        (user: UserRecord) => {
            const confirmed = window.confirm(
                `¿Seguro que deseas eliminar al usuario "${user.fullName}"?`
            );

            if (!confirmed) {
                return;
            }

            setFeedbackMessage(null);
            setSelectedUserId(user.id);
            deleteAdminUserMutation.mutate(user.id);
        },
        [deleteAdminUserMutation, setSelectedUserId]
    );

    const handleResendVerification = React.useCallback(
        (user: UserRecord) => {
            setFeedbackMessage(null);
            setSelectedUserId(user.id);

            resendVerificationMutation.mutate(
                {
                    email: user.email,
                },
                {
                    onSuccess: (response) => {
                        setFeedbackMessage(response.message);
                    },
                }
            );
        },
        [resendVerificationMutation, setSelectedUserId]
    );

    const handleOpenResetPasswordDialog = React.useCallback(
        (user: UserRecord) => {
            setFeedbackMessage(null);
            setSelectedUserId(user.id);
            setResetPasswordTargetUser(user);
        },
        [setSelectedUserId]
    );

    const handleCloseResetPasswordDialog = React.useCallback(() => {
        if (resetUserPasswordMutation.isPending) {
            return;
        }

        setResetPasswordTargetUser(null);
    }, [resetUserPasswordMutation.isPending]);

    const handleSubmitResetPassword = React.useCallback(
        (values: AdminResetUserPasswordValues) => {
            if (!resetPasswordTargetUser) {
                return;
            }

            resetUserPasswordMutation.mutate(
                {
                    userId: resetPasswordTargetUser.id,
                    payload: {
                        newPassword: values.newPassword.trim(),
                        mustChangePassword: values.mustChangePassword,
                    },
                },
                {
                    onSuccess: (response) => {
                        setFeedbackMessage(response.message);
                        setResetPasswordTargetUser(null);
                    },
                }
            );
        },
        [resetPasswordTargetUser, resetUserPasswordMutation]
    );

    const handlePageChange = React.useCallback(
        (nextPage: number) => {
            setPage(nextPage);
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        },
        [setPage]
    );

    return (
        <Page
            title="Usuarios"
            subtitle="Vista global para listar, crear, editar y administrar usuarios del sistema."
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
            >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Esta vista es global y no depende de un workspace específico.
                </Typography>

                <Button variant="contained" onClick={() => navigate("/app/admin/users/new")}>
                    Nuevo usuario
                </Button>
            </Stack>

            <AdminUsersToolbar
                searchTerm={searchTerm}
                roleFilter={roleFilter}
                activeFilter={activeFilter}
                limit={limit}
                totalCount={pagination.totalItems}
                onSearchTermChange={setSearchTerm}
                onRoleFilterChange={setRoleFilter}
                onActiveFilterChange={setActiveFilter}
                onLimitChange={setLimit}
                onResetFilters={handleResetFilters}
            />

            {feedbackMessage ? <Alert severity="success">{feedbackMessage}</Alert> : null}

            {resendVerificationMutation.isError ? (
                <Alert severity="error">
                    {getUserErrorMessage(
                        resendVerificationMutation.error,
                        "No se pudo reenviar el correo de verificación."
                    )}
                </Alert>
            ) : null}

            {resetUserPasswordMutation.isError ? (
                <Alert severity="error">
                    {getUserErrorMessage(
                        resetUserPasswordMutation.error,
                        "No se pudo resetear la contraseña del usuario."
                    )}
                </Alert>
            ) : null}

            {deleteAdminUserMutation.isError ? (
                <Alert severity="error">
                    {getUserErrorMessage(
                        deleteAdminUserMutation.error,
                        "No se pudo eliminar el usuario."
                    )}
                </Alert>
            ) : null}

            {adminUsersQuery.isLoading ? (
                <Box
                    sx={{
                        minHeight: 320,
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>Cargando usuarios…</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo usuarios globales del sistema.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            ) : null}

            {!adminUsersQuery.isLoading && adminUsersQuery.isError ? (
                <Alert severity="error">
                    {getUserErrorMessage(
                        adminUsersQuery.error,
                        "No se pudieron cargar los usuarios."
                    )}
                </Alert>
            ) : null}

            {!adminUsersQuery.isLoading && !adminUsersQuery.isError && users.length === 0 ? (
                <AdminUsersEmptyState
                    hasFilters={hasFilters}
                    onClearFilters={handleResetFilters}
                />
            ) : null}

            {!adminUsersQuery.isLoading && !adminUsersQuery.isError && users.length > 0 ? (
                <>
                    <Grid container spacing={2}>
                        {users.map((user) => (
                            <Grid key={user.id} size={{ xs: 12, md: 6, xl: 4 }}>
                                <AdminUserCard
                                    user={user}
                                    isSelected={selectedUserId === user.id}
                                    isResendingVerification={
                                        resendVerificationMutation.isPending &&
                                        selectedUserId === user.id
                                    }
                                    isResettingPassword={
                                        resetUserPasswordMutation.isPending &&
                                        selectedUserId === user.id
                                    }
                                    onEdit={handleEditUser}
                                    onDelete={handleDeleteUser}
                                    onResendVerification={handleResendVerification}
                                    onResetPassword={handleOpenResetPasswordDialog}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <AdminUsersPagination
                        page={pagination.page}
                        limit={pagination.limit}
                        totalItems={pagination.totalItems}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : null}

            <AdminResetUserPasswordDialog
                open={Boolean(resetPasswordTargetUser)}
                user={resetPasswordTargetUser}
                isSubmitting={resetUserPasswordMutation.isPending}
                submitErrorMessage={
                    resetUserPasswordMutation.isError
                        ? getUserErrorMessage(
                            resetUserPasswordMutation.error,
                            "No se pudo resetear la contraseña del usuario."
                        )
                        : null
                }
                onClose={handleCloseResetPasswordDialog}
                onSubmit={handleSubmitResetPassword}
            />
        </Page>
    );
}
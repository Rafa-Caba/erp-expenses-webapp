// src/features/reminders/pages/RemindersPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import { Page } from "../../../shared/ui/Page/Page";
import { ReminderCard } from "../components/ReminderCard";
import { RemindersEmptyState } from "../components/RemindersEmptyState";
import { RemindersToolbar } from "../components/RemindersToolbar";
import { useDeleteReminderMutation } from "../hooks/useReminderMutations";
import { useRemindersQuery } from "../hooks/useRemindersQuery";
import { useReminderStore } from "../store/reminder.store";
import type { ReminderRecord } from "../types/reminder.types";

function getRemindersBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/reminders";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/reminders`;
}

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function getSearchableText(reminder: ReminderRecord): string {
    return [
        reminder._id,
        reminder.memberId ?? "",
        reminder.title,
        reminder.description ?? "",
        reminder.type,
        reminder.relatedEntityType ?? "",
        reminder.relatedEntityId ?? "",
        reminder.dueDate,
        reminder.recurrenceRule ?? "",
        reminder.status,
        reminder.priority ?? "",
        reminder.channel,
    ]
        .join(" ")
        .toLocaleLowerCase();
}

export function RemindersPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const searchTerm = useReminderStore((state) => state.searchTerm);
    const statusFilter = useReminderStore((state) => state.statusFilter);
    const typeFilter = useReminderStore((state) => state.typeFilter);
    const channelFilter = useReminderStore((state) => state.channelFilter);
    const includeHidden = useReminderStore((state) => state.includeHidden);
    const selectedReminderId = useReminderStore((state) => state.selectedReminderId);

    const setSearchTerm = useReminderStore((state) => state.setSearchTerm);
    const setStatusFilter = useReminderStore((state) => state.setStatusFilter);
    const setTypeFilter = useReminderStore((state) => state.setTypeFilter);
    const setChannelFilter = useReminderStore((state) => state.setChannelFilter);
    const setIncludeHidden = useReminderStore((state) => state.setIncludeHidden);
    const setSelectedReminderId = useReminderStore(
        (state) => state.setSelectedReminderId
    );
    const resetReminderUi = useReminderStore((state) => state.reset);

    const remindersQuery = useRemindersQuery(workspaceId);
    const deleteReminderMutation = useDeleteReminderMutation();

    const remindersBasePath = getRemindersBasePath(scopeType, workspaceId);

    const filteredReminders = React.useMemo(() => {
        const reminders = remindersQuery.data?.reminders ?? [];
        const normalizedSearchTerm = normalizeText(searchTerm);

        return [...reminders]
            .filter((reminder: ReminderRecord) => {
                if (!includeHidden && !reminder.isVisible) {
                    return false;
                }

                if (statusFilter !== "ALL" && reminder.status !== statusFilter) {
                    return false;
                }

                if (typeFilter !== "ALL" && reminder.type !== typeFilter) {
                    return false;
                }

                if (channelFilter !== "ALL" && reminder.channel !== channelFilter) {
                    return false;
                }

                if (!normalizedSearchTerm) {
                    return true;
                }

                return getSearchableText(reminder).includes(normalizedSearchTerm);
            })
            .sort((left, right) => {
                const leftDate = new Date(left.dueDate).getTime();
                const rightDate = new Date(right.dueDate).getTime();

                return leftDate - rightDate;
            });
    }, [
        channelFilter,
        includeHidden,
        remindersQuery.data?.reminders,
        searchTerm,
        statusFilter,
        typeFilter,
    ]);

    const hasFilters =
        searchTerm.trim().length > 0 ||
        statusFilter !== "ALL" ||
        typeFilter !== "ALL" ||
        channelFilter !== "ALL" ||
        includeHidden;

    const handleResetFilters = React.useCallback(() => {
        resetReminderUi();
    }, [resetReminderUi]);

    const handleEditReminder = React.useCallback(
        (reminder: ReminderRecord) => {
            setSelectedReminderId(reminder._id);
            navigate(`${remindersBasePath}/${reminder._id}/edit`);
        },
        [navigate, remindersBasePath, setSelectedReminderId]
    );

    const handleDeleteReminder = React.useCallback(
        (reminder: ReminderRecord) => {
            if (!workspaceId) {
                return;
            }

            const confirmed = window.confirm(
                `¿Seguro que deseas eliminar el reminder "${reminder.title}"?`
            );

            if (!confirmed) {
                return;
            }

            setSelectedReminderId(reminder._id);

            deleteReminderMutation.mutate({
                workspaceId,
                reminderId: reminder._id,
            });
        },
        [deleteReminderMutation, setSelectedReminderId, workspaceId]
    );

    if (!workspaceId) {
        return (
            <Page title="Reminders" subtitle="Resolviendo el workspace activo.">
                <Alert severity="info">
                    Aún estamos resolviendo el contexto activo del workspace.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Reminders"
            subtitle="Administra recordatorios, fechas límite y recurrencias dentro del workspace activo."
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
            >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Aquí registras reminders con fecha límite, canal, estado y vínculo
                    opcional con otras entidades del workspace.
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => navigate(`${remindersBasePath}/new`)}
                >
                    Nuevo reminder
                </Button>
            </Stack>

            <RemindersToolbar
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                typeFilter={typeFilter}
                channelFilter={channelFilter}
                includeHidden={includeHidden}
                totalCount={filteredReminders.length}
                onSearchTermChange={setSearchTerm}
                onStatusFilterChange={setStatusFilter}
                onTypeFilterChange={setTypeFilter}
                onChannelFilterChange={setChannelFilter}
                onIncludeHiddenChange={setIncludeHidden}
                onResetFilters={handleResetFilters}
            />

            {deleteReminderMutation.isError ? (
                <Alert severity="error">
                    {getApiErrorMessage(
                        deleteReminderMutation.error,
                        "No se pudo eliminar el reminder."
                    )}
                </Alert>
            ) : null}

            {remindersQuery.isLoading ? (
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando reminders…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo reminders del workspace activo.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            ) : null}

            {!remindersQuery.isLoading && remindersQuery.isError ? (
                <Alert severity="error">
                    {getApiErrorMessage(
                        remindersQuery.error,
                        "No se pudieron cargar los reminders."
                    )}
                </Alert>
            ) : null}

            {!remindersQuery.isLoading &&
                !remindersQuery.isError &&
                filteredReminders.length === 0 ? (
                <RemindersEmptyState
                    hasFilters={hasFilters}
                    onClearFilters={handleResetFilters}
                />
            ) : null}

            {!remindersQuery.isLoading &&
                !remindersQuery.isError &&
                filteredReminders.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredReminders.map((reminder: ReminderRecord) => (
                        <Grid key={reminder._id} size={{ xs: 12, md: 6, xl: 4 }}>
                            <ReminderCard
                                reminder={reminder}
                                isSelected={selectedReminderId === reminder._id}
                                onEdit={handleEditReminder}
                                onDelete={handleDeleteReminder}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : null}
        </Page>
    );
}
// src/features/reconciliation/pages/ReconciliationPage.tsx

import React from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";

import { useScopeStore } from "../../../app/scope/scope.store";
import { Page } from "../../../shared/ui/Page/Page";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { ReconciliationFilters } from "../components/ReconciliationFilters";
import { ReconciliationFormDialog } from "../components/ReconciliationFormDialog";
import { ReconciliationSummaryCards } from "../components/ReconciliationSummaryCards";
import { ReconciliationTable } from "../components/ReconciliationTable";
import {
    useCreateReconciliationMutation,
    useDeleteReconciliationMutation,
    useUpdateReconciliationMutation,
} from "../hooks/useReconciliationMutations";
import {
    useReconciliationQuery,
    useReconciliationSummaryQuery,
} from "../hooks/useReconciliationQuery";
import type {
    CreateReconciliationPayload,
    ReconciliationListFilters,
    ReconciliationRecord,
    UpdateReconciliationPayload,
} from "../types/reconciliation.types";

const INITIAL_FILTERS: ReconciliationListFilters = {
    accountId: "",
    cardId: "",
    memberId: "",
    transactionId: "",
    status: "ALL",
    currency: "ALL",
    entrySide: "ALL",
    matchMethod: "ALL",
    includeArchived: false,
    includeInactive: false,
    includeHidden: false,
    transactionDateFrom: "",
    transactionDateTo: "",
    reconciledFrom: "",
    reconciledTo: "",
    statementDateFrom: "",
    statementDateTo: "",
};

function getErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const apiMessage = error.response?.data?.message;

        if (typeof apiMessage === "string" && apiMessage.trim().length > 0) {
            return apiMessage;
        }
    }

    return error.message.trim().length > 0 ? error.message : fallbackMessage;
}

export function ReconciliationPage() {
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const [filters, setFilters] = React.useState<ReconciliationListFilters>(INITIAL_FILTERS);
    const [dialogMode, setDialogMode] = React.useState<"create" | "edit">("create");
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedRecord, setSelectedRecord] = React.useState<ReconciliationRecord | null>(null);

    const reconciliationQuery = useReconciliationQuery(workspaceId, filters);
    const reconciliationSummaryQuery = useReconciliationSummaryQuery(workspaceId, filters);

    const createReconciliationMutation = useCreateReconciliationMutation();
    const updateReconciliationMutation = useUpdateReconciliationMutation();
    const deleteReconciliationMutation = useDeleteReconciliationMutation();

    const handleOpenCreateDialog = React.useCallback(() => {
        setDialogMode("create");
        setSelectedRecord(null);
        setDialogOpen(true);
    }, []);

    const handleOpenEditDialog = React.useCallback((record: ReconciliationRecord) => {
        setDialogMode("edit");
        setSelectedRecord(record);
        setDialogOpen(true);
    }, []);

    const handleCloseDialog = React.useCallback(() => {
        if (
            createReconciliationMutation.isPending ||
            updateReconciliationMutation.isPending
        ) {
            return;
        }

        setDialogOpen(false);
        setSelectedRecord(null);
    }, [
        createReconciliationMutation.isPending,
        updateReconciliationMutation.isPending,
    ]);

    const handleCreate = React.useCallback(
        (payload: CreateReconciliationPayload) => {
            if (!workspaceId) {
                return;
            }

            createReconciliationMutation.mutate(
                {
                    workspaceId,
                    payload,
                },
                {
                    onSuccess: () => {
                        setDialogOpen(false);
                    },
                }
            );
        },
        [createReconciliationMutation, workspaceId]
    );

    const handleUpdate = React.useCallback(
        (reconciliationId: string, payload: UpdateReconciliationPayload) => {
            if (!workspaceId) {
                return;
            }

            updateReconciliationMutation.mutate(
                {
                    workspaceId,
                    reconciliationId,
                    payload,
                },
                {
                    onSuccess: () => {
                        setDialogOpen(false);
                        setSelectedRecord(null);
                    },
                }
            );
        },
        [updateReconciliationMutation, workspaceId]
    );

    const handleDelete = React.useCallback(
        (record: ReconciliationRecord) => {
            if (!workspaceId) {
                return;
            }

            const shouldDelete = window.confirm(
                `¿Eliminar la conciliación de "${record.transactionDescription}"?`
            );

            if (!shouldDelete) {
                return;
            }

            deleteReconciliationMutation.mutate({
                workspaceId,
                reconciliationId: record.id,
            });
        },
        [deleteReconciliationMutation, workspaceId]
    );

    const submitErrorMessage = createReconciliationMutation.isError
        ? getErrorMessage(
            createReconciliationMutation.error,
            "No se pudo crear la conciliación."
        )
        : updateReconciliationMutation.isError
            ? getErrorMessage(
                updateReconciliationMutation.error,
                "No se pudo actualizar la conciliación."
            )
            : null;

    if (!workspaceId) {
        return (
            <Page
                title="Conciliación"
                subtitle="No fue posible resolver el workspace activo."
            >
                <Alert severity="warning">
                    No hay un workspace activo seleccionado para cargar conciliación.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Conciliación"
            subtitle="Administra la conciliación de movimientos por cuenta, tarjeta y estado de cuenta."
        >
            <Stack spacing={2} sx={{ minWidth: 0, width: "100%", overflowX: "hidden" }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                >
                    <Typography variant="body2"
                        // sx={{ opacity: 0.8 }}
                        sx={{
                            opacity: 0.8,
                            width: {
                                xs: '100%',
                                sm: '65%',
                            },
                        }}
                    >
                        Esta vista trabaja sobre registros persistidos de conciliación, no solo sobre movimientos derivados.
                    </Typography>

                    <Button
                        sx={{
                            width: {
                                xs: '100%',
                                sm: '30%',
                            },
                        }}
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreateDialog}
                    >
                        Nueva conciliación
                    </Button>
                </Stack>

                <ReconciliationFilters
                    workspaceId={workspaceId}
                    filters={filters}
                    totalCount={reconciliationQuery.data?.reconciliations.length ?? 0}
                    onApplyFilters={setFilters}
                    onResetFilters={() => setFilters(INITIAL_FILTERS)}
                />

                {reconciliationSummaryQuery.isLoading ? (
                    <Box sx={{ minHeight: 120, display: "grid", placeItems: "center" }}>
                        <CircularProgress />
                    </Box>
                ) : reconciliationSummaryQuery.isError ? (
                    <Alert severity="error">
                        {getErrorMessage(
                            reconciliationSummaryQuery.error,
                            "No se pudo obtener el resumen de conciliación."
                        )}
                    </Alert>
                ) : reconciliationSummaryQuery.data ? (
                    <ReconciliationSummaryCards
                        summary={reconciliationSummaryQuery.data.summary}
                        currency={filters.currency}
                    />
                ) : null}

                {reconciliationQuery.isLoading ? (
                    <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <CircularProgress />
                            <Box>
                                <Typography sx={{ fontWeight: 700 }}>
                                    Cargando conciliación…
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Obteniendo registros y estados de conciliación.
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                ) : reconciliationQuery.isError ? (
                    <Alert severity="error">
                        {getErrorMessage(
                            reconciliationQuery.error,
                            "No se pudieron obtener las conciliaciones."
                        )}
                    </Alert>
                ) : reconciliationQuery.data &&
                    reconciliationQuery.data.reconciliations.length === 0 ? (
                    <Alert severity="info">
                        No hay conciliaciones registradas con los filtros actuales.
                    </Alert>
                ) : (
                    <ReconciliationTable
                        rows={reconciliationQuery.data?.reconciliations ?? []}
                        onEdit={handleOpenEditDialog}
                        onDelete={handleDelete}
                    />
                )}

                <ReconciliationFormDialog
                    workspaceId={workspaceId}
                    open={dialogOpen}
                    mode={dialogMode}
                    initialValues={selectedRecord}
                    isSubmitting={
                        createReconciliationMutation.isPending ||
                        updateReconciliationMutation.isPending
                    }
                    submitErrorMessage={submitErrorMessage}
                    onClose={handleCloseDialog}
                    onCreate={handleCreate}
                    onUpdate={handleUpdate}
                />
            </Stack>
        </Page>
    );
}
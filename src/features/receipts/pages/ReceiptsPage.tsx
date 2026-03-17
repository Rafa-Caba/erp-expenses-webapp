// src/features/receipts/pages/ReceiptsPage.tsx

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
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { ReceiptCard } from "../components/ReceiptCard";
import { ReceiptsEmptyState } from "../components/ReceiptsEmptyState";
import { ReceiptsToolbar } from "../components/ReceiptsToolbar";
import { useDeleteReceiptMutation } from "../hooks/useReceiptMutations";
import { useReceiptsQuery } from "../hooks/useReceiptsQuery";
import { useReceiptStore } from "../store/receipt.store";
import type { ReceiptRecord } from "../types/receipt.types";

function getReceiptsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/receipts";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/receipts`;
}

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function getReceiptErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

function getSearchableText(receipt: ReceiptRecord): string {
    return [
        receipt._id,
        receipt.transactionId,
        receipt.fileName,
        receipt.fileType,
        receipt.notes ?? "",
        receipt.uploadedByMemberId,
        receipt.uploadedAt,
    ]
        .join(" ")
        .toLocaleLowerCase();
}

export function ReceiptsPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const searchTerm = useReceiptStore((state) => state.searchTerm);
    const includeHidden = useReceiptStore((state) => state.includeHidden);
    const selectedReceiptId = useReceiptStore((state) => state.selectedReceiptId);

    const setSearchTerm = useReceiptStore((state) => state.setSearchTerm);
    const setIncludeHidden = useReceiptStore((state) => state.setIncludeHidden);
    const setSelectedReceiptId = useReceiptStore((state) => state.setSelectedReceiptId);
    const resetReceiptUi = useReceiptStore((state) => state.reset);

    const receiptsQuery = useReceiptsQuery(workspaceId);
    const deleteReceiptMutation = useDeleteReceiptMutation();

    const receiptsBasePath = getReceiptsBasePath(scopeType, workspaceId);

    const filteredReceipts = React.useMemo(() => {
        const receipts = receiptsQuery.data?.receipts ?? [];
        const normalizedSearchTerm = normalizeText(searchTerm);

        return [...receipts]
            .filter((receipt) => {
                if (!includeHidden && !receipt.isVisible) {
                    return false;
                }

                if (!normalizedSearchTerm) {
                    return true;
                }

                return getSearchableText(receipt).includes(normalizedSearchTerm);
            })
            .sort((left, right) => {
                const leftDate = new Date(left.uploadedAt).getTime();
                const rightDate = new Date(right.uploadedAt).getTime();

                return rightDate - leftDate;
            });
    }, [includeHidden, receiptsQuery.data?.receipts, searchTerm]);

    const hasFilters = searchTerm.trim().length > 0 || includeHidden;

    const handleResetFilters = React.useCallback(() => {
        resetReceiptUi();
    }, [resetReceiptUi]);

    const handleEditReceipt = React.useCallback(
        (receipt: ReceiptRecord) => {
            setSelectedReceiptId(receipt._id);
            navigate(`${receiptsBasePath}/${receipt._id}/edit`);
        },
        [navigate, receiptsBasePath, setSelectedReceiptId]
    );

    const handleDeleteReceipt = React.useCallback(
        (receipt: ReceiptRecord) => {
            if (!workspaceId) {
                return;
            }

            const confirmed = window.confirm(
                `¿Seguro que deseas eliminar el recibo "${receipt.fileName}"?`
            );

            if (!confirmed) {
                return;
            }

            setSelectedReceiptId(receipt._id);

            deleteReceiptMutation.mutate({
                workspaceId,
                receiptId: receipt._id,
            });
        },
        [deleteReceiptMutation, setSelectedReceiptId, workspaceId]
    );

    if (!workspaceId) {
        return (
            <Page title="Recibos" subtitle="Resolviendo el workspace activo.">
                <Alert severity="info">
                    Aún estamos resolviendo el contexto activo del workspace.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Recibos"
            subtitle="Administra imágenes y PDFs ligados a transacciones del workspace activo."
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
            >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Aquí puedes adjuntar, editar o eliminar comprobantes y recibos.
                </Typography>

                <Button variant="contained" onClick={() => navigate(`${receiptsBasePath}/new`)}>
                    Nuevo recibo
                </Button>
            </Stack>

            <ReceiptsToolbar
                searchTerm={searchTerm}
                includeHidden={includeHidden}
                totalCount={filteredReceipts.length}
                onSearchTermChange={setSearchTerm}
                onIncludeHiddenChange={setIncludeHidden}
                onResetFilters={handleResetFilters}
            />

            {deleteReceiptMutation.isError ? (
                <Alert severity="error">
                    {getReceiptErrorMessage(
                        deleteReceiptMutation.error,
                        "No se pudo eliminar el recibo."
                    )}
                </Alert>
            ) : null}

            {receiptsQuery.isLoading ? (
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
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando recibos…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo recibos del workspace activo.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            ) : null}

            {!receiptsQuery.isLoading && receiptsQuery.isError ? (
                <Alert severity="error">
                    {getReceiptErrorMessage(
                        receiptsQuery.error,
                        "No se pudieron cargar los recibos."
                    )}
                </Alert>
            ) : null}

            {!receiptsQuery.isLoading &&
                !receiptsQuery.isError &&
                filteredReceipts.length === 0 ? (
                <ReceiptsEmptyState
                    hasFilters={hasFilters}
                    onClearFilters={handleResetFilters}
                />
            ) : null}

            {!receiptsQuery.isLoading &&
                !receiptsQuery.isError &&
                filteredReceipts.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredReceipts.map((receipt) => (
                        <Grid key={receipt._id} size={{ xs: 12, md: 6, xl: 4 }}>
                            <ReceiptCard
                                receipt={receipt}
                                isSelected={selectedReceiptId === receipt._id}
                                onEdit={handleEditReceipt}
                                onDelete={handleDeleteReceipt}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : null}
        </Page>
    );
}
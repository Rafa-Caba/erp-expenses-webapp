// src/features/receipts/pages/EditReceiptPage.tsx

import { Navigate, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { ReceiptForm, type ReceiptFormValues } from "../components/ReceiptForm";
import { useReceiptByIdQuery } from "../hooks/useReceiptByIdQuery";
import { useUpdateReceiptMutation } from "../hooks/useReceiptMutations";
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

function toDateTimeLocalInputValue(value: string): string {
    const date = new Date(value);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return localDate.toISOString().slice(0, 16);
}

function toOptionalIsoDateTime(value: string): string | null {
    if (!value.trim()) {
        return null;
    }

    return new Date(value).toISOString();
}

function toReceiptFormValues(receipt: ReceiptRecord): ReceiptFormValues {
    return {
        transactionId: receipt.transactionId,
        uploadedByMemberId: receipt.uploadedByMemberId,
        notes: receipt.notes ?? "",
        isVisible: receipt.isVisible,
        uploadedAt: toDateTimeLocalInputValue(receipt.uploadedAt),
        file: null,
    };
}

function toUpdateReceiptFormData(values: ReceiptFormValues): FormData {
    const formData = new FormData();

    formData.append("transactionId", values.transactionId.trim());
    formData.append("uploadedByMemberId", values.uploadedByMemberId.trim());
    formData.append("isVisible", String(values.isVisible));

    const normalizedNotes = values.notes.trim();
    if (normalizedNotes) {
        formData.append("notes", normalizedNotes);
    }

    const uploadedAt = toOptionalIsoDateTime(values.uploadedAt);
    if (uploadedAt) {
        formData.append("uploadedAt", uploadedAt);
    }

    if (values.file) {
        formData.append("file", values.file);
    }

    return formData;
}

function getReceiptErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

export function EditReceiptPage() {
    const navigate = useNavigate();
    const params = useParams<{ receiptId: string }>();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const receiptId = params.receiptId ?? null;

    const receiptQuery = useReceiptByIdQuery(workspaceId, receiptId);
    const updateReceiptMutation = useUpdateReceiptMutation();

    if (!workspaceId || !receiptId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const receiptsBasePath = getReceiptsBasePath(scopeType, workspaceId);

    if (receiptQuery.isLoading) {
        return (
            <Page title="Editar recibo" subtitle="Cargando la información actual del recibo.">
                <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress />

                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando recibo…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo los datos actuales del recibo.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }

    if (receiptQuery.isError || !receiptQuery.data) {
        return (
            <Page title="Editar recibo" subtitle="No fue posible cargar el recibo.">
                <Alert severity="error">
                    {getReceiptErrorMessage(
                        receiptQuery.error,
                        "No se pudo obtener el recibo."
                    )}
                </Alert>
            </Page>
        );
    }

    const submitErrorMessage = updateReceiptMutation.isError
        ? getReceiptErrorMessage(
            updateReceiptMutation.error,
            "No se pudo actualizar el recibo."
        )
        : null;

    const initialValues = toReceiptFormValues(receiptQuery.data);

    const handleSubmit = (values: ReceiptFormValues) => {
        const payload = toUpdateReceiptFormData(values);

        updateReceiptMutation.mutate(
            {
                workspaceId,
                receiptId,
                payload,
            },
            {
                onSuccess: () => {
                    navigate(receiptsBasePath);
                },
            }
        );
    };

    const handleCancel = () => {
        navigate(receiptsBasePath);
    };

    return (
        <Page
            title="Editar recibo"
            subtitle="Actualiza la transacción relacionada, miembro, visibilidad o archivo."
        >
            <ReceiptForm
                workspaceId={workspaceId}
                mode="edit"
                initialValues={initialValues}
                existingFileUrl={receiptQuery.data.fileUrl}
                existingFileName={receiptQuery.data.fileName}
                existingFileType={receiptQuery.data.fileType}
                isSubmitting={updateReceiptMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
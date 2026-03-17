// src/features/receipts/pages/NewReceiptPage.tsx

import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { ReceiptForm, type ReceiptFormValues } from "../components/ReceiptForm";
import { useCreateReceiptMutation } from "../hooks/useReceiptMutations";

function getReceiptsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/receipts";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/receipts`;
}

function toDateTimeLocalInputValue(date: Date): string {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return localDate.toISOString().slice(0, 16);
}

function toOptionalIsoDateTime(value: string): string | null {
    if (!value.trim()) {
        return null;
    }

    return new Date(value).toISOString();
}

const INITIAL_VALUES: ReceiptFormValues = {
    transactionId: "",
    uploadedByMemberId: "",
    notes: "",
    isVisible: true,
    uploadedAt: toDateTimeLocalInputValue(new Date()),
    file: null,
};

function toCreateReceiptFormData(values: ReceiptFormValues): FormData {
    if (!values.file) {
        throw new Error("Receipt file is required");
    }

    const formData = new FormData();

    formData.append("transactionId", values.transactionId.trim());
    formData.append("uploadedByMemberId", values.uploadedByMemberId.trim());
    formData.append("isVisible", String(values.isVisible));
    formData.append("file", values.file);

    const normalizedNotes = values.notes.trim();
    if (normalizedNotes) {
        formData.append("notes", normalizedNotes);
    }

    const uploadedAt = toOptionalIsoDateTime(values.uploadedAt);
    if (uploadedAt) {
        formData.append("uploadedAt", uploadedAt);
    }

    return formData;
}

function getReceiptErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

export function NewReceiptPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const createReceiptMutation = useCreateReceiptMutation();

    if (!workspaceId) {
        return <Navigate to="/app/workspaces" replace />;
    }

    const receiptsBasePath = getReceiptsBasePath(scopeType, workspaceId);

    const submitErrorMessage = createReceiptMutation.isError
        ? getReceiptErrorMessage(createReceiptMutation.error, "No se pudo crear el recibo.")
        : null;

    const handleSubmit = React.useCallback(
        (values: ReceiptFormValues) => {
            const payload = toCreateReceiptFormData(values);

            createReceiptMutation.mutate(
                {
                    workspaceId,
                    payload,
                },
                {
                    onSuccess: () => {
                        navigate(receiptsBasePath);
                    },
                }
            );
        },
        [createReceiptMutation, navigate, receiptsBasePath, workspaceId]
    );

    const handleCancel = React.useCallback(() => {
        navigate(receiptsBasePath);
    }, [navigate, receiptsBasePath]);

    return (
        <Page
            title="Nuevo recibo"
            subtitle="Adjunta un comprobante a una transacción del workspace activo."
        >
            <ReceiptForm
                workspaceId={workspaceId}
                mode="create"
                initialValues={INITIAL_VALUES}
                isSubmitting={createReceiptMutation.isPending}
                submitErrorMessage={submitErrorMessage}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Page>
    );
}
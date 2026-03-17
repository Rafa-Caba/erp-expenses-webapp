// src/features/payments/pages/PaymentsPage.tsx

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
import { PaymentCard } from "../components/PaymentCard";
import { PaymentsEmptyState } from "../components/PaymentsEmptyState";
import { PaymentsToolbar } from "../components/PaymentsToolbar";
import { useDeletePaymentMutation } from "../hooks/usePaymentMutations";
import { usePaymentsQuery } from "../hooks/usePaymentsQuery";
import { usePaymentStore } from "../store/payment.store";
import type { PaymentRecord } from "../types/payment.types";

function getPaymentsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/payments";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/payments`;
}

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function getPaymentErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    return error.message || fallbackMessage;
}

function getSearchableText(payment: PaymentRecord): string {
    return [
        payment._id,
        payment.debtId,
        payment.accountId ?? "",
        payment.cardId ?? "",
        payment.memberId ?? "",
        payment.transactionId ?? "",
        payment.reference ?? "",
        payment.notes ?? "",
        payment.currency,
        payment.status,
        payment.method ?? "",
        String(payment.amount),
        payment.paymentDate,
    ]
        .join(" ")
        .toLocaleLowerCase();
}

export function PaymentsPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const searchTerm = usePaymentStore((state) => state.searchTerm);
    const statusFilter = usePaymentStore((state) => state.statusFilter);
    const methodFilter = usePaymentStore((state) => state.methodFilter);
    const includeHidden = usePaymentStore((state) => state.includeHidden);
    const selectedPaymentId = usePaymentStore((state) => state.selectedPaymentId);

    const setSearchTerm = usePaymentStore((state) => state.setSearchTerm);
    const setStatusFilter = usePaymentStore((state) => state.setStatusFilter);
    const setMethodFilter = usePaymentStore((state) => state.setMethodFilter);
    const setIncludeHidden = usePaymentStore((state) => state.setIncludeHidden);
    const setSelectedPaymentId = usePaymentStore((state) => state.setSelectedPaymentId);
    const resetPaymentUi = usePaymentStore((state) => state.reset);

    const paymentsQuery = usePaymentsQuery(workspaceId);
    const deletePaymentMutation = useDeletePaymentMutation();

    const paymentsBasePath = getPaymentsBasePath(scopeType, workspaceId);

    const filteredPayments = React.useMemo(() => {
        const payments = paymentsQuery.data?.payments ?? [];
        const normalizedSearchTerm = normalizeText(searchTerm);

        return [...payments]
            .filter((payment: PaymentRecord) => {
                if (!includeHidden && !payment.isVisible) {
                    return false;
                }

                if (statusFilter !== "ALL" && payment.status !== statusFilter) {
                    return false;
                }

                if (methodFilter !== "ALL" && payment.method !== methodFilter) {
                    return false;
                }

                if (!normalizedSearchTerm) {
                    return true;
                }

                return getSearchableText(payment).includes(normalizedSearchTerm);
            })
            .sort((left, right) => {
                const leftDate = new Date(left.paymentDate).getTime();
                const rightDate = new Date(right.paymentDate).getTime();

                return rightDate - leftDate;
            });
    }, [
        includeHidden,
        methodFilter,
        paymentsQuery.data?.payments,
        searchTerm,
        statusFilter,
    ]);

    const hasFilters =
        searchTerm.trim().length > 0 ||
        statusFilter !== "ALL" ||
        methodFilter !== "ALL" ||
        includeHidden;

    const handleResetFilters = React.useCallback(() => {
        resetPaymentUi();
    }, [resetPaymentUi]);

    const handleEditPayment = React.useCallback(
        (payment: PaymentRecord) => {
            setSelectedPaymentId(payment._id);
            navigate(`${paymentsBasePath}/${payment._id}/edit`);
        },
        [navigate, paymentsBasePath, setSelectedPaymentId]
    );

    const handleDeletePayment = React.useCallback(
        (payment: PaymentRecord) => {
            if (!workspaceId) {
                return;
            }

            const confirmed = window.confirm(
                `¿Seguro que deseas eliminar el pago de ${payment.amount} ${payment.currency}?`
            );

            if (!confirmed) {
                return;
            }

            setSelectedPaymentId(payment._id);

            deletePaymentMutation.mutate({
                workspaceId,
                paymentId: payment._id,
            });
        },
        [deletePaymentMutation, setSelectedPaymentId, workspaceId]
    );

    if (!workspaceId) {
        return (
            <Page title="Pagos" subtitle="Resolviendo el workspace activo.">
                <Alert severity="info">
                    Aún estamos resolviendo el contexto activo del workspace.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Pagos"
            subtitle="Administra pagos asociados a deudas dentro del workspace activo."
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
            >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Aquí registras pagos de deudas y puedes vincularlos opcionalmente con cuenta,
                    tarjeta, miembro o transacción relacionada.
                </Typography>

                <Button variant="contained" onClick={() => navigate(`${paymentsBasePath}/new`)}>
                    Nuevo pago
                </Button>
            </Stack>

            <PaymentsToolbar
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                methodFilter={methodFilter}
                includeHidden={includeHidden}
                totalCount={filteredPayments.length}
                onSearchTermChange={setSearchTerm}
                onStatusFilterChange={setStatusFilter}
                onMethodFilterChange={setMethodFilter}
                onIncludeHiddenChange={setIncludeHidden}
                onResetFilters={handleResetFilters}
            />

            {deletePaymentMutation.isError ? (
                <Alert severity="error">
                    {getPaymentErrorMessage(
                        deletePaymentMutation.error,
                        "No se pudo eliminar el pago."
                    )}
                </Alert>
            ) : null}

            {paymentsQuery.isLoading ? (
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
                                Cargando pagos…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo pagos del workspace activo.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            ) : null}

            {!paymentsQuery.isLoading && paymentsQuery.isError ? (
                <Alert severity="error">
                    {getPaymentErrorMessage(
                        paymentsQuery.error,
                        "No se pudieron cargar los pagos."
                    )}
                </Alert>
            ) : null}

            {!paymentsQuery.isLoading &&
                !paymentsQuery.isError &&
                filteredPayments.length === 0 ? (
                <PaymentsEmptyState
                    hasFilters={hasFilters}
                    onClearFilters={handleResetFilters}
                />
            ) : null}

            {!paymentsQuery.isLoading &&
                !paymentsQuery.isError &&
                filteredPayments.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredPayments.map((payment: PaymentRecord) => (
                        <Grid key={payment._id} size={{ xs: 12, md: 6, xl: 4 }}>
                            <PaymentCard
                                payment={payment}
                                isSelected={selectedPaymentId === payment._id}
                                onEdit={handleEditPayment}
                                onDelete={handleDeletePayment}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : null}
        </Page>
    );
}
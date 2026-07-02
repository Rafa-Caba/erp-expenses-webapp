// src/features/subscriptions/pages/SubscriptionsPage.tsx
// Subscriptions list page with basic filters and reviewed transaction creation.

import React from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { Page } from "../../../shared/ui/Page/Page";
import { getApiErrorMessage } from "../../../shared/utils/get-api-error-message.util";
import { SubscriptionCard } from "../components/SubscriptionCard";
import {
    useCreateSubscriptionTransactionMutation,
    useDeleteSubscriptionMutation,
} from "../hooks/useSubscriptionMutations";
import { useSubscriptionsQuery } from "../hooks/useSubscriptionsQuery";
import type { SubscriptionRecord, SubscriptionStatus } from "../types/subscription.types";

type StatusFilter = "ALL" | SubscriptionStatus;

function getSubscriptionsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/subscriptions";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/subscriptions`;
}

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function buildSearchableText(subscription: SubscriptionRecord): string {
    return [
        subscription.name,
        subscription.merchant ?? "",
        subscription.notes ?? "",
        subscription.currency,
        subscription.status,
        subscription.billingFrequency,
        String(subscription.amount),
    ]
        .join(" ")
        .toLocaleLowerCase();
}

export function SubscriptionsPage() {
    const navigate = useNavigate();
    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const [searchTerm, setSearchTerm] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("ALL");
    const [includeHidden, setIncludeHidden] = React.useState(false);
    const [selectedSubscriptionId, setSelectedSubscriptionId] = React.useState<string | null>(null);

    const subscriptionsQuery = useSubscriptionsQuery(workspaceId);
    const deleteSubscriptionMutation = useDeleteSubscriptionMutation();
    const createTransactionMutation = useCreateSubscriptionTransactionMutation();

    const subscriptionsBasePath = getSubscriptionsBasePath(scopeType, workspaceId);

    const filteredSubscriptions = React.useMemo(() => {
        const subscriptions = subscriptionsQuery.data?.subscriptions ?? [];
        const normalizedSearchTerm = normalizeText(searchTerm);

        return subscriptions.filter((subscription) => {
            if (!includeHidden && !subscription.isVisible) {
                return false;
            }

            if (statusFilter !== "ALL" && subscription.status !== statusFilter) {
                return false;
            }

            if (!normalizedSearchTerm) {
                return true;
            }

            return buildSearchableText(subscription).includes(normalizedSearchTerm);
        });
    }, [includeHidden, searchTerm, statusFilter, subscriptionsQuery.data?.subscriptions]);

    const isLoading = subscriptionsQuery.isLoading;
    const isError = subscriptionsQuery.isError;

    const handleCreateTransaction = (subscription: SubscriptionRecord) => {
        if (!workspaceId) {
            return;
        }

        setSelectedSubscriptionId(subscription._id);
        createTransactionMutation.mutate({
            workspaceId,
            subscriptionId: subscription._id,
            payload: {
                transactionDate: subscription.nextBillingDate.slice(0, 10),
                status: "posted",
                reference: null,
                notes: `Cobro generado desde suscripción: ${subscription.name}`,
            },
        });
    };

    const handleDelete = (subscription: SubscriptionRecord) => {
        if (!workspaceId) {
            return;
        }

        const confirmed = window.confirm(`¿Eliminar la suscripción "${subscription.name}"?`);

        if (!confirmed) {
            return;
        }

        deleteSubscriptionMutation.mutate({
            workspaceId,
            subscriptionId: subscription._id,
        });
    };

    return (
        <Page
            title="Suscripciones"
            subtitle="Administra servicios recurrentes como internet, gym, streaming, cloud y otros cobros mensuales."
        >
            <Stack spacing={2.5}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end">
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`${subscriptionsBasePath}/new`)}
                    >
                        Nueva suscripción
                    </Button>
                </Stack>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                    <Stack spacing={2}>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={2}
                            alignItems={{ xs: "stretch", md: "center" }}
                        >
                            <TextField
                                label="Buscar"
                                placeholder="Nombre, merchant, notas..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                fullWidth
                            />
                            <TextField
                                select
                                label="Estado"
                                value={statusFilter}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    if (value === "ALL" || value === "active" || value === "paused" || value === "cancelled") {
                                        setStatusFilter(value);
                                    }
                                }}
                                sx={{ minWidth: 180 }}
                            >
                                <MenuItem value="ALL">Todos</MenuItem>
                                <MenuItem value="active">Activas</MenuItem>
                                <MenuItem value="paused">Pausadas</MenuItem>
                                <MenuItem value="cancelled">Canceladas</MenuItem>
                            </TextField>
                            <Button
                                variant={includeHidden ? "contained" : "outlined"}
                                onClick={() => setIncludeHidden((currentValue) => !currentValue)}
                            >
                                {includeHidden ? "Ocultar invisibles" : "Mostrar ocultas"}
                            </Button>
                        </Stack>
                        <Typography variant="body2" sx={{ opacity: 0.75 }}>
                            {filteredSubscriptions.length} suscripción(es) visibles con los filtros actuales.
                        </Typography>
                    </Stack>
                </Paper>

                {createTransactionMutation.isError ? (
                    <Alert severity="error">
                        {getApiErrorMessage(
                            createTransactionMutation.error,
                            "No se pudo crear la transacción desde la suscripción."
                        )}
                    </Alert>
                ) : null}

                {deleteSubscriptionMutation.isError ? (
                    <Alert severity="error">
                        {getApiErrorMessage(
                            deleteSubscriptionMutation.error,
                            "No se pudo eliminar la suscripción."
                        )}
                    </Alert>
                ) : null}

                {isLoading ? (
                    <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <CircularProgress />
                            <Typography>Cargando suscripciones…</Typography>
                        </Stack>
                    </Box>
                ) : null}

                {isError ? (
                    <Alert severity="error">
                        {getApiErrorMessage(
                            subscriptionsQuery.error,
                            "No se pudieron cargar las suscripciones."
                        )}
                    </Alert>
                ) : null}

                {!isLoading && !isError && filteredSubscriptions.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
                        <Stack spacing={1.5} alignItems="flex-start">
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                No hay suscripciones para mostrar
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Registra servicios recurrentes para tener a la mano próximos cobros y crear transacciones cuando aplique.
                            </Typography>
                            <Button variant="contained" onClick={() => navigate(`${subscriptionsBasePath}/new`)}>
                                Crear primera suscripción
                            </Button>
                        </Stack>
                    </Paper>
                ) : null}

                <Grid container spacing={2}>
                    {filteredSubscriptions.map((subscription) => (
                        <Grid key={subscription._id} size={{ xs: 12, md: 6, xl: 4 }}>
                            <SubscriptionCard
                                subscription={subscription}
                                isSelected={selectedSubscriptionId === subscription._id}
                                isCreatingTransaction={createTransactionMutation.isPending}
                                onEdit={() => navigate(`${subscriptionsBasePath}/${subscription._id}/edit`)}
                                onDelete={handleDelete}
                                onCreateTransaction={handleCreateTransaction}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Page>
    );
}

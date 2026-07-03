// src/features/debts/pages/DebtsPage.tsx
// Debts page with Phase 10 due debt payment processor controls.

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
import { useAccountsQuery } from "../../accounts/hooks/useAccountsQuery";
import type { AccountRecord } from "../../accounts/types/account.types";
import { DebtCard } from "../components/DebtCard";
import {
    useDeleteDebtMutation,
    useProcessDueDebtPaymentsMutation,
} from "../hooks/useDebtMutations";
import { useDebtsQuery } from "../hooks/useDebtsQuery";
import type {
    DebtProcessDuePaymentAction,
    DebtRecord,
    DebtStatus,
    DebtType,
    ProcessDueDebtPaymentsResult,
} from "../types/debt.types";

type DebtTypeFilter = "ALL" | DebtType;
type DebtStatusFilter = "ALL" | DebtStatus;

function getDebtsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/debts";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/debts`;
}

function getTodayInputValue(): string {
    return new Date().toISOString().slice(0, 10);
}

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function buildSearchableText(debt: DebtRecord): string {
    return [
        debt.personName,
        debt.personContact ?? "",
        debt.description,
        debt.notes ?? "",
        debt.currency,
        debt.type,
        debt.status,
        String(debt.originalAmount),
        String(debt.remainingAmount),
    ]
        .join(" ")
        .toLocaleLowerCase();
}

function formatMoney(amount: number, currency: string): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatDate(value: string | null): string {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(new Date(value));
}

function isDebtDue(debt: DebtRecord, asOfDate: string): boolean {
    if (
        !debt.paymentPlanEnabled ||
        !debt.autoGeneratePayments ||
        !debt.isVisible ||
        debt.remainingAmount <= 0 ||
        (debt.status !== "active" && debt.status !== "overdue") ||
        !debt.nextDueDate
    ) {
        return false;
    }

    const nextDueTimestamp = new Date(debt.nextDueDate).getTime();
    const asOfTimestamp = new Date(`${asOfDate}T23:59:59.999`).getTime();

    return nextDueTimestamp <= asOfTimestamp;
}

function getAccountNameById(accounts: AccountRecord[], accountId: string | null): string | null {
    if (!accountId) {
        return null;
    }

    return accounts.find((account) => account.id === accountId)?.name ?? null;
}

function getActionLabel(action: DebtProcessDuePaymentAction): string {
    switch (action) {
        case "would_create":
            return "Se crearía";
        case "created":
            return "Creado";
        case "skipped_duplicate":
            return "Duplicado evitado";
        case "skipped_missing_account":
            return "Sin cuenta";
        case "skipped_missing_member":
            return "Sin miembro";
        case "skipped_invalid_plan":
            return "Plan inválido";
        case "skipped_paid":
            return "Pagada";
        case "skipped_inactive":
            return "Inactiva";
    }
}

function ProcessDueDebtPaymentsResultCard({
    result,
}: {
    result: ProcessDueDebtPaymentsResult;
}) {
    return (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Stack spacing={1.5}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Resultado del motor de pagos de deuda
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Modo: {result.dryRun ? "Simulación" : "Escritura"} • Corte:{" "}
                    {formatDate(result.asOfDate)} • Vencidas: {result.dueCount} •
                    Generadas: {result.generatedCount} • Omitidas: {result.skippedCount}
                </Typography>

                {result.items.length === 0 ? (
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        No hay pagos vencidos de deuda para procesar con ese corte.
                    </Typography>
                ) : (
                    <Stack spacing={1}>
                        {result.items.map((item) => (
                            <Paper
                                key={`${item.debtId}-${item.scheduledPaymentDate}-${item.action}`}
                                variant="outlined"
                                sx={{ p: 1.5, borderRadius: 2 }}
                            >
                                <Stack spacing={0.5}>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {item.debtName} — {getActionLabel(item.action)}
                                    </Typography>

                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Programado: {formatDate(item.scheduledPaymentDate)} •
                                        Siguiente: {formatDate(item.nextDueDate)}
                                    </Typography>

                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Total: {formatMoney(item.amount, "MXN")} • Principal:{" "}
                                        {formatMoney(item.principalAmount, "MXN")} • Cargos:{" "}
                                        {formatMoney(item.feeAmount, "MXN")}
                                    </Typography>

                                    {item.transactionId ? (
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            Transacción: {item.transactionId}
                                        </Typography>
                                    ) : null}

                                    {item.paymentId ? (
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            Pago: {item.paymentId}
                                        </Typography>
                                    ) : null}

                                    {item.reason ? (
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            {item.reason}
                                        </Typography>
                                    ) : null}
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
}

export function DebtsPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const [searchTerm, setSearchTerm] = React.useState("");
    const [typeFilter, setTypeFilter] = React.useState<DebtTypeFilter>("ALL");
    const [statusFilter, setStatusFilter] = React.useState<DebtStatusFilter>("ALL");
    const [includeHidden, setIncludeHidden] = React.useState(false);
    const [selectedDebtId, setSelectedDebtId] = React.useState<string | null>(null);
    const [processAsOfDate, setProcessAsOfDate] = React.useState(getTodayInputValue());

    const debtsQuery = useDebtsQuery(workspaceId);
    const accountsQuery = useAccountsQuery(workspaceId);
    const deleteDebtMutation = useDeleteDebtMutation();
    const processDueDebtPaymentsMutation = useProcessDueDebtPaymentsMutation();

    const debtsBasePath = getDebtsBasePath(scopeType, workspaceId);

    const debts = debtsQuery.data?.debts ?? [];
    const accounts = accountsQuery.data?.accounts ?? [];

    const filteredDebts = React.useMemo(() => {
        const normalizedSearchTerm = normalizeText(searchTerm);

        return debts.filter((debt) => {
            if (!includeHidden && !debt.isVisible) {
                return false;
            }

            if (typeFilter !== "ALL" && debt.type !== typeFilter) {
                return false;
            }

            if (statusFilter !== "ALL" && debt.status !== statusFilter) {
                return false;
            }

            if (!normalizedSearchTerm) {
                return true;
            }

            return buildSearchableText(debt).includes(normalizedSearchTerm);
        });
    }, [debts, includeHidden, searchTerm, statusFilter, typeFilter]);

    const dueDebts = React.useMemo(
        () => debts.filter((debt) => isDebtDue(debt, processAsOfDate)),
        [debts, processAsOfDate]
    );

    const handleEdit = (debt: DebtRecord) => {
        setSelectedDebtId(debt._id);
        navigate(`${debtsBasePath}/${debt._id}/edit`);
    };

    const handleDelete = (debt: DebtRecord) => {
        if (!workspaceId) {
            return;
        }

        const confirmed = window.confirm(`¿Eliminar la deuda "${debt.description}"?`);

        if (!confirmed) {
            return;
        }

        setSelectedDebtId(debt._id);
        deleteDebtMutation.mutate({
            workspaceId,
            debtId: debt._id,
        });
    };

    const handleProcessDue = (dryRun: boolean) => {
        if (!workspaceId) {
            return;
        }

        if (!dryRun) {
            const confirmed = window.confirm(
                `Se generarán pagos para ${dueDebts.length} deuda(s) vencida(s). Esto creará Payment + Transaction y actualizará saldos. ¿Continuar?`
            );

            if (!confirmed) {
                return;
            }
        }

        processDueDebtPaymentsMutation.mutate({
            workspaceId,
            payload: {
                asOfDate: processAsOfDate,
                dryRun,
                limit: 50,
            },
        });
    };

    return (
        <Page
            title="Deudas"
            subtitle="Administra deudas por pagar, deudas por cobrar y planes de pagos vencidos."
        >
            <Stack spacing={2.5}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end">
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`${debtsBasePath}/new`)}
                    >
                        Nueva deuda
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
                                placeholder="Persona, descripción, notas..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                fullWidth
                            />

                            <TextField
                                select
                                label="Tipo"
                                value={typeFilter}
                                onChange={(event) => {
                                    const value = event.target.value;

                                    if (
                                        value === "ALL" ||
                                        value === "owed_by_me" ||
                                        value === "owed_to_me"
                                    ) {
                                        setTypeFilter(value);
                                    }
                                }}
                                sx={{ minWidth: 180 }}
                            >
                                <MenuItem value="ALL">Todas</MenuItem>
                                <MenuItem value="owed_by_me">Debo</MenuItem>
                                <MenuItem value="owed_to_me">Me deben</MenuItem>
                            </TextField>

                            <TextField
                                select
                                label="Estado"
                                value={statusFilter}
                                onChange={(event) => {
                                    const value = event.target.value;

                                    if (
                                        value === "ALL" ||
                                        value === "active" ||
                                        value === "paid" ||
                                        value === "overdue" ||
                                        value === "cancelled"
                                    ) {
                                        setStatusFilter(value);
                                    }
                                }}
                                sx={{ minWidth: 180 }}
                            >
                                <MenuItem value="ALL">Todos</MenuItem>
                                <MenuItem value="active">Activas</MenuItem>
                                <MenuItem value="paid">Pagadas</MenuItem>
                                <MenuItem value="overdue">Vencidas</MenuItem>
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
                            {filteredDebts.length} deuda(s) visibles con los filtros actuales.
                        </Typography>
                    </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                    <Stack spacing={2}>
                        <Stack spacing={0.5}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                Motor de pagos vencidos de deuda
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                Procesa deudas activas, visibles, con plan de pagos y motor activo. Primero puedes simular; después generar Payment + Transaction reales.
                            </Typography>
                        </Stack>

                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={2}
                            alignItems={{ xs: "stretch", md: "center" }}
                        >
                            <TextField
                                label="Fecha de corte"
                                type="date"
                                value={processAsOfDate}
                                onChange={(event) => setProcessAsOfDate(event.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ minWidth: 220 }}
                            />

                            <Typography variant="body2" sx={{ opacity: 0.8, flex: 1 }}>
                                {dueDebts.length} deuda(s) vencida(s) con motor activo.
                            </Typography>

                            <Button
                                variant="outlined"
                                disabled={processDueDebtPaymentsMutation.isPending}
                                onClick={() => handleProcessDue(true)}
                            >
                                Simular vencidos
                            </Button>

                            <Button
                                variant="contained"
                                disabled={
                                    processDueDebtPaymentsMutation.isPending ||
                                    dueDebts.length === 0
                                }
                                onClick={() => handleProcessDue(false)}
                            >
                                Generar vencidos
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>

                {debtsQuery.isError ? (
                    <Alert severity="error">
                        {getApiErrorMessage(
                            debtsQuery.error,
                            "No se pudieron cargar las deudas."
                        )}
                    </Alert>
                ) : null}

                {accountsQuery.isError ? (
                    <Alert severity="warning">
                        {getApiErrorMessage(
                            accountsQuery.error,
                            "No se pudieron cargar las cuentas para mostrar etiquetas."
                        )}
                    </Alert>
                ) : null}

                {deleteDebtMutation.isError ? (
                    <Alert severity="error">
                        {getApiErrorMessage(
                            deleteDebtMutation.error,
                            "No se pudo eliminar la deuda."
                        )}
                    </Alert>
                ) : null}

                {processDueDebtPaymentsMutation.isError ? (
                    <Alert severity="error">
                        {getApiErrorMessage(
                            processDueDebtPaymentsMutation.error,
                            "No se pudieron procesar los pagos vencidos de deuda."
                        )}
                    </Alert>
                ) : null}

                {processDueDebtPaymentsMutation.isSuccess ? (
                    <Alert severity={processDueDebtPaymentsMutation.data.result.dryRun ? "info" : "success"}>
                        {processDueDebtPaymentsMutation.data.message}
                    </Alert>
                ) : null}

                {processDueDebtPaymentsMutation.data ? (
                    <ProcessDueDebtPaymentsResultCard
                        result={processDueDebtPaymentsMutation.data.result}
                    />
                ) : null}

                {debtsQuery.isLoading ? (
                    <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <CircularProgress />
                            <Typography>Cargando deudas…</Typography>
                        </Stack>
                    </Box>
                ) : null}

                {!debtsQuery.isLoading && !debtsQuery.isError && filteredDebts.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
                        <Stack spacing={1.5} alignItems="flex-start">
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                No hay deudas para mostrar
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Registra deudas por pagar o por cobrar para controlar saldos, pagos, cobros y planes vencidos.
                            </Typography>

                            <Button variant="contained" onClick={() => navigate(`${debtsBasePath}/new`)}>
                                Crear primera deuda
                            </Button>
                        </Stack>
                    </Paper>
                ) : null}

                <Grid container spacing={2}>
                    {filteredDebts.map((debt) => (
                        <Grid key={debt._id} size={{ xs: 12, md: 6, xl: 4 }}>
                            <DebtCard
                                debt={debt}
                                memberName={null}
                                accountName={getAccountNameById(accounts, debt.relatedAccountId)}
                                isSelected={selectedDebtId === debt._id}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Page>
    );
}
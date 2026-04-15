// src/features/reconciliation/components/ReconciliationTable.tsx

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import type { ReconciliationRecord } from "../types/reconciliation.types";

type ReconciliationTableProps = {
    rows: ReconciliationRecord[];
    onEdit: (record: ReconciliationRecord) => void;
    onDelete: (record: ReconciliationRecord) => void;
};

function formatDate(value: string | null): string {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function formatAmount(value: number, currency: string): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

function getStatusLabel(status: ReconciliationRecord["status"]): string {
    switch (status) {
        case "reconciled":
            return "Conciliada";
        case "unreconciled":
            return "Sin conciliar";
        case "exception":
            return "Con excepción";
    }
}

function getDifferenceDirectionLabel(
    direction: ReconciliationRecord["differenceDirection"]
): string {
    switch (direction) {
        case "match":
            return "Sin diferencia";
        case "over":
            return "Por arriba";
        case "under":
            return "Por abajo";
    }
}

function renderStatusChip(status: ReconciliationRecord["status"]) {
    if (status === "reconciled") {
        return <Chip size="small" color="success" label={getStatusLabel(status)} />;
    }

    if (status === "exception") {
        return <Chip size="small" color="warning" label={getStatusLabel(status)} />;
    }

    return <Chip size="small" variant="outlined" label={getStatusLabel(status)} />;
}

function DesktopTable({ rows, onEdit, onDelete }: ReconciliationTableProps) {
    return (
        <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
                borderRadius: 3,
                width: "100%",
                overflowX: "auto",
            }}
        >
            <Table size="small" stickyHeader sx={{ minWidth: 1280 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Transacción</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Cuenta</TableCell>
                        <TableCell>Tarjeta</TableCell>
                        <TableCell>Miembro</TableCell>
                        <TableCell>Lado</TableCell>
                        <TableCell>Método</TableCell>
                        <TableCell>Esperado</TableCell>
                        <TableCell>Real</TableCell>
                        <TableCell>Diferencia</TableCell>
                        <TableCell>Estado de cuenta</TableCell>
                        <TableCell>Conciliada</TableCell>
                        <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id} hover>
                            <TableCell sx={{ minWidth: 280 }}>
                                <Stack spacing={0.5}>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {row.transactionDescription}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                                        {row.transactionId}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                                        {formatDate(row.transactionDate)}
                                    </Typography>
                                </Stack>
                            </TableCell>

                            <TableCell>{renderStatusChip(row.status)}</TableCell>
                            <TableCell>{row.accountName ?? row.accountId}</TableCell>
                            <TableCell>{row.cardName ?? "—"}</TableCell>
                            <TableCell>{row.memberDisplayName ?? row.memberId}</TableCell>
                            <TableCell>{row.entrySide}</TableCell>
                            <TableCell>{row.matchMethod}</TableCell>
                            <TableCell>{formatAmount(row.expectedAmount, row.currency)}</TableCell>
                            <TableCell>{formatAmount(row.actualAmount, row.currency)}</TableCell>
                            <TableCell>
                                <Stack spacing={0.5}>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {formatAmount(row.differenceAmount, row.currency)}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                                        {getDifferenceDirectionLabel(row.differenceDirection)}
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Stack spacing={0.5}>
                                    <Typography variant="body2">
                                        {formatDate(row.statementDate)}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                                        {row.statementReference ?? "—"}
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>{formatDate(row.reconciledAt)}</TableCell>
                            <TableCell align="right">
                                <Stack direction="column" spacing={1.25} paddingY={1} justifyContent="flex-end">
                                    <Button size="small" variant="outlined" onClick={() => onEdit(row)}>
                                        Editar
                                    </Button>
                                    <Button size="small" color="error" onClick={() => onDelete(row)}>
                                        Eliminar
                                    </Button>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function MobileCards({ rows, onEdit, onDelete }: ReconciliationTableProps) {
    return (
        <Stack spacing={1.5} sx={{ display: 'flex' }}>
            {rows.map((row) => (
                <Paper
                    key={row.id}
                    variant="outlined"
                    sx={{
                        p: 2, borderRadius: 3, width: {
                            xs: "100%",
                            sm: "49%",
                        },
                    }}
                >
                    <Stack spacing={1.5}>
                        <Stack spacing={0.75}>
                            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.05rem" }}>
                                {row.transactionDescription}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                {formatDate(row.transactionDate)}
                            </Typography>
                            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                {renderStatusChip(row.status)}
                                <Chip size="small" variant="outlined" label={row.matchMethod} />
                                <Chip size="small" variant="outlined" label={row.entrySide} />
                            </Stack>
                        </Stack>

                        <Stack spacing={0.75}>
                            <Typography variant="body2">
                                <strong>Cuenta:</strong> {row.accountName ?? row.accountId}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Tarjeta:</strong> {row.cardName ?? "—"}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Miembro:</strong> {row.memberDisplayName ?? row.memberId}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Esperado:</strong> {formatAmount(row.expectedAmount, row.currency)}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Real:</strong> {formatAmount(row.actualAmount, row.currency)}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Diferencia:</strong>{" "}
                                {formatAmount(row.differenceAmount, row.currency)} •{" "}
                                {getDifferenceDirectionLabel(row.differenceDirection)}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Estado de cuenta:</strong> {formatDate(row.statementDate)}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Referencia:</strong> {row.statementReference ?? "—"}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Conciliada:</strong> {formatDate(row.reconciledAt)}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                            <Button fullWidth variant="outlined" onClick={() => onEdit(row)}>
                                Editar
                            </Button>
                            <Button fullWidth color="error" onClick={() => onDelete(row)}>
                                Eliminar
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );
}

export function ReconciliationTable(props: ReconciliationTableProps) {
    const theme = useTheme();
    const useCardsLayout = useMediaQuery(theme.breakpoints.down("lg"));

    if (props.rows.length === 0) {
        return null;
    }

    if (useCardsLayout) {
        return <MobileCards {...props} />;
    }

    return <DesktopTable {...props} />;
}
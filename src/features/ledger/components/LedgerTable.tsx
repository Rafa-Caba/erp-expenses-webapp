// src/features/ledger/components/LedgerTable.tsx

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
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

import { TransactionStatusChip } from "../../transactions/components/TransactionStatusChip";
import { TransactionTypeChip } from "../../transactions/components/TransactionTypeChip";
import type { LedgerEntryRow } from "../types/ledger.types";

type LedgerTableProps = {
    rows: LedgerEntryRow[];
    selectedEntryId: string | null;
    onSelectEntry: (entryId: string | null) => void;
};

function formatDate(value: string): string {
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

function getEntryKindLabel(row: LedgerEntryRow): string {
    if (row.entryKind === "transfer_in") {
        return "Transferencia entrada";
    }

    if (row.entryKind === "transfer_out") {
        return "Transferencia salida";
    }

    return row.direction === "INFLOW" ? "Entrada" : "Salida";
}

function getRunningBalanceLabel(row: LedgerEntryRow): string {
    if (row.runningBalance === null) {
        return "—";
    }

    return formatAmount(row.runningBalance, row.currency);
}

function LedgerRowFlags({ row }: { row: LedgerEntryRow }) {
    return (
        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
            <Chip size="small" variant="outlined" label={getEntryKindLabel(row)} />

            {!row.isVisible ? (
                <Chip
                    size="small"
                    label="Oculta"
                    color="warning"
                    variant="outlined"
                />
            ) : null}

            {row.isArchived ? (
                <Chip
                    size="small"
                    label="Archivada"
                    color="default"
                    variant="outlined"
                />
            ) : null}

            {!row.isActive ? (
                <Chip
                    size="small"
                    label="Inactiva"
                    color="default"
                    variant="outlined"
                />
            ) : null}

            {row.isRecurring ? (
                <Chip
                    size="small"
                    label="Recurrente"
                    color="info"
                    variant="outlined"
                />
            ) : null}
        </Stack>
    );
}

function LedgerDesktopTable({
    rows,
    selectedEntryId,
    onSelectEntry,
}: LedgerTableProps) {
    return (
        <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
                borderRadius: 3,
                width: "100%",
                maxWidth: "100%",
                overflowX: "auto",
            }}
        >
            <Table
                size="small"
                stickyHeader
                sx={{
                    minWidth: 1180,
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Cuenta</TableCell>
                        <TableCell>Contracuenta</TableCell>
                        <TableCell>Categoría</TableCell>
                        <TableCell>Miembro</TableCell>
                        <TableCell>Referencia</TableCell>
                        <TableCell align="right">Cargo</TableCell>
                        <TableCell align="right">Abono</TableCell>
                        <TableCell align="right">Acumulado</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row) => {
                        const isSelected = selectedEntryId === row.id;

                        return (
                            <TableRow
                                key={row.id}
                                hover
                                selected={isSelected}
                                onClick={() =>
                                    onSelectEntry(isSelected ? null : row.id)
                                }
                                sx={{
                                    cursor: "pointer",
                                }}
                            >
                                <TableCell sx={{ whiteSpace: "nowrap", minWidth: 160 }}>
                                    {formatDate(row.transactionDate)}
                                </TableCell>

                                <TableCell sx={{ minWidth: 300, maxWidth: 360 }}>
                                    <Stack spacing={0.75}>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {row.description}
                                        </Typography>

                                        <LedgerRowFlags row={row} />

                                        {row.merchant ? (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    opacity: 0.75,
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                Comercio: {row.merchant}
                                            </Typography>
                                        ) : null}

                                        {row.notes ? (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    opacity: 0.75,
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                Nota: {row.notes}
                                            </Typography>
                                        ) : null}
                                    </Stack>
                                </TableCell>

                                <TableCell sx={{ minWidth: 120 }}>
                                    <TransactionTypeChip type={row.type} />
                                </TableCell>

                                <TableCell sx={{ minWidth: 110 }}>
                                    <TransactionStatusChip status={row.status} />
                                </TableCell>

                                <TableCell sx={{ minWidth: 180 }}>
                                    <Typography sx={{ wordBreak: "break-word" }}>
                                        {row.accountName}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ minWidth: 180 }}>
                                    <Typography sx={{ wordBreak: "break-word" }}>
                                        {row.counterpartyAccountName ?? "—"}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ minWidth: 160 }}>
                                    <Typography sx={{ wordBreak: "break-word" }}>
                                        {row.categoryName ?? "—"}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ minWidth: 160 }}>
                                    <Typography sx={{ wordBreak: "break-word" }}>
                                        {row.memberName ?? "—"}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ minWidth: 160 }}>
                                    <Typography sx={{ wordBreak: "break-word" }}>
                                        {row.reference ?? "—"}
                                    </Typography>
                                </TableCell>

                                <TableCell
                                    align="right"
                                    sx={{
                                        minWidth: 120,
                                        color: "error.main",
                                        fontWeight: 700,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {row.debitAmount > 0
                                        ? formatAmount(row.debitAmount, row.currency)
                                        : "—"}
                                </TableCell>

                                <TableCell
                                    align="right"
                                    sx={{
                                        minWidth: 120,
                                        color: "success.main",
                                        fontWeight: 700,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {row.creditAmount > 0
                                        ? formatAmount(row.creditAmount, row.currency)
                                        : "—"}
                                </TableCell>

                                <TableCell
                                    align="right"
                                    sx={{
                                        minWidth: 140,
                                        fontWeight: 800,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {getRunningBalanceLabel(row)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function InfoLine({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <Stack direction="row" spacing={1} alignItems="flex-start">
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 700,
                    minWidth: 96,
                    flexShrink: 0,
                }}
            >
                {label}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    opacity: 0.9,
                    wordBreak: "break-word",
                }}
            >
                {value}
            </Typography>
        </Stack>
    );
}

function LedgerMobileCards({
    rows,
    selectedEntryId,
    onSelectEntry,
}: LedgerTableProps) {
    return (
        <Stack spacing={1.5}>
            {rows.map((row) => {
                const isSelected = selectedEntryId === row.id;

                return (
                    <Paper
                        key={row.id}
                        variant="outlined"
                        onClick={() => onSelectEntry(isSelected ? null : row.id)}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            cursor: "pointer",
                            borderColor: isSelected ? "primary.main" : "divider",
                            boxShadow: isSelected ? 3 : 0,
                            transition: "all 0.2s ease",
                        }}
                    >
                        <Stack spacing={1.25}>
                            <Stack spacing={0.75}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        opacity: 0.75,
                                    }}
                                >
                                    {formatDate(row.transactionDate)}
                                </Typography>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: "1.05rem",
                                        lineHeight: 1.25,
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {row.description}
                                </Typography>

                                <LedgerRowFlags row={row} />
                            </Stack>

                            <Stack
                                direction="row"
                                spacing={1}
                                useFlexGap
                                flexWrap="wrap"
                            >
                                <TransactionTypeChip type={row.type} />
                                <TransactionStatusChip status={row.status} />
                            </Stack>

                            <Stack spacing={0.75}>
                                <InfoLine label="Cuenta" value={row.accountName} />
                                <InfoLine
                                    label="Contracuenta"
                                    value={row.counterpartyAccountName ?? "—"}
                                />
                                <InfoLine
                                    label="Categoría"
                                    value={row.categoryName ?? "—"}
                                />
                                <InfoLine
                                    label="Miembro"
                                    value={row.memberName ?? "—"}
                                />
                                <InfoLine
                                    label="Referencia"
                                    value={row.reference ?? "—"}
                                />
                            </Stack>

                            {row.merchant ? (
                                <Alert severity="info" sx={{ py: 0 }}>
                                    Comercio: {row.merchant}
                                </Alert>
                            ) : null}

                            {row.notes ? (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        opacity: 0.8,
                                        wordBreak: "break-word",
                                    }}
                                >
                                    Nota: {row.notes}
                                </Typography>
                            ) : null}

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                                    gap: 1,
                                }}
                            >
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 1.25,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                        Cargo
                                    </Typography>
                                    <Typography
                                        sx={{
                                            mt: 0.5,
                                            fontWeight: 800,
                                            color: "error.main",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {row.debitAmount > 0
                                            ? formatAmount(row.debitAmount, row.currency)
                                            : "—"}
                                    </Typography>
                                </Paper>

                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 1.25,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                        Abono
                                    </Typography>
                                    <Typography
                                        sx={{
                                            mt: 0.5,
                                            fontWeight: 800,
                                            color: "success.main",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {row.creditAmount > 0
                                            ? formatAmount(row.creditAmount, row.currency)
                                            : "—"}
                                    </Typography>
                                </Paper>

                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 1.25,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                        Acumulado
                                    </Typography>
                                    <Typography
                                        sx={{
                                            mt: 0.5,
                                            fontWeight: 800,
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {getRunningBalanceLabel(row)}
                                    </Typography>
                                </Paper>
                            </Box>
                        </Stack>
                    </Paper>
                );
            })}
        </Stack>
    );
}

export function LedgerTable(props: LedgerTableProps) {
    const theme = useTheme();
    const useCardsLayout = useMediaQuery(theme.breakpoints.down("lg"));

    if (props.rows.length === 0) {
        return null;
    }

    if (useCardsLayout) {
        return <LedgerMobileCards {...props} />;
    }

    return <LedgerDesktopTable {...props} />;
}
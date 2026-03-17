// src/features/components/WorkspaceTransactionSelect.tsx

import { useId } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { TransactionType } from "../../shared/types/common.types";
import { useTransactionsQuery } from "../transactions/hooks/useTransactionsQuery";
import type {
    TransactionRecord,
    TransactionStatus,
} from "../transactions/types/transaction.types";

type WorkspaceTransactionSelectProps = {
    workspaceId: string | null;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    error?: boolean;
    allowEmpty?: boolean;
    emptyOptionLabel?: string;
    typeFilter?: TransactionType | "ALL";
    statusFilter?: TransactionStatus | "ALL";
    includeArchived?: boolean;
    includeHidden?: boolean;
};

function formatMoney(amount: number, currency: string): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(new Date(value));
}

function getTransactionTypeLabel(type: TransactionType): string {
    switch (type) {
        case "expense":
            return "Gasto";
        case "income":
            return "Ingreso";
        case "debt_payment":
            return "Pago de deuda";
        case "transfer":
            return "Transferencia";
        case "adjustment":
            return "Ajuste";
    }
}

function getTransactionOptionLabel(transaction: TransactionRecord): string {
    return [
        transaction.description,
        formatMoney(transaction.amount, transaction.currency),
        formatDate(transaction.transactionDate),
    ].join(" • ");
}

function matchesFilters(
    transaction: TransactionRecord,
    typeFilter: TransactionType | "ALL",
    statusFilter: TransactionStatus | "ALL",
    includeArchived: boolean,
    includeHidden: boolean
): boolean {
    if (!includeArchived && transaction.isArchived) {
        return false;
    }

    if (!includeHidden && !transaction.isVisible) {
        return false;
    }

    if (typeFilter !== "ALL" && transaction.type !== typeFilter) {
        return false;
    }

    if (statusFilter !== "ALL" && transaction.status !== statusFilter) {
        return false;
    }

    return true;
}

function buildSortedTransactions(
    transactions: TransactionRecord[],
    typeFilter: TransactionType | "ALL",
    statusFilter: TransactionStatus | "ALL",
    includeArchived: boolean,
    includeHidden: boolean
): TransactionRecord[] {
    return [...transactions]
        .filter((transaction) =>
            matchesFilters(
                transaction,
                typeFilter,
                statusFilter,
                includeArchived,
                includeHidden
            )
        )
        .sort((left, right) => {
            const leftDate = new Date(left.transactionDate).getTime();
            const rightDate = new Date(right.transactionDate).getTime();

            return rightDate - leftDate;
        });
}

function TransactionOptionContent({
    transaction,
}: {
    transaction: TransactionRecord;
}) {
    return (
        <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                {getTransactionOptionLabel(transaction)}
            </Typography>

            <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
                sx={{ mt: 0.25 }}
            >
                <Typography variant="caption" sx={{ opacity: 0.72 }}>
                    {getTransactionTypeLabel(transaction.type)}
                </Typography>

                <Typography variant="caption" sx={{ opacity: 0.55 }}>
                    {transaction.status}
                </Typography>
            </Stack>
        </Box>
    );
}

export function WorkspaceTransactionSelect({
    workspaceId,
    value,
    onChange,
    label = "Transacción",
    helperText,
    disabled = false,
    error = false,
    allowEmpty = true,
    emptyOptionLabel = "Sin transacción específica",
    typeFilter = "ALL",
    statusFilter = "ALL",
    includeArchived = false,
    includeHidden = true,
}: WorkspaceTransactionSelectProps) {
    const selectId = useId();
    const labelId = `${selectId}-label`;

    const transactionsQuery = useTransactionsQuery(workspaceId);
    const allTransactions = transactionsQuery.data?.transactions ?? [];

    const transactions = buildSortedTransactions(
        allTransactions,
        typeFilter,
        statusFilter,
        includeArchived,
        includeHidden
    );

    const selectedTransaction =
        allTransactions.find((transaction) => transaction._id === value) ?? null;

    const selectedIsInVisibleCollection = transactions.some(
        (transaction) => transaction._id === value
    );

    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    const isDisabled = disabled || workspaceId === null || transactionsQuery.isLoading;

    const resolvedHelperText = (() => {
        if (workspaceId === null) {
            return "Primero debe existir un workspace activo.";
        }

        if (transactionsQuery.isError) {
            return "No se pudieron cargar las transacciones del workspace.";
        }

        if (transactionsQuery.isLoading) {
            return "Cargando transacciones...";
        }

        if (transactions.length === 0) {
            return "No hay transacciones disponibles con los filtros actuales.";
        }

        return helperText;
    })();

    return (
        <FormControl fullWidth error={error} disabled={isDisabled}>
            <InputLabel id={labelId}>{label}</InputLabel>

            <Select
                labelId={labelId}
                label={label}
                value={value}
                onChange={handleChange}
                renderValue={(selectedValue) => {
                    if (!selectedValue) {
                        return emptyOptionLabel;
                    }

                    const currentTransaction =
                        allTransactions.find(
                            (transaction) => transaction._id === selectedValue
                        ) ?? selectedTransaction;

                    if (!currentTransaction) {
                        return selectedValue;
                    }

                    return (
                        <TransactionOptionContent transaction={currentTransaction} />
                    );
                }}
            >
                {allowEmpty ? <MenuItem value="">{emptyOptionLabel}</MenuItem> : null}

                {!selectedIsInVisibleCollection && selectedTransaction ? (
                    <MenuItem value={selectedTransaction._id}>
                        <TransactionOptionContent transaction={selectedTransaction} />
                    </MenuItem>
                ) : null}

                {transactions.map((transaction) => (
                    <MenuItem key={transaction._id} value={transaction._id}>
                        <TransactionOptionContent transaction={transaction} />
                    </MenuItem>
                ))}
            </Select>

            {resolvedHelperText ? <FormHelperText>{resolvedHelperText}</FormHelperText> : null}
        </FormControl>
    );
}
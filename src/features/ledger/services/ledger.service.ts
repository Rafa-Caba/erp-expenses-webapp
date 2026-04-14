// src/features/ledger/services/ledger.service.ts

import type { AccountRecord } from "../../accounts/types/account.types";
import type { CategoryRecord } from "../../categories/types/category.types";
import type {
    LedgerDataset,
    LedgerEntryRow,
    LedgerFilters,
    LedgerSummary,
    LedgerView,
} from "../types/ledger.types";
import type { TransactionRecord } from "../../transactions/types/transaction.types";
import type { WorkspaceMemberRecord } from "../../workspaces/types/workspace-member.types";

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function parseDateTimestamp(value: string): number {
    const timestamp = new Date(value).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
}

function startOfDayTimestamp(value: string): number {
    const date = new Date(`${value}T00:00:00.000`);

    return Number.isNaN(date.getTime()) ? Number.NEGATIVE_INFINITY : date.getTime();
}

function endOfDayTimestamp(value: string): number {
    const date = new Date(`${value}T23:59:59.999`);

    return Number.isNaN(date.getTime()) ? Number.POSITIVE_INFINITY : date.getTime();
}

function safeLabel(value: string | null | undefined, fallback: string): string {
    const normalizedValue = value?.trim();

    if (!normalizedValue) {
        return fallback;
    }

    return normalizedValue;
}

function buildAccountMap(accounts: AccountRecord[]): Map<string, AccountRecord> {
    return new Map(accounts.map((account) => [account.id, account]));
}

function buildCategoryMap(categories: CategoryRecord[]): Map<string, CategoryRecord> {
    return new Map(categories.map((category) => [category._id, category]));
}

function buildMemberMap(members: WorkspaceMemberRecord[]): Map<string, WorkspaceMemberRecord> {
    return new Map(members.map((member) => [member.id, member]));
}

function getAccountName(accountMap: Map<string, AccountRecord>, accountId: string | null): string {
    if (!accountId) {
        return "Sin cuenta";
    }

    return safeLabel(accountMap.get(accountId)?.name, `Cuenta ${accountId}`);
}

function getCategoryName(
    categoryMap: Map<string, CategoryRecord>,
    categoryId: string | null
): string | null {
    if (!categoryId) {
        return null;
    }

    return safeLabel(categoryMap.get(categoryId)?._id ? categoryMap.get(categoryId)?.name : null, `Categoría ${categoryId}`);
}

function getMemberName(
    memberMap: Map<string, WorkspaceMemberRecord>,
    memberId: string | null
): string | null {
    if (!memberId) {
        return null;
    }

    return safeLabel(memberMap.get(memberId)?.displayName, `Miembro ${memberId}`);
}

function toAbsoluteAmount(value: number): number {
    return Math.abs(Number.isFinite(value) ? value : 0);
}

function buildStandardSignedAmount(transaction: TransactionRecord): number {
    if (transaction.type === "income") {
        return toAbsoluteAmount(transaction.amount);
    }

    if (transaction.type === "adjustment") {
        return transaction.amount >= 0
            ? toAbsoluteAmount(transaction.amount)
            : -toAbsoluteAmount(transaction.amount);
    }

    return -toAbsoluteAmount(transaction.amount);
}

function buildSearchableText(row: LedgerEntryRow): string {
    return [
        row.transactionId,
        row.description,
        row.accountName,
        row.counterpartyAccountName ?? "",
        row.categoryName ?? "",
        row.memberName ?? "",
        row.reference ?? "",
        row.notes ?? "",
        row.merchant ?? "",
        row.type,
        row.status,
        row.direction,
        row.currency,
        row.entryKind,
        String(row.amount),
        row.transactionDate,
    ]
        .join(" ")
        .toLocaleLowerCase();
}

export function buildLedgerRows(dataset: LedgerDataset): LedgerEntryRow[] {
    const accountMap = buildAccountMap(dataset.accounts);
    const categoryMap = buildCategoryMap(dataset.categories);
    const memberMap = buildMemberMap(dataset.members);

    const rows: LedgerEntryRow[] = [];

    for (const transaction of dataset.transactions) {
        const categoryName = getCategoryName(categoryMap, transaction.categoryId);
        const memberName = getMemberName(memberMap, transaction.memberId);

        if (transaction.type === "transfer") {
            if (transaction.accountId) {
                const amount = toAbsoluteAmount(transaction.amount);

                rows.push({
                    id: `${transaction._id}:transfer_out:${transaction.accountId}`,
                    transactionId: transaction._id,
                    entryKind: "transfer_out",
                    direction: "OUTFLOW",
                    transactionDate: transaction.transactionDate,
                    type: transaction.type,
                    status: transaction.status,
                    description: transaction.description,
                    merchant: transaction.merchant,
                    reference: transaction.reference,
                    notes: transaction.notes,
                    currency: transaction.currency,
                    amount,
                    debitAmount: amount,
                    creditAmount: 0,
                    signedAmount: -amount,
                    accountId: transaction.accountId,
                    accountName: getAccountName(accountMap, transaction.accountId),
                    counterpartyAccountId: transaction.destinationAccountId,
                    counterpartyAccountName: transaction.destinationAccountId
                        ? getAccountName(accountMap, transaction.destinationAccountId)
                        : null,
                    categoryId: transaction.categoryId,
                    categoryName,
                    memberId: transaction.memberId,
                    memberName,
                    isRecurring: transaction.isRecurring,
                    isVisible: transaction.isVisible,
                    isArchived: transaction.isArchived,
                    isActive: transaction.isActive,
                    runningBalance: null,
                    runningBalanceMode: "VIEW",
                });
            }

            if (transaction.destinationAccountId) {
                const amount = toAbsoluteAmount(transaction.amount);

                rows.push({
                    id: `${transaction._id}:transfer_in:${transaction.destinationAccountId}`,
                    transactionId: transaction._id,
                    entryKind: "transfer_in",
                    direction: "INFLOW",
                    transactionDate: transaction.transactionDate,
                    type: transaction.type,
                    status: transaction.status,
                    description: transaction.description,
                    merchant: transaction.merchant,
                    reference: transaction.reference,
                    notes: transaction.notes,
                    currency: transaction.currency,
                    amount,
                    debitAmount: 0,
                    creditAmount: amount,
                    signedAmount: amount,
                    accountId: transaction.destinationAccountId,
                    accountName: getAccountName(accountMap, transaction.destinationAccountId),
                    counterpartyAccountId: transaction.accountId,
                    counterpartyAccountName: transaction.accountId
                        ? getAccountName(accountMap, transaction.accountId)
                        : null,
                    categoryId: transaction.categoryId,
                    categoryName,
                    memberId: transaction.memberId,
                    memberName,
                    isRecurring: transaction.isRecurring,
                    isVisible: transaction.isVisible,
                    isArchived: transaction.isArchived,
                    isActive: transaction.isActive,
                    runningBalance: null,
                    runningBalanceMode: "VIEW",
                });
            }

            continue;
        }

        const signedAmount = buildStandardSignedAmount(transaction);
        const absoluteAmount = toAbsoluteAmount(transaction.amount);

        rows.push({
            id: `${transaction._id}:standard`,
            transactionId: transaction._id,
            entryKind: "standard",
            direction: signedAmount >= 0 ? "INFLOW" : "OUTFLOW",
            transactionDate: transaction.transactionDate,
            type: transaction.type,
            status: transaction.status,
            description: transaction.description,
            merchant: transaction.merchant,
            reference: transaction.reference,
            notes: transaction.notes,
            currency: transaction.currency,
            amount: absoluteAmount,
            debitAmount: signedAmount < 0 ? absoluteAmount : 0,
            creditAmount: signedAmount >= 0 ? absoluteAmount : 0,
            signedAmount,
            accountId: transaction.accountId,
            accountName: getAccountName(accountMap, transaction.accountId),
            counterpartyAccountId: transaction.destinationAccountId,
            counterpartyAccountName: transaction.destinationAccountId
                ? getAccountName(accountMap, transaction.destinationAccountId)
                : null,
            categoryId: transaction.categoryId,
            categoryName,
            memberId: transaction.memberId,
            memberName,
            isRecurring: transaction.isRecurring,
            isVisible: transaction.isVisible,
            isArchived: transaction.isArchived,
            isActive: transaction.isActive,
            runningBalance: null,
            runningBalanceMode: "VIEW",
        });
    }

    return rows;
}

function matchesDateRange(row: LedgerEntryRow, dateFrom: string, dateTo: string): boolean {
    const rowTimestamp = parseDateTimestamp(row.transactionDate);

    if (dateFrom.trim()) {
        const fromTimestamp = startOfDayTimestamp(dateFrom);

        if (rowTimestamp < fromTimestamp) {
            return false;
        }
    }

    if (dateTo.trim()) {
        const toTimestamp = endOfDayTimestamp(dateTo);

        if (rowTimestamp > toTimestamp) {
            return false;
        }
    }

    return true;
}

export function filterLedgerRows(
    rows: LedgerEntryRow[],
    filters: LedgerFilters
): LedgerEntryRow[] {
    const normalizedSearchTerm = normalizeText(filters.searchTerm);

    return rows.filter((row) => {
        if (!filters.includeHidden && !row.isVisible) {
            return false;
        }

        if (!filters.includeArchived && row.isArchived) {
            return false;
        }

        if (!filters.includeInactive && !row.isActive) {
            return false;
        }

        if (filters.onlyRecurring && !row.isRecurring) {
            return false;
        }

        if (filters.accountId && row.accountId !== filters.accountId) {
            return false;
        }

        if (filters.memberId && row.memberId !== filters.memberId) {
            return false;
        }

        if (filters.categoryId && row.categoryId !== filters.categoryId) {
            return false;
        }

        if (filters.currency !== "ALL" && row.currency !== filters.currency) {
            return false;
        }

        if (filters.typeFilter !== "ALL" && row.type !== filters.typeFilter) {
            return false;
        }

        if (filters.statusFilter !== "ALL" && row.status !== filters.statusFilter) {
            return false;
        }

        if (
            filters.directionFilter !== "ALL" &&
            row.direction !== filters.directionFilter
        ) {
            return false;
        }

        if (!matchesDateRange(row, filters.dateFrom, filters.dateTo)) {
            return false;
        }

        if (!normalizedSearchTerm) {
            return true;
        }

        return buildSearchableText(row).includes(normalizedSearchTerm);
    });
}

function compareLedgerRows(
    left: LedgerEntryRow,
    right: LedgerEntryRow,
    sortOrder: LedgerFilters["sortOrder"]
): number {
    if (sortOrder === "amount_desc") {
        return right.amount - left.amount;
    }

    if (sortOrder === "amount_asc") {
        return left.amount - right.amount;
    }

    const leftTimestamp = parseDateTimestamp(left.transactionDate);
    const rightTimestamp = parseDateTimestamp(right.transactionDate);

    if (sortOrder === "date_asc") {
        if (leftTimestamp !== rightTimestamp) {
            return leftTimestamp - rightTimestamp;
        }

        return left.id.localeCompare(right.id);
    }

    if (leftTimestamp !== rightTimestamp) {
        return rightTimestamp - leftTimestamp;
    }

    return left.id.localeCompare(right.id);
}

function applyRunningBalance(
    rows: LedgerEntryRow[],
    dataset: LedgerDataset,
    filters: LedgerFilters
): LedgerEntryRow[] {
    const accountMap = buildAccountMap(dataset.accounts);
    const singleAccountMode = filters.accountId.trim().length > 0;
    const orderedForBalance = [...rows].sort((left, right) =>
        compareLedgerRows(left, right, "date_asc")
    );

    let runningBalance = 0;

    if (singleAccountMode) {
        const account = accountMap.get(filters.accountId);

        runningBalance = account?.initialBalance ?? 0;
    }

    const rowsWithBalanceAsc = orderedForBalance.map((row) => {
        runningBalance += row.signedAmount;

        return {
            ...row,
            runningBalance,
            runningBalanceMode: singleAccountMode ? "ACCOUNT" : "VIEW",
        };
    });

    const balanceMap = new Map(
        rowsWithBalanceAsc.map((row) => [row.id, row.runningBalance])
    );

    return [...rows]
        .sort((left, right) => compareLedgerRows(left, right, filters.sortOrder))
        .map((row) => ({
            ...row,
            runningBalance: balanceMap.get(row.id) ?? null,
            runningBalanceMode: singleAccountMode ? "ACCOUNT" : "VIEW",
        }));
}

export function buildLedgerSummary(rows: LedgerEntryRow[]): LedgerSummary {
    const uniqueTransactionIds = new Set(rows.map((row) => row.transactionId));

    return rows.reduce<LedgerSummary>(
        (summary, row) => ({
            totalEntries: summary.totalEntries + 1,
            totalTransactionsRepresented: uniqueTransactionIds.size,
            inflowAmount: summary.inflowAmount + row.creditAmount,
            outflowAmount: summary.outflowAmount + row.debitAmount,
            netAmount: summary.netAmount + row.signedAmount,
            hiddenCount: summary.hiddenCount + (row.isVisible ? 0 : 1),
            archivedCount: summary.archivedCount + (row.isArchived ? 1 : 0),
            inactiveCount: summary.inactiveCount + (row.isActive ? 0 : 1),
            recurringCount: summary.recurringCount + (row.isRecurring ? 1 : 0),
            cancelledCount: summary.cancelledCount + (row.status === "cancelled" ? 1 : 0),
            postedCount: summary.postedCount + (row.status === "posted" ? 1 : 0),
            pendingCount: summary.pendingCount + (row.status === "pending" ? 1 : 0),
        }),
        {
            totalEntries: 0,
            totalTransactionsRepresented: uniqueTransactionIds.size,
            inflowAmount: 0,
            outflowAmount: 0,
            netAmount: 0,
            hiddenCount: 0,
            archivedCount: 0,
            inactiveCount: 0,
            recurringCount: 0,
            cancelledCount: 0,
            postedCount: 0,
            pendingCount: 0,
        }
    );
}

export function hasLedgerActiveFilters(filters: LedgerFilters): boolean {
    return (
        filters.searchTerm.trim().length > 0 ||
        filters.accountId.trim().length > 0 ||
        filters.memberId.trim().length > 0 ||
        filters.categoryId.trim().length > 0 ||
        filters.currency !== "ALL" ||
        filters.typeFilter !== "ALL" ||
        filters.statusFilter !== "ALL" ||
        filters.directionFilter !== "ALL" ||
        filters.includeHidden ||
        filters.includeArchived ||
        filters.includeInactive ||
        filters.onlyRecurring ||
        filters.dateFrom.trim().length > 0 ||
        filters.dateTo.trim().length > 0 ||
        filters.sortOrder !== "date_desc"
    );
}

export function buildLedgerView(
    dataset: LedgerDataset,
    filters: LedgerFilters
): LedgerView {
    const accountMap = buildAccountMap(dataset.accounts);
    const allRows = buildLedgerRows(dataset);
    const filteredRows = filterLedgerRows(allRows, filters);
    const rowsWithBalance = applyRunningBalance(filteredRows, dataset, filters);
    const selectedAccountName = filters.accountId
        ? safeLabel(accountMap.get(filters.accountId)?.name, `Cuenta ${filters.accountId}`)
        : null;

    return {
        allRows,
        filteredRows: rowsWithBalance,
        summary: buildLedgerSummary(rowsWithBalance),
        hasActiveFilters: hasLedgerActiveFilters(filters),
        singleAccountMode: filters.accountId.trim().length > 0,
        selectedAccountName,
    };
}
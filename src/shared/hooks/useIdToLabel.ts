// src/shared/hooks/useIdToLabel.ts

import { useAccountByIdQuery } from "../../features/accounts/hooks/useAccountByIdQuery";
import { useAdminUserByIdQuery } from "../../features/adminUsers/hooks/useAdminUserByIdQuery";
import { useBudgetByIdQuery } from "../../features/budgets/hooks/useBudgetByIdQuery";
import { useCardByIdQuery } from "../../features/cards/hooks/useCardByIdQuery";
import { useCategoryByIdQuery } from "../../features/categories/hooks/useCategoryByIdQuery";
import { useDebtByIdQuery } from "../../features/debts/hooks/useDebtByIdQuery";
import { usePaymentByIdQuery } from "../../features/payments/hooks/usePaymentByIdQuery";
import { useReceiptByIdQuery } from "../../features/receipts/hooks/useReceiptByIdQuery";
import { useTransactionByIdQuery } from "../../features/transactions/hooks/useTransactionByIdQuery";
import { useWorkspaceByIdQuery } from "../../features/workspaces/hooks/useWorkspaceByIdQuery";
import { useWorkspaceMemberByIdQuery } from "../../features/workspaces/hooks/useWorkspaceMemberByIdQuery";

import {
    buildEntityLabelResult,
    extractAccountRecord,
    extractBudgetRecord,
    extractCardRecord,
    extractCategoryRecord,
    extractDebtRecord,
    extractPaymentRecord,
    extractReceiptRecord,
    extractTransactionRecord,
    extractUserRecord,
    extractWorkspaceMemberRecord,
    extractWorkspaceRecord,
    getAccountLabel,
    getBudgetLabel,
    getCardLabel,
    getCategoryLabel,
    getDebtLabel,
    getPaymentLabel,
    getReceiptLabel,
    getTransactionLabel,
    getUserLabel,
    getWorkspaceLabel,
    getWorkspaceMemberLabel,
    type EntityLabelResult,
} from "../utils/idToLabel";

export function useWorkspaceNameById(
    workspaceId: string | null
): EntityLabelResult {
    const query = useWorkspaceByIdQuery(workspaceId);
    const workspace = extractWorkspaceRecord(query.data);

    return buildEntityLabelResult({
        rawId: workspaceId,
        label: getWorkspaceLabel(workspace),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Workspace",
    });
}

export function useAccountNameById(
    workspaceId: string | null,
    accountId: string | null
): EntityLabelResult {
    const query = useAccountByIdQuery(workspaceId, accountId);
    const account = extractAccountRecord(query.data);

    return buildEntityLabelResult({
        rawId: accountId,
        label: getAccountLabel(account),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Cuenta",
    });
}

export function useCardNameById(
    workspaceId: string | null,
    cardId: string | null
): EntityLabelResult {
    const query = useCardByIdQuery(workspaceId, cardId);
    const card = extractCardRecord(query.data);

    return buildEntityLabelResult({
        rawId: cardId,
        label: getCardLabel(card),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Tarjeta",
    });
}

export function useCategoryNameById(
    workspaceId: string | null,
    categoryId: string | null
): EntityLabelResult {
    const query = useCategoryByIdQuery(workspaceId, categoryId);
    const category = extractCategoryRecord(query.data);

    return buildEntityLabelResult({
        rawId: categoryId,
        label: getCategoryLabel(category),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Categoría",
    });
}

export function useWorkspaceMemberNameById(
    workspaceId: string | null,
    memberId: string | null
): EntityLabelResult {
    const query = useWorkspaceMemberByIdQuery(workspaceId, memberId);
    const member = extractWorkspaceMemberRecord(query.data);

    return buildEntityLabelResult({
        rawId: memberId,
        label: getWorkspaceMemberLabel(member),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Miembro",
    });
}

export function useAdminUserNameById(
    userId: string | null
): EntityLabelResult {
    const query = useAdminUserByIdQuery(userId);
    const user = extractUserRecord(query.data);

    return buildEntityLabelResult({
        rawId: userId,
        label: getUserLabel(user),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Usuario",
    });
}

export function useDebtNameById(
    workspaceId: string | null,
    debtId: string | null
): EntityLabelResult {
    const query = useDebtByIdQuery(workspaceId, debtId);
    const debt = extractDebtRecord(query.data);

    return buildEntityLabelResult({
        rawId: debtId,
        label: getDebtLabel(debt),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Deuda",
    });
}

export function useTransactionNameById(
    workspaceId: string | null,
    transactionId: string | null
): EntityLabelResult {
    const query = useTransactionByIdQuery(workspaceId, transactionId);
    const transaction = extractTransactionRecord(query.data);

    return buildEntityLabelResult({
        rawId: transactionId,
        label: getTransactionLabel(transaction),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Transacción",
    });
}

export function usePaymentNameById(
    workspaceId: string | null,
    paymentId: string | null
): EntityLabelResult {
    const query = usePaymentByIdQuery(workspaceId, paymentId);
    const payment = extractPaymentRecord(query.data);

    return buildEntityLabelResult({
        rawId: paymentId,
        label: getPaymentLabel(payment),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Pago",
    });
}

export function useReceiptNameById(
    workspaceId: string | null,
    receiptId: string | null
): EntityLabelResult {
    const query = useReceiptByIdQuery(workspaceId, receiptId);
    const receipt = extractReceiptRecord(query.data);

    return buildEntityLabelResult({
        rawId: receiptId,
        label: getReceiptLabel(receipt),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Recibo",
    });
}

export function useBudgetNameById(
    workspaceId: string | null,
    budgetId: string | null
): EntityLabelResult {
    const query = useBudgetByIdQuery(workspaceId, budgetId);
    const budget = extractBudgetRecord(query.data);

    return buildEntityLabelResult({
        rawId: budgetId,
        label: getBudgetLabel(budget),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Presupuesto",
    });
}
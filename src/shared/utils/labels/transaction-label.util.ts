// src/shared/utils/labels/transaction-label.util.ts

import { useTransactionByIdQuery } from "../../../features/transactions/hooks/useTransactionByIdQuery";
import type { TransactionRecord } from "../../../features/transactions/types/transaction.types";

import {
    buildLabelByIdResult,
    normalizeLabelValue,
    type LabelByIdResult,
} from "./label-by-id.util";

export function getTransactionLabelValue(
    transaction: TransactionRecord | null | undefined
): string | null {
    return normalizeLabelValue(transaction?.description);
}

export function useTransactionLabelById(
    workspaceId: string | null,
    transactionId: string | null
): LabelByIdResult {
    const query = useTransactionByIdQuery(workspaceId, transactionId);

    return buildLabelByIdResult({
        rawId: transactionId,
        resolvedLabel: getTransactionLabelValue(query.data),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Transacción",
    });
}
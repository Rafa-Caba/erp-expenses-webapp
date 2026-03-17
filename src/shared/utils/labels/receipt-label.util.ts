// src/shared/utils/labels/receipt-label.util.ts

import { useReceiptByIdQuery } from "../../../features/receipts/hooks/useReceiptByIdQuery";
import type { ReceiptRecord } from "../../../features/receipts/types/receipt.types";

import {
    buildLabelByIdResult,
    normalizeLabelValue,
    type LabelByIdResult,
} from "./label-by-id.util";

export function getReceiptLabelValue(receipt: ReceiptRecord | null | undefined): string | null {
    return normalizeLabelValue(receipt?.fileName);
}

export function useReceiptLabelById(
    workspaceId: string | null,
    receiptId: string | null
): LabelByIdResult {
    const query = useReceiptByIdQuery(workspaceId, receiptId);

    return buildLabelByIdResult({
        rawId: receiptId,
        resolvedLabel: getReceiptLabelValue(query.data),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Recibo",
    });
}
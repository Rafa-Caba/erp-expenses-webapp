// src/shared/utils/labels/payment-label.util.ts

import { usePaymentByIdQuery } from "../../../features/payments/hooks/usePaymentByIdQuery";
import type { PaymentRecord } from "../../../features/payments/types/payment.types";

import {
    buildLabelByIdResult,
    normalizeLabelValue,
    type LabelByIdResult,
} from "./label-by-id.util";

export function getPaymentLabelValue(payment: PaymentRecord | null | undefined): string | null {
    return normalizeLabelValue(payment?.reference);
}

export function usePaymentLabelById(
    workspaceId: string | null,
    paymentId: string | null
): LabelByIdResult {
    const query = usePaymentByIdQuery(workspaceId, paymentId);

    return buildLabelByIdResult({
        rawId: paymentId,
        resolvedLabel: getPaymentLabelValue(query.data),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Pago",
    });
}
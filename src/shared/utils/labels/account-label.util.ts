// src/shared/utils/labels/account-label.util.ts

import { useAccountByIdQuery } from "../../../features/accounts/hooks/useAccountByIdQuery";
import type { AccountRecord } from "../../../features/accounts/types/account.types";

import {
    buildLabelByIdResult,
    normalizeLabelValue,
    type LabelByIdResult,
} from "./label-by-id.util";

export function getAccountLabelValue(account: AccountRecord | null | undefined): string | null {
    return normalizeLabelValue(account?.name);
}

export function useAccountLabelById(
    workspaceId: string | null,
    accountId: string | null
): LabelByIdResult {
    const query = useAccountByIdQuery(workspaceId, accountId);

    return buildLabelByIdResult({
        rawId: accountId,
        resolvedLabel: getAccountLabelValue(query.data),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Cuenta",
    });
}
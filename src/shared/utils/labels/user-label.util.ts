// src/shared/utils/labels/user-label.util.ts

import { useAdminUserByIdQuery } from "../../../features/adminUsers/hooks/useAdminUserByIdQuery";
import type { UserRecord } from "../../../features/adminUsers/types/user.types";

import {
    buildLabelByIdResult,
    normalizeLabelValue,
    type LabelByIdResult,
} from "./label-by-id.util";

export function getUserLabelValue(user: UserRecord | null | undefined): string | null {
    return normalizeLabelValue(user?.fullName);
}

export function useUserLabelById(userId: string | null): LabelByIdResult {
    const query = useAdminUserByIdQuery(userId);

    return buildLabelByIdResult({
        rawId: userId,
        resolvedLabel: getUserLabelValue(query.data),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Usuario",
    });
}
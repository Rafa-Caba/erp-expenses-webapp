// src/shared/utils/labels/workspace-member-label.util.ts

import { useWorkspaceMemberByIdQuery } from "../../../features/workspaces/hooks/useWorkspaceMemberByIdQuery";
import type { WorkspaceMemberRecord } from "../../../features/workspaces/types/workspace-member.types";

import {
    buildLabelByIdResult,
    normalizeLabelValue,
    type LabelByIdResult,
} from "./label-by-id.util";

export function getWorkspaceMemberLabelValue(
    member: WorkspaceMemberRecord | null | undefined
): string | null {
    return normalizeLabelValue(member?.displayName);
}

export function useWorkspaceMemberLabelById(
    workspaceId: string | null,
    memberId: string | null
): LabelByIdResult {
    const query = useWorkspaceMemberByIdQuery(workspaceId, memberId);

    return buildLabelByIdResult({
        rawId: memberId,
        resolvedLabel: getWorkspaceMemberLabelValue(query.data),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Miembro",
    });
}
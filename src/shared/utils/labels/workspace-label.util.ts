// src/shared/utils/labels/workspace-label.util.ts

import { useWorkspaceByIdQuery } from "../../../features/workspaces/hooks/useWorkspaceByIdQuery";
import type { WorkspaceResponse } from "../../../features/workspaces/types/workspace.types";

import {
    buildLabelByIdResult,
    normalizeLabelValue,
    type LabelByIdResult,
} from "./label-by-id.util";

export function getWorkspaceLabelValue(
    workspaceResponse: WorkspaceResponse | null | undefined
): string | null {
    return normalizeLabelValue(workspaceResponse?.workspace.name);
}

export function useWorkspaceLabelById(workspaceId: string | null): LabelByIdResult {
    const query = useWorkspaceByIdQuery(workspaceId);

    return buildLabelByIdResult({
        rawId: workspaceId,
        resolvedLabel: getWorkspaceLabelValue(query.data),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        fallbackPrefix: "Workspace",
    });
}
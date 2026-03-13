// src/features/workspaces/hooks/usePersonalWorkspace.ts

import * as React from "react";

import type { WorkspaceListItem } from "../types/workspace.types";
import { useMyWorkspacesQuery } from "./useWorkspacesQuery";

type UsePersonalWorkspaceResult = {
    personalWorkspace: WorkspaceListItem | null;
    isLoading: boolean;
    isError: boolean;
};

export function usePersonalWorkspace(): UsePersonalWorkspaceResult {
    const query = useMyWorkspacesQuery();

    const personalWorkspace = React.useMemo(() => {
        const workspaces = query.data?.workspaces ?? [];

        return workspaces.find((workspace) => workspace.type === "PERSONAL") ?? null;
    }, [query.data?.workspaces]);

    return {
        personalWorkspace,
        isLoading: query.isLoading,
        isError: query.isError,
    };
}
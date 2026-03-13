// src/features/workspaces/hooks/useFilteredWorkspaces.ts

import * as React from "react";

import { useWorkspaceStore } from "../store/workspace.store";
import { useMyWorkspacesQuery } from "./useWorkspacesQuery";

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
}

export function useFilteredWorkspaces() {
    const searchTerm = useWorkspaceStore((state) => state.searchTerm);
    const includeArchived = useWorkspaceStore((state) => state.includeArchived);
    const includeInactive = useWorkspaceStore((state) => state.includeInactive);

    const query = useMyWorkspacesQuery({
        includeArchived,
        includeInactive,
    });

    const filteredWorkspaces = React.useMemo(() => {
        const workspaces = query.data?.workspaces ?? [];
        const normalizedSearchTerm = normalizeText(searchTerm);

        if (!normalizedSearchTerm) {
            return workspaces;
        }

        return workspaces.filter((workspace) => {
            const searchableValues = [
                workspace.name,
                workspace.description ?? "",
                workspace.type,
                workspace.kind,
                workspace.currency,
                workspace.country ?? "",
                workspace.timezone,
                workspace.visibility,
            ];

            return searchableValues.some((value) =>
                normalizeText(value).includes(normalizedSearchTerm)
            );
        });
    }, [query.data?.workspaces, searchTerm]);

    return {
        ...query,
        filteredWorkspaces,
    };
}
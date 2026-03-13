// src/features/workspaces/store/workspace.store.ts

import { create } from "zustand";

type WorkspaceUiStore = {
    searchTerm: string;
    includeArchived: boolean;
    includeInactive: boolean;
    selectedWorkspaceId: string | null;

    setSearchTerm: (value: string) => void;
    setIncludeArchived: (value: boolean) => void;
    setIncludeInactive: (value: boolean) => void;
    setSelectedWorkspaceId: (workspaceId: string | null) => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    includeArchived: false,
    includeInactive: false,
    selectedWorkspaceId: null,
};

export const useWorkspaceStore = create<WorkspaceUiStore>((set) => ({
    ...INITIAL_STATE,

    setSearchTerm: (value) =>
        set({
            searchTerm: value,
        }),

    setIncludeArchived: (value) =>
        set({
            includeArchived: value,
        }),

    setIncludeInactive: (value) =>
        set({
            includeInactive: value,
        }),

    setSelectedWorkspaceId: (workspaceId) =>
        set({
            selectedWorkspaceId: workspaceId,
        }),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
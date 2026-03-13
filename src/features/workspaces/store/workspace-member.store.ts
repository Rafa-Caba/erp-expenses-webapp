// src/features/workspaces/store/workspace-member.store.ts

import { create } from "zustand";

import type { MemberRole, MemberStatus } from "../../../shared/types/common.types";

type WorkspaceMemberStore = {
    searchTerm: string;
    roleFilter: MemberRole | "ALL";
    statusFilter: MemberStatus | "ALL";
    includeHidden: boolean;
    selectedMemberId: string | null;

    setSearchTerm: (value: string) => void;
    setRoleFilter: (value: MemberRole | "ALL") => void;
    setStatusFilter: (value: MemberStatus | "ALL") => void;
    setIncludeHidden: (value: boolean) => void;
    setSelectedMemberId: (value: string | null) => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    roleFilter: "ALL" as const,
    statusFilter: "ALL" as const,
    includeHidden: false,
    selectedMemberId: null,
};

export const useWorkspaceMemberStore = create<WorkspaceMemberStore>((set) => ({
    ...INITIAL_STATE,

    setSearchTerm: (value) =>
        set({
            searchTerm: value,
        }),

    setRoleFilter: (value) =>
        set({
            roleFilter: value,
        }),

    setStatusFilter: (value) =>
        set({
            statusFilter: value,
        }),

    setIncludeHidden: (value) =>
        set({
            includeHidden: value,
        }),

    setSelectedMemberId: (value) =>
        set({
            selectedMemberId: value,
        }),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
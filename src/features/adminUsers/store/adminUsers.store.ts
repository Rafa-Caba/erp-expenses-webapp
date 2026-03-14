// src/features/adminUsers/store/adminUsers.store.ts

import { create } from "zustand";

import type { UserRole } from "../../../shared/types/common.types";

export type AdminUsersActiveFilter = "ALL" | "ACTIVE" | "INACTIVE";

type AdminUsersStore = {
    searchTerm: string;
    roleFilter: UserRole | "ALL";
    activeFilter: AdminUsersActiveFilter;
    page: number;
    limit: number;
    selectedUserId: string | null;

    setSearchTerm: (value: string) => void;
    setRoleFilter: (value: UserRole | "ALL") => void;
    setActiveFilter: (value: AdminUsersActiveFilter) => void;
    setPage: (value: number) => void;
    setLimit: (value: number) => void;
    setSelectedUserId: (value: string | null) => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    roleFilter: "ALL" as const,
    activeFilter: "ALL" as const,
    page: 1,
    limit: 25,
    selectedUserId: null,
};

export const useAdminUsersStore = create<AdminUsersStore>((set) => ({
    ...INITIAL_STATE,

    setSearchTerm: (value) =>
        set({
            searchTerm: value,
            page: 1,
        }),

    setRoleFilter: (value) =>
        set({
            roleFilter: value,
            page: 1,
        }),

    setActiveFilter: (value) =>
        set({
            activeFilter: value,
            page: 1,
        }),

    setPage: (value) =>
        set({
            page: value,
        }),

    setLimit: (value) =>
        set({
            limit: value,
            page: 1,
        }),

    setSelectedUserId: (value) =>
        set({
            selectedUserId: value,
        }),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
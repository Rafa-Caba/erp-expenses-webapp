// src/features/auth/store/auth.store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthTokens, AuthUser } from "../types/auth.types";

export type AuthStatus = "ANON" | "AUTHENTICATED" | "LOADING";

type PersistedAuthSlice = {
    refreshToken: string | null;
};

type AuthStore = {
    status: AuthStatus;
    accessToken: string | null;
    refreshToken: string | null;
    user: AuthUser | null;
    isRefreshing: boolean;
    hasHydrated: boolean;

    setTokens: (tokens: AuthTokens | null) => void;
    setAccessToken: (accessToken: string | null) => void;
    setRefreshToken: (refreshToken: string | null) => void;
    setUser: (user: AuthUser | null) => void;
    setStatus: (status: AuthStatus) => void;
    setRefreshing: (value: boolean) => void;
    setHasHydrated: (value: boolean) => void;
    clearPersistedSession: () => void;
    reset: () => void;
};

const INITIAL_STATE: Omit<
    AuthStore,
    | "setTokens"
    | "setAccessToken"
    | "setRefreshToken"
    | "setUser"
    | "setStatus"
    | "setRefreshing"
    | "setHasHydrated"
    | "clearPersistedSession"
    | "reset"
> = {
    status: "ANON",
    accessToken: null,
    refreshToken: null,
    user: null,
    isRefreshing: false,
    hasHydrated: false,
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            ...INITIAL_STATE,

            setTokens: (tokens) =>
                set({
                    accessToken: tokens?.accessToken ?? null,
                    refreshToken: tokens?.refreshToken ?? null,
                }),

            setAccessToken: (accessToken) =>
                set({
                    accessToken,
                }),

            setRefreshToken: (refreshToken) =>
                set({
                    refreshToken,
                }),

            setUser: (user) =>
                set({
                    user,
                }),

            setStatus: (status) =>
                set({
                    status,
                }),

            setRefreshing: (value) =>
                set({
                    isRefreshing: value,
                }),

            setHasHydrated: (value) =>
                set({
                    hasHydrated: value,
                }),

            clearPersistedSession: () => {
                set({
                    accessToken: null,
                    refreshToken: null,
                    user: null,
                    status: "ANON",
                    isRefreshing: false,
                });
            },

            reset: () =>
                set({
                    ...INITIAL_STATE,
                    hasHydrated: true,
                }),
        }),
        {
            name: "expenses-auth",
            partialize: (state): PersistedAuthSlice => ({
                refreshToken: state.refreshToken,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.setHasHydrated(true);
                }
            },
        }
    )
);

export function clearPersistedAuthStorage(): void {
    localStorage.removeItem("expenses-auth");
}
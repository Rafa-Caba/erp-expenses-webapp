// src/app/scope/scope.store.ts

import { create } from "zustand";

import { clearLastScope, readLastScope, writeLastScope } from "./scope.storage";
import type { ScopeState, SetScopePayload } from "./scope.types";

type ScopeStore = ScopeState & {
    setScope: (next: SetScopePayload) => void;
    hydrateLastScope: () => void;
    persistLastScope: (next: SetScopePayload) => void;
    clearScope: () => void;
};

const INITIAL_SCOPE_STATE: ScopeState = {
    scopeType: "PERSONAL",
    workspaceId: null,
    workspaceType: null,
};

export const useScopeStore = create<ScopeStore>((set) => ({
    ...INITIAL_SCOPE_STATE,

    setScope: (next) => {
        set({
            scopeType: next.scopeType,
            workspaceId: next.workspaceId,
            workspaceType: next.workspaceType,
        });

        writeLastScope(next);
    },

    hydrateLastScope: () => {
        const storedScope = readLastScope();

        if (!storedScope) {
            set(INITIAL_SCOPE_STATE);
            return;
        }

        set({
            scopeType: storedScope.scopeType,
            workspaceId: storedScope.workspaceId,
            workspaceType: storedScope.workspaceType,
        });
    },

    persistLastScope: (next) => {
        writeLastScope(next);
    },

    clearScope: () => {
        clearLastScope();
        set(INITIAL_SCOPE_STATE);
    },
}));
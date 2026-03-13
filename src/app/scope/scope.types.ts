// src/app/scope/scope.types.ts

import type { WorkspaceType } from "../../shared/types/common.types";

export type ScopeType = "PERSONAL" | "WORKSPACE";

export type ScopeState = {
    scopeType: ScopeType;
    workspaceId: string | null;
    workspaceType: WorkspaceType | null;
};

export type ResolvedScopeState = {
    scopeType: ScopeType;
    workspaceId: string;
    workspaceType: WorkspaceType;
};

export type SetScopePayload = ResolvedScopeState;

export function isPersonalRouteScope(scopeType: ScopeType): boolean {
    return scopeType === "PERSONAL";
}

export function isResolvedScope(scope: ScopeState): scope is ResolvedScopeState {
    return scope.workspaceId !== null && scope.workspaceType !== null;
}

export function toScopeKey(scope: ScopeState): string {
    if (!isResolvedScope(scope)) {
        return `${scope.scopeType}:UNRESOLVED`;
    }

    return `${scope.workspaceType}:${scope.workspaceId}`;
}
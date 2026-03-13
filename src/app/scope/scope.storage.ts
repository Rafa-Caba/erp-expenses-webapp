// src/app/scope/scope.storage.ts

import type { WorkspaceType } from "../../shared/types/common.types";
import type { ScopeType, SetScopePayload } from "./scope.types";

const KEY = "expenses.lastScope";

const VALID_SCOPE_TYPES: ScopeType[] = ["PERSONAL", "WORKSPACE"];
const VALID_WORKSPACE_TYPES: WorkspaceType[] = ["PERSONAL", "HOUSEHOLD", "BUSINESS"];

export type StoredScope = SetScopePayload;

type StoredScopeCandidate = {
    scopeType?: string;
    workspaceId?: string;
    workspaceType?: string;
};

function isValidScopeType(value: string | undefined): value is ScopeType {
    return value !== undefined && VALID_SCOPE_TYPES.includes(value as ScopeType);
}

function isValidWorkspaceType(value: string | undefined): value is WorkspaceType {
    return value !== undefined && VALID_WORKSPACE_TYPES.includes(value as WorkspaceType);
}

function isNonEmptyString(value: string | undefined): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function isStoredScope(value: StoredScopeCandidate): value is StoredScope {
    if (!isValidScopeType(value.scopeType)) {
        return false;
    }

    if (!isNonEmptyString(value.workspaceId)) {
        return false;
    }

    if (!isValidWorkspaceType(value.workspaceType)) {
        return false;
    }

    if (value.scopeType === "PERSONAL" && value.workspaceType !== "PERSONAL") {
        return false;
    }

    return true;
}

export function readLastScope(): StoredScope | null {
    try {
        const raw = localStorage.getItem(KEY);

        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as StoredScopeCandidate;

        if (!isStoredScope(parsed)) {
            return null;
        }

        return parsed;
    } catch {
        return null;
    }
}

export function writeLastScope(next: StoredScope): void {
    try {
        localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
        // Ignore storage errors in UI persistence
    }
}

export function clearLastScope(): void {
    try {
        localStorage.removeItem(KEY);
    } catch {
        // Ignore storage errors in UI persistence
    }
}
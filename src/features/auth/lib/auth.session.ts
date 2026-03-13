// src/features/auth/lib/auth.session.ts

import { apiClient } from "../../../shared/api/apiClient";
import { createAuthService } from "../services/auth.service";
import {
    clearPersistedAuthStorage,
    useAuthStore,
} from "../store/auth.store";

const authService = createAuthService(apiClient);

let ensureSessionPromise: Promise<boolean> | null = null;

function hardResetSession(): void {
    useAuthStore.getState().clearPersistedSession();
    clearPersistedAuthStorage();
    useAuthStore.getState().setStatus("ANON");
}

export async function ensureSession(): Promise<boolean> {
    const currentState = useAuthStore.getState();

    if (currentState.accessToken && currentState.user) {
        return true;
    }

    if (ensureSessionPromise) {
        return ensureSessionPromise;
    }

    ensureSessionPromise = (async () => {
        const stateAtStart = useAuthStore.getState();

        if (stateAtStart.accessToken && stateAtStart.user) {
            return true;
        }

        if (!stateAtStart.accessToken && !stateAtStart.refreshToken) {
            useAuthStore.getState().setStatus("ANON");
            return false;
        }

        useAuthStore.getState().setStatus("LOADING");

        if (stateAtStart.accessToken && !stateAtStart.user) {
            try {
                const me = await authService.me();

                useAuthStore.getState().setUser(me);
                useAuthStore.getState().setStatus("AUTHENTICATED");
                return true;
            } catch {
                useAuthStore.getState().setAccessToken(null);
            }
        }

        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
            useAuthStore.getState().setStatus("ANON");
            return false;
        }

        try {
            const refreshedSession = await authService.refresh({
                refreshToken,
            });

            useAuthStore.getState().setTokens(refreshedSession.tokens);
            useAuthStore.getState().setUser(refreshedSession.user);
            useAuthStore.getState().setStatus("AUTHENTICATED");

            return true;
        } catch {
            hardResetSession();
            return false;
        }
    })().finally(() => {
        ensureSessionPromise = null;
    });

    return ensureSessionPromise;
}
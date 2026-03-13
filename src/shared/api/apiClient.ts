// src/shared/api/apiClient.ts

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import {
    clearPersistedAuthStorage,
    useAuthStore,
} from "../../features/auth/store/auth.store";
import { createAuthService } from "../../features/auth/services/auth.service";

type FailedRequestQueueItem = {
    resolve: (accessToken: string) => void;
    reject: (error: Error) => void;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

let failedQueue: FailedRequestQueueItem[] = [];

function processQueue(error: Error | null, accessToken: string | null): void {
    failedQueue.forEach((queueItem) => {
        if (accessToken) {
            queueItem.resolve(accessToken);
            return;
        }

        if (error) {
            queueItem.reject(error);
            return;
        }

        queueItem.reject(new Error("Request retry failed"));
    });

    failedQueue = [];
}

function shouldSkipRefresh(url: string | undefined): boolean {
    if (!url) {
        return false;
    }

    return (
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/refresh") ||
        url.includes("/auth/logout")
    );
}

function hardResetSession(): void {
    useAuthStore.getState().clearPersistedSession();
    clearPersistedAuthStorage();
    useAuthStore.getState().setStatus("ANON");
}

export const apiClient = axios.create({
    baseURL: String(import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api"),
    withCredentials: false,
    timeout: 20_000,
});

const authService = createAuthService(apiClient);

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;
        const statusCode = error.response?.status;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (statusCode !== 401) {
            return Promise.reject(error);
        }

        if (shouldSkipRefresh(originalRequest.url)) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const authState = useAuthStore.getState();

        if (authState.isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (nextAccessToken) => {
                        originalRequest.headers = originalRequest.headers ?? {};
                        originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
                        resolve(apiClient(originalRequest));
                    },
                    reject,
                });
            });
        }

        const refreshToken = authState.refreshToken;

        if (!refreshToken) {
            hardResetSession();
            return Promise.reject(error);
        }

        useAuthStore.getState().setRefreshing(true);

        try {
            const refreshedSession = await authService.refresh({
                refreshToken,
            });

            useAuthStore.getState().setTokens(refreshedSession.tokens);
            useAuthStore.getState().setUser(refreshedSession.user);
            useAuthStore.getState().setStatus("AUTHENTICATED");

            processQueue(null, refreshedSession.tokens.accessToken);

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${refreshedSession.tokens.accessToken}`;

            return apiClient(originalRequest);
        } catch (refreshError) {
            const normalizedError =
                refreshError instanceof Error
                    ? refreshError
                    : new Error("Session refresh failed");

            processQueue(normalizedError, null);
            hardResetSession();

            return Promise.reject(normalizedError);
        } finally {
            useAuthStore.getState().setRefreshing(false);
        }
    }
);
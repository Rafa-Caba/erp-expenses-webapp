// src/app/providers/AppProviders.tsx

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppThemeProvider } from "./AppThemeProvider";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30_000,
        },
        mutations: {
            retry: 0,
        },
    },
});

type AppProvidersProps = {
    children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <AppThemeProvider>{children}</AppThemeProvider>
        </QueryClientProvider>
    );
}
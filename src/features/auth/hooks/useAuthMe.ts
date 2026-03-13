// src/features/auth/hooks/useAuthMe.ts

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { authQueryKeys } from "../api/auth.queryKeys";
import { useAuthStore } from "../store/auth.store";
import { createAuthService } from "../services/auth.service";

const authService = createAuthService(apiClient);

export function useAuthMe() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const setUser = useAuthStore((state) => state.setUser);
    const setStatus = useAuthStore((state) => state.setStatus);

    const query = useQuery({
        queryKey: authQueryKeys.me(),
        queryFn: () => authService.me(),
        enabled: Boolean(accessToken),
        retry: false,
    });

    React.useEffect(() => {
        if (!query.data) {
            return;
        }

        setUser(query.data);
        setStatus("AUTHENTICATED");
    }, [query.data, setStatus, setUser]);

    return query;
}
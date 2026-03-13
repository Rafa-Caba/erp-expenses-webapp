// src/app/router/HomeRedirect.tsx

import { Navigate } from "react-router-dom";
import { readLastScope } from "../scope/scope.storage";

export function HomeRedirect() {
    const lastScope = readLastScope();

    if (!lastScope) {
        return <Navigate to="/app/personal/dashboard" replace />;
    }

    if (
        lastScope.scopeType === "PERSONAL" ||
        lastScope.workspaceType === "PERSONAL"
    ) {
        return <Navigate to="/app/personal/dashboard" replace />;
    }

    return <Navigate to={`/app/w/${lastScope.workspaceId}/dashboard`} replace />;
}
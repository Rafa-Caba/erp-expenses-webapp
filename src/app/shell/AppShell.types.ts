// src/app/shell/AppShell.types.ts

import type React from "react";

export type AppShellScopeType = "PERSONAL" | "WORKSPACE";

export type AppShellWorkspaceType = "PERSONAL" | "HOUSEHOLD" | "BUSINESS";

export type NavItem = {
    label: string;
    to: string;
    icon: React.ReactNode;
    showInBottom: boolean;
};
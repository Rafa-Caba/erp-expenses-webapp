// src/app/router/router.tsx

import { createBrowserRouter, Navigate } from "react-router-dom";

import { ProtectedLayout } from "../layouts/ProtectedLayout";
import { ScopeLayout } from "../layouts/ScopeLayout";
import { AppShell } from "../shell/AppShell";
import { HomeRedirect } from "./HomeRedirect";

import { LoginPage } from "../../features/auth/pages/LoginPage";
import { RegisterPage } from "../../features/auth/pages/RegisterPage";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage";
import { AdminUsersPage } from "../../features/adminUsers/pages/AdminUsersPage";
import { NewAdminUserPage } from "../../features/adminUsers/pages/NewAdminUserPage";
import { EditAdminUserPage } from "../../features/adminUsers/pages/EditAdminUserPage";
import { LedgerPage } from "../../features/ledger/pages/LedgerPage";
import { AccountsPage } from "../../features/accounts/pages/AccountsPage";
import { BudgetsPage } from "../../features/budgets/pages/BudgetsPage";
import { NewBudgetPage } from "../../features/budgets/pages/NewBudgetPage";
import { EditBudgetPage } from "../../features/budgets/pages/EditBudgetPage";
import { NewAccountPage } from "../../features/accounts/pages/NewAccountPage";
import { EditAccountPage } from "../../features/accounts/pages/EditAccountPage";
import { ReconciliationPage } from "../../features/reconciliation/pages/ReconciliationPage";
import { WorkspacesPage } from "../../features/workspaces/pages/WorkspacesPage";
import { NewWorkspacePage } from "../../features/workspaces/pages/NewWorkspacePage";
import { EditWorkspacePage } from "../../features/workspaces/pages/EditWorkspacePage";
import { WorkspaceMembersPage } from "../../features/workspaces/pages/WorkspaceMembersPage";
import { NewWorkspaceMemberPage } from "../../features/workspaces/pages/NewWorkspaceMemberPage";
import { EditWorkspaceMemberPage } from "../../features/workspaces/pages/EditWorkspaceMemberPage";
import { WorkspaceSettingsPage } from "../../features/workspaceSettings/pages/WorkspaceSettingsPage";
import { ProfilePage } from "../../features/profile/pages/ProfilePage";

export const router = createBrowserRouter([
    { path: "/", element: <HomeRedirect /> },

    { path: "/auth/login", element: <LoginPage /> },
    { path: "/auth/register", element: <RegisterPage /> },

    {
        path: "/app",
        element: <ProtectedLayout />,
        children: [
            {
                element: <AppShell />,
                children: [
                    { index: true, element: <HomeRedirect /> },

                    { path: "profile", element: <ProfilePage /> },

                    {
                        path: "workspaces",
                        children: [
                            { index: true, element: <WorkspacesPage /> },
                            { path: "new", element: <NewWorkspacePage /> },
                            { path: ":workspaceId/edit", element: <EditWorkspacePage /> },
                        ],
                    },
                    {
                        path: "admin",
                        children: [
                            { path: "users", element: <AdminUsersPage /> },
                            { path: "users/new", element: <NewAdminUserPage /> },
                            { path: "users/:userId/edit", element: <EditAdminUserPage /> },
                        ],
                    },
                    {
                        path: "personal",
                        element: <ScopeLayout scopeType="PERSONAL" />,
                        children: [
                            { index: true, element: <Navigate to="dashboard" replace /> },
                            { path: "dashboard", element: <DashboardPage /> },
                            { path: "ledger", element: <LedgerPage /> },
                            { path: "accounts", element: <AccountsPage /> },
                            { path: "accounts/new", element: <NewAccountPage /> },
                            { path: "accounts/:accountId/edit", element: <EditAccountPage /> },
                            { path: "budgets", element: <BudgetsPage /> },
                            { path: "budgets/new", element: <NewBudgetPage /> },
                            { path: "budgets/:budgetId/edit", element: <EditBudgetPage /> },
                            { path: "members", element: <WorkspaceMembersPage /> },
                            { path: "members/new", element: <NewWorkspaceMemberPage /> },
                            {
                                path: "members/:memberId/edit",
                                element: <EditWorkspaceMemberPage />,
                            },
                            { path: "reconciliation", element: <ReconciliationPage /> },
                            { path: "settings", element: <WorkspaceSettingsPage /> },
                        ],
                    },
                    {
                        path: "w/:workspaceId",
                        element: <ScopeLayout scopeType="WORKSPACE" />,
                        children: [
                            { index: true, element: <Navigate to="dashboard" replace /> },
                            { path: "dashboard", element: <DashboardPage /> },
                            { path: "ledger", element: <LedgerPage /> },
                            { path: "accounts", element: <AccountsPage /> },
                            { path: "accounts/new", element: <NewAccountPage /> },
                            { path: "accounts/:accountId/edit", element: <EditAccountPage /> },
                            { path: "budgets", element: <BudgetsPage /> },
                            { path: "budgets/new", element: <NewBudgetPage /> },
                            { path: "budgets/:budgetId/edit", element: <EditBudgetPage /> },
                            { path: "members", element: <WorkspaceMembersPage /> },
                            { path: "members/new", element: <NewWorkspaceMemberPage /> },
                            {
                                path: "members/:memberId/edit",
                                element: <EditWorkspaceMemberPage />,
                            },
                            { path: "reconciliation", element: <ReconciliationPage /> },
                            { path: "settings", element: <WorkspaceSettingsPage /> },
                        ],
                    },
                ],
            },
        ],
    },

    { path: "*", element: <Navigate to="/app/personal/dashboard" replace /> },
]);
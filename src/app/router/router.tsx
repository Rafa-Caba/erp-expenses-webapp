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
import { CardsPage } from "../../features/cards/pages/CardsPage";
import { NewCardPage } from "../../features/cards/pages/NewCardPage";
import { EditCardPage } from "../../features/cards/pages/EditCardPage";
import { CategoriesPage } from "../../features/categories/pages/CategoriesPage";
import { NewCategoryPage } from "../../features/categories/pages/NewCategoryPage";
import { EditCategoryPage } from "../../features/categories/pages/EditCategoryPage";
import { DebtsPage } from "../../features/debts/pages/DebtsPage";
import { NewDebtPage } from "../../features/debts/pages/NewDebtPage";
import { EditDebtPage } from "../../features/debts/pages/EditDebtPage";
import { PaymentsPage } from "../../features/payments/pages/PaymentsPage";
import { NewPaymentPage } from "../../features/payments/pages/NewPaymentPage";
import { EditPaymentPage } from "../../features/payments/pages/EditPaymentPage";
import { TransactionsPage } from "../../features/transactions/pages/TransactionsPage";
import { NewTransactionPage } from "../../features/transactions/pages/NewTransactionPage";
import { EditTransactionPage } from "../../features/transactions/pages/EditTransactionPage";
import { ReceiptsPage } from "../../features/receipts/pages/ReceiptsPage";
import { NewReceiptPage } from "../../features/receipts/pages/NewReceiptPage";
import { EditReceiptPage } from "../../features/receipts/pages/EditReceiptPage";
import { SavingGoalsPage } from "../../features/savingGoals/pages/SavingGoalsPage";
import { NewSavingGoalPage } from "../../features/savingGoals/pages/NewSavingGoalPage";
import { EditSavingGoalPage } from "../../features/savingGoals/pages/EditSavingGoalPage";
import { RemindersPage } from "../../features/reminders/pages/RemindersPage";
import { NewReminderPage } from "../../features/reminders/pages/NewReminderPage";
import { EditReminderPage } from "../../features/reminders/pages/EditReminderPage";

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
                            { path: "cards", element: <CardsPage /> },
                            { path: "cards/new", element: <NewCardPage /> },
                            { path: "cards/:cardId/edit", element: <EditCardPage /> },
                            { path: "members", element: <WorkspaceMembersPage /> },
                            { path: "members/new", element: <NewWorkspaceMemberPage /> },
                            { path: "categories", element: <CategoriesPage /> },
                            { path: "categories/new", element: <NewCategoryPage /> },
                            { path: "categories/:categoryId/edit", element: <EditCategoryPage /> },
                            {
                                path: "members/:memberId/edit",
                                element: <EditWorkspaceMemberPage />,
                            },
                            { path: "debts", element: <DebtsPage /> },
                            { path: "debts/new", element: <NewDebtPage /> },
                            { path: "debts/:debtId/edit", element: <EditDebtPage /> },
                            { path: "payments", element: <PaymentsPage /> },
                            { path: "payments/new", element: <NewPaymentPage /> },
                            { path: "payments/:paymentId/edit", element: <EditPaymentPage /> },
                            { path: "transactions", element: <TransactionsPage /> },
                            { path: "transactions/new", element: <NewTransactionPage /> },
                            {
                                path: "transactions/:transactionId/edit",
                                element: <EditTransactionPage />,
                            },
                            { path: "receipts", element: <ReceiptsPage /> },
                            { path: "receipts/new", element: <NewReceiptPage /> },
                            { path: "receipts/:receiptId/edit", element: <EditReceiptPage /> },
                            { path: "saving-goals", element: <SavingGoalsPage /> },
                            { path: "saving-goals/new", element: <NewSavingGoalPage /> },
                            {
                                path: "saving-goals/:savingGoalId/edit",
                                element: <EditSavingGoalPage />,
                            },
                            { path: "reconciliation", element: <ReconciliationPage /> },
                            { path: "reminders", element: <RemindersPage /> },
                            { path: "reminders/new", element: <NewReminderPage /> },
                            {
                                path: "reminders/:reminderId/edit",
                                element: <EditReminderPage />,
                            },
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
                            { path: "cards", element: <CardsPage /> },
                            { path: "cards/new", element: <NewCardPage /> },
                            { path: "cards/:cardId/edit", element: <EditCardPage /> },

                            { path: "members", element: <WorkspaceMembersPage /> },
                            { path: "members/new", element: <NewWorkspaceMemberPage /> },
                            {
                                path: "members/:memberId/edit",
                                element: <EditWorkspaceMemberPage />,
                            },
                            { path: "categories", element: <CategoriesPage /> },
                            { path: "categories/new", element: <NewCategoryPage /> },
                            { path: "categories/:categoryId/edit", element: <EditCategoryPage /> },
                            { path: "debts", element: <DebtsPage /> },
                            { path: "debts/new", element: <NewDebtPage /> },
                            { path: "debts/:debtId/edit", element: <EditDebtPage /> },
                            { path: "payments", element: <PaymentsPage /> },
                            { path: "payments/new", element: <NewPaymentPage /> },
                            { path: "payments/:paymentId/edit", element: <EditPaymentPage /> },
                            { path: "transactions", element: <TransactionsPage /> },
                            { path: "transactions/new", element: <NewTransactionPage /> },
                            {
                                path: "transactions/:transactionId/edit",
                                element: <EditTransactionPage />,
                            },
                            { path: "receipts", element: <ReceiptsPage /> },
                            { path: "receipts/new", element: <NewReceiptPage /> },
                            { path: "receipts/:receiptId/edit", element: <EditReceiptPage /> },
                            { path: "saving-goals", element: <SavingGoalsPage /> },
                            { path: "saving-goals/new", element: <NewSavingGoalPage /> },
                            {
                                path: "saving-goals/:savingGoalId/edit",
                                element: <EditSavingGoalPage />,
                            },
                            { path: "reconciliation", element: <ReconciliationPage /> },
                            { path: "reminders", element: <RemindersPage /> },
                            { path: "reminders/new", element: <NewReminderPage /> },
                            {
                                path: "reminders/:reminderId/edit",
                                element: <EditReminderPage />,
                            },
                            { path: "settings", element: <WorkspaceSettingsPage /> },
                        ],
                    },
                ],
            },
        ],
    },

    { path: "*", element: <Navigate to="/app/personal/dashboard" replace /> },
]);
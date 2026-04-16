// src/shared/types/common.types.ts

export type Id = string;
export type IsoDateString = string;
export type Nullable<T> = T | null;

export type CurrencyCode = "MXN" | "USD";

export type UserRole = "USER" | "ADMIN";

export type WorkspaceType = "PERSONAL" | "HOUSEHOLD" | "BUSINESS";
export type WorkspaceVisibility = "PRIVATE" | "SHARED";
export type WorkspaceKind = "INDIVIDUAL" | "COLLABORATIVE";

export type MemberRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
export type MemberStatus = "active" | "invited" | "disabled";

export type WorkspacePermission =
    | "workspace.read"
    | "workspace.update"
    | "workspace.archive"
    | "workspace.settings.read"
    | "workspace.settings.update"
    | "themes.read"
    | "themes.update"
    | "workspace.members.read"
    | "workspace.members.create"
    | "workspace.members.update"
    | "workspace.members.delete"
    | "workspace.members.status.update"
    | "accounts.read"
    | "accounts.create"
    | "accounts.update"
    | "accounts.delete"
    | "categories.read"
    | "categories.create"
    | "categories.update"
    | "categories.delete"
    | "transactions.read"
    | "transactions.create"
    | "transactions.update"
    | "transactions.delete"
    | "budgets.read"
    | "budgets.create"
    | "budgets.update"
    | "budgets.delete"
    | "debts.read"
    | "debts.create"
    | "debts.update"
    | "debts.delete"
    | "debts.pay"
    | "payments.read"
    | "payments.create"
    | "payments.update"
    | "payments.delete"
    | "savingGoals.read"
    | "savingGoals.create"
    | "savingGoals.update"
    | "savingGoals.delete"
    | "reminders.read"
    | "reminders.create"
    | "reminders.update"
    | "reminders.delete"
    | "reports.read"
    | "reports.create"
    | "reports.update"
    | "reports.delete";

export type TransactionType =
    | "expense"
    | "income"
    | "debt_payment"
    | "transfer"
    | "adjustment";
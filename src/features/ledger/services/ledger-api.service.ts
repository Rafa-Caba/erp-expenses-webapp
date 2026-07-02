// src/features/ledger/services/ledger-api.service.ts
// Ledger API composition service.
// It loads the source datasets used to build the ledger view in the frontend.
// Fase 6 note: no API endpoint change is needed here; the transaction service
// already returns transaction.cashflowDirection after the previous phases.

import type { AxiosInstance } from "axios";

import { createAccountService } from "../../accounts/services/account.service";
import { createCategoryService } from "../../categories/services/category.service";
import { createTransactionService } from "../../transactions/services/transaction.service";
import { createWorkspaceMemberService } from "../../workspaces/services/workspace-member.service";
import type { LedgerDataset } from "../types/ledger.types";

export function createLedgerApiService(apiClient: AxiosInstance) {
    const transactionService = createTransactionService(apiClient);
    const accountService = createAccountService(apiClient);
    const categoryService = createCategoryService(apiClient);
    const workspaceMemberService = createWorkspaceMemberService(apiClient);

    return {
        async getLedgerDataset(workspaceId: string): Promise<LedgerDataset> {
            const [transactionsResponse, accountsResponse, categoriesResponse, membersResponse] =
                await Promise.all([
                    transactionService.getTransactions(workspaceId),
                    accountService.getAccounts(workspaceId),
                    categoryService.getCategories(workspaceId),
                    workspaceMemberService.getMembers(workspaceId),
                ]);

            return {
                transactions: transactionsResponse.transactions,
                accounts: accountsResponse.accounts,
                categories: categoriesResponse.categories,
                members: membersResponse.members,
            };
        },
    };
}
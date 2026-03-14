// src/features/cards/pages/CardsPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Page } from "../../../shared/ui/Page/Page";
import { useScopeStore } from "../../../app/scope/scope.store";
import type { ScopeType } from "../../../app/scope/scope.types";
import { useAccountsQuery } from "../../accounts/hooks/useAccountsQuery";
import type { AccountRecord } from "../../accounts/types/account.types";
import { useArchiveCardMutation } from "../hooks/useCardMutations";
import { useCardsQuery } from "../hooks/useCardsQuery";
import { useCardStore } from "../store/card.store";
import type { CardRecord } from "../types/card.types";
import { CardSummaryCard } from "../components/CardSummaryCard";
import { CardsEmptyState } from "../components/CardsEmptyState";
import { CardsToolbar } from "../components/CardsToolbar";
import type { AxiosLikeError } from "../../../shared/types/api.types";

function getCardsBasePath(scopeType: ScopeType, workspaceId: string | null): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/cards";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/cards`;
}

function normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function getCardErrorMessage(error: Error | null, fallbackMessage: string): string {
    if (!error) {
        return fallbackMessage;
    }

    const typedError = error as AxiosLikeError;
    const apiMessage = typedError.response?.data?.message;

    if (typeof apiMessage === "string" && apiMessage.trim().length > 0) {
        return apiMessage;
    }

    if (error.message.trim().length > 0) {
        return error.message;
    }

    return fallbackMessage;
}

export function CardsPage() {
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const searchTerm = useCardStore((state) => state.searchTerm);
    const typeFilter = useCardStore((state) => state.typeFilter);
    const includeArchived = useCardStore((state) => state.includeArchived);
    const includeInactive = useCardStore((state) => state.includeInactive);
    const includeHidden = useCardStore((state) => state.includeHidden);
    const selectedCardId = useCardStore((state) => state.selectedCardId);

    const setSearchTerm = useCardStore((state) => state.setSearchTerm);
    const setTypeFilter = useCardStore((state) => state.setTypeFilter);
    const setIncludeArchived = useCardStore((state) => state.setIncludeArchived);
    const setIncludeInactive = useCardStore((state) => state.setIncludeInactive);
    const setIncludeHidden = useCardStore((state) => state.setIncludeHidden);
    const setSelectedCardId = useCardStore((state) => state.setSelectedCardId);
    const resetCardUi = useCardStore((state) => state.reset);

    const cardsQuery = useCardsQuery(workspaceId);
    const accountsQuery = useAccountsQuery(workspaceId);
    const archiveCardMutation = useArchiveCardMutation();

    const cardsBasePath = getCardsBasePath(scopeType, workspaceId);

    const accountLookup = React.useMemo(() => {
        const accounts = accountsQuery.data?.accounts ?? [];

        return new Map<string, AccountRecord>(
            accounts.map((account: AccountRecord) => [account.id, account])
        );
    }, [accountsQuery.data?.accounts]);

    const filteredCards = React.useMemo(() => {
        const cards = cardsQuery.data?.cards ?? [];
        const normalizedSearchTerm = normalizeText(searchTerm);

        return cards.filter((card: CardRecord) => {
            if (!includeArchived && card.isArchived) {
                return false;
            }

            if (!includeInactive && !card.isActive) {
                return false;
            }

            if (!includeHidden && !card.isVisible) {
                return false;
            }

            if (typeFilter !== "ALL" && card.type !== typeFilter) {
                return false;
            }

            if (!normalizedSearchTerm) {
                return true;
            }

            const relatedAccount = accountLookup.get(card.accountId);

            const searchableText = [
                card.name,
                card.type,
                card.brand ?? "",
                card.last4,
                card.notes ?? "",
                card.accountId,
                card.holderMemberId ?? "",
                relatedAccount?.name ?? "",
            ]
                .join(" ")
                .toLocaleLowerCase();

            return searchableText.includes(normalizedSearchTerm);
        });
    }, [
        accountLookup,
        cardsQuery.data?.cards,
        includeArchived,
        includeHidden,
        includeInactive,
        searchTerm,
        typeFilter,
    ]);

    const hasFilters =
        searchTerm.trim().length > 0 ||
        typeFilter !== "ALL" ||
        includeArchived ||
        includeInactive ||
        includeHidden;

    const handleResetFilters = React.useCallback(() => {
        resetCardUi();
    }, [resetCardUi]);

    const handleEditCard = React.useCallback(
        (card: CardRecord) => {
            setSelectedCardId(card.id);
            navigate(`${cardsBasePath}/${card.id}/edit`);
        },
        [cardsBasePath, navigate, setSelectedCardId]
    );

    const handleArchiveCard = React.useCallback(
        (card: CardRecord) => {
            if (!workspaceId) {
                return;
            }

            const confirmed = window.confirm(
                `¿Seguro que deseas archivar la tarjeta "${card.name}"?`
            );

            if (!confirmed) {
                return;
            }

            setSelectedCardId(card.id);

            archiveCardMutation.mutate({
                workspaceId,
                cardId: card.id,
            });
        },
        [archiveCardMutation, setSelectedCardId, workspaceId]
    );

    if (!workspaceId) {
        return (
            <Page
                title="Tarjetas"
                subtitle="Resolviendo el workspace activo."
            >
                <Alert severity="info">
                    Aún estamos resolviendo el contexto activo del workspace.
                </Alert>
            </Page>
        );
    }

    return (
        <Page
            title="Tarjetas"
            subtitle="Administra tarjetas de débito y crédito enlazadas a las cuentas del workspace activo."
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
            >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Aquí administras las tarjetas que luego podrán relacionarse con movimientos, pagos, estados de cuenta y cortes.
                </Typography>

                <Button variant="contained" onClick={() => navigate(`${cardsBasePath}/new`)}>
                    Nueva tarjeta
                </Button>
            </Stack>

            <CardsToolbar
                searchTerm={searchTerm}
                typeFilter={typeFilter}
                includeArchived={includeArchived}
                includeInactive={includeInactive}
                includeHidden={includeHidden}
                totalCount={filteredCards.length}
                onSearchTermChange={setSearchTerm}
                onTypeFilterChange={setTypeFilter}
                onIncludeArchivedChange={setIncludeArchived}
                onIncludeInactiveChange={setIncludeInactive}
                onIncludeHiddenChange={setIncludeHidden}
                onResetFilters={handleResetFilters}
            />

            {archiveCardMutation.isError ? (
                <Alert severity="error">
                    {getCardErrorMessage(
                        archiveCardMutation.error,
                        "No se pudo archivar la tarjeta."
                    )}
                </Alert>
            ) : null}

            {cardsQuery.isLoading ? (
                <Box
                    sx={{
                        minHeight: 320,
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <CircularProgress />
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                                Cargando tarjetas…
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Obteniendo tarjetas del workspace activo.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            ) : null}

            {!cardsQuery.isLoading && cardsQuery.isError ? (
                <Alert severity="error">
                    {getCardErrorMessage(
                        cardsQuery.error,
                        "No se pudieron cargar las tarjetas."
                    )}
                </Alert>
            ) : null}

            {!cardsQuery.isLoading &&
                !cardsQuery.isError &&
                filteredCards.length === 0 ? (
                <CardsEmptyState
                    hasFilters={hasFilters}
                    onClearFilters={handleResetFilters}
                />
            ) : null}

            {!cardsQuery.isLoading &&
                !cardsQuery.isError &&
                filteredCards.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredCards.map((card: CardRecord) => {
                        const relatedAccount = accountLookup.get(card.accountId);

                        return (
                            <Grid key={card.id} size={{ xs: 12, md: 6, xl: 4 }}>
                                <CardSummaryCard
                                    card={card}
                                    isSelected={selectedCardId === card.id}
                                    accountName={relatedAccount?.name ?? card.accountId}
                                    accountCurrency={relatedAccount?.currency ?? null}
                                    onEdit={handleEditCard}
                                    onArchive={handleArchiveCard}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            ) : null}
        </Page>
    );
}
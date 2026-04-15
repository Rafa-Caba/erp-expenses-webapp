// src/features/reconciliation/components/ReconciliationCardSelect.tsx

import { useId } from "react";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

import { useCardsQuery } from "../../cards/hooks/useCardsQuery";

type ReconciliationCardSelectProps = {
    workspaceId: string | null;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    error?: boolean;
    allowEmpty?: boolean;
    emptyOptionLabel?: string;
};

function buildCardOptionLabel(card: {
    name: string;
    brand: string | null;
    last4: string;
}): string {
    const parts: string[] = [card.name];

    if (card.brand) {
        parts.push(card.brand);
    }

    parts.push(`**** ${card.last4}`);

    return parts.join(" • ");
}

export function ReconciliationCardSelect({
    workspaceId,
    value,
    onChange,
    label = "Tarjeta",
    helperText,
    disabled = false,
    error = false,
    allowEmpty = true,
    emptyOptionLabel = "Sin tarjeta específica",
}: ReconciliationCardSelectProps) {
    const selectId = useId();
    const labelId = `${selectId}-label`;

    const cardsQuery = useCardsQuery(workspaceId);
    const cards = cardsQuery.data?.cards ?? [];

    const hasSelectedCard = cards.some((card) => card.id === value);

    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    const isDisabled = disabled || workspaceId === null || cardsQuery.isLoading;

    const resolvedHelperText = (() => {
        if (workspaceId === null) {
            return "Primero debe existir un workspace activo.";
        }

        if (cardsQuery.isError) {
            return "No se pudieron cargar las tarjetas del workspace.";
        }

        if (cardsQuery.isLoading) {
            return "Cargando tarjetas...";
        }

        if (cards.length === 0) {
            return "No hay tarjetas disponibles en este workspace.";
        }

        return helperText;
    })();

    return (
        <FormControl fullWidth error={error} disabled={isDisabled}>
            <InputLabel id={labelId}>{label}</InputLabel>

            <Select
                labelId={labelId}
                label={label}
                value={value}
                onChange={handleChange}
            >
                {allowEmpty ? <MenuItem value="">{emptyOptionLabel}</MenuItem> : null}

                {!hasSelectedCard && value ? (
                    <MenuItem value={value}>{`Tarjeta actual (${value})`}</MenuItem>
                ) : null}

                {cards.map((card) => (
                    <MenuItem key={card.id} value={card.id}>
                        {buildCardOptionLabel(card)}
                    </MenuItem>
                ))}
            </Select>

            {resolvedHelperText ? <FormHelperText>{resolvedHelperText}</FormHelperText> : null}
        </FormControl>
    );
}
// src/features/cards/components/CardsToolbar.tsx

import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { CardType } from "../types/card.types";

type CardsToolbarProps = {
    searchTerm: string;
    typeFilter: CardType | "ALL";
    includeArchived: boolean;
    includeInactive: boolean;
    includeHidden: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onTypeFilterChange: (value: CardType | "ALL") => void;
    onIncludeArchivedChange: (value: boolean) => void;
    onIncludeInactiveChange: (value: boolean) => void;
    onIncludeHiddenChange: (value: boolean) => void;
    onResetFilters: () => void;
};

export function CardsToolbar({
    searchTerm,
    typeFilter,
    includeArchived,
    includeInactive,
    includeHidden,
    totalCount,
    onSearchTermChange,
    onTypeFilterChange,
    onIncludeArchivedChange,
    onIncludeInactiveChange,
    onIncludeHiddenChange,
    onResetFilters,
}: CardsToolbarProps) {
    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL") {
            onTypeFilterChange("ALL");
            return;
        }

        if (value === "debit" || value === "credit") {
            onTypeFilterChange(value);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Stack spacing={2}>
                <Stack
                    direction={{ xs: "column", lg: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", lg: "center" }}
                >
                    <TextField
                        label="Buscar tarjeta"
                        placeholder="Nombre, marca, últimos 4, notas, cuenta..."
                        value={searchTerm}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                        fullWidth
                    />

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="cards-type-filter-label">Tipo</InputLabel>
                        <Select
                            labelId="cards-type-filter-label"
                            label="Tipo"
                            value={typeFilter}
                            onChange={handleTypeChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="debit">Débito</MenuItem>
                            <MenuItem value="credit">Crédito</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="outlined" onClick={onResetFilters}>
                        Limpiar
                    </Button>
                </Stack>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", md: "center" }}
                >
                    <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={includeArchived}
                                    onChange={(event) =>
                                        onIncludeArchivedChange(event.target.checked)
                                    }
                                />
                            }
                            label="Mostrar archivadas"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={includeInactive}
                                    onChange={(event) =>
                                        onIncludeInactiveChange(event.target.checked)
                                    }
                                />
                            }
                            label="Mostrar inactivas"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={includeHidden}
                                    onChange={(event) =>
                                        onIncludeHiddenChange(event.target.checked)
                                    }
                                />
                            }
                            label="Mostrar ocultas"
                        />
                    </Stack>

                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        {totalCount} tarjeta{totalCount === 1 ? "" : "s"}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
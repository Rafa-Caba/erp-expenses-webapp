// src/features/reminders/components/RemindersToolbar.tsx

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

import type {
    ReminderChannel,
    ReminderStatus,
    ReminderType,
} from "../types/reminder.types";
import {
    getReminderChannelLabel,
    getReminderStatusLabel,
    getReminderTypeLabel,
} from "../utils/reminder-labels";

type RemindersToolbarProps = {
    searchTerm: string;
    statusFilter: ReminderStatus | "ALL";
    typeFilter: ReminderType | "ALL";
    channelFilter: ReminderChannel | "ALL";
    includeHidden: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onStatusFilterChange: (value: ReminderStatus | "ALL") => void;
    onTypeFilterChange: (value: ReminderType | "ALL") => void;
    onChannelFilterChange: (value: ReminderChannel | "ALL") => void;
    onIncludeHiddenChange: (value: boolean) => void;
    onResetFilters: () => void;
};

export function RemindersToolbar({
    searchTerm,
    statusFilter,
    typeFilter,
    channelFilter,
    includeHidden,
    totalCount,
    onSearchTermChange,
    onStatusFilterChange,
    onTypeFilterChange,
    onChannelFilterChange,
    onIncludeHiddenChange,
    onResetFilters,
}: RemindersToolbarProps) {
    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL") {
            onStatusFilterChange("ALL");
            return;
        }

        if (value === "pending" || value === "done" || value === "dismissed") {
            onStatusFilterChange(value);
        }
    };

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL") {
            onTypeFilterChange("ALL");
            return;
        }

        if (
            value === "bill" ||
            value === "debt" ||
            value === "subscription" ||
            value === "custom"
        ) {
            onTypeFilterChange(value);
        }
    };

    const handleChannelChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL") {
            onChannelFilterChange("ALL");
            return;
        }

        if (value === "in_app" || value === "email" || value === "both") {
            onChannelFilterChange(value);
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
                        label="Buscar reminder"
                        placeholder="Título, descripción, tipo, canal, fecha..."
                        value={searchTerm}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                        fullWidth
                    />

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="reminders-status-filter-label">
                            Estado
                        </InputLabel>
                        <Select
                            labelId="reminders-status-filter-label"
                            label="Estado"
                            value={statusFilter}
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="pending">
                                {getReminderStatusLabel("pending")}
                            </MenuItem>
                            <MenuItem value="done">
                                {getReminderStatusLabel("done")}
                            </MenuItem>
                            <MenuItem value="dismissed">
                                {getReminderStatusLabel("dismissed")}
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="reminders-type-filter-label">
                            Tipo
                        </InputLabel>
                        <Select
                            labelId="reminders-type-filter-label"
                            label="Tipo"
                            value={typeFilter}
                            onChange={handleTypeChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="bill">
                                {getReminderTypeLabel("bill")}
                            </MenuItem>
                            <MenuItem value="debt">
                                {getReminderTypeLabel("debt")}
                            </MenuItem>
                            <MenuItem value="subscription">
                                {getReminderTypeLabel("subscription")}
                            </MenuItem>
                            <MenuItem value="custom">
                                {getReminderTypeLabel("custom")}
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="reminders-channel-filter-label">
                            Canal
                        </InputLabel>
                        <Select
                            labelId="reminders-channel-filter-label"
                            label="Canal"
                            value={channelFilter}
                            onChange={handleChannelChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="in_app">
                                {getReminderChannelLabel("in_app")}
                            </MenuItem>
                            <MenuItem value="email">
                                {getReminderChannelLabel("email")}
                            </MenuItem>
                            <MenuItem value="both">
                                {getReminderChannelLabel("both")}
                            </MenuItem>
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
                    <FormControlLabel
                        control={
                            <Switch
                                checked={includeHidden}
                                onChange={(event) =>
                                    onIncludeHiddenChange(event.target.checked)
                                }
                            />
                        }
                        label="Mostrar ocultos"
                    />

                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        {totalCount} reminder{totalCount === 1 ? "" : "s"}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
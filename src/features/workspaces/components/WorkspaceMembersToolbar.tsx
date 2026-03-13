// src/features/workspaces/components/WorkspaceMembersToolbar.tsx

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

import type { MemberRole, MemberStatus } from "../../../shared/types/common.types";

type WorkspaceMembersToolbarProps = {
    searchTerm: string;
    roleFilter: MemberRole | "ALL";
    statusFilter: MemberStatus | "ALL";
    includeHidden: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onRoleFilterChange: (value: MemberRole | "ALL") => void;
    onStatusFilterChange: (value: MemberStatus | "ALL") => void;
    onIncludeHiddenChange: (value: boolean) => void;
    onResetFilters: () => void;
};

export function WorkspaceMembersToolbar({
    searchTerm,
    roleFilter,
    statusFilter,
    includeHidden,
    totalCount,
    onSearchTermChange,
    onRoleFilterChange,
    onStatusFilterChange,
    onIncludeHiddenChange,
    onResetFilters,
}: WorkspaceMembersToolbarProps) {
    const handleRoleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL") {
            onRoleFilterChange("ALL");
            return;
        }

        if (
            value === "OWNER" ||
            value === "ADMIN" ||
            value === "MEMBER" ||
            value === "VIEWER"
        ) {
            onRoleFilterChange(value);
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL") {
            onStatusFilterChange("ALL");
            return;
        }

        if (value === "active" || value === "invited" || value === "disabled") {
            onStatusFilterChange(value);
        }
    };

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                borderRadius: 3,
            }}
        >
            <Stack spacing={2}>
                <Stack
                    direction={{ xs: "column", lg: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", lg: "center" }}
                >
                    <TextField
                        label="Buscar miembro"
                        placeholder="Nombre, userId, rol o notas..."
                        value={searchTerm}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                        fullWidth
                    />

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="workspace-member-role-filter-label">Rol</InputLabel>
                        <Select
                            labelId="workspace-member-role-filter-label"
                            label="Rol"
                            value={roleFilter}
                            onChange={handleRoleChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="OWNER">Owner</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                            <MenuItem value="MEMBER">Miembro</MenuItem>
                            <MenuItem value="VIEWER">Viewer</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="workspace-member-status-filter-label">Estado</InputLabel>
                        <Select
                            labelId="workspace-member-status-filter-label"
                            label="Estado"
                            value={statusFilter}
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="active">Activo</MenuItem>
                            <MenuItem value="invited">Invitado</MenuItem>
                            <MenuItem value="disabled">Deshabilitado</MenuItem>
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
                        {totalCount} miembro{totalCount === 1 ? "" : "s"}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
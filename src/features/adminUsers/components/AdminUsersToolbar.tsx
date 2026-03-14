// src/features/adminUsers/components/AdminUsersToolbar.tsx

import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { UserRole } from "../../../shared/types/common.types";
import type { AdminUsersActiveFilter } from "../store/adminUsers.store";

type AdminUsersToolbarProps = {
    searchTerm: string;
    roleFilter: UserRole | "ALL";
    activeFilter: AdminUsersActiveFilter;
    limit: number;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onRoleFilterChange: (value: UserRole | "ALL") => void;
    onActiveFilterChange: (value: AdminUsersActiveFilter) => void;
    onLimitChange: (value: number) => void;
    onResetFilters: () => void;
};

export function AdminUsersToolbar({
    searchTerm,
    roleFilter,
    activeFilter,
    limit,
    totalCount,
    onSearchTermChange,
    onRoleFilterChange,
    onActiveFilterChange,
    onLimitChange,
    onResetFilters,
}: AdminUsersToolbarProps) {
    const handleRoleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL" || value === "USER" || value === "ADMIN") {
            onRoleFilterChange(value);
        }
    };

    const handleActiveChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "ALL" || value === "ACTIVE" || value === "INACTIVE") {
            onActiveFilterChange(value);
        }
    };

    const handleLimitChange = (event: SelectChangeEvent<string>) => {
        const nextValue = Number(event.target.value);

        if ([10, 25, 50, 100].includes(nextValue)) {
            onLimitChange(nextValue);
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
                        label="Buscar usuario"
                        placeholder="Nombre, email o teléfono..."
                        value={searchTerm}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                        fullWidth
                    />

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="admin-users-role-filter-label">Rol</InputLabel>
                        <Select
                            labelId="admin-users-role-filter-label"
                            label="Rol"
                            value={roleFilter}
                            onChange={handleRoleChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="USER">Usuario</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel id="admin-users-active-filter-label">Estado</InputLabel>
                        <Select
                            labelId="admin-users-active-filter-label"
                            label="Estado"
                            value={activeFilter}
                            onChange={handleActiveChange}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="ACTIVE">Activos</MenuItem>
                            <MenuItem value="INACTIVE">Inactivos</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel id="admin-users-limit-label">Límite</InputLabel>
                        <Select
                            labelId="admin-users-limit-label"
                            label="Límite"
                            value={String(limit)}
                            onChange={handleLimitChange}
                        >
                            <MenuItem value="10">10</MenuItem>
                            <MenuItem value="25">25</MenuItem>
                            <MenuItem value="50">50</MenuItem>
                            <MenuItem value="100">100</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="outlined" onClick={onResetFilters}>
                        Limpiar
                    </Button>
                </Stack>

                <Typography variant="body2" sx={{ opacity: 0.75 }}>
                    {totalCount} usuario{totalCount === 1 ? "" : "s"} en total
                </Typography>
            </Stack>
        </Paper>
    );
}
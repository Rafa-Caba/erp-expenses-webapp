// src/features/components/UserSelect.tsx

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

import type { UserRole } from "../../shared/types/common.types";
import { useAdminUsersQuery } from "../adminUsers/hooks/useAdminUsersQuery";
import type { ListUsersQuery } from "../adminUsers/types/user.types";

type UserSelectActiveFilter = "ALL" | "ACTIVE" | "INACTIVE";

type UserSelectProps = {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    error?: boolean;
    allowEmpty?: boolean;
    emptyOptionLabel?: string;
    roleFilter?: UserRole | "ALL";
    activeFilter?: UserSelectActiveFilter;
    searchTerm?: string;
    limit?: number;
};

export function UserSelect({
    value,
    onChange,
    label = "Usuario",
    helperText,
    disabled = false,
    error = false,
    allowEmpty = true,
    emptyOptionLabel = "Sin usuario específico",
    roleFilter = "ALL",
    activeFilter = "ALL",
    searchTerm = "",
    limit = 100,
}: UserSelectProps) {
    const query = React.useMemo<ListUsersQuery>(() => {
        return {
            page: 1,
            limit,
            search: searchTerm.trim() ? searchTerm.trim() : undefined,
            role: roleFilter === "ALL" ? undefined : roleFilter,
            isActive:
                activeFilter === "ALL"
                    ? undefined
                    : activeFilter === "ACTIVE"
                        ? true
                        : false,
        };
    }, [activeFilter, limit, roleFilter, searchTerm]);

    const usersQuery = useAdminUsersQuery(query);
    const users = usersQuery.data?.items ?? [];

    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    const isDisabled = disabled || usersQuery.isLoading;

    const resolvedHelperText = (() => {
        if (usersQuery.isError) {
            return "No se pudieron cargar los usuarios.";
        }

        if (usersQuery.isLoading) {
            return "Cargando usuarios...";
        }

        if (users.length === 0) {
            return "No hay usuarios disponibles.";
        }

        return helperText;
    })();

    return (
        <FormControl fullWidth error={error} disabled={isDisabled}>
            <InputLabel id="user-select-label">{label}</InputLabel>

            <Select
                labelId="user-select-label"
                label={label}
                value={value}
                onChange={handleChange}
                endAdornment={usersQuery.isLoading ? <CircularProgress size={18} /> : undefined}
            >
                {allowEmpty ? <MenuItem value="">{emptyOptionLabel}</MenuItem> : null}

                {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                        {user.fullName} ({user.email})
                    </MenuItem>
                ))}
            </Select>

            {resolvedHelperText ? <FormHelperText>{resolvedHelperText}</FormHelperText> : null}
        </FormControl>
    );
}
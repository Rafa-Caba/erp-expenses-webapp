// src/features/components/WorkspaceMemberSelect.tsx

import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { useWorkspaceMembersQuery } from "../workspaces/hooks/useWorkspaceMembersQuery";


type WorkspaceMemberSelectProps = {
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

export function WorkspaceMemberSelect({
    workspaceId,
    value,
    onChange,
    label = "Miembro",
    helperText,
    disabled = false,
    error = false,
    allowEmpty = true,
    emptyOptionLabel = "Sin miembro específico",
}: WorkspaceMemberSelectProps) {
    const membersQuery = useWorkspaceMembersQuery(workspaceId);
    const members = membersQuery.data?.members ?? [];

    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    const isDisabled = disabled || workspaceId === null || membersQuery.isLoading;

    const resolvedHelperText = (() => {
        if (workspaceId === null) {
            return "Primero debe existir un workspace activo.";
        }

        if (membersQuery.isError) {
            return "No se pudieron cargar los miembros del workspace.";
        }

        if (membersQuery.isLoading) {
            return "Cargando miembros...";
        }

        if (members.length === 0) {
            return "No hay miembros disponibles en este workspace.";
        }

        return helperText;
    })();

    return (
        <FormControl fullWidth error={error} disabled={isDisabled}>
            <InputLabel id="workspace-member-select-label">{label}</InputLabel>

            <Select
                labelId="workspace-member-select-label"
                label={label}
                value={value}
                onChange={handleChange}
                endAdornment={membersQuery.isLoading ? <CircularProgress size={18} /> : undefined}
            >
                {allowEmpty ? <MenuItem value="">{emptyOptionLabel}</MenuItem> : null}

                {members.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                        {member.displayName}
                    </MenuItem>
                ))}
            </Select>

            {resolvedHelperText ? <FormHelperText>{resolvedHelperText}</FormHelperText> : null}
        </FormControl>
    );
}
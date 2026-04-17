import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
    WORKSPACE_ICON_OPTIONS,
    getWorkspaceIconOptionByValue,
} from "./WorkspaceIconCatalog";

type WorkspaceIconSelectProps = {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    error?: boolean;
    allowEmpty?: boolean;
    emptyOptionLabel?: string;
};

export function WorkspaceIconSelect({
    value,
    onChange,
    label = "Ícono",
    helperText,
    disabled = false,
    error = false,
    allowEmpty = true,
    emptyOptionLabel = "Usar ícono por tipo",
}: WorkspaceIconSelectProps) {
    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    const renderSelectedValue = (selectedValue: string) => {
        if (!selectedValue) {
            return (
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {emptyOptionLabel}
                </Typography>
            );
        }

        const selectedOption = getWorkspaceIconOptionByValue(selectedValue);

        if (!selectedOption) {
            return selectedValue;
        }

        return (
            <Stack direction="row" spacing={1} alignItems="center">
                {selectedOption.icon}
                <Typography variant="body2">{selectedOption.label}</Typography>
            </Stack>
        );
    };

    return (
        <FormControl fullWidth error={error} disabled={disabled}>
            <InputLabel id="workspace-icon-select-label">{label}</InputLabel>

            <Select
                labelId="workspace-icon-select-label"
                label={label}
                value={value}
                onChange={handleChange}
                displayEmpty
                renderValue={renderSelectedValue}
            >
                {allowEmpty ? <MenuItem value="">{emptyOptionLabel}</MenuItem> : null}

                {WORKSPACE_ICON_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            {option.icon}
                            <Typography variant="body2">{option.label}</Typography>
                        </Stack>
                    </MenuItem>
                ))}
            </Select>

            {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
        </FormControl>
    );
}
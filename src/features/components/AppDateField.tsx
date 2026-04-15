// src/features/components/AppDateField.tsx

import React from "react";
import TextField from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";

type AppDateFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    name?: string;
    id?: string;
    helperText?: React.ReactNode;
    error?: boolean;
    disabled?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    min?: string;
    max?: string;
    size?: "small" | "medium";
    sx?: SxProps<Theme>;
};

export function AppDateField({
    label,
    value,
    onChange,
    name,
    id,
    helperText,
    error = false,
    disabled = false,
    required = false,
    fullWidth = true,
    min,
    max,
    size = "medium",
    sx,
}: AppDateFieldProps) {
    return (
        <TextField
            id={id}
            name={name}
            label={label}
            type="date"
            value={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onChange(event.target.value)
            }
            helperText={helperText}
            error={error}
            disabled={disabled}
            required={required}
            fullWidth={fullWidth}
            size={size}
            slotProps={{
                inputLabel: {
                    shrink: true,
                },
                htmlInput: {
                    min,
                    max,
                },
            }}
            sx={sx}
        />
    );
}
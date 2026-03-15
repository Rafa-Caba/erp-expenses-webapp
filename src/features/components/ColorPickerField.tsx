// src/features/components/ColorPickerField.tsx

import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

const DEFAULT_COLOR_PALETTE = [
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#84CC16",
    "#10B981",
    "#06B6D4",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#6B7280",
    "#111827",
] as const;

type ColorPickerFieldProps = {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    error?: boolean;
    allowEmpty?: boolean;
    palette?: readonly string[];
};

function isValidHexColor(value: string): boolean {
    return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value.trim());
}

function getPreviewColor(value: string): string {
    if (isValidHexColor(value)) {
        return value.trim();
    }

    return "#E5E7EB";
}

function getPickerValue(value: string): string {
    if (isValidHexColor(value)) {
        return value.trim();
    }

    return "#6366F1";
}

export function ColorPickerField({
    value,
    onChange,
    label = "Color",
    helperText,
    disabled = false,
    error = false,
    allowEmpty = true,
    palette = DEFAULT_COLOR_PALETTE,
}: ColorPickerFieldProps) {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value.toUpperCase());
    };

    const handlePickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value.toUpperCase());
    };

    const handleOpenPicker = () => {
        inputRef.current?.click();
    };

    const handleClear = () => {
        onChange("");
    };

    return (
        <Stack spacing={1}>
            <TextField
                label={label}
                value={value}
                onChange={handleTextChange}
                placeholder="#6366F1"
                disabled={disabled}
                error={error}
                helperText={helperText}
                fullWidth
                inputProps={{ maxLength: 7 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Box
                                sx={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: "50%",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    bgcolor: getPreviewColor(value),
                                }}
                            />
                        </InputAdornment>
                    ),
                }}
            />

            <input
                ref={inputRef}
                type="color"
                value={getPickerValue(value)}
                onChange={handlePickerChange}
                disabled={disabled}
                style={{ display: "none" }}
            />

            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "stretch", sm: "center" }}
            >
                <Button
                    variant="outlined"
                    onClick={handleOpenPicker}
                    disabled={disabled}
                >
                    Elegir color
                </Button>

                {allowEmpty ? (
                    <Button
                        variant="text"
                        color="inherit"
                        onClick={handleClear}
                        disabled={disabled || value.trim().length === 0}
                    >
                        Limpiar
                    </Button>
                ) : null}
            </Stack>

            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {palette.map((paletteColor) => (
                    <Tooltip key={paletteColor} title={paletteColor}>
                        <span>
                            <IconButton
                                size="small"
                                onClick={() => onChange(paletteColor)}
                                disabled={disabled}
                                aria-label={`Seleccionar color ${paletteColor}`}
                                sx={{
                                    width: 28,
                                    height: 28,
                                    border: "1px solid",
                                    borderColor:
                                        value.trim().toUpperCase() ===
                                            paletteColor.toUpperCase()
                                            ? "text.primary"
                                            : "divider",
                                    bgcolor: paletteColor,
                                    borderRadius: "50%",
                                }}
                            />
                        </span>
                    </Tooltip>
                ))}
            </Stack>
        </Stack>
    );
}
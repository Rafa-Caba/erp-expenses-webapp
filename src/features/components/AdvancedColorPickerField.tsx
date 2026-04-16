// src/features/components/AdvancedColorPickerField.tsx

import React from "react";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

type AdvancedColorPickerFieldProps = {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    error?: boolean;
};

type HsvColor = {
    h: number;
    s: number;
    v: number;
};

type RgbColor = {
    r: number;
    g: number;
    b: number;
};

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function normalizeHex(value: string): string {
    return value.trim().toUpperCase();
}

function isValidHexColor(value: string): boolean {
    return /^#([0-9A-F]{6})$/.test(normalizeHex(value));
}

function componentToHex(value: number): string {
    return clamp(Math.round(value), 0, 255)
        .toString(16)
        .padStart(2, "0")
        .toUpperCase();
}

function rgbToHex(color: RgbColor): string {
    return `#${componentToHex(color.r)}${componentToHex(color.g)}${componentToHex(color.b)}`;
}

function hexToRgb(hex: string): RgbColor {
    const normalizedValue = normalizeHex(hex).replace("#", "");

    return {
        r: parseInt(normalizedValue.slice(0, 2), 16),
        g: parseInt(normalizedValue.slice(2, 4), 16),
        b: parseInt(normalizedValue.slice(4, 6), 16),
    };
}

function rgbToHsv(color: RgbColor): HsvColor {
    const red = color.r / 255;
    const green = color.g / 255;
    const blue = color.b / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;

    let hue = 0;

    if (delta !== 0) {
        if (max === red) {
            hue = ((green - blue) / delta) % 6;
        } else if (max === green) {
            hue = (blue - red) / delta + 2;
        } else {
            hue = (red - green) / delta + 4;
        }
    }

    hue = Math.round(hue * 60);

    if (hue < 0) {
        hue += 360;
    }

    const saturation = max === 0 ? 0 : delta / max;
    const value = max;

    return {
        h: hue,
        s: saturation,
        v: value,
    };
}

function hsvToRgb(color: HsvColor): RgbColor {
    const hue = ((color.h % 360) + 360) % 360;
    const saturation = clamp(color.s, 0, 1);
    const value = clamp(color.v, 0, 1);

    const chroma = value * saturation;
    const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
    const match = value - chroma;

    let redPrime = 0;
    let greenPrime = 0;
    let bluePrime = 0;

    if (hue >= 0 && hue < 60) {
        redPrime = chroma;
        greenPrime = x;
    } else if (hue >= 60 && hue < 120) {
        redPrime = x;
        greenPrime = chroma;
    } else if (hue >= 120 && hue < 180) {
        greenPrime = chroma;
        bluePrime = x;
    } else if (hue >= 180 && hue < 240) {
        greenPrime = x;
        bluePrime = chroma;
    } else if (hue >= 240 && hue < 300) {
        redPrime = x;
        bluePrime = chroma;
    } else {
        redPrime = chroma;
        bluePrime = x;
    }

    return {
        r: Math.round((redPrime + match) * 255),
        g: Math.round((greenPrime + match) * 255),
        b: Math.round((bluePrime + match) * 255),
    };
}

function getSafeHsvFromHex(hex: string): HsvColor {
    if (!isValidHexColor(hex)) {
        return rgbToHsv(hexToRgb("#3B82F6"));
    }

    return rgbToHsv(hexToRgb(hex));
}

export function AdvancedColorPickerField({
    value,
    onChange,
    label = "Color",
    helperText,
    disabled = false,
    error = false,
}: AdvancedColorPickerFieldProps) {
    const saturationRef = React.useRef<HTMLDivElement | null>(null);
    const hueRef = React.useRef<HTMLDivElement | null>(null);

    const [isDraggingSaturation, setIsDraggingSaturation] = React.useState(false);
    const [isDraggingHue, setIsDraggingHue] = React.useState(false);

    const hsvColor = React.useMemo<HsvColor>(() => {
        return getSafeHsvFromHex(value);
    }, [value]);

    const updateHexFromHsv = React.useCallback(
        (nextHsvColor: HsvColor) => {
            const nextHexColor = rgbToHex(hsvToRgb(nextHsvColor));

            if (nextHexColor !== normalizeHex(value)) {
                onChange(nextHexColor);
            }
        },
        [onChange, value]
    );

    const handleTextChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const nextValue = normalizeHex(event.target.value);
            onChange(nextValue);
        },
        [onChange]
    );

    const updateSaturationFromPointer = React.useCallback(
        (clientX: number, clientY: number) => {
            if (!saturationRef.current) {
                return;
            }

            const rect = saturationRef.current.getBoundingClientRect();
            const x = clamp(clientX - rect.left, 0, rect.width);
            const y = clamp(clientY - rect.top, 0, rect.height);

            const nextSaturation = rect.width === 0 ? 0 : x / rect.width;
            const nextValue = rect.height === 0 ? 0 : 1 - y / rect.height;

            updateHexFromHsv({
                h: hsvColor.h,
                s: nextSaturation,
                v: nextValue,
            });
        },
        [hsvColor.h, updateHexFromHsv]
    );

    const updateHueFromPointer = React.useCallback(
        (clientX: number) => {
            if (!hueRef.current) {
                return;
            }

            const rect = hueRef.current.getBoundingClientRect();
            const x = clamp(clientX - rect.left, 0, rect.width);
            const nextHue = rect.width === 0 ? 0 : (x / rect.width) * 360;

            updateHexFromHsv({
                h: nextHue,
                s: hsvColor.s,
                v: hsvColor.v,
            });
        },
        [hsvColor.s, hsvColor.v, updateHexFromHsv]
    );

    React.useEffect(() => {
        if (!isDraggingSaturation && !isDraggingHue) {
            return undefined;
        }

        const handlePointerMove = (event: PointerEvent) => {
            if (disabled) {
                return;
            }

            if (isDraggingSaturation) {
                updateSaturationFromPointer(event.clientX, event.clientY);
            }

            if (isDraggingHue) {
                updateHueFromPointer(event.clientX);
            }
        };

        const handlePointerUp = () => {
            setIsDraggingSaturation(false);
            setIsDraggingHue(false);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [
        disabled,
        isDraggingHue,
        isDraggingSaturation,
        updateHueFromPointer,
        updateSaturationFromPointer,
    ]);

    const saturationThumbLeft = `${hsvColor.s * 100}%`;
    const saturationThumbTop = `${(1 - hsvColor.v) * 100}%`;
    const hueThumbLeft = `${(hsvColor.h / 360) * 100}%`;
    const pureHueColor = rgbToHex(hsvToRgb({ h: hsvColor.h, s: 1, v: 1 }));

    return (
        <Stack spacing={1.25}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {label}
            </Typography>

            <Box
                ref={saturationRef}
                onPointerDown={(event) => {
                    if (disabled) {
                        return;
                    }

                    setIsDraggingSaturation(true);
                    updateSaturationFromPointer(event.clientX, event.clientY);
                }}
                sx={{
                    position: "relative",
                    width: "100%",
                    height: 180,
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: disabled ? "not-allowed" : "crosshair",
                    border: "1px solid",
                    borderColor: error ? "error.main" : "divider",
                    backgroundColor: pureHueColor,
                    backgroundImage: `
                        linear-gradient(to top, #000000, transparent),
                        linear-gradient(to right, #FFFFFF, transparent)
                    `,
                    opacity: disabled ? 0.6 : 1,
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        left: saturationThumbLeft,
                        top: saturationThumbTop,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: "2px solid white",
                        boxShadow: "0 0 0 1px rgba(0,0,0,0.35)",
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                    }}
                />
            </Box>

            <Box
                ref={hueRef}
                onPointerDown={(event) => {
                    if (disabled) {
                        return;
                    }

                    setIsDraggingHue(true);
                    updateHueFromPointer(event.clientX);
                }}
                sx={{
                    position: "relative",
                    width: "100%",
                    height: 18,
                    borderRadius: 999,
                    cursor: disabled ? "not-allowed" : "ew-resize",
                    border: "1px solid",
                    borderColor: error ? "error.main" : "divider",
                    background:
                        "linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)",
                    opacity: disabled ? 0.6 : 1,
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        left: hueThumbLeft,
                        top: "50%",
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: "2px solid white",
                        boxShadow: "0 0 0 1px rgba(0,0,0,0.35)",
                        transform: "translate(-50%, -50%)",
                        bgcolor: isValidHexColor(value) ? value : "#3B82F6",
                        pointerEvents: "none",
                    }}
                />
            </Box>

            <TextField
                label="HEX"
                value={value}
                onChange={handleTextChange}
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
                                    bgcolor: isValidHexColor(value) ? value : "#E5E7EB",
                                }}
                            />
                        </InputAdornment>
                    ),
                }}
            />
        </Stack>
    );
}
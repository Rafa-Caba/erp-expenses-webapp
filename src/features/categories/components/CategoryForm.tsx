// src/features/categories/components/CategoryForm.tsx

import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { CategoryIconSelect } from "../../components/CategoryIconSelect";
import { ColorPickerField } from "../../components/ColorPickerField";
import type { CategoryType } from "../types/category.types";

export type CategoryParentOption = {
    value: string;
    label: string;
};

export type CategoryFormValues = {
    name: string;
    type: CategoryType;
    parentCategoryId: string;
    color: string;
    icon: string;
    description: string;
    sortOrder: string;
    isSystem: boolean;
    isActive: boolean;
    isVisible: boolean;
};

type CategoryFormField = "name" | "type" | "sortOrder" | "color";

type CategoryFormErrors = Partial<Record<CategoryFormField, string>>;

type CategoryFormTextField = "name" | "description" | "sortOrder";

type CategoryFormProps = {
    mode: "create" | "edit";
    initialValues: CategoryFormValues;
    parentCategoryOptions: CategoryParentOption[];
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: CategoryFormValues) => void;
    onCancel: () => void;
};

function validateOptionalIntegerField(value: string, label: string): string | null {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return null;
    }

    const numericValue = Number(trimmedValue);

    if (!Number.isInteger(numericValue)) {
        return `${label} debe ser un número entero.`;
    }

    if (numericValue < 0) {
        return `${label} no puede ser negativo.`;
    }

    return null;
}

function validateOptionalHexColor(value: string): string | null {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return null;
    }

    if (!/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(trimmedValue)) {
        return "El color debe estar en formato HEX, por ejemplo #6366F1.";
    }

    return null;
}

function validateCategoryForm(values: CategoryFormValues): CategoryFormErrors {
    const errors: CategoryFormErrors = {};

    if (!values.name.trim()) {
        errors.name = "El nombre es obligatorio.";
    }

    if (!values.type) {
        errors.type = "El tipo es obligatorio.";
    }

    const sortOrderError = validateOptionalIntegerField(values.sortOrder, "El orden");
    if (sortOrderError) {
        errors.sortOrder = sortOrderError;
    }

    const colorError = validateOptionalHexColor(values.color);
    if (colorError) {
        errors.color = colorError;
    }

    return errors;
}

export function CategoryForm({
    mode,
    initialValues,
    parentCategoryOptions,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: CategoryFormProps) {
    const [values, setValues] = React.useState<CategoryFormValues>(initialValues);
    const [errors, setErrors] = React.useState<CategoryFormErrors>({});

    React.useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const handleTextChange =
        (field: CategoryFormTextField) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
            };

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (value === "EXPENSE" || value === "INCOME" || value === "BOTH") {
            setValues((currentValues) => ({
                ...currentValues,
                type: value,
            }));
        }
    };

    const handleParentCategoryChange = (event: SelectChangeEvent<string>) => {
        setValues((currentValues) => ({
            ...currentValues,
            parentCategoryId: event.target.value,
        }));
    };

    const handleIconChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            icon: value,
        }));
    };

    const handleColorChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            color: value,
        }));
    };

    const handleCheckboxChange =
        (field: "isSystem" | "isActive" | "isVisible") =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.checked,
                }));
            };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateCategoryForm(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        onSubmit(values);
    };

    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {mode === "create" ? "Nueva categoría" : "Editar categoría"}
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Define la categoría, su jerarquía, visibilidad y configuración
                                general dentro del workspace.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? (
                            <Alert severity="error">{submitErrorMessage}</Alert>
                        ) : null}

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Nombre"
                                    value={values.name}
                                    onChange={handleTextChange("name")}
                                    error={Boolean(errors.name)}
                                    helperText={errors.name}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth error={Boolean(errors.type)}>
                                    <InputLabel id="category-type-label">Tipo</InputLabel>
                                    <Select
                                        labelId="category-type-label"
                                        label="Tipo"
                                        value={values.type}
                                        onChange={handleTypeChange}
                                    >
                                        <MenuItem value="EXPENSE">Gasto</MenuItem>
                                        <MenuItem value="INCOME">Ingreso</MenuItem>
                                        <MenuItem value="BOTH">Ambas</MenuItem>
                                    </Select>

                                    {errors.type ? (
                                        <FormHelperText>{errors.type}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="category-parent-label">
                                        Categoría padre
                                    </InputLabel>
                                    <Select
                                        labelId="category-parent-label"
                                        label="Categoría padre"
                                        value={values.parentCategoryId}
                                        onChange={handleParentCategoryChange}
                                    >
                                        <MenuItem value="">Sin categoría padre</MenuItem>

                                        {parentCategoryOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    <FormHelperText>
                                        Opcional. Úsalo para crear jerarquías de categorías.
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <CategoryIconSelect
                                    value={values.icon}
                                    onChange={handleIconChange}
                                    label="Icono"
                                    helperText="Selecciona un icono curado para representar esta categoría en otras vistas."
                                    disabled={isSubmitting}
                                    allowEmpty
                                    emptyOptionLabel="Sin icono"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <ColorPickerField
                                    value={values.color}
                                    onChange={handleColorChange}
                                    label="Color"
                                    helperText={
                                        errors.color ??
                                        "Opcional. Usa picker, paleta rápida o escribe un HEX."
                                    }
                                    disabled={isSubmitting}
                                    error={Boolean(errors.color)}
                                    allowEmpty
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Orden"
                                    value={values.sortOrder}
                                    onChange={handleTextChange("sortOrder")}
                                    error={Boolean(errors.sortOrder)}
                                    helperText={
                                        errors.sortOrder ??
                                        "Opcional. Menor número = mayor prioridad."
                                    }
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Descripción"
                                    value={values.description}
                                    onChange={handleTextChange("description")}
                                    multiline
                                    minRows={3}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={2}
                            flexWrap="wrap"
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={values.isVisible}
                                        onChange={handleCheckboxChange("isVisible")}
                                    />
                                }
                                label="Visible"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={values.isActive}
                                        onChange={handleCheckboxChange("isActive")}
                                    />
                                }
                                label="Activa"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={values.isSystem}
                                        onChange={handleCheckboxChange("isSystem")}
                                        disabled={mode === "edit"}
                                    />
                                }
                                label="De sistema"
                            />
                        </Stack>

                        {mode === "edit" ? (
                            <Typography variant="caption" sx={{ opacity: 0.75 }}>
                                El flag de sistema se muestra solo como referencia en edición.
                            </Typography>
                        ) : null}

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                                Cancelar
                            </Button>

                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {mode === "create"
                                    ? "Crear categoría"
                                    : "Guardar cambios"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
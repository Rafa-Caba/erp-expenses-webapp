// src/features/categories/components/CategoryTypeChip.tsx

import Chip from "@mui/material/Chip";

import type { CategoryType } from "../types/category.types";

type CategoryTypeChipProps = {
    type: CategoryType;
};

function getCategoryTypeLabel(type: CategoryType): string {
    switch (type) {
        case "EXPENSE":
            return "Gasto";
        case "INCOME":
            return "Ingreso";
        case "BOTH":
            return "Ambas";
    }
}

function getCategoryTypeColor(
    type: CategoryType
): "default" | "primary" | "secondary" | "success" | "warning" {
    switch (type) {
        case "EXPENSE":
            return "warning";
        case "INCOME":
            return "success";
        case "BOTH":
            return "primary";
    }
}

export function CategoryTypeChip({ type }: CategoryTypeChipProps) {
    return (
        <Chip
            size="small"
            color={getCategoryTypeColor(type)}
            label={getCategoryTypeLabel(type)}
        />
    );
}
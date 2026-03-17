// src/features/components/WorkspaceCategorySelect.tsx

import { useId, type ReactNode } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalGroceryStoreOutlinedIcon from "@mui/icons-material/LocalGroceryStoreOutlined";
import DirectionsBusOutlinedIcon from "@mui/icons-material/DirectionsBusOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

import type { TransactionType } from "../../shared/types/common.types";
import { useCategoriesQuery } from "../categories/hooks/useCategoriesQuery";
import type {
    CategoryRecord,
    CategoryType,
} from "../categories/types/category.types";

type WorkspaceCategorySelectProps = {
    workspaceId: string | null;
    value: string;
    onChange: (value: string) => void;
    transactionType?: TransactionType | null;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    error?: boolean;
    allowEmpty?: boolean;
    emptyOptionLabel?: string;
};

function normalizeIconKey(value: string | null): string {
    return (value ?? "").trim().toLowerCase();
}

function renderCategoryIcon(iconKey: string | null): ReactNode {
    switch (normalizeIconKey(iconKey)) {
        case "shopping-cart":
            return <ShoppingCartOutlinedIcon fontSize="small" />;

        case "basket":
            return <LocalMallOutlinedIcon fontSize="small" />;

        case "groceries":
            return <LocalGroceryStoreOutlinedIcon fontSize="small" />;

        case "transport":
            return <DirectionsBusOutlinedIcon fontSize="small" />;

        case "car":
        case "auto":
            return <DirectionsCarOutlinedIcon fontSize="small" />;

        case "food":
        case "restaurant":
            return <RestaurantOutlinedIcon fontSize="small" />;

        case "coffee":
        case "cafe":
            return <LocalCafeOutlinedIcon fontSize="small" />;

        case "home":
        case "house":
            return <HomeOutlinedIcon fontSize="small" />;

        case "bills":
        case "receipt":
            return <ReceiptLongOutlinedIcon fontSize="small" />;

        case "health":
        case "medical":
            return <MedicalServicesOutlinedIcon fontSize="small" />;

        case "education":
        case "school":
            return <SchoolOutlinedIcon fontSize="small" />;

        case "fitness":
        case "gym":
            return <FitnessCenterOutlinedIcon fontSize="small" />;

        case "pets":
        case "pet":
            return <PetsOutlinedIcon fontSize="small" />;

        case "travel":
        case "flight":
            return <FlightOutlinedIcon fontSize="small" />;

        case "savings":
        case "saving":
            return <SavingsOutlinedIcon fontSize="small" />;

        case "income":
        case "salary":
        case "money":
            return <PaidOutlinedIcon fontSize="small" />;

        case "gift":
            return <CardGiftcardOutlinedIcon fontSize="small" />;

        case "entertainment":
        case "movie":
            return <MovieOutlinedIcon fontSize="small" />;

        case "other":
            return <MoreHorizOutlinedIcon fontSize="small" />;

        default:
            return <LabelOutlinedIcon fontSize="small" />;
    }
}

function matchesTransactionType(
    categoryType: CategoryType,
    transactionType: TransactionType | null | undefined
): boolean {
    if (!transactionType) {
        return true;
    }

    if (transactionType === "expense") {
        return categoryType === "EXPENSE" || categoryType === "BOTH";
    }

    if (transactionType === "income") {
        return categoryType === "INCOME" || categoryType === "BOTH";
    }

    if (transactionType === "adjustment") {
        return true;
    }

    return true;
}

function buildSortedCategories(
    categories: CategoryRecord[],
    transactionType: TransactionType | null | undefined
): CategoryRecord[] {
    return [...categories]
        .filter((category) => matchesTransactionType(category.type, transactionType))
        .sort((left, right) => {
            if (left.sortOrder !== right.sortOrder) {
                return left.sortOrder - right.sortOrder;
            }

            return left.name.localeCompare(right.name, "es-MX");
        });
}

function getCategoryTypeLabel(type: CategoryType): string {
    switch (type) {
        case "EXPENSE":
            return "Gasto";
        case "INCOME":
            return "Ingreso";
        case "BOTH":
            return "Ambos";
    }
}

function CategoryOptionContent({ category }: { category: CategoryRecord }) {
    return (
        <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
                sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 1.5,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: category.color ?? "action.hover",
                    color: category.color ? "common.white" : "text.secondary",
                    border: "1px solid",
                    borderColor: "divider",
                    flexShrink: 0,
                }}
            >
                {renderCategoryIcon(category.icon)}
            </Box>

            <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                    {category.name}
                </Typography>

                <Typography variant="caption" sx={{ opacity: 0.72 }} noWrap>
                    {getCategoryTypeLabel(category.type)}
                </Typography>
            </Box>
        </Stack>
    );
}

export function WorkspaceCategorySelect({
    workspaceId,
    value,
    onChange,
    transactionType = null,
    label = "Categoría",
    helperText,
    disabled = false,
    error = false,
    allowEmpty = true,
    emptyOptionLabel = "Sin categoría específica",
}: WorkspaceCategorySelectProps) {
    const selectId = useId();
    const labelId = `${selectId}-label`;

    const categoriesQuery = useCategoriesQuery(workspaceId);
    const categories = buildSortedCategories(
        categoriesQuery.data?.categories ?? [],
        transactionType
    );

    const selectedCategory =
        categories.find((category) => category._id === value) ?? null;

    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    const isDisabled = disabled || workspaceId === null || categoriesQuery.isLoading;

    const resolvedHelperText = (() => {
        if (workspaceId === null) {
            return "Primero debe existir un workspace activo.";
        }

        if (categoriesQuery.isError) {
            return "No se pudieron cargar las categorías del workspace.";
        }

        if (categoriesQuery.isLoading) {
            return "Cargando categorías...";
        }

        if (categories.length === 0) {
            return "No hay categorías disponibles para este tipo de transacción.";
        }

        return helperText;
    })();

    return (
        <FormControl fullWidth error={error} disabled={isDisabled}>
            <InputLabel id={labelId}>{label}</InputLabel>

            <Select
                labelId={labelId}
                label={label}
                value={value}
                onChange={handleChange}
                renderValue={(selectedValue) => {
                    if (!selectedValue) {
                        return emptyOptionLabel;
                    }

                    const currentCategory =
                        categories.find((category) => category._id === selectedValue) ??
                        selectedCategory;

                    if (!currentCategory) {
                        return selectedValue;
                    }

                    return <CategoryOptionContent category={currentCategory} />;
                }}
            >
                {allowEmpty ? <MenuItem value="">{emptyOptionLabel}</MenuItem> : null}

                {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                        <CategoryOptionContent category={category} />
                    </MenuItem>
                ))}
            </Select>

            {resolvedHelperText ? (
                <FormHelperText>{resolvedHelperText}</FormHelperText>
            ) : null}
        </FormControl>
    );
}
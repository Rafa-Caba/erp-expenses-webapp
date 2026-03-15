// src/features/categories/components/CategoryCard.tsx

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
    getCategoryIconOptionByValue,
} from "../../components/CategoryIconCatalog";
import type { CategoryRecord } from "../types/category.types";
import { CategoryTypeChip } from "./CategoryTypeChip";

type CategoryCardProps = {
    category: CategoryRecord;
    parentCategoryName: string | null;
    isSelected: boolean;
    onEdit: (category: CategoryRecord) => void;
    onArchive: (category: CategoryRecord) => void;
};

export function CategoryCard({
    category,
    parentCategoryName,
    isSelected,
    onEdit,
    onArchive,
}: CategoryCardProps) {
    const iconOption = getCategoryIconOptionByValue(category.icon);

    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                borderRadius: 3,
                borderColor: isSelected ? "primary.main" : "divider",
                boxShadow: isSelected ? 3 : 0,
            }}
        >
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <CategoryTypeChip type={category.type} />

                    <Chip
                        size="small"
                        variant="outlined"
                        label={category.isVisible ? "Visible" : "Oculta"}
                    />

                    <Chip
                        size="small"
                        color={category.isSystem ? "secondary" : "default"}
                        label={category.isSystem ? "Sistema" : "Personalizada"}
                    />

                    {!category.isActive ? (
                        <Chip size="small" color="warning" label="Inactiva" />
                    ) : null}
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {category.name}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Padre:</strong> {parentCategoryName ?? "Sin categoría padre"}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Orden:</strong> {category.sortOrder}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                        <Typography variant="body2">
                            <strong>Icono:</strong>
                        </Typography>

                        {iconOption ? (
                            <>
                                {iconOption.icon}
                                <Typography variant="body2">{iconOption.label}</Typography>
                            </>
                        ) : (
                            <Typography variant="body2">
                                {category.icon?.trim() ? category.icon : "—"}
                            </Typography>
                        )}
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">
                            <strong>Color:</strong>
                        </Typography>

                        {category.color?.trim() ? (
                            <>
                                <Box
                                    sx={{
                                        width: 18,
                                        height: 18,
                                        borderRadius: "50%",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        bgcolor: category.color,
                                    }}
                                />
                                <Typography variant="body2">{category.color}</Typography>
                            </>
                        ) : (
                            <Typography variant="body2">—</Typography>
                        )}
                    </Stack>

                    <Typography variant="body2">
                        <strong>Descripción:</strong>{" "}
                        {category.description?.trim() ? category.description : "—"}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                <Button variant="outlined" fullWidth onClick={() => onEdit(category)}>
                    Editar
                </Button>

                <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    onClick={() => onArchive(category)}
                >
                    Archivar
                </Button>
            </CardActions>
        </Card>
    );
}
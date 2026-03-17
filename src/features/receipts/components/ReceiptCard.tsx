// src/features/receipts/components/ReceiptCard.tsx

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import type { ReceiptRecord, ReceiptFileType } from "../types/receipt.types";
import { ReceiptFileTypeChip } from "./ReceiptFileTypeChip";

type ReceiptCardProps = {
    receipt: ReceiptRecord;
    isSelected: boolean;
    onEdit: (receipt: ReceiptRecord) => void;
    onDelete: (receipt: ReceiptRecord) => void;
};

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function formatFileSize(value: number | null): string {
    if (value === null || Number.isNaN(value)) {
        return "—";
    }

    if (value < 1024) {
        return `${value} B`;
    }

    const kiloBytes = value / 1024;
    if (kiloBytes < 1024) {
        return `${kiloBytes.toFixed(1)} KB`;
    }

    const megaBytes = kiloBytes / 1024;
    return `${megaBytes.toFixed(1)} MB`;
}

function isImageReceiptFileType(fileType: ReceiptFileType): boolean {
    return (
        fileType === "image/jpeg" ||
        fileType === "image/png" ||
        fileType === "image/webp"
    );
}

function getVisibilityLabel(isVisible: boolean): string {
    return isVisible ? "Visible" : "Oculto";
}

export function ReceiptCard({
    receipt,
    isSelected,
    onEdit,
    onDelete,
}: ReceiptCardProps) {
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
            {isImageReceiptFileType(receipt.fileType) ? (
                <Box
                    component="img"
                    src={receipt.fileUrl}
                    alt={receipt.fileName}
                    sx={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                />
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        height: 180,
                        display: "grid",
                        placeItems: "center",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Stack spacing={1} alignItems="center">
                        <PictureAsPdfOutlinedIcon color="error" sx={{ fontSize: 48 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            PDF
                        </Typography>
                    </Stack>
                </Box>
            )}

            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <ReceiptFileTypeChip fileType={receipt.fileType} />
                    <Chip
                        size="small"
                        variant="outlined"
                        label={getVisibilityLabel(receipt.isVisible)}
                    />
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {receipt.fileName}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Subido:</strong> {formatDate(receipt.uploadedAt)}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Tamaño:</strong> {formatFileSize(receipt.fileSize)}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Transaction ID:</strong> {receipt.transactionId}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Subido por:</strong> {receipt.uploadedByMemberId}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Notas:</strong> {receipt.notes ?? "—"}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1, flexWrap: "wrap" }}>
                <Button
                    variant="outlined"
                    fullWidth
                    component="a"
                    href={receipt.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    Ver archivo
                </Button>

                <Button variant="outlined" fullWidth onClick={() => onEdit(receipt)}>
                    Editar
                </Button>

                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => onDelete(receipt)}
                >
                    Eliminar
                </Button>
            </CardActions>
        </Card>
    );
}
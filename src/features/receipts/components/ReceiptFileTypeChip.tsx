// src/features/receipts/components/ReceiptFileTypeChip.tsx

import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";

import type { ReceiptFileType } from "../types/receipt.types";

type ReceiptFileTypeChipProps = {
    fileType: ReceiptFileType;
};

function getReceiptFileTypeLabel(fileType: ReceiptFileType): string {
    switch (fileType) {
        case "image/jpeg":
            return "JPG";
        case "image/png":
            return "PNG";
        case "image/webp":
            return "WEBP";
        case "application/pdf":
            return "PDF";
    }
}

function getReceiptFileTypeColor(fileType: ReceiptFileType): ChipProps["color"] {
    switch (fileType) {
        case "application/pdf":
            return "error";
        case "image/jpeg":
        case "image/png":
        case "image/webp":
            return "info";
    }
}

export function ReceiptFileTypeChip({ fileType }: ReceiptFileTypeChipProps) {
    return (
        <Chip
            size="small"
            variant="outlined"
            color={getReceiptFileTypeColor(fileType)}
            label={getReceiptFileTypeLabel(fileType)}
        />
    );
}
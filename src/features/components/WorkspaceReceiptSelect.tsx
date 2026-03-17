// src/features/components/WorkspaceReceiptSelect.tsx

import { useId } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useReceiptsQuery } from "../receipts/hooks/useReceiptsQuery";
import type { ReceiptRecord } from "../receipts/types/receipt.types";

type WorkspaceReceiptSelectProps = {
    workspaceId: string | null;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    error?: boolean;
    allowEmpty?: boolean;
    emptyOptionLabel?: string;
    includeHidden?: boolean;
};

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(new Date(value));
}

function getReceiptOptionLabel(receipt: ReceiptRecord): string {
    return [receipt.fileName, formatDate(receipt.uploadedAt)].join(" • ");
}

function buildSortedReceipts(
    receipts: ReceiptRecord[],
    includeHidden: boolean
): ReceiptRecord[] {
    return [...receipts]
        .filter((receipt) => (includeHidden ? true : receipt.isVisible))
        .sort((left, right) => {
            const leftDate = new Date(left.uploadedAt).getTime();
            const rightDate = new Date(right.uploadedAt).getTime();

            return rightDate - leftDate;
        });
}

function ReceiptOptionContent({
    receipt,
}: {
    receipt: ReceiptRecord;
}) {
    return (
        <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                {getReceiptOptionLabel(receipt)}
            </Typography>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 0.25 }}>
                <Typography variant="caption" sx={{ opacity: 0.72 }}>
                    {receipt.fileType}
                </Typography>
            </Stack>
        </Box>
    );
}

export function WorkspaceReceiptSelect({
    workspaceId,
    value,
    onChange,
    label = "Recibo",
    helperText,
    disabled = false,
    error = false,
    allowEmpty = true,
    emptyOptionLabel = "Sin recibo específico",
    includeHidden = true,
}: WorkspaceReceiptSelectProps) {
    const selectId = useId();
    const labelId = `${selectId}-label`;

    const receiptsQuery = useReceiptsQuery(workspaceId);
    const allReceipts = receiptsQuery.data?.receipts ?? [];

    const receipts = buildSortedReceipts(allReceipts, includeHidden);

    const selectedReceipt =
        allReceipts.find((receipt) => receipt._id === value) ?? null;

    const selectedIsInVisibleCollection = receipts.some(
        (receipt) => receipt._id === value
    );

    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    const isDisabled = disabled || workspaceId === null || receiptsQuery.isLoading;

    const resolvedHelperText = (() => {
        if (workspaceId === null) {
            return "Primero debe existir un workspace activo.";
        }

        if (receiptsQuery.isError) {
            return "No se pudieron cargar los recibos del workspace.";
        }

        if (receiptsQuery.isLoading) {
            return "Cargando recibos...";
        }

        if (receipts.length === 0) {
            return "No hay recibos disponibles con los filtros actuales.";
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

                    const currentReceipt =
                        allReceipts.find((receipt) => receipt._id === selectedValue) ??
                        selectedReceipt;

                    if (!currentReceipt) {
                        return selectedValue;
                    }

                    return <ReceiptOptionContent receipt={currentReceipt} />;
                }}
            >
                {allowEmpty ? <MenuItem value="">{emptyOptionLabel}</MenuItem> : null}

                {!selectedIsInVisibleCollection && selectedReceipt ? (
                    <MenuItem value={selectedReceipt._id}>
                        <ReceiptOptionContent receipt={selectedReceipt} />
                    </MenuItem>
                ) : null}

                {receipts.map((receipt) => (
                    <MenuItem key={receipt._id} value={receipt._id}>
                        <ReceiptOptionContent receipt={receipt} />
                    </MenuItem>
                ))}
            </Select>

            {resolvedHelperText ? <FormHelperText>{resolvedHelperText}</FormHelperText> : null}
        </FormControl>
    );
}
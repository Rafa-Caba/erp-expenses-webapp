// src/features/reports/components/ReportStatusChip.tsx

import Chip from "@mui/material/Chip";

import type { ReportStatus } from "../types/report.types";
import { getReportStatusLabel } from "../utils/report-labels";

type ReportStatusChipProps = {
    status: ReportStatus;
};

export function ReportStatusChip({
    status,
}: ReportStatusChipProps) {
    const color =
        status === "generated"
            ? "success"
            : status === "pending"
                ? "warning"
                : status === "failed"
                    ? "error"
                    : "default";

    return <Chip size="small" color={color} label={getReportStatusLabel(status)} />;
}
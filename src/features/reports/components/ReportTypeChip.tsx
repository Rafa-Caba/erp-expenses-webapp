// src/features/reports/components/ReportTypeChip.tsx

import Chip from "@mui/material/Chip";

import type { ReportType } from "../types/report.types";
import { getReportTypeLabel } from "../utils/report-labels";

type ReportTypeChipProps = {
    type: ReportType;
};

export function ReportTypeChip({
    type,
}: ReportTypeChipProps) {
    return (
        <Chip
            size="small"
            variant="outlined"
            label={getReportTypeLabel(type)}
        />
    );
}
// src/features/reports/components/ReportCard.tsx

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useWorkspaceMemberLabelById } from "../../../shared/utils/labels/workspace-member-label.util";
import type { ReportRecord } from "../types/report.types";
import {
    formatReportDate,
    getReportFiltersSummary,
} from "../utils/report-labels";
import { ReportStatusChip } from "./ReportStatusChip";
import { ReportTypeChip } from "./ReportTypeChip";

type ReportCardProps = {
    report: ReportRecord;
    isSelected: boolean;
    onEdit: (report: ReportRecord) => void;
    onDelete: (report: ReportRecord) => void;
};

function getVisibilityLabel(isVisible: boolean): string {
    return isVisible ? "Visible" : "Oculto";
}

function buildFileMetaLabel(report: ReportRecord): string {
    const parts: string[] = [];

    if (report.fileName) {
        parts.push(report.fileName);
    }

    if (report.fileFormat) {
        parts.push(report.fileFormat.toUpperCase());
    }

    return parts.length > 0 ? parts.join(" • ") : "Sin metadata";
}

export function ReportCard({
    report,
    isSelected,
    onEdit,
    onDelete,
}: ReportCardProps) {
    const memberLabel = useWorkspaceMemberLabelById(
        report.workspaceId,
        report.generatedByMemberId
    ).label;

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
                    <ReportTypeChip type={report.type} />
                    <ReportStatusChip status={report.status} />
                    <Chip
                        size="small"
                        variant="outlined"
                        label={getVisibilityLabel(report.isVisible)}
                    />
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {report.name}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        {report.notes ?? "Sin notas"}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Generado:</strong> {formatReportDate(report.generatedAt)}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Creado:</strong> {formatReportDate(report.createdAt)}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                    <Typography variant="body2">
                        <strong>Generado por:</strong> {memberLabel}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Filtros:</strong> {getReportFiltersSummary(report.filters)}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Archivo:</strong>{" "}
                        {report.fileUrl ? (
                            <Link
                                href={report.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {buildFileMetaLabel(report)}
                            </Link>
                        ) : (
                            "Sin archivo"
                        )}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                <Button variant="outlined" fullWidth onClick={() => onEdit(report)}>
                    Editar
                </Button>

                <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    onClick={() => onDelete(report)}
                >
                    Eliminar
                </Button>
            </CardActions>
        </Card>
    );
}
// src/features/reports/utils/report-labels.ts

import type {
    ReportExportFormat,
    ReportFilters,
    ReportGroupBy,
    ReportStatus,
    ReportType,
} from "../types/report.types";

export function getReportTypeLabel(type: ReportType): string {
    switch (type) {
        case "monthly_summary":
            return "Resumen mensual";
        case "category_breakdown":
            return "Desglose por categoría";
        case "debt_report":
            return "Reporte de deudas";
        case "budget_report":
            return "Reporte de presupuestos";
        case "custom":
            return "Personalizado";
    }
}

export function getReportStatusLabel(status: ReportStatus): string {
    switch (status) {
        case "pending":
            return "Pendiente";
        case "generated":
            return "Generado";
        case "failed":
            return "Fallido";
        case "archived":
            return "Archivado";
    }
}

export function getReportGroupByLabel(groupBy: ReportGroupBy): string {
    switch (groupBy) {
        case "day":
            return "Día";
        case "week":
            return "Semana";
        case "month":
            return "Mes";
        case "category":
            return "Categoría";
        case "member":
            return "Miembro";
    }
}

export function getReportExportFormatLabel(format: ReportExportFormat): string {
    switch (format) {
        case "csv":
            return "CSV";
        case "xlsx":
            return "XLSX";
    }
}

export function formatReportDate(value: string | null): string {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(new Date(value));
}

export function formatReportMoney(amount: number, currency: string): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function getReportFiltersSummary(filters: ReportFilters | null): string {
    if (!filters) {
        return "Sin filtros";
    }

    const parts: string[] = [];

    if (filters.dateFrom) {
        parts.push(`Desde: ${formatReportDate(filters.dateFrom)}`);
    }

    if (filters.dateTo) {
        parts.push(`Hasta: ${formatReportDate(filters.dateTo)}`);
    }

    if (filters.currency) {
        parts.push(`Moneda: ${filters.currency}`);
    }

    if (filters.groupBy) {
        parts.push(`Agrupar: ${getReportGroupByLabel(filters.groupBy)}`);
    }

    if (filters.memberId) {
        parts.push("Miembro");
    }

    if (filters.categoryId) {
        parts.push("Categoría");
    }

    if (filters.accountId) {
        parts.push("Cuenta");
    }

    if (filters.cardId) {
        parts.push("Tarjeta");
    }

    if (filters.includeArchived) {
        parts.push("Incluye archivados");
    }

    return parts.length > 0 ? parts.join(" • ") : "Sin filtros";
}
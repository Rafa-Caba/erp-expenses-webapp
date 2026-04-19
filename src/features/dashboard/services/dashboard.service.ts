// src/features/dashboard/services/dashboard.service.ts

import {
    endOfMonth,
    endOfQuarter,
    endOfYear,
    format,
    startOfMonth,
    startOfQuarter,
    startOfYear,
    subDays,
} from "date-fns";

import type { ReminderRecord } from "../../reminders/types/reminder.types";
import type {
    DashboardFilters,
    DashboardHighlight,
    DashboardOverviewData,
    DashboardRemindersSummary,
    DashboardResolvedDateRange,
} from "../types/dashboard.types";
import type { ReportFilters } from "../../reports/types/report.types";
import type { ReconciliationListFilters } from "../../reconciliation/types/reconciliation.types";

function formatDateOnly(value: Date): string {
    return format(value, "yyyy-MM-dd");
}

function formatRangeLabel(dateFrom: string, dateTo: string): string {
    return `${dateFrom} → ${dateTo}`;
}

function toDateStart(value: string): Date {
    return new Date(`${value}T00:00:00.000`);
}

function toDateEnd(value: string): Date {
    return new Date(`${value}T23:59:59.999`);
}

export function resolveDashboardDateRange(
    filters: DashboardFilters
): DashboardResolvedDateRange {
    const today = new Date();

    if (filters.rangePreset === "7d") {
        const dateFrom = formatDateOnly(subDays(today, 6));
        const dateTo = formatDateOnly(today);

        return {
            dateFrom,
            dateTo,
            periodLabel: "Últimos 7 días",
            resolvedGroupBy: filters.groupBy === "auto" ? "day" : filters.groupBy,
        };
    }

    if (filters.rangePreset === "30d") {
        const dateFrom = formatDateOnly(subDays(today, 29));
        const dateTo = formatDateOnly(today);

        return {
            dateFrom,
            dateTo,
            periodLabel: "Últimos 30 días",
            resolvedGroupBy: filters.groupBy === "auto" ? "day" : filters.groupBy,
        };
    }

    if (filters.rangePreset === "month") {
        const dateFrom = formatDateOnly(startOfMonth(today));
        const dateTo = formatDateOnly(endOfMonth(today));

        return {
            dateFrom,
            dateTo,
            periodLabel: "Mes actual",
            resolvedGroupBy: filters.groupBy === "auto" ? "day" : filters.groupBy,
        };
    }

    if (filters.rangePreset === "quarter") {
        const dateFrom = formatDateOnly(startOfQuarter(today));
        const dateTo = formatDateOnly(endOfQuarter(today));

        return {
            dateFrom,
            dateTo,
            periodLabel: "Trimestre actual",
            resolvedGroupBy: filters.groupBy === "auto" ? "week" : filters.groupBy,
        };
    }

    if (filters.rangePreset === "year") {
        const dateFrom = formatDateOnly(startOfYear(today));
        const dateTo = formatDateOnly(endOfYear(today));

        return {
            dateFrom,
            dateTo,
            periodLabel: "Año actual",
            resolvedGroupBy: filters.groupBy === "auto" ? "month" : filters.groupBy,
        };
    }

    const dateFrom = filters.customDateFrom.trim() || formatDateOnly(subDays(today, 29));
    const dateTo = filters.customDateTo.trim() || formatDateOnly(today);

    return {
        dateFrom,
        dateTo,
        periodLabel: `Rango personalizado (${formatRangeLabel(dateFrom, dateTo)})`,
        resolvedGroupBy: filters.groupBy === "auto" ? "day" : filters.groupBy,
    };
}

export function buildDashboardReportFilters(
    filters: DashboardFilters
): ReportFilters {
    const dateRange = resolveDashboardDateRange(filters);

    return {
        dateFrom: dateRange.dateFrom,
        dateTo: dateRange.dateTo,
        currency: filters.currency === "ALL" ? null : filters.currency,
        memberId: filters.memberId.trim() || null,
        categoryId: filters.categoryId.trim() || null,
        accountId: filters.accountId.trim() || null,
        cardId: filters.cardId.trim() || null,
        includeArchived: filters.includeArchived,
        groupBy: dateRange.resolvedGroupBy,
    };
}

export function buildDashboardReconciliationFilters(
    filters: DashboardFilters
): ReconciliationListFilters {
    const dateRange = resolveDashboardDateRange(filters);

    return {
        accountId: filters.accountId.trim(),
        cardId: filters.cardId.trim(),
        memberId: filters.memberId.trim(),
        transactionId: "",
        status: "ALL",
        currency: filters.currency,
        entrySide: "ALL",
        matchMethod: "ALL",
        includeArchived: filters.includeArchived,
        includeInactive: false,
        includeHidden: false,
        transactionDateFrom: "",
        transactionDateTo: "",
        reconciledFrom: dateRange.dateFrom,
        reconciledTo: dateRange.dateTo,
        statementDateFrom: "",
        statementDateTo: "",
    };
}

export function buildDashboardRemindersSummary(
    reminders: ReminderRecord[],
    filters: DashboardFilters
): DashboardRemindersSummary {
    const dateRange = resolveDashboardDateRange(filters);
    const rangeStart = toDateStart(dateRange.dateFrom).getTime();
    const rangeEnd = toDateEnd(dateRange.dateTo).getTime();

    const visibleReminders = reminders.filter((reminder) => reminder.isVisible);
    const scopedReminders = visibleReminders.filter((reminder) => {
        const dueDate = new Date(reminder.dueDate).getTime();

        return dueDate >= rangeStart && dueDate <= rangeEnd;
    });

    const pendingVisible = visibleReminders.filter(
        (reminder) => reminder.status === "pending"
    );

    const nextReminders = [...pendingVisible]
        .sort((left, right) => {
            const leftDate = new Date(left.dueDate).getTime();
            const rightDate = new Date(right.dueDate).getTime();

            return leftDate - rightDate;
        })
        .slice(0, 5);

    const doneCount = scopedReminders.reduce((total, reminder) => {
        return total + reminder.responseSummary.totalDone;
    }, 0);

    const dismissedCount = scopedReminders.reduce((total, reminder) => {
        return total + reminder.responseSummary.totalDismissed;
    }, 0);

    return {
        scopedTotalCount: scopedReminders.length,
        pendingCount: scopedReminders.filter((reminder) => reminder.status === "pending").length,
        doneCount,
        dismissedCount,
        overdueCount: visibleReminders.filter(
            (reminder) => reminder.status === "pending" && reminder.isOverdue
        ).length,
        nextReminders,
    };
}

export function buildDashboardHighlights(
    data: DashboardOverviewData
): DashboardHighlight[] {
    const highlights: DashboardHighlight[] = [];

    if (data.monthlySummary.totals.netBalance > 0) {
        highlights.push({
            id: "net-positive",
            title: "Balance neto positivo",
            description: "Tus ingresos superan gastos, pagos y ajustes del periodo.",
            severity: "success",
        });
    } else if (data.monthlySummary.totals.netBalance < 0) {
        highlights.push({
            id: "net-negative",
            title: "Balance neto negativo",
            description: "El periodo actual va abajo del punto de equilibrio.",
            severity: "warning",
        });
    } else {
        highlights.push({
            id: "net-flat",
            title: "Balance neto neutro",
            description: "El periodo actual está prácticamente en equilibrio.",
            severity: "info",
        });
    }

    if (data.budgetSummary.totals.exceededCount > 0) {
        highlights.push({
            id: "budget-exceeded",
            title: "Presupuestos excedidos",
            description: `${data.budgetSummary.totals.exceededCount} presupuesto(s) ya excedieron su límite.`,
            severity: "warning",
        });
    } else if (data.budgetSummary.totals.alertReachedCount > 0) {
        highlights.push({
            id: "budget-alert",
            title: "Presupuestos en alerta",
            description: `${data.budgetSummary.totals.alertReachedCount} presupuesto(s) están cerca del límite.`,
            severity: "info",
        });
    }

    if (data.debtSummary.counts.overdue > 0) {
        highlights.push({
            id: "overdue-debts",
            title: "Deudas vencidas",
            description: `${data.debtSummary.counts.overdue} deuda(s) aparecen como vencidas.`,
            severity: "warning",
        });
    }

    if (data.reconciliationSummary.exceptionCount > 0) {
        highlights.push({
            id: "reconciliation-exception",
            title: "Conciliaciones con diferencia",
            description: `${data.reconciliationSummary.exceptionCount} conciliación(es) tienen excepción o diferencia.`,
            severity: "warning",
        });
    }

    if (data.reconciliationSummary.unreconciledCount > 0) {
        highlights.push({
            id: "reconciliation-unreconciled",
            title: "Conciliaciones pendientes",
            description: `${data.reconciliationSummary.unreconciledCount} conciliación(es) siguen sin cerrar en el periodo operativo.`,
            severity: "info",
        });
    }

    if (data.remindersSummary.overdueCount > 0) {
        highlights.push({
            id: "reminders-overdue",
            title: "Reminders vencidos",
            description: `Tienes ${data.remindersSummary.overdueCount} reminder(s) pendientes y vencidos.`,
            severity: "warning",
        });
    } else if (data.remindersSummary.pendingCount > 0) {
        highlights.push({
            id: "reminders-pending",
            title: "Reminders pendientes",
            description: `${data.remindersSummary.pendingCount} reminder(s) siguen pendientes dentro del periodo actual.`,
            severity: "info",
        });
    }

    const topCategory = data.categoryBreakdown.categories[0];

    if (topCategory) {
        highlights.push({
            id: "top-category",
            title: "Principal categoría",
            description: `${topCategory.categoryName} concentra ${topCategory.percentageOfTotal.toFixed(1)}% del gasto filtrado.`,
            severity: "info",
        });
    }

    return highlights;
}

export function formatDashboardAmount(
    value: number,
    currency: "ALL" | "MXN" | "USD"
): string {
    if (currency === "ALL") {
        return new Intl.NumberFormat("es-MX", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    }

    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}
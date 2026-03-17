// src/features/reminders/utils/reminder-labels.ts

import type {
    ReminderChannel,
    ReminderPriority,
    ReminderRelatedEntityType,
    ReminderStatus,
    ReminderType,
} from "../types/reminder.types";

export function getReminderTypeLabel(type: ReminderType): string {
    switch (type) {
        case "bill":
            return "Pago";
        case "debt":
            return "Deuda";
        case "subscription":
            return "Suscripción";
        case "custom":
            return "Personalizado";
    }
}

export function getReminderStatusLabel(status: ReminderStatus): string {
    switch (status) {
        case "pending":
            return "Pendiente";
        case "done":
            return "Hecho";
        case "dismissed":
            return "Descartado";
    }
}

export function getReminderPriorityLabel(priority: ReminderPriority | null): string {
    switch (priority) {
        case "low":
            return "Baja";
        case "medium":
            return "Media";
        case "high":
            return "Alta";
        default:
            return "Sin prioridad";
    }
}

export function getReminderChannelLabel(channel: ReminderChannel): string {
    switch (channel) {
        case "in_app":
            return "En app";
        case "email":
            return "Email";
        case "both":
            return "Ambos";
    }
}

export function getReminderRelatedEntityTypeLabel(
    relatedEntityType: ReminderRelatedEntityType
): string {
    switch (relatedEntityType) {
        case "transaction":
            return "Transacción";
        case "receipt":
            return "Recibo";
        case "debt":
            return "Deuda";
        case "payment":
            return "Pago";
        case "budget":
            return "Presupuesto";
        case "saving_goal":
            return "Meta de ahorro";
        case "account":
            return "Cuenta";
        case "card":
            return "Tarjeta";
        case "custom":
            return "Personalizado";
    }
}
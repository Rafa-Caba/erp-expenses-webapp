// src/features/savingGoals/utils/saving-goal-labels.ts

import type { SavingsGoalCategory, SavingsGoalPriority, SavingsGoalStatus } from "../types/saving-goal.types";



export function getSavingsGoalStatusLabel(status: SavingsGoalStatus): string {
    switch (status) {
        case "active":
            return "Activa";
        case "completed":
            return "Completada";
        case "paused":
            return "Pausada";
        case "cancelled":
            return "Cancelada";
    }
}

export function getSavingsGoalPriorityLabel(
    priority: SavingsGoalPriority | null
): string {
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

export function getSavingsGoalCategoryLabel(category: SavingsGoalCategory): string {
    switch (category) {
        case "emergency_fund":
            return "Fondo de emergencia";
        case "vacation":
            return "Vacaciones";
        case "education":
            return "Educación";
        case "home":
            return "Hogar";
        case "car":
            return "Auto";
        case "business":
            return "Negocio";
        case "retirement":
            return "Retiro";
        case "custom":
            return "Personalizada";
    }
}
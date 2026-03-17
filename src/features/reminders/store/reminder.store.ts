// src/features/reminders/store/reminder.store.ts

import { create } from "zustand";

import type {
    ReminderChannel,
    ReminderStatus,
    ReminderType,
} from "../types/reminder.types";

type ReminderStore = {
    searchTerm: string;
    statusFilter: ReminderStatus | "ALL";
    typeFilter: ReminderType | "ALL";
    channelFilter: ReminderChannel | "ALL";
    includeHidden: boolean;
    selectedReminderId: string | null;

    setSearchTerm: (value: string) => void;
    setStatusFilter: (value: ReminderStatus | "ALL") => void;
    setTypeFilter: (value: ReminderType | "ALL") => void;
    setChannelFilter: (value: ReminderChannel | "ALL") => void;
    setIncludeHidden: (value: boolean) => void;
    setSelectedReminderId: (value: string | null) => void;
    reset: () => void;
};

const INITIAL_STATE = {
    searchTerm: "",
    statusFilter: "ALL" as const,
    typeFilter: "ALL" as const,
    channelFilter: "ALL" as const,
    includeHidden: false,
    selectedReminderId: null,
};

export const useReminderStore = create<ReminderStore>((set) => ({
    ...INITIAL_STATE,

    setSearchTerm: (value) =>
        set({
            searchTerm: value,
        }),

    setStatusFilter: (value) =>
        set({
            statusFilter: value,
        }),

    setTypeFilter: (value) =>
        set({
            typeFilter: value,
        }),

    setChannelFilter: (value) =>
        set({
            channelFilter: value,
        }),

    setIncludeHidden: (value) =>
        set({
            includeHidden: value,
        }),

    setSelectedReminderId: (value) =>
        set({
            selectedReminderId: value,
        }),

    reset: () =>
        set({
            ...INITIAL_STATE,
        }),
}));
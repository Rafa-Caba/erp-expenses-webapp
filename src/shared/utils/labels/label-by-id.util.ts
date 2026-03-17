// src/shared/utils/labels/label-by-id.util.ts

export interface LabelByIdResult {
    label: string;
    hasResolvedValue: boolean;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    rawId: string | null;
}

export interface BuildLabelByIdResultInput {
    rawId: string | null;
    resolvedLabel: string | null | undefined;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    fallbackPrefix: string;
}

export function normalizeLabelValue(value: string | null | undefined): string | null {
    if (typeof value !== "string") {
        return null;
    }

    const trimmedValue = value.trim();

    return trimmedValue.length > 0 ? trimmedValue : null;
}

export function buildLabelByIdResult({
    rawId,
    resolvedLabel,
    isLoading,
    isFetching,
    isError,
    fallbackPrefix,
}: BuildLabelByIdResultInput): LabelByIdResult {
    if (!rawId) {
        return {
            label: "—",
            hasResolvedValue: false,
            isLoading,
            isFetching,
            isError,
            rawId: null,
        };
    }

    const normalizedLabel = normalizeLabelValue(resolvedLabel);

    if (normalizedLabel) {
        return {
            label: normalizedLabel,
            hasResolvedValue: true,
            isLoading,
            isFetching,
            isError,
            rawId,
        };
    }

    if (isLoading || isFetching) {
        return {
            label: "Cargando...",
            hasResolvedValue: false,
            isLoading,
            isFetching,
            isError,
            rawId,
        };
    }

    return {
        label: `${fallbackPrefix}: ${rawId}`,
        hasResolvedValue: false,
        isLoading,
        isFetching,
        isError,
        rawId,
    };
}
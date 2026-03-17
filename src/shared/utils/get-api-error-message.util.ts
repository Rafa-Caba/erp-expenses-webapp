// src/shared/utils/get-api-error-message.util.ts

import type {
    ApiErrorResponse,
    ApiValidationErrorResponse,
    ApiValidationIssues,
} from "../types/api.types";

type ApiErrorLike = {
    message?: string;
    response?: {
        data?: ApiErrorResponse | ApiValidationErrorResponse;
    };
} | null;

function normalizeMessage(message: string | undefined): string | null {
    if (!message) {
        return null;
    }

    const trimmedMessage = message.trim();
    return trimmedMessage.length > 0 ? trimmedMessage : null;
}

function isValidationErrorResponse(
    data: ApiErrorResponse | ApiValidationErrorResponse
): data is ApiValidationErrorResponse {
    return "issues" in data;
}

function getFirstValidationIssue(issues: ApiValidationIssues): string | null {
    for (const formError of issues.formErrors) {
        const normalizedFormError = normalizeMessage(formError);

        if (normalizedFormError) {
            return normalizedFormError;
        }
    }

    for (const fieldName in issues.fieldErrors) {
        const fieldMessages = issues.fieldErrors[fieldName] ?? [];

        for (const fieldMessage of fieldMessages) {
            const normalizedFieldMessage = normalizeMessage(fieldMessage);

            if (normalizedFieldMessage) {
                return normalizedFieldMessage;
            }
        }
    }

    return null;
}

export function getApiErrorMessage(
    error: ApiErrorLike,
    fallbackMessage: string
): string {
    if (!error) {
        return fallbackMessage;
    }

    const responseData = error.response?.data;

    if (responseData) {
        const responseMessage = normalizeMessage(responseData.message);

        if (responseMessage) {
            return responseMessage;
        }

        if (isValidationErrorResponse(responseData)) {
            const firstValidationIssue = getFirstValidationIssue(responseData.issues);

            if (firstValidationIssue) {
                return firstValidationIssue;
            }
        }
    }

    const errorMessage = normalizeMessage(error.message);

    if (errorMessage) {
        return errorMessage;
    }

    return fallbackMessage;
}
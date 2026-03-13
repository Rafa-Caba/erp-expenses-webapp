// src/receipts/receipts/types/receipt.types.ts

import type { IsoDateString, Nullable } from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";

export type ReceiptFileType =
    | "image/jpeg"
    | "image/png"
    | "image/webp"
    | "application/pdf";

export interface ReceiptRecord {
    _id: string;
    workspaceId: string;
    transactionId: string;
    fileUrl: string;
    fileName: string;
    fileType: ReceiptFileType;
    fileSize: Nullable<number>;
    filePublicId: Nullable<string>;
    uploadedByMemberId: string;
    notes: Nullable<string>;
    isVisible: boolean;
    uploadedAt: IsoDateString;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface CreateReceiptPayload {
    transactionId: string;
    uploadedByMemberId: string;
    notes?: Nullable<string>;
    isVisible?: boolean;
    uploadedAt?: string;
}

export interface UpdateReceiptPayload {
    transactionId?: string;
    uploadedByMemberId?: string;
    notes?: Nullable<string>;
    isVisible?: boolean;
    uploadedAt?: string;
}

export type ReceiptsResponse = CollectionResponse<"receipts", ReceiptRecord>;
export type ReceiptResponse = EntityResponse<"receipt", ReceiptRecord>;
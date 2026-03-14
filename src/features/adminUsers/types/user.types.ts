// src/features/adminUsers/types/user.types.ts

import type { ApiMessageResponse, PaginationMeta } from "../../../shared/types/api.types";
import type { IsoDateString, Nullable, UserRole } from "../../../shared/types/common.types";

export interface UserRecord {
    id: string;
    fullName: string;
    email: string;
    phone: Nullable<string>;
    avatarUrl: Nullable<string>;
    role: UserRole;
    isActive: boolean;
    isEmailVerified: boolean;
    lastLoginAt: Nullable<IsoDateString>;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface CreateUserPayload {
    fullName: string;
    email: string;
    password: string;
    phone?: Nullable<string>;
    avatarUrl?: Nullable<string>;
    role?: UserRole;
    isActive?: boolean;
    isEmailVerified?: boolean;
}

export interface UpdateUserPayload {
    fullName?: string;
    email?: string;
    phone?: Nullable<string>;
    avatarUrl?: Nullable<string>;
    role?: UserRole;
    isActive?: boolean;
    isEmailVerified?: boolean;
}

export interface ListUsersQuery {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    role?: UserRole;
}

export interface UserListResponse {
    items: UserRecord[];
    pagination: PaginationMeta;
}

export interface DeleteUserResponse extends ApiMessageResponse {
    id: string;
}
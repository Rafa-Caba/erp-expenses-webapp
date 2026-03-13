// src/workspaces/types/workspace-member.types.ts

import type {
    IsoDateString,
    MemberRole,
    MemberStatus,
    Nullable,
    WorkspacePermission,
} from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";

export interface WorkspaceMemberRecord {
    id: string;
    workspaceId: string;
    userId: string;
    displayName: string;
    role: MemberRole;
    permissions: WorkspacePermission[];
    status: MemberStatus;
    joinedAt: Nullable<IsoDateString>;
    invitedByUserId: Nullable<string>;
    notes: Nullable<string>;
    isVisible: boolean;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface CreateWorkspaceMemberPayload {
    userId: string;
    displayName: string;
    role: MemberRole;
    permissions?: WorkspacePermission[];
    status?: MemberStatus;
    joinedAt?: string;
    notes?: string;
    isVisible?: boolean;
}

export interface UpdateWorkspaceMemberPayload {
    displayName?: string;
    role?: MemberRole;
    permissions?: WorkspacePermission[];
    notes?: string;
    isVisible?: boolean;
}

export interface UpdateWorkspaceMemberStatusPayload {
    status: MemberStatus;
    joinedAt?: string;
}

export type WorkspaceMembersResponse = CollectionResponse<"members", WorkspaceMemberRecord>;
export type WorkspaceMemberResponse = EntityResponse<"member", WorkspaceMemberRecord>;
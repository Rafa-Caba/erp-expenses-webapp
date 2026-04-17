import Avatar from "@mui/material/Avatar";
import type { SxProps, Theme } from "@mui/material/styles";

import type { WorkspaceType } from "../../shared/types/common.types";
import {
    getWorkspaceColorWithFallback,
    getWorkspaceIconOptionByValue,
    getWorkspaceIconValueWithFallback,
} from "./WorkspaceIconCatalog";

type WorkspaceIconBadgeProps = {
    workspaceType: WorkspaceType;
    iconValue?: string | null;
    colorValue?: string | null;
    size?: number;
    sx?: SxProps<Theme>;
};

export function WorkspaceIconBadge({
    workspaceType,
    iconValue,
    colorValue,
    size = 32,
    sx,
}: WorkspaceIconBadgeProps) {
    const resolvedIconValue = getWorkspaceIconValueWithFallback(iconValue, workspaceType);
    const resolvedColorValue = getWorkspaceColorWithFallback(colorValue, workspaceType);
    const iconOption = getWorkspaceIconOptionByValue(resolvedIconValue);

    return (
        <Avatar
            variant="rounded"
            sx={[
                {
                    width: size,
                    height: size,
                    bgcolor: `${resolvedColorValue}22`,
                    color: resolvedColorValue,
                    border: "1px solid",
                    borderColor: `${resolvedColorValue}66`,
                    "& .MuiSvgIcon-root": {
                        fontSize: Math.max(18, Math.round(size * 0.55)),
                    },
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            {iconOption?.icon ?? null}
        </Avatar>
    );
}
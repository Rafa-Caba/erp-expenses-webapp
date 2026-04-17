// src/features/components/UserAvatar.tsx

import React from "react";
import Avatar from "@mui/material/Avatar";
import type { SxProps, Theme } from "@mui/material/styles";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

type UserAvatarProps = {
    fullName?: string | null;
    avatarUrl?: string | null;
    cacheKey?: string | null;
    size?: number;
    sx?: SxProps<Theme>;
};

function getUserInitials(fullName: string | null | undefined): string {
    if (!fullName || fullName.trim().length === 0) {
        return "";
    }

    const parts = fullName
        .trim()
        .split(/\s+/)
        .filter((part) => part.length > 0);

    if (parts.length === 0) {
        return "";
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 1).toUpperCase();
    }

    return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

function buildAvatarSrc(
    avatarUrl: string | null | undefined,
    cacheKey: string | null | undefined
): string | undefined {
    if (!avatarUrl || avatarUrl.trim().length === 0) {
        return undefined;
    }

    const trimmedUrl = avatarUrl.trim();

    if (!cacheKey || cacheKey.trim().length === 0) {
        return trimmedUrl;
    }

    const separator = trimmedUrl.includes("?") ? "&" : "?";

    return `${trimmedUrl}${separator}v=${encodeURIComponent(cacheKey)}`;
}

export function UserAvatar({
    fullName,
    avatarUrl,
    cacheKey,
    size = 38,
    sx,
}: UserAvatarProps) {
    const [imageFailed, setImageFailed] = React.useState(false);

    React.useEffect(() => {
        setImageFailed(false);
    }, [avatarUrl, cacheKey]);

    const avatarSrc = imageFailed ? undefined : buildAvatarSrc(avatarUrl, cacheKey);
    const initials = getUserInitials(fullName);

    return (
        <Avatar
            variant="rounded"
            src={avatarSrc}
            alt={fullName ?? "Usuario"}
            imgProps={{
                referrerPolicy: "no-referrer",
                onError: () => {
                    setImageFailed(true);
                },
            }}
            sx={[
                {
                    width: size,
                    height: size,
                    bgcolor: avatarSrc ? "transparent" : "primary.main",
                    color: avatarSrc ? "inherit" : "primary.contrastText",
                    border: "1px solid",
                    borderColor: avatarSrc ? "divider" : "primary.main",
                    fontWeight: 800,
                    fontSize: Math.max(14, Math.round(size * 0.34)),
                    "& .MuiAvatar-img": {
                        objectFit: "cover",
                    },
                    "& .MuiSvgIcon-root": {
                        fontSize: Math.max(18, Math.round(size * 0.52)),
                    },
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            {avatarSrc ? null : initials || <PersonOutlineRoundedIcon fontSize="small" />}
        </Avatar>
    );
}
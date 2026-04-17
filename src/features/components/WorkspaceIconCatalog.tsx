import type { ReactElement } from "react";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import FamilyRestroomOutlinedIcon from "@mui/icons-material/FamilyRestroomOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";

import type { WorkspaceType } from "../../shared/types/common.types";

export type WorkspaceIconOption = {
    value: string;
    label: string;
    icon: ReactElement;
};

export const WORKSPACE_ICON_OPTIONS: readonly WorkspaceIconOption[] = [
    {
        value: "person",
        label: "Personal",
        icon: <PersonOutlineOutlinedIcon fontSize="small" />,
    },
    {
        value: "home",
        label: "Hogar",
        icon: <HomeOutlinedIcon fontSize="small" />,
    },
    {
        value: "family",
        label: "Familia",
        icon: <FamilyRestroomOutlinedIcon fontSize="small" />,
    },
    {
        value: "apartment",
        label: "Departamento",
        icon: <ApartmentOutlinedIcon fontSize="small" />,
    },
    {
        value: "business",
        label: "Negocio",
        icon: <BusinessCenterOutlinedIcon fontSize="small" />,
    },
    {
        value: "store",
        label: "Tienda",
        icon: <StorefrontOutlinedIcon fontSize="small" />,
    },
    {
        value: "team",
        label: "Equipo",
        icon: <GroupsOutlinedIcon fontSize="small" />,
    },
    {
        value: "wallet",
        label: "Finanzas",
        icon: <AccountBalanceWalletOutlinedIcon fontSize="small" />,
    },
    {
        value: "savings",
        label: "Ahorro",
        icon: <SavingsOutlinedIcon fontSize="small" />,
    },
    {
        value: "growth",
        label: "Crecimiento",
        icon: <AutoGraphOutlinedIcon fontSize="small" />,
    },
    {
        value: "school",
        label: "Escuela",
        icon: <SchoolOutlinedIcon fontSize="small" />,
    },
    {
        value: "travel",
        label: "Viajes",
        icon: <TravelExploreOutlinedIcon fontSize="small" />,
    },
    {
        value: "other",
        label: "Otro",
        icon: <CategoryOutlinedIcon fontSize="small" />,
    },
] as const;

export function getWorkspaceIconOptionByValue(
    value: string | null | undefined
): WorkspaceIconOption | null {
    if (!value) {
        return null;
    }

    return WORKSPACE_ICON_OPTIONS.find((option) => option.value === value) ?? null;
}

export function getDefaultWorkspaceIconValue(workspaceType: WorkspaceType | null | undefined): string {
    switch (workspaceType) {
        case "PERSONAL":
            return "person";
        case "HOUSEHOLD":
            return "home";
        case "BUSINESS":
            return "business";
        default:
            return "other";
    }
}

export function getWorkspaceIconValueWithFallback(
    iconValue: string | null | undefined,
    workspaceType: WorkspaceType | null | undefined
): string {
    if (iconValue?.trim()) {
        return iconValue;
    }

    return getDefaultWorkspaceIconValue(workspaceType);
}

export function getDefaultWorkspaceColor(workspaceType: WorkspaceType | null | undefined): string {
    switch (workspaceType) {
        case "PERSONAL":
            return "#3B82F6";
        case "HOUSEHOLD":
            return "#22C55E";
        case "BUSINESS":
            return "#F59E0B";
        default:
            return "#64748B";
    }
}

export function getWorkspaceColorWithFallback(
    colorValue: string | null | undefined,
    workspaceType: WorkspaceType | null | undefined
): string {
    if (colorValue?.trim()) {
        return colorValue.trim().toUpperCase();
    }

    return getDefaultWorkspaceColor(workspaceType);
}
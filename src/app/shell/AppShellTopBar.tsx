// src/app/shell/AppShellTopBar.tsx

import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import { UserAvatar } from "../../features/components/UserAvatar";
import { WorkspaceIconBadge } from "../../features/components/WorkspaceIconBadge";
import { ReminderBellMenu } from "../../features/reminders/components/ReminderBellMenu";
import type { WorkspaceListItem } from "../../features/workspaces/types/workspace.types";
import { ScopeSwitcher } from "./ScopeSwitcher";

type AppShellTopBarProps = {
    isMobile: boolean;
    isDesktopSidebarCollapsed: boolean;
    headerTitle: string;
    activeWorkspace: WorkspaceListItem | null;
    workspaceId: string | null;
    remindersBasePath: string;
    canAccessAdminUsers: boolean;
    isAdminUsersRoute: boolean;
    accountMenuAnchorEl: HTMLElement | null;
    accountMenuOpen: boolean;
    fullName: string | null | undefined;
    avatarUrl: string | null | undefined;
    avatarCacheKey: string | null | undefined;
    isLoggingOut: boolean;
    onOpenMobileDrawer: () => void;
    onToggleDesktopSidebar: () => void;
    onNavigateToAdminUsers: () => void;
    onOpenAccountMenu: (event: React.MouseEvent<HTMLElement>) => void;
    onCloseAccountMenu: () => void;
    onOpenMobileAccountDrawer: () => void;
    onNavigateToProfile: () => void;
    onOpenThemeDialog: () => void;
    onLogout: () => void;
};

export function AppShellTopBar({
    isMobile,
    isDesktopSidebarCollapsed,
    headerTitle,
    activeWorkspace,
    workspaceId,
    remindersBasePath,
    canAccessAdminUsers,
    isAdminUsersRoute,
    accountMenuAnchorEl,
    accountMenuOpen,
    fullName,
    avatarUrl,
    avatarCacheKey,
    isLoggingOut,
    onOpenMobileDrawer,
    onToggleDesktopSidebar,
    onNavigateToAdminUsers,
    onOpenAccountMenu,
    onCloseAccountMenu,
    onOpenMobileAccountDrawer,
    onNavigateToProfile,
    onOpenThemeDialog,
    onLogout,
}: AppShellTopBarProps) {
    return (
        <AppBar position="fixed" sx={{ zIndex: (muiTheme) => muiTheme.zIndex.drawer + 1 }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                    {isMobile ? (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={onOpenMobileDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <Tooltip
                            title={
                                isDesktopSidebarCollapsed
                                    ? "Expandir menú"
                                    : "Colapsar menú"
                            }
                        >
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={onToggleDesktopSidebar}
                            >
                                {isDesktopSidebarCollapsed ? (
                                    <KeyboardDoubleArrowRightIcon />
                                ) : (
                                    <KeyboardDoubleArrowLeftIcon />
                                )}
                            </IconButton>
                        </Tooltip>
                    )}

                    {activeWorkspace ? (
                        <WorkspaceIconBadge
                            workspaceType={activeWorkspace.type}
                            iconValue={activeWorkspace.icon}
                            colorValue={activeWorkspace.color}
                            size={30}
                        />
                    ) : null}

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            minWidth: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {headerTitle}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                    {!isMobile ? (
                        <>
                            <ReminderBellMenu
                                workspaceId={workspaceId}
                                remindersPath={remindersBasePath}
                            />

                            <ScopeSwitcher />

                            {canAccessAdminUsers ? (
                                <Button
                                    color="inherit"
                                    variant={isAdminUsersRoute ? "contained" : "outlined"}
                                    size="small"
                                    onClick={onNavigateToAdminUsers}
                                    startIcon={<AdminPanelSettingsOutlinedIcon />}
                                >
                                    Usuarios
                                </Button>
                            ) : null}

                            <Tooltip title="Cuenta">
                                <IconButton color="inherit" onClick={onOpenAccountMenu}>
                                    <UserAvatar
                                        fullName={fullName}
                                        avatarUrl={avatarUrl}
                                        cacheKey={avatarCacheKey}
                                        size={45}
                                        sx={{
                                            bgcolor: "transparent",
                                            borderColor: "currentColor",
                                            color: "inherit",
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>

                            <Menu
                                anchorEl={accountMenuAnchorEl}
                                open={accountMenuOpen}
                                onClose={onCloseAccountMenu}
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                transformOrigin={{ vertical: "top", horizontal: "right" }}
                                PaperProps={{
                                    sx: {
                                        mt: 1,
                                        minWidth: 240,
                                        borderRadius: 3,
                                    },
                                }}
                            >
                                <MenuItem onClick={onNavigateToProfile}>
                                    <ListItemIcon>
                                        <PersonOutlineIcon fontSize="small" />
                                    </ListItemIcon>
                                    Perfil
                                </MenuItem>

                                <MenuItem
                                    onClick={onOpenThemeDialog}
                                    disabled={workspaceId === null}
                                >
                                    <ListItemIcon>
                                        <PaletteOutlinedIcon fontSize="small" />
                                    </ListItemIcon>
                                    Tema
                                </MenuItem>

                                <Divider />

                                <MenuItem
                                    onClick={onLogout}
                                    disabled={isLoggingOut}
                                >
                                    <ListItemIcon>
                                        <LogoutRoundedIcon fontSize="small" />
                                    </ListItemIcon>
                                    {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <ReminderBellMenu
                                workspaceId={workspaceId}
                                remindersPath={remindersBasePath}
                            />

                            <Tooltip title="Cuenta">
                                <IconButton
                                    color="inherit"
                                    onClick={onOpenMobileAccountDrawer}
                                >
                                    <UserAvatar
                                        fullName={fullName}
                                        avatarUrl={avatarUrl}
                                        cacheKey={avatarCacheKey}
                                        size={45}
                                        sx={{
                                            bgcolor: "transparent",
                                            borderColor: "currentColor",
                                            color: "inherit",
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
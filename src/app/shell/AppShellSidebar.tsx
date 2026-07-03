// src/app/shell/AppShellSidebar.tsx
// Sidebar for the app shell.
// Fixes context label overflow by constraining width, adding ellipsis,
// and exposing the full context in a tooltip.

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";

import { WorkspaceIconBadge } from "../../features/components/WorkspaceIconBadge";
import type { WorkspaceListItem } from "../../features/workspaces/types/workspace.types";
import type { NavItem } from "./AppShell.types";

type AppShellSidebarProps = {
    isMobile: boolean;
    isDesktopSidebarCollapsed: boolean;
    activeWorkspace: WorkspaceListItem | null;
    contextLabel: string;
    compactContextLabel: string;
    allItems: NavItem[];
    onNavigateItemClick: () => void;
};

function getContextDisplayLabel(args: {
    isMobile: boolean;
    isDesktopSidebarCollapsed: boolean;
    contextLabel: string;
    compactContextLabel: string;
}): string {
    if (args.isDesktopSidebarCollapsed || args.isMobile) {
        return args.isMobile ? args.contextLabel : args.compactContextLabel;
    }

    return `Contexto: ${args.contextLabel}`;
}

export function AppShellSidebar({
    isMobile,
    isDesktopSidebarCollapsed,
    activeWorkspace,
    contextLabel,
    compactContextLabel,
    allItems,
    onNavigateItemClick,
}: AppShellSidebarProps) {
    const renderNavItem = (item: NavItem) => {
        const isCollapsed = !isMobile && isDesktopSidebarCollapsed;

        const navButton = (
            <ListItemButton
                key={item.label}
                component={NavLink}
                to={item.to}
                onClick={onNavigateItemClick}
                sx={{
                    minHeight: 48,
                    px: isCollapsed ? 1.5 : 2,
                    justifyContent: isCollapsed ? "center" : "initial",
                    borderRadius: 2,
                    mx: 1,
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: isCollapsed ? 0 : 2,
                        justifyContent: "center",
                    }}
                >
                    {item.icon}
                </ListItemIcon>

                {!isCollapsed ? <ListItemText primary={item.label} /> : null}
            </ListItemButton>
        );

        if (isCollapsed) {
            return (
                <Tooltip key={item.label} title={item.label} placement="right">
                    {navButton}
                </Tooltip>
            );
        }

        return navButton;
    };

    const expandedContextDisplayLabel = getContextDisplayLabel({
        isMobile,
        isDesktopSidebarCollapsed,
        contextLabel,
        compactContextLabel,
    });

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Toolbar
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        isDesktopSidebarCollapsed && !isMobile ? "center" : "flex-start",
                    gap: 1,
                    px: isDesktopSidebarCollapsed && !isMobile ? 1 : 2,
                }}
            >
                {!isDesktopSidebarCollapsed || isMobile ? (
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Expenses App
                    </Typography>
                ) : (
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        ERP
                    </Typography>
                )}
            </Toolbar>

            <Divider />

            <Box
                sx={{
                    px: isDesktopSidebarCollapsed && !isMobile ? 1 : 2,
                    py: 1,
                    display: "flex",
                    justifyContent:
                        isDesktopSidebarCollapsed && !isMobile ? "center" : "flex-start",
                    width: "100%",
                    minWidth: 0,
                    overflow: "hidden",
                }}
            >
                {activeWorkspace ? (
                    isDesktopSidebarCollapsed && !isMobile ? (
                        <Tooltip title={contextLabel} placement="right">
                            <Box>
                                <WorkspaceIconBadge
                                    workspaceType={activeWorkspace.type}
                                    iconValue={activeWorkspace.icon}
                                    colorValue={activeWorkspace.color}
                                    size={30}
                                />
                            </Box>
                        </Tooltip>
                    ) : (
                        <Tooltip title={expandedContextDisplayLabel} placement="right">
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{
                                    minWidth: 0,
                                    width: "100%",
                                    maxWidth: "100%",
                                    overflow: "hidden",
                                }}
                            >
                                <Box sx={{ flexShrink: 0 }}>
                                    <WorkspaceIconBadge
                                        workspaceType={activeWorkspace.type}
                                        iconValue={activeWorkspace.icon}
                                        colorValue={activeWorkspace.color}
                                        size={28}
                                    />
                                </Box>

                                <Badge
                                    color="primary"
                                    variant="standard"
                                    sx={{
                                        minWidth: 0,
                                        maxWidth: "100%",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            opacity: 0.85,
                                            display: "block",
                                            minWidth: 0,
                                            maxWidth: "100%",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {expandedContextDisplayLabel}
                                    </Typography>
                                </Badge>
                            </Stack>
                        </Tooltip>
                    )
                ) : (
                    <Tooltip title={expandedContextDisplayLabel} placement="right">
                        <Badge
                            color="primary"
                            variant="standard"
                            sx={{
                                minWidth: 0,
                                maxWidth: "100%",
                                overflow: "hidden",
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    opacity: 0.85,
                                    display: "block",
                                    minWidth: 0,
                                    maxWidth: "100%",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {expandedContextDisplayLabel}
                            </Typography>
                        </Badge>
                    </Tooltip>
                )}
            </Box>

            <Divider />

            <List sx={{ flex: 1, pt: 1 }}>
                {allItems.map((item) => renderNavItem(item))}
            </List>

            <Divider />

            <Box
                sx={{
                    p: isDesktopSidebarCollapsed && !isMobile ? 1 : 2,
                    textAlign: isDesktopSidebarCollapsed && !isMobile ? "center" : "left",
                }}
            >
                {!isDesktopSidebarCollapsed || isMobile ? (
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        ERP de gastos • Ledger • Conciliación
                    </Typography>
                ) : (
                    <Tooltip title="ERP de gastos • Ledger • Conciliación" placement="right">
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                            ERP
                        </Typography>
                    </Tooltip>
                )}
            </Box>
        </Box>
    );
}
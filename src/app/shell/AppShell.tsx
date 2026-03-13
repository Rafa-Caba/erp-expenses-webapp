// src/app/shell/AppShell.tsx

import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import SavingsIcon from "@mui/icons-material/Savings";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { useLogoutMutation } from "../../features/auth/hooks/useAuthMutations";
import type { WorkspaceListItem } from "../../features/workspaces/types/workspace.types";
import { useScopeStore } from "../scope/scope.store";
import { ScopeSwitcher } from "./ScopeSwitcher";
import { useMyWorkspacesQuery } from "../../features/workspaces/hooks/useWorkspacesQuery";

const drawerWidth = 280;

type NavItem = {
    label: string;
    to: string;
    icon: React.ReactNode;
    showInBottom: boolean;
};

function getWorkspaceTypeLabel(workspaceType: "PERSONAL" | "HOUSEHOLD" | "BUSINESS"): string {
    switch (workspaceType) {
        case "PERSONAL":
            return "Personal";
        case "HOUSEHOLD":
            return "Casa";
        case "BUSINESS":
            return "Negocio";
    }
}

export function AppShell() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const logoutMutation = useLogoutMutation();

    const location = useLocation();
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const { data } = useMyWorkspacesQuery();

    const workspaces: WorkspaceListItem[] = data?.workspaces ?? [];

    const personalWorkspace: WorkspaceListItem | null =
        workspaces.find((workspace: WorkspaceListItem) => workspace.type === "PERSONAL") ?? null;

    const activeWorkspace: WorkspaceListItem | null =
        scopeType === "PERSONAL"
            ? personalWorkspace
            : workspaces.find((workspace: WorkspaceListItem) => workspace.id === workspaceId) ?? null;

    const scopeBase =
        scopeType === "PERSONAL"
            ? "/app/personal"
            : workspaceId
                ? `/app/w/${workspaceId}`
                : "/app/personal";

    const scopedNavItems: NavItem[] = [
        {
            label: "Dashboard",
            to: `${scopeBase}/dashboard`,
            icon: <DashboardIcon />,
            showInBottom: true,
        },
        {
            label: "Ledger",
            to: `${scopeBase}/ledger`,
            icon: <ReceiptLongIcon />,
            showInBottom: true,
        },
        {
            label: "Cuentas",
            to: `${scopeBase}/accounts`,
            icon: <AccountBalanceWalletIcon />,
            showInBottom: true,
        },
        {
            label: "Presupuestos",
            to: `${scopeBase}/budgets`,
            icon: <SavingsIcon />,
            showInBottom: false,
        },
        {
            label: "Miembros",
            to: `${scopeBase}/members`,
            icon: <PeopleAltIcon />,
            showInBottom: false,
        },
        {
            label: "Conciliación",
            to: `${scopeBase}/reconciliation`,
            icon: <FactCheckIcon />,
            showInBottom: true,
        },
        {
            label: "Ajustes",
            to: `${scopeBase}/settings`,
            icon: <SettingsIcon />,
            showInBottom: true,
        },
    ];

    const globalNavItems: NavItem[] = [
        {
            label: "Workspaces",
            to: "/app/workspaces",
            icon: <GroupWorkIcon />,
            showInBottom: false,
        },
    ];

    const allItems = [...scopedNavItems, ...globalNavItems];

    const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

    const contextLabel =
        activeWorkspace === null
            ? scopeType === "PERSONAL"
                ? "Personal"
                : "Workspace"
            : activeWorkspace.type === "PERSONAL"
                ? "Personal"
                : `${getWorkspaceTypeLabel(activeWorkspace.type)}: ${activeWorkspace.name}`;

    const headerTitle =
        scopeType === "PERSONAL"
            ? "Panel personal"
            : activeWorkspace === null
                ? "Panel de workspace"
                : activeWorkspace.type === "HOUSEHOLD"
                    ? "Panel de casa"
                    : "Panel de negocio";

    const showBottomNavigation = !location.pathname.startsWith("/app/workspaces");

    const currentBottomValue = React.useMemo(() => {
        const bottomItems = scopedNavItems.filter((item) => item.showInBottom);
        const hitIndex = bottomItems.findIndex((item) =>
            location.pathname.startsWith(item.to)
        );

        return hitIndex === -1 ? 0 : hitIndex;
    }, [location.pathname, scopedNavItems]);

    const drawerContent = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Toolbar sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Expenses App
                </Typography>
            </Toolbar>

            <Divider />

            <Box sx={{ px: 2, py: 1 }}>
                <Badge color="primary" variant="standard">
                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        Contexto: {contextLabel}
                    </Typography>
                </Badge>
            </Box>

            <Divider />

            <List sx={{ flex: 1 }}>
                {allItems.map((item) => (
                    <ListItemButton
                        key={item.label}
                        component={NavLink}
                        to={item.to}
                        onClick={() => setMobileDrawerOpen(false)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>

            <Divider />

            <Box sx={{ p: 2 }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    ERP de gastos • Ledger • Conciliación
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100dvh", bgcolor: "background.default" }}>
            <AppBar position="fixed" sx={{ zIndex: (muiTheme) => muiTheme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={() => setMobileDrawerOpen(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}

                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {headerTitle}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ScopeSwitcher />

                        <Button
                            color="inherit"
                            variant="outlined"
                            size="small"
                            onClick={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}
                        >
                            Cerrar sesión
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileDrawerOpen}
                    onClose={() => setMobileDrawerOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Toolbar />

                <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, pb: isMobile ? 10 : 3 }}>
                    <Outlet />
                </Box>

                {isMobile && showBottomNavigation && (
                    <Box
                        sx={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            borderTop: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <BottomNavigation
                            showLabels
                            value={currentBottomValue}
                            onChange={(_, nextValue: number) => {
                                const bottomItems = scopedNavItems.filter(
                                    (item) => item.showInBottom
                                );
                                const targetItem = bottomItems[nextValue] ?? bottomItems[0];

                                navigate(targetItem.to);
                            }}
                        >
                            {scopedNavItems
                                .filter((item) => item.showInBottom)
                                .map((item) => (
                                    <BottomNavigationAction
                                        key={item.label}
                                        label={item.label}
                                        icon={item.icon}
                                    />
                                ))}
                        </BottomNavigation>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
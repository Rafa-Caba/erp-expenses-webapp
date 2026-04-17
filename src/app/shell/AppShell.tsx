// src/app/shell/AppShell.tsx

import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SavingsIcon from "@mui/icons-material/Savings";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { useAuthStore } from "../../features/auth/store/auth.store";
import { useLogoutMutation } from "../../features/auth/hooks/useAuthMutations";
import { ThemeSelectionDialog } from "../../features/themes/components/ThemeSelectionDialog";
import { useThemesQuery } from "../../features/themes/hooks/useThemesQuery";
import type { ThemeKey, ThemeRecord } from "../../features/themes/types/theme.types";
import { useUpdateWorkspaceSettingsMutation } from "../../features/workspaceSettings/hooks/useWorkspaceSettingsMutations";
import { useWorkspaceSettingsQuery } from "../../features/workspaceSettings/hooks/useWorkspaceSettingsQuery";
import { useMyWorkspacesQuery } from "../../features/workspaces/hooks/useWorkspacesQuery";
import type { WorkspaceListItem } from "../../features/workspaces/types/workspace.types";
import { useScopeStore } from "../scope/scope.store";
import { AppShellAccountPanel } from "./AppShellAccountPanel";
import { AppShellSidebar } from "./AppShellSidebar";
import { AppShellTopBar } from "./AppShellTopBar";
import type { NavItem } from "./AppShell.types";
import {
    getRemindersBasePath,
    getThemeLabel,
    getWorkspaceTypeLabel,
} from "./AppShell.utils";
import Toolbar from "@mui/material/Toolbar";

const drawerWidthExpanded = 280;
const drawerWidthCollapsed = 88;
const accountDrawerWidth = 300;
const mobileBottomNavigationHeight = 72;
const mobileBottomContentSpacing = 28;

export function AppShell() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const logoutMutation = useLogoutMutation();
    const authUser = useAuthStore((state) => state.user);

    const location = useLocation();
    const navigate = useNavigate();

    const scopeType = useScopeStore((state) => state.scopeType);
    const workspaceId = useScopeStore((state) => state.workspaceId);
    const workspaceType = useScopeStore((state) => state.workspaceType);

    const workspacesQuery = useMyWorkspacesQuery();
    const workspaceSettingsQuery = useWorkspaceSettingsQuery(workspaceId);
    const themesQuery = useThemesQuery(workspaceId);
    const updateWorkspaceSettingsMutation = useUpdateWorkspaceSettingsMutation();

    const workspaces: WorkspaceListItem[] = workspacesQuery.data?.workspaces ?? [];

    const personalWorkspace: WorkspaceListItem | null =
        workspaces.find((workspace) => workspace.type === "PERSONAL") ?? null;

    const activeWorkspace: WorkspaceListItem | null =
        scopeType === "PERSONAL"
            ? personalWorkspace
            : workspaces.find((workspace) => workspace.id === workspaceId) ?? null;

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
            label: "Tarjetas",
            to: `${scopeBase}/cards`,
            icon: <CreditCardIcon />,
            showInBottom: false,
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
            label: "Categorías",
            to: `${scopeBase}/categories`,
            icon: <LabelOutlinedIcon />,
            showInBottom: false,
        },
        {
            label: "Deudas",
            to: `${scopeBase}/debts`,
            icon: <RequestQuoteOutlinedIcon />,
            showInBottom: false,
        },
        {
            label: "Pagos",
            to: `${scopeBase}/payments`,
            icon: <PaymentsOutlinedIcon />,
            showInBottom: false,
        },
        {
            label: "Transacciones",
            to: `${scopeBase}/transactions`,
            icon: <SwapHorizOutlinedIcon />,
            showInBottom: false,
        },
        {
            label: "Recibos",
            to: `${scopeBase}/receipts`,
            icon: <ReceiptLongOutlinedIcon />,
            showInBottom: false,
        },
        {
            label: "Metas de ahorro",
            to: `${scopeBase}/saving-goals`,
            icon: <SavingsIcon />,
            showInBottom: false,
        },
        {
            label: "Conciliación",
            to: `${scopeBase}/reconciliation`,
            icon: <FactCheckIcon />,
            showInBottom: true,
        },
        {
            label: "Reminders",
            to: `${scopeBase}/reminders`,
            icon: <NotificationsActiveOutlinedIcon />,
            showInBottom: false,
        },
        {
            label: "Reportes",
            to: `${scopeBase}/reports`,
            icon: <AssessmentOutlinedIcon />,
            showInBottom: false,
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
    const [mobileAccountDrawerOpen, setMobileAccountDrawerOpen] = React.useState(false);
    const [accountMenuAnchorEl, setAccountMenuAnchorEl] =
        React.useState<HTMLElement | null>(null);
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
        React.useState(false);
    const [themeDialogOpen, setThemeDialogOpen] = React.useState(false);
    const [selectedThemeKey, setSelectedThemeKey] = React.useState<ThemeKey>("dark");

    const accountMenuOpen = Boolean(accountMenuAnchorEl);
    const currentDrawerWidth = isDesktopSidebarCollapsed
        ? drawerWidthCollapsed
        : drawerWidthExpanded;

    const availableThemes: ThemeRecord[] = themesQuery.data?.themes ?? [];
    const currentThemeKey: ThemeKey = React.useMemo(() => {
        const workspaceTheme = workspaceSettingsQuery.data?.settings.theme;

        if (
            workspaceTheme === "dark" ||
            workspaceTheme === "light" ||
            workspaceTheme === "customizable"
        ) {
            return workspaceTheme;
        }

        return "dark";
    }, [workspaceSettingsQuery.data?.settings.theme]);

    React.useEffect(() => {
        setSelectedThemeKey(currentThemeKey);
    }, [currentThemeKey]);

    React.useEffect(() => {
        if (updateWorkspaceSettingsMutation.isSuccess && themeDialogOpen) {
            setThemeDialogOpen(false);
        }
    }, [themeDialogOpen, updateWorkspaceSettingsMutation.isSuccess]);

    const contextLabel =
        activeWorkspace === null
            ? scopeType === "PERSONAL"
                ? "Personal"
                : workspaceType === "HOUSEHOLD"
                    ? "Casa"
                    : workspaceType === "BUSINESS"
                        ? "Negocio"
                        : "Workspace"
            : activeWorkspace.type === "PERSONAL"
                ? "Personal"
                : `${getWorkspaceTypeLabel(activeWorkspace.type)}: ${activeWorkspace.name}`;

    const compactContextLabel =
        activeWorkspace === null
            ? scopeType === "PERSONAL"
                ? "PERSONAL"
                : workspaceType === "HOUSEHOLD"
                    ? "CASA"
                    : workspaceType === "BUSINESS"
                        ? "NEGOCIO"
                        : "WORKSPACE"
            : activeWorkspace.type === "PERSONAL"
                ? "PERSONAL"
                : activeWorkspace.type === "HOUSEHOLD"
                    ? "CASA"
                    : activeWorkspace.type === "BUSINESS"
                        ? "NEGOCIO"
                        : "WORKSPACE";

    const headerTitle =
        scopeType === "PERSONAL"
            ? "Panel personal"
            : activeWorkspace === null
                ? "Panel de workspace"
                : activeWorkspace.type === "HOUSEHOLD"
                    ? "Panel de casa"
                    : "Panel de negocio";

    const isGlobalSection =
        location.pathname.startsWith("/app/workspaces") ||
        location.pathname.startsWith("/app/admin") ||
        location.pathname.startsWith("/app/profile");

    const showBottomNavigation = !isGlobalSection;
    const isAdminUsersRoute = location.pathname.startsWith("/app/admin/users");

    const currentBottomValue = React.useMemo(() => {
        const bottomItems = scopedNavItems.filter((item) => item.showInBottom);
        const hitIndex = bottomItems.findIndex((item) =>
            location.pathname.startsWith(item.to)
        );

        return hitIndex === -1 ? 0 : hitIndex;
    }, [location.pathname, scopedNavItems]);

    const canAccessAdminUsers = authUser?.role === "ADMIN";
    const remindersBasePath = getRemindersBasePath(scopeType, workspaceId);

    const handleOpenAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAccountMenuAnchorEl(event.currentTarget);
    };

    const handleCloseAccountMenu = () => {
        setAccountMenuAnchorEl(null);
    };

    const handleOpenMobileAccountDrawer = () => {
        setMobileAccountDrawerOpen(true);
    };

    const handleCloseMobileAccountDrawer = () => {
        setMobileAccountDrawerOpen(false);
    };

    const handleNavigateToAdminUsers = () => {
        handleCloseAccountMenu();
        handleCloseMobileAccountDrawer();
        navigate("/app/admin/users");
    };

    const handleNavigateToProfile = () => {
        handleCloseAccountMenu();
        handleCloseMobileAccountDrawer();
        navigate("/app/profile");
    };

    const handleLogout = () => {
        handleCloseAccountMenu();
        handleCloseMobileAccountDrawer();
        logoutMutation.mutate();
    };

    const handleOpenThemeDialog = () => {
        updateWorkspaceSettingsMutation.reset();
        setSelectedThemeKey(currentThemeKey);
        handleCloseAccountMenu();
        handleCloseMobileAccountDrawer();
        setThemeDialogOpen(true);
    };

    const handleCloseThemeDialog = () => {
        if (updateWorkspaceSettingsMutation.isPending) {
            return;
        }

        updateWorkspaceSettingsMutation.reset();
        setThemeDialogOpen(false);
    };

    const handleSaveTheme = () => {
        if (!workspaceId) {
            return;
        }

        updateWorkspaceSettingsMutation.mutate({
            workspaceId,
            payload: {
                theme: selectedThemeKey,
            },
        });
    };

    const mobileContentPaddingBottom = showBottomNavigation
        ? `calc(${mobileBottomNavigationHeight}px + env(safe-area-inset-bottom, 0px) + ${mobileBottomContentSpacing}px)`
        : "24px";

    return (
        <Box
            sx={{
                display: "flex",
                height: "100dvh",
                maxHeight: "100dvh",
                bgcolor: "background.default",
                overflow: "hidden",
            }}
        >
            <AppShellTopBar
                isMobile={isMobile}
                isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
                headerTitle={headerTitle}
                activeWorkspace={activeWorkspace}
                workspaceId={workspaceId}
                remindersBasePath={remindersBasePath}
                canAccessAdminUsers={canAccessAdminUsers}
                isAdminUsersRoute={isAdminUsersRoute}
                accountMenuAnchorEl={accountMenuAnchorEl}
                accountMenuOpen={accountMenuOpen}
                fullName={authUser?.fullName}
                avatarUrl={authUser?.avatarUrl}
                avatarCacheKey={authUser?.updatedAt}
                isLoggingOut={logoutMutation.isPending}
                onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
                onToggleDesktopSidebar={() =>
                    setIsDesktopSidebarCollapsed((currentValue) => !currentValue)
                }
                onNavigateToAdminUsers={handleNavigateToAdminUsers}
                onOpenAccountMenu={handleOpenAccountMenu}
                onCloseAccountMenu={handleCloseAccountMenu}
                onOpenMobileAccountDrawer={handleOpenMobileAccountDrawer}
                onNavigateToProfile={handleNavigateToProfile}
                onOpenThemeDialog={handleOpenThemeDialog}
                onLogout={handleLogout}
            />

            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: currentDrawerWidth,
                        flexShrink: 0,
                        transition: theme.transitions.create("width", {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.standard,
                        }),
                        "& .MuiDrawer-paper": {
                            width: currentDrawerWidth,
                            boxSizing: "border-box",
                            overflowX: "hidden",
                            transition: theme.transitions.create("width", {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.standard,
                            }),
                        },
                    }}
                >
                    <AppShellSidebar
                        isMobile={isMobile}
                        isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
                        activeWorkspace={activeWorkspace}
                        contextLabel={contextLabel}
                        compactContextLabel={compactContextLabel}
                        allItems={allItems}
                        onNavigateItemClick={() => setMobileDrawerOpen(false)}
                    />
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
                            width: drawerWidthExpanded,
                        },
                    }}
                >
                    <AppShellSidebar
                        isMobile={isMobile}
                        isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
                        activeWorkspace={activeWorkspace}
                        contextLabel={contextLabel}
                        compactContextLabel={compactContextLabel}
                        allItems={allItems}
                        onNavigateItemClick={() => setMobileDrawerOpen(false)}
                    />
                </Drawer>
            )}

            {isMobile && (
                <Drawer
                    anchor="right"
                    variant="temporary"
                    open={mobileAccountDrawerOpen}
                    onClose={handleCloseMobileAccountDrawer}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: accountDrawerWidth,
                            maxWidth: "80vw",
                        },
                    }}
                >
                    <AppShellAccountPanel
                        fullName={authUser?.fullName}
                        avatarUrl={authUser?.avatarUrl}
                        avatarCacheKey={authUser?.updatedAt}
                        workspaceId={workspaceId}
                        currentThemeLabel={getThemeLabel(currentThemeKey)}
                        canAccessAdminUsers={canAccessAdminUsers}
                        isAdminUsersRoute={isAdminUsersRoute}
                        isLoggingOut={logoutMutation.isPending}
                        onNavigateToProfile={handleNavigateToProfile}
                        onOpenThemeDialog={handleOpenThemeDialog}
                        onNavigateToAdminUsers={handleNavigateToAdminUsers}
                        onLogout={handleLogout}
                    />
                </Drawer>
            )}

            <ThemeSelectionDialog
                open={themeDialogOpen}
                availableThemes={availableThemes}
                selectedThemeKey={selectedThemeKey}
                currentThemeKey={currentThemeKey}
                isLoading={themesQuery.isLoading || workspaceSettingsQuery.isLoading}
                isSaving={updateWorkspaceSettingsMutation.isPending}
                errorMessage={
                    updateWorkspaceSettingsMutation.isError
                        ? updateWorkspaceSettingsMutation.error.message
                        : null
                }
                successMessage={
                    updateWorkspaceSettingsMutation.isSuccess
                        ? updateWorkspaceSettingsMutation.data.message
                        : null
                }
                onClose={handleCloseThemeDialog}
                onSelect={setSelectedThemeKey}
                onSave={handleSaveTheme}
            />

            <Box
                component="main"
                sx={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                <Toolbar />

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: 0,
                        overflowY: "auto",
                        overflowX: "hidden",
                        WebkitOverflowScrolling: "touch",
                        p: { xs: 2, md: 3 },
                        pb: isMobile ? mobileContentPaddingBottom : 3,
                        scrollPaddingBottom: isMobile ? mobileContentPaddingBottom : 24,
                        boxSizing: "border-box",
                    }}
                >
                    <Outlet />

                    {isMobile && showBottomNavigation ? (
                        <Box
                            aria-hidden
                            sx={{
                                height: `calc(${mobileBottomNavigationHeight}px + env(safe-area-inset-bottom, 0px) + ${mobileBottomContentSpacing}px)`,
                                flexShrink: 0,
                            }}
                        />
                    ) : null}
                </Box>

                {isMobile && showBottomNavigation && (
                    <Box
                        sx={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: theme.zIndex.appBar,
                            borderTop: "1px solid",
                            borderColor: "divider",
                            bgcolor: "background.paper",
                            pb: "env(safe-area-inset-bottom, 0px)",
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
                            sx={{
                                height: mobileBottomNavigationHeight,
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
import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SavingsIcon from "@mui/icons-material/Savings";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import { WorkspaceIconBadge } from "../../features/components/WorkspaceIconBadge";
import { useLogoutMutation } from "../../features/auth/hooks/useAuthMutations";
import { useAuthStore } from "../../features/auth/store/auth.store";
import { ReminderBellMenu } from "../../features/reminders/components/ReminderBellMenu";
import { useMyWorkspacesQuery } from "../../features/workspaces/hooks/useWorkspacesQuery";
import type { WorkspaceListItem } from "../../features/workspaces/types/workspace.types";
import { useScopeStore } from "../scope/scope.store";
import { ScopeSwitcher } from "./ScopeSwitcher";
import Stack from "@mui/material/Stack";

const drawerWidthExpanded = 280;
const drawerWidthCollapsed = 88;
const accountDrawerWidth = 300;
const mobileBottomNavigationHeight = 72;
const mobileBottomContentSpacing = 28;

type NavItem = {
    label: string;
    to: string;
    icon: React.ReactNode;
    showInBottom: boolean;
};

function getWorkspaceTypeLabel(
    workspaceType: "PERSONAL" | "HOUSEHOLD" | "BUSINESS"
): string {
    switch (workspaceType) {
        case "PERSONAL":
            return "Personal";
        case "HOUSEHOLD":
            return "Casa";
        case "BUSINESS":
            return "Negocio";
    }
}

function getRemindersBasePath(
    scopeType: "PERSONAL" | "WORKSPACE",
    workspaceId: string | null
): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/reminders";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/reminders`;
}

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
    const [accountMenuAnchorEl, setAccountMenuAnchorEl] = React.useState<HTMLElement | null>(null);
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = React.useState(false);

    const accountMenuOpen = Boolean(accountMenuAnchorEl);
    const currentDrawerWidth = isDesktopSidebarCollapsed
        ? drawerWidthCollapsed
        : drawerWidthExpanded;

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
        const hitIndex = bottomItems.findIndex((item) => location.pathname.startsWith(item.to));

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

    const renderNavItem = (item: NavItem) => {
        const isCollapsed = !isMobile && isDesktopSidebarCollapsed;

        const navButton = (
            <ListItemButton
                key={item.label}
                component={NavLink}
                to={item.to}
                onClick={() => setMobileDrawerOpen(false)}
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

    const drawerContent = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Toolbar
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isDesktopSidebarCollapsed && !isMobile ? "center" : "flex-start",
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
                    justifyContent: isDesktopSidebarCollapsed && !isMobile ? "center" : "flex-start",
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
                        <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                            <WorkspaceIconBadge
                                workspaceType={activeWorkspace.type}
                                iconValue={activeWorkspace.icon}
                                colorValue={activeWorkspace.color}
                                size={28}
                            />

                            <Badge color="primary" variant="standard">
                                <Typography
                                    variant="body2"
                                    sx={{
                                        opacity: 0.85,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {isMobile ? contextLabel : `Contexto: ${contextLabel}`}
                                </Typography>
                            </Badge>
                        </Stack>
                    )
                ) : (
                    <Badge color="primary" variant="standard">
                        <Typography
                            variant="body2"
                            sx={{
                                opacity: 0.85,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {isDesktopSidebarCollapsed || isMobile
                                ? compactContextLabel
                                : `Contexto: ${contextLabel}`}
                        </Typography>
                    </Badge>
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

    const mobileAccountDrawerContent = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Toolbar
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Cuenta
                </Typography>

                <Avatar
                    variant="rounded"
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "transparent",
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <PersonOutlineIcon fontSize="small" />
                </Avatar>
            </Toolbar>

            <Divider />

            <List sx={{ pt: 0 }}>
                <ListItemButton onClick={handleNavigateToProfile}>
                    <ListItemIcon>
                        <PersonOutlineIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Perfil"
                        secondary="Ver y editar tu información"
                    />
                </ListItemButton>

                <ListItemButton disabled>
                    <ListItemIcon>
                        <PaletteOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Tema"
                        secondary="Placeholder para selector de tema"
                    />
                </ListItemButton>
            </List>

            <Divider />

            <Box sx={{ p: 2, display: "grid", gap: 1.5 }}>
                <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700 }}>
                    CONTEXTO
                </Typography>

                <ScopeSwitcher />

                {canAccessAdminUsers ? (
                    <ListItemButton
                        onClick={handleNavigateToAdminUsers}
                        sx={{
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: isAdminUsersRoute ? "primary.main" : "divider",
                        }}
                    >
                        <ListItemIcon>
                            <AdminPanelSettingsOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Usuarios"
                            secondary="Vista global para administración"
                        />
                    </ListItemButton>
                ) : null}
            </Box>

            <Divider sx={{ mt: "auto" }} />

            <List sx={{ pt: 0 }}>
                <ListItemButton
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                >
                    <ListItemIcon>
                        <LogoutRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            logoutMutation.isPending
                                ? "Cerrando sesión..."
                                : "Cerrar sesión"
                        }
                    />
                </ListItemButton>
            </List>
        </Box>
    );

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
            <AppBar position="fixed" sx={{ zIndex: (muiTheme) => muiTheme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                        {isMobile ? (
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={() => setMobileDrawerOpen(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                        ) : (
                            <Tooltip title={isDesktopSidebarCollapsed ? "Expandir menú" : "Colapsar menú"}>
                                <IconButton
                                    color="inherit"
                                    edge="start"
                                    onClick={() =>
                                        setIsDesktopSidebarCollapsed((currentValue) => !currentValue)
                                    }
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
                                        onClick={handleNavigateToAdminUsers}
                                        startIcon={<AdminPanelSettingsOutlinedIcon />}
                                    >
                                        Usuarios
                                    </Button>
                                ) : null}

                                <Tooltip title="Cuenta">
                                    <IconButton color="inherit" onClick={handleOpenAccountMenu}>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                width: 38,
                                                height: 38,
                                                bgcolor: "transparent",
                                                border: "1px solid",
                                                borderColor: "currentColor",
                                                color: "inherit",
                                            }}
                                        >
                                            <PersonOutlineIcon fontSize="small" />
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>

                                <Menu
                                    anchorEl={accountMenuAnchorEl}
                                    open={accountMenuOpen}
                                    onClose={handleCloseAccountMenu}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                                >
                                    <MenuItem onClick={handleNavigateToProfile}>
                                        <ListItemIcon>
                                            <PersonOutlineIcon fontSize="small" />
                                        </ListItemIcon>
                                        Perfil
                                    </MenuItem>

                                    <MenuItem disabled>
                                        <ListItemIcon>
                                            <PaletteOutlinedIcon fontSize="small" />
                                        </ListItemIcon>
                                        Tema
                                    </MenuItem>

                                    <Divider />

                                    <MenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                                        <ListItemIcon>
                                            <LogoutRoundedIcon fontSize="small" />
                                        </ListItemIcon>
                                        {logoutMutation.isPending
                                            ? "Cerrando sesión..."
                                            : "Cerrar sesión"}
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
                                    <IconButton color="inherit" onClick={handleOpenMobileAccountDrawer}>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                width: 38,
                                                height: 38,
                                                bgcolor: "transparent",
                                                border: "1px solid",
                                                borderColor: "currentColor",
                                                color: "inherit",
                                            }}
                                        >
                                            <PersonOutlineIcon fontSize="small" />
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

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
                            width: drawerWidthExpanded,
                        },
                    }}
                >
                    {drawerContent}
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
                    {mobileAccountDrawerContent}
                </Drawer>
            )}

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
                                const bottomItems = scopedNavItems.filter((item) => item.showInBottom);
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
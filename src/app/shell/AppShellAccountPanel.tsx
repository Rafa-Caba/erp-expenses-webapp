// src/app/shell/AppShellAccountPanel.tsx

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

import { UserAvatar } from "../../features/components/UserAvatar";
import { ScopeSwitcher } from "./ScopeSwitcher";

type AppShellAccountPanelProps = {
    fullName: string | null | undefined;
    avatarUrl: string | null | undefined;
    avatarCacheKey: string | null | undefined;
    workspaceId: string | null;
    currentThemeLabel: string;
    canAccessAdminUsers: boolean;
    isAdminUsersRoute: boolean;
    isLoggingOut: boolean;
    onNavigateToProfile: () => void;
    onOpenThemeDialog: () => void;
    onNavigateToAdminUsers: () => void;
    onLogout: () => void;
};

export function AppShellAccountPanel({
    fullName,
    avatarUrl,
    avatarCacheKey,
    workspaceId,
    currentThemeLabel,
    canAccessAdminUsers,
    isAdminUsersRoute,
    isLoggingOut,
    onNavigateToProfile,
    onOpenThemeDialog,
    onNavigateToAdminUsers,
    onLogout,
}: AppShellAccountPanelProps) {
    return (
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

                <UserAvatar
                    fullName={fullName}
                    avatarUrl={avatarUrl}
                    cacheKey={avatarCacheKey}
                    size={40}
                    sx={{
                        bgcolor: "transparent",
                        borderColor: "divider",
                    }}
                />
            </Toolbar>

            <Divider />

            <List sx={{ pt: 0 }}>
                <ListItemButton onClick={onNavigateToProfile}>
                    <ListItemIcon>
                        <PersonOutlineIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Perfil"
                        secondary="Ver y editar tu información"
                    />
                </ListItemButton>

                <ListItemButton
                    onClick={onOpenThemeDialog}
                    disabled={workspaceId === null}
                >
                    <ListItemIcon>
                        <PaletteOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Tema"
                        secondary={
                            workspaceId === null
                                ? "No hay workspace activo"
                                : `Actual: ${currentThemeLabel}`
                        }
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
                        onClick={onNavigateToAdminUsers}
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
                    onClick={onLogout}
                    disabled={isLoggingOut}
                >
                    <ListItemIcon>
                        <LogoutRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                    />
                </ListItemButton>
            </List>
        </Box>
    );
}
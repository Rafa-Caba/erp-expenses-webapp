// src/features/reminders/components/ReminderBellMenu.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

import { useWorkspaceByIdQuery } from "../../workspaces/hooks/useWorkspaceByIdQuery";
import {
    useDeleteReminderMutation,
    useMarkReminderViewedMutation,
    useRespondToReminderMutation,
} from "../hooks/useReminderMutations";
import { useRemindersQuery } from "../hooks/useRemindersQuery";
import type { ReminderMemberResponseRecord, ReminderRecord } from "../types/reminder.types";
import { ReminderDetailDialog } from "./ReminderDetailDialog";

type ReminderBellMenuProps = {
    workspaceId: string | null;
    remindersPath: string;
};

function formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function getReminderPriorityLabel(priority: string | null): string {
    switch (priority) {
        case "high":
            return "Alta";
        case "medium":
            return "Media";
        case "low":
            return "Baja";
        default:
            return priority ?? "";
    }
}

function getReminderPriorityColor(
    priority: string | null
): "error" | "warning" | "default" {
    if (priority === "high") {
        return "error";
    }

    if (priority === "medium") {
        return "warning";
    }

    return "default";
}

function sortBellReminders(reminders: ReminderRecord[]): ReminderRecord[] {
    return [...reminders].sort((left, right) => {
        const leftOverdue = left.status !== "resolved" && left.isOverdue;
        const rightOverdue = right.status !== "resolved" && right.isOverdue;

        if (leftOverdue !== rightOverdue) {
            return Number(rightOverdue) - Number(leftOverdue);
        }

        const leftDate = new Date(left.dueDate).getTime();
        const rightDate = new Date(right.dueDate).getTime();

        return leftDate - rightDate;
    });
}

function getBellVisibleReminders(reminders: ReminderRecord[]): ReminderRecord[] {
    return reminders.filter(
        (reminder) => reminder.isVisible && reminder.status !== "resolved"
    );
}

function getCurrentMemberResponse(
    reminder: ReminderRecord,
    currentMemberId: string | null
): ReminderMemberResponseRecord | null {
    if (!currentMemberId) {
        return null;
    }

    return (
        reminder.responses.find((response) => response.memberId === currentMemberId) ?? null
    );
}

function canManageReminder(
    reminder: ReminderRecord,
    currentMemberId: string | null,
    currentRole: string | null
): boolean {
    if (currentRole === "OWNER") {
        return true;
    }

    if (!currentMemberId) {
        return false;
    }

    return reminder.createdByMemberId === currentMemberId;
}

function canRespondToReminder(
    reminder: ReminderRecord,
    currentMemberId: string | null,
    currentRole: string | null
): boolean {
    if (canManageReminder(reminder, currentMemberId, currentRole)) {
        return false;
    }

    const currentResponse = getCurrentMemberResponse(reminder, currentMemberId);

    return currentResponse?.status === "pending" && reminder.status !== "resolved";
}

function ReminderMenuItem({
    reminder,
    onClick,
}: {
    reminder: ReminderRecord;
    onClick: (reminder: ReminderRecord) => void;
}) {
    return (
        <MenuItem
            onClick={() => onClick(reminder)}
            sx={{
                alignItems: "flex-start",
                py: 1.5,
                maxWidth: 380,
            }}
        >
            <Stack spacing={0.75} sx={{ width: "100%" }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                >
                    <ListItemText
                        primary={reminder.title}
                        secondary={formatDate(reminder.dueDate)}
                        slotProps={{
                            primary: {
                                style: {
                                    fontWeight: 700,
                                },
                            },
                        }}
                        sx={{
                            m: 0,
                            minWidth: 0,
                        }}
                    />

                    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                        {reminder.isOverdue ? (
                            <Chip size="small" color="warning" label="Vencido" />
                        ) : null}

                        {reminder.priority ? (
                            <Chip
                                size="small"
                                variant="outlined"
                                color={getReminderPriorityColor(reminder.priority)}
                                label={getReminderPriorityLabel(reminder.priority)}
                            />
                        ) : null}
                    </Stack>
                </Stack>

                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                    {reminder.responseSummary.totalResponded} de{" "}
                    {reminder.responseSummary.totalRecipients} respondieron
                </Typography>

                {reminder.description ? (
                    <Typography
                        variant="caption"
                        sx={{
                            opacity: 0.8,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {reminder.description}
                    </Typography>
                ) : null}
            </Stack>
        </MenuItem>
    );
}

function ReminderDialogListItem({
    reminder,
    onClick,
}: {
    reminder: ReminderRecord;
    onClick: (reminder: ReminderRecord) => void;
}) {
    return (
        <Box
            onClick={() => onClick(reminder)}
            sx={{
                cursor: "pointer",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 1.5,
            }}
        >
            <Stack spacing={0.75}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                >
                    <Typography
                        sx={{
                            fontWeight: 700,
                            minWidth: 0,
                            wordBreak: "break-word",
                        }}
                    >
                        {reminder.title}
                    </Typography>

                    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                        {reminder.isOverdue ? (
                            <Chip size="small" color="warning" label="Vencido" />
                        ) : null}

                        {reminder.priority ? (
                            <Chip
                                size="small"
                                variant="outlined"
                                color={getReminderPriorityColor(reminder.priority)}
                                label={getReminderPriorityLabel(reminder.priority)}
                            />
                        ) : null}
                    </Stack>
                </Stack>

                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {formatDate(reminder.dueDate)}
                </Typography>

                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                    {reminder.responseSummary.totalResponded} de{" "}
                    {reminder.responseSummary.totalRecipients} respondieron
                </Typography>

                {reminder.description ? (
                    <Typography
                        variant="caption"
                        sx={{
                            opacity: 0.75,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {reminder.description}
                    </Typography>
                ) : null}
            </Stack>
        </Box>
    );
}

export function ReminderBellMenu({
    workspaceId,
    remindersPath,
}: ReminderBellMenuProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    const remindersQuery = useRemindersQuery(workspaceId, {
        staleTime: 30_000,
        refetchInterval: 60_000,
    });
    const workspaceQuery = useWorkspaceByIdQuery(workspaceId);

    const markReminderViewedMutation = useMarkReminderViewedMutation();
    const respondToReminderMutation = useRespondToReminderMutation();
    const deleteReminderMutation = useDeleteReminderMutation();

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [mobileDialogOpen, setMobileDialogOpen] = React.useState(false);
    const [selectedReminder, setSelectedReminder] =
        React.useState<ReminderRecord | null>(null);

    const currentMembership = workspaceQuery.data?.workspace.currentMembership ?? null;
    const currentMemberId = currentMembership?.memberId ?? null;
    const currentRole = currentMembership?.role ?? null;

    const visibleReminders = React.useMemo(
        () =>
            sortBellReminders(
                getBellVisibleReminders(remindersQuery.data?.reminders ?? [])
            ),
        [remindersQuery.data?.reminders]
    );

    const desktopVisibleReminders = visibleReminders.slice(0, 6);
    const mobileVisibleReminders = visibleReminders.slice(0, 10);
    const badgeCount = visibleReminders.length;

    const desktopMenuOpen = Boolean(anchorEl);

    const isSubmitting =
        markReminderViewedMutation.isPending ||
        respondToReminderMutation.isPending ||
        deleteReminderMutation.isPending;

    const selectedCanManage =
        selectedReminder !== null
            ? canManageReminder(selectedReminder, currentMemberId, currentRole)
            : false;

    const selectedCanRespond =
        selectedReminder !== null
            ? canRespondToReminder(selectedReminder, currentMemberId, currentRole)
            : false;

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        if (isMobile) {
            setMobileDialogOpen(true);
            return;
        }

        setAnchorEl(event.currentTarget);
    };

    const handleCloseDesktopMenu = () => {
        setAnchorEl(null);
    };

    const handleCloseMobileDialog = () => {
        setMobileDialogOpen(false);
    };

    const handleOpenReminderDetail = (reminder: ReminderRecord) => {
        handleCloseDesktopMenu();
        handleCloseMobileDialog();

        if (workspaceId) {
            markReminderViewedMutation.mutate(
                {
                    workspaceId,
                    reminderId: reminder._id,
                },
                {
                    onSuccess: (response) => {
                        setSelectedReminder(response.reminder);
                    },
                    onError: () => {
                        setSelectedReminder(reminder);
                    },
                }
            );

            return;
        }

        setSelectedReminder(reminder);
    };

    const handleCloseReminderDetail = () => {
        if (isSubmitting) {
            return;
        }

        setSelectedReminder(null);
    };

    const handleOpenRemindersScreen = () => {
        handleCloseDesktopMenu();
        handleCloseMobileDialog();
        setSelectedReminder(null);
        navigate(remindersPath);
    };

    const handleOpenReminderEdit = (reminder: ReminderRecord) => {
        setSelectedReminder(null);
        navigate(`${remindersPath}/${reminder._id}/edit`);
    };

    const handleDeleteReminder = (reminder: ReminderRecord) => {
        if (!workspaceId) {
            return;
        }

        const confirmed = window.confirm(
            `¿Seguro que deseas eliminar el reminder "${reminder.title}"?`
        );

        if (!confirmed) {
            return;
        }

        deleteReminderMutation.mutate(
            {
                workspaceId,
                reminderId: reminder._id,
            },
            {
                onSuccess: () => {
                    setSelectedReminder(null);
                },
            }
        );
    };

    const handleMarkDone = (reminder: ReminderRecord) => {
        if (!workspaceId) {
            return;
        }

        respondToReminderMutation.mutate(
            {
                workspaceId,
                reminderId: reminder._id,
                payload: {
                    status: "done",
                },
            },
            {
                onSuccess: (response) => {
                    setSelectedReminder(response.reminder);
                },
            }
        );
    };

    const handleDismiss = (reminder: ReminderRecord) => {
        if (!workspaceId) {
            return;
        }

        respondToReminderMutation.mutate(
            {
                workspaceId,
                reminderId: reminder._id,
                payload: {
                    status: "dismissed",
                },
            },
            {
                onSuccess: (response) => {
                    setSelectedReminder(response.reminder);
                },
            }
        );
    };

    const icon =
        badgeCount > 0 ? (
            <NotificationsActiveOutlinedIcon />
        ) : (
            <NotificationsNoneOutlinedIcon />
        );

    return (
        <>
            <Tooltip title="Reminders">
                <IconButton color="inherit" onClick={handleOpen}>
                    <Badge color="warning" badgeContent={badgeCount} max={99}>
                        {icon}
                    </Badge>
                </IconButton>
            </Tooltip>

            {!isMobile ? (
                <Menu
                    anchorEl={anchorEl}
                    open={desktopMenuOpen}
                    onClose={handleCloseDesktopMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                        sx: {
                            width: 400,
                            maxWidth: "calc(100vw - 24px)",
                        },
                    }}
                >
                    <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                            Reminders
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.75 }}>
                            {visibleReminders.length} activo(s)
                        </Typography>
                    </Box>

                    <Divider />

                    {remindersQuery.isLoading ? (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body2">Cargando reminders...</Typography>
                        </Box>
                    ) : remindersQuery.isError ? (
                        <Box sx={{ p: 2 }}>
                            <Alert severity="error">
                                No se pudieron cargar los reminders.
                            </Alert>
                        </Box>
                    ) : desktopVisibleReminders.length === 0 ? (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                No hay reminders activos por ahora.
                            </Typography>
                        </Box>
                    ) : [
                        ...desktopVisibleReminders.map((reminder) => (
                            <ReminderMenuItem
                                key={reminder._id}
                                reminder={reminder}
                                onClick={handleOpenReminderDetail}
                            />
                        )),
                        visibleReminders.length > desktopVisibleReminders.length ? (
                            <Box key="reminders-count-footer" sx={{ px: 2, pb: 1 }}>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                    Mostrando {desktopVisibleReminders.length} de{" "}
                                    {visibleReminders.length} activos
                                </Typography>
                            </Box>
                        ) : null,
                    ]}

                    <Divider />

                    <Box sx={{ p: 1.5 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleOpenRemindersScreen}
                        >
                            Ver reminders
                        </Button>
                    </Box>
                </Menu>
            ) : (
                <Dialog
                    open={mobileDialogOpen}
                    onClose={handleCloseMobileDialog}
                    fullWidth
                    maxWidth="sm"
                    fullScreen={isSmallScreen}
                >
                    <DialogTitle>Reminders</DialogTitle>

                    <DialogContent dividers>
                        <Stack spacing={1.5}>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                {visibleReminders.length} activo(s)
                            </Typography>

                            {remindersQuery.isLoading ? (
                                <Typography variant="body2">
                                    Cargando reminders...
                                </Typography>
                            ) : remindersQuery.isError ? (
                                <Alert severity="error">
                                    No se pudieron cargar los reminders.
                                </Alert>
                            ) : mobileVisibleReminders.length === 0 ? (
                                <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                    No hay reminders activos por ahora.
                                </Typography>
                            ) : (
                                <Stack spacing={1}>
                                    {mobileVisibleReminders.map((reminder) => (
                                        <ReminderDialogListItem
                                            key={reminder._id}
                                            reminder={reminder}
                                            onClick={handleOpenReminderDetail}
                                        />
                                    ))}

                                    {visibleReminders.length > mobileVisibleReminders.length ? (
                                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                            Mostrando {mobileVisibleReminders.length} de{" "}
                                            {visibleReminders.length} activos
                                        </Typography>
                                    ) : null}
                                </Stack>
                            )}
                        </Stack>
                    </DialogContent>

                    <DialogActions
                        sx={{
                            px: 3,
                            py: 2,
                            display: "flex",
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                            alignItems: {
                                xs: "stretch",
                                sm: "center",
                            },
                            gap: 1,
                            "& > button": {
                                width: {
                                    xs: "100%",
                                    sm: "auto",
                                },
                            },
                        }}
                    >
                        <Button onClick={handleCloseMobileDialog}>Cerrar</Button>
                        <Button variant="contained" onClick={handleOpenRemindersScreen}>
                            Ver reminders
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <ReminderDetailDialog
                reminder={selectedReminder}
                open={selectedReminder !== null}
                isSubmitting={isSubmitting}
                canManage={selectedCanManage}
                canRespond={selectedCanRespond}
                onClose={handleCloseReminderDetail}
                onEdit={handleOpenReminderEdit}
                onDelete={handleDeleteReminder}
                onMarkDone={handleMarkDone}
                onDismiss={handleDismiss}
                onOpenReminders={handleOpenRemindersScreen}
            />
        </>
    );
}
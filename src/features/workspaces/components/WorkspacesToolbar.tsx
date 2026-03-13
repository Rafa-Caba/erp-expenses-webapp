// src/features/workspaces/components/WorkspacesToolbar.tsx

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

type WorkspacesToolbarProps = {
    searchTerm: string;
    includeArchived: boolean;
    includeInactive: boolean;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onIncludeArchivedChange: (value: boolean) => void;
    onIncludeInactiveChange: (value: boolean) => void;
    onResetFilters: () => void;
};

export function WorkspacesToolbar({
    searchTerm,
    includeArchived,
    includeInactive,
    totalCount,
    onSearchTermChange,
    onIncludeArchivedChange,
    onIncludeInactiveChange,
    onResetFilters,
}: WorkspacesToolbarProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                borderRadius: 3,
            }}
        >
            <Stack spacing={2}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", md: "center" }}
                >
                    <TextField
                        label="Buscar workspace"
                        placeholder="Ej: Casa, Negocio, Familiar..."
                        value={searchTerm}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                        fullWidth
                    />

                    <Button variant="outlined" onClick={onResetFilters}>
                        Limpiar
                    </Button>
                </Stack>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", md: "center" }}
                    justifyContent="space-between"
                >
                    <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={includeArchived}
                                    onChange={(event) =>
                                        onIncludeArchivedChange(event.target.checked)
                                    }
                                />
                            }
                            label="Mostrar archivados"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={includeInactive}
                                    onChange={(event) =>
                                        onIncludeInactiveChange(event.target.checked)
                                    }
                                />
                            }
                            label="Mostrar inactivos"
                        />
                    </Stack>

                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        {totalCount} workspace{totalCount === 1 ? "" : "s"}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
// src/features/adminUsers/components/AdminUsersPagination.tsx

import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type AdminUsersPaginationProps = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

function getPaginationRangeLabel(page: number, limit: number, totalItems: number): string {
    if (totalItems === 0) {
        return "Mostrando 0 resultados";
    }

    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, totalItems);

    return `Mostrando ${start}-${end} de ${totalItems}`;
}

export function AdminUsersPagination({
    page,
    limit,
    totalItems,
    totalPages,
    onPageChange,
}: AdminUsersPaginationProps) {
    if (totalItems === 0 || totalPages <= 1) {
        return null;
    }

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                borderRadius: 3,
            }}
        >
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
            >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {getPaginationRangeLabel(page, limit, totalItems)}
                </Typography>

                <Pagination
                    page={page}
                    count={totalPages}
                    color="primary"
                    shape="rounded"
                    onChange={(_event, nextPage) => onPageChange(nextPage)}
                />
            </Stack>
        </Paper>
    );
}
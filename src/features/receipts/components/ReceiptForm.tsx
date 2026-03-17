// src/features/receipts/components/ReceiptForm.tsx

import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { WorkspaceMemberSelect } from "../../components/WorkspaceMemberSelect";
import { WorkspaceTransactionSelect } from "../../components/WorkspaceTransactionSelect";
import type { ReceiptFileType } from "../types/receipt.types";

const ACCEPTED_RECEIPT_MIME_TYPES: ReceiptFileType[] = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
];

export type ReceiptFormValues = {
    transactionId: string;
    uploadedByMemberId: string;
    notes: string;
    isVisible: boolean;
    uploadedAt: string;
    file: File | null;
};

type ReceiptFormField =
    | "transactionId"
    | "uploadedByMemberId"
    | "uploadedAt"
    | "file";

type ReceiptFormErrors = Partial<Record<ReceiptFormField, string>>;

type ReceiptFormProps = {
    workspaceId: string | null;
    mode: "create" | "edit";
    initialValues: ReceiptFormValues;
    existingFileUrl?: string | null;
    existingFileName?: string | null;
    existingFileType?: ReceiptFileType | null;
    isSubmitting: boolean;
    submitErrorMessage?: string | null;
    onSubmit: (values: ReceiptFormValues) => void;
    onCancel: () => void;
};

function isAcceptedReceiptMimeType(value: string): value is ReceiptFileType {
    return ACCEPTED_RECEIPT_MIME_TYPES.includes(value as ReceiptFileType);
}

function isImageReceiptMimeType(value: string | null): boolean {
    return value === "image/jpeg" || value === "image/png" || value === "image/webp";
}

function validateReceiptForm(
    values: ReceiptFormValues,
    mode: "create" | "edit"
): ReceiptFormErrors {
    const errors: ReceiptFormErrors = {};

    if (!values.transactionId.trim()) {
        errors.transactionId = "La transacción es obligatoria.";
    }

    if (!values.uploadedByMemberId.trim()) {
        errors.uploadedByMemberId = "El miembro es obligatorio.";
    }

    if (mode === "create" && !values.file) {
        errors.file = "El archivo es obligatorio.";
    }

    if (values.file && !isAcceptedReceiptMimeType(values.file.type)) {
        errors.file = "Solo se permiten JPG, PNG, WEBP o PDF.";
    }

    if (values.uploadedAt.trim()) {
        const parsedDate = new Date(values.uploadedAt);
        if (Number.isNaN(parsedDate.getTime())) {
            errors.uploadedAt = "La fecha de carga no es válida.";
        }
    }

    return errors;
}

function FilePreview({
    fileUrl,
    fileName,
    fileType,
}: {
    fileUrl: string;
    fileName: string;
    fileType: string;
}) {
    if (isImageReceiptMimeType(fileType)) {
        return (
            <Box
                component="img"
                src={fileUrl}
                alt={fileName}
                sx={{
                    width: "100%",
                    maxHeight: 260,
                    objectFit: "contain",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                }}
            />
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: 160,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                display: "grid",
                placeItems: "center",
                p: 2,
            }}
        >
            <Stack spacing={1} alignItems="center">
                <PictureAsPdfOutlinedIcon color="error" sx={{ fontSize: 48 }} />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {fileName}
                </Typography>
            </Stack>
        </Box>
    );
}

export function ReceiptForm({
    workspaceId,
    mode,
    initialValues,
    existingFileUrl = null,
    existingFileName = null,
    existingFileType = null,
    isSubmitting,
    submitErrorMessage = null,
    onSubmit,
    onCancel,
}: ReceiptFormProps) {
    const [values, setValues] = React.useState<ReceiptFormValues>(initialValues);
    const [errors, setErrors] = React.useState<ReceiptFormErrors>({});
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const selectedFilePreviewUrl = React.useMemo(() => {
        if (!values.file) {
            return null;
        }

        if (!isImageReceiptMimeType(values.file.type)) {
            return null;
        }

        return URL.createObjectURL(values.file);
    }, [values.file]);

    React.useEffect(() => {
        return () => {
            if (selectedFilePreviewUrl) {
                URL.revokeObjectURL(selectedFilePreviewUrl);
            }
        };
    }, [selectedFilePreviewUrl]);

    const handleTransactionChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            transactionId: value,
        }));
    };

    const handleUploadedByMemberChange = (value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            uploadedByMemberId: value,
        }));
    };

    const handleTextChange =
        (field: "notes" | "uploadedAt") =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues((currentValues) => ({
                    ...currentValues,
                    [field]: event.target.value,
                }));
            };

    const handleVisibleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues((currentValues) => ({
            ...currentValues,
            isVisible: event.target.checked,
        }));
    };

    const handleOpenFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] ?? null;

        setValues((currentValues) => ({
            ...currentValues,
            file: selectedFile,
        }));
    };

    const handleRemoveSelectedFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setValues((currentValues) => ({
            ...currentValues,
            file: null,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateReceiptForm(values, mode);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        onSubmit(values);
    };

    const selectedFileType = values.file?.type ?? null;
    const selectedFileName = values.file?.name ?? null;

    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {mode === "create" ? "Nuevo recibo" : "Editar recibo"}
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Adjunta imagen o PDF a una transacción existente del workspace.
                            </Typography>
                        </Box>

                        {submitErrorMessage ? (
                            <Alert severity="error">{submitErrorMessage}</Alert>
                        ) : null}

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceTransactionSelect
                                    workspaceId={workspaceId}
                                    value={values.transactionId}
                                    onChange={handleTransactionChange}
                                    label="Transacción"
                                    helperText="Selecciona la transacción relacionada con el recibo."
                                    allowEmpty={false}
                                    error={Boolean(errors.transactionId)}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <WorkspaceMemberSelect
                                    workspaceId={workspaceId}
                                    value={values.uploadedByMemberId}
                                    onChange={handleUploadedByMemberChange}
                                    label="Subido por"
                                    helperText="Selecciona el miembro que sube el recibo."
                                    allowEmpty={false}
                                    error={Boolean(errors.uploadedByMemberId)}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Fecha de carga"
                                    type="datetime-local"
                                    value={values.uploadedAt}
                                    onChange={handleTextChange("uploadedAt")}
                                    error={Boolean(errors.uploadedAt)}
                                    helperText={errors.uploadedAt ?? "Opcional. Si lo dejas vacío, el backend puede usar la fecha actual."}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.isVisible}
                                            onChange={handleVisibleChange}
                                        />
                                    }
                                    label="Visible"
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Notas"
                                    value={values.notes}
                                    onChange={handleTextChange("notes")}
                                    fullWidth
                                    multiline
                                    minRows={2}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Stack spacing={1.5}>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                    />

                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={2}
                                        alignItems={{ xs: "stretch", sm: "center" }}
                                    >
                                        <Button
                                            variant="outlined"
                                            onClick={handleOpenFilePicker}
                                            disabled={isSubmitting}
                                        >
                                            {mode === "create" ? "Seleccionar archivo" : "Reemplazar archivo"}
                                        </Button>

                                        {values.file ? (
                                            <Button
                                                variant="text"
                                                color="inherit"
                                                onClick={handleRemoveSelectedFile}
                                                disabled={isSubmitting}
                                            >
                                                Quitar archivo nuevo
                                            </Button>
                                        ) : null}
                                    </Stack>

                                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                        Formatos permitidos: JPG, PNG, WEBP, PDF.
                                    </Typography>

                                    {errors.file ? (
                                        <Alert severity="error">{errors.file}</Alert>
                                    ) : null}

                                    {selectedFileName ? (
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                            Archivo nuevo: {selectedFileName}
                                        </Typography>
                                    ) : null}
                                </Stack>
                            </Grid>

                            {selectedFilePreviewUrl && selectedFileType ? (
                                <Grid size={{ xs: 12 }}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">
                                            Vista previa del archivo nuevo
                                        </Typography>

                                        <FilePreview
                                            fileUrl={selectedFilePreviewUrl}
                                            fileName={selectedFileName ?? "Archivo"}
                                            fileType={selectedFileType}
                                        />
                                    </Stack>
                                </Grid>
                            ) : null}

                            {!selectedFilePreviewUrl &&
                                existingFileUrl &&
                                existingFileName &&
                                existingFileType ? (
                                <Grid size={{ xs: 12 }}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">
                                            Archivo actual
                                        </Typography>

                                        <FilePreview
                                            fileUrl={existingFileUrl}
                                            fileName={existingFileName}
                                            fileType={existingFileType}
                                        />

                                        <Button
                                            variant="text"
                                            component="a"
                                            href={existingFileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            sx={{ alignSelf: "flex-start" }}
                                        >
                                            Ver archivo actual
                                        </Button>
                                    </Stack>
                                </Grid>
                            ) : null}
                        </Grid>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                                Cancelar
                            </Button>

                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {mode === "create" ? "Crear recibo" : "Guardar cambios"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
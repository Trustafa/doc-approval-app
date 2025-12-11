'use client';

import { uploadFileClient } from '@/app/api/_client/file.client';
import { ControlledFieldProps } from '@/utils/form-control-props.type';
import { Close } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useRef, useState } from 'react';
import { FieldValues, useController } from 'react-hook-form';

type ControlledFileUploadProps<T extends FieldValues> =
  ControlledFieldProps<T> & {
    multiple?: boolean;
  };

export type UploadedFileSummary = {
  id: string;
  filename: string;
};

export default function ControlledFileUpload<T extends FieldValues>({
  name,
  control,
  label,
  rules,
  multiple = false,
}: ControlledFileUploadProps<T>) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control, rules });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileList = value as UploadedFileSummary[];
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenPicker = () => {
    fileInputRef.current?.click();
  };

  const uploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);

    const uploaded: UploadedFileSummary[] = [];

    for (const file of Array.from(files)) {
      const result = await uploadFileClient(file);

      if (!result.success) {
        enqueueSnackbar(`Unable to upload file ${result.error}`, {
          variant: 'error',
        });
        continue;
      }

      uploaded.push({
        id: result.data?.id ?? '',
        filename: result.data?.filename ?? '',
      });
    }

    setLoading(false);
    onChange(multiple ? [...(value ?? []), ...uploaded] : [...uploaded]);

    e.target.value = '';
  };
  const removeFile = (indexToRemove: number) => {
    const currentFiles = (value as UploadedFileSummary[]) ?? [];

    const newFiles = currentFiles.filter((_, i) => i !== indexToRemove);

    onChange(newFiles);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2, flex: 1 }}>
      <Typography variant="caption" sx={{ mb: 0.5 }}>
        {label}
      </Typography>

      <input
        type="file"
        multiple={multiple}
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="application/pdf"
        onChange={(e) => uploadFiles(e)}
      />

      {/* Upload button */}
      <Button variant="outlined" onClick={handleOpenPicker}>
        {loading
          ? 'Uploading File...'
          : multiple
            ? 'Choose Files'
            : 'Choose File'}
      </Button>

      {fileList && fileList.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {Array.from(fileList).map((file, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 0.5,
              }}
            >
              <Typography variant="body2">• {file.filename}</Typography>

              <IconButton
                size="small"
                onClick={() => removeFile(index)}
                sx={{ ml: 1 }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {error && (
        <Typography color="error" variant="caption">
          {error.message}
        </Typography>
      )}
    </Box>
  );
}

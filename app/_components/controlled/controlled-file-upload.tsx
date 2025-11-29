'use client';

import { colors } from '@/utils/colors';
import { ControlledFieldProps } from '@/utils/form-control-props.type';
import { Close } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useRef } from 'react';
import { FieldValues, useController } from 'react-hook-form';

type ControlledFileUploadProps<T extends FieldValues> =
  ControlledFieldProps<T> & {
    multiple?: boolean;
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
  const fileList = value as FileList;

  const handleOpenPicker = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (indexToRemove: number) => {
    if (!fileList) return;

    const dt = new DataTransfer();
    Array.from(fileList)
      .filter((_, i) => i !== indexToRemove)
      .forEach((file) => dt.items.add(file));

    onChange(dt.files);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
        onChange={(e) => onChange(e.target.files)}
      />

      {/* Upload button */}
      <Button
        variant="contained"
        sx={{
          border: 1,
          background: 'transparent',
          borderColor: colors.blurred,
          color: colors.black,
        }}
        disableElevation
        onClick={handleOpenPicker}
      >
        {multiple ? 'Choose Files' : 'Choose File'}
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
              <Typography variant="body2">
                • {file.name} ({formatSize(file.size)})
              </Typography>

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

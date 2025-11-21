'use client';

import { ControlledFieldProps } from '@/utils/form-control-props.type';
import { Box, Typography } from '@mui/material';
import { FieldValues, useController } from 'react-hook-form';
import StyledTextField from '../styled/styled-text-field';

export default function ControlledFileUpload<T extends FieldValues>({
  name,
  control,
  label,
  rules,
}: ControlledFieldProps<T>) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
      <Typography variant="caption" sx={{ mb: 0.5 }}>
        {label}
      </Typography>

      <StyledTextField
        type="file"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          onChange(target.files);
        }}
      />

      {value && value.length > 0 && (
        <Typography variant="body2">{value.length} file(s) selected</Typography>
      )}

      {error && (
        <Typography color="error" variant="caption">
          {error.message}
        </Typography>
      )}
    </Box>
  );
}

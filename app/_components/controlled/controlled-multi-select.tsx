'use client';

import { ControlledFieldProps } from '@/utils/form-control-props.type';
import { Autocomplete, Box, Typography } from '@mui/material';
import { FieldValues, useController } from 'react-hook-form';
import StyledTextField from '../styled/styled-text-field';

type ControlledMultiSelectProps<T extends FieldValues> =
  ControlledFieldProps<T> & {
    options: string[];
    multiple?: boolean;
  };

export function ControlledMultiSelect<T extends FieldValues>({
  name,
  control,
  rules,
  label,
  options,
  multiple = false,
}: ControlledMultiSelectProps<T>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2, flex: 1 }}>
      <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary' }}>
        {label}
      </Typography>
      <Autocomplete
        multiple={multiple}
        options={options}
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        renderInput={(params) => (
          <StyledTextField
            error={!!error}
            helperText={error?.message}
            {...params}
          />
        )}
      />
    </Box>
  );
}

'use client';

import { ControlledFieldProps } from '@/utils/form-control-props.type';
import { Box, Typography } from '@mui/material';
import { FieldValues, useController } from 'react-hook-form';
import StyledTextField from '../styled/styled-text-field';

const ControlledStyledTextField = <T extends FieldValues>({
  name,
  control,
  rules,
  label,
  type = 'text',
  placeholder,
  rows,
  multiline = false,
}: ControlledFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
      <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary' }}>
        {label}
      </Typography>
      <StyledTextField
        {...field}
        type={type}
        rows={rows}
        multiline={multiline}
        placeholder={placeholder}
        error={!!error}
        helperText={error?.message}
        onChange={(e) => {
          if (type === 'number') {
            const val = e.target.value;
            if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
              field.onChange(val === '' ? '' : parseFloat(val));
            }
          } else {
            field.onChange(e.target.value);
          }
        }}
      />
    </Box>
  );
};

export default ControlledStyledTextField;

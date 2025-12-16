'use client';

import { ControlledFieldProps } from '@/utils/form-control-props.type';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, IconButton, InputAdornment, Typography } from '@mui/material';
import { useState } from 'react';
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
  disabled = false,
}: ControlledFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2, flex: 1 }}>
      {label && (
        <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary' }}>
          {label}
        </Typography>
      )}

      <StyledTextField
        {...field}
        type={isPassword && showPassword ? 'text' : type}
        rows={rows}
        multiline={multiline}
        placeholder={placeholder}
        error={!!error}
        helperText={error?.message}
        disabled={disabled}
        slotProps={{
          input: {
            endAdornment: isPassword && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  tabIndex={-1}
                  variant="icon"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
      />
    </Box>
  );
};

export default ControlledStyledTextField;

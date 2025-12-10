'use client';

import { ControlledFieldProps } from '@/utils/form-control-props.type';
import { Box, Typography } from '@mui/material';
import { FieldValues, useController } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import StyledTextField from '../styled/styled-text-field';

const ControlledNumericField = <T extends FieldValues>({
  name,
  control,
  rules,
  label,
  placeholder,
}: ControlledFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2, flex: 1 }}>
      <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary' }}>
        {label}
      </Typography>

      <NumericFormat
        customInput={StyledTextField}
        value={field.value ?? ''}
        thousandSeparator=","
        decimalScale={2}
        allowNegative={false}
        placeholder={placeholder}
        error={!!error}
        helperText={error?.message}
        onValueChange={(values) => {
          field.onChange(values.value === '' ? 0 : Number(values.value));
        }}
      />
    </Box>
  );
};

export default ControlledNumericField;

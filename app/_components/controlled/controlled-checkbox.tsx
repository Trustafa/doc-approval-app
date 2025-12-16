'use client';

import { ControlledFieldProps } from '@/utils/form-control-props.type';
import { Checkbox, FormControlLabel } from '@mui/material';
import { FieldValues, useController } from 'react-hook-form';

export default function ControlledCheckbox<T extends FieldValues>({
  name,
  label,
  control,
  disabled = false,
}: ControlledFieldProps<T>) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  });

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
      }
      label={label}
    />
  );
}

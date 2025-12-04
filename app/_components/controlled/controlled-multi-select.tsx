'use client';

import { ControlledFieldProps } from '@/utils/form-control-props.type';
import { Autocomplete, Box, Typography } from '@mui/material';
import { FieldValues, useController } from 'react-hook-form';
import StyledTextField from '../styled/styled-text-field';

type ControlledMultiSelectProps<
  T extends FieldValues,
  OptionType,
> = ControlledFieldProps<T> & {
  options: OptionType[];
  getOptionLabel: (option: OptionType) => string;
  getOptionValue: (option: OptionType) => unknown;
};

export function ControlledMultiSelect<T extends FieldValues, OptionType>({
  name,
  control,
  rules,
  label,
  options,
  getOptionLabel,
  getOptionValue,
}: ControlledMultiSelectProps<T, OptionType>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
      <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary' }}>
        {label}
      </Typography>
      <Autocomplete
        multiple
        id="tags-standard"
        options={options}
        getOptionLabel={getOptionLabel}
        value={options.filter((o) => value.includes(getOptionValue(o)))}
        onChange={(_, newValues) =>
          onChange(newValues.map((v) => getOptionValue(v)))
        }
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

'use client';
import { ControlledFieldProps } from '@/utils/form-control-props.type';
import { Autocomplete, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { FieldValues, useController } from 'react-hook-form';
import StyledTextField from '../styled/styled-text-field';

export type UserData = {
  id: string;
  name: string;
};

type ControlledUserSelectProps<T extends FieldValues> =
  ControlledFieldProps<T> & {
    fetchUsers: () => Promise<UserData[]>;
  };

export function ControlledUserSelect<T extends FieldValues>({
  name,
  control,
  label,
  rules,
  fetchUsers,
}: ControlledUserSelectProps<T>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name, control, rules });

  const [options, setOptions] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    if (options.length > 0) return;

    setLoading(true);
    try {
      const users = await fetchUsers();
      setOptions(users);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
      <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary' }}>
        {label}
      </Typography>
      <Autocomplete
        multiple
        options={options}
        getOptionLabel={(o) => o.name}
        value={options.filter((o) => value?.includes(o.id))}
        onChange={(_, newValues) => onChange(newValues.map((v) => v.id))}
        onOpen={handleOpen}
        loading={loading}
        renderInput={(params) => (
          <StyledTextField
            {...params}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
    </Box>
  );
}

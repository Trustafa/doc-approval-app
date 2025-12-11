'use client';
import { ControlledFieldProps } from '@/utils/form-control-props.type';
import { Autocomplete, Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
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
  const [allLoaded, setAllLoaded] = useState(false);

  const handleOpen = async () => {
    if (allLoaded) return;

    setLoading(true);
    try {
      const users = await fetchUsers();
      setOptions(users);
      setAllLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  // This will set the default user as an option so that it can be selected
  useEffect(() => {
    if (value?.[0] && options.every((o) => o.id !== value[0])) {
      setLoading(true);
      fetchUsers()
        .then((users) => {
          const defaultUser = users.find((u) => u.id === value[0]);
          if (defaultUser)
            setOptions((prev) => {
              if (prev.some((o) => o.id === defaultUser.id)) return prev;
              return [defaultUser, ...prev];
            });
          console.log('OPTIONS SET');
          console.log('value:', value);
        })
        .finally(() => setLoading(false));
    }
  }, [value]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
      <Typography variant="caption">{label}</Typography>
      <Autocomplete
        multiple={false}
        options={options}
        getOptionLabel={(o) => o.name}
        value={
          //  options.filter((o) => value?.includes(o.id))
          options.find((o) => o.id === value?.[0]) || null
        }
        onChange={
          (_, newValues) => {
            if (!newValues) return onChange([]);
            onChange([newValues.id]);
          }
          // onChange(
          // newValues.map((v) => v.id)
          // )
        }
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

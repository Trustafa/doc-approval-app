import { TextFieldProps } from '@mui/material';
import {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';

export type ControlledFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, FieldPath<T>>;
} & Omit<TextFieldProps, 'name' | 'defaultValue' | 'onChange' | 'value'>;

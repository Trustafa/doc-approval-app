'use client';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';

type DatePickerFieldProps = {
  label: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
};

export default function DatePickerField({
  label,
  value,
  onChange,
}: DatePickerFieldProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        format="DD/MM/YYYY"
        onChange={(newValue) => onChange(newValue)}
        sx={{ background: 'white' }}
      />
    </LocalizationProvider>
  );
}

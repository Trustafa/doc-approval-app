'use client';

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from '@mui/material';
import { Dayjs } from 'dayjs';
import { useState } from 'react';
import DatePickerField from './date-picker';
type SearchFiltersProps = {
  onSearch: (value: string) => void;
};

export default function SearchFilters({}: SearchFiltersProps) {
  const [filters, setFilters] = useState<{
    id: string;
    payee: string;
    status: string;
    amount: string;
    fromDate: Dayjs | null;
    toDate: Dayjs | null;
    internalRef: string;
  }>({
    id: '',
    payee: '',
    status: '',
    amount: '',
    fromDate: null,
    toDate: null,
    internalRef: '',
  });

  const reset = () => {
    setFilters({
      id: '',
      payee: '',
      status: '',
      amount: '',
      fromDate: null,
      toDate: null,
      internalRef: '',
    });
  };

  const handleChange = (key: string, value: string | Dayjs | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const onApply = () => {};

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        borderRadius: 2,
        backgroundColor: '#f5f5f5',
        display: 'flex',
        gap: 2,
      }}
    >
      <Grid container spacing={2} sx={{ maxWidth: 700 }}>
        <Grid size={6}>
          <FormControl fullWidth>
            <InputLabel>Payee</InputLabel>
            <OutlinedInput
              label="Payee"
              value={filters.payee}
              onChange={(e) => handleChange('payee', e.target.value)}
            />
          </FormControl>
        </Grid>

        <Grid size={3}>
          <FormControl fullWidth>
            <InputLabel>ID</InputLabel>
            <OutlinedInput
              label="ID"
              value={filters.id}
              onChange={(e) => handleChange('id', e.target.value)}
            />
          </FormControl>
        </Grid>

        <Grid size={3}>
          <FormControl fullWidth>
            <InputLabel id="statusLabel">Status</InputLabel>
            <Select
              labelId="statusLabel"
              id="statusSelect"
              value={filters.status}
              label="Status"
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <MenuItem value={'ALL'}>All</MenuItem>
              <MenuItem value={'PENDING'}>Pending</MenuItem>
              <MenuItem value={'APPROVED'}>Approved</MenuItem>
              <MenuItem value={'REJECTED'}>Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={3}>
          <FormControl fullWidth>
            <InputLabel>Amount</InputLabel>
            <OutlinedInput
              label="Amount"
              type="number"
              value={filters.amount}
              onChange={(e) =>
                handleChange(
                  'amount',
                  Number(e.target.value).toFixed(2).toString()
                )
              }
            />
          </FormControl>
        </Grid>

        <Grid size={3}>
          <FormControl fullWidth>
            <DatePickerField
              label="From"
              value={filters.fromDate}
              onChange={(date) => handleChange('fromDate', date)}
            />
          </FormControl>
        </Grid>

        <Grid size={3}>
          <FormControl fullWidth>
            <DatePickerField
              label="To"
              value={filters.toDate}
              onChange={(date) => handleChange('toDate', date)}
            />
          </FormControl>
        </Grid>

        <Grid size={3}>
          <FormControl fullWidth>
            <InputLabel>Internal Ref</InputLabel>
            <OutlinedInput
              label="Internal Ref"
              value={filters.internalRef}
              onChange={(e) => handleChange('internalRef', e.target.value)}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Stack
        spacing={1}
        sx={{
          height: '100%',
          alignSelf: 'flex-end',
          justifyContent: 'flex-start',
          minWidth: 100,
        }}
      >
        <Button variant="outlined" onClick={reset} sx={{ width: '100%' }}>
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={() => onApply()}
          sx={{ width: '100%' }}
        >
          Apply Filters
        </Button>
      </Stack>
    </Box>
  );
}

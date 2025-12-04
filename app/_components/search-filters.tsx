'use client';

import { Search } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { RequestFilters } from '../_types/request';
import DatePickerField from './date-picker';
type SearchFiltersProps = {
  onSearch: (f: RequestFilters) => void;
};

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [filters, setFilters] = useState<RequestFilters>({
    idNumber: undefined,
    payee: '',
    status: '',
    amountFrom: undefined,
    fromDate: '',
    toDate: '',
    internalRef: '',
  });

  const reset = () => {
    setFilters({
      idNumber: undefined,
      payee: '',
      status: '',
      amountFrom: undefined,
      fromDate: '',
      toDate: '',
      internalRef: '',
    });
  };

  const handleChange = (
    key: keyof RequestFilters,
    value: string | number | null
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const onApply = () => {
    onSearch(filters);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Box>
        <Grid container spacing={2} sx={{ maxWidth: 700 }}>
          <Grid size={12}>
            <FormControl sx={{ mb: 1 }} fullWidth>
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
          <Grid size={12}>
            <FormControl fullWidth>
              <InputLabel>Payee</InputLabel>
              <OutlinedInput
                value={filters.payee}
                onChange={(e) => handleChange('payee', e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={onApply} edge="end" color="primary">
                      <Search />
                    </IconButton>
                  </InputAdornment>
                }
                fullWidth
                sx={{ mb: 2 }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    );
  }

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
              value={filters.idNumber}
              onChange={(e) => handleChange('idNumber', e.target.value)}
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
              value={filters.amountFrom}
              onChange={(e) =>
                handleChange(
                  'amountFrom',
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
              value={filters.fromDate ? dayjs(filters.fromDate) : null}
              onChange={(date) =>
                handleChange('fromDate', date?.toISOString() ?? '')
              }
            />
          </FormControl>
        </Grid>

        <Grid size={3}>
          <FormControl fullWidth>
            <DatePickerField
              label="To"
              value={filters.toDate ? dayjs(filters.toDate) : null}
              onChange={(date) =>
                handleChange('toDate', date?.toISOString() ?? '')
              }
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

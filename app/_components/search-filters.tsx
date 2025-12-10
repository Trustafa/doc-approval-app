'use client';

import { ArrowDownward, ArrowUpward, Search } from '@mui/icons-material';
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
import { RequestFilters, RequestType } from '../_types/request';
import DatePickerField from './date-picker';
type SearchFiltersProps = {
  onSearch: (f: RequestFilters) => void;
  requestType: RequestType;
};

export default function SearchFilters({
  onSearch,
  requestType,
}: SearchFiltersProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<RequestFilters>({
    idNumber: undefined,
    payee: '',
    status: '',
    amountFrom: undefined,
    fromDate: '',
    toDate: '',
    internalRef: '',
    externalRef: '',
    sortBy: '',
    sortOrder: 'asc',
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
      externalRef: '',
      sortBy: '',
      sortOrder: 'asc',
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

  const toggleOrder = () => {
    setSortOrder((prev) => {
      const newOrder = prev === 'asc' ? 'desc' : 'asc';
      handleChange('sortOrder', newOrder);
      return newOrder;
    });
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
        display: 'flex',
        gap: 2,
      }}
    >
      <Grid container spacing={2} sx={{ maxWidth: 900 }}>
        <Grid size={4}>
          <FormControl fullWidth>
            <InputLabel>Payee</InputLabel>
            <OutlinedInput
              label="Payee"
              value={filters.payee}
              onChange={(e) => handleChange('payee', e.target.value)}
            />
          </FormControl>
        </Grid>

        <Grid size={2}>
          <FormControl fullWidth>
            <InputLabel>ID</InputLabel>
            <OutlinedInput
              label="ID"
              value={filters.idNumber}
              onChange={(e) => handleChange('idNumber', e.target.value)}
            />
          </FormControl>
        </Grid>

        <Grid size={2}>
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

        <Grid size={2.5}>
          <Box display="flex" alignItems="center">
            <FormControl fullWidth>
              <InputLabel id="sortLabel">Sort By</InputLabel>
              <Select
                labelId="sortLabel"
                id="sortSelect"
                value={filters.sortBy}
                label="Sort By"
                onChange={(e) => handleChange('sortBy', e.target.value)}
              >
                <MenuItem value={'idNumber'}>ID</MenuItem>
                <MenuItem value={'createdAt'}>Request Date</MenuItem>
                <MenuItem value={'payee'}>Payee</MenuItem>
                <MenuItem value={'amount'}>Amount</MenuItem>
                <MenuItem value={'currency'}>Currency</MenuItem>
                {requestType === 'Sent' ? (
                  [
                    <MenuItem key="externalRef" value={'externalRef'}>
                      External Ref
                    </MenuItem>,
                    <MenuItem key="internalRef" value={'internalRef'}>
                      Internal Ref
                    </MenuItem>,
                  ]
                ) : (
                  <MenuItem value={'requester'}>Requester</MenuItem>
                )}
              </Select>
            </FormControl>
            <IconButton onClick={toggleOrder} size="small">
              {sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
            </IconButton>
          </Box>
        </Grid>

        <Grid size={2}>
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

        <Grid size={2}>
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

        <Grid size={2}>
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

        <Grid size={3}>
          <FormControl fullWidth>
            <InputLabel>External Ref</InputLabel>
            <OutlinedInput
              label="External Ref"
              value={filters.internalRef}
              onChange={(e) => handleChange('externalRef', e.target.value)}
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

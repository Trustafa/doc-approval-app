'use client';

import ApprovalEntry from '@/app/_components/entry-requests-card';
import SearchBar from '@/app/_components/search-bar';
import { RequestResponse } from '@/app/api/_services/request.service';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type RequestsScreenProps = {
  data: RequestResponse[];
  baseRoute: string;
};

export default function MobileRequestsView({
  data,
  baseRoute,
}: RequestsScreenProps) {
  const router = useRouter();

  const [status, setStatus] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  return (
    <Box
      sx={{
        alignContent: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FormControl sx={{ mb: 1 }}>
        <InputLabel id="statusLabel">Status</InputLabel>
        <Select
          labelId="statusLabel"
          id="statusSelect"
          value={status}
          label="Status"
          onChange={handleChange}
        >
          <MenuItem value={'ALL'}>All</MenuItem>
          <MenuItem value={'PENDING'}>Pending</MenuItem>
          <MenuItem value={'APPROVED'}>Approved</MenuItem>
          <MenuItem value={'REJECTED'}>Rejected</MenuItem>
        </Select>
      </FormControl>
      <SearchBar onSearch={() => {}} />
      {data.map((item) => (
        <ApprovalEntry
          key={item.id}
          data={item}
          sx={{ mb: 2 }}
          onClick={() => router.push(`${baseRoute}/${item.id}`)}
          viewOnly
        />
      ))}
    </Box>
  );
}

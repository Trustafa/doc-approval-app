'use client';

import RequestsTable from '@/app/_components/entry-requests-table';
import SearchFilters from '@/app/_components/search-filters';
import { RequestFilters, RequestType } from '@/app/_types/request';
import {
  approveRequest,
  rejectRequest,
} from '@/app/api/_client/approval.client';
import { RequestResponse } from '@/app/api/_services/request.service';
import { Add } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

type RequestsScreenProps = {
  title: string;
  data: RequestResponse[];
  baseRoute: string;
  requestType: RequestType;
  filters: RequestFilters;
  applyFilters: (f: RequestFilters) => void;
  page: number;
  setPage: (page: number) => void;
  canApproveMap: Record<string, boolean>;
};

export async function handleApprove(requestId: string) {
  const res = await approveRequest(requestId);
  if (!res.success) {
    alert('Failed to approve request');
  }

  return res.success;
}

export async function handleReject(requestId: string) {
  const res = await rejectRequest(requestId);
  if (!res.success) {
    alert('Failed to approve request');
  }

  return res.success;
}

export default function DesktopRequestsView({
  title,
  data,
  baseRoute,
  requestType,
  applyFilters,
  canApproveMap,
}: RequestsScreenProps) {
  const router = useRouter();

  const new_request_button = (
    <IconButton
      aria-label="add_request"
      color="inherit"
      onClick={() => router.push('/dashboard/requests/sent/new')}
      sx={{
        backgroundColor: '#1976d2',
        color: 'white',
        width: 48,
        height: 48,
        borderRadius: '50%',
        boxShadow: 2,
        '&:hover': {
          backgroundColor: '#115293',
        },
      }}
    >
      <Add />
    </IconButton>
  );

  return (
    <Box
      sx={{
        alignContent: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Typography variant="h2">{title}</Typography>
        {requestType === 'Sent' && new_request_button}
      </Box>

      <SearchFilters onSearch={applyFilters} />
      <RequestsTable
        data={data}
        baseRoute={baseRoute}
        requestType={requestType}
        canApproveMap={canApproveMap}
      />
    </Box>
  );
}

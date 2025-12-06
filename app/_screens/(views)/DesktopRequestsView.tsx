'use client';

import RequestsTable from '@/app/_components/entry-requests-table';
import SearchFilters from '@/app/_components/search-filters';
import { RequestType } from '@/app/_types/request';
import {
  approveRequest,
  rejectRequest,
} from '@/app/api/_client/approval.client';
import { useRequests } from '@/hooks/RequestsContext';
import { Add } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

type RequestsScreenProps = {
  title: string;
  baseRoute: string;
  requestType: RequestType;
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
  baseRoute,
  requestType,
}: RequestsScreenProps) {
  const router = useRouter();
  const { data, total, page, setPage, setFilters, pageSize } = useRequests();

  const new_request_button = (
    <IconButton
      aria-label="add_request"
      variant="contained"
      onClick={() => router.push('/dashboard/requests/sent/new')}
      sx={{ borderRadius: '50%' }}
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
        sx={{ m: 2 }}
      >
        <Typography variant="h2">{title}</Typography>
        {requestType === 'Sent' && new_request_button}
      </Box>

      <SearchFilters onSearch={setFilters} requestType={requestType} />
      <RequestsTable
        data={data}
        baseRoute={baseRoute}
        requestType={requestType}
        paginationProps={{
          page,
          setPage,
          totalCount: total,
          rowsPerPage: pageSize,
        }}
      />
    </Box>
  );
}

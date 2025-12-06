'use client';

import { RequestEntry } from '@/app/_components/entry-requests-card';
import SearchFilters from '@/app/_components/search-filters';
import { RequestType } from '@/app/_types/request';
import { ApprovalDecision } from '@/generated/prisma/enums';
import { useRequests } from '@/hooks/RequestsContext';
import { usePreviewDialog } from '@/hooks/use-preview-dialog';
import { Add } from '@mui/icons-material';
import { Box, IconButton, Pagination, Paper, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

type RequestsScreenProps = {
  baseRoute: string;
  requestType: RequestType;
};

export default function MobileRequestsView({
  baseRoute,
  requestType,
}: RequestsScreenProps) {
  const router = useRouter();
  const { data, total, page, setPage, setFilters, pageSize } = useRequests();

  const canApprove = (status: ApprovalDecision | null) => {
    if (!status) return false;
    return requestType === 'Received' && status === 'PENDING';
  };
  const { openPreview, dialog } = usePreviewDialog();
  const new_request_button = (
    <IconButton
      aria-label="add_request"
      variant="contained"
      size="large"
      onClick={(e) => {
        e.stopPropagation();
        router.push('/dashboard/requests/sent/new');
      }}
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
      <SearchFilters onSearch={setFilters} requestType={requestType} />
      {data.map((item) => (
        <RequestEntry
          key={item.id}
          data={item}
          sx={{ mb: 2 }}
          onClick={() => router.push(`${baseRoute}/${item.id}`)}
          viewOnly={canApprove(item.status)}
          openPreview={openPreview}
        />
      ))}
      <Stack spacing={2} alignItems="center" mt={2}>
        <Pagination
          count={Math.ceil(total / pageSize)}
          page={page + 1}
          onChange={(_, value) => setPage(value - 1)}
          color="primary"
        />
      </Stack>

      {dialog}
      <Paper sx={{ position: 'fixed', bottom: 20 }}>
        {requestType === 'Sent' && new_request_button}
      </Paper>
    </Box>
  );
}

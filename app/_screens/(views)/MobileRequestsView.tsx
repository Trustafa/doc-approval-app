'use client';

import { RequestEntry } from '@/app/_components/entry-requests-card';
import SearchFilters from '@/app/_components/search-filters';
import { RequestType } from '@/app/_types/request';
import { openPreview } from '@/app/api/_client/file.client';
import { useRequests } from '@/hooks/RequestsContext';
import { Add } from '@mui/icons-material';
import { Box, IconButton, Pagination, Stack } from '@mui/material';
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
        p: 1,
      }}
    >
      <SearchFilters onSearch={setFilters} requestType={requestType} />
      {data.map((item) => (
        <RequestEntry
          key={item.id}
          data={item}
          sx={{ mb: 2 }}
          onClick={() => router.push(`${baseRoute}/${item.id}`)}
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
      <Box sx={{ position: 'fixed', bottom: 10, left: 10 }}>
        {requestType === 'Sent' && new_request_button}
      </Box>
    </Box>
  );
}

'use client';

import ApprovalEntry from '@/app/_components/entry-requests-card';
import SearchFilters from '@/app/_components/search-filters';
import { RequestFilters } from '@/app/_types/request';
import { RequestResponse } from '@/app/api/_services/request.service';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';

type RequestsScreenProps = {
  data: RequestResponse[];
  baseRoute: string;
  filters: RequestFilters;
  applyFilters: (f: RequestFilters) => void;
  page: number;
  setPage: (page: number) => void;
  canApproveMap: Record<string, boolean>;
};

export default function MobileRequestsView({
  data,
  baseRoute,
  applyFilters,
  canApproveMap,
}: RequestsScreenProps) {
  const router = useRouter();

  return (
    <Box
      sx={{
        alignContent: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SearchFilters onSearch={applyFilters} />
      {data.map((item) => (
        <ApprovalEntry
          key={item.id}
          data={item}
          sx={{ mb: 2 }}
          onClick={() => router.push(`${baseRoute}/${item.id}`)}
          viewOnly={!canApproveMap[item.id]}
        />
      ))}
    </Box>
  );
}

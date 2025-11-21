'use client';

import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import ApprovalEntry from '../_components/entry-approval';
import { ApprovalEntryData } from '../dashboard/requests/received/page';

type RequestsScreenProps = {
  title: string;
  data: ApprovalEntryData[];
  baseRoute: string;
  headerAction?: React.ReactNode;
};

export default function RequestsScreen({
  title,
  data,
  baseRoute,
  headerAction,
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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Typography variant="h2">{title}</Typography>
        {headerAction}
      </Box>
      {data.map((item) => (
        <ApprovalEntry
          key={item.id}
          data={item}
          sx={{ mb: 2 }}
          onClick={() => router.push(`${baseRoute}/${item.id}`)}
        />
      ))}
    </Box>
  );
}

'use client';

import { RequestsProvider } from '@/hooks/RequestsContext';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { RequestType } from '../_types/request';
import { getApprovalsForRequest } from '../api/_client/approval.client';
import DesktopRequestsView from './(views)/DesktopRequestsView';
import MobileRequestsView from './(views)/MobileRequestsView';

type RequestsScreenProps = {
  title: string;
  baseRoute: string;
  requestType: RequestType;
};

export async function canApprove(requestId: string) {
  const res = await getApprovalsForRequest(requestId);

  if (!res.success) {
    console.log(`Unable to find approval for request ${requestId}.`);
    return false;
  }

  return res.canApprove;
}

export const rowsPerPage = 5;

export default function RequestsScreen({
  title,
  baseRoute,
  requestType,
}: RequestsScreenProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <RequestsProvider requestType={requestType}>
      <Box>
        {isMobile ? (
          <MobileRequestsView baseRoute={baseRoute} requestType={requestType} />
        ) : (
          <DesktopRequestsView
            title={title}
            baseRoute={baseRoute}
            requestType={requestType}
          />
        )}
      </Box>
    </RequestsProvider>
  );
}

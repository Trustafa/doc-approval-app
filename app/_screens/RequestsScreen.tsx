'use client';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { RequestFilters, RequestType } from '../_types/request';
import { getApprovalsForRequest } from '../api/_client/approval.client';
import { getRequests } from '../api/_client/request.client';
import { RequestResponse } from '../api/_services/request.service';
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

export default function RequestsScreen({
  title,
  baseRoute,
  requestType,
}: RequestsScreenProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [canApproveMap, setCanApproveMap] = useState<Record<string, boolean>>(
    {}
  );
  const [data, setData] = useState<RequestResponse[]>([]);
  const [filters, setFilters] = useState<RequestFilters>({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchRequests() {
      const res = await getRequests(requestType, filters, {
        page,
        pageSize: 20,
      });

      if (!res.success) {
        console.error('Failed to fetch requests', res.status);
        return;
      }

      setData(res.data);

      if (requestType === 'Received') {
        const map: Record<string, boolean> = {};

        await Promise.all(
          res.data.map(async (req) => {
            const approvalRes = await getApprovalsForRequest(req.id);
            map[req.id] = approvalRes.success
              ? (approvalRes.canApprove ?? false)
              : false;
          })
        );

        setCanApproveMap(map);
      }
    }

    fetchRequests();
  }, [requestType, filters, page]);

  return (
    <Box>
      {isMobile ? (
        <MobileRequestsView
          data={data}
          baseRoute={baseRoute}
          filters={filters}
          applyFilters={setFilters}
          page={page}
          setPage={setPage}
          canApproveMap={canApproveMap}
        />
      ) : (
        <DesktopRequestsView
          title={title}
          data={data}
          baseRoute={baseRoute}
          requestType={requestType}
          filters={filters}
          applyFilters={setFilters}
          page={page}
          setPage={setPage}
          canApproveMap={canApproveMap}
        />
      )}
    </Box>
  );
}

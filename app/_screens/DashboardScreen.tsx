'use client';

import { useResponsive } from '@/hooks/use-responsive';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SummaryCard from '../_components/dashboard-summary-card';
import { getDashboardStats } from '../api/_client/request.client';
import { DashboardStats } from '../api/_services/request.service';

type DashboardScreenProps = { data?: string };

export default function DashboardScreen({}: DashboardScreenProps) {
  const { isMobile } = useResponsive();
  const [stats, setStats] = useState<DashboardStats>({
    pendingByMe: 0,
    pendingForMe: 0,
    approvedByMe: 0,
    rejectedByMe: 0,
    totalRequests: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const res = await getDashboardStats();

      if (!res.success || !res.data) {
        console.error('Unable to fetch dashboard stats');
        return;
      }

      setStats(res.data);
    }

    loadStats();
  }, []);

  const cardIconSx = {
    fontSize: 120,
    color: '#e7e7e7',
  };

  return (
    <Box
      sx={{
        alignContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        margin: 2,
        gap: 2,
      }}
    >
      {!isMobile && <Typography variant="h2">Dashboard</Typography>}
      <SummaryCard
        title="Approvals Required"
        caption="Requests that need your approval"
        count={stats.pendingForMe}
        icon={<ErrorOutlineOutlinedIcon sx={cardIconSx} />}
      />
      <SummaryCard
        title="My Pending Requests"
        caption="Requests you submitted that are still pending"
        count={stats.pendingByMe}
        icon={<AccessTimeOutlinedIcon sx={cardIconSx} />}
      />
    </Box>
  );
}

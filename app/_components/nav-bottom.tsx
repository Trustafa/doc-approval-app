'use client';

import {
  Description as DescriptionIcon,
  Home as HomeIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const getValue = () => {
    if (pathname === '/dashboard') return 0;
    if (pathname === '/dashboard/approvals') return 1;
    if (pathname === '/dashboard/requests') return 2;
    return 0;
  };

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={getValue()}
        onChange={(event, newValue) => {
          if (newValue === 0) router.push('/dashboard');
          if (newValue === 1) router.push('/dashboard/approvals');
          if (newValue === 2) router.push('/dashboard/requests');
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Approvals" icon={<DescriptionIcon />} />
        <BottomNavigationAction label="Requests" icon={<SendIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

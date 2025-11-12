'use client';

import {
  Description as DescriptionIcon,
  Home as HomeIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import BottomNav from '../_components/nav-bottom';
import SideNav from '../_components/nav-side';

const drawerWidth = 240;

export default function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const drawer = (
    <SideNav
      items={[
        { text: 'Home', icon: <HomeIcon />, ref: '/dashboard' },
        {
          text: 'Approvals',
          icon: <DescriptionIcon />,
          ref: '/dashboard/approvals',
        },

        { text: 'Requests', icon: <SendIcon />, ref: '/dashboard/requests' },
      ]}
    />
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="sidebar navigation"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {children}
      </Box>
      {isMobile && <BottomNav />}
    </Box>
  );
}

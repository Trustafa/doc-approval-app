'use client';

import {
  Description as DescriptionIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import SideNav from '../_components/nav-side';

const drawerWidth = 240;

const titles: Record<string, string> = {
  '/dashboard': 'Home',
  '/dashboard/requests/received': 'Received Requests',
  '/dashboard/requests/sent': 'Sent Requests',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();
  const pageTitle = titles[pathname] || 'Document Approval';

  const toggleMobileDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawer = (
    <SideNav
      items={[
        { text: 'Home', icon: <HomeIcon />, ref: '/dashboard' },
        {
          text: 'Received Requests',
          icon: <DescriptionIcon />,
          ref: '/dashboard/requests/received',
        },

        {
          text: 'Sent Requests',
          icon: <SendIcon />,
          ref: '/dashboard/requests/sent',
        },
      ]}
    />
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile && (
        <AppBar position="fixed" color="inherit" elevation={0}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleMobileDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">{pageTitle}</Typography>
          </Toolbar>
        </AppBar>
      )}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="sidebar navigation"
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={toggleMobileDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
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
          mt: isMobile ? 8 : 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

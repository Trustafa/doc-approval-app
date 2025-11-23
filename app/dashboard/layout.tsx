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
import { useState } from 'react';
import SideNav from '../_components/nav-side';

const drawerWidth = 240;

export default function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);

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
          children: [
            {
              text: 'All',
              ref: '/dashboard/requests/received',
              icon: <DescriptionIcon />,
            },
            {
              text: 'Pending',
              ref: '/dashboard/requests/received/pending',
              icon: <DescriptionIcon />,
            },
          ],
        },

        {
          text: 'Sent Requests',
          icon: <SendIcon />,
          ref: '/dashboard/requests/sent',
          children: [
            {
              text: 'All',
              ref: '/dashboard/requests/sent',
              icon: <DescriptionIcon />,
            },
            {
              text: 'Pending',
              ref: '/dashboard/requests/sent/pending',
              icon: <DescriptionIcon />,
            },
          ],
        },
      ]}
    />
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile && (
        <AppBar position="fixed" color="transparent" elevation={0}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleMobileDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">Document Approval</Typography>
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

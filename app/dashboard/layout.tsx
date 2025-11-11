'use client';

import {
  Description as DescriptionIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { AppBar, Box, Drawer, IconButton, Toolbar } from '@mui/material';
import { useState } from 'react';
import SideNav from '../components/sidenav';

const drawerWidth = 240;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

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
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'transparent',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { md: 'none' }, color: '#000' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="sidebar navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

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
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 5,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
